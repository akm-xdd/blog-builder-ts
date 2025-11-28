import React from "react";
import BlogEditorPage from "@/components/BlogEditor/BlogEditorPage";
import { generateId } from "@/lib/utils";
import type { Block } from "@/types/editor.types";

const NewBlogEditorPage = () => {
  const initialBlocks: Block[] = [
    { id: generateId(), type: "heading1", content: "" },
    { id: generateId(), type: "paragraph", content: "" },
  ];

  return (
    <BlogEditorPage
      mode="new"
      initialTitle="Untitled Blog"
      initialBlocks={initialBlocks}
    />
  );
};

export default NewBlogEditorPage;
