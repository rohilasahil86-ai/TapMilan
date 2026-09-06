import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";

function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
profile_image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
  loadProfile();
}, [navigate]);

useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
    setMessageType("");
  }, 3000);

  return () => clearTimeout(timer);
}, [message]);

  const loadProfile = async () => {
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
  navigate("/login", { replace: true });
  return;
}

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      setMessage("Unable to load your profile.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    setForm({
      username: data.username || "",
      full_name: data.full_name || "",
      business_name: data.business_name || "",
      designation: data.designation || "",
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      email: data.email || "",
      website: data.website || "",
      instagram: data.instagram || "",
      linkedin: data.linkedin || "",
      facebook: data.facebook || "",
      youtube: data.youtube || "",
      address: data.address || "",
      maps_url: data.maps_url || "",
      bio: data.bio || "",
      profile_image_url: data.profile_image_url || "",
    });

    setLoading(false);
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


 // =========================
// PROFILE PHOTO UPLOAD
// =========================

const handlePhotoUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setMessage("Please select a valid image.");
    setMessageType("error");
    return;
  }

  // Original file hard limit: 5MB
  if (file.size > 5 * 1024 * 1024) {
    setMessage("Image must be less than 5MB.");
    setMessageType("error");
    return;
  }

  setUploadingPhoto(true);
  setMessage("");
  setMessageType("");

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      navigate("/");
      return;
    }

    // =========================
    // RESIZE + COMPRESS IMAGE
    // =========================

    const image = new Image();

    const imageUrl = URL.createObjectURL(file);

    image.src = imageUrl;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const MAX_SIZE = 800;

    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      }
    } else {
      if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }
    }

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, width, height);

    URL.revokeObjectURL(imageUrl);

    // Convert to WebP and compress
    const compressedFile = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(
            new File(
              [blob],
              "profile.webp",
              {
                type: "image/webp",
              }
            )
          );
        },
        "image/webp",
        0.82
      );
    });

    // Final safety check
    if (compressedFile.size > 500 * 1024) {
      setMessage("Unable to optimize image enough. Please choose another photo.");
      setMessageType("error");
      return;
    }

    // =========================
    // UPLOAD TO SUPABASE
    // =========================

    const filePath = `${user.id}/profile.webp`;

    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(filePath, compressedFile, {
        upsert: true,
        contentType: "image/webp",
      });

    if (uploadError) {
      console.error("UPLOAD ERROR:", uploadError);
      setMessage(uploadError.message);
      setMessageType("error");
      return;
    }

    // =========================
    // GET PUBLIC URL
    // =========================

    const { data: publicUrlData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    const publicUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

    setForm((prev) => ({
      ...prev,
      profile_image_url: publicUrl,
    }));

    setMessage("Photo optimized and uploaded successfully.");
    setMessageType("success");

  } catch (error) {
    console.error("PHOTO ERROR:", error);
    setMessage("Unable to process photo.");
    setMessageType("error");
  } finally {
    setUploadingPhoto(false);
  }
};

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!form.full_name.trim()) {
      setMessage("Full name is required.");
      setMessageType("error");
      return;
    }

    if (!form.username.trim()) {
      setMessage("Username is required.");
      setMessageType("error");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }

    const cleanUsername = form.username.trim();

    // Check username uniqueness
    const { data: existingUser, error: usernameError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", cleanUsername)
      .neq("id", user.id)
      .maybeSingle();

    if (usernameError) {
      setMessage("Unable to check username.");
      setMessageType("error");
      setSaving(false);
      return;
    }

    if (existingUser) {
      setMessage("This username is already taken.");
      setMessageType("error");
      setSaving(false);
      return;
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername,
        full_name: form.full_name.trim(),
        business_name: form.business_name.trim(),
        designation: form.designation.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        instagram: form.instagram.trim(),
        linkedin: form.linkedin.trim(),
        facebook: form.facebook.trim(),
        youtube: form.youtube.trim(),
        address: form.address.trim(),
        maps_url: form.maps_url.trim(),
        bio: form.bio.trim(),
        profile_image_url: form.profile_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setMessageType("success");

    setSaving(false);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center">
        <p className="text-sm text-[#6B665D]">Loading profile...</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <>
    <SEO
      title="Edit Profile | TapMilan"
      description="Edit your TapMilan digital business card profile."
      noIndex={true}
    />

    <div className="min-h-screen bg-[#F5F2EA] text-[#171717]">

      {/* HEADER */}
      <header className="border-b border-[#E5DED1] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B08D57]">
              TapMilan
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              Edit Profile
            </h1>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-[#E5DED1] px-5 py-2.5 text-sm font-semibold transition hover:border-[#B08D57]"
          >
            Back to Dashboard
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-5xl px-6 py-10">

        <form onSubmit={handleSave} className="space-y-6">

          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <section className="rounded-2xl border border-[#E5DED1] bg-white p-6 md:p-8">

            {/* PROFILE PHOTO */}
<div className="mb-8 flex flex-col items-center border-b border-[#E5DED1] pb-8 sm:flex-row sm:items-center sm:gap-6">
  
  <div className="relative">
    {form.profile_image_url ? (
      <img
        src={form.profile_image_url}
        alt="Profile"
        className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md ring-1 ring-[#E5DED1]"
      />
    ) : (
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F5F2EA] text-3xl font-semibold text-[#B08D57] ring-1 ring-[#E5DED1]">
        {form.full_name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    )}
  </div>

  <div className="mt-4 text-center sm:mt-0 sm:text-left">
    <h3 className="text-base font-semibold text-[#171717]">
      Profile Photo
    </h3>

    <p className="mt-1 text-sm text-[#6B665D]">
      Add a professional photo for your Smart Card.
    </p>

    <label className="mt-4 inline-flex cursor-pointer items-center rounded-xl bg-[#171717] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]">
      {uploadingPhoto ? "Uploading..." : "Choose Photo"}

      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        disabled={uploadingPhoto}
        className="hidden"
      />
    </label>

    <p className="mt-2 text-xs text-[#9A948A]">
      JPG, PNG or WEBP • Optimized automatically
    </p>
  </div>

</div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Your main identity shown on your Smart Card.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />

              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />

              <Input
                label="Business Name"
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
              />

              <Input
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
              />

            </div>
          </section>

          {/* =========================
              CONTACT INFORMATION
          ========================= */}

          <section className="rounded-2xl border border-[#E5DED1] bg-white p-6 md:p-8">

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
                value={form.phone}
                onChange={handleChange}
              />

              <Input
                label="WhatsApp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <Input
                label="Website"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

            </div>
          </section>

          {/* =========================
              SOCIAL PROFILES
          ========================= */}

          <section className="rounded-2xl border border-[#E5DED1] bg-white p-6 md:p-8">

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
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
              />

              <Input
                label="LinkedIn"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />

              <Input
                label="Facebook"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
              />

              <Input
                label="YouTube"
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@username"
              />

            </div>
          </section>

          {/* =========================
              LOCATION
          ========================= */}

          <section className="rounded-2xl border border-[#E5DED1] bg-white p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Business Location
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Add your Google Maps location so visitors can get
                directions to your business.
              </p>
            </div>

            <div className="space-y-5">

              <Input
                label="Business Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Shop / Office address"
              />

              <Input
                label="Google Maps URL"
                name="maps_url"
                value={form.maps_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />

              <div className="rounded-xl bg-[#F5F2EA] p-4">

                <p className="text-sm font-semibold text-[#171717]">
                  How to add your location
                </p>

                <ol className="mt-3 space-y-2 text-sm text-[#6B665D]">
                  <li>1. Open Google Maps.</li>
                  <li>2. Find your shop or office.</li>
                  <li>3. Tap Share.</li>
                  <li>4. Copy the Google Maps link.</li>
                  <li>5. Paste it above.</li>
                </ol>

              </div>

            </div>

          </section>

          {/* =========================
              ABOUT
          ========================= */}

          <section className="rounded-2xl border border-[#E5DED1] bg-white p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                About You
              </h2>

              <p className="mt-1 text-sm text-[#6B665D]">
                Tell visitors a little about yourself or your business.
              </p>
            </div>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Write something about yourself or your business..."
              className="w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9A948A] focus:border-[#B08D57]"
            />

          </section>

          {message && (
  <div
    className={`fixed right-5 top-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 shadow-[0_15px_40px_rgba(23,23,23,0.12)] ${
      messageType === "success"
        ? "border-green-200 bg-white text-green-700"
        : "border-red-200 bg-white text-red-700"
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
              disabled={saving}
              className="rounded-xl bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </main>
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
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#171717]">
        {label}
        {required && <span className="ml-1 text-[#B08D57]">*</span>}
      </label>

      <input
        type="text"
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

export default EditProfile;