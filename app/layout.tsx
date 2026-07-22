import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://revenuefoundations.com'),
  title: {
    default: 'Revenue Foundations — A Journal of Revenue Systems & Operations',
    template: '%s — Revenue Foundations',
  },
  description:
    'Field research and applied analysis for revenue operators: revenue systems architecture, attribution and measurement, and the trade-offs behind how modern revenue teams actually run. An independent research project funded by RevOps HQ.',
  openGraph: {
    title: 'Revenue Foundations — A Journal of Revenue Systems & Operations',
    description:
      'Field research and applied analysis for revenue operators. An independent research project funded by RevOps HQ.',
    type: 'website',
  },
};

// Set the theme before paint to avoid a flash of the wrong palette.
// Default to light unless the visitor explicitly chose dark. Do not follow the
// OS preference — the journal reads as a light publication by default.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="page">
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
        {/* HubSpot tracking (portal 21204085) */}
        <Script
          id="hs-script-loader"
          strategy="afterInteractive"
          src="//js.hs-scripts.com/21204085.js"
        />
      </body>
    </html>
  );
}
