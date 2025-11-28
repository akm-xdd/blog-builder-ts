"use client";

import React, { useState } from "react";
import ImageModal from "../Modals/ImageModal";
import type { Block } from "@/types/editor.types";

interface ImageBlockProps {
  block: Block;
  updateBlock: (id: string | number, content: string) => void;
}

const ImageBlock = ({ block, updateBlock }: ImageBlockProps ) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleSelect = (url: string) => {
    updateBlock(block.id, url);
  };

  const clearImage = () => {
    updateBlock(block.id, "");
  };

  const openLink = () => {
    if (typeof window !== "undefined" && block.content) {
      window.open(String(block.content), "_blank");
    }
  };

  return (
    <div className="w-full">
      {/* Image Picker Modal */}
      <ImageModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSelect={handleSelect}
      />

      {/* If an image exists */}
      {block.content ? (
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-xl border">
          <span
            className="text-sm text-blue-600 underline break-all cursor-pointer"
            onClick={openLink}
          >
            {String(block.content)}
          </span>

          <button
            onClick={clearImage}
            className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
          >
            ✕
          </button>
        </div>
      ) : (
        /* If no image yet */
        <label
          onClick={() => setOpenModal(true)}
          className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl text-gray-500 hover:bg-gray-50"
        >
          <span>Click to add image</span>
        </label>
      )}
    </div>
  );
};

export default ImageBlock;
