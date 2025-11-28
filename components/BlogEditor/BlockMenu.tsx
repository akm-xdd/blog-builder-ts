import React from "react";
import { blockGroups } from "@/lib/utils/data";
import { Block, BlockType } from "@/types/editor.types";

interface BlockMenuProps {
  block: Block;
  addBlock: (type: BlockType, afterId: string | number) => void;
}

const BlockMenu: React.FC<BlockMenuProps> = ({ block, addBlock }) => {
  return (
    <div className="absolute top-[1.6rem] bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 w-72">
      
      {/* HEADINGS */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-500 mb-1">Headings</div>
        <div className="grid grid-cols-2 gap-2">
          {blockGroups.headings.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => addBlock(type, block.id)}
              className="flex items-center gap-2 px-2 py-1 text-sm border rounded hover:bg-gray-100 cursor-pointer"
            >
              <Icon className="w-4 h-4 text-gray-600" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TEXT */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-500 mb-1">Text</div>
        <div className="grid grid-cols-2 gap-2">
          {blockGroups.text.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => addBlock(type, block.id)}
              className="flex items-center gap-2 px-2 py-1 text-sm border rounded hover:bg-gray-100 cursor-pointer"
            >
              <Icon className="w-4 h-4 text-gray-600" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* MEDIA */}
      <div className="relative group mt-2">
        <div className="text-xs font-semibold text-gray-500 mb-1">Media</div>
        <div className="grid grid-cols-2 gap-2">
          {blockGroups.media.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => addBlock(type, block.id)}
              className="flex items-center gap-2 px-2 py-1 text-sm border rounded hover:bg-gray-100 cursor-pointer"
            >
              <Icon className="w-4 h-4 text-gray-600" />
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default BlockMenu;
