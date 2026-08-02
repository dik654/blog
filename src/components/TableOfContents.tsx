import { useEffect, useRef, useState } from 'react';
import type { Section } from '@/content';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  sections: Section[];
}

export default function TableOfContents({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
      for (const sub of section.subsections ?? []) {
        const subEl = document.getElementById(sub.id);
        if (subEl) observer.observe(subEl);
      }
    }

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!activeId) return;

    const activeLink = navRef.current?.querySelector<HTMLAnchorElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`,
    );
    activeLink?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <ScrollArea className="max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
      <nav ref={navRef} className="space-y-0.5 pb-4">
        <p className="mb-3 text-sm font-semibold text-foreground">목차</p>
        {sections.map((section) => {
          const sectionActive = activeId === section.id ||
            (section.subsections?.some(s => s.id === activeId) ?? false);
          return (
            <div key={section.id}>
              <a
                href={`#${section.id}`}
                data-toc-id={section.id}
                className={cn(
                  'block rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground',
                  sectionActive
                    ? 'font-medium text-foreground bg-accent'
                    : 'text-muted-foreground',
                )}
                onClick={(e) => { e.preventDefault(); scrollTo(section.id); }}
              >
                {section.title}
              </a>
              {section.subsections?.map((sub) => (
                <a
                  key={sub.id}
                  href={`#${sub.id}`}
                  data-toc-id={sub.id}
                  className={cn(
                    'block rounded-md pl-6 pr-3 py-1 text-xs transition-colors hover:text-foreground',
                    activeId === sub.id
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground/70',
                  )}
                  onClick={(e) => { e.preventDefault(); scrollTo(sub.id); }}
                >
                  {sub.title}
                </a>
              ))}
            </div>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
