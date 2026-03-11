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
    <div className="flex gap-8">
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-20">
          <TableOfContents sections={sections} />
        </div>
      </aside>
      <article className="min-w-0 flex-1 prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{title}</h1>
        {children}
      </article>
    </div>
  );
}
