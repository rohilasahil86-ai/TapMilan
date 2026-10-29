import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const BUCKET = "showcase-images";
const MAX_IMAGES = 5;
const MAX_COMPRESSED_SIZE = 280 * 1024; // Keep below the bucket's 300 KB limit.
const MAX_IMAGE_DIMENSION = 1400;

const CATEGORIES = [
  "Products",
  "Services",
  "Properties",
  "Portfolio",
  "Food & Beverages",
  "Fashion & Beauty",
  "Fitness",
  "Manufacturing",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Products",
  price: "",
};

function fileKey(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function getErrorMessage(error, fallback = "Something went wrong.") {
  if (error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

async function canvasToWebp(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Your browser could not process this image."));
      },
      "image/webp",
      quality
    );
  });
}

async function compressImage(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`"${file.name}" is not a supported image. Choose JPG, PNG or WebP.`);
  }

  const source = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error(`Could not open "${file.name}". Try another image.`));
      image.src = source;
    });

    let scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
    let quality = 0.82;
    let blob = null;

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not prepare this image.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      blob = await canvasToWebp(canvas, quality);
      canvas.width = 1;
      canvas.height = 1;

      if (blob.size <= MAX_COMPRESSED_SIZE) return blob;

      if (quality > 0.5) {
        quality = Math.max(0.5, quality - 0.1);
      } else {
        scale *= 0.82;
        quality = 0.74;
      }
    }

    if (!blob || blob.size > MAX_COMPRESSED_SIZE) {
      throw new Error(`"${file.name}" could not be compressed below 280 KB. Try a simpler image.`);
    }

    return blob;
  } finally {
    URL.revokeObjectURL(source);
  }
}

export default function ShowcaseManager() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (cancelled) return;

      if (authError || !authData?.user) {
        setFeedback({
          type: "error",
          text: "Please log in again to manage your business showcase.",
        });
        setLoading(false);
        return;
      }

      setUser(authData.user);
      await loadItems(authData.user.id, () => cancelled);
      if (!cancelled) setLoading(false);
    }

    loadInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const previews = selectedFiles.map((file) => ({
      key: fileKey(file),
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setSelectedPreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles]);

  async function loadItems(userId = user?.id, isCancelled = () => false) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("showcase_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (isCancelled()) return;

    if (error) {
      console.error("SHOWCASE LOAD ERROR:", error);
      setFeedback({ type: "error", text: `Unable to load showcase items: ${error.message}` });
      return;
    }

    const itemsWithImages = await Promise.all(
      (data || []).map(async (item) => {
        const paths = Array.isArray(item.image_paths) ? item.image_paths : [];
        const imageUrls = await Promise.all(
          paths.map(async (path) => {
            const { data: signedData, error: signedError } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(path, 3600);

            if (signedError) {
              console.warn("Could not create owner preview URL:", signedError.message);
              return null;
            }
            return signedData?.signedUrl || null;
          })
        );

        return { ...item, imageUrls };
      })
    );

    if (!isCancelled()) setItems(itemsWithImages);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setSelectedFiles([]);
    setEditingId(null);
    setFeedback({ type: "", text: "" });
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "Other",
      price: item.price || "",
    });
    setSelectedFiles([]);
    setFeedback({ type: "", text: "" });
    document.getElementById("showcase-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addFiles(fileList) {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    const editingItem = items.find((item) => item.id === editingId);
    const existingCount = Array.isArray(editingItem?.image_paths) ? editingItem.image_paths.length : 0;
    const remaining = MAX_IMAGES - existingCount - selectedFiles.length;

    if (incoming.length > remaining) {
      setFeedback({
        type: "error",
        text: `You can add ${Math.max(0, remaining)} more photo(s). Each item can have up to ${MAX_IMAGES} photos in total.`,
      });
      return;
    }

    const unsupported = incoming.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type));
    if (unsupported) {
      setFeedback({ type: "error", text: `"${unsupported.name}" is not supported. Choose JPG, PNG or WebP images.` });
      return;
    }

    setSelectedFiles((current) => [...current, ...incoming]);
    setFeedback({ type: "", text: "" });
  }

  function removeSelectedFile(key) {
    setSelectedFiles((current) => current.filter((file) => fileKey(file) !== key));
  }

  async function saveItem(event) {
    event.preventDefault();
    if (!user || saving) return;

    const title = form.title.trim();
    if (!title) {
      setFeedback({ type: "error", text: "Please enter a title for this item." });
      return;
    }

    if (title.length > 120 || form.description.trim().length > 1000 || form.price.trim().length > 50) {
      setFeedback({ type: "error", text: "Please check the title, description and price character limits." });
      return;
    }

    const existingItem = items.find((item) => item.id === editingId);
    const existingPaths = Array.isArray(existingItem?.image_paths) ? existingItem.image_paths : [];
    if (existingPaths.length + selectedFiles.length > MAX_IMAGES) {
      setFeedback({ type: "error", text: `Each item can have up to ${MAX_IMAGES} photos. Remove a photo before adding another.` });
      return;
    }

    setSaving(true);
    setFeedback({ type: "info", text: "Saving item and processing photos…" });

    let itemId = editingId;
    let createdNewRow = false;
    const uploadedPaths = [];

    try {
      if (!itemId) {
        const { data: inserted, error: insertError } = await supabase
          .from("showcase_items")
          .insert({
            user_id: user.id,
            title,
            description: form.description.trim(),
            category: form.category,
            price: form.price.trim(),
            image_paths: [],
            is_published: false,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        itemId = inserted.id;
        createdNewRow = true;
      }

      for (const file of selectedFiles) {
        const compressed = await compressImage(file);
        const randomPart = typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const path = `${user.id}/${itemId}/${randomPart}.webp`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, compressed, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
      }

      const nextPaths = [...existingPaths, ...uploadedPaths];
      const { error: updateError } = await supabase
        .from("showcase_items")
        .update({
          title,
          description: form.description.trim(),
          category: form.category,
          price: form.price.trim(),
          image_paths: nextPaths,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;
    } catch (error) {
      if (uploadedPaths.length) {
        const { error: cleanupError } = await supabase.storage.from(BUCKET).remove(uploadedPaths);
        if (cleanupError) console.error("UPLOAD CLEANUP ERROR:", cleanupError);
      }
      if (createdNewRow && itemId) {
        const { error: rowCleanupError } = await supabase
          .from("showcase_items")
          .delete()
          .eq("id", itemId)
          .eq("user_id", user.id);
        if (rowCleanupError) console.error("DRAFT CLEANUP ERROR:", rowCleanupError);
      }
      setFeedback({ type: "error", text: getErrorMessage(error, "Unable to save this item.") });
      setSaving(false);
      return;
    }

    setSaving(false);
    setForm(EMPTY_FORM);
    setSelectedFiles([]);
    setEditingId(null);
    setFeedback({ type: "success", text: "Item saved. New items start as drafts—publish them when you are ready." });
    await loadItems(user.id);
  }

  async function togglePublished(item) {
    if (!user || busyItemId) return;
    setBusyItemId(item.id);
    setFeedback({ type: "info", text: item.is_published ? "Unpublishing item…" : "Publishing item…" });

    const { error } = await supabase
      .from("showcase_items")
      .update({ is_published: !item.is_published, updated_at: new Date().toISOString() })
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (error) {
      setFeedback({ type: "error", text: getErrorMessage(error, "Could not change publishing status.") });
    } else {
      setFeedback({ type: "success", text: item.is_published ? "Item unpublished from your public profile." : "Item published to your public profile." });
      await loadItems(user.id);
    }
    setBusyItemId(null);
  }

  async function removePhoto(item, index) {
    if (!user || busyItemId) return;
    const paths = Array.isArray(item.image_paths) ? item.image_paths : [];
    const path = paths[index];
    if (!path) return;

    setBusyItemId(item.id);
    const nextPaths = paths.filter((_, currentIndex) => currentIndex !== index);

    // Detach the path from the item first. If the database update fails, keep the file untouched.
    const { error: updateError } = await supabase
      .from("showcase_items")
      .update({ image_paths: nextPaths, updated_at: new Date().toISOString() })
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (updateError) {
      setFeedback({ type: "error", text: `Photo was not removed: ${updateError.message}` });
      setBusyItemId(null);
      return;
    }

    const { error: storageError } = await supabase.storage.from(BUCKET).remove([path]);
    if (storageError) {
      setFeedback({ type: "error", text: `Photo was disconnected from this item, but the stored file could not be deleted: ${storageError.message}` });
    } else {
      setFeedback({ type: "success", text: "Photo removed." });
    }

    await loadItems(user.id);
    setBusyItemId(null);
  }

  async function deleteItem(item) {
    if (!user || busyItemId) return;
    const confirmed = window.confirm(`Delete "${item.title}" and its photos? This cannot be undone.`);
    if (!confirmed) return;

    setBusyItemId(item.id);
    const paths = Array.isArray(item.image_paths) ? item.image_paths : [];

    const { error: deleteError } = await supabase
      .from("showcase_items")
      .delete()
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (deleteError) {
      setFeedback({ type: "error", text: `Could not delete item: ${deleteError.message}` });
      setBusyItemId(null);
      return;
    }

    if (paths.length) {
      const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
      if (storageError) {
        setFeedback({ type: "error", text: `Item deleted, but one or more stored photos could not be removed: ${storageError.message}` });
      } else {
        setFeedback({ type: "success", text: "Item and photos deleted." });
      }
    } else {
      setFeedback({ type: "success", text: "Item deleted." });
    }

    if (editingId === item.id) resetForm();
    await loadItems(user.id);
    setBusyItemId(null);
  }

  if (loading) {
    return (
      <section className="mt-8 rounded-3xl border border-[#E5DED1] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-sm text-[#6B665D]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5DED1] border-t-[#B08D57]" />
          Loading your business showcase…
        </div>
      </section>
    );
  }

  const editingItem = items.find((item) => item.id === editingId);
  const existingPaths = Array.isArray(editingItem?.image_paths) ? editingItem.image_paths : [];
  const imagesRemaining = Math.max(0, MAX_IMAGES - existingPaths.length - selectedFiles.length);

  return (
    <section className="mt-8 scroll-mt-6 rounded-3xl border border-[#E5DED1] bg-white p-5 shadow-[0_15px_45px_rgba(23,23,23,0.05)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B08D57]">Business Management</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">Business Showcase</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B665D]">
            Add products, properties, services, menu items or portfolio work. Only published items appear on your public profile.
          </p>
        </div>
        <div className="shrink-0 rounded-xl bg-[#F5F2EA] px-4 py-3">
          <p className="text-xs text-[#8A8378]">Your items</p>
          <p className="mt-1 text-2xl font-semibold text-[#171717]">{items.length}</p>
          <p className="text-xs text-[#6B665D]">{items.filter((item) => item.is_published).length} published</p>
        </div>
      </div>

      {feedback.text && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-[#E5DED1] bg-[#F5F2EA] text-[#6B665D]"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div id="showcase-editor" className="mt-7 scroll-mt-6 rounded-2xl border border-[#E5DED1] bg-[#FCFBF8] p-4 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#171717]">{editingId ? "Edit showcase item" : "Add a new item"}</h3>
            <p className="mt-1 text-sm text-[#6B665D]">Complete the details and add up to five photos.</p>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-[#E5DED1] bg-white px-3 py-2 text-sm font-medium text-[#6B665D] hover:border-[#B08D57]">
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={saveItem} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-[#171717]">
              Item name <span className="text-red-600">*</span>
              <input
                className="mt-2 w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#A19A8F] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
                maxLength={120}
                required
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="e.g. 3 BHK apartment, Bridal makeup, Herbal oil"
              />
              <span className="mt-1 block text-right text-xs text-[#8A8378]">{form.title.length}/120</span>
            </label>

            <label className="block text-sm font-medium text-[#171717]">
              Category
              <select
                className="mt-2 w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              >
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium text-[#171717] md:col-span-2">
              Description
              <textarea
                className="mt-2 w-full resize-y rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#A19A8F] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
                maxLength={1000}
                rows={4}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Share the details customers should know…"
              />
              <span className="mt-1 block text-right text-xs text-[#8A8378]">{form.description.length}/1000</span>
            </label>

            <label className="block text-sm font-medium text-[#171717] md:col-span-2">
              Price or price label <span className="font-normal text-[#8A8378]">(optional)</span>
              <input
                className="mt-2 w-full rounded-xl border border-[#E5DED1] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#A19A8F] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
                maxLength={50}
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                placeholder="e.g. ₹1,499, ₹45 lakh, Contact for price"
              />
            </label>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-[#171717]">Photos</label>
              <span className="text-xs text-[#8A8378]">{MAX_IMAGES - imagesRemaining}/5 selected or saved</span>
            </div>

            {editingId && existingPaths.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#8A8378]">Current photos</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {existingPaths.map((path, index) => {
                    const url = editingItem?.imageUrls?.[index];
                    return (
                      <div key={path} className="overflow-hidden rounded-xl border border-[#E5DED1] bg-white">
                        <div className="aspect-square bg-[#F5F2EA]">
                          {url ? (
                            <img src={url} alt={`${editingItem.title} ${index + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#8A8378]">Preview unavailable</div>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={busyItemId === editingItem.id}
                          onClick={() => removePhoto(editingItem, index)}
                          className="w-full border-t border-[#E5DED1] px-2 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {busyItemId === editingItem.id ? "Working…" : "Remove photo"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={(event) => {
                event.preventDefault();
                if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                addFiles(event.dataTransfer.files);
              }}
              className={`rounded-2xl border-2 border-dashed p-5 text-center transition sm:p-8 ${dragging ? "border-[#B08D57] bg-[#F5F2EA]" : "border-[#DCD4C7] bg-white hover:border-[#B08D57]"}`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-[#9C7B4A]">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.5 14.5v4A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-4" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#171717]">Choose photos or drag them here</p>
              <p className="mt-1 text-xs leading-5 text-[#8A8378]">JPG, PNG or WebP · up to 5 photos per item · compressed to under 280 KB each</p>
              <label className={`mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${imagesRemaining > 0 ? "bg-[#171717] text-white hover:bg-[#2A2A2A]" : "cursor-not-allowed bg-[#E8E3DA] text-[#8A8378]"}`}>
                Select files
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={imagesRemaining === 0 || saving}
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>

            {selectedPreviews.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#171717]">New photos ({selectedPreviews.length})</p>
                  <button type="button" onClick={() => setSelectedFiles([])} className="text-xs font-medium text-red-700 hover:underline">Clear selection</button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {selectedPreviews.map((preview) => (
                    <div key={preview.key} className="overflow-hidden rounded-xl border border-[#E5DED1] bg-white">
                      <div className="aspect-square bg-[#F5F2EA]">
                        <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="truncate text-xs text-[#6B665D]" title={preview.name}>{preview.name}</p>
                        <button type="button" onClick={() => removeSelectedFile(preview.key)} className="mt-1 text-xs font-medium text-red-700 hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E5DED1] pt-5 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-[#B08D57] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#967544] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving item…" : editingId ? "Save changes" : "Save item as draft"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} disabled={saving} className="rounded-xl border border-[#E5DED1] px-5 py-3.5 text-sm font-semibold text-[#6B665D] transition hover:border-[#B08D57] disabled:opacity-50">
                Cancel edit
              </button>
            )}
            <p className="text-xs leading-5 text-[#8A8378] sm:ml-auto">Saving creates a draft. Publish it below when it's ready for customers.</p>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[#171717]">Your items</h3>
            <p className="mt-1 text-sm text-[#6B665D]">Edit details, manage photos, or control what customers can see.</p>
          </div>
          <p className="text-xs text-[#8A8378]">Published items appear on your public profile.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DCD4C7] bg-[#FCFBF8] px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EA] text-[#9C7B4A]">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.7">
                <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-11Z" />
                <path d="M8 6V4.5A.5.5 0 0 1 8.5 4h7a.5.5 0 0 1 .5.5V6M8 11h8M8 15h5" strokeLinecap="round" />
              </svg>
            </div>
            <h4 className="mt-4 text-base font-semibold text-[#171717]">Your showcase starts here</h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B665D]">Add a product, property, service, menu item or project above. You can keep it as a draft until you are ready to publish.</p>
            <button type="button" onClick={() => document.getElementById("showcase-editor")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="mt-5 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]">Add first item</button>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {items.map((item) => {
              const paths = Array.isArray(item.image_paths) ? item.image_paths : [];
              const previewUrls = Array.isArray(item.imageUrls) ? item.imageUrls.filter(Boolean) : [];
              const itemBusy = busyItemId === item.id;

              return (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-[#E5DED1] bg-white transition hover:border-[#D3C2A7]">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                    <div className="grid h-28 w-full shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-xl bg-[#F5F2EA] sm:h-28 sm:w-32">
                      {previewUrls.length > 0 ? previewUrls.slice(0, 4).map((url, index) => (
                        <img key={`${item.id}-thumb-${index}`} src={url} alt="" className={`h-full w-full object-cover ${previewUrls.length === 1 ? "col-span-2 row-span-2" : ""}`} />
                      )) : (
                        <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-1 text-[#A19A8F]">
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
                            <circle cx="8.5" cy="9" r="1.5" />
                            <path d="m5 17 5-5 3 3 2-2 4 4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-[10px]">No photo preview</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wide text-[#B08D57]">{item.category || "Other"}</p>
                          <h4 className="mt-1 break-words text-base font-semibold text-[#171717]">{item.title}</h4>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${item.is_published ? "border border-green-200 bg-green-50 text-green-800" : "border border-[#E5DED1] bg-[#F5F2EA] text-[#6B665D]"}`}>
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </div>

                      {item.price && <p className="mt-1 text-sm font-semibold text-[#171717]">{item.price}</p>}
                      {item.description && <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-5 text-[#6B665D]">{item.description}</p>}
                      <p className="mt-2 text-xs text-[#8A8378]">{paths.length} of {MAX_IMAGES} photos</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-[#EEE8DF] bg-[#FCFBF8] p-3 sm:px-4">
                    <button type="button" onClick={() => startEdit(item)} disabled={itemBusy || saving} className="rounded-lg border border-[#E5DED1] bg-white px-3.5 py-2 text-xs font-semibold text-[#171717] transition hover:border-[#B08D57] disabled:opacity-50">Edit details/photos</button>
                    <button type="button" onClick={() => togglePublished(item)} disabled={itemBusy || saving} className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition disabled:opacity-50 ${item.is_published ? "border border-[#E5DED1] bg-white text-[#6B665D] hover:border-[#B08D57]" : "bg-[#171717] text-white hover:bg-[#2A2A2A]"}`}>
                      {itemBusy ? "Working…" : item.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" onClick={() => deleteItem(item)} disabled={itemBusy || saving} className="ml-auto rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50">
                      {itemBusy ? "Working…" : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
