import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock3,
  Gauge,
  ListTree,
} from 'lucide-react';
import type { Article, Category } from '@/content';
import { foundationMathBridges } from '@/content/ai/foundationCurriculum';
import { getTopDownResearchTrackById } from '@/content/ai/topdownResearchTracks';
import { getArticleNavigation } from '@/content/article-navigation';
import { getSidebarLearningStages } from '@/content/sidebar-learning-structure';
import { articlePath, categoryPath, subcategoryPath } from '@/lib/paths';
import { useAutoSections } from '@/hooks/useAutoSections';
import TableOfContents from './TableOfContents';
import ArticleVizTools from './viz/ArticleVizTools';
import { MathAnnotationProvider } from './ui/math-annotation-context';

function findSubcategoryTrail(
  subcategories: Category['subcategories'],
  slug: string,
  trail: Category['subcategories'] = [],
): Category['subcategories'] | undefined {
  for (const subcategory of subcategories) {
    const nextTrail = [...trail, subcategory];
    if (subcategory.slug === slug) return nextTrail;
    const nested = findSubcategoryTrail(subcategory.children ?? [], slug, nextTrail);
    if (nested) return nested;
  }
  return undefined;
}

interface Props {
  title: string;
  article?: Article;
  category?: Category;
  children: ReactNode;
}

function useReadingProgress(articleRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const article = articleRef.current;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const distance = Math.max(1, article.offsetHeight - window.innerHeight * 0.55);
      const next = Math.min(1, Math.max(0, (window.scrollY - top + 80) / distance));
      setProgress(next);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [articleRef]);

  return progress;
}

export default function ArticleLayout({ title, article, category, children }: Props) {
  const location = useLocation();
  const articleRef = useRef<HTMLElement>(null);
  const pathScrollRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLAnchorElement>(null);
  const sections = useAutoSections(articleRef);
  const progress = useReadingProgress(articleRef);
  const stateLearningPathId = typeof location.state === 'object'
    && location.state !== null
    && 'learningPathId' in location.state
    && typeof location.state.learningPathId === 'string'
    ? location.state.learningPathId
    : undefined;
  const query = new URLSearchParams(location.search);
  const queryLearningPathId = query.get('path') ?? undefined;
  const queryResearchTrackId = query.get('track') ?? undefined;
  const researchTrackCandidate = queryResearchTrackId
    ? getTopDownResearchTrackById(queryResearchTrackId)
    : undefined;
  const researchTrackMembers = researchTrackCandidate ? [
    {
      category: researchTrackCandidate.current.category ?? researchTrackCandidate.category,
      articleSlug: researchTrackCandidate.current.articleSlug,
    },
    {
      category: researchTrackCandidate.canonical.category ?? researchTrackCandidate.category,
      articleSlug: researchTrackCandidate.canonical.articleSlug,
    },
    ...researchTrackCandidate.concepts.map((item) => ({
      category: item.category ?? researchTrackCandidate.category,
      articleSlug: item.articleSlug,
    })),
    ...researchTrackCandidate.foundations.map((item) => ({
      category: item.category ?? researchTrackCandidate.category,
      articleSlug: item.articleSlug,
    })),
    ...researchTrackCandidate.implementation.map((item) => ({
      category: item.category ?? researchTrackCandidate.category,
      articleSlug: item.articleSlug,
    })),
  ] : [];
  const researchTrackContext = article && category && researchTrackCandidate
    && researchTrackMembers.some((item) => (
      item.articleSlug === article.slug && item.category === category.slug
    ))
    ? researchTrackCandidate
    : undefined;
  const preferredLearningPathId = stateLearningPathId ?? queryLearningPathId;
  const navigation = article && category ? getArticleNavigation(category, article, preferredLearningPathId) : undefined;
  const subcategoryTrail = article && category
    ? findSubcategoryTrail(category.subcategories, article.subcategory)
    : undefined;
  const articleStage = article && category
    ? getSidebarLearningStages(category).find((stage) => {
        const contains = (subcategory: Category['subcategories'][number]): boolean => subcategory.slug === article.subcategory
          || Boolean(subcategory.children?.some(contains));
        return stage.subcategories.some(contains);
      })
    : undefined;
  const learningPath = !researchTrackContext && navigation?.kind === 'declared' ? navigation : undefined;
  const pathIndex = navigation?.index ?? -1;
  const previous = navigation && pathIndex > 0 ? navigation.steps[pathIndex - 1] : undefined;
  const next = navigation && pathIndex >= 0 && pathIndex < navigation.steps.length - 1
    ? navigation.steps[pathIndex + 1]
    : undefined;
  const learningPathLinkState = learningPath?.pathId ? { learningPathId: learningPath.pathId } : undefined;
  const learningPathHref = (step: { category: string; slug: string }) => (
    `${articlePath(step.category, step.slug)}${learningPath?.pathId ? `?path=${encodeURIComponent(learningPath.pathId)}` : ''}`
  );
  const isMathFoundation = article?.subcategory === 'ai-math-foundations';
  const isNlpArticle = article?.subcategory === 'ai-nlp';
  const isRlFoundation = article?.subcategory === 'ai-reinforcement-learning' || Boolean(article?.subcategory.startsWith('ai-rl-'));
  const isRobotFoundation = article?.subcategory === 'ai-robotics'
    || Boolean(article?.subcategory.startsWith('ai-robotics-'));
  const isFoundationArticle = article?.subcategory === 'ai-foundations' || isMathFoundation || isNlpArticle || isRlFoundation || isRobotFoundation;
  const isSourceDeepDive = Boolean(article?.slug.startsWith('paper-') || article?.slug.startsWith('research-'));
  const isFoundationPaper = Boolean(isFoundationArticle && article?.slug.startsWith('paper-'));
  const usesDeepArticleSystem = Boolean(isFoundationArticle || isSourceDeepDive);
  const usesMathAnnotations = Boolean(usesDeepArticleSystem || article?.mathAnnotations);
  const usesTechnicalVisualSystem = article?.visualSystem !== 'none';
  const foundationStep = isFoundationArticle && pathIndex >= 0
    ? String(pathIndex + 1).padStart(2, '0')
    : undefined;
  const coordinateNumber = foundationStep ?? (isSourceDeepDive ? (isFoundationPaper ? 'P' : 'R') : 'EX');
  const coordinateLabel = isSourceDeepDive
    ? 'SOURCE DEEP DIVE'
    : isNlpArticle
      ? 'NLP & ATTENTION'
      : isRlFoundation
        ? 'REINFORCEMENT LEARNING'
        : isRobotFoundation
          ? 'ROBOT AI & CONTROL'
        : isMathFoundation
          ? 'MATH & SCIENCE'
          : 'AI FOUNDATIONS';
  const coordinateDetail = isSourceDeepDive
    ? article?.slug.startsWith('research-')
      ? '현재 최상단 연구의 주장·수식·증거 재구성'
      : '필수 경로 밖의 선택 원문 재구성'
    : foundationStep
      ? `${pathIndex + 1}번째 ${isMathFoundation ? '수학 기반' : isNlpArticle ? '언어 모델 기반' : isRlFoundation ? '순차 의사결정 기반' : '핵심 개념'}`
      : '선택 확장 개념';
  const mathBridges = article ? foundationMathBridges[article.slug] ?? [] : [];

  useEffect(() => {
    const rail = pathScrollRef.current;
    const activeStep = activeStepRef.current;
    if (!rail || !activeStep) return;
    const left = activeStep.offsetLeft - (rail.clientWidth - activeStep.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
  }, [pathIndex]);

  return (
    <div className="flex min-w-0">
      <div
        className="pointer-events-none fixed left-0 right-0 top-14 z-40 h-0.5 bg-transparent lg:left-64"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-foreground transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <article
        ref={articleRef}
        data-article-subcategory={article?.subcategory}
        data-article-slug={article?.slug}
        data-active-route-owner={researchTrackContext ? 'research-track' : learningPath ? 'learning-path' : 'subcategory'}
        data-article-viz-system={usesTechnicalVisualSystem ? 'technical' : undefined}
        className={`min-w-0 flex-1 ${usesTechnicalVisualSystem ? 'article-viz-document' : ''} ${usesDeepArticleSystem ? 'foundation-article' : ''}`}
      >
        <header className={`${pathIndex === 0 ? 'mb-6 pb-5 lg:mb-9 lg:pb-7' : 'mb-9 pb-7'} border-b border-border/70`}>
          {article && category && (
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-label="현재 위치">
              <Link to={categoryPath(category.slug)} className="transition-colors hover:text-foreground">
                {category.name}
              </Link>
              <ChevronRight aria-hidden className="h-3 w-3" />
              {articleStage && (
                <>
                  <span className="font-mono font-semibold tabular-nums">{articleStage.order}</span>
                  <span className="font-semibold text-foreground/75">{articleStage.label}</span>
                  <ChevronRight aria-hidden className="h-3 w-3" />
                </>
              )}
              {subcategoryTrail?.length ? subcategoryTrail.map((subcategory, index) => (
                <span key={subcategory.slug} className="contents">
                  <Link
                    to={subcategoryPath(category.slug, subcategory.slug)}
                    className="transition-colors hover:text-foreground"
                  >
                    {subcategory.name}
                  </Link>
                  {index < subcategoryTrail.length - 1 && <ChevronRight aria-hidden className="h-3 w-3" />}
                </span>
              )) : navigation?.subcategory ? (
                <Link
                  to={subcategoryPath(category.slug, navigation.subcategory.slug)}
                  className="transition-colors hover:text-foreground"
                >
                  {navigation.subcategory.name}
                </Link>
              ) : <span>Article</span>}
            </nav>
          )}

          {researchTrackContext && (
            <nav
              className="mb-5 border-y border-border/70 py-3"
              aria-label="원래 연구 경로"
              data-research-track-context={researchTrackContext.id}
            >
              <Link
                to={subcategoryPath(researchTrackContext.category, researchTrackContext.subcategories[0])}
                className="group flex min-w-0 items-center gap-3 text-xs"
              >
                <ArrowLeft aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                <span className="min-w-0">
                  <span className="block font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">RESEARCH ROUTE</span>
                  <strong className="mt-0.5 block break-words">{researchTrackContext.title}</strong>
                </span>
                <span className="ml-auto hidden shrink-0 text-xs font-medium text-muted-foreground sm:block">목표·최소 기준점으로 돌아가기</span>
              </Link>
            </nav>
          )}

          {learningPath && pathIndex >= 0 && (
            <div ref={pathScrollRef} className="mb-5 pb-1" aria-label={`${learningPath.title} 학습 경로`}>
              <div className="flex min-h-11 items-center gap-2 border-y border-border/70 py-2 sm:hidden">
                <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                  {pathIndex + 1} / {learningPath.steps.length}
                </span>
                <strong className="min-w-0 flex-1 truncate text-sm">{learningPath.steps[pathIndex]?.label}</strong>
                {next && (
                  <Link
                    to={learningPathHref(next)}
                    state={learningPathLinkState}
                    data-learning-path-id={learningPath.pathId}
                    className="inline-flex min-h-11 shrink-0 items-center gap-1.5 px-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    다음
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
              <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
                {learningPath.steps.map((step, index) => {
                  const active = index === pathIndex;
                  return (
                    <Link
                      key={`${step.category}/${step.slug}`}
                      ref={active ? activeStepRef : undefined}
                      to={learningPathHref(step)}
                      state={learningPathLinkState}
                      data-learning-path-id={learningPath?.pathId}
                      aria-current={active ? 'step' : undefined}
                      title={step.question}
                      className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'border-foreground bg-foreground text-background'
                          : index < pathIndex
                            ? 'border-border bg-muted/60 text-foreground hover:bg-accent'
                            : 'border-border/70 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                      }`}
                    >
                      {index + 1}. {step.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {!researchTrackContext && navigation?.kind === 'subcategory' && navigation.subcategory && pathIndex >= 0 && (
            <nav
              className="mb-5 border-y border-border/70 py-3"
              aria-label={`${navigation.title} 현재 위치`}
              data-article-route-context="subcategory"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-xs font-bold text-muted-foreground">주제 흐름</span>
                <strong className="text-xs">{navigation.title}</strong>
                <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                  {String(pathIndex + 1).padStart(2, '0')} / {String(navigation.steps.length).padStart(2, '0')}
                </span>
                <Link
                  to={subcategoryPath(category!.slug, navigation.subcategory.slug)}
                  className="ml-auto text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                >
                  전체 흐름
                </Link>
              </div>
              {(previous || next) && (
                <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                  {previous ? (
                    <Link
                      to={learningPathHref(previous)}
                      state={learningPathLinkState}
                      data-learning-path-id={learningPath?.pathId}
                      className="group flex min-w-0 items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft aria-hidden className="h-3 w-3 shrink-0 transition-transform group-hover:-translate-x-0.5" />
                      <span className="truncate">{previous.label}</span>
                    </Link>
                  ) : <span />}
                  {next && (
                    <Link
                      to={learningPathHref(next)}
                      state={learningPathLinkState}
                      data-learning-path-id={learningPath?.pathId}
                      className="group flex min-w-0 items-center justify-end gap-2 text-right text-muted-foreground hover:text-foreground"
                    >
                      <span className="truncate">{next.label}</span>
                      <ArrowRight aria-hidden className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              )}
            </nav>
          )}

          {usesDeepArticleSystem && (
            <div className="foundation-article-coordinate" aria-label={`${coordinateLabel} 학습 좌표`}>
              <span className="foundation-article-coordinate__number">{coordinateNumber}</span>
              <span className="foundation-article-coordinate__copy">
                <strong>{coordinateLabel}</strong>
                <span>{coordinateDetail}</span>
              </span>
            </div>
          )}

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h1>
          {article?.summary && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {article.summary}
            </p>
          )}

          {(article?.level || article?.estimatedMinutes || article?.prerequisites?.length) && (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/60 pt-5 lg:grid-cols-[auto_auto_1fr] lg:items-start lg:gap-4">
              {article.level && (
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-muted-foreground">난이도</span>
                  <strong className="font-semibold">{article.level}</strong>
                </div>
              )}
              {article.estimatedMinutes && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-muted-foreground">약 {article.estimatedMinutes}분</span>
                </div>
              )}
              {article.prerequisites && article.prerequisites.length > 0 && pathIndex !== 0 && (
                <div className="col-span-2 hidden min-w-0 text-sm lg:col-auto lg:block lg:border-l lg:border-border/70 lg:pl-3">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    먼저 알면 좋은 것
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    {article.prerequisites.map((item) => <li key={item}>· {item}</li>)}
                  </ul>
                </div>
              )}
              {article.prerequisites && article.prerequisites.length > 0 && (
                <details className={`col-span-2 border-y border-border/60 ${pathIndex === 0 ? '' : 'lg:hidden'}`}>
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 py-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    먼저 알면 좋은 것
                    <span className="ml-auto text-xs font-normal text-muted-foreground">{article.prerequisites.length}개</span>
                  </summary>
                  <ul className="border-t border-border/60 py-3 text-sm leading-6 text-muted-foreground">
                    {article.prerequisites.map((item) => <li key={item}>· {item}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}

          {!researchTrackContext && navigation && pathIndex === 0 && (
            <div
              className="mt-5 hidden min-w-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground lg:flex"
              aria-label="이 글의 학습 연결"
              data-learning-continuity
              data-learning-continuity-entry
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  이 경로는 여기서 시작합니다.{' '}
                  {article?.prerequisites?.length
                    ? '위에 적힌 선행 개념만 확인한 뒤 본문의 첫 장면부터 읽습니다.'
                    : '별도의 선행 글 없이 본문의 첫 장면부터 읽습니다.'}
                </span>
              </span>
              {next && (
                <Link
                  to={learningPathHref(next)}
                  state={learningPathLinkState}
                  data-learning-path-id={learningPath?.pathId}
                  className="hidden items-center gap-1.5 font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground sm:ml-auto sm:inline-flex"
                >
                  다음: {next.label}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </Link>
              )}
            </div>
          )}

          {!researchTrackContext && navigation && pathIndex > 0 && (
            <section className="mt-5 border-y border-border/70 py-3 lg:mt-6 lg:py-4" aria-label="이 글의 학습 연결" data-learning-continuity>
              <div className="flex min-w-0 items-center gap-3 text-xs lg:hidden">
                {previous ? (
                  <Link
                    to={learningPathHref(previous)}
                    state={learningPathLinkState}
                    data-learning-path-id={learningPath?.pathId}
                    className="group flex min-w-0 flex-1 items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft aria-hidden className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
                    <span className="truncate">{previous.label}</span>
                  </Link>
                ) : <span className="min-w-0 flex-1" />}
                <span className="shrink-0 font-mono font-semibold tabular-nums text-muted-foreground">
                  {pathIndex + 1} / {navigation.steps.length}
                </span>
                {next ? (
                  <Link
                    to={learningPathHref(next)}
                    state={learningPathLinkState}
                    data-learning-path-id={learningPath?.pathId}
                    className="group flex min-w-0 flex-1 items-center justify-end gap-1.5 text-right text-muted-foreground hover:text-foreground"
                  >
                    <span className="truncate">{next.label}</span>
                    <ArrowRight aria-hidden className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : <span className="min-w-0 flex-1" />}
              </div>
              <div className="hidden gap-4 lg:grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.36fr)_minmax(0,0.82fr)] lg:items-stretch">
                <div className="min-w-0 lg:border-r lg:border-border/70 lg:pr-4">
                  <span className="text-xs font-semibold text-muted-foreground">앞 글에서 이어지는 것</span>
                  {previous ? (
                    <Link to={learningPathHref(previous)} state={learningPathLinkState} data-learning-path-id={learningPath?.pathId} className="group mt-1 block">
                      <strong className="block text-sm leading-6 group-hover:underline">{previous.label}</strong>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{previous.question}</span>
                    </Link>
                  ) : null}
                </div>
                <div className="min-w-0 lg:px-2">
                  <span className="text-xs font-semibold text-primary">이 글에서 알게 될 것</span>
                  <p className="mt-1 text-sm font-semibold leading-6">{navigation.steps[pathIndex]?.question}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{navigation.description}</p>
                </div>
                <div className="min-w-0 lg:border-l lg:border-border/70 lg:pl-4">
                  <span className="text-xs font-semibold text-muted-foreground">다음에 이어질 내용</span>
                  {next ? (
                    <Link to={learningPathHref(next)} state={learningPathLinkState} data-learning-path-id={learningPath?.pathId} className="group mt-1 block">
                      <strong className="block text-sm leading-6 group-hover:underline">{next.label}</strong>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{next.question}</span>
                    </Link>
                  ) : (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">이 경로에서 정한 질문은 여기까지다. 새 연구가 이 판단을 바꿀 때 다음 글을 덧붙인다.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {mathBridges.length > 0 && (
            <details className={`mt-5 border-y border-border/70 ${pathIndex === 0 ? '' : 'lg:hidden'}`}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <span className="text-cyan-700 dark:text-cyan-300">수학 보강</span>
                <span className="ml-auto text-xs font-normal text-muted-foreground">필요할 때 · {mathBridges.length}개</span>
              </summary>
              <div className="divide-y divide-border/60 border-t border-border/60">
                {mathBridges.map((bridge) => (
                  <Link key={bridge.slug} to={articlePath('ai', bridge.slug)} className="group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 text-xs text-muted-foreground hover:text-foreground">
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground underline decoration-border underline-offset-4 group-hover:decoration-foreground">{bridge.label}</span>
                      <span className="mt-1 block leading-relaxed">{bridge.reason}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </details>
          )}

          {mathBridges.length > 0 && pathIndex !== 0 && (
            <nav className="mt-5 hidden border-y border-border/70 py-3 lg:block" aria-label="이 글에 연결된 수학 보강">
              <strong className="block text-xs text-cyan-700 dark:text-cyan-300">{isFoundationPaper ? 'PREREQUISITE LADDER · 필요한 만큼만 내려간다' : 'JUST-IN-TIME MATH'}</strong>
              {isFoundationPaper && <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">이 원문을 먼저 훑다가 막힌 개념만 아래에서 보강한다. 아래 글을 전부 읽거나 더 오래된 논문으로 내려갈 필요는 없다.</p>}
              <div className="mt-2 grid gap-x-6 gap-y-3 text-xs sm:grid-cols-2">
                {mathBridges.map((bridge) => (
                  <Link key={bridge.slug} to={articlePath('ai', bridge.slug)} className="group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-muted-foreground hover:text-foreground">
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground underline decoration-border underline-offset-4 group-hover:decoration-foreground">{bridge.label}</span>
                      <span className="mt-1 block leading-relaxed">{bridge.reason}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </header>

        {sections.length > 0 && (
          <details className="mb-8 rounded-md border border-border/70 bg-muted/15 xl:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <ListTree className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              이 글의 목차
              <span className="ml-auto text-xs font-normal text-muted-foreground">{sections.length}개 섹션</span>
            </summary>
            <div className="border-t border-border/60 px-3 pt-3">
              <TableOfContents sections={sections} />
            </div>
          </details>
        )}

        <MathAnnotationProvider enabled={usesMathAnnotations}>
          <div className="article-body">{children}</div>
        </MathAnnotationProvider>

        {!researchTrackContext && navigation && (previous || next) && (
          <nav className="mt-16 grid gap-3 border-t border-border pt-6 sm:grid-cols-2" aria-label={navigation.kind === 'declared' ? '학습 경로 이동' : '주제 안에서 이어 읽기'}>
            {previous ? (
              <Link
                to={learningPathHref(previous)}
                state={learningPathLinkState}
                data-learning-path-id={learningPath?.pathId}
                className="group flex min-w-0 items-center gap-3 rounded-md border border-border/70 px-4 py-3 transition-colors hover:bg-accent/40"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                <span className="block min-w-0 flex-1">
                  <span className="block text-xs text-muted-foreground">이전</span>
                  <span className="block break-words text-sm font-semibold leading-snug">{previous.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{previous.question}</span>
                </span>
              </Link>
            ) : <span />}
            {next && (
              <Link
                to={learningPathHref(next)}
                state={learningPathLinkState}
                data-learning-path-id={learningPath?.pathId}
                className="group flex min-w-0 items-center justify-end gap-3 rounded-md border border-border/70 px-4 py-3 text-right transition-colors hover:bg-accent/40"
              >
                <span className="block min-w-0 flex-1">
                  <span className="block text-xs text-muted-foreground">다음</span>
                  <span className="block break-words text-sm font-semibold leading-snug">{next.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{next.question}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </nav>
        )}
      </article>

      <ArticleVizTools articleRef={articleRef} />

      <aside className="ml-10 hidden w-64 shrink-0 xl:block">
        <div className="sticky top-20">
          {sections.length > 0 && <TableOfContents sections={sections} />}
        </div>
      </aside>
    </div>
  );
}
