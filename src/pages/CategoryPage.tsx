import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, ChevronDown, Compass, GitBranch, Library, ListOrdered, Network, Target, Wrench } from 'lucide-react';
import { getCategoryBySlug, type Subcategory } from '@/content';
import { getSidebarLearningStages, type SidebarLearningStage } from '@/content/sidebar-learning-structure';
import { isSourceArticle } from '@/content/article-navigation';
import SubcategoryCard, { findSubcategory } from './category/SubcategoryCard';
import ArticleCard from './category/ArticleCard';
import FoundationLearningPath from './category/FoundationLearningPath';
import MathFoundationLearningPath from './category/MathFoundationLearningPath';
import TopDownResearchRoute from './category/TopDownResearchRoute';
import { getTopDownResearchTrack } from '@/content/ai/topdownResearchTracks';
import { getLearningPath } from '@/content/learning-paths';
import { BLOG_ROOT, articlePath, categoryPath, subcategoryPath } from '@/lib/paths';

const stageRoleMeta = {
  orient: { label: 'METHOD', Icon: Compass, tone: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  map: { label: 'ORIENT', Icon: Compass, tone: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  target: { label: 'START', Icon: Target, tone: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  foundation: { label: 'REFERENCE', Icon: BookOpenCheck, tone: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  build: { label: 'APPLY', Icon: Wrench, tone: 'text-rose-700 dark:text-rose-400', dot: 'bg-rose-500' },
} as const;

function containsSubcategory(subcategory: Subcategory, slug: string): boolean {
  return subcategory.slug === slug || Boolean(subcategory.children?.some((child) => containsSubcategory(child, slug)));
}

function articleLearningPathIds(article: { learningPath?: string; learningPaths?: string[] }): string[] {
  return [...new Set([article.learningPath, ...(article.learningPaths ?? [])].filter((id): id is string => Boolean(id)))];
}

function findSubcategoryTrail(
  subcategories: Subcategory[],
  slug: string,
  trail: Subcategory[] = [],
): Subcategory[] | null {
  for (const subcategory of subcategories) {
    const nextTrail = [...trail, subcategory];
    if (subcategory.slug === slug) return nextTrail;
    const nested = findSubcategoryTrail(subcategory.children ?? [], slug, nextTrail);
    if (nested) return nested;
  }
  return null;
}

function StageNodeList({ cat, stage }: { cat: NonNullable<ReturnType<typeof getCategoryBySlug>>; stage: SidebarLearningStage }) {
  if (stage.clusters.length === 0) {
    return (
      <div className="grid gap-x-8 sm:grid-cols-2">
        {stage.subcategories.map((sub, index) => (
          <SubcategoryCard key={sub.slug} cat={cat} sub={sub} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {stage.clusters.map((cluster, clusterIndex) => {
        const startIndex = stage.clusters
          .slice(0, clusterIndex)
          .reduce((total, previousCluster) => total + previousCluster.subcategories.length, 0);
        return (
          <section key={cluster.id} data-learning-cluster={cluster.id} aria-labelledby={`cluster-${cluster.id}`}>
            <div className="mb-2 grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
              <h3 id={`cluster-${cluster.id}`} className="text-xs font-bold">{cluster.label}</h3>
              {cluster.description && <p className="text-xs leading-relaxed text-muted-foreground">{cluster.description}</p>}
            </div>
            <div className="grid gap-x-8 sm:grid-cols-2">
              {cluster.subcategories.map((sub, index) => (
                <SubcategoryCard key={sub.slug} cat={cat} sub={sub} index={startIndex + index} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ArticleSequenceIntro({
  coreArticles,
  sourceCount,
  sequenceCount = 1,
}: {
  coreArticles: NonNullable<ReturnType<typeof getCategoryBySlug>>['articles'];
  sourceCount: number;
  sequenceCount?: number;
}) {
  if (coreArticles.length === 0) return null;
  const first = coreArticles[0];
  const last = coreArticles[coreArticles.length - 1];

  return (
    <section className="mb-6 border-y border-border py-5" data-article-sequence>
      <div className="grid gap-4 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-start">
        <div>
          <span className="block font-mono text-3xl font-bold tabular-nums leading-none">
            {String(coreArticles.length).padStart(2, '0')}
          </span>
          <span className="mt-1 block text-xs font-semibold text-muted-foreground">핵심 글</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            {sequenceCount > 1 ? <GitBranch aria-hidden className="h-3.5 w-3.5" /> : <ListOrdered aria-hidden className="h-3.5 w-3.5" />}
            {sequenceCount > 1 ? '목표별 경로' : '이 주제의 흐름'}
          </div>
          {sequenceCount > 1 ? (
            <div className="mt-2 text-sm font-semibold">
              {sequenceCount}개의 독립 경로
              <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">아래에서 지금 해결할 목표 하나를 선택해 그 안의 순서만 따라갑니다.</span>
            </div>
          ) : (
            <div className="mt-2 flex min-w-0 flex-col gap-1 text-sm font-semibold sm:flex-row sm:items-center sm:gap-2">
              <span className="min-w-0 line-clamp-1">{first.title}</span>
              {coreArticles.length > 1 && (
                <>
                  <ArrowRight aria-hidden className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:block" />
                  <span className="min-w-0 line-clamp-1 text-muted-foreground">{last.title}</span>
                </>
              )}
            </div>
          )}
        </div>
        {sourceCount > 0 && (
          <div className="text-left sm:text-right">
            <span className="block font-mono text-lg font-bold tabular-nums">{sourceCount}</span>
            <span className="block text-xs font-medium text-muted-foreground">선택 원문·근거</span>
          </div>
        )}
      </div>
    </section>
  );
}

function AuthoredArticleSequences({
  coreArticles,
  allArticles,
  categorySlug,
  sourceCount,
  expandFullPaths = false,
}: {
  coreArticles: NonNullable<ReturnType<typeof getCategoryBySlug>>['articles'];
  allArticles: NonNullable<ReturnType<typeof getCategoryBySlug>>['articles'];
  categorySlug: string;
  sourceCount: number;
  expandFullPaths?: boolean;
}) {
  const grouped = new Map<string, typeof coreArticles>();
  const assigned = new Set<string>();

  for (const article of coreArticles) {
    for (const pathId of articleLearningPathIds(article)) {
      const path = getLearningPath(pathId);
      const belongsToPath = path?.steps.some(
        (step) => step.category === categorySlug && step.slug === article.slug,
      );
      if (!path || !belongsToPath) continue;
      const articles = grouped.get(path.id) ?? [];
      articles.push(article);
      grouped.set(path.id, articles);
      assigned.add(article.slug);
    }
  }

  if (grouped.size === 0) {
    return (
      <>
        <ArticleSequenceIntro coreArticles={coreArticles} sourceCount={sourceCount} />
        <div className="space-y-2">
          {coreArticles.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              categorySlug={categorySlug}
              index={index}
              position={index + 1}
              total={coreArticles.length}
            />
          ))}
        </div>
      </>
    );
  }

  const orderedGroups = [...grouped.entries()].sort(([leftId], [rightId]) => (
    (getLearningPath(leftId)?.displayOrder ?? Number.MAX_SAFE_INTEGER)
    - (getLearningPath(rightId)?.displayOrder ?? Number.MAX_SAFE_INTEGER)
  ));
  const claimedExpandedArticles = new Set<string>();
  const sequences = orderedGroups.map(([pathId, articles]) => {
    const path = getLearningPath(pathId)!;
    const stepOrder = new Map(path.steps.map((step, index) => [`${step.category}:${step.slug}`, index]));
    const sequenceArticles = expandFullPaths
      ? path.steps.flatMap((step) => {
        if (step.category !== categorySlug) return [];
        const article = allArticles.find((candidate) => candidate.slug === step.slug);
        // A source explicitly named by an authored path is the bounded
        // canonical checkpoint, not an optional historical paper.
        if (!article) return [];
        const explicitlyShared = articleLearningPathIds(article).includes(path.id);
        if (claimedExpandedArticles.has(article.slug) && !explicitlyShared) return [];
        claimedExpandedArticles.add(article.slug);
        return [article];
      })
      : articles;
    return {
      path,
      articles: [...sequenceArticles].sort((a, b) => (
        (stepOrder.get(`${categorySlug}:${a.slug}`) ?? Number.MAX_SAFE_INTEGER)
        - (stepOrder.get(`${categorySlug}:${b.slug}`) ?? Number.MAX_SAFE_INTEGER)
      )),
    };
  });
  const unassigned = coreArticles.filter((article) => !assigned.has(article.slug));

  return (
    <div className="space-y-10" data-authored-article-sequences>
      <ArticleSequenceIntro coreArticles={coreArticles} sourceCount={sourceCount} sequenceCount={sequences.length} />
      {sequences.map(({ path, articles }, sequenceIndex) => (
        <section key={path.id} data-authored-learning-path={path.id} aria-labelledby={`learning-path-${path.id}`}>
          <header className="mb-3 grid gap-2 border-b border-border pb-4 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4">
            <span className="font-mono text-2xl font-bold tabular-nums">{String(sequenceIndex + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <h2 id={`learning-path-${path.id}`} className="text-base font-bold">{path.title}</h2>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">{path.description}</p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{articles.length}개 핵심 글</span>
          </header>
          <nav aria-label={`${path.title} 학습 경로`} className="space-y-2">
            {articles.map((article, index) => {
              const pathStepIndex = path.steps.findIndex(
                (step) => step.category === categorySlug && step.slug === article.slug,
              );
              const pathStep = path.steps[pathStepIndex];
              return (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  categorySlug={categorySlug}
                  index={index}
                  position={index + 1}
                  total={articles.length}
                  learningStepLabel={pathStep ? `${pathStepIndex + 1}. ${pathStep.label}` : undefined}
                  learningPathId={path.id}
                />
              );
            })}
          </nav>
        </section>
      ))}
      {unassigned.length > 0 && (
        <section data-unassigned-articles aria-labelledby="additional-articles">
          <header className="mb-3 border-b border-border pb-4">
            <p className="font-mono text-xs font-bold text-muted-foreground">OPTIONAL</p>
            <h2 id="additional-articles" className="mt-1 text-base font-bold">추가 참고</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">필수 경로에 속하지 않는 사례·확장 글이다. 필요한 문제가 있을 때만 연다.</p>
          </header>
          <div className="space-y-2">
            {unassigned.map((article, index) => (
              <ArticleCard
                key={article.slug}
                article={article}
                categorySlug={categorySlug}
                index={index}
                position={index + 1}
                total={unassigned.length}
                sequenceLabel="참고"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function LearningPathDirectory({
  coreArticles,
  allArticles,
  categorySlug,
}: {
  coreArticles: NonNullable<ReturnType<typeof getCategoryBySlug>>['articles'];
  allArticles: NonNullable<ReturnType<typeof getCategoryBySlug>>['articles'];
  categorySlug: string;
}) {
  const grouped = new Map<string, typeof coreArticles>();

  for (const article of coreArticles) {
    for (const pathId of articleLearningPathIds(article)) {
      const path = getLearningPath(pathId);
      if (!path) continue;
      const belongsToPath = path.steps.some(
        (step) => step.category === categorySlug && step.slug === article.slug,
      );
      if (!belongsToPath) continue;
      const articles = grouped.get(path.id) ?? [];
      articles.push(article);
      grouped.set(path.id, articles);
    }
  }

  const paths = [...grouped.entries()].map(([pathId]) => {
    const path = getLearningPath(pathId)!;
    const sortedArticles = path.steps.flatMap((step) => {
      if (step.category !== categorySlug) return [];
      const article = allArticles.find((candidate) => candidate.slug === step.slug);
      return article ? [article] : [];
    });
    return { path, articles: sortedArticles, firstArticle: sortedArticles[0] };
  }).filter((item) => item.firstArticle).sort((a, b) => (
    (a.path.displayOrder ?? Number.MAX_SAFE_INTEGER)
    - (b.path.displayOrder ?? Number.MAX_SAFE_INTEGER)
  ));

  if (paths.length === 0) return null;

  return (
    <section
      className="mb-10"
      data-learning-path-directory
      data-presentation-role="navigation-handoff"
      aria-labelledby="learning-path-directory-title"
    >
      <header className="grid gap-2 border-y border-border py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
        <div>
          <p className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">NEXT · CHOOSE ONE</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">{paths.length}개 세부 경로</p>
        </div>
        <div>
          <h2 id="learning-path-directory-title" className="text-lg font-bold">이후에는 세부 경로 하나만 고릅니다</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            위 연구 경로에서 공통 목표와 최소 기준을 잡았습니다. 아래에서는 같은 글을 다시 펼치지 않고 각 경로의 시작점만 보여 줍니다.
          </p>
        </div>
      </header>
      <nav aria-label="세부 학습 경로" className="divide-y divide-border/70 border-b border-border">
        {paths.map(({ path, articles, firstArticle }, index) => (
          <Link
            key={path.id}
            to={`${articlePath(categorySlug, firstArticle.slug)}?path=${encodeURIComponent(path.id)}`}
            state={{ learningPathId: path.id }}
            className="group grid min-w-0 gap-2 py-4 pr-8 transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[3rem_minmax(0,1fr)_7rem] sm:items-start sm:px-3"
          >
            <span className="font-mono text-lg font-bold tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0">
              <strong className="block text-sm">{path.title}</strong>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{path.description}</span>
              <span className="mt-2 block text-xs font-medium text-foreground">시작 · {firstArticle.title}</span>
            </span>
            <span className="flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground sm:justify-end">
              {articles.length}개 단계
              <ArrowRight aria-hidden className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}

function SourceArticleDisclosure({
  sourceArticles,
  categorySlug,
}: {
  sourceArticles: NonNullable<ReturnType<typeof getCategoryBySlug>>['articles'];
  categorySlug: string;
}) {
  if (sourceArticles.length === 0) return null;

  return (
    <details className="group rounded-md border border-border/70 bg-muted/[0.08]" data-source-article-disclosure>
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        선택 원문 근거 {sourceArticles.length}편 펼치기
        <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">최소 기준 아래는 기본 숨김</span>
        <span className="ml-auto hidden text-xs font-normal text-muted-foreground group-open:inline">접기</span>
      </summary>
      <div className="space-y-2 border-t border-border/70 p-3">
        {sourceArticles.map((article, index) => (
          <ArticleCard
            key={article.slug}
            article={article}
            categorySlug={categorySlug}
            index={index}
            position={index + 1}
            total={sourceArticles.length}
            sequenceLabel="근거"
          />
        ))}
      </div>
    </details>
  );
}

type ChildNavigation = NonNullable<Subcategory['childNavigation']>;

function getChildNavigation(subcategory: Subcategory): ChildNavigation {
  return subcategory.childNavigation ?? {
    mode: 'choice',
    placement: 'before-track',
    title: '이제 세부 경로 하나를 선택합니다',
    description: '각 행은 독립된 목표입니다. 하나를 선택한 뒤 그 안의 핵심 글 순서만 따라갑니다.',
  };
}

function ChildNavigationSection({
  category,
  subcategory,
}: {
  category: NonNullable<ReturnType<typeof getCategoryBySlug>>;
  subcategory: Subcategory;
}) {
  const children = subcategory.children ?? [];
  if (children.length === 0) return null;

  const navigation = getChildNavigation(subcategory);
  const childBySlug = new Map(children.map((child) => [child.slug, child]));
  const groups = navigation.groups ?? [{
    id: 'all',
    label: '',
    description: '',
    slugs: children.map((child) => child.slug),
  }];
  const Icon = navigation.mode === 'choice'
    ? GitBranch
    : navigation.mode === 'sequence'
      ? ListOrdered
      : Library;
  const countLabel = navigation.mode === 'choice'
    ? `${children.length}개 분기`
    : navigation.mode === 'sequence'
      ? `${children.length}개 단계`
      : `${children.length}개 항목`;

  const renderItems = (slugs: string[], role?: string) => (
    <div className="grid gap-x-8 sm:grid-cols-2">
      {slugs.flatMap((slug, itemIndex) => {
        const child = childBySlug.get(slug);
        if (!child) return [];
        const numberedName = child.name.match(/^(\d{2})\s*·\s*(.+)$/);
        const sequenceEyebrow = navigation.mode === 'sequence'
          ? `실행 단계 ${numberedName?.[1] ?? String(itemIndex + 1).padStart(2, '0')}`
          : undefined;
        return [
          <div
            key={child.slug}
            data-child-navigation-item={child.slug}
            data-child-navigation-role={role ?? navigation.mode}
          >
            <SubcategoryCard
              cat={category}
              sub={child}
              displayName={sequenceEyebrow && numberedName ? numberedName[2] : undefined}
              eyebrow={sequenceEyebrow}
            />
          </div>,
        ];
      })}
    </div>
  );

  return (
    <section
      className="mb-10"
      data-subcategory-branches
      data-child-navigation-mode={navigation.mode}
      data-child-navigation-placement={navigation.placement ?? 'before-track'}
      {...(subcategory.slug === 'ai-agents' ? { 'data-branching-learning-hub': true } : {})}
    >
      <div className="mb-2 grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-b border-border pb-4">
        <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
          {countLabel}
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Icon aria-hidden className="h-4 w-4 text-muted-foreground" />
            {navigation.title}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {navigation.description}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {groups.map((group) => {
          const role = group.role ?? navigation.mode;
          if (group.collapsed) {
            return (
              <details
                key={group.id}
                data-child-navigation-group={group.id}
                data-child-group-role={role}
                className="group border-b border-border/70 first:border-t"
              >
                <summary className="grid min-h-12 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">
                    <strong className="block text-sm">{group.label}</strong>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{group.description}</span>
                  </span>
                  <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    {group.slugs.length}개
                    <ChevronDown aria-hidden className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <div className="border-t border-border/70 pb-2 pt-1">
                  {renderItems(group.slugs, role)}
                </div>
              </details>
            );
          }

          return (
            <section
              key={group.id}
              data-child-navigation-group={group.id}
              data-child-group-role={role}
              className={role === 'optional' ? 'border border-dashed border-border px-3 py-3' : ''}
            >
              {group.label && (
                <header className="mb-1 grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
                  <h3 className="text-xs font-bold">{group.label}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{group.description}</p>
                </header>
              )}
              {renderItems(group.slugs, role)}
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const subSlug = searchParams.get('sub');
  const cat = getCategoryBySlug(category ?? '');
  if (!cat) return <p className="text-muted-foreground">카테고리를 찾을 수 없습니다.</p>;

  const activeSub = subSlug ? findSubcategory(cat.subcategories, subSlug) : null;
  const learningStages = getSidebarLearningStages(cat);
  const curriculumStages = learningStages.filter((stage) => stage.role !== 'orient');
  const readingToolStages = learningStages.filter((stage) => stage.role === 'orient');
  const targetCount = curriculumStages.find((stage) => stage.role === 'target')?.subcategories.length ?? 0;

  if (!activeSub) {
    return (
      <div className="max-w-5xl">
        <motion.div className="mb-10 border-b border-border pb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Compass aria-hidden className="h-3.5 w-3.5" />
            TOP-DOWN CURRICULUM
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{cat.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
            </div>
            <dl className="flex gap-6 text-left sm:text-right">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">단계</dt>
                <dd className="font-mono text-lg font-bold tabular-nums">{curriculumStages.length}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">목표 분야</dt>
                <dd className="font-mono text-lg font-bold tabular-nums">{targetCount}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">글</dt>
                <dd className="font-mono text-lg font-bold tabular-nums">{cat.articles.length}</dd>
              </div>
            </dl>
          </div>
        </motion.div>
        {cat.slug === 'ai' && (
          <Link
            to={`${BLOG_ROOT}/map`}
            className="group mb-8 flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 transition-colors hover:border-foreground/30 hover:bg-muted/40"
          >
            <Network aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1">
              <strong className="block text-sm">최신 목표별 학습 경로</strong>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">지금 이해할 기술을 먼저 고르고, 최소 기준 원문·핵심 개념·필요한 기반·구현까지 한 화면에서 확인한다.</span>
            </span>
            <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
        <div data-curriculum-roadmap>
          {curriculumStages.map((stage, stageIndex) => (
            <motion.section
              key={stage.id}
              data-category-stage={stage.id}
              data-stage-role={stage.role}
              aria-labelledby={`stage-${stage.id}`}
              className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIndex * 0.05 }}
            >
              <div className="relative flex flex-col items-center">
                <span className="font-mono text-2xl font-bold tabular-nums sm:text-3xl">{stage.order}</span>
                <span aria-hidden className={`mt-2 h-2 w-2 rounded-full ${stageRoleMeta[stage.role].dot}`} />
                {stageIndex < curriculumStages.length - 1 && <span aria-hidden className="my-2 w-px flex-1 bg-border" />}
              </div>
              <div className="min-w-0 pb-12 sm:pb-14">
                <div className="mb-5 border-b border-border pb-4">
                  <div className={`flex items-center gap-2 text-xs font-bold ${stageRoleMeta[stage.role].tone}`}>
                    {(() => {
                      const Icon = stageRoleMeta[stage.role].Icon;
                      return <Icon aria-hidden className="h-3.5 w-3.5" />;
                    })()}
                    {stageRoleMeta[stage.role].label}
                  </div>
                  <h2 id={`stage-${stage.id}`} className="mt-1 text-lg font-bold">{stage.label}</h2>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
                </div>
                <StageNodeList cat={cat} stage={stage} />
              </div>
            </motion.section>
          ))}
        </div>
        {readingToolStages.length > 0 && (
          <section className="mb-10 border-y border-border py-6" data-category-reading-tools aria-labelledby="reading-tools-title">
            <div className="grid gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
              <div>
                <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">OPTIONAL GUIDE</p>
                <h2 id="reading-tools-title" className="mt-2 text-lg font-bold">읽다가 막힐 때만</h2>
              </div>
              <div className="min-w-0">
                <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  목표를 고르는 선행 단계가 아닙니다. 처음 보는 시스템에서 실패 위치나 다음 공부를 좁히기 어려울 때만 이 도구를 엽니다.
                </p>
                {readingToolStages.map((stage) => <StageNodeList key={stage.id} cat={cat} stage={stage} />)}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  const visibleSubcategories = new Set<string>([activeSub.slug]);
  if (activeSub.aggregateChildArticles) {
    const collectDescendants = (subcategory: Subcategory) => {
      for (const child of subcategory.children ?? []) {
        visibleSubcategories.add(child.slug);
        collectDescendants(child);
      }
    };
    collectDescendants(activeSub);
  }
  // 부모에서 자식 글을 합칠지는 콘텐츠 설계자가 명시한다. 모든 부모를 자동 평탄화하면 독립 경로가 다시 섞인다.
  const filtered = cat.articles.filter((article) => visibleSubcategories.has(article.subcategory));
  const coreArticles = filtered.filter((article) => !isSourceArticle(article));
  const sourceArticles = filtered.filter(isSourceArticle);
  const researchTrack = getTopDownResearchTrack(activeSub.slug);
  const activeStage = learningStages.find((stage) => stage.subcategories.some((sub) => containsSubcategory(sub, activeSub.slug)));
  const subcategoryTrail = findSubcategoryTrail(cat.subcategories, activeSub.slug) ?? [activeSub];
  const parentSubcategory = subcategoryTrail.at(-2) ?? null;
  const isResearchTrackEntry = Boolean(researchTrack && researchTrack.subcategories[0] === activeSub.slug);
  const researchTrackOrigin = researchTrack && !isResearchTrackEntry
    ? findSubcategory(cat.subcategories, researchTrack.subcategories[0])
    : null;
  const isResearchTrackOverview = Boolean(researchTrack && activeSub.slug.endsWith('-overview'));
  const expandsAuthoredFullPaths = Boolean(
    !isResearchTrackEntry
    && (
      isResearchTrackOverview
      || activeSub.slug === 'ai-practical-pipeline'
      || activeSub.slug.startsWith('ai-open-models-')
      || activeSub.slug.startsWith('ai-llm-post-training-')
    )
  );
  const authoredSequenceSourceSlugs = new Set<string>();
  if (expandsAuthoredFullPaths) {
    const authoredPathIds = new Set<string>();
    for (const article of coreArticles) {
      for (const pathId of articleLearningPathIds(article)) {
        const path = getLearningPath(pathId);
        const belongsToPath = path?.steps.some(
          (step) => step.category === cat.slug && step.slug === article.slug,
        );
        if (path && belongsToPath) authoredPathIds.add(path.id);
      }
    }
    for (const pathId of authoredPathIds) {
      const path = getLearningPath(pathId);
      if (!path) continue;
      for (const step of path.steps) {
        if (step.category !== cat.slug) continue;
        const source = cat.articles.find((article) => (
          article.slug === step.slug && isSourceArticle(article)
        ));
        if (source) authoredSequenceSourceSlugs.add(source.slug);
      }
    }
  }
  const disclosureSourceArticles = sourceArticles.filter(
    (article) => !authoredSequenceSourceSlugs.has(article.slug),
  );
  const childNavigation = activeSub.children ? getChildNavigation(activeSub) : null;
  const branchSection = activeSub.children
    ? <ChildNavigationSection category={cat} subcategory={activeSub} />
    : null;
  const navigationBeforeTrack = childNavigation?.placement !== 'after-track';
  const branchFirst = Boolean(
    childNavigation
    && navigationBeforeTrack
    && childNavigation.mode === 'choice',
  );

  return (
    <div className="max-w-5xl">
      <motion.div className="mb-10 border-b border-border pb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link to={categoryPath(cat.slug)} className="font-medium hover:text-foreground">{cat.name}</Link>
          <ArrowRight aria-hidden className="h-3 w-3" />
          {activeStage && <span className={`font-bold ${stageRoleMeta[activeStage.role].tone}`}>{activeStage.order} {activeStage.label}</span>}
          {subcategoryTrail.slice(0, -1).map((ancestor) => (
            <span key={ancestor.slug} className="contents">
              <ArrowRight aria-hidden className="h-3 w-3" />
              <Link to={subcategoryPath(cat.slug, ancestor.slug)} className="font-semibold hover:text-foreground">{ancestor.name}</Link>
            </span>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{activeSub.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{activeSub.description ?? `${filtered.length}개의 글`}</p>
      </motion.div>
      {navigationBeforeTrack && branchSection}
      {isResearchTrackEntry && researchTrack && (
        <TopDownResearchRoute
          track={researchTrack}
          categorySlug={cat.slug}
          branchFirst={branchFirst}
        />
      )}
      {!navigationBeforeTrack && branchSection}
      {(researchTrackOrigin || parentSubcategory) && (
        <Link
          to={subcategoryPath(cat.slug, (researchTrackOrigin ?? parentSubcategory)!.slug)}
          className="group mb-8 grid min-w-0 gap-3 border-y border-border py-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5"
          data-parent-learning-route
        >
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {researchTrackOrigin ? 'TRACK ORIGIN' : 'PARENT ROUTE'}
          </span>
          <span className="min-w-0">
            <strong className="block text-sm">
              {researchTrackOrigin
                ? `${researchTrackOrigin.name}에서 현재 근거와 최소 기준점 확인`
                : `${parentSubcategory!.name}에서 이 분기의 역할 확인`}
            </strong>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              {researchTrackOrigin
                ? '이 글이 왜 필요한지 잊었을 때만 트랙 출발점으로 돌아갑니다. 이 페이지에서는 선택한 병목의 순서만 읽습니다.'
                : '최신 목표와 다른 분기의 연결을 먼저 보고, 이 페이지에서는 해당 병목만 순서대로 읽습니다.'}
            </span>
          </span>
          <ArrowRight aria-hidden className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
        </Link>
      )}
      {filtered.length === 0 && !activeSub.children ? (
        <p className="text-sm text-muted-foreground/60 py-4">아직 작성된 글이 없습니다.</p>
      ) : isResearchTrackEntry ? (
        <div className="space-y-8">
          {!activeSub.children && (
            <LearningPathDirectory coreArticles={coreArticles} allArticles={cat.articles} categorySlug={cat.slug} />
          )}
          <SourceArticleDisclosure sourceArticles={disclosureSourceArticles} categorySlug={cat.slug} />
        </div>
      ) : activeSub.slug === 'ai-foundations' ? (
        <FoundationLearningPath articles={filtered} allArticles={cat.articles} categorySlug={cat.slug} />
      ) : activeSub.slug === 'ai-math-foundations' ? (
        <MathFoundationLearningPath articles={filtered} categorySlug={cat.slug} />
      ) : filtered.length > 0 ? (
        <div className="space-y-10">
          <div>
            <AuthoredArticleSequences
              coreArticles={coreArticles}
              allArticles={cat.articles}
              categorySlug={cat.slug}
              sourceCount={disclosureSourceArticles.length}
              expandFullPaths={expandsAuthoredFullPaths}
            />
          </div>
          <SourceArticleDisclosure sourceArticles={disclosureSourceArticles} categorySlug={cat.slug} />
        </div>
      ) : null}
    </div>
  );
}
