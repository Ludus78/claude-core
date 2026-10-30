export const MIN_SIGNUP_AGE = 13;
export const PARENTAL_CONSENT_UNDER_AGE = 15;

export type SignupDecision =
  | { allowed: true; accountStatus: "active" | "pending_parental" }
  | { allowed: false; reason: "invalid_birth_date" | "consent_required" | "too_young" };

const BIRTH_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// Age in full years on `today`, both as YYYY-MM-DD. Returns null for an invalid or future date.
export function ageOn(birthDate: string, today: string): number | null {
  const birth = parseDate(birthDate);
  const now = parseDate(today);
  if (!birth || !now) return null;

  let age = now.year - birth.year;
  if (now.month < birth.month || (now.month === birth.month && now.day < birth.day)) {
    age -= 1;
  }
  return age < 0 ? null : age;
}

export function decideSignup(input: { birthDate: string; consent: boolean; today: string }): SignupDecision {
  const age = ageOn(input.birthDate, input.today);
  if (age === null) return { allowed: false, reason: "invalid_birth_date" };
  if (!input.consent) return { allowed: false, reason: "consent_required" };
  if (age < MIN_SIGNUP_AGE) return { allowed: false, reason: "too_young" };
  if (age < PARENTAL_CONSENT_UNDER_AGE) return { allowed: true, accountStatus: "pending_parental" };
  return { allowed: true, accountStatus: "active" };
}

function parseDate(value: string): { year: number; month: number; day: number } | null {
  const match = BIRTH_DATE_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  const valid =
    check.getUTCFullYear() === year && check.getUTCMonth() === month - 1 && check.getUTCDate() === day;

  return valid ? { year, month, day } : null;
}
