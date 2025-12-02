import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Empty({ w, h }: { w?: string; h?: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: w ?? "100%", height: h ?? "100vh" }}
    >
      <Alert className="w-auto max-w-md">
        <AlertTitle>Magic is in the making... ✨</AlertTitle>
        <AlertDescription>Stay tuned for awesome updates!</AlertDescription>
      </Alert>
    </div>
  );
}
