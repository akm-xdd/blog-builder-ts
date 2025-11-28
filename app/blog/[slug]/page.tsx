"use client";

import { useParams, useRouter } from "next/navigation";
import { getBlogBySlug } from "@/lib/api/blog";
import MarkdownPreview from "@/components/MarkdownPreview";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blog, GetBlogBySlugResponse } from "@/types/blog.types";

const GetPostBySlugPage = () => {
  const params = useParams();
  const router = useRouter();

  const slug = params?.slug as string;

  const [post, setPost] = useState<Blog | null>(null);
  const [notFoundState, setNotFoundState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
        console.log(slug)
      if (!slug) return;

      try {
        const res = await getBlogBySlug(slug);
        const data = res.data as GetBlogBySlugResponse;

        if (data.success) {
          setPost(data.data);
        } else {
          setNotFoundState(true);
        }
      } catch (error) {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [slug]);

  if (loading) return null;

  if (notFoundState || !post) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold">404 – Blog Not Found</h2>
        <p className="text-gray-600">
          The blog you are looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Button>

          <Button
            onClick={() => router.push(`/editor/${post.id}`)}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl py-10 px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {post.description && (
            <p className="text-lg text-gray-600 mb-4">{post.description}</p>
          )}

          <div className="text-gray-500 text-sm flex gap-2">
            {post.published_at && (
              <span>
                {new Date(post.published_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            {typeof post.read_time_minutes === "number" && (
              <span>· {post.read_time_minutes} min read</span>
            )}
          </div>

          {post.cover_image_url && (
            <div className="relative mt-6 w-full h-96">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                priority
                className="rounded-xl border border-gray-200 object-cover"
              />
            </div>
          )}
        </header>

        <MarkdownPreview markdown={post.content_markdown} />
      </main>
    </>
  );
};

export default GetPostBySlugPage;
