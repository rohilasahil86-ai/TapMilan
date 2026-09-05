import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#171717] text-white">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* TOP */}
        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:py-20">

          {/* BRAND */}
          <div className="max-w-sm">

            <Link
              to="/"
              className="text-3xl font-semibold tracking-[-0.05em]"
            >
              TapMilan<span className="text-[#B08D57]">.</span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-white/50">
              Your professional digital visiting card.
              One simple link to connect your business with
              the people who matter.
            </p>

          </div>

          {/* PRODUCT */}
          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[#B08D57]">
              Product
            </p>

            <div className="space-y-3 text-sm text-white/55">

              <a
                href="#features"
                className="block transition hover:text-white"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="block transition hover:text-white"
              >
                How It Works
              </a>

              <a
                href="#pricing"
                className="block transition hover:text-white"
              >
                Pricing
              </a>

              <a
                href="#faq"
                className="block transition hover:text-white"
              >
                FAQ
              </a>

            </div>
          </div>

          {/* GET STARTED */}
          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[#B08D57]">
              Get Started
            </p>

            <div className="space-y-3 text-sm text-white/55">

              <Link
                to="/signup"
                className="block transition hover:text-white"
              >
                Create Your Card
              </Link>

              <Link
                to="/login"
                className="block transition hover:text-white"
              >
                Login
              </Link>

              <a
                href="#pricing"
                className="block transition hover:text-white"
              >
                Get Your Card
              </a>

            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-white/35">
            © {currentYear} TapMilan. All rights reserved.
          </p>

          <p className="text-xs text-white/35">
            Digital identity, made simple.
          </p>

        </div>

      </div>

    </footer>
  );
}