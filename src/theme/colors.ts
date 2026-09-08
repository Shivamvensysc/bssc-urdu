/**
 * Shared color tokens.
 *
 * These are the ONLY source of truth for the hex values used across the
 * app. They are re-exported here (rather than only living in
 * tailwind.config.js) because several components — like
 * RegistrationForm.tsx — need the raw hex string for inline `style={{}}`
 * props (conditional colors that Tailwind utility classes can't express
 * cleanly, e.g. `color: activeSection === s.id ? INK : "#fff"`).
 *
 * If you change a value here, update the matching entry in
 * `tailwind.config.js` (theme.extend.colors) so Tailwind utility classes
 * (e.g. `text-ink`, `bg-paper`) and these JS constants never drift apart.
 */

export const INK = "#12233F";
export const INK_SOFT = "#5B6B84";
export const PAPER = "#F4F5F2";
export const CARD = "#FFFFFF";
export const LINE = "#DBDFE6";
export const OCHRE = "#B9722E";
export const OCHRE_DEEP = "#8F5522";
export const TEAL = "#1E6F5C";
export const DANGER = "#B3432B";