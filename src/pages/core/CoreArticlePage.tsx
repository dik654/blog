import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, type ComponentType } from 'react';
import ArticleLayout from '@/components/ArticleLayout';
import { getCoreItem, getCoreTrack } from '@/content/core';
import { CORE_ROOT, coreTrackPath } from '@/lib/paths';

export default function CoreArticlePage() {
  const { section, item: itemSlug } = useParams<{ section: string; item: string }>();
  const routeKey = `${section ?? ''}/${itemSlug ?? ''}`;
  const track = getCoreTrack(section ?? '');
  const item = getCoreItem(section ?? '', itemSlug ?? '');
  const [loadedArticle, setLoadedArticle] = useState<{ routeKey: string; Component: ComponentType } | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!item?.article) return () => { cancelled = true; };

    item.article.component().then((module) => {
      if (!cancelled) setLoadedArticle({ routeKey, Component: module.default });
    });

    return () => { cancelled = true; };
  }, [item, routeKey]);

  if (!track || !item) {
    return (
      <div className="max-w-4xl">
        <Link to={CORE_ROOT} className="text-xs text-muted-foreground hover:text-foreground">← 코어</Link>
        <p className="mt-6 text-sm text-muted-foreground">코어 항목을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const ArticleComponent = loadedArticle?.routeKey === routeKey ? loadedArticle.Component : null;

  return (
    <div className="max-w-5xl">
      <Link to={coreTrackPath(track.slug)} className="mb-8 inline-block text-xs text-muted-foreground hover:text-foreground">
        ← {track.title}
      </Link>

      {item.article ? (
        <ArticleLayout title={item.article.title} article={item.article}>
          {ArticleComponent
            ? <ArticleComponent />
            : <p className="text-muted-foreground animate-pulse">로딩 중...</p>}
        </ArticleLayout>
      ) : (
        <ArticleLayout title={item.title}>
          <div className="mb-6 flex flex-wrap gap-1.5">
            {item.stack.map((tech) => (
              <span key={tech} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>

          {item.units && (
            <section className="mb-8">
              <h2 className="mb-3 text-base font-semibold tracking-tight">기능 단위</h2>
              <div className="space-y-2">
                {item.units.map((unit) => (
                  <p key={unit} className="rounded-md border bg-card px-3 py-2 text-sm leading-relaxed text-muted-foreground">
                    {unit}
                  </p>
                ))}
              </div>
            </section>
          )}

          {item.notes && (
            <section className="mb-8">
              <h2 className="mb-3 text-base font-semibold tracking-tight">작업 기록</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {item.notes.map((note) => (
                  <div key={note.title} className="rounded-lg border bg-card p-4">
                    <h3 className="mb-2 text-sm font-semibold">{note.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{note.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {item.evidence && (
            <section>
              <h2 className="mb-3 text-base font-semibold tracking-tight">근거</h2>
              <div className="flex flex-wrap gap-1.5">
                {item.evidence.map((entry) => (
                  <span key={entry} className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                    {entry}
                  </span>
                ))}
              </div>
            </section>
          )}
        </ArticleLayout>
      )}
    </div>
  );
}
