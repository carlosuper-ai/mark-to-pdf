/** Generates a cryptographically random RFC-4122 UUID v4. */
export const uid = (): string => crypto.randomUUID();
