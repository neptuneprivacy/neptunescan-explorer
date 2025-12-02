import Link from "next/link";
import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export default function NavTextLink({
  children,
  href,
  disable,
  style,
  className,
}: {
  children: React.ReactNode;
  href: string;
  disable?: boolean;
  style?: CSSProperties | undefined;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        "inline-block",
        disable
          ? "text-[#8E8E93] cursor-not-allowed"
          : "text-[rgb(59,64,167)] hover:underline",
        className
      )}
      style={{ ...style }}
      href={href}
    >
      {children}
    </Link>
  );
}
