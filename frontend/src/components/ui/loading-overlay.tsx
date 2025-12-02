import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingOverlay({
  visible,
  className,
}: {
  visible: boolean;
  className?: string;
}) {
  if (!visible) return null;
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
