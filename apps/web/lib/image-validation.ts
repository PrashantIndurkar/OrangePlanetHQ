// Centralized image validation utilities
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function isValidImage(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Unsupported file type" };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)} MB`,
    };
  }
  return { valid: true };
}
