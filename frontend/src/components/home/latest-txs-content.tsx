"use client";
import { useLoadingLatestTxs } from "@/store/txs/hooks";
import LatestTxsTable from "./table/latest-txs-table";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LatestTxsContent() {
  const loading = useLoadingLatestTxs();
  return (
    <Card className="h-full flex flex-col border shadow-sm rounded-xl hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Latest Transactions</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
          asChild
        >
          <Link href="/txs">
            View More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="relative min-h-[100px] h-full">
          <LoadingOverlay visible={loading} />
          <LatestTxsTable />
        </div>
      </CardContent>
    </Card>
  );
}
