import { Check, Loader2 } from "lucide-react";

export type AutoSaveStatus = "idle" | "saving" | "saved";

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
}

export default function AutoSaveIndicator({ status }: AutoSaveIndicatorProps) {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "saving" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          <span className="text-gray-600">Saving...</span>
        </>
      ) : (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-green-600">Saved</span>
        </>
      )}
    </div>
  );
}
