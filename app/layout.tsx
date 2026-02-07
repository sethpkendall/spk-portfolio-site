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
            className="nav-link text-lg md:text-xl font-medium relative px-2 py-1"
          >
            Home
          </Link>
          <Link 
            href="/showcase" 
            className="nav-link text-lg md:text-xl font-medium relative px-2 py-1"
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
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-xl lg:text-2xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Footer Content
          </h3>
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
