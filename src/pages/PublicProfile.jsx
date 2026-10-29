import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import { supabase } from "../lib/supabase";

import SEO from "../components/SEO";



function PublicProfile() {

  const { username } = useParams();



  const [profile, setProfile] = useState(null);

  const [showcaseItems, setShowcaseItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedShowcaseItem, setSelectedShowcaseItem] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(8);
  const [imageLoadErrors, setImageLoadErrors] = useState([]);

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



    const { data: items, error: itemsError } = await supabase

  .from("showcase_items")

  .select("id, title, description, category, price, image_paths")

  .eq("user_id", data.id)

  .eq("is_published", true)

  .order("created_at", { ascending: false });



if (itemsError) {

  console.error("SHOWCASE FETCH ERROR:", itemsError);

} else {

  const itemsWithImages = await Promise.all(

  (items || []).map(async (item) => {

    const paths = Array.isArray(item.image_paths)

      ? item.image_paths

      : [];



    const imageUrls = await Promise.all(

      paths.map(async (path) => {

        const { data, error } = await supabase.storage

          .from("showcase-images")

          .createSignedUrl(path, 3600);



        if (error) {

          console.error("SHOWCASE IMAGE ERROR:", error.message);

          return null;

        }



        return data?.signedUrl || null;

      })

    );



    return {

      ...item,

      imageUrls: imageUrls.filter(Boolean),

    };

  })

);



setShowcaseItems(itemsWithImages);

}



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



  fetchProfile().catch((fetchError) => {
    console.error("PUBLIC PROFILE LOAD ERROR:", fetchError);
    setError("Unable to load this profile. Please refresh and try again.");
    setLoading(false);
  });

}, [username]);

  // Keep the details and image viewers keyboard-accessible.
  useEffect(() => {
    if (!selectedShowcaseItem && !zoomedImage) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleViewerKeyDown(event) {
      if (event.key === "Escape") {
        if (zoomedImage) {
          setZoomedImage(null);
        } else {
          setSelectedShowcaseItem(null);
        }
        return;
      }

      if (zoomedImage?.images?.length > 1) {
        if (event.key === "ArrowRight") {
          setZoomedImage((current) => ({
            ...current,
            index: (current.index + 1) % current.images.length,
          }));
        } else if (event.key === "ArrowLeft") {
          setZoomedImage((current) => ({
            ...current,
            index: (current.index - 1 + current.images.length) % current.images.length,
          }));
        }
        return;
      }

      if (selectedShowcaseItem?.imageUrls?.length > 1) {
        if (event.key === "ArrowRight") {
          setSelectedImageIndex((current) => (current + 1) % selectedShowcaseItem.imageUrls.length);
        } else if (event.key === "ArrowLeft") {
          setSelectedImageIndex((current) => (current - 1 + selectedShowcaseItem.imageUrls.length) % selectedShowcaseItem.imageUrls.length);
        }
      }
    }

    document.addEventListener("keydown", handleViewerKeyDown);
    return () => {
      document.removeEventListener("keydown", handleViewerKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedShowcaseItem, zoomedImage]);

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



  const normalizePhone = (phone = "") => {

    const digits = String(phone).replace(/\D/g, "");



    if (digits.startsWith("91") && digits.length === 12) {

      return `+${digits}`;

    }



    if (digits.length === 10) {

      return `+91${digits}`;

    }



    return "";

  };



  const formatPhone = (phone = "") => {

  const digits = String(phone).replace(/\D/g, "").replace(/^91/, "");



  if (digits.length === 10) {

    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;

  }



  return phone;

};



const whatsappNumber = (() => {

  const digits = String(profile.whatsapp || "").replace(/\D/g, "");



  if (digits.startsWith("91") && digits.length === 12) {

    return digits;

  }



  if (digits.length === 10) {

    return `91${digits}`;

  }



  if (digits.length === 11 && digits.startsWith("0")) {

    return `91${digits.slice(1)}`;

  }



  return digits;

})();





const whatsappMessage = profile.full_name

  ? `Hi, ${profile.full_name}`

  : "Hi";



const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(

  whatsappMessage

)}`;





const emailComposeUrl = profile.email

  ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(

      profile.email

    )}`

  : "#";



// =========================

// SAVE CONTACT

// =========================



  const saveContact = async () => {

    const escapeVCard = (value = "") => {

      return String(value)

        .replace(/\\/g, "\\\\")

        .replace(/\n/g, "\\\n")

        .replace(/,/g, "\\\\,")

        .replace(/;/g, "\\\\;");

    };



    const fullName = escapeVCard(profile.full_name || "");

    const businessName = escapeVCard(profile.business_name || "");

    const designation = escapeVCard(profile.designation || "");



    const normalizedPhone = normalizePhone(profile.phone || "");

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

      normalizedPhone ? `TEL;TYPE=CELL:${normalizedPhone}` : "",

      email ? `EMAIL:${email}` : "",

      website ? `URL:${website}` : "",

      address ? `ADR;TYPE=WORK:;;${address};;;;` : "",

      "END:VCARD",

    ]

      .filter(Boolean)

      .join("\r\n");



    const file = new File(

      [vCard],

      `${profile.full_name || "contact"}.vcf`,

      {

        type: "text/vcard",

      }

    );



    // Mobile/tablet: use the native share sheet when supported.

    if (

      navigator.share &&

      navigator.canShare &&

      navigator.canShare({ files: [file] })

    ) {

      try {

        await navigator.share({

          title: `${profile.full_name || "Contact"} | TapMilan`,

          files: [file],

        });

        return;

      } catch (error) {

        if (error?.name === "AbortError") {

          return;

        }

      }

    }



    // Desktop / fallback: download a real vCard file.

    const url = URL.createObjectURL(file);

    const link = document.createElement("a");



    link.href = url;

    link.download = file.name;



    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);



    URL.revokeObjectURL(url);

  };



  // =========================

  // UI

  // =========================



  return (

    <>

    <SEO

  title={`${profile.full_name} | ${profile.business_name || "TapMilan Digital Business Card"}`}

  description={

    profile.bio

      ? profile.bio.slice(0, 155)

      : `${profile.full_name} - ${profile.designation || "Professional"} | TapMilan Digital Business Card`

  }

/>



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

            {showcaseItems.length > 0 && (
              <a
                href="#business-showcase"
                className="rounded-full border border-[#E5DED1] px-4 py-2 text-xs font-semibold text-[#171717] transition hover:border-[#B08D57] hover:bg-white sm:text-sm"
              >
                Explore
              </a>
            )}

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

                    href={whatsappUrl}

                    target="_blank"

                    rel="noopener noreferrer"

                    className="rounded-full bg-[#171717] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2B2B2B]"

                  >

                    WhatsApp

                  </a>

                )}



                {profile.phone && (

                  <a

                    href={`tel:${normalizePhone(profile.phone)}`}

                    className="rounded-full border border-[#171717] px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-[#171717] hover:text-white"

                  >

                    Call

                  </a>

                )}



                {/* ADD TO CONTACTS */}



                <button

                  type="button"

                  onClick={saveContact}

                  className="rounded-full border border-[#B08D57] bg-white px-6 py-3.5 text-sm font-semibold text-[#171717] transition hover:-translate-y-0.5 hover:bg-[#B08D57] hover:text-white"

                >

                  Add to Contacts

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





      {/* UNIVERSAL BUSINESS SHOWCASE */}
      {showcaseItems.length > 0 && (
        <section id="business-showcase" className="scroll-mt-6 border-y border-[#E5DED1] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14 md:py-18">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B08D57]">Explore the business</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">Explore Our Work & Offerings</h2>
                <p className="mt-3 text-sm leading-6 text-[#6B665D] sm:text-base">
                  Browse products, services, properties, projects and more — all in one place.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm text-[#6B665D]">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#B08D57]" aria-hidden="true" />
                {showcaseItems.length} {showcaseItems.length === 1 ? "listing" : "listings"}
              </div>
            </div>

            {(() => {
              const categories = ["All", ...new Set(showcaseItems.map((item) => String(item.category || "").trim()).filter(Boolean))];
              const filteredItems = activeCategory === "All"
                ? showcaseItems
                : showcaseItems.filter((item) => (item.category || "").trim() === activeCategory);
              const visibleItems = filteredItems.slice(0, visibleCount);

              return (
                <>
                  <div className="mt-7 border-b border-[#E5DED1] pb-3">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A8174]">Browse by category</p>
                    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter business offerings by category">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          role="tab"
                          aria-selected={activeCategory === category}
                          onClick={() => {
                            setActiveCategory(category);
                            setVisibleCount(8);
                          }}
                          className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] ${activeCategory === category ? "border-[#171717] bg-[#171717] text-white" : "border-[#E5DED1] bg-[#FDFCF9] text-[#4D4943] hover:border-[#B08D57] hover:bg-[#F5F2EA]"}`}
                        >
                          {category}
                          {category !== "All" && <span className="ml-2 text-[11px] opacity-70">{showcaseItems.filter((item) => (item.category || "").trim() === category).length}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredItems.length > 0 ? (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                      {visibleItems.map((item) => (
                        <article key={item.id} className="group overflow-hidden rounded-2xl border border-[#E9E2D7] bg-[#FDFCF9] transition duration-200 hover:-translate-y-0.5 hover:border-[#D6C4A8] hover:shadow-[0_12px_35px_rgba(23,23,23,0.08)]">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImageIndex(0);
                              setSelectedShowcaseItem(item);
                            }}
                            className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B08D57]"
                            aria-label={`View ${item.title} details`}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-[#F0E9DD]">
                              {item.imageUrls?.[0] && !imageLoadErrors.includes(item.id) ? (
                                <img
                                  src={item.imageUrls[0]}
                                  alt={item.title}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                  onError={() => setImageLoadErrors((current) => current.includes(item.id) ? current : [...current, item.id])}
                                />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center text-[#8A7557]">
                                  <span className="text-3xl" aria-hidden="true">◇</span>
                                  <span className="text-xs">Photos coming soon</span>
                                </div>
                              )}
                              {item.imageUrls?.length > 1 && (
                                <span className="absolute bottom-2 right-2 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white">
                                  {item.imageUrls.length} photos
                                </span>
                              )}
                              <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#5D4B31]">
                                {item.category || "Offering"}
                              </span>
                            </div>
                            <div className="p-3.5 sm:p-4">
                              <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#171717] sm:text-base">{item.title}</h3>
                              {item.price && <p className="mt-2 text-sm font-semibold text-[#171717]">{item.price}</p>}
                              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#9C7B4A] sm:text-sm">View details <span aria-hidden="true">→</span></span>
                            </div>
                          </button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-[#D9CCB9] bg-[#FDFCF9] px-5 py-10 text-center">
                      <p className="font-semibold text-[#171717]">Nothing in this category yet</p>
                      <p className="mt-2 text-sm text-[#6B665D]">Choose another category to explore more.</p>
                      <button type="button" onClick={() => setActiveCategory("All")} className="mt-4 rounded-full border border-[#E5DED1] px-4 py-2 text-sm font-semibold hover:bg-[#F5F2EA]">View all listings</button>
                    </div>
                  )}

                  {filteredItems.length > 8 && (
                    <div className="mt-8 flex justify-center">
                      {visibleCount < filteredItems.length ? (
                        <button type="button" onClick={() => setVisibleCount((count) => count + 8)} className="rounded-full border border-[#D9CCB9] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:border-[#B08D57] hover:bg-[#F5F2EA]">
                          Show more ({filteredItems.length - visibleItems.length} remaining)
                        </button>
                      ) : (
                        <button type="button" onClick={() => { setVisibleCount(8); document.getElementById("business-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="rounded-full border border-[#D9CCB9] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:border-[#B08D57] hover:bg-[#F5F2EA]">
                          Show less ↑
                        </button>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>
      )}

      {/* ITEM DETAILS MODAL */}
      {selectedShowcaseItem && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedShowcaseItem(null);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="showcase-modal-title" className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-[#FDFCF9] shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E5DED1] bg-[#FDFCF9]/95 px-5 py-4 backdrop-blur sm:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B08D57]">Offering details</p>
                <p className="mt-1 text-xs text-[#6B665D]">Photos · Details · Enquiry</p>
              </div>
              <button type="button" onClick={() => setSelectedShowcaseItem(null)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED1] text-2xl text-[#171717] transition hover:bg-[#F0E9DD]" aria-label="Close details">×</button>
            </div>

            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b border-[#E5DED1] p-4 sm:p-6 md:border-b-0 md:border-r">
                {selectedShowcaseItem.imageUrls?.length > 0 ? (
                  <>
                    <button type="button" onClick={() => setZoomedImage({ images: selectedShowcaseItem.imageUrls, index: selectedImageIndex, title: selectedShowcaseItem.title })} className="group relative block w-full overflow-hidden rounded-2xl bg-[#F0E9DD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]" aria-label="Zoom main photo">
                      <img src={selectedShowcaseItem.imageUrls[selectedImageIndex]} alt={selectedShowcaseItem.title} className="max-h-[52vh] min-h-56 w-full object-contain sm:min-h-80" />
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white">Click to zoom ↗</span>
                    </button>
                    {selectedShowcaseItem.imageUrls.length > 1 && (
                      <>
                        <div className="mt-3 flex items-center justify-between">
                          <button type="button" onClick={() => setSelectedImageIndex((index) => (index - 1 + selectedShowcaseItem.imageUrls.length) % selectedShowcaseItem.imageUrls.length)} className="rounded-full border border-[#E5DED1] px-3 py-2 text-sm font-medium hover:bg-[#F0E9DD]" aria-label="Previous photo">← Previous</button>
                          <span className="text-xs tabular-nums text-[#6B665D]">{selectedImageIndex + 1} / {selectedShowcaseItem.imageUrls.length}</span>
                          <button type="button" onClick={() => setSelectedImageIndex((index) => (index + 1) % selectedShowcaseItem.imageUrls.length)} className="rounded-full border border-[#E5DED1] px-3 py-2 text-sm font-medium hover:bg-[#F0E9DD]" aria-label="Next photo">Next →</button>
                        </div>
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                          {selectedShowcaseItem.imageUrls.map((url, index) => (
                            <button key={`${selectedShowcaseItem.id}-thumb-${index}`} type="button" onClick={() => setSelectedImageIndex(index)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === selectedImageIndex ? "border-[#B08D57]" : "border-transparent"}`} aria-label={`Show photo ${index + 1}`} aria-pressed={index === selectedImageIndex}>
                              <img src={url} alt="" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-[#F0E9DD] px-5 text-center text-[#8A7557]">
                    <span className="text-4xl" aria-hidden="true">◇</span>
                    <p className="mt-2 text-sm font-medium">No photos available</p>
                    <p className="mt-1 text-xs">Please contact the business for more information.</p>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B08D57]">{selectedShowcaseItem.category || "Offering"}</p>
                <h2 id="showcase-modal-title" className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-3xl">{selectedShowcaseItem.title}</h2>
                {selectedShowcaseItem.price && <p className="mt-4 text-xl font-semibold text-[#171717]">{selectedShowcaseItem.price}</p>}
                <div className="my-6 h-px bg-[#E5DED1]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A8174]">About this offering</p>
                {selectedShowcaseItem.description ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#5D5850] sm:text-base">{selectedShowcaseItem.description}</p>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[#6B665D]">Contact the business to learn more about this offering.</p>
                )}
                {whatsappNumber && (
                  <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I am interested in ${selectedShowcaseItem.title}${selectedShowcaseItem.price ? ` (${selectedShowcaseItem.price})` : ""}. Please share more details.`)}`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#2B2B2B] sm:w-auto">
                    Enquire on WhatsApp <span aria-hidden="true">↗</span>
                  </a>
                )}
                <p className="mt-4 text-xs leading-5 text-[#8A8174]">Have a question? Send an enquiry and mention this item by name.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* FULL-SCREEN PHOTO ZOOM */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Zoomed photo" onMouseDown={(event) => { if (event.target === event.currentTarget) setZoomedImage(null); }}>
          <button type="button" onClick={() => setZoomedImage(null)} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/25" aria-label="Close zoom">×</button>
          {zoomedImage.images.length > 1 && (
            <>
              <button type="button" onClick={() => setZoomedImage((current) => ({ ...current, index: (current.index - 1 + current.images.length) % current.images.length }))} className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 sm:left-6" aria-label="Previous zoomed photo">‹</button>
              <button type="button" onClick={() => setZoomedImage((current) => ({ ...current, index: (current.index + 1) % current.images.length }))} className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 sm:right-6" aria-label="Next zoomed photo">›</button>
            </>
          )}
          <img src={zoomedImage.images[zoomedImage.index]} alt={zoomedImage.title} className="max-h-[88vh] max-w-full cursor-zoom-out object-contain" />
          {zoomedImage.images.length > 1 && <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">{zoomedImage.index + 1} / {zoomedImage.images.length}</p>}
        </div>
      )}

      {/* =====================================

          CONTACT STRIP

      ===================================== */}



      <section className="border-y border-[#E5DED1] bg-white">



        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">





          {profile.phone && (

            <a

              href={`tel:${normalizePhone(profile.phone)}`}

              className="border-b border-[#E5DED1] px-6 py-7 transition hover:bg-[#F5F2EA] lg:border-b-0 lg:border-r"

            >

              <p className="text-xs uppercase tracking-[0.2em] text-[#B08D57]">

                Contact

              </p>



              <p className="mt-2 font-semibold">

                Call

              </p>



              <p className="mt-1 text-sm text-[#6B665D]">

                {formatPhone(profile.phone)}

              </p>

            </a>

          )}





          {profile.email && (

            <a

              href={emailComposeUrl}

              target="_blank"

              rel="noopener noreferrer"

              className="border-b border-[#E5DED1] px-6 py-7 transition hover:bg-[#F5F2EA] lg:border-b-0 lg:border-r"

            >

              <p className="text-xs uppercase tracking-[0.2em] text-[#B08D57]">

                Email

              </p>



              <p className="mt-2 font-semibold">

                Send Email

              </p>



              <p className="mt-1 truncate text-sm text-[#6B665D]">

                {profile.email}

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

          Add to Contacts

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

    </>

  );

}



export default PublicProfile;