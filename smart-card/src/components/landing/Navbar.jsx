import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5DED1]/80 bg-[#F5F2EA]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-semibold tracking-[-0.05em] text-[#171717]"
        >
          TapMilan<span className="text-[#B08D57]">.</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden items-center gap-9 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            How It Works
          </a>

          <a
            href="#pricing"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            Pricing
          </a>

          <a
            href="#faq"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            FAQ
          </a>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="hidden text-sm font-medium text-[#171717] transition-colors duration-300 hover:text-[#B08D57] sm:block"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-full bg-[#171717] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a2a2a] hover:shadow-md"
          >
            Get Started
          </Link>

        </div>

      </div>
    </header>
  );
}