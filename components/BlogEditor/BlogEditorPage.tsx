"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import BlockEditor from "@/components/BlogEditor/BlockEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import AutoSaveIndicator from "@/components/AutoSaveIndicator";

import { blocksToMarkdown } from "@/lib/utils/markdown";
import { generateId } from "@/lib/utils";

import {
  archiveBlog,
  createBlog,
  publishBlog,
  unarchiveBlog,
  unpublishBlog,
  updateBlog
} from "@/lib/api/blog";

import { Loader, Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import BlogDetails from "@/components/BlogEditor/BlogDetails";

import type { RootState } from "@/store/store";
import type { Block } from "@/types/editor.types";
import type { PrimaryTag, Industry } from "@/types/tag.types";
import type {
  CreateBlogPayload,
  UpdateBlogPayload,
} from "@/types/blog.types";
import { toast } from "sonner";

type SaveStatus = "idle" | "saved";

interface BlogEditorPageProps {
  mode?: "new" | "edit";
  initialBlocks: Block[];
  initialTitle?: string;
  initialCover?: string | null;
  initialDescription?: string;
  initialPrimaryTag?: PrimaryTag | null;
  initialSecondayTags?: Industry[];
  id?: string;
  is_published?: boolean;
  is_archived?: boolean;
  slug?: string;
  getBlogData?: () => Promise<void>;
  setSlug?: (slug: string) => void;
}

export default function BlogEditorPage({
  initialBlocks,
  mode = "new",
  initialTitle,
  initialCover,
  initialDescription,
  initialPrimaryTag,
  initialSecondayTags = [],
  id,
  is_published,
  is_archived,
  slug,
  getBlogData,
  setSlug
}: BlogEditorPageProps) {
  const router = useRouter();

  const { primaryTags, industries } = useSelector(
    (state: RootState) => state.tags
  );

  const [hydrated, setHydrated] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [title, setTitle] = useState<string>(initialTitle || "");
  const [coverImage, setCoverImage] = useState<string | null>(
    initialCover || null
  );
  const [description, setDescription] = useState<string>(
    initialDescription || ""
  );

  const [selectedPrimary, setSelectedPrimary] = useState<PrimaryTag | null>(
    initialPrimaryTag || null
  );

  const [selectedSecondary, setSelectedSecondary] = useState<Industry[]>(
    initialSecondayTags || []
  );

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [loading, setLoading] = useState(true);

  // saving states
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // refs for autosave
  const blocksRef = useRef(blocks);
  const titleRef = useRef(title);
  const coverRef = useRef(coverImage);
  const descRef = useRef(description);
  const primaryRef = useRef(selectedPrimary);
  const secondaryRef = useRef(selectedSecondary);

  const markdown = blocksToMarkdown(blocks);

  // keep refs updated
  useEffect(() => { titleRef.current = title }, [title]);
  useEffect(() => { coverRef.current = coverImage }, [coverImage]);
  useEffect(() => { descRef.current = description }, [description]);
  useEffect(() => { primaryRef.current = selectedPrimary }, [selectedPrimary]);
  useEffect(() => { secondaryRef.current = selectedSecondary }, [selectedSecondary]);
  useEffect(() => { blocksRef.current = blocks }, [blocks]);

  useEffect(() => setHydrated(true), []);

  // =============== DRAFT SAVE (3s debounce) ===============
  useEffect(() => {
    if (mode !== "new") return;

    const timeoutId = setTimeout(() => {
      const draft = {
        title: titleRef.current,
        coverImage: coverRef.current,
        description: descRef.current,
        selectedPrimary: primaryRef.current,
        selectedSecondary: secondaryRef.current,
        blocks: blocksRef.current
      };

      const json = JSON.stringify(draft);
      if (localStorage.getItem("blog-draft") !== json) {
        localStorage.setItem("blog-draft", json);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [
    mode,
    title,
    coverImage,
    description,
    selectedPrimary,
    selectedSecondary,
    blocks
  ]);

  // =============== Periodic backup (60s) ===============
  useEffect(() => {
    if (mode !== "new") return;

    const interval = setInterval(() => {
      const draft = {
        title: titleRef.current,
        coverImage: coverRef.current,
        description: descRef.current,
        selectedPrimary: primaryRef.current,
        selectedSecondary: secondaryRef.current,
        blocks: blocksRef.current
      };

      const json = JSON.stringify(draft);
      if (localStorage.getItem("blog-draft") !== json) {
        localStorage.setItem("blog-draft", json);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [mode]);

  // =============== Load draft ===============
  useEffect(() => {
    if (mode === "new") {
      const stored = localStorage.getItem("blog-draft");
      if (stored) {
        const draft = JSON.parse(stored);

        if (draft.title) setTitle(draft.title);
        if (draft.coverImage) setCoverImage(draft.coverImage);
        if (draft.description) setDescription(draft.description);
        if (draft.selectedPrimary) setSelectedPrimary(draft.selectedPrimary);
        if (draft.selectedSecondary) setSelectedSecondary(draft.selectedSecondary);
        if (draft.blocks?.length > 0) setBlocks(draft.blocks);
      }
    }
    setLoading(false);
  }, [mode]);

  const publishHandler = async (blogId?: string) => {
    if (!blogId) return false;

    try {
      setIsPublishing(true);
      const res = await publishBlog(blogId, {
        username: localStorage.getItem("username") || ""
      });

      if (!res.data.success) {
        // TS fix: safely narrow the union response type
        const errorMessage =
            (res.data as any).error || "Failed to publish blog";

        toast.error("Failed to publish blog", {
            description: errorMessage,
        });

        return false;
      }

      toast.success("Blog published");
      return true;
    } catch (err: any) {
      toast.error("Error publishing blog", {
        description: err?.response?.data?.error || err.message
      });
      return false;
    } finally {
      await getBlogData?.();
      setIsPublishing(false);
    }
  };

  const unpublishHandler = async (blogId?: string) => {
    if (!blogId) return false;

    try {
      setIsPublishing(true);
      const res = await unpublishBlog(blogId, {
        username: localStorage.getItem("username") || ""
      });

      if (!res.data.success) {
        // TS fix: safely narrow the union response type
        const errorMessage =
            (res.data as any).error || "Failed to unpublish blog";

        toast.error("Failed to unpublish blog", {
            description: errorMessage,
        });

        return false;
        }

      toast.success("Blog unpublished");
      return true;
    } catch (err: any) {
      toast.error("Error unpublishing blog", {
        description: err?.response?.data?.error || err.message
      });
      return false;
    } finally {
      await getBlogData?.();
      setIsPublishing(false);
    }
  };

  const archiveHandler = async (blogId?: string) => {
    if (!blogId) return false;

    try {
      setIsArchiving(true);
      const res = await archiveBlog(blogId, {
        username: localStorage.getItem("username") || ""
      });

      if (!res.data.success) {
        // TS fix: safely narrow the union response type
        const errorMessage =
            (res.data as any).error || "Failed to archive blog";

        toast.error("Failed to archive blog", {
            description: errorMessage,
        });

        return false;
        }

      toast.success("Blog archived");
      return true;
    } catch (err: any) {
      toast.error("Error archiving blog", {
        description: err?.response?.data?.error || err.message
      });
      return false;
    } finally {
      await getBlogData?.();
      setIsArchiving(false);
    }
  };

  const unarchiveHandler = async (blogId?: string) => {
    if (!blogId) return false;

    try {
      setIsArchiving(true);
      const res = await unarchiveBlog(blogId, {
        username: localStorage.getItem("username") || ""
      });

      if (!res.data.success) {
        // TS fix: safely narrow the union response type
        const errorMessage =
            (res.data as any).error || "Failed to unarchive blog";

        toast.error("Failed to unarchive blog", {
            description: errorMessage,
        });

        return false;
        }

      toast.success("Blog unarchived");
      return true;
    } catch (err: any) {
      toast.error("Error unarchiving blog", {
        description: err?.response?.data?.error || err.message
      });
      return false;
    } finally {
      await getBlogData?.();
      setIsArchiving(false);
    }
  };

  const handleSave = async () => {
    const missing: string[] = [];
    if (!title) missing.push("Title");
    if (!coverImage) missing.push("Cover Image");
    if (!description) missing.push("Description");
    if (!selectedPrimary) missing.push("Primary Tag");
    if (selectedSecondary.length === 0) missing.push("Industries");

    if (missing.length > 0) {
      toast.error("Missing fields", {
        description: missing.join(", ")
      });
      return;
    }

    setIsSaving(true);

    const payload: CreateBlogPayload | UpdateBlogPayload = {
      username: localStorage.getItem("username") || "",
      title,
      primary_tag_id: selectedPrimary!.id,
      cover_image_url: coverImage ?? "",
      description,
      content_markdown: markdown,
      industry_ids: selectedSecondary.map(i => i.id)
    };

    if (mode === "new") {
      await handleCreateBlog(payload as CreateBlogPayload);
    } else if (id) {
      await handleUpdateBlog(payload as UpdateBlogPayload, id);
    }

    setIsSaving(false);
  };

  const handleCreateBlog = async (payload: CreateBlogPayload) => {
    try {
      const res = await createBlog(payload);

      if (res.data.success) {
        localStorage.removeItem("blog-draft");
        toast.success("Blog created");
        router.push(`/editor/${res.data.data.id}`);
      } else {
        toast.error("Failed to create blog", {
          description: (res.data as any).error
        });
      }
    } catch (err: any) {
      toast.error("Error creating blog", {
        description: err?.response?.data?.error || err.message
      });
    }
  };

  const handleUpdateBlog = async (
    payload: UpdateBlogPayload,
    blogId: string
  ) => {
    try {
      const res = await updateBlog(blogId, payload);

      if (res.data.success) {
        toast.success("Blog updated");

        if (setSlug && res.data.data.slug) {
          setSlug(res.data.data.slug);
        }
      } else {
        toast.error("Failed to update blog", {
          description: (res.data as any).error
        });
      }
    } catch (err: any) {
      toast.error("Error updating blog", {
        description: err?.response?.data?.error || err.message
      });
    }
  };

  if (!hydrated) return null;

  const isComplete =
    !!title &&
    !!coverImage &&
    !!description &&
    !!selectedPrimary &&
    selectedSecondary.length > 0;

  return (
    <div className="flex flex-col w-full h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold text-black cursor-pointer"
              onClick={() => router.push("/")}
            >
              Wokelo Blog Builder
            </h1>

            <div className="flex gap-3 items-center">
              {mode === "new" && <AutoSaveIndicator status={saveStatus} />}

              {/* DETAILS SHEET */}
              <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Settings className="w-4 h-4 mr-2" />
                    Details
                    {!isComplete && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" />
                    )}
                  </Button>
                </SheetTrigger>

                <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto p-0">
                  <SheetHeader className="px-6 pt-6 pb-2">
                    <SheetTitle>Blog Details</SheetTitle>
                    <SheetDescription>
                      Configure your blog metadata and settings
                    </SheetDescription>
                  </SheetHeader>

                  <BlogDetails
                    title={title}
                    setTitle={setTitle}
                    coverImage={coverImage}
                    setCoverImage={setCoverImage}
                    description={description}
                    setDescription={setDescription}
                    selectedPrimary={selectedPrimary}
                    setSelectedPrimary={setSelectedPrimary}
                    selectedSecondary={selectedSecondary}
                    setSelectedSecondary={setSelectedSecondary}
                    primaryTags={primaryTags}
                    industries={industries}
                    mode={mode}
                  />
                </SheetContent>
              </Sheet>

              {mode === "new" ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Discard draft?")) {
                      localStorage.removeItem("blog-draft");
                      setTitle("");
                      setCoverImage(null);
                      setDescription("");
                      setSelectedPrimary(null);
                      setSelectedSecondary([]);
                      setBlocks([
                        { id: generateId(), type: "heading1", content: "" },
                        { id: generateId(), type: "paragraph", content: "" }
                      ]);
                      toast.success("Draft discarded");
                    }
                  }}
                >
                  Discard
                </Button>
              ) : (
                <>
                  {/* ARCHIVED */}
                  {is_archived ? (
                    <Button
                      onClick={() => unarchiveHandler(id)}
                      disabled={isArchiving || isPublishing || isSaving}
                      variant="outline"
                    >
                      {isArchiving ? "Unarchiving..." : "Unarchive"}
                    </Button>
                  ) : (
                    <>
                      {/* PUBLISHED */}
                      {is_published ? (
                        <Button
                          onClick={() => unpublishHandler(id)}
                          disabled={isPublishing || isArchiving || isSaving}
                          variant="outline"
                        >
                          {isPublishing ? "Unpublishing..." : "Unpublish"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => publishHandler(id)}
                          disabled={isPublishing || isArchiving || isSaving}
                          variant="outline"
                        >
                          {isPublishing ? "Publishing..." : "Publish"}
                        </Button>
                      )}

                      {/* ARCHIVE */}
                      <Button
                        onClick={() => archiveHandler(id)}
                        disabled={isArchiving || isPublishing || isSaving}
                        variant="outline"
                      >
                        {isArchiving ? "Archiving..." : "Archive"}
                      </Button>
                    </>
                  )}

                  {/* PREVIEW */}
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/blog/${slug}`)}
                  >
                    Preview
                  </Button>
                </>
              )}

              {/* SAVE BUTTON */}
              <Button
                onClick={handleSave}
                disabled={isSaving || isPublishing || isArchiving}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === "new"
                  ? isSaving
                    ? "Creating..."
                    : "Create"
                  : isSaving
                  ? "Updating..."
                  : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN AREA */}
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Loader size={40} />
        </div>
      ) : (
        <div className="flex w-full flex-1 overflow-hidden">
          {/* LEFT — Editor */}
          <div className="w-1/2 overflow-y-auto border-r border-gray-200">
            <BlockEditor blocks={blocks} setBlocks={setBlocks} />
          </div>

          {/* RIGHT — Markdown Preview */}
          <div className="w-1/2 overflow-y-auto bg-white p-6 flex flex-col">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <p className="text-4xl font-bold text-center">
                {title || "Untitled Blog"}
              </p>
            </div>
            <MarkdownPreview markdown={markdown} />
          </div>
        </div>
      )}
    </div>
  );
}
