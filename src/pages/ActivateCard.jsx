import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ActivateCard() {
  const { cardCode } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState("");
  const [cardAvailable, setCardAvailable] = useState(false);

  useEffect(() => {
    async function checkCard() {
      if (!cardCode) {
        setMessage("Invalid card.");
        setLoading(false);
        return;
      }

      const cleanCardCode = cardCode.trim().toUpperCase();

      // Resolve card first — no login required
      const { data, error } = await supabase.rpc("resolve_card", {
        p_card_code: cleanCardCode,
      });

      if (error) {
        console.error("CARD RESOLVE ERROR:", error);
        setMessage("Unable to check this card.");
        setLoading(false);
        return;
      }

      const card = data?.[0];

      // Card doesn't exist
      if (!card) {
        setMessage("This card does not exist.");
        setLoading(false);
        return;
      }

      // Already activated → directly open public profile
      if (card.username) {
        navigate(`/u/${card.username}`, { replace: true });
        return;
      }

      // Card exists but isn't available
      if (card.status !== "available") {
        setMessage("This card is not available for activation.");
        setLoading(false);
        return;
      }

      // Card is available → now check login
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        sessionStorage.setItem(
          "tapmilan_return_to",
          `/activate/${cleanCardCode}`
        );

        navigate("/login", { replace: true });
        return;
      }

      // Logged-in owner can activate
      setCardAvailable(true);
      setLoading(false);
    }

    checkCard();
  }, [cardCode, navigate]);

  const handleActivate = async () => {
    setActivating(true);
    setMessage("");

    const cleanCardCode = cardCode.trim().toUpperCase();

    const { data, error } = await supabase.rpc("activate_card", {
      p_card_code: cleanCardCode,
    });

    if (error) {
      console.error("ACTIVATION ERROR:", error);

      setMessage(
        error.message || "Unable to activate this card."
      );

      setActivating(false);
      return;
    }

    const username = data?.[0]?.username;

    // Profile already exists
    if (username) {
      navigate(`/u/${username}`, { replace: true });
      return;
    }

    // Card activated but profile does not exist yet
    sessionStorage.setItem(
      "tapmilan_activated_card",
      cleanCardCode
    );

    navigate("/profile-setup", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F2EA] text-[#171717]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#E5DED1] border-t-[#B08D57]" />

          <p className="text-sm text-[#6B665D]">
            Checking your TapMilan card...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EA] px-6 text-[#171717]">
      <div className="w-full max-w-md text-center">

        <p className="text-sm font-semibold tracking-tight">
          Tap<span className="text-[#B08D57]">Milan</span>
        </p>

        {cardAvailable ? (
          <>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              Activate Your Card
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#6B665D]">
              This TapMilan card is ready to be connected
              to your profile.
            </p>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#B08D57]">
              {cardCode}
            </p>

            <button
              type="button"
              onClick={handleActivate}
              disabled={activating}
              className="mt-8 w-full rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2B2B2B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activating
                ? "Activating..."
                : "Activate Card →"}
            </button>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              Unable to Activate
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#6B665D]">
              {message}
            </p>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#B08D57]">
              {cardCode}
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-8 rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2B2B2B]"
            >
              Go to Login
            </button>
          </>
        )}

        {message && cardAvailable && (
          <p className="mt-5 text-sm text-red-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default ActivateCard;