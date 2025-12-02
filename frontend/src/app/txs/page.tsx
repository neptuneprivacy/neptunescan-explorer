"use client";
import TransactionListTable from "@/components/utxo/table/transaction-list-table";
import { useEffect } from "react";

export default function Ttansactions() {
  useEffect(() => {
    document.title = `Ttansactions - Neptune Privacy Explorer`;
  }, []);
  return (
    <div className="w-full p-5">
      <div className="flex flex-col gap-4">
        <TransactionListTable />
      </div>
    </div>
  );
}
