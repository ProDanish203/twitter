export const MediaType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  GIF: "GIF",
  DOCUMENT: "DOCUMENT",
} as const;

export interface Media {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  type: keyof typeof MediaType;

  // Metadata
  filename?: string;
  size?: number; // in bytes
  width?: number; // in pixels
  height?: number; // in pixels
  duration?: number; // in seconds
  altText?: string;
  createdAt: string;
}
