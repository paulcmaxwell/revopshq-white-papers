import { volIssue } from '@/lib/journal';
import type { Paper } from '@/content/papers';

/**
 * A restrained 3D "book" cover for a paper — a journal-issue treatment:
 * paper face, ink type, emerald spine + mark. Uniform across the shelf so the
 * grid reads as a matching series, differentiated by number and title.
 * Presentational + server-safe (pure CSS/HTML; the tilt is CSS-only).
 */
export default function BookCover({ paper }: { paper: Paper }) {
  return (
    <div className="book" aria-hidden="true">
      <div className="book-face">
        <div className="bc-top">
          <span className="bc-no">No.&nbsp;{paper.number}</span>
          <span className="bc-mark" />
        </div>
        <div className="bc-cat">{paper.category}</div>
        <div className="bc-title">{paper.title}</div>
        <div className="bc-foot">
          <span>Revenue&nbsp;Foundations</span>
          <span>{volIssue(paper.date)}</span>
        </div>
      </div>
    </div>
  );
}
