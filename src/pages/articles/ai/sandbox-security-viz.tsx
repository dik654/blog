import { NodeBox, StoryShell, useStory } from "./kimi-k3-shared";

function Arrow({ active = true }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={`rotate-90 text-center text-xl transition-opacity md:rotate-0 ${
        active ? "text-primary opacity-100" : "text-muted-foreground opacity-25"
      }`}
    >
      →
    </span>
  );
}

function ResourceMeter({ active }: { active: boolean }) {
  return (
    <div
      className={`border p-4 transition-all duration-500 ${
        active
          ? "border-amber-500/60 bg-amber-500/10 opacity-100"
          : "border-border opacity-25"
      }`}
    >
      <p className="text-xs font-black">cgroup budget</p>
      <div
        className="mt-3 grid grid-cols-8 gap-1"
        aria-label="memory budget 5 of 8"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <span
            key={index}
            className={`h-5 border ${
              index < 5
                ? "border-amber-500/60 bg-amber-500/25"
                : "border-border bg-background"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        CPU · memory · PID 사용량
      </p>
    </div>
  );
}

export function ContainerBoundaryViz() {
  const story = useStory(4);
  const labels = [
    "host process",
    "namespace",
    "cgroup",
    "attack path",
  ] as const;

  return (
    <StoryShell
      title="Container는 새 기계가 아니라 보이는 자원과 쓸 수 있는 양을 제한한 process다"
      subtitle="같은 host kernel 위에서 namespace와 cgroup이 서로 다른 일을 하고, 열린 capability가 공격 경로를 완성하는 모습을 단계별로 봅니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="border border-border p-4">
          <p className="text-center text-xs font-black text-muted-foreground">
            HOST
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div
              className={`border p-3 transition-all duration-500 ${
                story.step >= 1
                  ? "border-cyan-500/60 bg-cyan-500/10"
                  : "border-border"
              }`}
            >
              <p className="text-xs font-black">agent process</p>
              <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[10px]">
                {[
                  ["PID", "12"],
                  ["mount", "/workspace"],
                  ["net", "10.2.4.8"],
                ].map(([label, value]) => (
                  <span
                    key={label}
                    className="min-w-0 border border-cyan-500/40 p-2"
                  >
                    <b className="block">{label}</b>
                    <span className="break-all text-muted-foreground">
                      {value}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <ResourceMeter active={story.step >= 2} />
          </div>
          <div className="mt-4 border border-violet-500/50 bg-violet-500/10 px-4 py-3 text-center">
            <p className="text-xs font-black">공유 host kernel</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              system call의 최종 처리자
            </p>
          </div>
        </div>
        <div
          className={`border p-4 transition-all duration-500 ${
            story.step >= 3
              ? "border-rose-500/60 bg-rose-500/10 opacity-100"
              : "border-border opacity-25"
          }`}
        >
          <p className="text-xs font-black">열린 공격 경로</p>
          <div className="mt-4 grid items-center gap-2 text-center text-xs sm:grid-cols-[1fr_auto_1fr] lg:grid-cols-1">
            <span className="border border-border p-2">untrusted input</span>
            <Arrow active={story.step >= 3} />
            <span className="border border-amber-500/50 p-2">
              mounted token
            </span>
            <Arrow active={story.step >= 3} />
            <span className="border border-rose-500/50 p-2">
              control-plane write
            </span>
          </div>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        {
          [
            "출발점은 host kernel을 공유하는 한 Linux process입니다. 아직 별도 VM 경계는 없습니다.",
            "Namespace는 PID·mount·network처럼 process가 볼 이름과 자원 view를 바꿉니다.",
            "Cgroup은 같은 자원을 얼마나 쓸 수 있는지 budget을 제한합니다. 보이는 범위와 사용량 제한은 다른 축입니다.",
            "Token·route·mount 같은 capability가 열린 채 이어질 때 signal이 실제 impact가 됩니다. 한 edge를 끊은 뒤 다른 경로도 다시 찾습니다.",
          ][story.step]
        }
      </p>
    </StoryShell>
  );
}

export function RuntimeIsolationViz() {
  const story = useStory(4);
  const labels = ["syscall", "seccomp", "Sentry", "guest kernel"] as const;

  const stages = [
    {
      title: "application",
      detail: "open · read · ioctl 요청",
      tone: "sequence" as const,
    },
    {
      title: "policy / mediator",
      detail: ["없음", "seccomp filter", "gVisor Sentry", "VMM boundary"][
        story.step
      ],
      tone: "width" as const,
    },
    {
      title: story.step === 3 ? "guest kernel" : "host kernel",
      detail:
        story.step === 2 ? "축소된 host interface만 받음" : "system call 처리",
      tone: "depth" as const,
    },
  ];

  return (
    <StoryShell
      title="같은 system call이 runtime마다 다른 경로로 kernel에 도달한다"
      subtitle="제품 이름을 외우기 전에 요청이 어디서 검사되고 어느 kernel이 처리하는지 경로를 바꿔 봅니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {stages.map((stage, index) => (
          <div key={`${stage.title}-${index}`} className="contents">
            <NodeBox
              active={index === 0 || story.step >= index - 1}
              title={stage.title}
              detail={stage.detail}
              tone={stage.tone}
            />
            {index < stages.length - 1 ? <Arrow active /> : null}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
        {[
          [
            "host surface",
            ["넓음", "줄어듦", "더 줄어듦", "VMM으로 이동"][story.step],
          ],
          ["호환성", ["높음", "높음", "검증 필요", "검증 필요"][story.step]],
          ["기동 비용", ["낮음", "낮음", "중간", "높음"][story.step]],
        ].map(([label, value]) => (
          <div key={label} className="border border-border p-2">
            <b className="block">{label}</b>
            <span className="text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </StoryShell>
  );
}

export function GpuIsolationViz() {
  const story = useStory(4);
  const labels = ["device 열기", "nvproxy", "VFIO", "검증"] as const;

  return (
    <StoryShell
      title="GPU를 열면 CPU sandbox 벽에 별도의 device 통로가 생긴다"
      subtitle="nvproxy의 ioctl 중개와 VFIO의 device assignment를 같은 ‘GPU 지원’으로 뭉개지 않고 두 경로로 비교합니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div
          className={`border p-4 transition-opacity ${story.step === 0 || story.step === 1 || story.step === 3 ? "opacity-100" : "opacity-30"}`}
        >
          <p className="text-xs font-black text-cyan-600 dark:text-cyan-300">
            gVisor · nvproxy
          </p>
          <div className="mt-4 grid items-center gap-2 text-center text-xs sm:grid-cols-[1fr_auto_1fr_auto_1fr] lg:grid-cols-1">
            <span className="border border-border p-2">CUDA process</span>
            <Arrow />
            <span className="border border-cyan-500/50 bg-cyan-500/10 p-2">
              지원 ioctl 검사
            </span>
            <Arrow />
            <span className="border border-violet-500/50 p-2">
              host NVIDIA driver
            </span>
          </div>
        </div>
        <div
          className={`border p-4 transition-opacity ${story.step === 0 || story.step === 2 || story.step === 3 ? "opacity-100" : "opacity-30"}`}
        >
          <p className="text-xs font-black text-violet-600 dark:text-violet-300">
            Kata · VFIO
          </p>
          <div className="mt-4 grid items-center gap-2 text-center text-xs sm:grid-cols-[1fr_auto_1fr_auto_1fr] lg:grid-cols-1">
            <span className="border border-border p-2">guest driver</span>
            <Arrow />
            <span className="border border-violet-500/50 bg-violet-500/10 p-2">
              VMM · IOMMU
            </span>
            <Arrow />
            <span className="border border-amber-500/50 p-2">assigned GPU</span>
          </div>
        </div>
      </div>
      <div
        className={`mt-4 grid grid-cols-2 gap-2 transition-opacity sm:grid-cols-4 ${story.step >= 3 ? "opacity-100" : "opacity-25"}`}
      >
        {["GPU model", "driver", "reset", "multi-GPU fabric"].map((item) => (
          <span
            key={item}
            className="border border-emerald-500/40 bg-emerald-500/10 p-2 text-center text-xs"
          >
            {item}
          </span>
        ))}
      </div>
    </StoryShell>
  );
}

export function DeploymentControlsViz() {
  const story = useStory(4);
  const labels = ["identity", "egress", "storage", "release"] as const;

  const controls = [
    ["Identity", "projected token", "RBAC verb · resource · namespace"],
    ["Network", "default deny", "DNS/FQDN allowlist · flow log"],
    ["Storage", "read-only root", "bounded workspace · destroy"],
    ["Release", "negative tests", "모든 gate receipt 확인"],
  ] as const;

  return (
    <StoryShell
      title="한 Pod를 네 개의 독립 gate로 감싸고 마지막에 함께 승인한다"
      subtitle="한 설정이 다른 경계를 대신하지 않습니다. 장면마다 통제 하나를 추가하고 마지막에 실제 차단 결과를 합칩니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {controls.map(([title, first, second], index) => (
          <div
            key={title}
            className={`border p-4 transition-all duration-500 ${
              story.step >= index
                ? "border-primary/60 bg-primary/5 opacity-100"
                : "border-border opacity-25"
            }`}
          >
            <p className="text-xs font-black">
              {String(index + 1).padStart(2, "0")} · {title}
            </p>
            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-[11px]">
              <span className="border border-border p-2">{first}</span>
              <span aria-hidden>→</span>
              <span className="border border-emerald-500/40 bg-emerald-500/10 p-2">
                {second}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-5 max-w-md border border-violet-500/50 bg-violet-500/10 p-4 text-center">
        <p className="text-sm font-black">agent workload</p>
        <p className="mt-1 text-xs text-muted-foreground">
          필요 capability만 가진 session-scoped Pod
        </p>
      </div>
    </StoryShell>
  );
}
