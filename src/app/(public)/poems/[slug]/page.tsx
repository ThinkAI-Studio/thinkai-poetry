import React from "react";
import { notFound } from "next/navigation";
import { getPoemBySlug } from "@/lib/data-service";
import { PoemReaderView } from "@/components/reader/PoemReaderView";

interface PoemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = await getPoemBySlug(slug);
  if (!poem) return { title: "Không tìm thấy bài thơ" };
  return {
    title: `${poem.title} | Thịnh và Thơ`,
    description: poem.excerpt || poem.raw_text.slice(0, 150),
  };
}

export default async function PoemDetailPage({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = await getPoemBySlug(slug);

  if (!poem) {
    notFound();
  }

  return <PoemReaderView poem={poem} />;
}
