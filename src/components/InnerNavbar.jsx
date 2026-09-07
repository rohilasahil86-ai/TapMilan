import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function InnerNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5DED1]/80 bg-[#F5F2EA]/90 backdrop-blur-xl">
      
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* =========================
            LOGO
        ========================== */}

        <Link
          to="/"
          className="text-2xl font-semibold tracking-[-0.05em] text-[#171717]"
        >
          TapMilan<span className="text-[#B08D57]">.</span>
        </Link>


        {/* =========================
            MAIN NAVIGATION
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
            ACCOUNT ACTIONS
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
            className="group inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#292929] hover:shadow-md"
          >
            Get Started

            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

        </div>


        {/* =========================
            MOBILE ACTIONS
        ========================== */}

        <div className="flex items-center gap-3 md:hidden">

          <Link
            to="/login"
            className="text-sm font-medium text-[#171717]"
          >
            Login
          </Link>

          <Link
            to="/order"
            className="rounded-full bg-[#171717] px-4 py-2.5 text-sm font-medium text-white"
          >
            Order
          </Link>

        </div>

      </div>

    </header>
  );
}