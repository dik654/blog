import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Box,
  Braces,
  Clock3,
  Database,
  FileText,
  FlaskConical,
  GitBranch,
  RefreshCw,
  Route,
  Sparkles,
  Target,
} from 'lucide-react';
import type { Article } from '@/content';
import {
  foundationBranches,
  foundationPaperSpine,
  foundationPhases,
  foundationScienceGaps,
} from '@/content/ai/foundationCurriculum';
import { articlePath } from '@/lib/paths';

interface Props {
  articles: Article[];
  allArticles: Article[];
  categorySlug: string;
}

const learningLoop = [
  { label: '데이터', detail: '관측과 정답', icon: Database, tone: 'data' },
  { label: '모델', detail: '조절할 함수', icon: Box, tone: 'model' },
  { label: '예측', detail: '현재의 답', icon: Sparkles, tone: 'prediction' },
  { label: '손실', detail: '오차의 숫자', icon: Target, tone: 'loss' },
  { label: '기울기', detail: '책임과 방향', icon: GitBranch, tone: 'gradient' },
  { label: '업데이트', detail: '다음 파라미터', icon: RefreshCw, tone: 'update' },
] as const;

function ArticleRow({
  article,
  categorySlug,
  order,
  question,
  outcome,
}: {
  article: Article;
  categorySlug: string;
  order: string;
  question: string;
  outcome: string;
}) {
  const prefetch = () => { article.component().catch(() => undefined); };

  return (
    <Link
      to={articlePath(categorySlug, article.slug)}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      className="foundation-path-article group grid min-w-0 gap-3 border-t border-border/70 py-5 transition-colors last:border-b sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:items-start sm:px-3"
    >
      <span className="foundation-path-article__number font-mono text-lg font-bold" aria-hidden="true">{order}</span>
      <span className="min-w-0">
        <span className="block text-base font-bold leading-snug group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
          {article.title}
        </span>
        <span className="mt-1.5 block text-sm font-semibold leading-relaxed text-foreground/85">{question}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{outcome}</span>
        <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {article.level && <span>{article.level}</span>}
          {article.estimatedMinutes && (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> 약 {article.estimatedMinutes}분
            </span>
          )}
        </span>
      </span>
      <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground sm:mt-2 sm:block" aria-hidden="true" />
    </Link>
  );
}

export default function FoundationLearningPath({ articles, allArticles, categorySlug }: Props) {
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const allBySlug = new Map(allArticles.map((article) => [article.slug, article]));
  const coreCount = foundationPhases.reduce((count, phase) => count + phase.items.length, 0);

  return (
    <div className="foundation-learning-path space-y-16">
      <section className="foundation-path-intro" aria-labelledby="foundation-core-title">
        <div className="grid gap-6 border-y border-border py-7 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Route className="h-4 w-4" aria-hidden="true" />
              기초 계산 경로 · 한 번의 UPDATE
            </div>
            <h2 id="foundation-core-title" className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
              한 번의 학습 루프를 직접 계산할 때까지
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              각 글에서 모델, 손실, 기울기와 업데이트의 역할을 하나씩 계산한다. 마지막 통합 글에서는 같은 숫자를 입력부터 새 loss 재검산까지 끊지 않고 한 바퀴 돌린다.
            </p>
          </div>
          <div className="border-l-2 border-blue-600 pl-4">
            <p className="font-mono text-4xl font-bold leading-none">00→04</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">{coreCount}개 핵심 글</strong><br />학습 루프에서 표현 학습까지</p>
          </div>
        </div>

        <div className="foundation-loop" aria-label="딥러닝 학습 루프">
          {learningLoop.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="contents">
                <div className="foundation-loop__step" data-tone={step.tone}>
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="font-mono text-[10px] opacity-65">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="mt-3 text-sm font-bold">{step.label}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{step.detail}</p>
                </div>
                {index < learningLoop.length - 1 && (
                  <div className="foundation-loop__arrow" aria-hidden="true">
                    <ArrowRight className="hidden h-4 w-4 sm:block" />
                    <ArrowDown className="h-4 w-4 sm:hidden" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          이 지도는 이후 CNN, Transformer, Diffusion, Robot Learning에서도 그대로 반복된다. 달라지는 것은 모델 구조와 목적 함수이지 학습의 뼈대가 아니다.
        </p>
      </section>

      <section aria-label="AI Foundations 핵심 학습 순서">
        <div className="space-y-14">
          {foundationPhases.map((phase) => (
            <section key={phase.id} className="foundation-phase" data-phase={phase.number} aria-labelledby={`phase-${phase.id}`}>
              <div className="foundation-phase__header">
                <p className="foundation-phase__number font-mono" aria-hidden="true">{phase.number}</p>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase text-muted-foreground">Milestone {phase.number}</p>
                  <h3 id={`phase-${phase.id}`} className="mt-1 text-xl font-bold">{phase.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
                </div>
              </div>
              <div className="foundation-phase__articles">
                {phase.items.map((item, index) => {
                  const article = bySlug.get(item.slug);
                  if (!article) return null;
                  return (
                    <ArticleRow
                      key={item.slug}
                      article={article}
                      categorySlug={categorySlug}
                      order={`${phase.number}.${index + 1}`}
                      question={item.question}
                      outcome={item.outcome}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section aria-labelledby="foundation-papers-title" className="border-t border-border pt-10">
        <div className="mb-6 grid gap-3 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-muted-foreground">Optional source deep dives</p>
            <h2 id="foundation-papers-title" className="mt-1 text-xl font-bold">핵심 경로는 위에서 끝난다. 필요한 원문만 선택해 읽는다</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              아래 논문은 다음 단계의 필수 선수가 아니다. 구현 근거, 수식의 정확한 출처, 실험이 실제로 입증한 범위를 확인해야 할 때만 연다. 더 오래된 선행 논문은 새 계산 능력을 주지 않으면 인용에서 멈춘다.
            </p>
          </div>
        </div>
        <details className="group rounded-md border border-border/70 bg-muted/[0.08]">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            <FileText className="h-4 w-4 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            원문 근거 {foundationPaperSpine.length}묶음 펼치기
            <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">기본 경로에서는 숨김</span>
            <span className="ml-auto hidden text-xs font-normal text-muted-foreground group-open:inline">접기</span>
          </summary>
          <div className="divide-y divide-border/70 border-t border-border/70">
            {foundationPaperSpine.map((item, index) => (
              <div key={item.year} className="grid gap-3 px-4 py-5 sm:grid-cols-[3rem_7rem_minmax(0,1fr)] sm:gap-5">
                <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">선택 {index + 1}</span>
                <div>
                  <p className="font-mono text-sm font-bold">{item.year}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.concept}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-relaxed">{item.question}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.slugs.map((slug) => {
                      const article = bySlug.get(slug);
                      if (!article) return null;
                      return (
                        <Link key={slug} to={articlePath(categorySlug, slug)} className="group inline-flex min-w-0 items-center gap-2 rounded-md border border-amber-500/25 bg-amber-500/[0.035] px-3 py-2 text-xs font-semibold transition-colors hover:bg-amber-500/[0.08]">
                          <span className="min-w-0 truncate">{article.title}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>

      <section aria-labelledby="foundation-science-title" className="border-t border-border pt-10">
        <div className="mb-6 grid gap-3 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-muted-foreground">Just-in-time science</p>
            <h2 id="foundation-science-title" className="mt-1 text-xl font-bold">수학은 필요해지는 지점에서 연결한다</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              수학 과정을 전부 끝낸 뒤 시작하지 않는다. 아래 {foundationScienceGaps.length}개 글을 신경망에서 처음 쓰는 순간에 열어 기호, shape, 계산 결과를 바로 검산한다.
            </p>
          </div>
        </div>
        <div className="divide-y divide-border/70 border-y border-border/70">
          {foundationScienceGaps.map((gap, index) => (
            <Link key={gap.area} to={articlePath(categorySlug, gap.slug)} className="group grid gap-2 py-5 transition-colors hover:bg-cyan-500/[0.035] sm:grid-cols-[2.5rem_11rem_minmax(0,1fr)_auto] sm:gap-5 sm:px-3">
              <span className="font-mono text-sm font-bold text-cyan-700 dark:text-cyan-300">S{index + 1}</span>
              <div>
                <h3 className="text-sm font-bold">{gap.area}</h3>
                <p className="mt-1 text-xs text-muted-foreground">첫 연결: {gap.firstUsed}</p>
              </div>
              <div>
                <p className="text-sm font-medium leading-relaxed">{gap.concepts}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{gap.reason}</p>
              </div>
              {allBySlug.has(gap.slug) && <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 sm:mt-2 sm:block" aria-hidden="true" />}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="foundation-branches-title" className="border-t border-border pt-10">
        <div className="mb-6 flex items-start gap-3">
          <Braces className="mt-1 h-5 w-5 text-violet-600" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-bold uppercase text-muted-foreground">Transfer routes</p>
            <h2 id="foundation-branches-title" className="mt-1 text-xl font-bold">같은 뼈대를 다른 문제에서 다시 찾는다</h2>
          </div>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {foundationBranches.map((branch) => {
            const article = bySlug.get(branch.slug);
            if (!article) return null;
            return (
              <Link
                key={branch.slug}
                to={articlePath(categorySlug, branch.slug)}
                className="group min-w-0 bg-background p-5 transition-colors hover:bg-violet-500/[0.035]"
              >
                <span className="text-xs font-bold text-violet-700 dark:text-violet-300">{branch.label}</span>
                <h3 className="mt-2 text-base font-bold leading-snug">{article.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed">{branch.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{branch.note}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold">
                  읽기 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-2 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
        <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
        각 글은 핵심 질문, 계산 가능한 예제, 실패 조건, 원 논문·공식 자료를 같은 순서로 연결한다.
      </div>
    </div>
  );
}
