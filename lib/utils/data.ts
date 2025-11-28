import {
  Type,
  AlignLeft,
  List,
  Quote,
  Code,
  ImageIcon,
  VideoIcon,
} from "lucide-react";

import {
  BlockDefaults,
  BlockStyles,
  BlockGroup,
} from "@/types/editor.types";


export const defaults: BlockDefaults = {
  heading1: "New Heading 1",
  heading2: "New Heading 2",
  heading3: "New Heading 3",
  heading4: "New Heading 4",

  paragraph: "Start typing...",
  list: "List item 1\nList item 2",
  quote: "Enter your quote here",
  code: 'const example = "code";',

  image: "",
  video: "",
  "text-image": "",
  "image-text": "",
};

export const styles: BlockStyles = {
  heading1: "text-4xl font-bold leading-tight",
  heading2: "text-3xl font-bold leading-snug",
  heading3: "text-2xl font-semibold leading-snug",
  heading4: "text-xl font-medium leading-snug",

  paragraph: "text-base leading-relaxed",
  list: "text-base leading-relaxed font-mono",
  quote: "text-lg italic border-l-4 border-blue-500 pl-4 text-gray-600",
  code: "text-sm font-mono bg-gray-900 text-green-400 p-4 rounded-lg",

  image: "",
  video: "",
  "text-image": "",
  "image-text": "",
};

export const blockGroups: BlockGroup = {
  headings: [
    { type: "heading1", label: "Heading 1", icon: Type },
    { type: "heading2", label: "Heading 2", icon: Type },
    { type: "heading3", label: "Heading 3", icon: Type },
    { type: "heading4", label: "Heading 4", icon: Type },
  ],
  text: [
    { type: "paragraph", label: "Paragraph", icon: AlignLeft },
    { type: "list", label: "List", icon: List },
    { type: "quote", label: "Quote", icon: Quote },
    { type: "code", label: "Code", icon: Code },
  ],
  media: [
    { type: "image", label: "Image", icon: ImageIcon },
    { type: "video", label: "Video", icon: VideoIcon },
    { type: "text-image", label: "Text + Image", icon: ImageIcon },
    { type: "image-text", label: "Image + Text", icon: ImageIcon },
  ],
};
