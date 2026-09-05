import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [method, setMethod] = useState("email");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  return null;
};

const handleLogin = async (e) => {
  e.preventDefault();

  setMessage("");
  setMessageType("");
  setLoading(true);

  try {
    let result;

    if (method === "email") {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        setMessage("Please enter your email address.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      result = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
    } else {
      const normalizedPhone = normalizePhone(phone);

      if (!normalizedPhone) {
        setMessage("Please enter a valid 10-digit Indian mobile number.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      result = await supabase.auth.signInWithPassword({
        phone: normalizedPhone,
        password,
      });
    }

    if (result.error) {
      console.error("LOGIN ERROR:", result.error);
      setMessage(result.error.message);
      setMessageType("error");
      setLoading(false);
      return;
    }

    setMessage("Login successful. Welcome back!");
    setMessageType("success");

    setTimeout(() => {
      const returnTo = sessionStorage.getItem("tapmilan_return_to");

if (returnTo) {
  sessionStorage.removeItem("tapmilan_return_to");
  navigate(returnTo);
} else {
  navigate("/dashboard");
}
    }, 500);

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    setMessage("Something went wrong. Please try again.");
    setMessageType("error");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F5F2EA]">

      {/* TOP BRAND */}
      <div className="absolute left-6 top-6 z-20 hidden lg:left-10 lg:top-8 lg:block">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-[-0.05em] text-[#171717]"
        >
          TapMilan<span className="text-[#B08D57]">.</span>
        </Link>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================
            LEFT — BRAND VISUAL
        ====================================== */}
        <div className="relative hidden overflow-hidden bg-[#171717] lg:flex">

          {/* Decorative circles */}
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#B08D57]/20" />

          <div className="absolute -bottom-48 -right-40 h-[600px] w-[600px] rounded-full border border-[#B08D57]/15" />

          <div className="relative z-10 flex w-full flex-col justify-between p-14 xl:p-20">

            {/* TOP */}
            <div className="pt-8">

              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B08D57]">
                Digital Identity
              </p>

              <h2 className="mt-7 max-w-lg text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white xl:text-6xl">
                Your business.
                <br />
                <span className="text-[#D5B477]">
                  One tap away.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-base leading-7 text-white/50">
                Your professional identity, always ready to share.
                Connect with customers through one simple link.
              </p>

            </div>

            {/* MOCK CARD */}
            <div className="relative mx-auto w-full max-w-sm py-12">

              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#211f1b] p-7 shadow-2xl">

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    TapMilan<span className="text-[#B08D57]">.</span>
                  </span>

                  <span className="rounded-full border border-[#B08D57]/30 px-3 py-1 text-[10px] uppercase tracking-wider text-[#D5B477]">
                    Digital Card
                  </span>
                </div>

                <div className="mt-16">

                  <div className="h-16 w-16 rounded-full border-2 border-[#B08D57]/40 bg-[#F5F2EA]" />

                  <p className="mt-5 text-2xl font-semibold text-white">
                    Your Name
                  </p>

                  <p className="mt-1 text-sm text-white/40">
                    Your Business
                  </p>

                </div>

                <div className="mt-10 flex gap-3">

                  <div className="flex-1 rounded-xl border border-white/10 px-3 py-3 text-center text-xs text-white/60">
                    WhatsApp
                  </div>

                  <div className="flex-1 rounded-xl border border-white/10 px-3 py-3 text-center text-xs text-white/60">
                    Call
                  </div>

                </div>

              </div>

              {/* Floating badge */}
              <div className="absolute -right-5 bottom-3 rounded-2xl border border-white/10 bg-white px-5 py-4 shadow-xl">
                <p className="text-xs text-[#6B665D]">
                  Share anywhere
                </p>

                <p className="mt-1 text-sm font-semibold text-[#171717]">
                  Connect instantly.
                </p>
              </div>

            </div>

            {/* BOTTOM */}
            <p className="text-xs text-white/30">
              Create once. Share everywhere.
            </p>

          </div>
        </div>

        {/* =====================================
            RIGHT — LOGIN
        ====================================== */}
        <div className="flex items-center justify-center px-6 py-24 sm:px-10 lg:px-16">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}
            <div className="mb-10 text-center lg:hidden">
              <Link
                to="/"
                className="text-2xl font-semibold tracking-[-0.05em]"
              >
                TapMilan<span className="text-[#B08D57]">.</span>
              </Link>
            </div>

            {/* HEADER */}
            <div className="mb-9">

              <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-[#B08D57]">
                Welcome Back
              </p>

              <h1 className="text-4xl font-semibold tracking-[-0.045em] text-[#171717] sm:text-5xl">
                Sign in to
                <br />
                your TapMilan.
              </h1>

              <p className="mt-4 text-sm leading-6 text-[#6B665D]">
                Manage your digital visiting card and professional profile.
              </p>

            </div>

            {/* LOGIN CARD */}
            <div className="rounded-[28px] border border-[#E5DED1] bg-white p-7 shadow-[0_25px_70px_rgba(23,23,23,0.07)] sm:p-9">

              <form
                onSubmit={handleLogin}
                className="space-y-6"
              >

                {/* LOGIN METHOD */}
<div className="grid grid-cols-2 rounded-2xl border border-[#E5DED1] bg-[#F5F2EA] p-1">
  <button
    type="button"
    onClick={() => {
      setMethod("email");
      setMessage("");
    }}
    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      method === "email"
        ? "bg-[#171717] text-white"
        : "text-[#6B665D] hover:text-[#171717]"
    }`}
  >
    Email
  </button>

  <button
    type="button"
    onClick={() => {
      setMethod("mobile");
      setMessage("");
    }}
    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      method === "mobile"
        ? "bg-[#171717] text-white"
        : "text-[#6B665D] hover:text-[#171717]"
    }`}
  >
    Mobile
  </button>
</div>

                {/* EMAIL / MOBILE */}
<div>
  <label
    htmlFor="loginIdentifier"
    className="mb-2.5 block text-sm font-medium text-[#171717]"
  >
    {method === "email" ? "Email Address" : "Mobile Number"}
  </label>

  <input
    id="loginIdentifier"
    type={method === "email" ? "email" : "tel"}
    placeholder={
      method === "email"
        ? "you@example.com"
        : "+91 98765 43210"
    }
    value={method === "email" ? email : phone}
    onChange={(e) =>
      method === "email"
        ? setEmail(e.target.value)
        : setPhone(e.target.value)
    }
    required
    autoComplete={
      method === "email" ? "email" : "tel"
    }
    className="w-full rounded-2xl border border-[#E5DED1] bg-[#FFFEFC] px-4 py-3.5 text-sm text-[#171717] outline-none transition-all duration-300 placeholder:text-[#A29B91] focus:border-[#B08D57] focus:ring-4 focus:ring-[#B08D57]/10"
  />
</div>

                {/* PASSWORD */}
                <div>

                  <div className="mb-2.5 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-[#171717]"
                    >
                      Password
                    </label>

                    <Link
  to="/forgot-password"
  className="text-xs font-medium text-[#B08D57] transition hover:text-[#8F713F]"
>
  Forgot Password?
</Link>

                  </div>

                  <div className="relative">

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-[#E5DED1] bg-[#FFFEFC] px-4 py-3.5 pr-12 text-sm text-[#171717] outline-none transition-all duration-300 placeholder:text-[#A29B91] focus:border-[#B08D57] focus:ring-4 focus:ring-[#B08D57]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1 text-lg text-[#6B665D] transition hover:bg-[#F5F2EA]"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>

                  </div>

                </div>

                {/* LOGIN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] px-4 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#292929] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Signing In..."
                  ) : (
                    <>
                      Sign In
                      <span className="text-[#D5B477] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>

              </form>

              {/* MESSAGE */}
              {message && (
                <div
                  className={`mt-5 rounded-2xl border px-4 py-3 text-center text-sm ${
                    messageType === "error"
                      ? "border-red-200 bg-red-50 text-red-600"
                      : messageType === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-[#E5DED1] bg-[#F5F2EA] text-[#6B665D]"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* DIVIDER */}
              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-[#E5DED1]" />

                <span className="text-[10px] font-medium uppercase tracking-wider text-[#A29B91]">
                  New to TapMilan?
                </span>

                <div className="h-px flex-1 bg-[#E5DED1]" />

              </div>

              {/* SIGNUP */}
              <Link
                to="/signup"
                className="block w-full rounded-2xl border border-[#B08D57] px-4 py-3.5 text-center text-sm font-semibold text-[#8F713F] transition-all duration-300 hover:bg-[#B08D57] hover:text-white"
              >
                Create Your Account
              </Link>

            </div>

            {/* BACK */}
            <div className="mt-7 text-center">

              <Link
                to="/"
                className="text-xs font-medium text-[#6B665D] transition hover:text-[#B08D57]"
              >
                ← Back to TapMilan
              </Link>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;