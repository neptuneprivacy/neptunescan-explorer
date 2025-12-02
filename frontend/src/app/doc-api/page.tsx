"use client";
import "./swagger.css";
import { SWAGGER_URL } from "@/config";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p>Loading Swagger...</p>,
});

export default function Api() {
  useEffect(() => {
    document.title = `Apis - Neptune Privacy Explorer`;
  }, []);
  return (
    <div className="w-full p-5">
      <SwaggerUI url={SWAGGER_URL} />
    </div>
  );
}
