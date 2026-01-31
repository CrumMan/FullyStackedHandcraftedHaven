import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary text-white mt-auto">

      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold mb-3">
            Handcrafted Haven
          </h2>
          <p className="text-sm opacity-90">
            Discover unique handmade products crafted by talented artisans
            around the world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>

          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>

            <Link href="/products" className="hover:underline">
              Products
            </Link>

            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>

          <p className="text-sm">support@handcraftedhaven.com</p>
          <p className="text-sm mt-1">+1 (555) 123-4567</p>

          <p className="text-sm mt-3 opacity-80">
            Crafted to support artisans and celebrate handmade excellence.
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 text-center text-sm py-4 opacity-90">
        © {new Date().getFullYear()} Handcrafted Haven. All rights reserved.
      </div>

    </footer>
  );
}
