import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #memory-high-max — memory.high 1.8 GiB, memory.max 2 GiB(가정).
 * 위 자는 0~2 GiB 실제 축척이고 현재 사용량은 그리지 않는다. 사용량이 놓인 구간만 칠한다.
 * 마지막 장면은 Kubernetes 기본값: memory.high가 "max"라 느려지는 구간이 없다.
 */
interface Scene extends ShellScene {
  zone: "low" | "slow" | "wall" | "plain";
  speed: string;
  signal: string;
  process: string;
}

const W = 360;
const X0 = 12;
const X1 = 348;
const x = (gib: number) => X0 + ((X1 - X0) * gib) / 2;

const SCENES: readonly Scene[] = [
  { label: "memory.high 아래", summary: "1.8 GiB 미만", zone: "low", speed: "보통", signal: "없음", process: "그대로 돎", note: "두 선 아래에서는 어느 쪽도 작동하지 않습니다. 구간 안의 정확한 사용량은 정하지 않았습니다." },
  { label: "memory.high를 넘음", summary: "느려지지만 죽지 않음", zone: "slow", speed: "할당마다 직접 회수", signal: "PSI memory 상승 · memory.events high 증가", process: "그대로 돎", note: "직접 회수는 할당하는 프로세스가 스스로 메모리를 비우는 일이고, PSI는 7절의 '멈춘 시간' 지표입니다. OOM killer는 불리지 않으며, 극단적인 경우 사용량이 high 위로 더 올라갈 수 있고 마지막 벽이 memory.max입니다." },
  { label: "memory.max에 닿음", summary: "회수 실패 → OOM killer", zone: "wall", speed: "회수로 줄일 수 없음", signal: "그 cgroup 안에서 OOM killer 호출", process: "점수가 가장 높은 프로세스가 SIGKILL", note: "회수로 줄일 수 없을 때 그 cgroup 안에서 OOM killer가 불립니다. 137은 SIGKILL로 끝났을 때의 종료 코드입니다." },
  { label: "Kubernetes 기본값", summary: "high = max → 구간 없음", zone: "plain", speed: "max까지 느려지는 구간 없음", signal: "PSI·high 경고 구간 없음", process: "max에 닿으면 OOMKilled", note: "v1.37.1 kubelet은 MemoryQoS 게이트가 꺼진 기본 상태에서 memory.high에 \"max\"를 적어 둡니다. 게이트를 켜면 high를 계산하지만 이 기능은 아직 alpha입니다." },
];

function Slot({ title, active, values }: { title: string; active: number; values: readonly string[] }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 border-t border-border/70 py-1.5 text-xs leading-5">
      <span className="text-muted-foreground">{title}</span>
      <StableSceneStack active={active} scenes={values.map((value) => <span key={value} className="block font-semibold">{value}</span>)} />
    </div>
  );
}

export default function MemoryLinesViz() {
  return (
    <SceneShell
      eyebrow="memory.high · memory.max"
      title="첫째 선을 넘으면 느려지고, 둘째 선에 닿으면 죽을 수 있습니다"
      description="자는 0~2 GiB 축척이고 두 선의 값은 가정입니다. 칠한 구간이 사용량이 있는 자리입니다."
      ariaLabel="메모리 사용량이 두 선을 넘을 때 컨테이너에 일어나는 일"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hasHigh = scene.zone !== "plain";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 92`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={x(0)} y={36} width={x(hasHigh ? 1.8 : 2) - x(0)} height={28} fill="#2563eb" opacity={scene.zone === "low" || scene.zone === "plain" ? 0.3 : 0.06} />
              {hasHigh && <rect x={x(1.8)} y={36} width={x(2) - x(1.8)} height={28} fill="#d97706" opacity={scene.zone === "slow" ? 0.7 : 0.1} />}
              <rect x={x(0)} y={36} width={x(2) - x(0)} height={28} fill="none" stroke="#94a3b8" strokeWidth={1} />
              {hasHigh && (
                <>
                  <line x1={x(1.8)} x2={x(1.8)} y1={28} y2={64} stroke="#b45309" strokeWidth={1.25} />
                  <text x={x(1.8) - 4} y={30} textAnchor="end" fontSize={12} fontWeight={700} fill="#b45309">memory.high 1.8 GiB</text>
                </>
              )}
              <line x1={x(2)} x2={x(2)} y1={12} y2={64} stroke="#dc2626" strokeWidth={scene.zone === "wall" ? 1.25 : 1} />
              <text x={x(2)} y={10} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">memory.max 2 GiB</text>
              <text x={x(0)} y={80} fontSize={12} fill="#64748b">0</text>
              {scene.zone === "wall" && <text x={x(2)} y={80} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">이 벽에 닿음</text>}
              {scene.zone === "slow" && <text x={x(1.8) - 4} y={80} textAnchor="end" fontSize={12} fontWeight={700} fill="#b45309">사용량이 이 구간에 있음 →</text>}
            </svg>
            <div className="mt-3">
              <Slot title="할당" active={active} values={SCENES.map((item) => item.speed)} />
              <Slot title="보이는 신호" active={active} values={SCENES.map((item) => item.signal)} />
              <Slot title="프로세스" active={active} values={SCENES.map((item) => item.process)} />
            </div>
          </div>
        );
      }}
    />
  );
}
