// Single source of truth for Ms Pat's WhatsApp contact + page-aware prefills.
// Used by the floating button, the sticky mobile bar, and inline CTAs so every
// WhatsApp tap lands in chat with a message already typed and tailored to the page.

export const WHATSAPP_NUMBER = '6583898853';

// Most-specific first — the first matching rule wins.
const CONTEXT_RULES: { test: (p: string) => boolean; type: string }[] = [
  { test: (p) => p.includes('adult-piano'), type: 'adult piano lessons' },
  { test: (p) => p.includes('adult-violin'), type: 'adult violin lessons' },
  { test: (p) => p.includes('childrens-piano') || p.includes('piano-lessons-for-beginners'), type: 'piano lessons for my child' },
  { test: (p) => p.includes('childrens-violin'), type: 'violin lessons for my child' },
  { test: (p) => p.includes('abrsm-piano'), type: 'ABRSM piano lessons' },
  { test: (p) => p.includes('abrsm-violin'), type: 'ABRSM violin lessons' },
  { test: (p) => p.includes('music-theory'), type: 'music theory lessons' },
  { test: (p) => p.includes('dsa-piano'), type: 'DSA piano lessons' },
  { test: (p) => p.includes('graded-piano'), type: 'graded piano lessons' },
  { test: (p) => p.includes('music-lessons-for-children') || p.includes('lessons-for-children'), type: 'music lessons for my child' },
  { test: (p) => p.includes('piano-lessons') || p.includes('piano-teacher'), type: 'piano lessons' },
  { test: (p) => p.includes('violin-lessons') || p.includes('violin-teacher'), type: 'violin lessons' },
];

/** Returns the lesson type phrase for a given page path. Defaults to generic music lessons. */
export function getWhatsAppLessonType(pathname: string): string {
  const p = pathname.toLowerCase();
  for (const rule of CONTEXT_RULES) {
    if (rule.test(p)) return rule.type;
  }
  return 'music lessons';
}

/** Builds the full prefill message for a page, e.g. "Hi Ms Pat, I'd like to enquire about adult piano lessons." */
export function getWhatsAppMessage(pathname: string): string {
  return `Hi Ms Pat, I'd like to enquire about ${getWhatsAppLessonType(pathname)}.`;
}

/**
 * Builds a wa.me deep link with an encoded prefill.
 * Pass `override` to set a bespoke message; otherwise it's derived from the path.
 * NOTE: keep the host as `wa.me` on a plain anchor — the GTM "Whatsapp Click"
 * conversion fires on Click URL containing "wa.me".
 */
export function buildWhatsAppUrl(pathname: string, override?: string): string {
  const message = override ?? getWhatsAppMessage(pathname);
  return `https://${WHATSAPP_NUMBER ? `wa.me/${WHATSAPP_NUMBER}` : 'wa.me'}?text=${encodeURIComponent(message)}`;
}
