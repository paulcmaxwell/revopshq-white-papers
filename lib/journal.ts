// ============================================================
// Journal apparatus — Revenue Foundations.
//
// The property is framed as an academic-style journal, not a white-paper
// library. Volume = year (Vol. I = 2026), Issue = month (No. 07 = July). Every
// article is typed and carries a citation line + identifier — the credibility
// signal that makes it shareable inside a prospect's org.
// ============================================================

export const JOURNAL = {
  name: 'Revenue Foundations',
  subtitle: 'White papers & research for revenue operators',
  blurb: 'Field research and applied analysis for revenue operators.',
  publisher: 'RevOps HQ',
  issn: 'RF', // identifier prefix, not a registered ISSN
} as const;

// White Paper is deliberately kept as one *format*, not the brand.
export type ArticleType =
  | 'Research Article'
  | 'Comparative Review'
  | 'White Paper'
  | 'Reference'
  | 'Field Note'
  | 'Case Study';

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const VOLUME_ONE_YEAR = 2026; // 2026 = Volume I

function parts(dateIso: string) {
  const [y, m] = dateIso.split('-').map(Number);
  return { year: y, month: m };
}

/** Volume as a roman numeral (2026 → "I"). */
export function volume(dateIso: string): string {
  const { year } = parts(dateIso);
  const n = year - VOLUME_ONE_YEAR + 1;
  return ROMAN[n] ?? String(n);
}

/** Issue number, zero-padded to the month ("07"). */
export function issueNo(dateIso: string): string {
  const { month } = parts(dateIso);
  return String(month).padStart(2, '0');
}

export function monthName(dateIso: string): string {
  return MONTHS[parts(dateIso).month - 1] ?? '';
}

/** "July 2026" */
export function issueLabel(dateIso: string): string {
  const { year } = parts(dateIso);
  return `${monthName(dateIso)} ${year}`;
}

/** "Vol. I · No. 07" */
export function volIssue(dateIso: string): string {
  return `Vol. ${volume(dateIso)} · No. ${issueNo(dateIso)}`;
}

/** Stable per-article identifier, e.g. "RF·2026·02". */
export function identifier(dateIso: string, number: string): string {
  return `${JOURNAL.issn}·${parts(dateIso).year}·${number}`;
}

/** Full citation line. */
export function citation(dateIso: string): string {
  return `${JOURNAL.name}, ${volIssue(dateIso)} (${issueLabel(dateIso)})`;
}

/** Group a dated list into issues (year-month), newest first. */
export function groupByIssue<T extends { date: string }>(items: T[]) {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const key = it.date.slice(0, 7); // YYYY-MM
    (map.get(key) ?? map.set(key, []).get(key)!).push(it);
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, list]) => ({ key, date: `${key}-01`, items: list }));
}
