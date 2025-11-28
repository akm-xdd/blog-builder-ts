"use client";

import { styles } from "@/lib/utils/data";
import { getDefaultContent } from "@/lib/utils";
import React, { ChangeEvent, KeyboardEvent } from "react";
import { Block } from "@/types/editor.types";

interface TextBlockProps {
  block: Block;
  updateBlock: (id: string | number, content: string) => void;
  addBlock: (type: Block["type"], afterId: string | number) => void;
}

const TextBlock = ({ block, updateBlock, addBlock } : TextBlockProps ) => {
  const baseClass =
    "w-full bg-transparent resize-none focus:outline-none text-gray-800 placeholder-gray-400 break-words whitespace-pre-wrap overflow-hidden";

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      block.type === "code" ||
      block.type === "image" ||
      block.type === "video" ||
      block.type === "list"
    )
      return;

    if (e.key === "Enter") {
      e.preventDefault();
      addBlock(block.type, block.id);
    }
  };

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateBlock(block.id, e.target.value);
    autoResize(e.target);
  };

  return (
    <textarea
      id={`block-${block.id}`}
      className={`${baseClass} ${styles[block.type]}`}
      value={String(block.content)}
      onChange={handleChange}
      placeholder={getDefaultContent(block.type) as string}
      ref={autoResize}
      style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
    />
  );
};

export default TextBlock;
