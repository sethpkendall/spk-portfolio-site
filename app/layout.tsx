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
  const headersList = headers();
  // read the custom x-url header
  // NOTE - this is a hacky way to get the current URL AND it makes SSR not work
  // More information here: https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
  const header_url = headersList.get('x-url') || "";
  const header_JS_url = new URL(header_url)

  return (
    <div className="container mx-auto px-5">
      <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
        { header_JS_url.pathname === "/" &&
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
          Seth P. Kendall
        </h1>
        }
        { header_JS_url.pathname !== "/" &&
          <h2 className="mb-20 mt-8 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            .
          </h2>
        }
        <a href="/project/meal-planner">meal planner</a>
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
            It's not a bug, it's a feature.
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
