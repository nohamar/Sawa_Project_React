import { supabase } from "../lib/supabaseClient";

type UploadResult =
  | { success: true; path: string; publicUrl: string; }
  | { success: false; error: any };

export async function uploadImage(userId: number, file: File) {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("event-image")
    .upload(filePath, file);

  if (error) {
    return { success: false, error };
  }

  const { data } = supabase.storage
    .from("event-image")
    .getPublicUrl(filePath);

  return {
    success: true,
    path: filePath,
    publicUrl: data.publicUrl, 
  };
}

export function getImageUrl(path: string) {
  if (!path) {
    console.warn("Image path is empty or undefined");
    return "/images/event_hero.jpg";
  }

  // If it's already a full URL (http), return it as is
  if (path.startsWith("http")) {
    console.log("URL already full:", path);
    return path;
  }

  // If it's a local public path (starts with /), return it as is
  if (path.startsWith("/")) {
    console.log("Local public path:", path);
    return path;
  }

  // Otherwise construct the URL from the Supabase path
  const { data } = supabase.storage
    .from("event-image")
    .getPublicUrl(path);

  const finalUrl = data.publicUrl;
  console.log("🔗 Final URL constructed:", finalUrl);
  console.log("📋 Original path:", path);
  
  return finalUrl;
}

export function deleteImage(path: string) {
  if (!path) return;
  return supabase.storage
    .from("event-image")
    .remove([path]);
}