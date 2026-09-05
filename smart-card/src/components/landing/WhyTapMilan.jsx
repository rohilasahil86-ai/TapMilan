export default function WhyTapMilan() {
  const points = [
    {
      number: "01",
      title: "Always Updated",
      text: "Your phone number, WhatsApp, social links or business details change? Update them anytime without printing a new card.",
    },
    {
      number: "02",
      title: "One Link. Everything.",
      text: "Give people one professional link to access your WhatsApp, Call, Location, Website, Socials and contact details.",
    },
    {
      number: "03",
      title: "Built for Modern Business",
      text: "Stop handing out paper cards that get lost. Give your customers a digital identity they can access anytime.",
    },
  ];

  return (
    <section
      id="why-tapmilan"
      className="border-t border-[#E5DED1] bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* TOP */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
              Why TapMilan
            </p>

            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#171717] sm:text-5xl">
              Your business card
              <br />
              should do more.
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-[#6B665D] lg:pb-1">
            A traditional visiting card gives people your details.
            TapMilan gives them a way to connect with your business —
            instantly.
          </p>

        </div>

        {/* CARDS */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-[#E5DED1] bg-[#E5DED1] md:grid-cols-3">

          {points.map((point) => (
            <div
              key={point.number}
              className="group bg-white p-8 transition duration-300 hover:bg-[#F5F2EA] lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-[#B08D57]">
                  {point.number}
                </span>

                <span className="text-2xl text-[#B08D57] transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </div>

              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.03em] text-[#171717]">
                {point.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#6B665D]">
                {point.text}
              </p>
            </div>
          ))}

        </div>

        {/* BOTTOM STATEMENT */}
        <div className="mt-20 border-t border-[#E5DED1] pt-10">
          <p className="max-w-4xl text-2xl font-medium leading-relaxed tracking-[-0.02em] text-[#171717] sm:text-3xl">
            One professional identity.
            <span className="text-[#B08D57]">
              {" "}Everywhere you do business.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}