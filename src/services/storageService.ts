import { supabase } from "../lib/supabaseClient";

type UploadResult =
  | { success: true; publicUrl: string }
  | { success: false; error: any };

export async function uploadImage(userId: number, file: File): Promise<UploadResult> {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("event-image")
    .upload(filePath, file);

  if (error) {
    return { success: false, error };
  }

  const { data: publicUrlData } = supabase.storage
    .from("event-image")
    .getPublicUrl(filePath);

  return {
    success: true,
    publicUrl: publicUrlData.publicUrl,
  };
}

export function getImageUrl(path: string) {
  return supabase.storage
    .from("event-image")
    .getPublicUrl(path);
}


export function deleteImage(path: string) {
  return supabase.storage
    .from("event-image")
    .remove([path]);
}