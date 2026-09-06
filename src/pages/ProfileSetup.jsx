import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

function ProfileSetup() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    business_name: "",
    designation: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    instagram: "",
    linkedin: "",
    facebook: "",
    youtube: "",
    address: "",
    maps_url: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      // Load existing signup data if available
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setFormData((prev) => ({
          ...prev,
          full_name:
            user.user_metadata?.full_name || prev.full_name,
          username:
            user.user_metadata?.username || prev.username,
          phone:
            user.phone ||
            user.user_metadata?.phone ||
            prev.phone,
          email: user.email || prev.email,
        }));
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Please select JPG, PNG or WEBP image.");
      setMessageType("error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      setMessageType("error");
      return;
    }

    setProfileImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setMessage("");
    setMessageType("");
  };

  // =========================
  // MESSAGE
  // =========================
  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // =========================
  // CREATE PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // --------------------------------
      // 1. GET USER
      // --------------------------------
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        showMessage("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      // --------------------------------
      // 2. VALIDATION
      // --------------------------------
      const cleanUsername = formData.username
        .trim()
        .toLowerCase();

      const usernameRegex = /^[a-z0-9._]{3,30}$/;

      if (!usernameRegex.test(cleanUsername)) {
        showMessage(
          "Username must be 3–30 characters and use lowercase letters, numbers, dots or underscores."
        );
        return;
      }

      if (!formData.full_name.trim()) {
        showMessage("Please enter your full name.");
        return;
      }

      // --------------------------------
      // 3. CHECK USERNAME
      // --------------------------------
      const { data: existingUsername, error: usernameError } =
        await supabase
          .from("profiles")
          .select("id")
          .ilike("username", cleanUsername)
          .maybeSingle();

      if (usernameError) {
        throw usernameError;
      }

      if (
        existingUsername &&
        existingUsername.id !== user.id
      ) {
        showMessage("This username is already taken.");
        return;
      }

      // --------------------------------
      // 4. IMAGE UPLOAD
      // --------------------------------
      let profileImageUrl = "";

      if (profileImage) {
        const TARGET_SIZE = 120 * 1024; // Keep safely below 150 KB bucket limit
        const filePath = `${user.id}/profile.webp`;

        // Load selected image
        const image = new Image();
        const objectUrl = URL.createObjectURL(profileImage);

        try {
          image.src = objectUrl;

          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = () =>
              reject(new Error("Unable to read selected image."));
          });

          // Compress progressively until the image is <= 120 KB.
          let compressedFile = null;
          let workingWidth = image.width;
          let workingHeight = image.height;
          let quality = 0.82;

          for (let attempt = 0; attempt < 10; attempt++) {
            const maxDimension = Math.max(
              320,
              Math.round(800 * Math.pow(0.85, attempt))
            );

            let width = image.width;
            let height = image.height;

            if (width > height) {
              if (width > maxDimension) {
                height = Math.round(
                  (height * maxDimension) / width
                );
                width = maxDimension;
              }
            } else {
              if (height > maxDimension) {
                width = Math.round(
                  (width * maxDimension) / height
                );
                height = maxDimension;
              }
            }

            // Never upscale a small image.
            width = Math.min(width, workingWidth);
            height = Math.min(height, workingHeight);

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            if (!ctx) {
              throw new Error("Unable to process profile image.");
            }

            // White background avoids transparency artifacts in WebP conversion.
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, width, height);

            const blob = await new Promise((resolve) => {
              canvas.toBlob(
                resolve,
                "image/webp",
                quality
              );
            });

            if (!blob) {
              throw new Error(
                "Unable to compress profile image."
              );
            }

            compressedFile = new File(
              [blob],
              "profile.webp",
              {
                type: "image/webp",
              }
            );

            console.log(
              `Image compression attempt ${attempt + 1}:`,
              `${(compressedFile.size / 1024).toFixed(1)} KB`,
              `${width}x${height}`,
              `quality=${quality.toFixed(2)}`
            );

            if (compressedFile.size <= TARGET_SIZE) {
              break;
            }

            // Reduce quality first, then dimensions through the next attempt.
            quality = Math.max(0.42, quality - 0.06);
          }

          if (!compressedFile) {
            throw new Error(
              "Unable to process profile image."
            );
          }

          if (compressedFile.size > TARGET_SIZE) {
            throw new Error(
              "This photo could not be optimized below 120 KB. Please choose another photo."
            );
          }

          // Upload only the optimized WebP file.
          const { error: uploadError } =
            await supabase.storage
              .from("profile-images")
              .upload(filePath, compressedFile, {
                cacheControl: "3600",
                upsert: true,
                contentType: "image/webp",
              });

          if (uploadError) {
            console.error(
              "IMAGE UPLOAD ERROR:",
              uploadError
            );
            throw uploadError;
          }

          const { data: publicUrlData } =
            supabase.storage
              .from("profile-images")
              .getPublicUrl(filePath);

          profileImageUrl =
            publicUrlData?.publicUrl
              ? `${publicUrlData.publicUrl}?v=${Date.now()}`
              : "";
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      }

      // --------------------------------
      // 5. PROFILE DATA
      // --------------------------------
      const profileData = {
        id: user.id,

        username: cleanUsername,
        full_name: formData.full_name.trim(),
        business_name: formData.business_name.trim(),
        designation: formData.designation.trim(),

        phone:
          formData.phone.trim() ||
          user.phone ||
          user.user_metadata?.phone ||
          null,

        whatsapp: formData.whatsapp.trim(),

        email:
          formData.email.trim() ||
          user.email ||
          null,

        website: formData.website.trim(),
        instagram: formData.instagram.trim(),
        linkedin: formData.linkedin.trim(),
        facebook: formData.facebook.trim(),
        youtube: formData.youtube.trim(),

        address: formData.address.trim(),
        maps_url: formData.maps_url.trim(),

        bio: formData.bio.trim(),

        ...(profileImageUrl
          ? {
              profile_image_url: profileImageUrl,
            }
          : {}),
      };

      // --------------------------------
      // 6. SAVE PROFILE
      // --------------------------------
      const { data: savedProfile, error: profileError } =
        await supabase
          .from("profiles")
          .upsert(profileData, {
            onConflict: "id",
          })
          .select()
          .single();

      if (profileError) {
        console.error(
          "PROFILE DATABASE ERROR:",
          profileError
        );
        throw profileError;
      }

      if (!savedProfile?.username) {
        showMessage(
          "Profile saved, but username could not be found."
        );
        return;
      }

      showMessage(
        "Profile created successfully.",
        "success"
      );

      // --------------------------------
      // 7. CARD ACTIVATION FLOW
      // --------------------------------
      const activatedCard = sessionStorage.getItem(
        "tapmilan_activated_card"
      );

      if (activatedCard) {
        sessionStorage.removeItem(
          "tapmilan_activated_card"
        );
      }

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 1000);
    } catch (error) {
      console.error("PROFILE SETUP ERROR:", error);

      showMessage(
        error?.message ||
          error?.error_description ||
          "Something went wrong while creating your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F2EA]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#E5DED1] border-t-[#B08D57]" />
          <p className="text-sm text-[#6B665D]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <>
    <SEO
      title="Profile | TapMilan"
      description="Manage your TapMilan profile."
      noIndex={true}
    />

    <div className="min-h-screen bg-[#F5F2EA] text-[#171717]">

      {/* HEADER */}
      <header className="border-b border-[#E5DED1] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B08D57]">
            TapMilan
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Create Your Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[#6B665D]">
            Add the details you want to show on your
            TapMilan digital card.
          </p>

        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =========================
              PROFILE PHOTO + BASIC
          ========================= */}
          <section className="rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-[0_15px_45px_rgba(23,23,23,0.05)] md:p-8">

            {/* PROFILE PHOTO */}
            <div className="mb-8 flex flex-col items-center border-b border-[#E5DED1] pb-8 sm:flex-row sm:gap-6">

              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md ring-1 ring-[#E5DED1]"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F5F2EA] text-3xl font-semibold text-[#B08D57] ring-1 ring-[#E5DED1]">
                    {formData.full_name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="mt-4 text-center sm:mt-0 sm:text-left">

                <h3 className="text-base font-semibold">
                  Profile Photo
                </h3>

                <p className="mt-1 text-sm text-[#6B665D]">
                  Add a professional photo for your Smart Card.
                </p>

                <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-[#171717] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]">

                  {profileImage
                    ? "Change Photo"
                    : "Choose Photo"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                <p className="mt-2 text-xs text-[#9A948A]">
                  JPG, PNG or WEBP • Maximum 5 MB • Auto-compressed for fast loading
                </p>

              </div>
            </div>

            {/* BASIC INFORMATION */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Your main identity shown on your digital card.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />

              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value
                      .toLowerCase()
                      .replace(/\s/g, ""),
                  }))
                }
                required
                placeholder="rahul005"
              />

              <Input
                label="Business Name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
              />

              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />

            </div>
          </section>

          {/* =========================
              CONTACT
          ========================= */}
          <section className="rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-[0_15px_45px_rgba(23,23,23,0.05)] md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Contact Information
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Let visitors know how they can reach you.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                label="WhatsApp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
              />

              <Input
                label="Public Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />

              <Input
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

            </div>
          </section>

          {/* =========================
              SOCIAL
          ========================= */}
          <section className="rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-[0_15px_45px_rgba(23,23,23,0.05)] md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Social Profiles
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Add your social media profile links.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
              />

              <Input
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />

              <Input
                label="Facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
              />

              <Input
                label="YouTube"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@username"
              />

            </div>
          </section>

          {/* =========================
              LOCATION
          ========================= */}
          <section className="rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-[0_15px_45px_rgba(23,23,23,0.05)] md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Business Location
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Add your business location so visitors
                can get directions.
              </p>
            </div>

            <div className="space-y-5">

              <Input
                label="Business Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Shop / Office address"
              />

              <Input
                label="Google Maps URL"
                name="maps_url"
                value={formData.maps_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />

            </div>

          </section>

          {/* =========================
              ABOUT
          ========================= */}
          <section className="rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-[0_15px_45px_rgba(23,23,23,0.05)] md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                About You
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Tell visitors a little about yourself or
                your business.
              </p>
            </div>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              placeholder="Write something about yourself or your business..."
              className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9A948A] focus:border-[#B08D57]"
            />

          </section>

          {/* =========================
              ACTIONS
          ========================= */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-[#E5DED1] bg-white px-6 py-3 text-sm font-semibold transition hover:border-[#B08D57]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#B08D57] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Profile..."
                : "Create Profile"}
            </button>

          </div>

        </form>

      </main>

      {/* =========================
          MESSAGE
      ========================= */}
      {message && (
        <div
          className={`fixed right-5 top-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-[0_15px_40px_rgba(23,23,23,0.12)] ${
            messageType === "success"
              ? "border-green-200 text-green-700"
              : "border-red-200 text-red-700"
          }`}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              messageType === "success"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {messageType === "success" ? "✓" : "!"}
          </div>

          <p className="text-sm font-medium">
            {message}
          </p>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setMessageType("");
            }}
            className="ml-2 text-lg leading-none text-[#8A8378] hover:text-[#171717]"
          >
            ×
          </button>
        </div>
      )}
    </div>
    </>
  );
}

// =========================
// REUSABLE INPUT
// =========================
function Input({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#171717]">
        {label}
        {required && (
          <span className="ml-1 text-[#B08D57]">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9A948A] focus:border-[#B08D57]"
      />
    </div>
    
  );
}

export default ProfileSetup;