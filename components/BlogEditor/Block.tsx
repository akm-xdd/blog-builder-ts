import React from "react";
import {
  Plus,
  GripVertical,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import TextBlock from "./Blocks/TextBlock";
import ImageBlock from "./Blocks/ImageBlock";
import VideoBlock from "./Blocks/VideoBlock";
import TextImageBlock from "./Blocks/TextImageBlock";
import ImageTextBlock from "./Blocks/ImageTextBlock";
import BlockMenu from "./BlockMenu";

import { Button } from "../ui/button";

import type { Block as BlockType, BlockContent } from "@/types/editor.types";
import { isTextImageObject } from "@/lib/utils";

interface BlockProps {
  block: BlockType;
  deleteBlock: (id: string | number) => void;
  duplicateBlock: (id: string | number) => void;
  addBlock: (type: BlockType["type"], afterId: string | number) => void;
  updateBlock: (id: string | number, content: string | Partial<{ text: string; image: string }>) => void;

  handleDragStart: (e: React.DragEvent, block: BlockType) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, block: BlockType) => void;

  showBlockMenu: string | number | null;
  setShowBlockMenu: React.Dispatch<
    React.SetStateAction<string | number | null>
  >;

  moveBlockUp: (id: string | number) => void;
  moveBlockDown: (id: string | number) => void;

  isFirst: boolean;
  isLast: boolean;

  handleKeyDown: (e: React.KeyboardEvent, id: string | number) => void;
}

const Block = ({
  block,
  deleteBlock,
  duplicateBlock,
  addBlock,
  updateBlock,
  handleDragStart,
  handleDragOver,
  handleDrop,
  showBlockMenu,
  setShowBlockMenu,
  moveBlockUp,
  moveBlockDown,
  isFirst,
  isLast,
  handleKeyDown
} : BlockProps) => {

  const handleFormat = (command: "bold" | "italic" | "code") => {
    const isObject = typeof block.content === "object";

    const text = isTextImageObject(block.content) ? block.content.text : block.content;

    // if (!text) return;

    const textarea = document.getElementById(
      `block-${block.id}`
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = text.substring(start, end);

    const formatted =
      command === "bold"
        ? `**${selected}**`
        : command === "italic"
        ? `*${selected}*`
        : command === "code"
        ? `\`${selected}\``
        : selected;

    const newText =
      text.substring(0, start) + formatted + text.substring(end);

    if (isObject) {
      updateBlock(block.id, {
        ...(block.content as { text: string; image: string }),
        text: newText,
      });
    } else {
      updateBlock(block.id, newText);
    }
  };

  const renderBlock = (block: BlockType) => {
    switch (block.type) {
      case "image":
        return <ImageBlock block={block} updateBlock={updateBlock} />;

      case "video":
        return <VideoBlock block={block} updateBlock={updateBlock} />;

      case "text-image":
        return (
          <TextImageBlock block={block} updateBlock={updateBlock} onKeyDown={(e) => handleKeyDown(e, block.id)} />
        );

      case "image-text":
        return (
          <ImageTextBlock block={block} updateBlock={updateBlock} onKeyDown={(e) => handleKeyDown(e, block.id)} />
        );

      default:
        return (
          <TextBlock
            block={block}
            updateBlock={updateBlock}
            addBlock={addBlock}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
          />
        );
    }
  };

  // ======================
  // Component JSX
  // ======================

  return (
    <div
      key={block.id}
      draggable
      onDragStart={(e) => handleDragStart(e, block)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, block)}
      className="group relative"
    >
      <div className="flex flex-col gap-2 bg-gray-50 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-200 px-4 py-2 shadow-md hover:shadow-lg">
        {/* Toolbar */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity w-full justify-between">
          <div className="flex gap-1">
            {/* Drag Handle */}
            <Button
              size={"icon"}
              variant={"ghost"}
              className="bg-transparent hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </Button>

            {/* Move Up */}
            <Button
              onClick={() => moveBlockUp(block.id)}
              disabled={isFirst}
              size={"icon"}
              variant={"ghost"}
              className="bg-transparent hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move Up"
            >
              <ArrowUp className="w-4 h-4 text-gray-600" />
            </Button>

            {/* Move Down */}
            <Button
              onClick={() => moveBlockDown(block.id)}
              disabled={isLast}
              size={"icon"}
              variant={"ghost"}
              className="bg-transparent hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move Down"
            >
              <ArrowDown className="w-4 h-4 text-gray-600" />
            </Button>

            {/* Formatting Buttons */}
            {block.type !== "image" &&
              block.type !== "video" && (
                <>
                  <button
                    onClick={() => handleFormat("bold")}
                    className="p-1 hover:bg-gray-100 rounded text-sm font-bold text-gray-600"
                    title="Bold"
                  >
                    B
                  </button>

                  <button
                    onClick={() => handleFormat("italic")}
                    className="p-1 hover:bg-gray-100 rounded text-sm italic text-gray-600"
                    title="Italic"
                  >
                    I
                  </button>

                  <button
                    onClick={() => handleFormat("code")}
                    className="p-1 hover:bg-gray-100 rounded text-sm font-mono text-gray-600"
                    title="Code"
                  >
                    {"<>"} 
                  </button>
                </>
              )}
          </div>

          {/* Block Type Label */}
          <span className="text-sm text-black">{block.type}</span>

          {/* Right Controls */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => duplicateBlock(block.id)}
              className="p-1 hover:bg-blue-50 rounded text-blue-600"
              title="Duplicate"
              size={"icon"}
              variant={"ghost"}
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => deleteBlock(block.id)}
              className="p-1 hover:bg-red-50 rounded text-red-500"
              title="Delete"
              size={"icon"}
              variant={"ghost"}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rendered Block Content */}
        <div className="w-full block whitespace-normal">{renderBlock(block)}</div>
      </div>

      {/* Plus Button to Add New Block */}
      <div className="relative -mt-2 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() =>
            setShowBlockMenu(
              showBlockMenu === block.id ? null : block.id
            )
          }
          className="absolute bg-white border-2 border-gray-200 rounded-full p-1 hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>

        {showBlockMenu === block.id && (
          <BlockMenu block={block} addBlock={addBlock} />
        )}
      </div>
    </div>
  );
};

export default Block;