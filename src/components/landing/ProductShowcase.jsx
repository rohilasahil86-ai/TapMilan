import heroImage from "../../assets/hero.png";

export default function ProductShowcase() {
  return (
    <section className="overflow-hidden bg-[#F5F2EA]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* HEADER */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
              Meet Your Digital Identity
            </p>

            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#171717] sm:text-5xl">
              One profile.
              <br />
              <span className="text-[#B08D57]">
                Endless connections.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-8 text-[#6B665D] lg:justify-self-end">
            Everything your customer needs to know about you — beautifully
            organised in one professional digital profile.
          </p>

        </div>

        {/* SHOWCASE */}
        <div className="mt-16 overflow-hidden rounded-[32px] bg-[#171717]">

          <div className="grid items-center lg:grid-cols-[0.8fr_1.2fr]">

            {/* LEFT CONTENT */}
            <div className="p-8 sm:p-12 lg:p-16">

              <div className="mb-10 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-[#D5B477]">
                Your TapMilan Profile
              </div>

              <h3 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                Your professional identity,
                <span className="text-[#D5B477]">
                  {" "}always ready to share.
                </span>
              </h3>

              <p className="mt-6 max-w-md text-base leading-7 text-white/55">
                Give your customers a simple way to discover your business,
                connect with you and save your contact details.
              </p>

              {/* MINI FEATURES */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">

                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-white">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Instant conversations
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-white">
                    Save Contact
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    One tap to save
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-white">
                    Social Links
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    All in one place
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-white">
                    QR Ready
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Share anywhere
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT VISUAL */}
            <div className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-[#211f1b] p-8 sm:min-h-[560px]">

              {/* Decorative circles */}
              <div className="absolute h-[380px] w-[380px] rounded-full border border-[#B08D57]/20" />
              <div className="absolute h-[280px] w-[280px] rounded-full border border-[#B08D57]/15" />

              {/* Image */}
              <img
                src={heroImage}
                alt="TapMilan digital business card"
                className="relative z-10 w-full max-w-[620px] object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.35)]"
              />

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}