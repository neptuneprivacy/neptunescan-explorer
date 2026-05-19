"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import NavTextLink from "@/components/base/nav-text-link";
import { queryUtxoDetail } from "@/utils/api/apis";
import { timestampToDate } from "@/utils/tools";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { TimeClock } from "@/components/TimeClock";
import { Box, Clock, Coins, ArrowRightLeft } from "lucide-react";

interface UtxoDetail {
  id?: number;
  digest?: string;
  height?: number;
  block_hash?: string;
  time?: string;
  in_mempool: boolean;
  abandoned?: boolean;
  txid?: string;
  is_guesser_fee?: boolean;
}

const InfoRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-12 gap-2 py-3 border-b last:border-0 ${className}`}
  >
    <div className="md:col-span-3 font-medium text-muted-foreground flex items-center">
      {label}
    </div>
    <div className="md:col-span-9 flex items-center break-all">{value}</div>
  </div>
);

export default function UtxoDetailPage() {
  const params = useParams();
  const digest = params.digest as string;
  const [loading, setLoading] = useState(true);
  const [utxo, setUtxo] = useState<UtxoDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (digest) {
      document.title = `UTXO ${digest.slice(0, 16)}... - Neptune Privacy Explorer`;
      fetchUtxoDetail();
    }
  }, [digest]);

  const fetchUtxoDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await queryUtxoDetail({ digest });
      if (res.data.success) {
        setUtxo(res.data.utxo);
      } else {
        setError("UTXO not found");
      }
    } catch (err) {
      setError("Failed to fetch UTXO details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-sm border-muted">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-row items-center gap-2">
            <Coins className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl font-bold">UTXO Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 relative">
          <LoadingOverlay visible={loading} />
          {error && (
            <div className="text-center text-destructive py-8">{error}</div>
          )}
          {utxo && (
            <div className="flex flex-col">
              <InfoRow
                label="Digest"
                value={
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">
                      {utxo.digest || digest}
                    </span>
                    <CopyButton value={utxo.digest || digest} />
                  </div>
                }
              />

              {utxo.id !== undefined && utxo.id !== 0 && (
                <InfoRow
                  label="UTXO Index"
                  value={
                    <span className="font-medium">
                      {utxo.id.toLocaleString()}
                    </span>
                  }
                />
              )}

              <InfoRow
                label="Type"
                value={
                  utxo.is_guesser_fee ? (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">
                      Guesser Fee
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
                      Transaction
                    </Badge>
                  )
                }
              />

              <InfoRow
                label="Status"
                value={
                  utxo.abandoned ? (
                    <Badge variant="destructive">
                      Abandoned
                    </Badge>
                  ) : utxo.in_mempool ? (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                      Confirmed
                    </Badge>
                  )
                }
              />

              {utxo.height !== undefined && utxo.height !== 0 && (
                <InfoRow
                  label="Block Height"
                  value={
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-muted-foreground" />
                      <NavTextLink
                        href={`/block/${utxo.height}`}
                        className="text-[rgb(59,64,167)] font-medium hover:underline"
                      >
                        {utxo.height.toLocaleString()}
                      </NavTextLink>
                    </div>
                  }
                />
              )}

              {utxo.block_hash && (
                <InfoRow
                  label="Block Hash"
                  value={
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{utxo.block_hash}</span>
                      <CopyButton value={utxo.block_hash} />
                    </div>
                  }
                />
              )}

              {utxo.txid ? (
                <InfoRow
                  label="Transaction"
                  value={
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                      <NavTextLink
                        href={`/tx?id=${utxo.txid}`}
                        className="text-[rgb(59,64,167)] font-mono hover:underline"
                      >
                        {utxo.txid}
                      </NavTextLink>
                      <CopyButton value={utxo.txid} />
                    </div>
                  }
                />
              ) : null}

              <InfoRow
                label="Timestamp"
                value={
                  utxo.time ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span>
                        {timestampToDate(
                          stringConvertToTimestamp(utxo.time),
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border">
                        <Clock className="h-3 w-3" />
                        <TimeClock
                          timeStamp={stringConvertToTimestamp(utxo.time)}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">-</span>
                  )
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
