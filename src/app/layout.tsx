import "@/app/ui/global.css";
import { montserrat } from "@/app/ui/fonts";
import { Metadata } from "next";
import { Header } from "./ui/header";
import { Footer } from "./ui/footer";

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "Discover unique handmade products from talented artisans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
