import Link from "next/link";

export function Header() {
  return (
    <header className="bg-secondary text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Handcrafted Haven
        </Link>

        {/* hamburger menu - will add functionality later */}
        <div itemID="Hamburger_Menu">
        <button className="flex flex-col gap-1.5 p-2">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        </div>
      </div>
    </header>
  );
}
