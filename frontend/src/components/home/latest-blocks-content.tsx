import LatestBlocksTable from "./table/latest-blocks-table";
import { useLoadingLeastBlocks } from "@/store/block/hooks";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LastestBlocksContent() {
  const loading = useLoadingLeastBlocks();
  return (
    <Card className="h-full flex flex-col border shadow-sm rounded-xl hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Latest Blocks</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
          asChild
        >
          <Link href="/blocks">
            View More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="relative min-h-[100px] h-full">
          <LoadingOverlay visible={loading} />
          <LatestBlocksTable />
        </div>
      </CardContent>
    </Card>
  );
}
