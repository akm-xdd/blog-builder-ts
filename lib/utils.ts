import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { clearAuth } from "./utils/storage"
import { defaults } from "./utils/data"
import { BlockContent, BlockType } from "@/types/editor.types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDefaultContent = (type: BlockType) => {
  return defaults[type]
}

export function isTextImageObject(content: BlockContent): content is { text: string; image: string } {
  return typeof content === "object" && content !== null && "text" in content;
}

export const logout = () => {
  clearAuth();
  window.location.href = "/login";
}

export const generateId = () => crypto.randomUUID();