import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #kernel-source — cgroup 공용 통에서 CPU별 run queue로 slice가 옮겨 가고, 통이 비면 네 run queue가 모두 내려온다.
 * 칸 하나 = 2.5ms. 통 20칸 = 50ms, run queue 2칸 = slice 5ms. 숫자는 글의 의사코드 설명을 그대로 따른다.
 * 통+run queue 합: t0 30+20=50, t5 10+20=30, t10 0+10=10, t12.5 0. 100ms에 통 50. 102.5ms에 50−10=40.
 */
interface Scene extends ShellScene {
  pool: number;
  poolLabel: string;
  rq: number;
  work: number;
  state: string;
}

const CELL_MS = 2.5;
const POOL_CELLS = 20;
const RQ_CELLS = 2;

const SCENES: readonly Scene[] = [
  { label: "t = 0ms · slice 받기", summary: "통 50 → 30ms", pool: 30, poolLabel: "통 30ms", rq: 5, work: 15, state: "돎", note: "통은 cgroup 공용 실행 시간, run queue는 CPU마다 있는 실행 줄입니다. 처음에는 남은 시간이 0이라 넷이 slice 5ms씩 꺼내 옵니다." },
  { label: "t = 5ms · 다시 받기", summary: "통 30 → 10ms", pool: 10, poolLabel: "통 10ms", rq: 5, work: 10, state: "돎", note: "스레드가 돌수록 run queue의 남은 시간(runtime_remaining)이 줄어 5ms 뒤 0이 됩니다. 넷이 다시 5ms씩 받습니다. 벽시계 5ms에 quota 20ms가 빠져나간 셈입니다." },
  { label: "t = 10ms · 마지막 10ms", summary: "통 10 → 0ms", pool: 0, poolLabel: "통 0ms", rq: 2.5, work: 5, state: "돎", note: "글의 설명대로 남은 10ms를 넷이 2.5ms씩 나눠 받습니다. 통은 이제 비었습니다. 실제 소진 시각은 수 ms 어긋날 수 있습니다." },
  { label: "t = 12.5ms · 못 받음", summary: "받을 몫 0 → dequeue", pool: 0, poolLabel: "통 0ms", rq: 0, work: 2.5, state: "내려옴", note: "통이 비어 더 받지 못합니다. throttle_cfs_rq가 run queue 전체를 줄에서 내리고(dequeue), 스레드에 2.5ms씩 일이 남았지만 돌지 않습니다." },
  { label: "t = 100ms · 통 채우기", summary: "통 0 → 50ms · nr_periods +1", pool: 50, poolLabel: "통 50ms", rq: 0, work: 2.5, state: "내려옴", note: "period timer가 통에 quota를 더하고 quota + burst(지난 주기 몫의 이월, 여기서는 0)인 50ms에서 자릅니다. 87.5ms가 throttled_usec에 쌓였습니다. 곧바로 다음 장면의 unthrottle이 이어집니다." },
  { label: "t = 102.5ms · 요청 끝", summary: "nr_throttled 1 · 남은 합 40ms", pool: 40, poolLabel: "통 + run queue 합 40ms", rq: 0, work: 0, state: "일 끝", note: "100ms의 timer가 nr_throttled을 올리고 runtime을 나눠 주며 unthrottle했습니다. 넷이 2.5ms씩 마저 돌아 요청이 끝나고, 50 − 10 = 40ms가 남습니다. 통과 run queue에 어떻게 나뉘었는지는 정하지 않아 합으로 적었습니다." },
];

function Cells({ count, filled, color }: { count: number; filled: number; color: string }) {
  return (
    <div className="flex min-w-0 gap-px" style={{ width: count === RQ_CELLS ? "2.75rem" : "100%" }}>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="h-5 min-w-0 flex-1 rounded-[2px] border border-border/70" style={{ backgroundColor: index < filled ? color : "transparent" }} />
      ))}
    </div>
  );
}

export default function SliceBucketViz() {
  return (
    <SceneShell
      eyebrow="cfs_bandwidth"
      title="공용 통에서 5ms씩 꺼내 쓰다가, 통이 비면 네 줄이 함께 내려옵니다"
      description="칸 하나가 2.5ms입니다. 3절의 가정대로 quota 50ms·period 100ms·burst 0, 스레드 넷이 15ms씩 돕니다."
      ariaLabel="cgroup 공용 통과 네 run queue 사이에서 실행 시간이 옮겨 가는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-1 min-h-5 text-xs font-bold">{scene.poolLabel}</p>
            <Cells count={POOL_CELLS} filled={scene.pool / CELL_MS} color="#2563eb" />
            <div className="mt-4 space-y-1.5">
              {[1, 2, 3, 4].map((cpu) => (
                <div key={cpu} className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs">
                  <span className="font-semibold">CPU {cpu} run queue</span>
                  <Cells count={RQ_CELLS} filled={scene.rq / CELL_MS} color="#b45309" />
                  <span className={`text-right font-semibold ${scene.state === "내려옴" ? "text-[#dc2626]" : ""}`}>{scene.state}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs">{active === SCENES.length - 1 ? "run queue 몫은 위의 합에 포함" : `run queue마다 남은 시간 ${scene.rq}ms`} · 스레드마다 남은 일 {scene.work}ms</p>
          </div>
        );
      }}
    />
  );
}
