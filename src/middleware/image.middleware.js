import config from "../config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  config.supabase.url,
  config.supabase.service_key,
  
);

const BUCKET = config.supabase.bucket_name ?? "ingredients"; // or just default to ingredient

/**
 * Get a public URL for an image stored in Supabase Storage.
 * @param {string} filePath - Path inside the bucket, e.g. "rice.jpg"
 * @returns {string} Public URL
 */
export function getImageUrl(filePath) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Upload an image buffer to Supabase Storage.
 * @param {string} filePath  - Destination path in bucket, e.g. "garlic.png"
 * @param {Buffer} buffer    - File contents
 * @param {string} mimeType  - e.g. "image/jpeg"
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadImage(filePath, buffer, mimeType) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  return getImageUrl(filePath);
}

/**
 * Delete an image from Supabase Storage.
 * @param {string} filePath - Path inside the bucket
 */
export async function deleteImage(filePath) {
  const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}
