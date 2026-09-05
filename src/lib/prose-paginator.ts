import { Poem } from "@/types/database";

export interface PageContent {
  paragraphs: string[];
  pageNumberInPoem: number; // 1-based page number within this poem/essay
  totalPagesInPoem: number;
  isProse: boolean;
}

export interface BookSpread {
  id: string;
  poem: Poem;
  spreadIndex: number; // 0-based index of spread for this poem
  totalSpreads: number; // Total spreads for this poem
  overallSpreadIndex: number; // Global 0-based spread index in book
  globalPageLeftNumber: number; // e.g. 1, 3, 5...
  globalPageRightNumber: number; // e.g. 2, 4, 6...
  leftPage: PageContent;
  rightPage: PageContent;
}

export function isProseForm(formType: string): boolean {
  if (!formType) return false;
  const normalized = formType.toLowerCase().trim();
  return [
    "tan_van",
    "van_xuoi",
    "but_ky",
    "doan_van",
    "tản văn",
    "văn xuôi",
    "bút ký",
    "tùy bút",
    "prose",
  ].includes(normalized);
}

/**
 * Phân chia nội dung bài thơ hoặc tản văn thành các trang sách nhã nhặn.
 * Tản văn dài được chia thành nhiều trang (~130-180 từ / trang).
 * Bài thơ nhiều khổ được chia thành các trang (~4-6 khổ / trang).
 */
export function buildBookSpreads(poems: Poem[]): BookSpread[] {
  if (!poems || poems.length === 0) return [];

  const spreads: BookSpread[] = [];
  let globalSpreadCounter = 0;

  poems.forEach((poem) => {
    const isProse = isProseForm(poem.form_type) || isProseForm(poem.category?.name || "");
    const rawText = poem.raw_text || poem.excerpt || "";

    if (isProse) {
      // Xử lý Tản Văn / Văn Xuôi
      const paragraphs = rawText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      // Gom nhóm đoạn văn sao cho mỗi trang khoảng 120-180 từ
      const pages: string[][] = [];
      let currentChunk: string[] = [];
      let currentWordCount = 0;

      paragraphs.forEach((para) => {
        const words = para.split(/\s+/).filter(Boolean).length;
        if (currentWordCount > 0 && currentWordCount + words > 180) {
          pages.push(currentChunk);
          currentChunk = [para];
          currentWordCount = words;
        } else {
          currentChunk.push(para);
          currentWordCount += words;
        }
      });
      if (currentChunk.length > 0) {
        pages.push(currentChunk);
      }

      // Đảm bảo số trang là số chẵn để tạo thành các spread (mỗi spread 2 trang: Trái & Phải)
      if (pages.length === 0) {
        pages.push([rawText]);
      }

      const totalPagesInPoem = pages.length;
      const totalSpreadsForPoem = Math.ceil(totalPagesInPoem / 2);

      for (let sIdx = 0; sIdx < totalSpreadsForPoem; sIdx++) {
        const leftPageIdx = sIdx * 2;
        const rightPageIdx = sIdx * 2 + 1;

        const leftParas = pages[leftPageIdx] || [];
        const rightParas = pages[rightPageIdx] || [];

        globalSpreadCounter++;

        spreads.push({
          id: `${poem.id}-spread-${sIdx}`,
          poem,
          spreadIndex: sIdx,
          totalSpreads: totalSpreadsForPoem,
          overallSpreadIndex: globalSpreadCounter - 1,
          globalPageLeftNumber: globalSpreadCounter * 2 - 1,
          globalPageRightNumber: globalSpreadCounter * 2,
          leftPage: {
            paragraphs: leftParas,
            pageNumberInPoem: leftPageIdx + 1,
            totalPagesInPoem,
            isProse: true,
          },
          rightPage: {
            paragraphs: rightParas,
            pageNumberInPoem: rightPageIdx + 1,
            totalPagesInPoem,
            isProse: true,
          },
        });
      }
    } else {
      // Xử lý Thi Phẩm (Thơ Lục Bát, Tự Do, Đường Luật...)
      const stanzas = rawText
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (stanzas.length <= 8) {
        // Thơ ngắn (<= 8 khổ): Nằm trọn trong 1 spread (Trang Trái 1/2 stanzas, Trang Phải 2/2 stanzas)
        const half = Math.max(1, Math.ceil(stanzas.length / 2));
        const leftStanzas = stanzas.slice(0, half);
        const rightStanzas = stanzas.slice(half);

        globalSpreadCounter++;

        spreads.push({
          id: `${poem.id}-spread-0`,
          poem,
          spreadIndex: 0,
          totalSpreads: 1,
          overallSpreadIndex: globalSpreadCounter - 1,
          globalPageLeftNumber: globalSpreadCounter * 2 - 1,
          globalPageRightNumber: globalSpreadCounter * 2,
          leftPage: {
            paragraphs: leftStanzas,
            pageNumberInPoem: 1,
            totalPagesInPoem: 2,
            isProse: false,
          },
          rightPage: {
            paragraphs: rightStanzas,
            pageNumberInPoem: 2,
            totalPagesInPoem: 2,
            isProse: false,
          },
        });
      } else {
        // Thơ dài (> 8 khổ): Mỗi trang 4 khổ thơ -> 8 khổ / spread
        const stanzasPerPage = 4;
        const totalPagesInPoem = Math.ceil(stanzas.length / stanzasPerPage);
        const totalSpreadsForPoem = Math.ceil(totalPagesInPoem / 2);

        for (let sIdx = 0; sIdx < totalSpreadsForPoem; sIdx++) {
          const leftStanzas = stanzas.slice(sIdx * 8, sIdx * 8 + 4);
          const rightStanzas = stanzas.slice(sIdx * 8 + 4, sIdx * 8 + 8);

          globalSpreadCounter++;

          spreads.push({
            id: `${poem.id}-spread-${sIdx}`,
            poem,
            spreadIndex: sIdx,
            totalSpreads: totalSpreadsForPoem,
            overallSpreadIndex: globalSpreadCounter - 1,
            globalPageLeftNumber: globalSpreadCounter * 2 - 1,
            globalPageRightNumber: globalSpreadCounter * 2,
            leftPage: {
              paragraphs: leftStanzas,
              pageNumberInPoem: sIdx * 2 + 1,
              totalPagesInPoem: totalSpreadsForPoem * 2,
              isProse: false,
            },
            rightPage: {
              paragraphs: rightStanzas,
              pageNumberInPoem: sIdx * 2 + 2,
              totalPagesInPoem: totalSpreadsForPoem * 2,
              isProse: false,
            },
          });
        }
      }
    }
  });

  return spreads;
}
