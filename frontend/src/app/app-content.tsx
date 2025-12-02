"use client";
import { Header } from "@/components/header";
import ExploreHeader from "@/components/header/explore-header";
import Navbar from "@/components/navbar";
import React, { Suspense } from "react";
import { PropsWithChildren } from "react";

function AppContent({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen w-full">
        <Navbar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="sm:hidden h-[60px] border-b sticky top-0 z-50 bg-background">
            <Header />
          </div>
          <main className="flex-1">
            <ExploreHeader>{children}</ExploreHeader>
          </main>
        </div>
      </div>
    </Suspense>
  );
}

export default React.memo(AppContent);
