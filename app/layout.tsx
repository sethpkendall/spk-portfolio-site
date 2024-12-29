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
      <section className="flex-col md:flex-row flex items-center md:justify-between mt-12 mb-12 md:mb-8">
        <Link href="/">
          <h1 className="mb-3 mt-2 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
            Seth P. Kendall
          </h1>
        </Link>
        <Link href="/project/meal-planner">meal planner</Link>
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
