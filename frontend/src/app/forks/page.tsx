"use client";
import ForkListTable from "@/components/block/table/forks-list-table";
import { useEffect } from "react";
export default function Forks() {
  useEffect(() => {
    document.title = `Forks - Neptune Privacy Explorer`;
  }, []);
  return (
    <div className="w-full p-5">
      <div className="flex flex-col gap-4">
        <ForkListTable />
      </div>
    </div>
  );
}
