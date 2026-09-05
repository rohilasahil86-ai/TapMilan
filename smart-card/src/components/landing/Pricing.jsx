import { Link } from "react-router-dom";

export default function Pricing() {
  const whatsappNumber = "YOUR_WHATSAPP_NUMBER";

  const whatsappMessage = encodeURIComponent(
    "Hi TapMilan, I want to get my digital visiting card."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="pricing"
      className="bg-[#F5F2EA]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
            Simple Pricing
          </p>

          <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#171717] sm:text-5xl">
            One simple card.
            <br />
            <span className="text-[#B08D57]">
              No complicated plans.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#6B665D]">
            Get your professional digital visiting card and start
            sharing your business with the people who matter.
          </p>

        </div>

        {/* PRICE CARD */}
        <div className="mx-auto mt-16 max-w-md">

          <div className="relative overflow-hidden rounded-[32px] border border-[#DCCFB9] bg-white p-8 shadow-[0_25px_70px_rgba(23,23,23,0.08)] sm:p-10">

            {/* POPULAR BADGE */}
            <div className="absolute right-6 top-6 rounded-full bg-[#171717] px-3 py-1.5 text-xs font-medium text-white">
              Launch Offer
            </div>

            {/* PLAN */}
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#B08D57]">
              TapMilan Digital Card
            </p>

            <div className="mt-7 flex items-end gap-2">

              <span className="text-6xl font-semibold tracking-[-0.06em] text-[#171717]">
                ₹999
              </span>

              <span className="mb-2 text-sm text-[#6B665D]">
                Per Year
              </span>

            </div>

            <p className="mt-4 text-sm leading-6 text-[#6B665D]">
              Everything you need to create and share your
              professional digital identity.
            </p>

            {/* FEATURES */}
            <div className="mt-8 space-y-4 border-t border-[#E5DED1] pt-7">

              {[
                "Premium digital profile",
                "WhatsApp & Call buttons",
                "Save Contact",
                "Social media links",
                "Business location",
                "QR code",
                "Shareable profile link",
                "Update your details anytime",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-[#171717]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B08D57]/10 text-xs text-[#B08D57]">
                    ✓
                  </span>

                  {feature}
                </div>
              ))}

            </div>

            {/* CTA */}
            <div className="mt-9 grid gap-3">

              <Link
                to="/signup"
                className="flex items-center justify-center rounded-full bg-[#171717] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Create Your Card
                <span className="ml-2 text-[#D5B477]">
                  →
                </span>
              </Link>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-full border border-[#D8CFBF] px-6 py-4 text-sm font-semibold text-[#171717] transition-all duration-300 hover:bg-[#F5F2EA]"
              >
                Get Your Card on WhatsApp
              </a>

            </div>

            <p className="mt-5 text-center text-xs text-[#6B665D]">
              No complicated setup. Get started in minutes.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}