import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://revopshq-white-papers.vercel.app'),
  title: {
    default: 'RevOps HQ — White Papers',
    template: '%s — RevOps HQ',
  },
  description:
    'Field-tested research on revenue systems architecture, HubSpot, and integration design from RevOps HQ.',
  openGraph: {
    title: 'RevOps HQ — White Papers',
    description:
      'Field-tested research on revenue systems architecture, HubSpot, and integration design.',
    type: 'website',
  },
};

// Set the theme before paint to avoid a flash of the wrong palette.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

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
