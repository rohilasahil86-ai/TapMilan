import { useState } from "react";

const faqs = [
  {
    question: "What is TapMilan?",
    answer:
      "TapMilan is a digital visiting card that gives you one professional profile to share with your customers, clients and contacts.",
  },
  {
    question: "Do I need to install an app?",
    answer:
      "No. Your TapMilan profile opens directly in a web browser. Your customers don't need to install anything.",
  },
  {
    question: "Can I update my details later?",
    answer:
      "Yes. You can update your business details, contact information, social links and other profile information whenever you need.",
  },
  {
    question: "How do customers access my card?",
    answer:
      "You can share your TapMilan link or QR code. If you have a physical TapMilan card, customers can also tap or scan it to open your profile.",
  },
  {
    question: "Can customers save my contact?",
    answer:
      "Yes. Your profile includes a Save Contact option so customers can quickly save your business details to their phone.",
  },
  {
    question: "Who can use TapMilan?",
    answer:
      "TapMilan is designed for professionals, business owners, consultants, doctors, real estate agents, creators, freelancers and local businesses.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-white"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 lg:py-32">

        {/* HEADER */}
        <div className="text-center">

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
            FAQ
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-5xl">
            Questions?
            <br />
            <span className="text-[#B08D57]">
              We've got answers.
            </span>
          </h2>

        </div>

        {/* FAQ LIST */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-[#E5DED1]">

          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-[#E5DED1] last:border-b-0"
              >

                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition-colors duration-300 hover:bg-[#F5F2EA] sm:px-8"
                >

                  <div className="flex items-center gap-5">

                    <span className="text-xs font-medium text-[#B08D57]">
                      0{index + 1}
                    </span>

                    <span className="text-base font-medium text-[#171717] sm:text-lg">
                      {faq.question}
                    </span>

                  </div>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D8CFBF] text-lg text-[#171717] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>

                </button>

                {/* ANSWER */}
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">

                    <p className="px-6 pb-7 pl-[4.4rem] text-sm leading-7 text-[#6B665D] sm:px-8 sm:pb-8 sm:pl-[5.2rem] sm:text-base">
                      {faq.answer}
                    </p>

                  </div>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}