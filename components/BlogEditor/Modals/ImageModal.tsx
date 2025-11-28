"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/lib/api/uploadMedia";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, onSelect }) => {
  const IMAGE_SIZE_IN_MB = 5;
  const MAX_FILE_SIZE = IMAGE_SIZE_IN_MB * 1024 * 1024;

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const cropperRef = useRef<ReactCropperElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: `Maximum allowed size is ${IMAGE_SIZE_IN_MB}MB.`,
      });
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      cropper.getCroppedCanvas().toBlob(
        async (blob) => {
          if (!blob) {
            toast.error("Image processing failed");
            return;
          }

          const croppedFile = new File([blob], selectedFile.name, {
            type: "image/jpeg",
          });

          const result = await uploadMedia(croppedFile, (progress: number) => {
            setUploadProgress(progress);
          });

          if (result.data.success) {
            onSelect(result.data.data.url!);
            onClose();
            resetState();
          } else {
            toast.error("Upload failed", {
              description: result.data.error,
            });
          }

          setIsUploading(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (error: any) {
      console.error(error);
      toast.error("Upload failed", {
        description: error?.message,
      });
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setImageSrc(null);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const setAspectRatio = (ratio: number) => {
    cropperRef.current?.cropper.setAspectRatio(ratio);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        resetState();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select & Edit Image</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Tip: Use your mouse wheel or trackpad to zoom
          </p>
        </DialogHeader>

        {!imageSrc ? (
          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-8 rounded-lg hover:bg-gray-50">
            <span>Click to Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="w-full h-96">
              <Cropper
                src={imageSrc}
                ref={cropperRef}
                style={{ height: "100%", width: "100%" }}
                aspectRatio={NaN}
                guides={true}
                viewMode={1}
                dragMode="move"
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                zoomable={true}
                zoomOnWheel={true}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Aspect Ratio</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAspectRatio(16 / 9)}
                >
                  16:9
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAspectRatio(4 / 3)}
                >
                  4:3
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAspectRatio(1)}
                >
                  1:1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAspectRatio(9 / 16)}
                >
                  9:16
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAspectRatio(NaN)}
                >
                  Free
                </Button>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-center text-gray-600">
                  {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetState}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
