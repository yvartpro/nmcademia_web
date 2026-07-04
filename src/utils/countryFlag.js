/**
 * Parse stored flag icon string into flag-icons CSS classes.
 *
 * Accepted formats (stored in DB as `flagIcon`):
 *   "fi fi-ng"   — recommended (flag-icons)
 *   "fi-ng"
 *   "ng"
 *   "bi fi" / "ng fi" — code + fi prefix (auto-normalized)
 *
 * Falls back to ISO country `code` when flagIcon is empty.
 */
export function parseFlagClasses(flagIcon, countryCode) {
  const raw = (flagIcon || '').trim().toLowerCase();

  if (raw) {
    const parts = raw.split(/\s+/).filter(Boolean);

    // "fi fi-ng"
    if (parts.length >= 2 && parts[0] === 'fi' && parts[1].startsWith('fi-')) {
      return `fi ${parts[1]}`;
    }

    // "ng fi" or "bi fi" → normalize to fi fi-xx
    if (parts.length >= 2 && parts[1] === 'fi' && /^[a-z]{2}$/.test(parts[0])) {
      return `fi fi-${parts[0]}`;
    }

    // "fi-ng"
    if (parts.length === 1 && parts[0].startsWith('fi-')) {
      return `fi ${parts[0]}`;
    }

    // "ng"
    if (parts.length === 1 && /^[a-z]{2}$/.test(parts[0])) {
      return `fi fi-${parts[0]}`;
    }
  }

  const code = (countryCode || '').trim().toLowerCase();
  if (/^[a-z]{2}$/.test(code)) {
    return `fi fi-${code}`;
  }

  return 'fi fi-xx';
}

/** Normalize user input before saving to DB. */
export function normalizeFlagIcon(flagIcon, countryCode) {
  const parsed = parseFlagClasses(flagIcon, countryCode);
  const match = parsed.match(/fi-(\w+)/);
  if (match) return `fi fi-${match[1]}`;
  return defaultFlagIcon(countryCode);
}

/** Build default flag string from country code (for admin autofill). */
export function defaultFlagIcon(countryCode) {
  const code = (countryCode || '').trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) return '';
  return `fi fi-${code}`;
}

export const FLAG_ICON_EXAMPLE = 'fi fi-ng';
