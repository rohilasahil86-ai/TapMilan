import { Link } from "react-router-dom";
import SEO from "../components/SEO";

import {
  ArrowRight,
  Check,
  Smartphone,
  Wifi,
  Share2,
  Zap,
} from "lucide-react";

import Footer from "../components/landing/Footer";

export default function NFCBusinessCard() {
  return (
    <>
    <SEO
  title="NFC Business Card | TapMilan"
  description="Share your professional profile with a TapMilan NFC business card. One tap connects people to your digital identity."
  path="/nfc-business-card"
/>
    <>
      <main className="min-h-screen overflow-hidden bg-[#F5F2EA] text-[#171717]">

        {/* =========================
            TOP NAVBAR
        ========================== */}

        <nav className="sticky top-0 z-50 border-b border-[#E5E0D7] bg-[#F5F2EA]/90 px-6 py-5 backdrop-blur-xl sm:px-10 lg:px-20">
          <div className="mx-auto flex max-w-6xl items-center justify-between">

            <Link
              to="/"
              className="text-2xl font-semibold tracking-tight text-[#171717] transition-opacity duration-300 hover:opacity-75"
            >
              TapMilan<span className="text-[#B08D57]">.</span>
            </Link>

            <Link
              to="/order"
              className="group inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Order Card

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </nav>


        {/* =========================
            HERO
        ========================== */}

        <section className="relative px-6 pb-20 pt-16 sm:px-10 lg:px-20 lg:pb-24 lg:pt-20">

          <div className="pointer-events-none absolute right-[-120px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[#B08D57]/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">

            {/* LEFT */}

            <div className="animate-fade-up">

              <span className="inline-flex items-center gap-2 rounded-full border border-[#DCCFB9] bg-white px-4 py-2 text-sm font-medium text-[#8B6B3E]">
                <Wifi size={15} />
                NFC Business Card
              </span>

              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Your business.
                <br />
                <span className="text-[#B08D57]">
                  One simple tap.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#6B665D] sm:text-lg">
                Share your professional profile, contact details and social
                connections instantly with a TapMilan NFC business card.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/order"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#171717] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Order NFC Card

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center rounded-full border border-[#171717]/20 bg-white/60 px-7 py-4 text-sm font-semibold transition duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  Back to Home
                </Link>

              </div>

              {/* TRUST POINTS */}

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#6B665D]">

                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#B08D57]" />
                  Instant sharing
                </span>

                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#B08D57]" />
                  No app required
                </span>

                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#B08D57]" />
                  Compatible phones
                </span>

              </div>

            </div>


            {/* RIGHT — CARD VISUAL */}

            <div className="relative flex min-h-[390px] items-center justify-center">

              <div className="absolute h-64 w-64 animate-pulse rounded-full bg-[#B08D57]/20 blur-3xl" />

              {/* Profile bubble */}

              <div className="absolute right-0 top-10 z-20 animate-float-slow rounded-2xl border border-white/70 bg-white px-4 py-3 shadow-xl">

                <div className="text-xs text-[#8B6B3E]">
                  Share
                </div>

                <div className="font-semibold">
                  Your Profile
                </div>

              </div>


              {/* NFC CARD */}

              <div className="group relative z-10 h-[260px] w-[410px] max-w-[85vw] rotate-[-5deg] rounded-[28px] bg-[#151515] p-7 text-white shadow-[0_35px_80px_rgba(0,0,0,0.28)] transition-all duration-700 hover:rotate-0 hover:scale-[1.02]">

                {/* Shine */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
                  <div className="absolute -left-20 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl animate-shine" />
                </div>

                <div className="relative flex h-full flex-col justify-between">

                  <div className="flex items-start justify-between">

                    <div>

                      <div className="text-2xl font-semibold tracking-tight">
                        TapMilan<span className="text-[#B08D57]">.</span>
                      </div>

                      <div className="mt-1 text-xs uppercase tracking-[0.25em] text-white/40">
                        Smart Business Card
                      </div>

                    </div>

                    <div className="rounded-full border border-[#B08D57]/40 p-3">
                      <Wifi
                        size={23}
                        className="text-[#B08D57]"
                      />
                    </div>

                  </div>

                  <div>

                    <div className="text-xl font-medium">
                      Your Name
                    </div>

                    <div className="mt-1 text-sm text-white/45">
                      Entrepreneur • Professional
                    </div>

                  </div>

                </div>

              </div>


              {/* PHONE BUBBLE */}

              <div className="absolute bottom-8 left-0 z-20 flex animate-float items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl">

                <div className="rounded-xl bg-[#F5F2EA] p-2">
                  <Smartphone
                    size={19}
                    className="text-[#B08D57]"
                  />
                </div>

                <div>

                  <div className="text-xs text-[#8B6B3E]">
                    Just tap
                  </div>

                  <div className="font-semibold">
                    Connect instantly
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            HOW IT WORKS
        ========================== */}

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-20">

          <div className="mx-auto max-w-6xl">

            <div className="max-w-xl">

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B08D57]">
                Simple process
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                How NFC sharing works
              </h2>

            </div>


            <div className="mt-10 grid gap-5 md:grid-cols-3">

              {/* 01 */}

              <div className="group rounded-3xl border border-[#E8E3DA] bg-[#FAF9F6] p-6 transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-[#B08D57]">
                    01
                  </span>

                  <Smartphone
                    size={22}
                    className="text-[#B08D57] transition-transform duration-300 group-hover:scale-110"
                  />

                </div>

                <h3 className="mt-7 text-xl font-semibold">
                  Get your card
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6B665D]">
                  Order your TapMilan NFC business card.
                </p>

              </div>


              {/* 02 */}

              <div className="group rounded-3xl border border-[#E8E3DA] bg-[#FAF9F6] p-6 transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-[#B08D57]">
                    02
                  </span>

                  <Wifi
                    size={22}
                    className="text-[#B08D57] transition-transform duration-300 group-hover:scale-110"
                  />

                </div>

                <h3 className="mt-7 text-xl font-semibold">
                  Tap the card
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6B665D]">
                  Bring the card close to a compatible smartphone.
                </p>

              </div>


              {/* 03 */}

              <div className="group rounded-3xl border border-[#E8E3DA] bg-[#FAF9F6] p-6 transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-[#B08D57]">
                    03
                  </span>

                  <Share2
                    size={22}
                    className="text-[#B08D57] transition-transform duration-300 group-hover:scale-110"
                  />

                </div>

                <h3 className="mt-7 text-xl font-semibold">
                  Share your profile
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6B665D]">
                  Your digital profile opens for the person you're meeting.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            BENEFITS
        ========================== */}

        <section className="bg-[#F5F2EA] px-6 py-20 sm:px-10 lg:px-20">

          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">

            {/* DARK */}

            <div className="relative overflow-hidden rounded-[32px] bg-[#171717] p-8 text-white sm:p-10">

              <div className="absolute right-[-60px] top-[-60px] h-48 w-48 rounded-full bg-[#B08D57]/20 blur-3xl" />

              <div className="relative">

                <div className="flex items-center gap-3 text-[#B08D57]">

                  <Zap size={19} />

                  <span className="text-sm font-semibold">
                    Smart connection
                  </span>

                </div>

                <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
                  One card.
                  <br />
                  Everything you need to connect.
                </h2>

                <p className="mt-5 max-w-lg leading-7 text-white/55">
                  Give people instant access to your contact information,
                  WhatsApp, social profiles, website and professional identity.
                </p>

              </div>

            </div>


            {/* LIGHT */}

            <div className="rounded-[32px] bg-white p-8 sm:p-10">

              <h2 className="text-3xl font-semibold">
                Built for modern professionals.
              </h2>

              <div className="mt-7 space-y-4">

                {[
                  "Entrepreneurs & business owners",
                  "Sales & networking professionals",
                  "Creators & independent professionals",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >

                    <div className="mt-1 rounded-full bg-[#F5F2EA] p-1.5">
                      <Check
                        size={14}
                        className="text-[#B08D57]"
                      />
                    </div>

                    <span className="text-[#5F5A52]">
                      {item}
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            CTA
        ========================== */}

        <section className="relative overflow-hidden bg-[#B08D57] px-6 py-20 text-center text-white sm:px-10">

          <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Make the connection smarter
            </span>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Your next introduction starts with a tap.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-white/75">
              Get your TapMilan NFC business card and turn every introduction
              into a digital connection.
            </p>

            <Link
              to="/order"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#171717] px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Order Your NFC Card

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </section>

      </main>


      {/* =========================
          SAME FOOTER
      ========================== */}

      <Footer />
    </>
    </>
  );
}