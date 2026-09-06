import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { QRCodeCanvas } from "qrcode.react";
import SEO from "../components/SEO";

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);
  

  useEffect(() => {
  loadProfile();
}, [navigate]);

  const loadProfile = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
  navigate("/login", { replace: true });
  return;
}

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("PROFILE ERROR:", error);
      setMessage("Unable to load your profile.");
      setLoading(false);
      return;
    }

    setProfile(data);

    console.log("CURRENT USER:", user.id);
console.log("PROFILE ID:", data.id);

const {
      data: cardData,
      error: cardError,
    } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

  console.log("CARD DATA:", cardData);
console.log("CARD ERROR:", cardError);

if (cardError) {
  console.error("CARD ERROR:", cardError);
} else {
  setCard(cardData);
}

setLoading(false);
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getPublicProfileUrl = () => {
    if (!profile?.username) return "#";

    return `${window.location.origin}/u/${profile.username}`;
  };

  const publicProfileUrl = profile?.username
  ? `${window.location.origin}/u/${profile.username}`
  : "";

const cardActivationUrl = card?.card_code
  ? `${window.location.origin}/activate/${card.card_code}`
  : "";

  const copyProfileLink = async () => {
    const url = getPublicProfileUrl();

    if (url === "#") return;

    try {
      await navigator.clipboard.writeText(url);
      setMessage("Profile link copied successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to copy profile link.");
    }
  };


  const shareProfile = async () => {
  const url = getPublicProfileUrl();

  if (url === "#") return;

  const shareData = {
    title: `${profile.full_name} | TapMilan`,
    text: `Check out ${profile.full_name}'s digital business card.`,
    url,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(url);
    setMessage("Profile link copied successfully.");
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("SHARE ERROR:", error);
      setMessage("Unable to share profile.");
    }
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#E5DED1] border-t-[#B08D57]" />

          <p className="text-sm text-[#6B665D]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#E5DED1] bg-white p-8 text-center shadow-[0_20px_60px_rgba(23,23,23,0.08)]">
          <h1 className="text-2xl font-semibold text-[#171717]">
            Profile Not Found
          </h1>

          <p className="mt-3 text-sm text-[#6B665D]">
            We couldn't load your profile information.
          </p>

          {message && (
            <p className="mt-4 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 rounded-xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <SEO
      title="Dashboard | TapMilan"
      description="Manage your TapMilan digital business card."
      noIndex={true}
    />

    <div className="min-h-screen bg-[#F5F2EA]">

      {/* Header */}
      <header className="border-b border-[#E5DED1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171717]">
              <span className="text-sm font-semibold text-[#B08D57]">
                SC
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#171717]">
                TapMilan
              </p>

              <p className="text-xs text-[#8A8378]">
                Digital Identity
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-[#E5DED1] px-4 py-2.5 text-sm font-medium text-[#6B665D] transition hover:border-[#B08D57] hover:text-[#171717]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">

        {/* Welcome */}
        <section className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#B08D57]">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            Your Digital Identity
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B665D] sm:text-base">
            Manage your digital business card, profile information and
            sharing options from one place.
          </p>
        </section>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm text-[#6B665D]">
            {message}
          </div>
        )}



          {/* Card Information */}
<section className="mb-6 rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-[0_15px_45px_rgba(23,23,23,0.05)] sm:p-8">

  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#B08D57]">
        TapMilan Card
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-[#171717]">
        {card?.card_code || "No card assigned"}
      </h2>

      <p className="mt-1 text-sm text-[#6B665D]">
        {card
          ? "Your physical TapMilan card is connected to this account."
          : "This account does not have a physical TapMilan card assigned yet."}
      </p>
    </div>

    {card && (
      <div
        className={`rounded-full px-4 py-2 text-xs font-semibold ${
          card.status === "activated"
            ? "border border-[#D8E8D8] bg-[#F3FAF3] text-[#527052]"
            : "border border-[#E5DED1] bg-[#F5F2EA] text-[#6B665D]"
        }`}
      >
        {card.status === "activated" ? "Card Active" : card.status}
      </div>
    )}

  </div>

  {card?.activated_at && (
    <div className="mt-6 border-t border-[#E5DED1] pt-5">
      <p className="text-xs text-[#8A8378]">
        Activated
      </p>

      <p className="mt-1 text-sm font-medium text-[#171717]">
        {new Date(card.activated_at).toLocaleString()}
      </p>
    </div>
  )}

  {!card && (
    <div className="mt-6 rounded-2xl border border-dashed border-[#E5DED1] bg-[#F5F2EA] px-4 py-3">
      <p className="text-xs leading-5 text-[#6B665D]">
        Direct login does not assign a physical card. A card appears here
        after you complete the card activation flow.
      </p>
    </div>
  )}

</section>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Profile Card */}
          <section className="lg:col-span-2 rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-[0_15px_45px_rgba(23,23,23,0.05)] sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Profile Image */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F5F2EA] border border-[#E5DED1]">

                {profile.profile_image_url || profile.profile_photo ? (
                  <img
                    src={
                      profile.profile_image_url ||
                      profile.profile_photo
                    }
                    alt={profile.full_name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-[#B08D57]">
                    {profile.full_name
                      ? profile.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                )}

              </div>

              {/* Profile Info */}
              <div className="min-w-0 flex-1">

                <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#B08D57]">
                  Your Profile</p>

                <h2 className="mt-1 truncate text-2xl font-semibold text-[#171717]">
                  {profile.full_name || "Your Name"}
                </h2>

                {profile.designation && (
                  <p className="mt-1 text-sm text-[#6B665D]">
                    {profile.designation}
                  </p>
                )}

                {profile.business_name && (
                  <p className="mt-1 text-sm font-medium text-[#171717]">
                    {profile.business_name}
                  </p>
                )}

                {profile.username && (
                  <p className="mt-2 text-xs text-[#8A8378]">
                    @{profile.username}
                  </p>
                )}

              </div>

              {/* Status */}
              <div className="self-start rounded-full border border-[#D8E8D8] bg-[#F3FAF3] px-3 py-1.5 text-xs font-medium text-[#527052]">
                {profile.is_active ? "Profile Active" : "Profile Inactive"}
              </div>

            </div>

            {/* Public URL */}
            <div className="mt-8 border-t border-[#E5DED1] pt-6">

              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A8378]">
                Public Card URL
              </p>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">

                <div className="min-w-0 flex-1 rounded-xl border border-[#E5DED1] bg-[#F5F2EA] px-4 py-3">
                  <p className="truncate text-sm text-[#6B665D]">
                    {getPublicProfileUrl()}
                  </p>
                </div>

                <button
                  onClick={copyProfileLink}
                  className="rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]"
                >
                  Copy Link
                </button>

              </div>

            </div>

            {/* View Card */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <a
                href={`/u/${profile.username}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl bg-[#B08D57] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#967544]"
              >
                View My Card
              </a>

              <Link
  to="/edit-profile"
  className="flex-1 rounded-xl border border-[#E5DED1] px-5 py-3 text-center text-sm font-semibold text-[#171717] transition hover:border-[#B08D57]"
>
  Edit Profile
</Link>

            </div>

          </section>

          {/* Quick Actions */}
          <section className="rounded-3xl border border-[#E5DED1] bg-[#171717] p-6 text-white shadow-[0_15px_45px_rgba(23,23,23,0.08)] sm:p-7">

            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#B08D57]">
              Quick Actions
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Manage Your Card
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#BDB7AE]">
              Everything you need to keep your digital identity updated
              and ready to share.
            </p>

            <div className="mt-7 space-y-3">

              {/* Edit */}
              <Link
  to="/edit-profile"
  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-left transition hover:bg-white/10"
>
  <span className="text-sm font-medium">
    Edit Profile
  </span>

  <span className="text-[#B08D57]">
    →
  </span>
</Link>

              {/* QR */}
              <button
                type="button"
                onClick={() => card && setShowQR(true)}
                disabled={!card}
                className={`flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3.5 text-left transition ${
                  card
                    ? "bg-white/5 hover:bg-white/10"
                    : "cursor-not-allowed bg-white/[0.03] opacity-50"
                }`}
              >
                <span className="text-sm font-medium">
                  {card ? "Generate QR Code" : "QR Code Unavailable"}
                </span>

                <span className="text-[#B08D57]">
                  →
                </span>
              </button>

              {/* Share */}
              <button
                onClick={shareProfile}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-left transition hover:bg-white/10"
              >
                <span className="text-sm font-medium">
                  Share Card
                </span>

                <span className="text-[#B08D57]">
                  →
                </span>
              </button>

            </div>

          </section>

        </div>

      </main>
      

      {/* QR MODAL */}
      
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-[#E5DED1] bg-[#F5F2EA] p-7 text-[#171717] shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B08D57]">
                  TapMilan
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Your QR Code
                </h2>

                <p className="mt-1 text-sm text-[#6B665D]">
                  Scan to open your digital profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowQR(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DED1] bg-white text-lg transition hover:border-[#B08D57]"
              >
                ×
              </button>

            </div>


            {/* QR */}
            <div className="mt-7 flex justify-center rounded-2xl border border-[#E5DED1] bg-white p-8">

              {cardActivationUrl ? (
  <QRCodeCanvas
    id="smart-card-qr"
    value={cardActivationUrl}
    size={240}
    bgColor="#FFFFFF"
    fgColor="#171717"
    level="H"
    includeMargin={true}
  />
) : (
  <p className="text-sm text-[#8A8378]">
    No physical card assigned yet.
  </p>
)}
              

            </div>


            {/* Profile */}
            <div className="mt-5 text-center">

              <p className="text-sm font-semibold">
                {profile?.full_name}
              </p>

              <p className="mt-1 text-xs text-[#6B665D]">
                @{profile?.username}
              </p>

            </div>


            {/* URL */}
            <div className="mt-5 rounded-xl bg-white p-3">

              <p className="truncate text-center text-xs text-[#6B665D]">
                {cardActivationUrl}
              </p>

            </div>


            {/* Download */}
            <button
              type="button"
              onClick={() => {
                const canvas = document.querySelector("#smart-card-qr");

                if (!canvas) return;

                const link = document.createElement("a");

                link.download = `${
  card?.card_code || "smart-card"
}-qr.png`;

                link.href = canvas.toDataURL("image/png");

                link.click();
              }}
              className="mt-5 w-full rounded-xl bg-[#171717] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2B2B2B]"
            >
              Download QR Code
            </button>

          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E5DED1] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-[#8A8378] sm:px-8">
          TapMilan · Your digital identity, everywhere.
        </div>
      </footer>

    </div>
    </>
  );
}

export default Dashboard;