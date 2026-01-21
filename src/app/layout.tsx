import '@/app/ui/global.css';
import { montserrat } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { Header } from './ui/header';
import { Footer } from './ui/footer';

export const metadata: Metadata = {
  title: "Fully Stacked",
  description: "Fully Stacked Homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
