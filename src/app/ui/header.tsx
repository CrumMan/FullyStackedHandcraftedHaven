import Link from "next/link";
import  Navigation  from "@/app/ui/nav";
export function Header() {
  
  return (
    <header className="bg-secondary text-white p-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-xl font-bold">
          Handcrafted Haven
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
