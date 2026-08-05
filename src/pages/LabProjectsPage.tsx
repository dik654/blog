import { Check, Circle, CircleDot, Clock3, Database, ExternalLink, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectProgress, workspaceProjects, type WorkspaceProject, type WorkspaceStatus } from '@/content/core-workspace';
import { labDocPath } from '@/content/lab-management';

const statusMeta: Record<WorkspaceStatus, { label: string; icon: typeof Circle; className: string }> = {
  todo: { label: '예정', icon: Circle, className: 'border-border bg-muted/40 text-muted-foreground' },
  doing: { label: '진행', icon: CircleDot, className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700' },
  review: { label: '검토', icon: Clock3, className: 'border-amber-500/30 bg-amber-500/5 text-amber-700' },
  done: { label: '완료', icon: Check, className: 'border-sky-500/30 bg-sky-500/5 text-sky-700' },
};

const hiddenLabProjectSlugs = new Set(['context-manager', 'cmcli']);

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 text-right text-xs font-medium text-muted-foreground">{value}%</span>
    </div>
  );
}

function ProjectRow({ project }: { project: WorkspaceProject }) {
  const progress = projectProgress(project);
  const nextUnit = project.units.find((unit) => unit.status === 'doing')
    ?? project.units.find((unit) => unit.status === 'review')
    ?? project.units.find((unit) => unit.status === 'todo')
    ?? project.units[0];

  return (
    <article className="min-w-0 rounded-lg border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{project.area} / {project.track}</p>
          <h3 className="mt-1 text-base font-semibold">
            {project.href ? (
              <Link to={project.href} className="inline-flex min-w-0 items-center gap-1 transition-colors hover:text-foreground/70">
                <span className="truncate">{project.title}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </Link>
            ) : project.title}
          </h3>
        </div>
        <span className="rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
          {project.kind === 'codebase' ? '코드베이스' : '운영'}
        </span>
      </div>

      <ProgressBar value={progress} />
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>

      <div className="mt-4 rounded-md border bg-background p-3">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Next</p>
        <p className="text-sm leading-relaxed">{project.next}</p>
      </div>

      {nextUnit && (
        <div className="mt-3 rounded-md bg-muted/35 p-3">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Current unit</p>
          <div className="flex min-w-0 items-start gap-2">
            {(() => {
              const meta = statusMeta[nextUnit.status];
              const Icon = meta.icon;
              return (
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
                  <Icon className="h-3 w-3" />
                  {meta.label}
                </span>
              );
            })()}
            <div className="min-w-0">
              <p className="text-sm font-medium leading-relaxed">{nextUnit.title}</p>
              {nextUnit.evidence && <p className="mt-0.5 truncate text-xs text-muted-foreground">{nextUnit.evidence}</p>}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function LabProjectsPage() {
  const visibleProjects = workspaceProjects.filter((project) => !hiddenLabProjectSlugs.has(project.slug));
  const managementProjects = visibleProjects.filter((project) => project.kind !== 'codebase');
  const codebaseProjects = visibleProjects.filter((project) => project.kind === 'codebase');
  const totalUnits = visibleProjects.reduce((sum, project) => sum + project.units.length, 0);
  const doneUnits = visibleProjects.reduce(
    (sum, project) => sum + project.units.filter((unit) => unit.status === 'done').length,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 border-b pb-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs text-muted-foreground">실제 작업판</p>
            <h1 className="text-3xl font-bold tracking-tight">프로젝트 운영 보드</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              랩 설명 문서와 분리해서 실제 프로젝트, 현재 작업 단위, 다음 액션, 완료 증거를 한 화면에서 봅니다.
            </p>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:min-w-[390px]">
            {[
              ['프로젝트', visibleProjects.length],
              ['작업 단위', totalUnits],
              ['완료', doneUnits],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border px-3 py-2">
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={labDocPath('project-board')} className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            프로젝트 기준 문서
          </Link>
          <Link to="/lab/cicd" className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            CI/CD 운영 보드
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">운영 프로젝트</h2>
          </div>
          <span className="text-xs text-muted-foreground">{managementProjects.length}개</span>
        </div>
        <div className="grid min-w-0 gap-3 xl:grid-cols-2">
          {managementProjects.map((project) => <ProjectRow key={project.slug} project={project} />)}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">코드베이스 프로젝트</h2>
          </div>
          <span className="text-xs text-muted-foreground">{codebaseProjects.length}개</span>
        </div>
        <div className="grid min-w-0 gap-3 xl:grid-cols-2">
          {codebaseProjects.map((project) => <ProjectRow key={project.slug} project={project} />)}
        </div>
      </section>
    </div>
  );
}
