import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ClipboardList, FileText } from 'lucide-react';
import { getLabDoc, labDocs } from '@/content/lab-management';
import { BLOG_ROOT, LAB_ROOT } from '@/lib/paths';

const statusLabel = {
  active: '운영 중',
  living: '상시 갱신',
  draft: '작성 중',
};

export default function LabDocPage() {
  const { doc } = useParams<{ doc: string }>();
  const current = getLabDoc(doc);

  if (!current) {
    return <Navigate to={doc ? `${BLOG_ROOT}/${doc}` : LAB_ROOT} replace />;
  }

  const currentIndex = labDocs.findIndex((item) => item.slug === current.slug);
  const previous = labDocs[currentIndex - 1];
  const next = labDocs[currentIndex + 1];

  return (
    <article className="min-h-[calc(100vh-3.5rem)] bg-background">
      <header className="border-b px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-5xl">
          <Link
            to={LAB_ROOT}
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            랩 개요
          </Link>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-md border px-2 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {current.eyebrow}
            </span>
            <span className="rounded-md border bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
              {statusLabel[current.status]}
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {current.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">{current.summary}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-8">
          {current.sections.map((section) => (
            <section key={section.title} className="rounded-lg border bg-card p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-md border p-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
                  {section.body && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.title} className="rounded-lg border bg-background p-4">
                    {item.meta && (
                      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {item.meta}
                      </p>
                    )}
                    <h3 className="mb-2 text-sm font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">운영 체크</h2>
            </div>
            <div className="space-y-3">
              {current.checklist.map((item) => (
                <div key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            {previous && (
              <Link
                to={`../${previous.slug}`}
                relative="path"
                className="rounded-lg border bg-background p-3 text-sm transition-colors hover:bg-accent/40"
              >
                <span className="block text-xs text-muted-foreground">이전</span>
                <span className="font-medium">{previous.label}</span>
              </Link>
            )}
            {next && (
              <Link
                to={`../${next.slug}`}
                relative="path"
                className="rounded-lg border bg-background p-3 text-sm transition-colors hover:bg-accent/40"
              >
                <span className="block text-xs text-muted-foreground">다음</span>
                <span className="font-medium">{next.label}</span>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
