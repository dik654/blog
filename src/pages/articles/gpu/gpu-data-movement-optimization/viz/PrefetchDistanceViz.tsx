import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prefetching — 거리 d = S−1, ⌈L/C⌉ = ⌈1.2/0.8⌉ = 2. L·C는 #overlap 절의 예시값.
 * d=0: 간격 2.0 µs(순차). d=1: load k = 1.2k, compute k = 1.2(k+1), 간격 1.2 µs.
 * d=2: 간격 0.8 µs. 요청끼리 겹쳐 진행된다고 가정.
 */
const L = 1.2;
const C = 0.8;
const HORIZON = 6;
const ROWS = 6;

interface TileSpan { load: number; compute: number }

const timing = (distance: number, k: number): TileSpan => {
  if (distance === 0) return { load: (L + C) * k, compute: (L + C) * k + L };
  if (distance === 1) return { load: L * k, compute: L * (k + 1) };
  return { load: k < 2 ? 0 : L + C * (k - 2), compute: L + C * k };
};

const DONE: readonly number[] = [0, 1, 2].map(
  (distance) => Array.from({ length: ROWS }, (_, k) => timing(distance, k)).filter((span) => span.compute + C <= HORIZON).length,
);

const SCENES = [
  { label: "거리 0 · stage 1", summary: "tile 간격 2.0 µs", note: "필요할 때 요청하면 load가 끝날 때까지 계산이 멈춥니다. Load와 계산이 차례로 놓여 숨기는 것이 없습니다." },
  { label: "거리 1 · stage 2", summary: "tile 간격 1.2 µs", note: "다음 tile을 계산 전에 요청하면 load가 계산과 겹칩니다. 다만 계산 0.8 µs 안에 load 1.2 µs가 끝나지 않아 tile마다 계산이 0.4 µs씩 기다립니다." },
  { label: "거리 2 · stage 3", summary: "⌈1.2 / 0.8⌉ = 2 → 간격 0.8 µs", note: "1.2 / 0.8 = 1.5를 올림한 ⌈L/C⌉ = 2 이상으로 거리를 잡으면 첫 tile의 1.2 µs 뒤로는 tile이 계산 전에 도착해 있어 계산의 기다림이 사라집니다. 회색 점선은 도착한 tile이 칸에서 차례를 기다리는 시간입니다. 대신 stage가 하나 늘어 tile 한 벌의 shared memory를 더 씁니다." },
] as const;

const X0 = 42;
const PX = (340 - X0 - 4) / HORIZON;
const ROW_H = 22;
const Y0 = 6;

function Bar({ start, length, y, kind }: { start: number; length: number; y: number; kind: "load" | "compute" }) {
  if (start >= HORIZON) return null;
  const end = Math.min(start + length, HORIZON);
  return (
    <rect
      x={X0 + start * PX}
      y={y}
      width={(end - start) * PX}
      height={ROW_H - 6}
      rx={2}
      fill={kind === "load" ? "#d97706" : "#2563eb"}
      fillOpacity={kind === "load" ? 0.3 : 0.9}
      stroke={kind === "load" ? "#d97706" : "#2563eb"}
      strokeWidth={1}
      strokeDasharray={kind === "load" ? "4 2" : undefined}
    />
  );
}

export default function PrefetchDistanceViz() {
  return (
    <SceneShell
      eyebrow="Prefetch 거리"
      title="몇 tile 앞서 요청하느냐가 계산의 기다림을 정합니다"
      description="가로줄 하나가 tile 하나입니다. 점선 상자는 load, 진한 상자는 계산입니다. Stage는 도착한 tile을 받아 두는 shared memory 칸입니다. 뒤의 overlap 절에서 쓰는 load L = 1.2 µs, 계산 C = 0.8 µs를 빌렸고, load 요청끼리는 겹쳐 진행된다고 놓았습니다(가정)."
      ariaLabel="prefetch 거리 0, 1, 2에서 tile별 load와 계산의 시간 배치 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 340 158" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 2, 4, 6].map((tick) => (
              <g key={tick}>
                <line x1={X0 + tick * PX} x2={X0 + tick * PX} y1={Y0} y2={Y0 + ROWS * ROW_H} stroke="#94a3b8" strokeOpacity={0.35} strokeWidth={1} />
                <text x={X0 + tick * PX} y={Y0 + ROWS * ROW_H + 14} textAnchor={tick === 6 ? "end" : "middle"} fontSize={11} fill="#64748b">{`${tick} µs`}</text>
              </g>
            ))}
            {Array.from({ length: ROWS }, (_, k) => {
              const span = timing(active, k);
              const y = Y0 + k * ROW_H + 3;
              const waits = span.compute - (span.load + L);
              const previousEnd = k > 0 ? timing(active, k - 1).compute + C : span.compute;
              return (
                <g key={k}>
                  <text x={X0 - 6} y={y + 12} textAnchor="end" fontSize={11} fill="#64748b">{`tile ${k}`}</text>
                  <Bar start={span.load} length={L} y={y} kind="load" />
                  {waits > 0.01 && span.load + L < HORIZON && (
                    <line x1={X0 + (span.load + L) * PX} x2={X0 + Math.min(span.compute, HORIZON) * PX} y1={y + 8} y2={y + 8} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
                  )}
                  <Bar start={span.compute} length={C} y={y} kind="compute" />
                  {span.compute - previousEnd > 0.01 && previousEnd < HORIZON && (
                    <line x1={X0 + previousEnd * PX} x2={X0 + Math.min(span.compute, HORIZON) * PX} y1={y + 18} y2={y + 18} stroke="#dc2626" strokeWidth={1.25} />
                  )}
                </g>
              );
            })}
          </svg>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <svg width="20" height="6" aria-hidden="true"><line x1="0" x2="20" y1="3" y2="3" stroke="#dc2626" strokeWidth={1.25} /></svg>
              앞 계산이 끝나고 다음 계산이 기다린 시간
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="20" height="6" aria-hidden="true"><line x1="0" x2="20" y1="3" y2="3" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" /></svg>
              도착한 tile이 칸에서 기다린 시간
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Shared memory stage</span>
              {[0, 1, 2].map((slot) => (
                <span key={slot} className={`inline-block h-4 w-6 rounded-sm border ${slot <= active ? "border-blue-600 bg-blue-600/30" : "border-dashed border-border"}`} />
              ))}
              <span className="font-mono font-bold">{active + 1}벌</span>
            </span>
            <span className="font-mono font-bold">{`6 µs까지 끝난 계산 ${DONE[active]}개`}</span>
          </div>
        </div>
      )}
    />
  );
}
