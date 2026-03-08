const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB hard limit before processing

export function isSafeCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export async function compressImage(file: File, maxSizeKB = 500): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const maxDim = 1800;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= maxSizeKB * 1024 || quality <= 0.2) {
              resolve(blob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          "image/jpeg",
          quality
        );
      };
      tryCompress();
    };
    img.src = url;
  });
}

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, and PDF files are accepted");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("File must be under 10 MB");
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars not configured");
  }

  const isPDF = file.type === "application/pdf";
  const uploadBlob = isPDF ? file : await compressImage(file);

  const formData = new FormData();
  formData.append("file", uploadBlob, isPDF ? file.name : "invoice.jpg");
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "apptracker/invoices");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${isPDF ? "raw" : "image"}/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}
