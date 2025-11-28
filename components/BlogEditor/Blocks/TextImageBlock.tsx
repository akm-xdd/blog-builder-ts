"use client";

import React, { useRef, useState } from "react";
import { styles } from "@/lib/utils/data";
import { getDefaultContent } from "@/lib/utils";
import ImageModal from "../Modals/ImageModal";
import { Block } from "@/types/editor.types"; // Ensure your Block type allows `{ text, image }`

interface TextImageBlockProps {
  block: Block;
  updateBlock: (id: string, content: Partial<{ text: string; image: string }>) => void;
}

const TextImageBlock = ({ block, updateBlock } : TextImageBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Extract expected structure
  const { text = "", image = "" } =
    (block.content as { text?: string; image?: string }) || {};

  // Auto-resize handler
  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const updateText = (value: string) => {
    updateBlock(block.id, { text: value });
  };

  const updateImage = (url: string) => {
    updateBlock(block.id, { image: url });
  };

  const clearImage = () => {
    updateBlock(block.id, { image: "" });
  };

  const openLink = () => {
    if (typeof window !== "undefined" && image) {
      window.open(image, "_blank");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full">

      <ImageModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSelect={(url: string) => updateImage(url)}
      />

      {/* LEFT — TEXT */}
      <textarea
        ref={(el) => {
          textareaRef.current = el;
          autoResize(el);
        }}
        id={`block-${block.id}`}
        className={`w-full bg-transparent resize-none focus:outline-none text-gray-800 placeholder-gray-400 break-words whitespace-pre-wrap overflow-hidden ${styles["paragraph"]}`}
        value={text}
        onChange={(e) => {
          updateText(e.target.value);
          autoResize(e.target);
        }}
        placeholder={getDefaultContent("paragraph") as string}
        style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
      />

      {/* RIGHT — IMAGE */}
      <div className="w-full cursor-pointer">
        {image ? (
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-xl border">
            <span
              className="text-sm text-blue-600 underline break-all cursor-pointer"
              onClick={openLink}
            >
              {image}
            </span>

            <button
              onClick={clearImage}
              className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl text-gray-500 hover:bg-gray-50"
            onClick={() => setOpenModal(true)}
          >
            <span>Click to add image</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextImageBlock;
