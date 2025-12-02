import NetworkContent from "../home/network-content";
import React from "react";

export default function ExploreHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden sm:flex flex-row justify-between w-full px-[30px] flex-nowrap my-[10px]">
        <div className="flex"></div>
        <div className="flex flex-row gap-4">
          <NetworkContent />
        </div>
      </div>
      {children}
    </>
  );
}
