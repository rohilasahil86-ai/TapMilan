const features = [
  {
    number: "01",
    title: "Digital Profile",
    description:
      "Your complete professional identity in one beautiful, shareable profile.",
    icon: "↗",
  },
  {
    number: "02",
    title: "WhatsApp & Call",
    description:
      "Let customers connect with you instantly through WhatsApp or a direct call.",
    icon: "⌁",
  },
  {
    number: "03",
    title: "Save Contact",
    description:
      "Make it easy for customers to save your business details directly to their phone.",
    icon: "＋",
  },
  {
    number: "04",
    title: "Social Presence",
    description:
      "Bring your Instagram, LinkedIn, Facebook, YouTube and other profiles together.",
    icon: "◎",
  },
  {
    number: "05",
    title: "Location",
    description:
      "Help customers find your office, shop, clinic or business with one tap.",
    icon: "⌖",
  },
  {
    number: "06",
    title: "QR & Smart Sharing",
    description:
      "Share your TapMilan profile anywhere through a QR code or a simple link.",
    icon: "⌘",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-[#F5F2EA]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* HEADER */}
        <div className="max-w-3xl">

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
            Everything in one place
          </p>

          <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#171717] sm:text-5xl">
            More than a visiting card.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B665D]">
            TapMilan brings the important parts of your professional
            identity together — so your customers always know how to
            connect with you.
          </p>

        </div>

        {/* FEATURES GRID */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.number}
              className="group relative min-h-[270px] overflow-hidden rounded-3xl border border-[#E5DED1] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(23,23,23,0.08)] lg:p-8"
            >

              {/* TOP */}
              <div className="flex items-start justify-between">

                <span className="text-sm font-medium text-[#B08D57]">
                  {feature.number}
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5DED1] text-xl text-[#B08D57] transition-all duration-300 group-hover:border-[#B08D57] group-hover:bg-[#B08D57] group-hover:text-white">
                  {feature.icon}
                </div>

              </div>

              {/* CONTENT */}
              <div className="mt-20">

                <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#171717]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#6B665D]">
                  {feature.description}
                </p>

              </div>

              {/* HOVER LINE */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#B08D57] transition-all duration-500 group-hover:w-full" />

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}