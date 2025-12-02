"use client";
import TitleText from "../base/title-text";
import LatestUtxosTable from "./table/latest-utxos-table";
import { useLoadingLatestUtxo } from "@/store/utxo/hooks";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function LatestUtxosContent() {
  const loading = useLoadingLatestUtxo();
  return (
    <div className="flex flex-col gap-2">
      <TitleText>Latest UTXOs</TitleText>
      <div className="relative min-h-[100px]">
        <LoadingOverlay visible={loading} />
        <LatestUtxosTable />
      </div>
    </div>
  );
}
