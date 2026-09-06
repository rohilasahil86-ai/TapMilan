import { Link } from "react-router-dom";
import HeroScene from "../hero3d/HeroScene";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F5F2EA]">
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          items-center
          px-6
          py-10
          sm:px-8
          lg:min-h-[calc(100vh-80px)]
          lg:grid-cols-[0.95fr_1.05fr]
          lg:gap-2
          lg:px-10
          lg:py-8
        "
      >
        {/* =========================
            LEFT CONTENT
        ========================= */}
        <div className="relative z-20 max-w-2xl">

          {/* BADGE */}
          <div
            className="
              mb-7
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#DCCFB9]
              bg-white/80
              px-4
              py-2
              text-sm
              font-medium
              text-[#8B6B3E]
              backdrop-blur-sm
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-[#B08D57]
                text-white
              "
            >
              ✦
            </span>

            Digital Visiting Card
          </div>

          {/* HEADING */}
          <h1
            className="
              text-5xl
              font-semibold
              leading-[0.98]
              tracking-[-0.055em]
              text-[#171717]
              sm:text-6xl
              lg:text-[72px]
              xl:text-[78px]
            "
          >
            Your business.
            <br />

            <span className="text-[#B08D57]">
              One tap away.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-7
              max-w-xl
              text-lg
              leading-8
              text-[#6B665D]
              sm:text-xl
            "
          >
            Create your premium digital visiting card and share your
            professional identity with one simple link.
          </p>

          {/* BUTTONS */}
          <div className="mt-9 flex flex-wrap gap-4">

            <Link
              to="/signup"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#171717]
                px-7
                py-4
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
              "
            >
              <span className="text-[#D9B77A]">
                ✦
              </span>

              Create Your Card

              <span
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </Link>

            <a
              href="#how-it-works"
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-[#171717]/30
                px-7
                py-4
                text-sm
                font-semibold
                text-[#171717]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
              "
            >
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#171717]/40
                  text-[10px]
                "
              >
                ▶
              </span>

              See How It Works
            </a>

          </div>

          {/* BENEFITS */}
          <div
            className="
              mt-9
              flex
              flex-wrap
              gap-x-7
              gap-y-3
              text-sm
              text-[#6B665D]
            "
          >
            <span className="flex items-center gap-2">
              <span className="text-[#B08D57]">✓</span>
              WhatsApp
            </span>

            <span className="flex items-center gap-2">
              <span className="text-[#B08D57]">✓</span>
              Call
            </span>

            <span className="flex items-center gap-2">
              <span className="text-[#B08D57]">✓</span>
              Location
            </span>

            <span className="flex items-center gap-2">
              <span className="text-[#B08D57]">✓</span>
              Share Anywhere
            </span>
          </div>

        </div>

        {/* =========================
            RIGHT — REAL 3D SCENE
        ========================= */}
        <div
          className="
            relative
            mt-4
            h-[430px]
            w-full
            sm:h-[520px]
            lg:mt-0
            lg:h-[600px]
          "
        >

          {/* Glow behind 3D */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[300px]
              w-[300px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#B08D57]/10
              blur-[90px]
              sm:h-[400px]
              sm:w-[400px]
              lg:h-[450px]
              lg:w-[450px]
            "
          />

          {/* REAL THREE.JS */}
          <div className="absolute inset-0 z-10">
            <HeroScene />
          </div>

        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <a
        href="#why-tapmilan"
        className="
          absolute
          bottom-5
          left-1/2
          hidden
          -translate-x-1/2
          flex-col
          items-center
          text-xs
          text-[#6B665D]
          md:flex
        "
      >
        <span>Scroll Down</span>
        <span className="mt-1 text-lg">↓</span>
      </a>

    </section>
  );
}