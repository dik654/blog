import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reclaim-path — memory.max 2,048 MiB cgroup의 청구가 OOM까지 가는 순서.
 * 1,236 + 512 + 300 = 2,048 → A +300 → 1,536 + 512 + 0 = 2,048 → 청구 실패 16번 → A 393,984 · B 131,328 → A에 SIGKILL.
 */
const MAX = 2048;
const RETRIES = Array.from({ length: 16 }, (_, index) => index);

const SCENES = [
  { label: "장애 직전", summary: "1,236 + 512 + 300 = 2,048 MiB", a: 1236, b: 512, cache: 300, need: false, used: 0, reclaim: "아직 없음", verdict: "usage = max", note: "(가정) 한도에 정확히 닿았습니다. page를 새로 쓸 때마다 cgroup에 청구(charge)하고, 넘치면 이 cgroup의 page만 회수합니다." },
  { label: "A가 300 MiB 더 씁니다", summary: "1,536 + 512 + 0 = 2,048 MiB", a: 1536, b: 512, cache: 0, need: false, used: 0, reclaim: "cache 300 MiB", verdict: "청구 성공", note: "A가 300 MiB를 더 쓰는 동안은 로그 파일 cache 300 MiB가 회수되어 자리를 내줍니다." },
  { label: "다음 청구: 회수할 것이 없습니다", summary: "2,048 + need > 2,048 · freed = 0", a: 1536, b: 512, cache: 0, need: true, used: 0, reclaim: "0 MiB", verdict: "여유 없음 → 다시 시도", note: "need는 이번에 청구할 page 수입니다. 회수해도 여유가 없고 기다린 시간은 PSI memory에 쌓입니다. 재시도 중 다른 프로세스가 메모리를 놓으면 성공할 수 있습니다." },
  { label: "16번 뒤 cgroup OOM", summary: "A 393,984점 · B 131,328점", a: 1536, b: 512, cache: 0, need: true, used: 16, reclaim: "0 MiB", verdict: "점수 최댓값 = A", note: "16번 다시 시도한 뒤 cgroup OOM으로 갑니다. 점수의 totalpages는 노드 RAM이 아니라 이 cgroup의 524,288 page입니다." },
  { label: "oom.group 0: A만 끝납니다", summary: "A SIGKILL · B 계속", a: 0, b: 512, cache: 0, need: false, used: 0, reclaim: "A의 page 반환", verdict: "A 종료 · B 실행 중", note: "oom.group은 희생자의 cgroup을 통째로 죽일지 정하는 값입니다. 0이면 A만 끝납니다(Docker 기본 설정, cgroup v1 노드, singleProcessOOMKill: true). A가 주 프로세스라면 런타임은 137과 OOMKilled를 기록합니다." },
  { label: "oom.group 1: B도 함께 끝납니다", summary: "A 선택 → cgroup 전체 종료", a: 0, b: 0, cache: 0, need: false, used: 0, reclaim: "A·B의 page 반환", verdict: "A 종료 · B 종료", note: "Kubernetes v1.35.0 kubelet은 cgroup v2 노드에서 singleProcessOOMKill이 비어 있으면 oom.group에 1을 씁니다. 커널은 점수로 A를 고르지만 그 cgroup의 프로세스를 모두 죽입니다." },
] as const;

function Segment({ mib, color, text }: { mib: number; color: string; text: string }) {
  if (mib === 0) return null;
  return (
    <div className="flex h-full items-center justify-center overflow-hidden border-r border-background text-[11px] font-semibold text-white transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(mib / MAX) * 100}%`, backgroundColor: color }}>
      {text}
    </div>
  );
}

export default function CgroupChargeViz() {
  return (
    <SceneShell
      eyebrow="cgroup 청구"
      title="한도 안의 cache가 바닥나면 16번 시도한 뒤 안에서 죽입니다"
      description="막대 전체가 memory.max 2,048 MiB입니다. A는 앱, B는 로그 수집기, 파랑은 로그 파일 cache입니다."
      note="노드에 빈 RAM이 10 GiB 있어도 이 cgroup의 OOM은 막지 못합니다. page table과 공유 page는 7절 가정대로 상쇄됩니다."
      ariaLabel="memory.max 2 GiB cgroup의 청구, 회수, 재시도, OOM 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_2.75rem] gap-1">
              <div className="flex h-11 overflow-hidden rounded-sm border border-border bg-muted/40">
                <Segment mib={scene.a} color="#dc2626" text={`A ${scene.a.toLocaleString("en-US")}`} />
                <Segment mib={scene.b} color="#7c3aed" text={`B ${scene.b}`} />
                <Segment mib={scene.cache} color="#2563eb" text={`${scene.cache}`} />
              </div>
              <div className={`flex h-11 items-center justify-center rounded-sm border border-dashed text-[11px] font-semibold ${scene.need ? "" : "opacity-0"}`} style={{ borderColor: "#dc2626", color: "#dc2626" }}>
                need
              </div>
            </div>
            <div className="mt-1 grid grid-cols-[minmax(0,1fr)_2.75rem] gap-1 font-mono text-[11px] text-muted-foreground">
              <div className="flex justify-between">
                <span>0</span>
                <span>max 2,048</span>
              </div>
              <span className="text-center">초과</span>
            </div>
            <p className="mb-1 mt-3 text-xs font-semibold text-muted-foreground">재시도 {scene.used} / 16</p>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
              {RETRIES.map((index) => (
                <div key={index} className="h-3 rounded-sm border" style={{ borderColor: "#94a3b8", backgroundColor: index < scene.used ? "#d97706" : "transparent" }} />
              ))}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">회수·반환</dt>
                <dd className="font-bold">{scene.reclaim}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">상태</dt>
                <dd className="font-bold">{scene.verdict}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
