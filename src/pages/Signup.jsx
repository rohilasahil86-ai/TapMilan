import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Signup() {
  const [method, setMethod] = useState("email");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD MSG91 OTP WIDGET
  // =========================
  useEffect(() => {
    const widgetId = import.meta.env.VITE_MSG91_WIDGET_ID;
    const tokenAuth = import.meta.env.VITE_MSG91_TOKEN_AUTH;

    if (!widgetId || !tokenAuth) {
      console.error("MSG91 widget configuration missing.");
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://verify.msg91.com/otp-provider.js"]'
    );

    if (existingScript) return;

    window.initSendOTP = window.initSendOTP || function () {};

    const script = document.createElement("script");

    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;

    script.onload = () => {
      const configuration = {
        widgetId,
        tokenAuth,
        exposeMethods: true,
        captchaRenderId: "",

        success: (data) => {
          console.log("MSG91 success:", data);
        },

        failure: (error) => {
          console.error("MSG91 failure:", error);
        },
      };

      if (typeof window.initSendOTP === "function") {
        window.initSendOTP(configuration);
      }
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // =========================
  // NORMALIZE PHONE
  // =========================
  const normalizePhone = (value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.startsWith("91") && digits.length === 12) {
      return digits;
    }

    if (digits.length === 10) {
      return `91${digits}`;
    }

    return null;
  };

  // =========================
  // VALIDATE ALL FIELDS
  // =========================
  const validateCommonFields = () => {
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanFullName) {
      setMessage("Please enter your full name.");
      return false;
    }

    if (!cleanEmail) {
      setMessage("Please enter your email.");
      return false;
    }

    if (!cleanPhone) {
      setMessage("Please enter your mobile number.");
      return false;
    }

    const normalizedPhone = normalizePhone(cleanPhone);

    if (!normalizedPhone) {
      setMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return false;
    }

    const usernameRegex = /^[a-z0-9._]{3,30}$/;

    if (!usernameRegex.test(cleanUsername)) {
      setMessage(
        "Username must be 3–30 characters and can contain lowercase letters, numbers, dots and underscores."
      );
      return false;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  };

  // =========================
  // SEND OTP
  // =========================
  const handleSendOtp = async () => {
  setMessage("");

  if (!fullName.trim()) {
    setMessage("Please enter your full name.");
    return;
  }

  if (!email.trim()) {
    setMessage("Please enter your email.");
    return;
  }

  if (!phone.trim()) {
    setMessage("Please enter your mobile number.");
    return;
  }

  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    setMessage(
      "Please enter a valid 10-digit Indian mobile number."
    );
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  const usernameRegex = /^[a-z0-9._]{3,30}$/;

  if (!usernameRegex.test(cleanUsername)) {
    setMessage(
      "Username must be 3–30 characters and can contain lowercase letters, numbers, dots and underscores."
    );
    return;
  }

  if (password.length < 8) {
    setMessage("Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPassword) {
    setMessage("Passwords do not match.");
    return;
  }

  if (!window.sendOtp) {
    setMessage(
      "OTP service is still loading. Please try again."
    );
    return;
  }

  setOtpLoading(true);

  window.sendOtp(
    normalizedPhone,

    (data) => {
      console.log("OTP SENT:", data);

      setOtpSent(true);
      setMessage(
        `OTP sent to +${normalizedPhone}. Please check your phone.`
      );

      setOtpLoading(false);
    },

    (error) => {
      console.error("OTP ERROR:", error);

      setMessage(
        error?.message ||
          "Unable to send OTP. Please check the mobile number and try again."
      );

      setOtpLoading(false);
    }
  );
};

  // =========================
  // VERIFY OTP + CREATE ACCOUNT
  // =========================
  const handleVerifyOtpAndSignup = async () => {
    setMessage("");

    if (!validateCommonFields()) return;

    if (!otp || otp.length < 4) {
      setMessage("Please enter the OTP.");
      return;
    }

    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      setMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (!window.verifyOtp) {
      setMessage(
        "OTP service is not ready. Please refresh and try again."
      );
      return;
    }

    setOtpLoading(true);

    window.verifyOtp(
      otp,

      async (data) => {
        console.log("OTP verified:", data);

        try {
          // MSG91 verified access token
          const accessToken =
            data?.accessToken ||
            data?.access_token ||
            data?.token ||
            data?.message;

          if (!accessToken) {
            console.error(
              "MSG91 verification response:",
              data
            );

            setMessage(
              "OTP verified, but verification token was not received."
            );

            setOtpLoading(false);
            return;
          }

          setMessage(
            "Phone verified. Creating your account..."
          );

          // =========================
          // CREATE SUPABASE ACCOUNT
          // =========================
          const { data: result, error } =
            await supabase.functions.invoke(
              "complete-phone-signup",
              {
                body: {
                  accessToken,
                  phone: `+${normalizedPhone}`,
                  password,
                  email:
                    email.trim().toLowerCase() || null,
                  fullName: fullName.trim(),
                  username:
                    username.trim().toLowerCase(),
                },
              }
            );

          // =========================
          // EDGE FUNCTION ERROR
          // =========================
          if (error) {
            console.error(
              "Edge Function error:",
              error
            );

            let errorMessage =
              "Unable to create account. Please try again.";

            try {
              const responseBody =
                await error.context?.json();

              if (responseBody?.error) {
                errorMessage = responseBody.error;
              }

              console.error(
                "Edge Function response:",
                responseBody
              );
            } catch (e) {
              console.error(
                "Could not read Edge Function response:",
                e
              );
            }

            setMessage(errorMessage);
            setOtpLoading(false);
            return;
          }

          // =========================
          // FUNCTION RESULT ERROR
          // =========================
          if (!result?.success) {
            setMessage(
              result?.error ||
                "Unable to create account. Please try again."
            );

            setOtpLoading(false);
            return;
          }

          setMessage(
            "Account created successfully! Redirecting..."
          );

          // =========================
          // AUTO LOGIN
          // =========================
          const { error: loginError } =
            await supabase.auth.signInWithPassword({
              phone: `+${normalizedPhone}`,
              password,
            });

          if (loginError) {
            console.error(
              "Auto login error:",
              loginError
            );

            setMessage(
              "Account created successfully. Please login with your mobile number."
            );

            setOtpLoading(false);
            return;
          }

          // =========================
          // PRESERVE CARD ACTIVATION
          // =========================
          const returnTo = sessionStorage.getItem(
            "tapmilan_return_to"
          );

          if (returnTo) {
            sessionStorage.removeItem(
              "tapmilan_return_to"
            );

            window.location.href = returnTo;
          } else {
            window.location.href =
              "/profile-setup";
          }
        } catch (error) {
          console.error(
            "Signup error:",
            error
          );

          setMessage(
            error?.message ||
              "Something went wrong. Please try again."
          );

          setOtpLoading(false);
        }
      },

      (error) => {
        console.error(
          "OTP verification error:",
          error
        );

        setMessage(
          error?.message ||
            "Invalid OTP. Please try again."
        );

        setOtpLoading(false);
      }
    );
  };

  // =========================
  // FORM SUBMIT
  // =========================
  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");

  if (!otpSent) {
    await handleSendOtp();
    return;
  }

  await handleVerifyOtpAndSignup();
};

  // =========================
  // UI
  // =========================
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F2EA] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[#E5DED1] bg-white p-8 shadow-xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-[#B08D57]">
            SMART DIGITAL CARD
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#171717]">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-[#6B665D]">
            Create your professional digital identity.
          </p>
        </div>

        {/* METHOD */}
        <div className="mb-6 grid grid-cols-2 rounded-xl border border-[#E5DED1] bg-[#F5F2EA] p-1">

          <button
            type="button"
            onClick={() => {
              setMethod("email");
              setOtpSent(false);
              setOtp("");
              setMessage("");
            }}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
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
              setOtpSent(false);
              setOtp("");
              setMessage("");
            }}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              method === "mobile"
                ? "bg-[#171717] text-white"
                : "text-[#6B665D] hover:text-[#171717]"
            }`}
          >
            Mobile
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* FULL NAME */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#171717]">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
              className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-[#171717] outline-none transition placeholder:text-[#6B665D]/60 focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/10"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#171717]">
              Email Address
              {method === "mobile" && (
                <span className="ml-1 text-xs text-[#6B665D]">
                  (optional)
                </span>
              )}
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              disabled={otpSent}
              className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-[#171717] outline-none transition placeholder:text-[#6B665D]/60 focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/10 disabled:bg-[#F5F2EA]"
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#171717]">
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="+91 98xxx xxx10"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
              disabled={otpSent}
              className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-[#171717] outline-none transition placeholder:text-[#6B665D]/60 focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/10 disabled:bg-[#F5F2EA]"
            />
          </div>

          {/* OTP */}
          {otpSent && (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-[#171717]">
      Enter OTP
    </label>

    <input
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) =>
        setOtp(e.target.value.replace(/\D/g, ""))
      }
      className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.4em] text-[#171717] outline-none transition placeholder:text-[#6B665D]/60 placeholder:tracking-normal focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/10"
    />

    <button
      type="button"
      onClick={handleSendOtp}
      disabled={otpLoading}
      className="mt-2 text-sm font-semibold text-[#B08D57] hover:underline disabled:opacity-50"
    >
      Resend OTP
    </button>
  </div>
)}

          {/* USERNAME */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#171717]">
              Username
            </label>

            <input
              type="text"
              placeholder="username05"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s/g, "")
                )
              }
              required
              maxLength={30}
              disabled={otpSent}
              className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-[#171717] outline-none transition placeholder:text-[#6B665D]/60 focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/10 disabled:bg-[#F5F2EA]"
            />

            <p className="mt-1.5 text-xs text-[#6B665D]">
              3–30 characters · a-z, 0-9, . and _
            </p>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#171717]">
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                minLength={8}
                disabled={otpSent}
                className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 pr-12 text-[#171717] outline-none transition placeholder:text-[#6B665D]/60 focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/10 disabled:bg-[#F5F2EA]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B665D] hover:text-[#B08D57]"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <p className="mt-1.5 text-xs text-[#6B665D]">
              Minimum 8 characters
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#171717]">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
                minLength={8}
                disabled={otpSent}
                className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 pr-12 text-[#171717] outline-none transition placeholder:text-[#6B665D]/60 focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/10 disabled:bg-[#F5F2EA]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B665D] hover:text-[#B08D57]"
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁"}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || otpLoading}
            className="w-full rounded-xl bg-[#171717] px-4 py-3.5 font-semibold text-white transition hover:bg-[#B08D57] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {otpSent
              ? otpLoading
                ? "Verifying..."
                : "Verify & Create Account"
              : otpLoading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <div className="mt-5 rounded-xl border border-[#E5DED1] bg-[#F5F2EA] px-4 py-3">
            <p className="text-center text-sm text-[#6B665D]">
              {message}
            </p>
          </div>
        )}

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-[#6B665D]">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[#171717] hover:text-[#B08D57]"
          >
            Login
          </a>
        </p>

      </div>
    </main>
  );
}

export default Signup;