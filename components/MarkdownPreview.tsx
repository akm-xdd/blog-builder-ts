"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownPreviewProps {
  markdown: string;
}

export default function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  return (
    <div className="p-8">
      <article className="prose prose-lg max-w-none">
        <style>{`
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          tr {
            display: table-row;
          }

          td {
            border: none;
            width: 50%;
            vertical-align: middle;
            text-align: center;
          }

          td img {
            max-width: 100%;
            height: auto;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }

          @media (max-width: 768px) {
            table {
              display: block;
            }
            tr {
              display: block;
            }
            td {
              width: 100% !important;
              display: block;
            }
          }

          article ul,
          article ol {
            display: block !important;
            list-style-position: inside !important;
            padding-left: 1.25rem !important;
          }

          article ul li,
          article ol li {
            display: list-item !important;
            margin-bottom: 0.5rem !important;
          }
        `}</style>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          urlTransform={(url) => {
            if (url.startsWith("data:image/")) return url;
            if (url.startsWith("data:video/")) return url;
            return url;
          }}
          components={{
            table: ({ node, ...props }) => (
              <table {...props} className="rounded-lg" />
            ),
            tr: ({ node, ...props }) => <tr {...props} />,
            th: ({ node, ...props }) => (
              <th className="text-gray-700 text-center" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="align-top" {...props} />
            ),

            img: ({ node, ...props }) => {
              const { src, alt } = props;
              if (!src) return null;
              return (
                <img
                  className="rounded-lg my-4 max-w-md mx-auto h-auto border border-gray-200 shadow-sm"
                  src={src}
                  alt={alt || "image"}
                />
              );
            },

            video: ({ node, ...props }) => {
              if (!props.src) return null;
              return (
                <video
                  className="rounded-xl max-w-full"
                  controls
                  {...props}
                />
              );
            },

            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl font-bold mt-6 mb-4 text-gray-900"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-3xl font-bold mt-6 mb-4 text-gray-900"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-2xl font-semibold mt-5 mb-3 text-gray-900"
                {...props}
              />
            ),
            h4: ({ node, ...props }) => (
              <h4
                className="text-xl font-medium mt-4 mb-2 text-gray-900"
                {...props}
              />
            ),

            p: ({ node, ...props }) => (
              <p
                className="text-gray-700 leading-relaxed mb-4"
                {...props}
              />
            ),

            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
            ),

            li: ({ node, ...props }) => (
              <li
                {...props}
                className="block text-gray-700 leading-relaxed"
              />
            ),

            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2"
                {...props}
              />
            ),

            code: ({ inline, node, ...props }: { inline?: boolean; node?: any } & React.HTMLAttributes<HTMLElement>) =>
              inline ? (
                <code
                  className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                />
              ) : (
                <code
                  className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm"
                  {...props}
                />
              ),

            pre: ({ node, ...props }) => (
              <pre className="mb-4 rounded-lg overflow-hidden" {...props} />
            ),

            strong: ({ node, ...props }) => (
              <strong className="font-bold text-gray-900" {...props} />
            ),

            em: ({ node, ...props }) => <em className="italic" {...props} />,

            a: ({ node, ...props }) => (
              <a
                className="text-blue-600 hover:text-blue-800 underline"
                {...props}
              />
            ),

            hr: ({ node, ...props }) => (
              <hr className="my-8 border-gray-300" {...props} />
            ),
          }}
        >
          {markdown || "*Start typing to see preview...*"}
        </ReactMarkdown>
      </article>
    </div>
  );
}
