import { LucideIcon } from "lucide-react";

export type BlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "paragraph"
  | "list"
  | "quote"
  | "code"
  | "image"
  | "video"
  | "text-image"
  | "image-text";


export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: LucideIcon;
}


export interface BlockGroup {
  headings: BlockDefinition[];
  text: BlockDefinition[];
  media: BlockDefinition[];
}

export type BlockContent =
  | string
  | {
      text: string;
      image: string;
    };

export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
}

export type BlockDefaults = Record<
  BlockType,
  string | { text: string; image: string }
>;

export type BlockStyles = Record<BlockType, string>;
