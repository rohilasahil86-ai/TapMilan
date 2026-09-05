import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ForgotPassword() {
  const [method, setMethod] = useState("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");
  const [reqId, setReqId] = useState("");

  const [step, setStep] = useState("input");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    if (method !== "mobile") return;

    if (document.getElementById("msg91-otp-script")) return;

    const script = document.createElement("script");

    script.id = "msg91-otp-script";
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;

    script.onload = () => {
      if (window.initSendOTP) {
        window.initSendOTP({
          widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
          tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,
        });
      }
    };

    document.body.appendChild(script);

    return () => {};
  }, [method]);

  const normalizePhone = (value) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("91") && cleaned.length === 12) {
      return cleaned;
    }

    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }

    return cleaned;
  };

  const handleEmailReset = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: `${window.location.origin}/update-password`,
      }
    );

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    setMessage(
      "Password reset link has been sent to your email."
    );
    setMessageType("success");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const normalizedPhone = normalizePhone(phone);

    if (normalizedPhone.length !== 12) {
      setMessage("Please enter a valid 10-digit mobile number.");
      setMessageType("error");
      return;
    }

    if (!window.sendOtp) {
      setMessage(
        "OTP service is still loading. Please try again."
      );
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      window.sendOtp(
        normalizedPhone,
        (data) => {
          console.log("OTP sent:", data);

          const newReqId =
            data?.reqId ||
            data?.req_id ||
            data?.requestId;

          if (newReqId) {
            setReqId(newReqId);
          }

          setStep("otp");
          setMessage("OTP sent successfully.");
          setMessageType("success");
          setLoading(false);
        },
        (error) => {
          console.error("OTP send error:", error);

          setMessage(
            error?.message ||
              "Unable to send OTP. Please try again."
          );
          setMessageType("error");
          setLoading(false);
        }
      );
    } catch (error) {
      console.error(error);

      setMessage("Unable to send OTP.");
      setMessageType("error");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      setMessage("Please enter the OTP.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      window.verifyOtp(
        otp,
        async (data) => {
          console.log("OTP verification response:", data);

          const accessToken =
            data?.accessToken ||
            data?.access_token ||
            data?.token;

          if (!accessToken) {
            console.error("Missing MSG91 access token:", data);

            setMessage(
              "OTP verified, but verification token was not received."
            );
            setMessageType("error");
            setLoading(false);
            return;
          }

          sessionStorage.setItem(
            "tapmilan_reset_access_token",
            accessToken
          );

          sessionStorage.setItem(
            "tapmilan_reset_phone",
            `+${normalizePhone(phone)}`
          );

          setStep("password");
          setMessage("Mobile verified successfully.");
          setMessageType("success");
          setLoading(false);
        },
        (error) => {
          console.error("OTP verification error:", error);

          setMessage(
            error?.message ||
              "Invalid OTP. Please try again."
          );
          setMessageType("error");
          setLoading(false);
        },
        reqId || undefined
      );
    } catch (error) {
      console.error(error);

      setMessage("OTP verification failed.");
      setMessageType("error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-3xl font-semibold tracking-tight text-[#171717]"
          >
            Tap<span className="text-[#B08D57]">Setu</span>
          </Link>

          <p className="mt-3 text-[#6B665D]">
            Reset your account password
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#E5DED1] rounded-2xl p-8 shadow-sm">

          <h1 className="text-2xl font-semibold text-[#171717]">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-[#6B665D]">
            Choose how you want to reset your password.
          </p>

          {/* TOGGLE */}
          <div className="grid grid-cols-2 bg-[#F5F2EA] rounded-xl p-1 mt-7">

            <button
              type="button"
              onClick={() => {
                setMethod("email");
                setStep("input");
                setMessage("");
              }}
              className={`py-2.5 rounded-lg text-sm font-medium transition ${
                method === "email"
                  ? "bg-white text-[#171717] shadow-sm"
                  : "text-[#6B665D]"
              }`}
            >
              Email
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod("mobile");
                setStep("input");
                setMessage("");
              }}
              className={`py-2.5 rounded-lg text-sm font-medium transition ${
                method === "mobile"
                  ? "bg-white text-[#171717] shadow-sm"
                  : "text-[#6B665D]"
              }`}
            >
              Mobile
            </button>

          </div>

          {/* EMAIL */}
          {method === "email" && (
            <form
              onSubmit={handleEmailReset}
              className="mt-7 space-y-5"
            >

              <div>
                <label className="block text-sm font-medium text-[#171717] mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DED1] outline-none focus:border-[#B08D57]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#171717] text-white font-medium hover:bg-black transition disabled:opacity-60"
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link →"}
              </button>

            </form>
          )}

          {/* MOBILE */}
          {method === "mobile" && step === "input" && (
            <form
              onSubmit={handleSendOtp}
              className="mt-7 space-y-5"
            >

              <div>
                <label className="block text-sm font-medium text-[#171717] mb-2">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DED1] outline-none focus:border-[#B08D57]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#171717] text-white font-medium hover:bg-black transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP →"}
              </button>

            </form>
          )}

          {/* OTP */}
          {method === "mobile" && step === "otp" && (
            <form
              onSubmit={handleVerifyOtp}
              className="mt-7 space-y-5"
            >

              <div>
                <label className="block text-sm font-medium text-[#171717] mb-2">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DED1] outline-none focus:border-[#B08D57] text-center tracking-[0.4em]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#171717] text-white font-medium hover:bg-black transition disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>

            </form>
          )}

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

          {/* BACK */}
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
  );
}

export default ForgotPassword;