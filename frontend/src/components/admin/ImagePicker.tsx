import { useRef, useState } from "react";
import { Upload, Link2, X, ImageOff, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

/**
 * Reusable image field that accepts EITHER a local device upload
 * (sent to the API, which stores it on Cloudinary and returns its URL)
 * OR a pasted image URL.
 */
export function ImagePicker({
  value,
  onChange,
  aspect = "16 / 10",
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  /** CSS aspect-ratio for the preview box. */
  aspect?: string;
  hint?: string;
}) {
  const isData = value?.startsWith("data:");
  const [mode, setMode] = useState<"upload" | "url">(isData || !value ? "upload" : "url");
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file?: File | null) => {
    setErr(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Please choose an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErr("Image is larger than 4MB — pick a smaller file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      try {
        const { url } = await api<{ url: string }>("/uploads/image", {
          method: "POST",
          body: { image: String(reader.result) },
        });
        onChange(url);
      } catch (e) {
        setErr(e instanceof Error ? `Upload failed: ${e.message}` : "Upload failed.");
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => setErr("Could not read that file.");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Mode toggle */}
      <div className="mb-2 inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-sm">
        {(["upload", "url"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold transition-colors ${
              mode === m ? "bg-card text-primary shadow-sm" : "text-text/60 hover:text-ink"
            }`}
          >
            {m === "upload" ? <Upload style={{ width: 14, height: 14 }} /> : <Link2 style={{ width: 14, height: 14 }} />}
            {m === "upload" ? "Upload" : "URL"}
          </button>
        ))}
      </div>

      {/* Preview */}
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted" style={{ aspectRatio: aspect }}>
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => {
              onChange("");
              setErr(null);
            }}
            aria-label="Remove image"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-ink/60 text-white backdrop-blur transition-colors hover:bg-destructive"
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
          {isData && (
            <span className="absolute bottom-2 left-2 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              Uploaded file
            </span>
          )}
        </div>
      ) : mode === "upload" && uploading ? (
        <div
          className="grid place-items-center rounded-xl border-2 border-dashed border-primary/40 bg-muted/30 text-center"
          style={{ aspectRatio: aspect }}
        >
          <div>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm font-semibold text-ink">Uploading…</p>
          </div>
        </div>
      ) : mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            readFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          className={`grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            drag ? "border-primary bg-primary-pale/50" : "border-border bg-muted/30 hover:border-primary/40"
          }`}
          style={{ aspectRatio: aspect }}
        >
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-pale text-primary">
              <Upload style={{ width: 20, height: 20 }} />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">
              Drop an image here, or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-xs text-text/50">PNG, JPG, or WebP · up to 4MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => readFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="grid place-items-center rounded-xl border border-dashed border-border bg-muted/30 text-text/40" style={{ aspectRatio: aspect }}>
          <div className="text-center">
            <ImageOff className="mx-auto h-8 w-8" />
            <p className="mt-2 text-xs">No image yet — paste a URL below</p>
          </div>
        </div>
      )}

      {/* URL input (only in URL mode) */}
      {mode === "url" && (
        <input
          type="url"
          value={isData ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.example.com/photo.jpg"
          className="mt-2 w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-text/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      )}

      {err && <p className="mt-1.5 text-xs font-medium text-destructive">{err}</p>}
      {hint && !err && <p className="mt-1.5 text-xs text-text/55">{hint}</p>}
    </div>
  );
}
