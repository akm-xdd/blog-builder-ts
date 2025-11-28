"use client";

import React, { useState } from "react";
import VideoModal from "../Modals/VideoModal"; // ← Make sure this exists
import { Block } from "@/types/editor.types"; // Adjust path to your Block type

interface VideoBlockProps {
  block: Block;
  updateBlock: (id: string | number, content: string) => void;
}

const VideoBlock = ({ block, updateBlock }: VideoBlockProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const updateVideo = (file: File | null) => {
    if (!file) return;

    const url = URL.createObjectURL(file); // FAST preview
    updateBlock(block.id, url);
  };

  const handleSelect = (url: string) => {
    updateBlock(block.id, url);
  };

  const clearVideo = () => {
    updateBlock(block.id, "");
  };

  const openLink = () => {
    const video = block.content as string | undefined;

    if (typeof window !== "undefined" && video) {
      window.open(video, "_blank");
    }
  };

  const videoUrl = block.content as string | undefined;

  return (
    <div className="w-full">
      <VideoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSelect={handleSelect}
      />

      {videoUrl ? (
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-xl border">
          <span
            className="text-sm text-blue-600 underline break-all cursor-pointer"
            onClick={openLink}
          >
            {videoUrl}
          </span>

          <button
            onClick={clearVideo}
            className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
          >
            ✕
          </button>
        </div>
      ) : (
        <label
          onClick={() => setOpenModal(true)}
          className="cursor-pointer flex flex-col items-center justify-center 
                     border-2 border-dashed border-gray-300 p-6 rounded-xl 
                     text-gray-500 hover:bg-gray-50"
        >
          <span>Click to add video</span>
        </label>
      )}
    </div>
  );
};

export default VideoBlock;
