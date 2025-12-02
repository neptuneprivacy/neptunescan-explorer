"use client";
import UtxoListTable from "@/components/utxo/table/utxo-list-table";
import { useEffect } from "react";

export default function Utxos() {
  useEffect(() => {
    document.title = `Utxos - Neptune Privacy Explorer`;
  }, []);
  return (
    <div className="w-full p-5">
      <div className="flex flex-col gap-4">
        <UtxoListTable />
      </div>
    </div>
  );
}
