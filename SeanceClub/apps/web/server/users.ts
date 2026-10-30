import { query } from "./db";
import { decideSignup, isValidPseudo } from "./signup";

export type CreateUserInput = {
  email: string;
  pseudo: string;
  birthDate: string;
  consent: boolean;
};

export type CreateUserFailure =
  | "invalid_pseudo"
  | "invalid_birth_date"
  | "consent_required"
  | "too_young"
  | "pseudo_taken"
  | "email_taken";

export type CreateUserResult =
  | { ok: true; userId: string; accountStatus: "active" | "pending_parental" }
  | { ok: false; reason: CreateUserFailure };

const UNIQUE_VIOLATION = "23505";
const RAISE_EXCEPTION = "P0001";

export async function createUser(input: CreateUserInput, today = todayUtc()): Promise<CreateUserResult> {
  const decision = decideSignup({ birthDate: input.birthDate, consent: input.consent, today });
  if (!decision.allowed) return { ok: false, reason: decision.reason };
  if (!isValidPseudo(input.pseudo)) return { ok: false, reason: "invalid_pseudo" };

  try {
    const result = await query<{ id: string }>(
      `INSERT INTO users (email, pseudo, birth_date, consent_at, account_status)
       VALUES ($1, $2, $3, now(), $4)
       RETURNING id`,
      [input.email, input.pseudo, input.birthDate, decision.accountStatus],
    );
    return { ok: true, userId: result.rows[0].id, accountStatus: decision.accountStatus };
  } catch (error) {
    const reason = toFailure(error);
    if (reason) return { ok: false, reason };
    throw error;
  }
}

// Translates the database errors the signup can legitimately trigger.
function toFailure(error: unknown): CreateUserFailure | null {
  if (typeof error !== "object" || error === null) return null;
  const { code, constraint, message } = error as { code?: string; constraint?: string; message?: string };

  if (code === UNIQUE_VIOLATION && constraint === "users_pseudo_key") return "pseudo_taken";
  if (code === UNIQUE_VIOLATION && constraint === "users_email_key") return "email_taken";
  if (code === RAISE_EXCEPTION && message === "too_young") return "too_young";
  return null;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}
