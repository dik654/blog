import { Link, useParams } from 'react-router-dom';
import { getCoreTrack, type CoreItemKind, type CoreItemStatus } from '@/content/core';
import { CORE_ROOT } from '@/lib/paths';

const kindLabels: Record<CoreItemKind, string> = {
  project: '작업',
  'deep-dive': '분석',
  decision: '결정',
  lab: '실험',
};

const statusLabels: Record<CoreItemStatus, string> = {
  active: '진행',
  done: '완료',
  draft: '초안',
};

function ItemCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border p-5">{children}</div>;
}

function isCoreHref(href: string) {
  return href.startsWith(CORE_ROOT);
}

export default function CoreSectionPage() {
  const { section } = useParams<{ section: string }>();
  const track = getCoreTrack(section ?? '');

  if (!track) {
    return (
      <div className="max-w-4xl">
        <Link to={CORE_ROOT} className="text-xs text-muted-foreground hover:text-foreground">← 코어</Link>
        <p className="mt-6 text-sm text-muted-foreground">섹션을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <header className="mb-10 border-b pb-8">
        <Link to={CORE_ROOT} className="text-xs text-muted-foreground hover:text-foreground">← 코어</Link>
        <p className="mt-5 font-mono text-sm text-muted-foreground">{track.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{track.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{track.summary}</p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 border-b pb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          초점
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {track.focus.map((focus) => (
            <div key={focus} className="rounded-lg border p-4 text-sm leading-relaxed text-muted-foreground">
              {focus}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b pb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          근거
        </h2>
        <div className="space-y-3">
          {track.items.map((item) => (
            <ItemCard key={item.title}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {kindLabels[item.kind]}
                </span>
                <span className="rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {statusLabels[item.status]}
                </span>
                {item.stack.map((tech) => (
                  <span key={tech} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>
              <h3 className="mb-2 text-base font-semibold">
                {item.href ? (
                  <Link to={item.href} className="transition-colors hover:text-foreground/70">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              {item.units && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">기능 단위</p>
                  {item.units.map((unit) => (
                    <p key={unit} className="rounded-md bg-accent/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                      {unit}
                    </p>
                  ))}
                </div>
              )}
              {item.concepts && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">개념 정리</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {item.concepts.map((concept) => (
                      <div key={concept.term} className="rounded-md border bg-background/60 p-3">
                        <p className="text-sm font-semibold text-foreground">{concept.term}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{concept.summary}</p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">의도: </span>
                          {concept.intent}
                        </p>
                        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted-foreground">
                          {concept.details.map((detail) => (
                            <li key={detail} className="pl-3 before:-ml-3 before:content-['-']">
                              {detail}
                            </li>
                          ))}
                        </ul>
                        {concept.references && concept.references.some((reference) => isCoreHref(reference.href)) && (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">관련 코어</span>
                            {concept.references.filter((reference) => isCoreHref(reference.href)).map((reference) => (
                              <Link
                                key={reference.href}
                                to={reference.href}
                                className="rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                              >
                                {reference.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {item.evidence && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.evidence.map((entry) => (
                    <span key={entry} className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                      {entry}
                    </span>
                  ))}
                </div>
              )}
            </ItemCard>
          ))}
        </div>
      </section>
    </div>
  );
}
