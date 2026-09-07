import { Link } from "react-router-dom";
import InnerNavbar from "../components/InnerNavbar";
import Footer from "../components/landing/Footer";
import SEO from "../components/SEO";

export default function DigitalBusinessCard() {
  return (
    <>

    <SEO
  title="Digital Business Card | TapMilan"
  description="Create a professional digital business card with TapMilan and share your profile, contact details and social links instantly."
  path="/digital-business-card"
/>

     <>
      <InnerNavbar />

    <main className="min-h-screen bg-[#F5F2EA] text-[#171717]">

      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#DCCFB9] bg-white/70 px-4 py-2 text-sm font-medium text-[#8B6B3E]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B08D57] text-white">
                ✦
              </span>

              Digital Business Card
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[72px]">
              Your professional identity.
              <br />
              <span className="text-[#B08D57]">
                One tap away.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#6B665D] sm:text-xl">
              Create a digital business card that makes it easy to share
              your contact details, social profiles and business information
              anywhere.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-[#D9B77A]">✦</span>
                Create Your Card
                <span>→</span>
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-3 rounded-full border border-[#171717]/30 px-7 py-4 text-sm font-semibold transition hover:-translate-y-1 hover:bg-white"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* RIGHT CARD PREVIEW */}
          <div className="relative flex justify-center lg:justify-end">

            <div className="absolute h-[350px] w-[350px] rounded-full bg-[#B08D57]/10 blur-[90px]" />

            <div className="relative w-full max-w-[390px] overflow-hidden rounded-[32px] bg-[#171717] p-8 text-white shadow-2xl">

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#D9B77A]">
                  TapMilan
                </span>

                <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                  Digital Card
                </span>
              </div>

              <div className="mt-14">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F2EA] text-3xl text-[#B08D57]">
                  T
                </div>

                <h2 className="text-3xl font-semibold">
                  Your Name
                </h2>

                <p className="mt-2 text-[#D9B77A]">
                  Business Professional
                </p>

                <p className="mt-5 text-sm leading-6 text-white/60">
                  Your professional profile, contact details and
                  business links in one simple digital card.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <div className="text-lg">☎</div>
                  <span className="mt-2 block text-xs text-white/70">
                    Call
                  </span>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <div className="text-lg">◉</div>
                  <span className="mt-2 block text-xs text-white/70">
                    WhatsApp
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =========================
          INTRO
      ========================== */}
      <section className="bg-white px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B08D57]">
            Why Digital
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            A smarter way to share your business.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6B665D]">
            Traditional visiting cards are easy to lose and difficult to
            update. TapMilan gives you one digital identity that can be
            shared whenever you meet someone.
          </p>

        </div>
      </section>


      {/* =========================
          FEATURES
      ========================== */}
      <section className="bg-[#F5F2EA] px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B08D57]">
              Features
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything your business card needs.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* CARD 1 */}
            <div className="rounded-[28px] border border-[#DED5C7] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-xl">
                👤
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Professional Profile
              </h3>

              <p className="mt-3 leading-7 text-[#6B665D]">
                Present your name, profession, company and contact
                information in one clean profile.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="rounded-[28px] border border-[#DED5C7] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-xl">
                🔗
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                All Your Links
              </h3>

              <p className="mt-3 leading-7 text-[#6B665D]">
                Keep your social media, website and important business
                links together in one place.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="rounded-[28px] border border-[#DED5C7] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-xl">
                ⚡
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Instant Sharing
              </h3>

              <p className="mt-3 leading-7 text-[#6B665D]">
                Share your digital card through a simple link or QR
                code whenever you meet a new contact.
              </p>
            </div>

            {/* CARD 4 */}
            <div className="rounded-[28px] border border-[#DED5C7] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-xl">
                💬
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                WhatsApp & Call
              </h3>

              <p className="mt-3 leading-7 text-[#6B665D]">
                Let people contact you directly from your digital
                business card.
              </p>
            </div>

            {/* CARD 5 */}
            <div className="rounded-[28px] border border-[#DED5C7] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-xl">
                📍
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Business Location
              </h3>

              <p className="mt-3 leading-7 text-[#6B665D]">
                Help customers and contacts find your business
                location quickly.
              </p>
            </div>

            {/* CARD 6 */}
            <div className="rounded-[28px] border border-[#DED5C7] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-xl">
                🔄
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Easy to Update
              </h3>

              <p className="mt-3 leading-7 text-[#6B665D]">
                Update your information without printing a new
                visiting card every time something changes.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section className="bg-white px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B08D57]">
              Simple Process
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Create your card in three steps.
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <div className="rounded-[28px] bg-[#F5F2EA] p-8">
              <span className="text-5xl font-semibold text-[#B08D57]">
                01
              </span>

              <h3 className="mt-8 text-2xl font-semibold">
                Create Your Profile
              </h3>

              <p className="mt-4 leading-7 text-[#6B665D]">
                Add your professional information, contact details
                and social links.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#F5F2EA] p-8">
              <span className="text-5xl font-semibold text-[#B08D57]">
                02
              </span>

              <h3 className="mt-8 text-2xl font-semibold">
                Get Your Digital Card
              </h3>

              <p className="mt-4 leading-7 text-[#6B665D]">
                Your information becomes a professional digital
                business card that you can share anywhere.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#F5F2EA] p-8">
              <span className="text-5xl font-semibold text-[#B08D57]">
                03
              </span>

              <h3 className="mt-8 text-2xl font-semibold">
                Share Everywhere
              </h3>

              <p className="mt-4 leading-7 text-[#6B665D]">
                Share your card using your link or QR code and let
                people connect with you instantly.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================
          CTA
      ========================== */}
      <section className="bg-[#171717] px-6 py-24 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D9B77A]">
            Start Today
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Make your first impression digital.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Create your TapMilan digital business card and share
            your professional identity with anyone, anywhere.
          </p>

          <div className="mt-9">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#171717] transition hover:-translate-y-1"
            >
              Create Your Card
              <span>→</span>
            </Link>
          </div>

        </div>
      </section>

    </main>
    <Footer />
    </>
    </>
  );
}