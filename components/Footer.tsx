import Wordmark from './Wordmark';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="site-footer">
      <div className="container inner">
        <Wordmark />
        <div className="links">
          <a href="/#library">Library</a>
          <a href="https://revopshq.com" target="_blank" rel="noopener noreferrer">
            revopshq.com
          </a>
        </div>
        <div className="fine">© {year} RevOps HQ · Revenue Systems Architecture</div>
      </div>
    </footer>
  );
}
