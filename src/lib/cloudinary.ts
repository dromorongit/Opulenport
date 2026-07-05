import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured(): boolean {
  return !!(CLOUD_NAME && API_KEY && API_SECRET);
}

export function generateUploadSignature(paramsToSign: Record<string, string | number>): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
} {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { ...paramsToSign, timestamp },
    API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: API_KEY!,
    cloudName: CLOUD_NAME!,
  };
}