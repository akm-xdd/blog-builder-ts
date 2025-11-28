"use client";

import React from "react";
import { PrimaryTag, Industry } from "@/types/tag.types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import ImageModal from "./Modals/ImageModal";
import Image from "next/image";
import { X, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface BlogDetailsProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;

  coverImage: string | null;
  setCoverImage: React.Dispatch<React.SetStateAction<string | null>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  selectedPrimary: PrimaryTag | null;
  setSelectedPrimary: React.Dispatch<React.SetStateAction<PrimaryTag | null>>;

  selectedSecondary: Industry[];
  setSelectedSecondary: React.Dispatch<React.SetStateAction<Industry[]>>;

  primaryTags: PrimaryTag[];
  industries: Industry[];
  mode: "new" | "edit";
}

export default function BlogDetails({
  title,
  setTitle,
  coverImage,
  setCoverImage,
  description,
  setDescription,
  selectedPrimary,
  setSelectedPrimary,
  selectedSecondary,
  setSelectedSecondary,
  primaryTags,
  industries,
}: BlogDetailsProps) {
  const [coverModal, setCoverModal] = React.useState(false);

  return (
    <div className="space-y-6 mt-8 px-6">
      {/* Title */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-lg"
          placeholder="Enter your blog title..."
        />
      </div>

      {/* Cover Image */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900">
          Cover Image *
        </label>

        <ImageModal
          open={coverModal}
          onClose={() => setCoverModal(false)}
          onSelect={(url) => setCoverImage(url)}
        />

        {coverImage ? (
          <div className="relative w-full h-[220px] rounded-lg overflow-hidden border border-gray-300 group">
            <Image
              src={coverImage}
              alt="Cover"
              fill
              sizes="500px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <Button
                onClick={() => setCoverModal(true)}
                className="bg-white text-gray-900 hover:bg-gray-100"
                size="sm"
              >
                Change
              </Button>
              <Button
                onClick={() => setCoverImage(null)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCoverModal(true)}
            className="w-full h-[220px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
            <span className="font-medium text-sm">Add Cover Image</span>
            <span className="text-xs text-gray-400 mt-1">
              You can edit it before uploading
            </span>
          </button>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900">
          Description *
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg resize-none"
          placeholder="Write a compelling description..."
        />
        <p className="text-xs text-gray-500">{description.length} characters</p>
      </div>

      {/* Primary Tag */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900">
          Primary Tag *
        </label>

        <Select
            value={selectedPrimary?.id || ""}
            onValueChange={(value) => {
                const selected = primaryTags.find((t) => t.id === value);
                setSelectedPrimary(selected || null);
            }}
        >
            <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Select Primary Tag" />
            </SelectTrigger>

            <SelectContent>
                {primaryTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

      </div>

      {/* Industries */}
      <div className="space-y-3 pb-8">
        <label className="text-sm font-semibold text-gray-900">
          Industries *
        </label>

        <Select
            onValueChange={(value) => {
                const selected = industries.find((i) => i.id === value);
                if (selected && !selectedSecondary.some((s) => s.id === selected.id)) {
                    setSelectedSecondary([...selectedSecondary, selected]);
                }
            }}
        >
            <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Select industries" />
            </SelectTrigger>

            <SelectContent>
                {industries.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

        {selectedSecondary.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-2">
            {selectedSecondary.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-3 py-1.5 bg-gray-100 text-gray-800 flex items-center gap-2"
              >
                {tag.name}
                <button
                  onClick={() =>
                    setSelectedSecondary(
                      selectedSecondary.filter((t) => t.id !== tag.id)
                    )
                  }
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
