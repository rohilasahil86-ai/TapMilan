import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";

function UpdatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

   const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // --------------------------------
      // MOBILE RESET
      // --------------------------------

      const resetAccessToken = sessionStorage.getItem(
        "tapmilan_reset_access_token"
      );

      const resetPhone = sessionStorage.getItem(
        "tapmilan_reset_phone"
      );

      if (resetAccessToken && resetPhone) {
        const { data, error } = await supabase.functions.invoke(
          "reset-phone-password",
          {
            body: {
              accessToken: resetAccessToken,
              phone: resetPhone,
              newPassword: password,
            },
          }
        );

        if (error) {
          console.error(
            "PHONE PASSWORD RESET ERROR:",
            error
          );

          setMessage(
            error.message ||
              "Unable to update password. Please try again."
          );
          setMessageType("error");
          setLoading(false);
          return;
        }

        if (!data?.success) {
          setMessage(
            data?.error ||
              "Unable to update password."
          );
          setMessageType("error");
          setLoading(false);
          return;
        }

        // Clear temporary reset data
        sessionStorage.removeItem(
          "tapmilan_reset_access_token"
        );

        sessionStorage.removeItem(
          "tapmilan_reset_phone"
        );

        setMessage(
          "Password changed successfully. Redirecting to login..."
        );
        setMessageType("success");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      // --------------------------------
      // EMAIL RESET
      // --------------------------------

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error(
          "EMAIL PASSWORD RESET ERROR:",
          error
        );

        setMessage(error.message);
        setMessageType("error");
        setLoading(false);
        return;
      }

      setMessage(
        "Password changed successfully. Redirecting to login..."
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "PASSWORD UPDATE ERROR:",
        error
      );

      setMessage(
        "Unable to update password. Please try again."
      );
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <>
    <SEO
      title="Update Password | TapMilan"
      description="Update your TapMilan account password."
      noIndex={true}
    />

    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-3xl font-semibold tracking-tight text-[#171717]"
          >
            Tap<span className="text-[#B08D57]">Milan</span>
          </Link>

          <p className="mt-3 text-[#6B665D]">
            Create a new password
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#E5DED1] rounded-2xl p-8 shadow-sm">

          <h1 className="text-2xl font-semibold text-[#171717]">
            Set New Password
          </h1>

          <p className="mt-2 text-sm text-[#6B665D]">
            Enter your new password below.
          </p>

          <form
            onSubmit={handleUpdatePassword}
            className="mt-7 space-y-5"
          >

            {/* PASSWORD */}
<div>
  <label className="block text-sm font-medium text-[#171717] mb-2">
    New Password
  </label>

  <div className="relative">
    <input
      type={showNewPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter new password"
      autoComplete="new-password"
      className="w-full px-4 py-3 pr-12 rounded-xl border border-[#E5DED1] outline-none focus:border-[#B08D57]"
    />

    <button
      type="button"
      onClick={() => setShowNewPassword(!showNewPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
    >
      {showNewPassword ? "🙈" : "👁️"}
    </button>
  </div>
</div>

            {/* CONFIRM */}
<div>
  <label className="block text-sm font-medium text-[#171717] mb-2">
    Confirm Password
  </label>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) =>
        setConfirmPassword(e.target.value)
      }
      placeholder="Confirm new password"
      autoComplete="new-password"
      className="w-full px-4 py-3 pr-12 rounded-xl border border-[#E5DED1] outline-none focus:border-[#B08D57]"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
    >
      {showConfirmPassword ? "🙈" : "👁️"}
    </button>
  </div>
</div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#171717] text-white font-medium hover:bg-black transition disabled:opacity-60"
            >
              {loading
                ? "Updating..."
                : "Change Password →"}
            </button>

          </form>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mt-5 text-sm text-center ${
                messageType === "error"
                  ? "text-red-600"
                  : messageType === "success"
                  ? "text-green-600"
                  : "text-[#6B665D]"
              }`}
            >
              {message}
            </div>
          )}

          <div className="text-center mt-7">
            <Link
              to="/login"
              className="text-sm text-[#B08D57] hover:underline"
            >
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}

export default UpdatePassword;