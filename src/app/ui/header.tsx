import Link from "next/link";
//natvigator export so that we can edit that specific document
import {Navigation} from "@/app/ui/nav"

export function Header() {
  return (
    <header className="bg-secondary text-white p-4 {styles.wrapper}">
      <div className="flex justify-between items-center {styles.logo}">
        <Link href="/" className="text-xl font-bold">
          Handcrafted Haven
        </Link>
        <Navigation />
        {/* hamburger menu - will add functionality later */}
        {/* <div itemID="Hamburger_Menu">
        <button className="flex flex-col gap-1.5 p-2">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        </div> */}
      </div>
    </header>
  );
}
