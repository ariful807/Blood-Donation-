/**
 * Utility functions for Google Drive image formatting and YouTube embeds
 */

/**
 * Automatically converts Google Drive URLs or File IDs to direct Google user content image URLs:
 * Format: https://lh3.googleusercontent.com/d/{IMAGE_ID}
 *
 * Supported formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - Raw Google Drive File ID (alphanumeric 25-45 chars)
 * - Already in https://lh3.googleusercontent.com/d/FILE_ID format
 * - Direct image URLs (Unsplash, imgur, standard http/https, data urls)
 */
export function formatDriveImageUrl(input: string | undefined | null): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Already lh3 format
  if (trimmed.startsWith('https://lh3.googleusercontent.com/d/')) {
    return trimmed;
  }

  // Google Drive file/d/ID pattern
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Google Drive ?id=ID or &id=ID pattern
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }

  // Google Drive /d/ID pattern
  const dPathMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dPathMatch && dPathMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${dPathMatch[1]}`;
  }

  // Raw Google Drive ID (typically 25 to 45 alphanumeric characters with underscores/dashes)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed)) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  return trimmed;
}

/**
 * Parses YouTube video URL / Shorts / Embed URL and returns clean embed URL
 */
export function getYouTubeEmbedUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  // youtu.be/ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
  }
  
  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }

  // youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // Raw 11-char YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return null;
}

/**
 * Extracts YouTube Video ID for thumbnail generation
 */
export function getYouTubeVideoId(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];
  
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return null;
}
