import React from "react";
import { PageTransition } from "@/components/layout/PageTransition";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
