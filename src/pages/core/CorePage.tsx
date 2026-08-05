import { Check, Circle, CircleDot, Clock3, Code2, Database, Rows3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publishedCoreTracks } from '@/content/core';
import { projectProgress, workspaceProjects, type WorkspaceProject, type WorkspaceStatus } from '@/content/core-workspace';

const CORE_HREF_PREFIX = '/lab/core';
const publishedCoreHrefs = new Set(
  publishedCoreTracks.flatMap((track) => track.items.map((item) => item.href).filter(Boolean)),
);

const statusMeta: Record<WorkspaceStatus, { label: string; icon: typeof Circle; className: string }> = {
  todo: {
    label: '예정',
    icon: Circle,
    className: 'border-border bg-muted/40 text-muted-foreground',
  },
  doing: {
    label: '진행',
    icon: CircleDot,
    className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  },
  review: {
    label: '검토',
    icon: Clock3,
    className: 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300',
  },
  done: {
    label: '완료',
    icon: Check,
    className: 'border-sky-500/30 bg-sky-500/5 text-sky-700 dark:text-sky-300',
  },
};

function isCoreHref(href?: string) {
  return Boolean(href?.startsWith(CORE_HREF_PREFIX));
}

function isPublishedCoreHref(href?: string) {
  const baseHref = href?.split('#')[0];
  return Boolean(baseHref && publishedCoreHrefs.has(baseHref));
}

function withCoreOnlyLinks(project: WorkspaceProject): WorkspaceProject {
  return {
    ...project,
    href: isPublishedCoreHref(project.href) ? project.href : undefined,
    units: project.units.map((unit) => ({
      ...unit,
      href: isPublishedCoreHref(unit.href) ? unit.href : undefined,
    })),
  };
}

function StatusPill({ status }: { status: WorkspaceStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="h-2 min-w-24 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 text-right text-xs font-medium text-muted-foreground">{value}%</span>
    </div>
  );
}

function ProjectCard({ project }: { project: WorkspaceProject }) {
  const progress = projectProgress(project);
  const done = project.units.filter((unit) => unit.status === 'done').length;

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border bg-background p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{project.area} / {project.track}</p>
          <h3 className="mt-1 truncate text-base font-semibold">
            {project.href ? (
              <Link to={project.href} className="hover:text-foreground/70">
                {project.title}
              </Link>
            ) : project.title}
          </h3>
        </div>
        <span className="shrink-0 rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
          {done}/{project.units.length}
        </span>
      </div>
      <ProgressBar value={progress} />
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{project.summary}</p>
      <div className="mt-4 space-y-2">
        {project.units.map((unit) => (
          unit.href ? (
            <Link
              key={unit.title}
              to={unit.href}
              className="flex items-start gap-2 rounded-md bg-muted/35 px-2.5 py-2 transition-colors hover:bg-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
            >
              <StatusPill status={unit.status} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium leading-relaxed text-foreground">{unit.title}</p>
                {unit.evidence && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{unit.evidence}</p>}
                {project.kind === 'codebase' && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-foreground underline-offset-4">
                    <Code2 className="h-3 w-3" />
                    코드 해설
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <div key={unit.title} className="flex items-start gap-2 rounded-md bg-muted/35 px-2.5 py-2">
              <StatusPill status={unit.status} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium leading-relaxed text-foreground">{unit.title}</p>
                {unit.evidence && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{unit.evidence}</p>}
              </div>
            </div>
          )
        ))}
      </div>
    </article>
  );
}

function groupCodebaseProjects(projects: WorkspaceProject[]) {
  return projects.reduce<Record<string, WorkspaceProject[]>>((groups, project) => {
    const key = project.codebase ?? project.area;
    groups[key] = [...(groups[key] ?? []), project];
    return groups;
  }, {});
}

export default function CorePage() {
  const codebaseProjects = workspaceProjects
    .filter((project) => (
      project.kind === 'codebase'
      && isCoreHref(project.href)
      && (isPublishedCoreHref(project.href) || project.units.some((unit) => isPublishedCoreHref(unit.href)))
    ))
    .map(withCoreOnlyLinks);
  const codebaseGroups = groupCodebaseProjects(codebaseProjects);
  const codebaseUnits = codebaseProjects.reduce((sum, project) => sum + project.units.length, 0);
  const doneCodebaseUnits = codebaseProjects.reduce(
    (sum, project) => sum + project.units.filter((unit) => unit.status === 'done').length,
    0,
  );

  return (
    <div className="max-w-7xl">
      <section className="mb-8 border-b pb-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs text-muted-foreground">실제 코드와 한글 주석 작업장</p>
            <h1 className="text-3xl font-bold tracking-tight">코어 작업 단위 레지스트리</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              실제 코드베이스에서 다시 검증 가능한 최소 단위만 보여줍니다. 블로그 소스보기 글은 이 화면의 주 링크로 노출하지 않습니다.
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[430px] sm:grid-cols-4">
            {[
              ['코드베이스', codebaseProjects.length],
              ['코어 화면', codebaseProjects.filter((project) => project.href).length],
              ['작업 단위', codebaseUnits],
              ['완료 단위', doneCodebaseUnits],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border px-3 py-2">
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">검증 단위 현황</p>
            </div>
            <ProgressBar value={100} />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              go-ethereum과 vLLM처럼 기능 범위, 근거 파일, 확인 명령이 붙은 항목만 코어 레지스트리에 올립니다. Reth/Helios/TEE/zkVM 소스보기 글은 별도 코어 검증 페이지가 생기기 전까지 여기서 숨깁니다.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Rows3 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">첫 화면 원칙</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              언어 idiom은 코어의 별도 트랙으로 분리하고, CI/CD와 실제 프로젝트 상태는 상단 헤더의 운영 문서로 바로 접근합니다.
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {codebaseProjects.filter((project) => project.href).map((project) => (
            <Link
              key={project.slug}
              to={project.href as string}
              className="group min-w-0 rounded-lg border bg-background px-3 py-3 transition-colors hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-muted-foreground">{project.codebase ?? project.area}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-foreground">{project.title}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  상세
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">코드베이스별 작업 단위</h2>
          </div>
          <span className="text-xs text-muted-foreground">{codebaseProjects.length}개 코드베이스 · {codebaseUnits}개 단위</span>
        </div>
        <div className="space-y-4">
          {Object.entries(codebaseGroups).map(([codebase, projects]) => (
            <div key={codebase} className="border-t pt-4 first:border-t-0 first:pt-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{codebase}</p>
                  <h3 className="text-base font-semibold">검증 단위와 커버리지</h3>
                </div>
                <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                  {projects.reduce((sum, project) => sum + project.units.length, 0)}개 단위
                </span>
              </div>
              <div className="grid min-w-0 gap-3 lg:grid-cols-2">
                {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
