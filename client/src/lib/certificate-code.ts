/**
 * ELYSE DEV — verification-code normalisation (client side).
 *
 * Mirrors `server/src/services/certificate.service.ts` so a code typed into a
 * URL resolves to the same record on both sides. Kept deliberately small and
 * dependency-free: it only reshapes text, it never decides whether a code is
 * valid — the API does that.
 */

/** No 0/O, 1/I/L, 2/Z, 5/S, 8/B. */
export const CODE_ALPHABET = "ACDEFGHJKMNPQRTUVWXY346789";

const GROUP_LENGTH = 4;
const GROUPS = 2;

export function normaliseCode(input: string): string {
  const trimmed = input.trim().toUpperCase();
  const cleaned = trimmed.replace(/[^A-Z0-9]/g, "");
  const body = (cleaned.startsWith("EDA") ? cleaned.slice(3) : cleaned).trim();
  const isCodeBody =
    body.length === GROUP_LENGTH * GROUPS &&
    [...body].every((character) => CODE_ALPHABET.includes(character));
  if (!isCodeBody) return trimmed;
  return `EDA-${body.slice(0, GROUP_LENGTH)}-${body.slice(GROUP_LENGTH)}`;
}
