import { Link } from 'react-router-dom';
import { Activity, ArrowRight, BookOpen, CheckCircle2, ClipboardList, Cpu, Layers, Route } from 'lucide-react';
import { categories } from '@/content';
import { publishedCoreTracks } from '@/content/core';
import { labDocs, labDocPath, labOperations, type LabOperationStatus } from '@/content/lab-management';
import { BLOG_ROOT, CORE_ROOT } from '@/lib/paths';

const articleCount = categories.reduce((sum, category) => sum + category.articles.length, 0);
const coreItemCount = publishedCoreTracks.reduce((sum, track) => sum + track.items.length, 0);

const operationStatus: Record<LabOperationStatus, { label: string; className: string }> = {
  running: { label: '운영 중', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' },
  build: { label: '구축 중', className: 'border-blue-500/30 bg-blue-500/10 text-blue-700' },
  review: { label: '검토', className: 'border-amber-500/30 bg-amber-500/10 text-amber-700' },
  paused: { label: '보류', className: 'border-muted bg-muted/40 text-muted-foreground' },
};

const flow = [
  {
    title: '1. 읽고 정리',
    label: '조사',
    body: '코드 리딩, 개념 조사, 실험 메모를 블로그에 남깁니다. 에이전트가 수집한 내용도 출처와 판단 근거를 확인할 수 있게 정리합니다.',
  },
  {
    title: '2. 작게 만들기',
    label: '구현',
    body: '기능을 작게 나누어 구현하고, 테스트와 사용 맥락을 함께 남깁니다. 검증된 단위는 이후 큰 작업에서 다시 쓰는 조각으로 관리합니다.',
  },
  {
    title: '3. 검토와 보강',
    label: '검토',
    body: 'Rust/Go 관용구, 테스트 누락, 설계 위험, 설명 가능성을 점검합니다. 에이전트의 답은 그대로 쓰지 않고 고친 이유를 함께 남깁니다.',
  },
  {
    title: '4. 다시 쓰기',
    label: '축적',
    body: '반복해서 설명해야 하는 방식, 설계 결정, 코드 흐름은 코어에 정리합니다. 큰 기능은 이렇게 검증된 작은 단위들을 조합해 만듭니다.',
  },
];

const split = [
  {
    title: '블로그',
    href: BLOG_ROOT,
    icon: BookOpen,
    purpose: '생각과 조사 과정',
    description: '넓게 읽고 정리하는 공간입니다. 코드 리딩, 개념 정리, 실험 메모를 사람이 다시 읽고 에이전트도 참조할 수 있는 형태로 남깁니다.',
    facts: [`${categories.length}개 주제`, `${articleCount}개 기록`, '긴 글'],
  },
  {
    title: '코어',
    href: CORE_ROOT,
    icon: Cpu,
    purpose: '코드베이스 검증 단위',
    description: '실제 코드 위치, 불변조건, 테스트 명령이 붙은 최소 검증 단위만 둡니다. 현재 공개 레지스트리는 go-ethereum 기준입니다.',
    facts: [`${publishedCoreTracks.length}개 작업 흐름`, `${coreItemCount}개 기록`, '실제 공개 항목'],
  },
  {
    title: '운영 문서',
    href: labDocPath('code-idioms'),
    icon: ClipboardList,
    purpose: 'AI 작업 기준과 프로젝트 운영',
    description: '언어 idiom, CI/CD 구조, 실제 프로젝트 관리는 블로그/코어와 분리해 에이전트가 작업 전에 참조하는 기준으로 둡니다.',
    facts: ['idiom', 'CI/CD', 'project board'],
  },
];

const principles = [
  '에이전트가 만든 결과는 바로 합치지 않고, 사람이 읽고 고친 뒤 기록합니다.',
  '큰 기능은 한 번에 만들지 않고, 검증된 작은 기능을 묶어 확장합니다.',
  '오래 남길 변경에는 이유, 테스트 결과, 검토 메모 중 하나 이상을 남깁니다.',
  '블로그는 생각의 흐름, 코어는 검증 단위, 운영 문서는 작업 기준과 프로젝트 상태를 관리합니다.',
];

const taxonomy = [
  {
    title: 'Area',
    body: 'AI, DevOps, Documents처럼 큰 책임 영역을 나눕니다. 한 프로젝트의 주 소속은 하나로 고정합니다.',
  },
  {
    title: 'Track',
    body: 'LLM Runtime, Agent Harness, Evals, CI/CD처럼 같은 성격의 프로젝트를 묶습니다.',
  },
  {
    title: 'Project',
    body: 'Blog/Lab, 문서 저장소, ai-quality-gates처럼 공개 랩에서 관리할 제품 또는 산출물 단위입니다.',
  },
  {
    title: 'Work Unit',
    body: 'paste fix, RHWP editor, quality gate처럼 구현과 검증 결과를 남길 수 있는 작은 단위입니다.',
  },
  {
    title: 'Pattern',
    body: 'Go/Rust/Python/JS idiom처럼 여러 프로젝트에 반복 적용되는 AI 코드 작성 기준입니다.',
  },
  {
    title: 'Delivery',
    body: 'CI/CD, 배포, 롤백, smoke check처럼 프로젝트를 안전하게 굴리는 운영 축입니다.',
  },
];

export default function LabPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <section id="overview" className="border-b px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">개발 운영</span>
            <span className="h-px w-8 bg-foreground" />
            <span className="text-xs font-medium">에이전트 기반 개발 운영</span>
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                에이전트와 함께 쌓아가는 개발 운영 방식
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                기능을 작게 나누어 블로그와 코드에 함께 남기고, 검증된 조각을 다시 묶어 큰 기능으로
                확장합니다.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-5">
              <p className="mb-3 text-sm font-semibold">관리 기준</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                블로그는 왜 그렇게 생각했는지를 남기고, 코어는 실제로 다시 쓸 구현 단위와 검증 결과를
                모읍니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="operations" className="border-b bg-muted/20 px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">실제 운영</h2>
            </div>
            <Link
              to={labDocPath('operations')}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              운영 기준 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {labOperations.map((item) => {
              const status = operationStatus[item.status];
              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="group rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/20"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {item.area}
                      </p>
                      <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                    </div>
                    <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.current}</p>
                  <div className="mt-4 rounded-md border bg-background/70 p-3">
                    <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Next
                    </p>
                    <p className="text-sm leading-relaxed">{item.next}</p>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.evidence}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">관리 문서</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {labDocs.map((doc) => (
              <Link
                key={doc.slug}
                to={labDocPath(doc.slug)}
                className="group rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/20"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {doc.eyebrow}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <h3 className="mb-2 text-sm font-semibold">{doc.label}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{doc.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b bg-muted/20 px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2">
            <Route className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">작업 흐름</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-4">
            {flow.map((step, index) => (
              <div key={step.title} className="relative rounded-lg border bg-background p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-md border px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {step.label}
                  </span>
                  {index < flow.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-muted-foreground lg:block" />
                  )}
                </div>
                <h3 className="mb-2 text-sm font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="management" className="border-b px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            관리 방식
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {split.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="group rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-accent/20"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 inline-flex rounded-md border p-2 text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">{item.purpose}</p>
                    </div>
                    <ArrowRight className="mt-2 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.facts.map((fact) => (
                      <span key={fact} className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                        {fact}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="taxonomy" className="px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <div className="mb-4 inline-flex rounded-md border p-2 text-muted-foreground">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">분류는 섞이지 않게 고정합니다.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              언어, 보안, CI/CD, 테스트는 독립 트리가 아니라 태그와 필터로 둡니다. 주 분류는
              Area → Track → Project → Work Unit 순서로만 관리합니다.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {taxonomy.map((item) => (
              <div key={item.title} className="rounded-lg border bg-card p-4">
                <p className="mb-2 font-mono text-xs font-medium text-muted-foreground">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="principles" className="border-t bg-muted/20 px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">운영 원칙</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              이 페이지는 결과를 나열하기보다, 코드를 어떻게 만들고 검증하고 다시 쓰는지 설명하는 데
              초점을 둡니다.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle} className="rounded-lg border bg-background p-4">
                <div className="mb-3 inline-flex rounded-md border p-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
