import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function PublicProfile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const profileViewTracked = useRef(false);

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
  async function fetchProfile() {
    setLoading(true);
    setError("");

    if (!username) {
      setError("Profile not found");
      setLoading(false);
      return;
    }

    const cleanUsername = username.trim();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", cleanUsername)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("PROFILE FETCH ERROR:", error);
      setError("Profile not found");
      setLoading(false);
      return;
    }

    if (!data) {
      setError("Profile not found");
      setLoading(false);
      return;
    }

    setProfile(data);

    // Track profile view
    if (!profileViewTracked.current) {
      profileViewTracked.current = true;

      const { error: analyticsError } = await supabase
        .from("analytics_events")
        .insert({
          profile_id: data.id,
          event_type: "profile_view",
        });

      if (analyticsError) {
        console.error(
          "PROFILE VIEW ANALYTICS ERROR:",
          analyticsError
        );
      }
    }

    setLoading(false);
  }

  fetchProfile();
}, [username]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F2EA] text-[#171717]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#E5DED1] border-t-[#B08D57]" />

          <p className="text-sm text-[#6B665D]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PROFILE NOT FOUND
  // =========================

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F2EA] px-6 text-[#171717]">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B08D57]">
            TapMilan
          </p>

          <h1 className="mt-4 text-3xl font-semibold">
            Profile Not Found
          </h1>

          <p className="mt-3 text-sm text-[#6B665D]">
            This digital card does not exist or is currently inactive.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // HELPERS
  // =========================

  const externalUrl = (url) => {
    if (!url) return "#";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `https://${url}`;
  };

  const whatsappNumber = profile.whatsapp
    ? profile.whatsapp.replace(/\D/g, "")
    : "";


  // =========================
  // SAVE CONTACT
  // =========================

  const saveContact = () => {
    const escapeVCard = (value = "") => {
      return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    };

    const fullName = escapeVCard(profile.full_name || "");
    const businessName = escapeVCard(profile.business_name || "");
    const designation = escapeVCard(profile.designation || "");
    const phone = profile.phone || "";
    const email = profile.email || "";
    const website = profile.website
      ? externalUrl(profile.website)
      : "";
    const address = escapeVCard(profile.address || "");

    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fullName}`,
      `N:${fullName};;;;`,
      businessName ? `ORG:${businessName}` : "",
      designation ? `TITLE:${designation}` : "",
      phone ? `TEL;TYPE=CELL:${phone}` : "",
      email ? `EMAIL:${email}` : "",
      website ? `URL:${website}` : "",
      address ? `ADR;TYPE=WORK:;;${address};;;;` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([vCard], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.full_name || "contact"}.vcf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-[#F5F2EA] text-[#171717]">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <header className="border-b border-[#E5DED1] bg-[#F5F2EA]/95 backdrop-blur">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-sm font-semibold tracking-tight">
              Tap<span className="text-[#B08D57]">Milan</span>
            </p>
          </div>

          <div className="flex items-center gap-3">

            <span className="hidden text-xs text-[#6B665D] sm:block">
              Digital Business Card
            </span>

            <span className="h-2 w-2 rounded-full bg-[#B08D57]" />

          </div>

        </div>

      </header>


      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative overflow-hidden">

        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#B08D57]/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-[#B08D57]/5 blur-3xl" />


        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">

          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">


            {/* =================================
                HERO CONTENT
            ================================= */}

            <div>

              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#B08D57]">
                Digital Identity
              </p>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
                {profile.full_name}
              </h1>

              {profile.designation && (
                <p className="mt-6 text-xl text-[#6B665D] md:text-2xl">
                  {profile.designation}
                </p>
              )}

              {profile.business_name && (
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
                  {profile.business_name}
                </p>
              )}

              {profile.bio && (
                <p className="mt-8 max-w-xl text-base leading-7 text-[#6B665D]">
                  {profile.bio}
                </p>
              )}


              {/* =================================
                  PRIMARY ACTIONS
              ================================= */}

              <div className="mt-9 flex flex-wrap gap-3">

                {profile.whatsapp && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#171717] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2B2B2B]"
                  >
                    WhatsApp
                  </a>
                )}

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="rounded-full border border-[#171717] px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-[#171717] hover:text-white"
                  >
                    Call
                  </a>
                )}

                {/* SAVE CONTACT */}

                <button
                  type="button"
                  onClick={saveContact}
                  className="rounded-full border border-[#B08D57] bg-white px-6 py-3.5 text-sm font-semibold text-[#171717] transition hover:-translate-y-0.5 hover:bg-[#B08D57] hover:text-white"
                >
                  Save Contact
                </button>

                {/* DIRECTIONS */}

                {profile.maps_url && (
                  <a
                    href={externalUrl(profile.maps_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#B08D57] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#9C7B4A]"
                  >
                    Get Directions
                  </a>
                )}

              </div>

            </div>


            {/* =================================
                PROFILE IMAGE
            ================================= */}

            <div className="flex justify-center lg:justify-end">

              <div className="relative">

                {/* Gold border */}

                <div className="absolute -inset-4 rounded-[2rem] border border-[#B08D57]/30" />

                <div className="relative h-72 w-72 overflow-hidden rounded-[1.75rem] bg-[#171717] shadow-2xl md:h-96 md:w-80">

                  {profile.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt={profile.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">

                      <span className="text-8xl font-semibold text-[#B08D57]">
                        {profile.full_name?.charAt(0)}
                      </span>

                    </div>
                  )}


                  {/* Image bottom overlay */}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">

                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      @{profile.username}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          CONTACT STRIP
      ===================================== */}

      <section className="border-y border-[#E5DED1] bg-white">

        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">


          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="border-b border-[#E5DED1] px-6 py-7 transition hover:bg-[#F5F2EA] lg:border-b-0 lg:border-r"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#B08D57]">
                Contact
              </p>

              <p className="mt-2 font-semibold">
                Call
              </p>
            </a>
          )}


          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="border-b border-[#E5DED1] px-6 py-7 transition hover:bg-[#F5F2EA] lg:border-b-0 lg:border-r"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#B08D57]">
                Email
              </p>

              <p className="mt-2 font-semibold">
                Send Email
              </p>
            </a>
          )}


          {profile.website && (
            <a
              href={externalUrl(profile.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-[#E5DED1] px-6 py-7 transition hover:bg-[#F5F2EA] lg:border-b-0 lg:border-r"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#B08D57]">
                Online
              </p>

              <p className="mt-2 font-semibold">
                Visit Website
              </p>
            </a>
          )}


          {profile.maps_url && (
            <a
              href={externalUrl(profile.maps_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-7 transition hover:bg-[#F5F2EA]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#B08D57]">
                Location
              </p>

              <p className="mt-2 font-semibold">
                Get Directions →
              </p>
            </a>
          )}

        </div>

      </section>


      {/* =====================================
          ABOUT SECTION
      ===================================== */}

      {profile.bio && (
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">

          <div className="grid gap-10 md:grid-cols-[0.35fr_0.65fr]">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B08D57]">
                About
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A little about me
              </h2>

            </div>


            <div>

              <p className="text-lg leading-8 text-[#6B665D]">
                {profile.bio}
              </p>

            </div>

          </div>

        </section>
      )}


      {/* =====================================
          SOCIAL SECTION
      ===================================== */}

      {(profile.instagram ||
        profile.linkedin ||
        profile.facebook ||
        profile.youtube) && (

        <section className="bg-[#171717] text-white">

          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">

            <div className="grid gap-10 md:grid-cols-[0.4fr_0.6fr]">


              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B08D57]">
                  Connect
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  Find me online
                </h2>

              </div>


              <div className="grid gap-3 sm:grid-cols-2">

                {profile.instagram && (
                  <a
                    href={externalUrl(profile.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/10 px-5 py-5 transition hover:border-[#B08D57] hover:bg-white/5"
                  >
                    <p className="text-sm text-white/50">
                      Social
                    </p>

                    <p className="mt-1 font-semibold">
                      Instagram →
                    </p>
                  </a>
                )}


                {profile.linkedin && (
                  <a
                    href={externalUrl(profile.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/10 px-5 py-5 transition hover:border-[#B08D57] hover:bg-white/5"
                  >
                    <p className="text-sm text-white/50">
                      Professional
                    </p>

                    <p className="mt-1 font-semibold">
                      LinkedIn →
                    </p>
                  </a>
                )}


                {profile.facebook && (
                  <a
                    href={externalUrl(profile.facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/10 px-5 py-5 transition hover:border-[#B08D57] hover:bg-white/5"
                  >
                    <p className="text-sm text-white/50">
                      Social
                    </p>

                    <p className="mt-1 font-semibold">
                      Facebook →
                    </p>
                  </a>
                )}


                {profile.youtube && (
                  <a
                    href={externalUrl(profile.youtube)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/10 px-5 py-5 transition hover:border-[#B08D57] hover:bg-white/5"
                  >
                    <p className="text-sm text-white/50">
                      Video
                    </p>

                    <p className="mt-1 font-semibold">
                      YouTube →
                    </p>
                  </a>
                )}

              </div>

            </div>

          </div>

        </section>
      )}


      {/* =====================================
          LOCATION SECTION
      ===================================== */}

      {(profile.address || profile.maps_url) && (

        <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">

          <div className="rounded-[2rem] border border-[#E5DED1] bg-white p-8 md:p-12">

            <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">


              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B08D57]">
                  Visit
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                  Come visit us
                </h2>

                {profile.address && (
                  <p className="mt-4 max-w-xl leading-7 text-[#6B665D]">
                    {profile.address}
                  </p>
                )}

              </div>


              {profile.maps_url && (
                <a
                  href={externalUrl(profile.maps_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#B08D57]"
                >
                  📍 Get Directions
                </a>
              )}

            </div>

          </div>

        </section>

      )}


      {/* =====================================
          FINAL CTA
      ===================================== */}

      <section className="bg-[#171717] px-6 py-16 text-center text-white">

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B08D57]">
          Stay Connected
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          Keep my contact details with you.
        </h2>

        <button
          type="button"
          onClick={saveContact}
          className="mt-7 rounded-full bg-[#B08D57] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9C7B4A]"
        >
          Save Contact
        </button>

      </section>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="border-t border-[#E5DED1] bg-[#F5F2EA]">

        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-sm font-semibold">
            Tap<span className="text-[#B08D57]">Milan</span>
          </p>

          <p className="text-xs text-[#6B665D]">
            Digital presence, beautifully connected.
          </p>

          <p className="text-xs text-[#6B665D]">
            @{profile.username}
          </p>

        </div>

      </footer>

    </main>
  );
}

export default PublicProfile;