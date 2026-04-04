import { useRef, type ReactNode } from 'react';
import { useAutoSections } from '@/hooks/useAutoSections';
import TableOfContents from './TableOfContents';

interface Props {
  title: string;
  children: ReactNode;
}

export default function ArticleLayout({ title, children }: Props) {
  const articleRef = useRef<HTMLElement>(null);
  const sections = useAutoSections(articleRef);

  return (
    <div className="flex">
      <article ref={articleRef} className="min-w-0 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{title}</h1>
        <div>
          {children}
        </div>
      </article>
      <aside className="hidden w-64 shrink-0 ml-10 xl:block">
        <div className="sticky top-20">
          {sections.length > 0 && <TableOfContents sections={sections} />}
        </div>
      </aside>
    </div>
  );
}
