import { useEffect, useState, useCallback } from 'react';
import type { Section } from '@/content';

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

function extractSections(root: HTMLElement): Section[] {
  const result: Section[] = [];
  const sectionEls = root.querySelectorAll<HTMLElement>('section[id]');

  if (sectionEls.length > 0) {
    sectionEls.forEach((sec) => {
      const id = sec.id;
      const h2 = sec.querySelector('h2');
      const title = h2?.textContent?.trim() ?? id;
      if (!id) return;

      const subs: { id: string; title: string }[] = [];
      sec.querySelectorAll<HTMLElement>('h3').forEach((h3) => {
        const text = h3.textContent?.trim();
        if (!text) return;
        if (!h3.id) {
          h3.id = `${id}-${toSlug(text)}`;
          h3.classList.add('scroll-mt-20');
        }
        subs.push({ id: h3.id, title: text });
      });

      result.push({ id, title, subsections: subs.length > 0 ? subs : undefined });
    });
  } else {
    const headings = root.querySelectorAll<HTMLElement>('h2, h3');
    let current: Section | null = null;
    headings.forEach((el) => {
      const title = el.textContent?.trim() ?? '';
      if (!title) return;
      if (!el.id) { el.id = toSlug(title); el.classList.add('scroll-mt-20'); }
      if (el.tagName === 'H2') {
        current = { id: el.id, title };
        result.push(current);
      } else if (el.tagName === 'H3' && current) {
        if (!current.subsections) current.subsections = [];
        current.subsections.push({ id: el.id, title });
      }
    });
  }
  return result;
}

export function useAutoSections(containerRef?: React.RefObject<HTMLElement | null>): Section[] {
  const [sections, setSections] = useState<Section[]>([]);

  const scan = useCallback(() => {
    const root = containerRef?.current ?? document.querySelector('article');
    if (!root) return;
    const found = extractSections(root as HTMLElement);
    if (found.length > 0) setSections(found);
  }, [containerRef]);

  useEffect(() => {
    // 초기 스캔 (lazy 로딩 전 시도)
    const t = setTimeout(scan, 200);

    // DOM 변경 감시 (lazy 컴포넌트 로딩 후 감지)
    const root = containerRef?.current ?? document.querySelector('article');
    if (!root) return () => clearTimeout(t);

    const observer = new MutationObserver(() => {
      setTimeout(scan, 100);
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => { clearTimeout(t); observer.disconnect(); };
  }, [containerRef, scan]);

  return sections;
}
