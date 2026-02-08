import { Inter } from "next/font/google"; // Font styles from google
import "./globals.css";
import Header from "@/components/Header";
import {ClerkProvider} from '@clerk/nextjs'
import { Toaster } from "sonner";

const inter =Inter({subsets:["latin"]})

export const metadata = {
  title: "Monex",
  description: "Money Exchange Expense Execution Expert",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`  }>
          <Header/>
          <main className="min-h-screen">{children}</main>
          <Toaster/>
          <footer className="bg-black/90">
              <div className="container mx-auto py-5 text-center text-white ">
                <p><span className="text-orange-400">Mon</span>ey <span className="text-orange-400">Ex</span>change <span className="text-orange-400">Ex</span>pense <span className="text-orange-400">Ex</span>ecution <span className="text-orange-400">Ex</span>pert✨</p>
              </div>
          </footer>
        </body>
    </html>
    </ClerkProvider>
  );
}

// main - search engines knows where to look for the main content 
// min-h-screen height 100vh
// container - responsiveness
// bg-black/90 (intensity or opacity) bg-blue-50
// mx-auto equal space on both sides 