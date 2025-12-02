import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { X } from "lucide-react";

export default function NotificationCard() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Alert className="relative">
      <button
        onClick={() => setShow(false)}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      <AlertTitle>
        The hard-fork has officially happened! If there's any miner that have
        not upgraded to{" "}
        <a
          target="_blank"
          className="text-green-600 hover:underline"
          href="https://github.com/Neptune-Crypto/neptune-core/releases/tag/v0.2.0"
        >
          0.2.0
        </a>
        , you're wasting valuable resources.
      </AlertTitle>
    </Alert>
  );
}
