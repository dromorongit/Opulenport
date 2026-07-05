"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type ImageUploaderProps = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  folder?: string;
  maxFiles?: number;
};

type UploadState = {
  uploading: boolean;
  progress: number;
  error: string | null;
};

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = "opulenport",
  maxFiles = 5,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const checkConfiguration = useCallback(async () => {
    if (isConfigured !== null) return isConfigured;
    
    try {
      const res = await fetch("/api/admin/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      
      if (res.status === 503) {
        setIsConfigured(false);
        return false;
      }
      
      setIsConfigured(res.ok);
      return res.ok;
    } catch {
      setIsConfigured(false);
      return false;
    }
  }, [folder, isConfigured]);

  useEffect(() => {
    checkConfiguration();
  }, [checkConfiguration]);

  const uploadFile = async (file: File): Promise<string> => {
    const configured = await checkConfiguration();
    
    if (!configured) {
      throw new Error("Image upload is not available yet");
    }

    const signatureRes = await fetch("/api/admin/cloudinary-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });

    if (!signatureRes.ok) {
      throw new Error("Failed to get upload signature");
    }

    const { signature, timestamp, apiKey, cloudName } = await signatureRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadState((prev) => ({ ...prev, progress }));
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.response);
              resolve(result.secure_url);
            } catch {
              reject(new Error("Invalid response from upload"));
            }
          } else {
            reject(new Error("Upload failed"));
          }
        }
      };

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        true
      );
      xhr.send(formData);
    });
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (multiple) {
      const remainingSlots = maxFiles - images.length;
      const filesToUpload = fileArray.slice(0, remainingSlots);
      
      if (filesToUpload.length === 0) {
        setUploadState({ uploading: false, progress: 0, error: "Maximum number of images reached" });
        return;
      }
    }

    setUploadState({ uploading: true, progress: 0, error: null });

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image`);
        continue;
      }

      try {
        const url = await uploadFile(file);
        uploadedUrls.push(url);
      } catch (error) {
        errors.push(String(error));
      }
    }

    if (uploadedUrls.length > 0) {
      if (multiple) {
        onChange([...images, ...uploadedUrls].slice(0, maxFiles));
      } else {
        onChange(uploadedUrls[0]);
      }
    }

    if (errors.length > 0 && uploadedUrls.length === 0) {
      setUploadState({ uploading: false, progress: 0, error: errors.join(", ") });
    } else {
      setUploadState({ uploading: false, progress: 0, error: errors.length > 0 ? errors.join(", ") : null });
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
    } else {
      onChange("");
    }
  };

  const handleFallbackAdd = () => {
    if (fallbackUrl.trim()) {
      if (multiple) {
        const newImages = [...images, fallbackUrl.trim()].slice(0, maxFiles);
        onChange(newImages);
        setFallbackUrl("");
      } else {
        onChange(fallbackUrl.trim());
        setFallbackUrl("");
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-3">
      {isConfigured === false && (
        <div className="rounded-md border border-gold/20 bg-navy-light p-3">
          <p className="text-sm text-cream/70 mb-2">
            Image upload is not available yet — you can paste an image URL directly below
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={fallbackUrl}
              onChange={(e) => setFallbackUrl(e.target.value)}
              className="flex-1 rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="button"
              onClick={handleFallbackAdd}
              disabled={!fallbackUrl.trim()}
              className="rounded-md border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {isConfigured !== false && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
              dragOver ? "border-gold bg-gold/5" : "border-gold/20 bg-navy hover:border-gold/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleInputChange}
              className="hidden"
            />
            <svg
              className="mb-2 h-8 w-8 text-gold/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88 7.9 4 4 0 1116-8A6 6 0 0117 8a4 4 0 01-6.88 5.9"
              />
            </svg>
            <p className="text-sm text-cream/80">
              Drop images here or click to browse
            </p>
            {uploadState.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/80">
                <div className="text-center">
                  <div className="mb-1 text-sm text-gold">Uploading...</div>
                  <div className="h-2 w-32 rounded-full bg-navy-light">
                    <div
                      className="h-full rounded-full bg-gold transition-all"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {uploadState.error && !uploadState.uploading && (
            <p className="text-xs text-rose-400">{uploadState.error}</p>
          )}
        </>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt="Uploaded"
                className="h-24 w-full rounded-md object-cover border border-gold/20"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 rounded-full bg-navy text-cream hover:bg-gold hover:text-navy opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}