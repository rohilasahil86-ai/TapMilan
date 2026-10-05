import { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import SEO from "../components/SEO";

import {
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Smartphone,
  UserRound,
  Truck,
  Wifi,
} from "lucide-react";

export default function OrderCard() {
  const [cardType, setCardType] = useState("nfc");
  const [quantity, setQuantity] = useState(1);

  const prices = { nfc: 1499, digital: 699 };
  const price = prices[cardType] * quantity;

  return (
    <>
    <SEO
  title="Order NFC Business Card | TapMilan"
  description="Order your TapMilan NFC business card and share your professional profile instantly with one simple tap."
  path="/order"
/>

    <>
    <Navbar />
    <main className="bg-[#F5F2EA] text-[#171717]">
      <style>{`
        @keyframes orderFloat {
          0%,100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-14px) rotate(-4deg); }
        }
        @keyframes badgeFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes softGlow {
          0%,100% { transform: scale(1); opacity:.35; }
          50% { transform: scale(1.08); opacity:.55; }
        }
        .order-card-float { animation: orderFloat 5s ease-in-out infinite; }
        .order-badge-float { animation: badgeFloat 4.5s ease-in-out infinite; }
        .order-glow { animation: softGlow 5s ease-in-out infinite; }
      `}</style>

      

      {/* HERO */}
      <section className="px-6 pb-16 pt-16 sm:px-8 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCCFB9] bg-white/70 px-4 py-2 text-sm font-medium text-[#8B6B3E]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B08D57] text-white">✦</span>
              Order Your Card
            </div>

            <h1 className="text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-[72px]">
              Your professional
              <br />
              <span className="text-[#B08D57]">identity, in your hand.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#6B665D] sm:text-xl">
              Choose your TapMilan card, enter your delivery details and get
              your digital identity ready for modern networking.
            </p>
          </div>

          {/* PRODUCT VISUAL */}
          <div className="relative flex min-h-[330px] items-center justify-center lg:min-h-[410px]">
            <div className="order-glow absolute h-64 w-64 rounded-full bg-[#B08D57]/20 blur-3xl" />

            <div className="order-card-float relative w-[290px] sm:w-[360px]">
              <div className="relative aspect-[1.58/1] overflow-hidden rounded-[28px] border border-white/10 bg-[#151515] p-7 shadow-[0_30px_70px_rgba(23,23,23,.28)]">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#B08D57]/15 blur-2xl" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xl font-semibold text-white">
                      TapMilan<span className="text-[#D9B77A]">.</span>
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[.3em] text-white/40">
                      Smart Business Card
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B08D57]/40 text-[#D9B77A]">
                    <Wifi size={20} />
                  </div>
                </div>

                <div className="absolute bottom-7 left-7">
                  <p className="mt-1 text-xs text-white/40">Professional Profile</p>
                </div>
              </div>
            </div>

            <div className="order-badge-float absolute left-0 top-[12%] rounded-2xl border border-[#E2D7C4] bg-white px-4 py-3 shadow-xl">
              <p className="text-[10px] text-[#B08D57]">Choose</p>
              <p className="text-sm font-semibold">Your Card</p>
            </div>

            <div className="order-badge-float absolute bottom-[7%] right-0 rounded-2xl border border-[#E2D7C4] bg-white px-4 py-3 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F2EA] text-[#B08D57]">
                  <Truck size={17} />
                </span>
                <div>
                  <p className="text-[10px] text-[#8B6B3E]">Delivery</p>
                  <p className="text-sm font-semibold">Across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER AREA */}
      <section className="border-y border-[#DED7C9] bg-white px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.75fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#B08D57]">Choose your card</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.03em]">Select what you need.</h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <button type="button" onClick={() => setCardType("nfc")}
                className={`relative rounded-[28px] border p-7 text-left transition-all duration-300 hover:-translate-y-1 ${
                  cardType === "nfc" ? "border-[#B08D57] bg-[#F5F2EA] shadow-lg" : "border-[#DED7C9] bg-white hover:border-[#B08D57]/50"
                }`}>
                {cardType === "nfc" && <span className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-[#B08D57] text-white"><Check size={15}/></span>}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171717] text-[#D9B77A]"><Smartphone size={22}/></div>
                <h3 className="mt-6 text-2xl font-semibold">NFC Business Card</h3>
                <p className="mt-3 text-sm leading-6 text-[#6B665D]">Physical NFC card connected to your TapMilan digital profile.</p>
                <p className="mt-6 text-2xl font-semibold">₹1499</p>
                <p className="mt-1 text-xs text-[#6B665D]">One-time card price</p>
              </button>

              <button type="button" onClick={() => setCardType("digital")}
                className={`relative rounded-[28px] border p-7 text-left transition-all duration-300 hover:-translate-y-1 ${
                  cardType === "digital" ? "border-[#B08D57] bg-[#F5F2EA] shadow-lg" : "border-[#DED7C9] bg-white hover:border-[#B08D57]/50"
                }`}>
                {cardType === "digital" && <span className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-[#B08D57] text-white"><Check size={15}/></span>}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-[#B08D57]"><CreditCard size={22}/></div>
                <h3 className="mt-6 text-2xl font-semibold">Digital Card</h3>
                <p className="mt-3 text-sm leading-6 text-[#6B665D]">Create and share your professional digital profile without a physical card.</p>
                <p className="mt-6 text-2xl font-semibold">₹399</p>
                <p className="mt-1 text-xs text-[#6B665D]">One-time setup price</p>
              </button>
            </div>

            <div className="mt-8 rounded-[24px] border border-[#DED7C9] bg-[#F5F2EA] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Quantity</p>
                  <p className="mt-1 text-sm text-[#6B665D]">Order multiple cards for your team or business.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#171717]/20 bg-white text-lg">−</button>
                  <span className="w-6 text-center font-semibold">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#171717]/20 bg-white text-lg">+</button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Digital profile included","WhatsApp & call links","Social media links","Shareable profile URL","QR code support","Professional profile design"].map(feature => (
                <div key={feature} className="flex items-center gap-3 text-sm text-[#6B665D]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F2EA] text-[#B08D57]"><Check size={14}/></span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div>
            <div className="sticky top-8 rounded-[32px] bg-[#171717] p-7 text-white shadow-2xl sm:p-9">
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#D9B77A]">Order Summary</p>
              <h2 className="mt-4 text-3xl font-semibold">Almost there.</h2>
              <div className="my-8 h-px bg-white/10" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{cardType === "nfc" ? "NFC Business Card" : "Digital Business Card"}</p>
                  <p className="mt-1 text-sm text-white/45">Quantity: {quantity}</p>
                </div>
                <p className="font-semibold">₹{price}</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-white/60"><Truck size={17} className="text-[#D9B77A]"/>Delivery available across India</div>
                <div className="flex items-center gap-3 text-sm text-white/60"><UserRound size={17} className="text-[#D9B77A]"/>Professional digital profile</div>
                <div className="flex items-center gap-3 text-sm text-white/60"><MapPin size={17} className="text-[#D9B77A]"/>Enter your delivery address below</div>
              </div>

              <div className="my-8 h-px bg-white/10" />
              <p className="text-sm text-white/50">Total</p>
              <p className="mt-1 text-3xl font-semibold">₹{price}</p>

              <form onSubmit={e => {
                e.preventDefault();
                alert("Order form is ready. Payment and backend will be connected next.");
              }} className="mt-8 space-y-4">
                <input required type="text" placeholder="Full Name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D9B77A]"/>
                <input required type="tel" placeholder="Phone Number" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D9B77A]"/>
                <input required type="email" placeholder="Email Address" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D9B77A]"/>
                <textarea required rows="3" placeholder="Full Delivery Address" className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D9B77A]"/>
                <button type="submit" className="group flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#171717] transition-all duration-300 hover:-translate-y-1">
                  Continue to Order
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1"/>
                </button>
              </form>

              <p className="mt-5 text-center text-xs leading-5 text-white/35">
                Secure payment and order confirmation will be available once the payment system is connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#B08D57]">What happens next</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">From order to connection.</h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              [CreditCard,"Place your order","Select your card and provide your contact and delivery details."],
              [UserRound,"Set up your profile","Add the information you want people to see on your TapMilan profile."],
              [Truck,"Receive your card","Your physical card can then be delivered to your provided address."]
            ].map(([Icon,title,text]) => (
              <div key={title} className="rounded-[28px] border border-[#DED7C9] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-[#B08D57]"><Icon size={21}/></div>
                <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
                <p className="mt-4 leading-7 text-[#6B665D]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-20 sm:px-8 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-5xl rounded-[36px] bg-[#E8E0D1] px-7 py-14 text-center sm:px-12 lg:px-20 lg:py-20">
          <h2 className="text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
            Ready to make your<br/>next connection smarter?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#6B665D]">
            Create your TapMilan profile and turn every introduction into a digital connection.
          </p>
        </div>
      </section>
    </main>

     <Footer />
  </>
  </>
  );
}
