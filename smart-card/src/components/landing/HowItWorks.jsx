export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Card",
      text: "Sign up and add your name, business, contact details and professional information.",
    },
    {
      number: "02",
      title: "Make It Yours",
      text: "Create your professional digital profile and keep your business identity ready to share.",
    },
    {
      number: "03",
      title: "Share & Connect",
      text: "Share your TapMilan link or QR code. Customers can instantly connect with your business.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-[#171717] text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

        {/* HEADER */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
              How It Works
            </p>

            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              From introduction
              <br />
              to connection.
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-8 text-white/60 lg:justify-self-end">
            Getting started takes only a few minutes. Create your
            profile once and keep one professional identity ready
            wherever you do business.
          </p>

        </div>

        {/* STEPS */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative min-h-[330px] bg-[#171717] p-8 transition duration-500 hover:bg-[#211f1b] lg:p-10"
            >

              {/* NUMBER */}
              <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-[#B08D57]">
                  {step.number}
                </span>

                {index < steps.length - 1 && (
                  <span className="hidden text-xl text-white/20 md:block">
                    →
                  </span>
                )}

              </div>

              {/* ICON */}
              <div className="mt-14 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#B08D57]/30 bg-[#B08D57]/10 text-xl text-[#D5B477] transition duration-300 group-hover:scale-105 group-hover:bg-[#B08D57] group-hover:text-white">
                {index === 0 && "✦"}
                {index === 1 && "◈"}
                {index === 2 && "↗"}
              </div>

              {/* CONTENT */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                  {step.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                  {step.text}
                </p>
              </div>

              {/* BOTTOM LINE */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#B08D57] transition-all duration-500 group-hover:w-full" />

            </div>
          ))}

        </div>

        {/* BOTTOM MESSAGE */}
        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-white/45">
            No complicated setup. No technical knowledge required.
          </p>

          <span className="text-sm font-medium text-[#B08D57]">
            Simple by design.
          </span>

        </div>

      </div>
    </section>
  );
}