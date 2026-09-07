import React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/tai-ui/SmoothScroll";
import { PageTransition } from "@/components/layout/PageTransition";
import { PoeticBookProvider } from "@/context/PoeticBookContext";
import { FloatingBookModal } from "@/components/book/FloatingBookModal";
import { getPoems } from "@/lib/data-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishedPoems = await getPoems();

  return (
    <PoeticBookProvider initialPoems={publishedPoems}>
      <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
        <SmoothScroll />
        <SiteHeader />
        <main className="flex-1 pt-20">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <FloatingBookModal />
      </div>
    </PoeticBookProvider>
  );
}

