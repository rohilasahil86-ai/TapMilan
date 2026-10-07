import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#171717] text-white">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* =========================
            TOP FOOTER
        ========================== */}

        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:py-20">

          {/* =========================
              BRAND
          ========================== */}

          <div className="max-w-sm">

            <Link
              to="/"
              className="inline-block text-3xl font-semibold tracking-[-0.05em] transition hover:opacity-80"
            >
              TapMilan<span className="text-[#B08D57]">.</span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-white/50">
              Create and share your professional digital business card
              with one simple link. Connect with people instantly through
              TapMilan.
            </p>

            <Link
              to="/order"
              className="mt-7 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#171717] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5F2EA]"
            >
              Get Your Card
              <span className="ml-2 text-[#B08D57]">→</span>
            </Link>

          </div>


          {/* =========================
              PRODUCT
          ========================== */}

          <div>

            <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[#B08D57]">
              Product
            </p>

            <div className="space-y-3 text-sm text-white/55">

              <Link
                to="/digital-business-card"
                className="block transition hover:text-white"
              >
                Digital Business Card
              </Link>

              <Link
                to="/nfc-business-card"
                className="block transition hover:text-white"
              >
                NFC Business Card
              </Link>

              <Link
                to="/order"
                className="block transition hover:text-white"
              >
                Order Your Card
              </Link>

              <Link
                to="/#features"
                className="block transition hover:text-white"
              >
                Features
              </Link>

              <Link
                to="/#how-it-works"
                className="block transition hover:text-white"
              >
                How It Works
              </Link>

            </div>

          </div>


          {/* =========================
              EXPLORE
          ========================== */}

          <div>

            <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[#B08D57]">
              Explore
            </p>

            <div className="space-y-3 text-sm text-white/55">

              <Link
                to="/"
                className="block transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/#pricing"
                className="block transition hover:text-white"
              >
                Pricing
              </Link>

              <Link
                to="/#faq"
                className="block transition hover:text-white"
              >
                FAQ
              </Link>

              <Link
                to="/#about"
                className="block transition hover:text-white"
              >
                About TapMilan
              </Link>

              <Link
                to="/#contact"
                className="block transition hover:text-white"
              >
                Contact
              </Link>

            </div>

          </div>


          {/* =========================
              ACCOUNT
          ========================== */}

          <div>

            <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[#B08D57]">
              Account
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

            </div>

          </div>


          {/* =========================
              CONNECT
          ========================== */}

          <div>

            <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[#B08D57]">
              Connect
            </p>

            <div className="space-y-3 text-sm text-white/55">

              {/* PHONE */}

              <a
                href="tel:+918607118678"
                className="group flex items-center gap-2 transition hover:text-white"
              >
                <span>+91 86071 18678</span>

                <span className="text-xs text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[#B08D57]">
                  ↗
                </span>
              </a>


              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/tapmilan_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 transition hover:text-white"
              >
                <span>Instagram</span>

                <span className="text-xs text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[#B08D57]">
                  ↗
                </span>
              </a>


              {/* FACEBOOK */}

              <a
                href="https://www.facebook.com/profile.php?id=61594823235630"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 transition hover:text-white"
              >
                <span>Facebook</span>

                <span className="text-xs text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[#B08D57]">
                  ↗
                </span>
              </a>


              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/company/tapmilan/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 transition hover:text-white"
              >
                <span>LinkedIn</span>

                <span className="text-xs text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[#B08D57]">
                  ↗
                </span>
              </a>

            </div>

          </div>

        </div>


        {/* =========================
            BOTTOM FOOTER
        ========================== */}

        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">

          {/* COPYRIGHT */}

          <p className="text-xs text-white/35">
            © {currentYear} TapMilan. All rights reserved.
          </p>


          {/* BOTTOM LINKS */}

          <div className="flex flex-wrap items-center gap-5">

            <Link
              to="/"
              className="text-xs text-white/35 transition hover:text-white/70"
            >
              Digital Identity
            </Link>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <a
              href="tel:+918607118678"
              className="text-xs text-white/35 transition hover:text-white/70"
            >
              +91 86071 18678
            </a>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <a
              href="https://www.instagram.com/tapmilan_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/35 transition hover:text-white/70"
            >
              Instagram
            </a>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <a
              href="https://www.linkedin.com/company/tapmilan/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/35 transition hover:text-white/70"
            >
              LinkedIn
            </a>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <p className="text-xs text-white/35">
              One tap. One connection.
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}