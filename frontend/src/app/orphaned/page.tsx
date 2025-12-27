"use client";
import OrphanedListTable from "@/components/block/table/orphaned-list-table";
import { useEffect } from "react";
export default function Orphaned() {
  useEffect(() => {
    document.title = `Orphaned - Neptune Privacy Explorer`;
  }, []);
  return (
    <div className="w-full p-5">
      <div className="flex flex-col gap-4">
        <OrphanedListTable />
      </div>
    </div>
  );
}
