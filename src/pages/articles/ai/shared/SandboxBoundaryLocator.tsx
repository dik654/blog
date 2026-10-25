import { Link } from "react-router-dom";

const STEPS = [
  {
    key: "process",
    label: "프로세스",
    detail: "Namespace와 cgroup이 보이는 자원과 사용할 수 있는 양을 나눕니다.",
    href: "/cs/ai/agent-sandbox-security#overview",
  },
  {
    key: "runtime",
    label: "시스템 호출",
    detail: "같은 호출이 필터·중개 커널·게스트 커널을 지나는 경로를 비교합니다.",
    href: "/cs/ai/sandbox-runtime-isolation#overview",
  },
  {
    key: "gpu",
    label: "GPU 장치",
    detail: "CPU 경계 밖의 ioctl·드라이버·장치 할당 경로를 따로 확인합니다.",
    href: "/cs/ai/sandbox-gpu-isolation#overview",
  },
  {
    key: "deploy",
    label: "배포 통제",
    detail: "신원·권한·통신·저장 공간·릴리스를 서로 다른 문으로 제한합니다.",
    href: "/cs/ai/sandbox-deployment-controls#overview",
  },
] as const;

export type SandboxBoundaryArticle = (typeof STEPS)[number]["key"];

const INDEX: Record<SandboxBoundaryArticle, number> = {
  process: 0,
  runtime: 1,
  gpu: 2,
  deploy: 3,
};

const QUESTIONS: Record<SandboxBoundaryArticle, string> = {
  process: "컨테이너는 어떤 프로세스 경계를 만들고, 무엇은 호스트와 계속 공유합니까?",
  runtime: "샌드박스 안의 openat() 호출은 어디서 검사되고 어느 커널이 처리합니까?",
  gpu: "GPU를 열었을 때 ioctl과 드라이버는 어느 경계를 통과합니까?",
  deploy: "런타임 격리가 막지 못하는 신원·통신·저장·배포 효과는 어디서 제한합니까?",
};

const FINDINGS: Record<SandboxBoundaryArticle, string> = {
  process:
    "컨테이너도 호스트 커널 위의 프로세스입니다. Namespace는 보이는 범위를, cgroup은 사용할 수 있는 양을 바꾸지만 별도 커널을 만들지는 않습니다.",
  runtime:
    "Seccomp는 호출을 거른 뒤 허용된 호출을 호스트 커널에 보냅니다. gVisor는 Sentry가 시스템 API를 구현하고, Kata는 게스트 커널이 호출을 처리합니다. 셋은 같은 종류의 한 단계가 아닙니다.",
  gpu:
    "GPU 지원은 장치를 보이게 하는 것으로 끝나지 않습니다. ioctl 중개와 장치 직접 할당은 서로 다른 신뢰 경계이며 드라이버·리셋·다중 GPU 경로를 따로 검증해야 합니다.",
  deploy:
    "프로세스와 커널을 격리해도 자격증명·외부 통신·쓰기 가능한 저장 공간은 남습니다. 각 효과는 별도의 정책과 영수증으로 제한해야 합니다.",
};

const NEXT: Record<SandboxBoundaryArticle, SandboxBoundaryArticle | null> = {
  process: "runtime",
  runtime: "gpu",
  gpu: "deploy",
  deploy: null,
};

export function SandboxBoundaryLocator({ current }: { current: SandboxBoundaryArticle }) {
  const index = INDEX[current];
  const currentStep = STEPS[index];

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="샌드박스 경계 학습 지도에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/agent-control-boundaries#overview" className="hover:text-primary">에이전트 안전</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/agent-sandbox-security#overview" className="hover:text-primary">샌드박스 경계</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{currentStep.label}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">{QUESTIONS[current]}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to="/cs/ai/agent-sandbox-security#overview" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            컨테이너의 프로세스·커널·장치·배포 경계 ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4" aria-label="샌드박스 경계를 네 단계로 나누는 지도">
        {STEPS.map((step, position) => (
          <Link
            key={step.key}
            to={step.href}
            aria-current={step.key === current ? "step" : undefined}
            className={`min-w-0 bg-background px-3 py-3 ${position <= index ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            <span className="font-mono text-[9px] font-black text-primary">{String(position + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{step.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{step.detail}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function SandboxBoundaryMapReturn({ current }: { current: SandboxBoundaryArticle }) {
  const nextKey = NEXT[current];
  const next = nextKey ? STEPS[INDEX[nextKey]] : null;

  return (
    <aside
      id="sandbox-boundary-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 샌드박스 경계 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{FINDINGS[current]}</p>
      {next ? (
        <Link to={next.href} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
          다음 확대 · {next.label} →
        </Link>
      ) : (
        <Link to="/cs/ai/skills-anatomy#overview" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
          다음 주제 · 스킬이 실행 경계를 보존하는 방법 →
        </Link>
      )}
    </aside>
  );
}
