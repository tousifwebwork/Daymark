import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Daymark",
  description: "A personal daily progress tracker.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-dvh`}>
        <Header />
        <main className="mx-auto w-full max-w-3xl px-4 pb-36 pt-6">{children}</main>
      </body>
    </html>
  );
}