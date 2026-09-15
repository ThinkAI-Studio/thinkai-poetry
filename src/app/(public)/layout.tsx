import React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/tai-ui/SmoothScroll";
import { PoeticBookProvider } from "@/context/PoeticBookContext";
import { SeasonProvider } from "@/context/SeasonContext";
import { FloatingBookModal } from "@/components/book/FloatingBookModal";
import { PoeticGrassFringe } from "@/components/effects/PoeticGrassFringe";
import { SeasonAtmosphere } from "@/components/effects/SeasonAtmosphere";
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
    <SeasonProvider>
      <PoeticBookProvider initialPoems={publishedPoems}>
        <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
          <SmoothScroll />
          <SeasonAtmosphere />
          <SiteHeader />
          <main className="flex-1 pt-14 sm:pt-20">
            {children}
          </main>
          <PoeticGrassFringe />
          <SiteFooter />
          <FloatingBookModal />
        </div>
      </PoeticBookProvider>
    </SeasonProvider>
  );
}

