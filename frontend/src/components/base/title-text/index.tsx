import React from "react";

export default function TitleText({ children }: { children: string }) {
  return <h1 className="text-xl font-semibold">{children}</h1>;
}
