import type { ReactNode } from 'react';
import type { Section } from '@/content';
import TableOfContents from './TableOfContents';

interface Props {
  title: string;
  sections: Section[];
  children: ReactNode;
}

export default function ArticleLayout({ title, sections, children }: Props) {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{title}</h1>
        <div>
          {children}
        </div>
      </article>
      <aside className="hidden w-64 shrink-0 ml-10 xl:block">
        <div className="sticky top-20">
          <TableOfContents sections={sections} />
        </div>
      </aside>
    </div>
  );
}
