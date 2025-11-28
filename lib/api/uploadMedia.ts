import axios, { AxiosProgressEvent, AxiosResponse } from "axios";
import { UploadMediaResponse } from "@/types/uploadMedia.types";

export function uploadMedia(
  file: File,
  onProgress?: (progress: number) => void
): Promise<AxiosResponse<UploadMediaResponse>> {

  if (!file) {
    return Promise.reject(new Error("No file provided"));
  }

  const formData = new FormData();
  formData.append("file", file);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return axios.post<UploadMediaResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/media/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true",
        ...(token && { Authorization: `Bearer ${token}` }),
      },

      onUploadProgress: (event: AxiosProgressEvent) => {
        if (event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress?.(progress);
        }
      },
    }
  );
}
