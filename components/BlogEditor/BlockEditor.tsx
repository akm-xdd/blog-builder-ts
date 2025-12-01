'use client';

import { useState, useCallback, useRef } from "react";
import Block from "./Block";
import { generateId } from "@/lib/utils";
import type { Block as BlockType, BlockContent } from "@/types/editor.types";

interface BlockEditorProps {
  blocks: BlockType[];
  setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>;
}

export default function BlockEditor({ blocks, setBlocks }: BlockEditorProps) {
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState<string | number | null>(
    null
  );
  const blockRefs = useRef<Record<string | number, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);


  const updateBlock = useCallback(
    (
      id: string | number,
      content: string | Partial<{ text: string; image: string }>
    ) => {
      const scrollTop = containerRef.current?.scrollTop || 0;

      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;

          if (typeof b.content === "object" && b.content !== null) {
            return {
              ...b,
              content: { ...b.content, ...(content as object) },
            };
          }

          return { ...b, content: content as string };
        })
      );

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = scrollTop;
        }
      });
    },
    [setBlocks]
  );


  const deleteBlock = useCallback(
    (id: string | number) => {
      if (blocks.length > 1) {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
      }
    },
    [blocks.length, setBlocks]
  );

  const addBlock = useCallback(
    (type: BlockType["type"], afterId: string | number) => {
      const newBlock: BlockType = {
        id: generateId(),
        type,
        content:
          type === "text-image" || type === "image-text"
            ? { text: "", image: "" }
            : "",
      };

      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === afterId);
        const updated = [...prev];
        updated.splice(index + 1, 0, newBlock);
        return updated;
      });

      setShowBlockMenu(null);
    },
    [setBlocks]
  );


  const handleDragStart = useCallback(
    (e: React.DragEvent<Element>, block: BlockType) => {
      setDraggedBlock(block);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );


  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);


  const handleDrop = useCallback(
    (e: React.DragEvent, targetBlock: BlockType) => {
      e.preventDefault();
      if (!draggedBlock || draggedBlock.id === targetBlock.id) return;

      setBlocks((prev) => {
        const updated = [...prev];
        const fromIndex = updated.findIndex(
          (b) => b.id === draggedBlock.id
        );
        const toIndex = updated.findIndex((b) => b.id === targetBlock.id);

        updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, draggedBlock);

        return updated;
      });

      setDraggedBlock(null);
    },
    [draggedBlock, setBlocks]
  );


  const duplicateBlock = useCallback(
    (id: string | number) => {
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        const blockToDuplicate = prev[index];

        const newBlock: BlockType = {
          ...blockToDuplicate,
          id: generateId(),
          content:
            typeof blockToDuplicate.content === "object"
              ? { ...blockToDuplicate.content }
              : blockToDuplicate.content,
        };

        const updated = [...prev];
        updated.splice(index + 1, 0, newBlock);
        return updated;
      });
    },
    [setBlocks]
  );


  const moveBlockUp = useCallback(
    (id: string | number) => {
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        if (index === 0) return prev;

        const updated = [...prev];
        [updated[index - 1], updated[index]] = [
          updated[index],
          updated[index - 1],
        ];

        setTimeout(() => {
          focusBlockInput(updated[index - 1].id);
        }, 30);
        return updated;
      });
    },
    [setBlocks]
  );


  const moveBlockDown = useCallback(
    (id: string | number) => {
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        if (index === prev.length - 1) return prev;

        const updated = [...prev];
        [updated[index], updated[index + 1]] = [
          updated[index + 1],
          updated[index],
        ];

        setTimeout(() => {
          focusBlockInput(updated[index + 1].id);
        }, 30);
        return updated;
      });
    },
    [setBlocks]
  );

  const isEditableBlock = (block: BlockType) => {
    return (
      block.type === "paragraph" ||
      block.type === "heading1" ||
      block.type === "heading2" ||
      block.type === "heading3" ||
      block.type === "heading4" ||
      block.type === "text-image" ||
      block.type === "image-text"
    );
  };

  const findNextEditableBlock = (blocks: BlockType[], startIndex: number) => {
    for (let i = startIndex + 1; i < blocks.length; i++) {
      if (isEditableBlock(blocks[i])) return blocks[i];
    }
    return null;
  };

  const focusBlockInput = (blockId: string | number) => {
    const ref = blockRefs.current[blockId];
    const el = ref?.querySelector(
      "textarea, input, [contenteditable='true']"
    ) as HTMLElement | null;

    el?.focus();
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string | number) => {
      const index = blocks.findIndex((b) => b.id === id);

      if (e.key === "Tab") {
        e.preventDefault();
        const index = blocks.findIndex((b) => b.id === id);
        const nextEditable = findNextEditableBlock(blocks, index);
        if (nextEditable) {
          focusBlockInput(nextEditable.id);
        }
        return;
      }

      if (e.ctrlKey && e.key === "ArrowUp") {
        e.preventDefault();
        moveBlockUp(id);
        // setTimeout(() => {
        //   const newIndex = index - 1;
        //   if (newIndex >= 0) {
        //     focusBlockInput(blocks[newIndex].id);
        //   }
        // }, 50);
        return;
      }

      if (e.ctrlKey && e.key === "ArrowDown") {
        e.preventDefault();
        moveBlockDown(id);

        // setTimeout(() => {
        //   const newIndex = index + 1;
        //   if (newIndex < blocks.length) {
        //     focusBlockInput(blocks[newIndex].id);
        //   }
        // }, 50);

        return;
      }
    },
    [blocks, moveBlockDown, moveBlockUp]
  );


  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-54"
      ref={containerRef}
    >
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-2">
          {blocks.map((block) => (
            <div key={block.id} ref={(el) => {blockRefs.current[block.id] = el}}>
              <Block
                block={block}
                deleteBlock={deleteBlock}
                updateBlock={updateBlock}
                addBlock={addBlock}
                duplicateBlock={duplicateBlock}
                moveBlockUp={moveBlockUp}
                moveBlockDown={moveBlockDown}
                isFirst={blocks[0].id === block.id}
                isLast={blocks[blocks.length - 1].id === block.id}
                showBlockMenu={showBlockMenu}
                setShowBlockMenu={setShowBlockMenu}
                handleDragOver={handleDragOver}
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
                handleKeyDown={handleKeyDown}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
