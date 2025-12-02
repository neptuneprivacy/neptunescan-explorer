"use client";
import BlockListTable from "@/components/block/table/block-list-table";
import { useEffect } from "react";
export default function Blocks() {
  useEffect(() => {
    document.title = `Blocks - Neptune Privacy Explorer`;
  }, []);
  return (
    <div className="w-full p-5">
      <div className="flex flex-col gap-4">
        <BlockListTable />
      </div>
    </div>
  );
}
