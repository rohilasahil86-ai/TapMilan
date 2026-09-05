const businesses = [
  {
    number: "01",
    title: "Real Estate",
    text: "Property dealers, agents & brokers",
  },
  {
    number: "02",
    title: "Doctors & Clinics",
    text: "Doctors, consultants & healthcare professionals",
  },
  {
    number: "03",
    title: "Consultants",
    text: "CA, lawyers, insurance & business consultants",
  },
  {
    number: "04",
    title: "Salons & Beauty",
    text: "Salon owners, makeup artists & beauty professionals",
  },
  {
    number: "05",
    title: "Creators & Freelancers",
    text: "Photographers, designers, coaches & creators",
  },
  {
    number: "06",
    title: "Local Businesses",
    text: "Shop owners, service providers & entrepreneurs",
  },
];

export default function WhoIsItFor() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
              Built For Business
            </p>

            <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#171717] sm:text-5xl">
              Wherever you do business,
              <br />
              <span className="text-[#B08D57]">
                TapMilan fits in.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-[#6B665D]">
            Whether you meet clients in an office, shop, clinic or on
            the go — your professional identity is always ready to share.
          </p>

        </div>

        {/* BUSINESS GRID */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {businesses.map((business) => (
            <div
              key={business.number}
              className="group relative min-h-[220px] overflow-hidden rounded-3xl border border-[#E5DED1] bg-[#F5F2EA] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-[#171717] hover:shadow-xl lg:p-8"
            >

              {/* TOP */}
              <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-[#B08D57]">
                  {business.number}
                </span>

                <span className="text-xl text-[#B08D57] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#D5B477]">
                  ↗
                </span>

              </div>

              {/* CONTENT */}
              <div className="absolute bottom-8 left-8 right-8">

                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#171717] transition-colors duration-300 group-hover:text-white">
                  {business.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6B665D] transition-colors duration-300 group-hover:text-white/55">
                  {business.text}
                </p>

              </div>

              {/* HOVER ACCENT */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#B08D57] transition-all duration-500 group-hover:w-full" />

            </div>
          ))}

        </div>

        {/* BOTTOM */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[#E5DED1] pt-8 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-[#6B665D]">
            Built for professionals who want to be remembered.
          </p>

          <span className="text-sm font-medium text-[#B08D57]">
            Your business deserves better.
          </span>

        </div>

      </div>
    </section>
  );
}