import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Osa Service Portal",
//   description: "A portal for Osa Service",
// };
export const metadata: Metadata = {
  title: "OSA Service Portal | USTP CDO",
  description: "The official Office of Student Affairs (OSA) Service Portal for USTP students. Access student services, tracking, and resources online.",
  keywords: ["USTP", "OSA", "Service Portal", "Cagayan de Oro", "Student Affairs"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-center"/>
        </Providers>
      </body>
    </html>
  );
}
