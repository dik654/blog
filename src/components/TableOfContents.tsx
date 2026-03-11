import { useEffect, useState } from 'react';
import type { Section } from '@/content';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  sections: Section[];
}

export default function TableOfContents({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>('');

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
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <nav className="space-y-1">
        <p className="mb-3 text-sm font-semibold text-foreground">목차</p>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              'block rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground',
              activeId === section.id
                ? 'font-medium text-foreground bg-accent'
                : 'text-muted-foreground',
            )}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {section.title}
          </a>
        ))}
      </nav>
    </ScrollArea>
  );
}
