import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, BookOpenText, Target, Wrench } from 'lucide-react';
import { categories } from '@/content';
import { groupCategories } from '@/content/category-groups';
import { publishedCoreTracks } from '@/content/core';
import { getSidebarLearningStages, type SidebarLearningStage } from '@/content/sidebar-learning-structure';
import CategoryItem from './sidebar/CategoryItem';
import { labDocs, labDocPath } from '@/content/lab-management';
import { BLOG_ROOT, CORE_ROOT, LAB_ROOT, coreTrackPath } from '@/lib/paths';

interface Props {
  // 모바일 drawer 에서 렌더될 때, 링크 클릭 시 drawer 를 닫기 위한 콜백.
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: Props = {}) {
  const { category: activeCategory, article: activeArticle } = useParams();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const grouped = groupCategories(categories);
  const isCore = location.pathname === CORE_ROOT || location.pathname.startsWith(`${CORE_ROOT}/`);
  const isBlog = location.pathname === BLOG_ROOT || location.pathname.startsWith(`${BLOG_ROOT}/`);
  const isLabOverview = location.pathname === LAB_ROOT || labDocs.some((doc) => location.pathname === labDocPath(doc.slug));
  const activeSubcategory = new URLSearchParams(location.search).get('sub') ?? undefined;
  const groupIcons = {
    capability: Target,
    foundation: BookOpenCheck,
    operations: Wrench,
  } as const;
  const roleLegend = {
    orient: { label: '읽기', className: 'text-emerald-700 dark:text-emerald-400' },
    map: { label: '읽기', className: 'text-emerald-700 dark:text-emerald-400' },
    target: { label: '목표', className: 'text-blue-700 dark:text-blue-400' },
    foundation: { label: '기반', className: 'text-amber-700 dark:text-amber-400' },
    build: { label: '구현', className: 'text-rose-700 dark:text-rose-400' },
  } satisfies Record<SidebarLearningStage['role'], { label: string; className: string }>;
  const activeCategoryDefinition = categories.find((category) => category.slug === activeCategory);
  const activeRoles = activeCategoryDefinition
    ? getSidebarLearningStages(activeCategoryDefinition).map((stage) => stage.role)
    : (['orient', 'target', 'foundation', 'build'] satisfies SidebarLearningStage['role'][]);
  const visibleLegend = activeRoles
    .map((role) => roleLegend[role])
    .filter((item, index, items) => items.findIndex((candidate) => candidate.label === item.label) === index);

  const toggle = (key: string, nextOpen?: boolean) => {
    setExpanded((prev) => ({ ...prev, [key]: nextOpen ?? !prev[key] }));
  };

  return (
    <div className="h-full overflow-y-auto">
      <nav className="py-4 px-3">
        <div className="mb-5 px-3">
          <Link to={LAB_ROOT} onClick={onNavigate} className="text-sm font-semibold tracking-tight">
            Dylan Lab
          </Link>
          {isBlog && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpenText aria-hidden className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">탑다운 지식 지도</span>
              </div>
              <div
                className="mt-2 flex flex-wrap items-center gap-1.5 border-y border-border/70 py-2 text-xs font-semibold text-muted-foreground"
                data-sidebar-role-legend
              >
                {visibleLegend.map((item, index) => (
                  <span key={item.label} className="contents">
                    {index > 0 && <ArrowRight aria-hidden className="h-2.5 w-2.5" />}
                    <span className={item.className}>{item.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLabOverview && (
          <div>
            <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              관리 문서
            </div>
            <div>
              {labDocs.map((item) => {
                const href = labDocPath(item.slug);
                const active = location.pathname === href;
                return (
                <Link
                  key={item.slug}
                  to={href}
                  onClick={onNavigate}
                  className={`mb-1 block min-h-11 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50 ${
                    active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block font-medium text-foreground">{item.label}</span>
                  <span className="block text-xs leading-relaxed opacity-70">{item.eyebrow}</span>
                </Link>
              );
              })}
            </div>
          </div>
        )}

        {isBlog && grouped.map((group) => {
          const GroupIcon = groupIcons[group.id as keyof typeof groupIcons];
          return (
          <section key={group.id} data-sidebar-layer={group.id} className="mt-5 first:mt-2">
            <div className="mb-1.5 px-3">
              <div className="flex items-center gap-2">
                {GroupIcon && <GroupIcon aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />}
                <span className="text-xs font-semibold text-muted-foreground/60">
                  {group.eyebrow}
                </span>
              </div>
              <div className="mt-0.5 text-xs font-semibold text-muted-foreground">
                {group.name}
              </div>
            </div>
            {group.categories.map((cat) => (
              <CategoryItem
                key={cat.slug}
                category={cat}
                isActive={activeCategory === cat.slug}
                isExpanded={expanded[cat.slug] ?? activeCategory === cat.slug}
                activeArticle={activeArticle}
                activeSubcategory={activeSubcategory}
                expanded={expanded}
                onToggle={toggle}
                onNavigate={onNavigate}
              />
            ))}
          </section>
        )})}

        {isCore && (
          <div>
            <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              코어 트랙
            </div>
            {publishedCoreTracks.map((track) => {
              const href = coreTrackPath(track.slug);
              const active = location.pathname === href || location.pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={track.slug}
                  to={href}
                  onClick={onNavigate}
                  className={`mb-1 block min-h-11 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50 ${
                    active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block font-medium">{track.title}</span>
                  <span className="block text-xs leading-relaxed opacity-70">{track.eyebrow}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
