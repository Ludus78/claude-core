import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { query } from "./db";

export type RequestConsentResult =
  | { ok: true; token: string }
  | { ok: false; reason: "invalid_parent_email" | "not_eligible" };

export type ApproveConsentResult = { ok: true } | { ok: false; reason: "invalid_or_expired" };

const parentEmailSchema = z.email();

// Creates the parental consent request of a `pending_parental` account.
// Returns the raw token to put in the confirmation link sent to the parent;
// only its hash is stored. Never send this token back to the member's browser:
// it would let a minor approve their own account.
// Any earlier pending request of the member is expired.
export async function requestParentalConsent(userId: string, parentEmail: string): Promise<RequestConsentResult> {
  const parsed = parentEmailSchema.safeParse(parentEmail);
  if (!parsed.success) return { ok: false, reason: "invalid_parent_email" };

  const token = randomBytes(32).toString("hex");

  // The parent address must differ from the member's own address. Both columns are citext,
  // so $2 is cast to citext to keep the comparison case-insensitive.
  const result = await query<{ id: string }>(
    `WITH target AS (
       SELECT u.id FROM users u
       WHERE u.id = $1 AND u.account_status = 'pending_parental' AND u.email <> $2::citext
     ),
     expired AS (
       UPDATE parental_consents SET status = 'expired'
       WHERE user_id IN (SELECT id FROM target) AND status = 'pending'
     )
     INSERT INTO parental_consents (user_id, parent_email, method, token_hash)
     SELECT id, $2::citext, 'email_link', $3 FROM target
     RETURNING id`,
    [userId, parsed.data, hashToken(token)],
  );

  if (result.rows.length === 0) return { ok: false, reason: "not_eligible" };
  return { ok: true, token };
}

// Approves the request matching the token and activates the account, in a single statement.
// A token works once: only a 'pending', unexpired request can be approved.
export async function approveParentalConsent(token: string): Promise<ApproveConsentResult> {
  const result = await query<{ id: string }>(
    `WITH approved AS (
       UPDATE parental_consents pc
       SET status = 'approved', decided_at = now(), document_ref = NULL
       FROM users u
       WHERE pc.token_hash = $1 AND pc.status = 'pending' AND pc.expires_at > now()
         AND u.id = pc.user_id AND u.account_status = 'pending_parental'
       RETURNING pc.user_id
     )
     UPDATE users SET account_status = 'active'
     WHERE id IN (SELECT user_id FROM approved)
     RETURNING id`,
    [hashToken(token)],
  );

  return result.rows.length === 0 ? { ok: false, reason: "invalid_or_expired" } : { ok: true };
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
