import { Link } from "react-router-dom";

export default function FinalCTA() {
  const whatsappNumber = "YOUR_WHATSAPP_NUMBER";

  const whatsappMessage = encodeURIComponent(
    "Hi TapMilan, I want to get my digital visiting card."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="bg-white px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">

        <div className="relative overflow-hidden rounded-[36px] bg-[#171717] px-7 py-20 text-center sm:px-12 lg:px-20 lg:py-28">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#B08D57]/20" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full border border-[#B08D57]/15" />

          {/* Small accent */}
          <div className="relative z-10 mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-[#B08D57]/40 bg-[#B08D57]/10 text-xl text-[#D5B477]">
            ✦
          </div>

          {/* Heading */}
          <p className="relative z-10 text-sm font-medium uppercase tracking-[0.18em] text-[#D5B477]">
            Ready to go digital?
          </p>

          <h2 className="relative z-10 mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Make your next introduction
            <span className="text-[#D5B477]">
              {" "}memorable.
            </span>
          </h2>

          <p className="relative z-10 mx-auto mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
            Create your TapMilan digital visiting card and give your
            customers one simple way to connect with you.
          </p>

          {/* CTA */}
          <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              to="/signup"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#171717] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
            >
              Create Your Card
              <span className="text-[#B08D57] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
            >
              Talk to Us on WhatsApp
            </a>

          </div>

          {/* Bottom line */}
          <div className="relative z-10 mx-auto mt-12 max-w-md border-t border-white/10 pt-6">
            <p className="text-xs text-white/35">
              One professional identity. One simple link. One TapMilan.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}