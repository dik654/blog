import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock3, Route } from 'lucide-react';
import type { Article } from '@/content';
import { nlpCurriculum } from '@/content/ai/nlpCurriculum';
import { articlePath } from '@/lib/paths';

interface Props {
  articles: Article[];
  categorySlug: string;
}

export default function NlpLearningPath({ articles, categorySlug }: Props) {
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const coreCount = nlpCurriculum.reduce((count, phase) => count + phase.items.length, 0);
  const sourcePairs = nlpCurriculum.flatMap((phase) => phase.items.flatMap((item) => {
    const source = item.paperSlug ? bySlug.get(item.paperSlug) : undefined;
    const concept = bySlug.get(item.slug);
    return source && concept ? [{ source, concept }] : [];
  }));

  return (
    <div className="space-y-12">
      <section aria-labelledby="nlp-path-title">
        <div className="mb-8 grid gap-4 border-y border-border/70 py-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Route className="h-4 w-4" aria-hidden="true" />권장 학습 순서</div>
            <h2 id="nlp-path-title" className="text-xl font-bold">문자열에서 Transformer 표현까지 한 데이터 흐름으로 잇는다</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Token ID와 embedding에서 시작해 recurrent state, attention memory, Transformer block, bidirectional pre-training으로 확장한다. 각 단계는 이전 구조의 병목을 다음 구조의 설계 이유로 사용한다.</p>
          </div>
          <div className="text-sm text-muted-foreground"><strong className="text-foreground">{coreCount}</strong>개 필수 개념 · 원문은 선택 · 4단계</div>
        </div>

        <div className="space-y-11">
          {nlpCurriculum.map((phase) => (
            <section key={phase.number} aria-labelledby={`nlp-phase-${phase.number}`}>
              <div className="mb-4 grid gap-2 sm:grid-cols-[4rem_1fr]">
                <p className="font-mono text-sm font-bold text-muted-foreground">PHASE {phase.number}</p>
                <div><h3 id={`nlp-phase-${phase.number}`} className="text-lg font-bold">{phase.title}</h3><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{phase.description}</p></div>
              </div>
              <div className="sm:pl-16">
                {phase.items.map((item, index) => {
                  const article = bySlug.get(item.slug);
                  if (!article) return null;
                  const prefetch = () => { article.component().catch(() => undefined); };
                  return (
                    <div key={item.slug} className="border-t border-border/70 last:border-b">
                      <Link to={articlePath(categorySlug, item.slug)} onPointerEnter={prefetch} onFocus={prefetch} onTouchStart={prefetch} className="group grid min-w-0 gap-3 py-5 transition-colors hover:bg-muted/20 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-start sm:px-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-xs font-bold text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground">{phase.number}.{index + 1}</span>
                        <span className="min-w-0"><span className="block text-base font-bold leading-snug group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">{article.title}</span><span className="mt-1.5 block text-sm font-medium leading-relaxed text-foreground/85">{item.question}</span><span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.outcome}</span><span className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">{article.level && <span>{article.level}</span>}{article.estimatedMinutes && <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />약 {article.estimatedMinutes}분</span>}</span></span>
                        <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:mt-2 sm:block" aria-hidden="true" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t border-border pt-8" aria-label="NLP 선택 원문 근거">
          <details className="group rounded-md border border-border/70 bg-muted/[0.08]">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
              선택 원문 근거 {sourcePairs.length}편 펼치기
              <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">핵심 경로에서는 숨김</span>
              <span className="ml-auto hidden text-xs font-normal text-muted-foreground group-open:inline">접기</span>
            </summary>
            <div className="divide-y divide-border/70 border-t border-border/70 px-4">
              {sourcePairs.map(({ source, concept }) => (
                <Link key={source.slug} to={articlePath(categorySlug, source.slug)} className="group grid min-w-0 gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center">
                  <span className="text-xs font-bold text-violet-700 dark:text-violet-300">{concept.title}</span>
                  <span className="min-w-0"><strong className="block text-sm leading-snug">{source.title}</strong><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">구현 근거나 증거 경계를 원문 수준으로 확인할 때만 연다.</span></span>
                  <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </details>
        </section>
      </section>
    </div>
  );
}
