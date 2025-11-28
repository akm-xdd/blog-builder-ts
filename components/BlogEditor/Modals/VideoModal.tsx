"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "@/lib/api/uploadMedia";
import { toast } from "sonner";
import { UploadMediaResponse } from "@/types/uploadMedia.types";
import { AxiosResponse } from "axios";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function VideoModal({
  open,
  onClose,
  onSelect,
}: VideoModalProps) {
  const VIDEO_SIZE_IN_MB = 50;
  const VIDEO_MAX_SIZE = VIDEO_SIZE_IN_MB * 1024 * 1024;

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;

    if (file.size > VIDEO_MAX_SIZE) {
      toast.error("Video too large", {
        description: `Max allowed size is ${VIDEO_SIZE_IN_MB}MB. Your video is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
      });
      return;
    }

    setIsUploading(true);

    try {
      const result: AxiosResponse<UploadMediaResponse> | null =
        await uploadMedia(file);

      if (!result) {
        toast.error("Upload failed");
        return;
      }

      if (result.data.success) {
        const uploadedUrl = result.data.data?.url ?? "";

        if (!uploadedUrl) {
          toast.error("Upload failed", {
            description: "No URL returned from server",
          });
          return;
        }

        onSelect(uploadedUrl);
        onClose();
      } else {
        toast.error("Unable to upload video", {
          description: (result.data as any).error,
        });
      }
    } catch (error: any) {
      toast.error("Error uploading video", {
        description: error?.message || "Unknown error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Upload Video */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium">Upload Video</label>

            <label
              className="cursor-pointer mt-2 flex items-center justify-center 
                         border-2 border-dashed border-gray-300 p-4 rounded-lg 
                         hover:bg-gray-50"
            >
              <span>{isUploading ? "Uploading..." : "Click to Upload"}</span>

              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
