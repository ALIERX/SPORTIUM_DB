/**
 * SPORTIUM - Storage Utilities
 * 
 * Helper functions per upload e gestione file in Supabase Storage
 */

import { createClient } from './client';

const supabase = createClient();

// ============================================
// BUCKET NAMES
// ============================================

export const BUCKETS = {
  AUCTION_IMAGES: 'auction-images',
  USER_AVATARS: 'user-avatars',
  REWARD_IMAGES: 'reward-images',
  QUIZ_IMAGES: 'quiz-images',
} as const;

// ============================================
// UPLOAD FUNCTIONS
// ============================================

/**
 * Upload auction image
 */
export async function uploadAuctionImage(
  file: File,
  auctionId: string
): Promise<{ url: string | null; error: any }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${auctionId}-${Date.now()}.${fileExt}`;
  const filePath = `auctions/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.AUCTION_IMAGES)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { url: null, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKETS.AUCTION_IMAGES)
    .getPublicUrl(filePath);

  return { url: publicUrl, error: null };
}

/**
 * Upload user avatar
 */
export async function uploadUserAvatar(
  file: File,
  userId: string
): Promise<{ url: string | null; error: any }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Delete old avatar if exists
  await supabase.storage
    .from(BUCKETS.USER_AVATARS)
    .remove([filePath]);

  const { data, error } = await supabase.storage
    .from(BUCKETS.USER_AVATARS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Upload error:', error);
    return { url: null, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKETS.USER_AVATARS)
    .getPublicUrl(filePath);

  return { url: publicUrl, error: null };
}

/**
 * Upload reward image
 */
export async function uploadRewardImage(
  file: File,
  rewardId: string
): Promise<{ url: string | null; error: any }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${rewardId}-${Date.now()}.${fileExt}`;
  const filePath = `rewards/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.REWARD_IMAGES)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { url: null, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKETS.REWARD_IMAGES)
    .getPublicUrl(filePath);

  return { url: publicUrl, error: null };
}

/**
 * Upload quiz image
 */
export async function uploadQuizImage(
  file: File,
  questionId: string
): Promise<{ url: string | null; error: any }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${questionId}-${Date.now()}.${fileExt}`;
  const filePath = `questions/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.QUIZ_IMAGES)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { url: null, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKETS.QUIZ_IMAGES)
    .getPublicUrl(filePath);

  return { url: publicUrl, error: null };
}

// ============================================
// DELETE FUNCTIONS
// ============================================

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<{ success: boolean; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * Delete auction image
 */
export async function deleteAuctionImage(
  imageUrl: string
): Promise<{ success: boolean; error: any }> {
  const filePath = getFilePathFromUrl(imageUrl);
  return deleteFile(BUCKETS.AUCTION_IMAGES, filePath);
}

/**
 * Delete user avatar
 */
export async function deleteUserAvatar(
  userId: string
): Promise<{ success: boolean; error: any }> {
  const filePath = `${userId}/avatar.*`;
  return deleteFile(BUCKETS.USER_AVATARS, filePath);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get file path from public URL
 */
export function getFilePathFromUrl(url: string): string {
  const urlParts = url.split('/');
  const bucketIndex = urlParts.indexOf('public') + 1;
  return urlParts.slice(bucketIndex + 1).join('/');
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return publicUrl;
}

/**
 * Create signed URL (for private files)
 */
export async function createSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error('Signed URL error:', error);
    return { url: null, error };
  }

  return { url: data.signedUrl, error: null };
}

/**
 * List files in a bucket
 */
export async function listFiles(
  bucket: string,
  folder?: string
): Promise<{ files: any[] | null; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('List files error:', error);
    return { files: null, error };
  }

  return { files: data, error: null };
}

/**
 * Get file size in bytes
 */
export async function getFileSize(
  bucket: string,
  filePath: string
): Promise<{ size: number | null; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(filePath);

  if (error || !data || data.length === 0) {
    return { size: null, error: error || 'File not found' };
  }

  return { size: data[0].metadata?.size || null, error: null };
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): { valid: boolean; error: string | null } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type must be one of: ${allowedTypes.join(', ')}` 
    };
  }

  return { valid: true, error: null };
}

/**
 * Convert File to Base64 (for preview)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Buckets
  BUCKETS,
  
  // Upload
  uploadAuctionImage,
  uploadUserAvatar,
  uploadRewardImage,
  uploadQuizImage,
  
  // Delete
  deleteFile,
  deleteAuctionImage,
  deleteUserAvatar,
  
  // Utils
  getFilePathFromUrl,
  getPublicUrl,
  createSignedUrl,
  listFiles,
  getFileSize,
  validateFile,
  fileToBase64,
  compressImage,
};
