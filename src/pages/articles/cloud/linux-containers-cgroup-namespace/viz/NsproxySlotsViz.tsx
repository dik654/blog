import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #namespaces — 프로세스는 nsproxy 하나를 가리키고, 그 안의 포인터 일부만 새 객체로 바뀐다.
 * 같은 칸으로 합쳐 그린 것은 같은 객체다. net·UTS·IPC는 Pod 공용, mount·PID는 컨테이너마다 따로.
 * 나머지 time·cgroup 포인터는 글이 Pod 범위를 말하지 않아 그리지 않는다. CPU·메모리 양에는 namespace가 없다.
 */
const SHARED = [
  { name: "net", sub: "장치·포트·라우팅" },
  { name: "uts", sub: "hostname" },
  { name: "ipc", sub: "메시지 큐" },
] as const;
const OWN = [
  { name: "mnt", sub: "마운트 표" },
  { name: "pid", sub: "프로세스 번호" },
] as const;

const SCENES: readonly ShellScene[] = [
  { label: "보통 프로세스", summary: "포인터 전부 호스트 객체", note: "프로세스는 struct nsproxy 하나를 가리키고, 그 안의 포인터가 어느 객체를 볼지 정합니다. 호스트 프로세스의 포인터는 호스트 객체를 가리킵니다." },
  { label: "첫 컨테이너", summary: "CLONE_NEW*", note: "clone 플래그로 포인터 몇 개를 새 객체로 바꾼 프로세스입니다. net·uts·ipc는 같은 Pod의 컨테이너가 함께 쓰도록 Pod sandbox에서 만든 것을 물려받습니다." },
  { label: "같은 Pod의 둘째", summary: "합친 칸 = 같은 객체", note: "둘째 컨테이너도 sandbox의 포인터를 물려받아 localhost를 공유합니다. mnt·pid는 각자 새로 받아 합쳐지지 않습니다." },
  { label: "양을 나누는 칸은 없음", summary: "노드 전체가 보임", note: "어느 namespace도 CPU 시간이나 메모리 양을 격리하지 않습니다. /proc/meminfo와 nproc은 노드 전체를 보여 주고, 한도는 cgroup 파일에만 있습니다." },
];

function Cell({ tone, children, span = false }: { tone: "host" | "pod" | "own" | "empty"; children: string; span?: boolean }) {
  const style =
    tone === "host"
      ? "border-[#94a3b8] text-muted-foreground"
      : tone === "pod"
        ? "border-[#2563eb] bg-[#2563eb]/10 font-semibold text-[#2563eb] dark:text-[#93c5fd]"
        : tone === "own"
          ? "border-[#b45309] bg-[#b45309]/10 font-semibold text-[#b45309] dark:text-[#fbbf24]"
          : "border-dashed border-border/60 text-muted-foreground/50";
  return <div className={`flex min-h-8 min-w-0 items-center justify-center rounded border px-1 py-0.5 text-center text-[11px] leading-4 sm:text-xs ${style} ${span ? "col-span-2" : ""}`}>{children}</div>;
}

export default function NsproxySlotsViz() {
  return (
    <SceneShell
      eyebrow="struct nsproxy"
      title="namespace는 포인터 몇 칸만 새 객체로 바꿉니다"
      description="줄 하나가 포인터 한 칸이고, 합쳐 그린 칸은 같은 객체입니다. time·cgroup 포인터는 생략했습니다."
      ariaLabel="호스트 프로세스와 같은 Pod의 두 컨테이너가 가리키는 namespace 객체"
      scenes={SCENES}
      render={(active) => {
        const first = active >= 1;
        const second = active >= 2;
        return (
          <div className="grid min-w-0 grid-cols-[4.75rem_repeat(3,minmax(0,1fr))] gap-1.5">
            <span />
            {["호스트", "컨테이너 1", "컨테이너 2"].map((head) => (
              <span key={head} className="self-end text-center text-[11px] font-bold leading-4 sm:text-xs">{head}</span>
            ))}
            {SHARED.map((row) => (
              <div key={row.name} className="contents">
                <span className="self-center text-[11px] leading-4 sm:text-xs"><b className="font-mono">{row.name}</b><br /><span className="text-muted-foreground">{row.sub}</span></span>
                <Cell tone="host">호스트 것</Cell>
                {second ? <Cell tone="pod" span>Pod 공용 한 벌</Cell> : <><Cell tone={first ? "pod" : "empty"}>{first ? "Pod 공용" : "없음"}</Cell><Cell tone="empty">없음</Cell></>}
              </div>
            ))}
            {OWN.map((row) => (
              <div key={row.name} className="contents">
                <span className="self-center text-[11px] leading-4 sm:text-xs"><b className="font-mono">{row.name}</b><br /><span className="text-muted-foreground">{row.sub}</span></span>
                <Cell tone="host">호스트 것</Cell>
                <Cell tone={first ? "own" : "empty"}>{first ? "1번 전용" : "없음"}</Cell>
                <Cell tone={second ? "own" : "empty"}>{second ? "2번 전용" : "없음"}</Cell>
              </div>
            ))}
            <span className={`self-center text-[11px] font-bold leading-4 sm:text-xs ${active === 3 ? "text-[#dc2626]" : "text-muted-foreground/50"}`}>CPU·메모리 양</span>
            <div className={`col-span-3 flex min-h-8 items-center justify-center rounded border border-dashed px-2 py-0.5 text-center text-[11px] leading-4 sm:text-xs ${active === 3 ? "border-[#dc2626] font-semibold text-[#dc2626]" : "border-border/60 text-muted-foreground/50"}`}>
              이 양을 나누는 namespace는 없음
            </div>
          </div>
        );
      }}
    />
  );
}
