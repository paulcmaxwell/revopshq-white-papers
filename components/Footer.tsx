import Wordmark from './Wordmark';
import { JOURNAL } from '@/lib/journal';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container inner">
        <Wordmark />
        <div className="links">
          <a href="/#issue">Current Issue</a>
          <a href="/#series">Series</a>
          <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">
            revopshq.com
          </a>
        </div>
        <div className="fine">
          {JOURNAL.name} · {JOURNAL.subtitle} · A {JOURNAL.publisher} property · © 2026
        </div>
      </div>
    </footer>
  );
}
