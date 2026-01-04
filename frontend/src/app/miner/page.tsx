"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MinerDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const minerId = searchParams.get("minerId");

  useEffect(() => {
    if (minerId) {
      router.replace(`/miner/${minerId}`);
    } else {
      router.replace("/");
    }
  }, [minerId, router]);
  return null;
}
