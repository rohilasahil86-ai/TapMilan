import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5DED1]/80 bg-[#F5F2EA]/90 backdrop-blur-xl">

      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* =========================
            LOGO
        ========================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-semibold tracking-[-0.05em] text-[#171717]"
        >
          TapMilan<span className="text-[#B08D57]">.</span>
        </Link>


        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <nav className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            Home
          </Link>

          <Link
            to="/digital-business-card"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            Digital Card
          </Link>

          <Link
            to="/nfc-business-card"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            NFC Card
          </Link>

          <Link
            to="/order"
            className="text-sm font-medium text-[#6B665D] transition-colors duration-300 hover:text-[#171717]"
          >
            Order
          </Link>

        </nav>


        {/* =========================
            DESKTOP ACTIONS
        ========================== */}

        <div className="hidden items-center gap-5 md:flex">

          <Link
            to="/login"
            className="text-sm font-medium text-[#171717] transition-colors duration-300 hover:text-[#B08D57]"
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


        {/* =========================
            MOBILE BUTTON
        ========================== */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#171717]/15 text-[#171717] transition hover:bg-white md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

      </div>


      {/* =========================
          MOBILE MENU
      ========================== */}

      <div
        className={`
          overflow-hidden border-t border-[#E5DED1]/70 bg-[#F5F2EA]
          transition-all duration-300 md:hidden
          ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >

        <nav className="mx-auto flex max-w-7xl flex-col px-6 py-5">

          <Link
            to="/"
            onClick={closeMenu}
            className="border-b border-[#171717]/10 py-4 text-sm font-medium text-[#171717]"
          >
            Home
          </Link>

          <Link
            to="/digital-business-card"
            onClick={closeMenu}
            className="border-b border-[#171717]/10 py-4 text-sm font-medium text-[#171717]"
          >
            Digital Business Card
          </Link>

          <Link
            to="/nfc-business-card"
            onClick={closeMenu}
            className="border-b border-[#171717]/10 py-4 text-sm font-medium text-[#171717]"
          >
            NFC Business Card
          </Link>

          <Link
            to="/order"
            onClick={closeMenu}
            className="border-b border-[#171717]/10 py-4 text-sm font-medium text-[#171717]"
          >
            Order Your Card
          </Link>


          <div className="flex items-center gap-4 pt-5">

            <Link
              to="/login"
              onClick={closeMenu}
              className="flex-1 rounded-full border border-[#171717]/20 px-5 py-3 text-center text-sm font-medium text-[#171717]"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={closeMenu}
              className="flex-1 rounded-full bg-[#171717] px-5 py-3 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>

          </div>

        </nav>

      </div>

    </header>
  );
}