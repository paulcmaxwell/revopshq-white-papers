import Wordmark from './Wordmark';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  return (
    <header className="site-header">
      <div className="container bar">
        <Wordmark />
        <nav>
          <div className="nav-links">
            <a href="/#library">White Papers</a>
            <a href="/#case-studies">Case Studies</a>
            <a href="/tools">Tools</a>
            <a href="/downloads">Downloads</a>
            <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">
              RevOps HQ
            </a>
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
