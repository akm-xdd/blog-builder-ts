'use client';

import React, { useEffect, useState, useCallback } from "react";
import BlogEditorPage from "@/components/BlogEditor/BlogEditorPage";
import { getBlog } from "@/lib/api/blog";
import { markdownToBlocks } from "@/lib/utils/markdown";
import { generateId } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { RootState } from "@/store/store";
import type { Block } from "@/types/editor.types";
import type { Blog } from "@/types/blog.types";

const StoredBlogEditorPage = () => {
  const { primaryTags, industries } = useSelector(
    (state: RootState) => state.tags
  );

  const { id } = useParams<{ id: string }>();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [blogData, setBlogData] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [blocks, setBlocks] = useState<Block[]>([
    { id: generateId(), type: "heading1", content: "" },
    { id: generateId(), type: "paragraph", content: "" },
  ]);

  const [currentSlug, setCurrentSlug] = useState<string>("");

  const tagsLoaded = primaryTags.length > 0 && industries.length > 0;

  const getBlogData = useCallback(async () => {
    setLoaded(false);
    setError(null);

    try {
      const result = await getBlog(id);

      if (result.data.success) {
        const data = result.data.data;
        setBlogData(data);
        setCurrentSlug(data.slug);

        const parsedBlocks = markdownToBlocks(data.content_markdown);
        setBlocks(parsedBlocks);
      } else {
        setError(result.data.error || "Unknown error");
        toast.error("Error getting blog", {
          description: result.data.error,
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);

      toast.error("Error getting blog", {
        description: errorMsg,
      });
    } finally {
      setLoaded(true);
    }
  }, [id]);

  useEffect(() => {
    if (!id || !tagsLoaded) return;
    getBlogData();
  }, [id, tagsLoaded, getBlogData]);

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600 font-medium mb-4">Failed to load blog</p>
        <button
          onClick={getBlogData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!blogData) {
    return (
      <BlogEditorPage
        mode="edit"
        initialTitle="Untitled Blog"
        initialBlocks={blocks}
      />
    );
  }

  return (
    <BlogEditorPage
      mode="edit"
      id={blogData.id}
      initialTitle={blogData.title}
      initialCover={blogData.cover_image_url}
      initialDescription={blogData.description}
      initialPrimaryTag={primaryTags.find(
        (tag) => tag.id === blogData.primary_tag_id
      )}
      initialSecondayTags={industries.filter((industry) =>
        blogData.industry_ids.includes(industry.id)
      )}
      initialBlocks={blocks}
      getBlogData={getBlogData}
      is_archived={blogData.is_archived}
      is_published={blogData.is_published}
      slug={currentSlug}
      setSlug={setCurrentSlug}
    />
  );
};

export default StoredBlogEditorPage;
