import Wordmark from './Wordmark';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="site-footer">
      <div className="container inner">
        <Wordmark />
        <div className="links">
          <a href="/#library">White Papers</a>
          <a href="/downloads">Downloads</a>
          <a href="/feed.xml">RSS</a>
          <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">
            revopshq.com
          </a>
        </div>
        <div className="fine">© {year} Revenue Foundations · An independent research project from RevOps HQ</div>
      </div>
    </footer>
  );
}
