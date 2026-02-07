import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { headers } from 'next/headers';

export const metadata = {
  title: `Seth P. Kendall's portfolio Site`,
  description: `A portfolio site to showcase programming work from Seth P Kendall`,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

function Header() {
  return (
    <div className="container mx-auto px-5">
      <section className="flex flex-col items-center mt-12 mb-12 md:mb-8">
        <h1 className="mb-6 mt-2 text-3xl font-bold leading-tight tracking-tight md:text-5xl md:tracking-tighter text-center">
          Seth P. Kendall
        </h1>
        <div className="flex gap-8">
          <Link 
            href="/" 
            className="home-link text-lg md:text-xl font-medium relative px-2 py-1"
          >
            Home
          </Link>
          <Link 
            href="/showcase" 
            className="showcase-link text-lg md:text-xl font-bold relative px-2 py-1"
          >
            Showcase
          </Link>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <div className="container mx-auto px-5">
        <div className="py-12 flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Brand and description */}
          <div className="flex flex-col gap-3 lg:w-1/3">
            <h3 className="text-xl font-bold tracking-tighter leading-tight">
              Seth P. Kendall
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Software developer showcasing app creation range and technical writing. Check out my latest blog posts and interactive demos in the showcase.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Navigate
            </h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Blog Posts
              </Link>
              <Link href="/showcase" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Showcase
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Connect
            </h4>
            <nav className="flex flex-col gap-2 text-sm">
              <a 
                href="https://www.linkedin.com/in/sethpkendall/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/sethpkendall" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://github.com/sethpkendall/spk-portfolio-site" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                View Source
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <section className="min-h-screen">
          <Header />
          <main>{children}</main>
          <Footer />
        </section>
      </body>
    </html>
  );
}
