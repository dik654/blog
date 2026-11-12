import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stage-pipeline — S ≥ ⌈L/C⌉ + 1 을 시간축 위에서 센다.
 * 설명용 가정 L = 1.2 µs, C = 0.3 µs. 미리 내면 tile k 의 load 는 [0.3k, 0.3k + 1.2], 계산은 [1.2 + 0.3k, 1.5 + 0.3k].
 * t = 1.35 (tile 0 계산 중)에 load 중인 tile 은 1·2·3·4 의 4개 → 4 + 1 = 5 stage, 5 × 32 KB = 160 KB.
 * Shared memory 상한 227 KB → 32 KB stage 최대 7개(224 KB).
 */
const L = 1.2;
const CT = 0.3;
const T_MAX = 3.0;
const X0 = 52;
const XW = 296;
const tx = (t: number) => X0 + (t / T_MAX) * XW;
const ROW_Y = 30;
const ROW_H = 17;
const BAR_H = 11;
const TILES = [0, 1, 2, 3, 4, 5] as const;
const NOW = 1.35;
const TC_Y = ROW_Y + TILES.length * ROW_H + 6;
const AXIS_Y = TC_Y + 20;
const SMEM_Y = AXIS_Y + 34;
const SMEM_MAX = 227;
const SMEM_W = XW;

interface Bar {
  tile: number;
  start: number;
  end: number;
  kind: "load" | "compute";
}

const SERIAL: readonly Bar[] = [
  { tile: 0, start: 0, end: L, kind: "load" },
  { tile: 0, start: L, end: L + CT, kind: "compute" },
  { tile: 1, start: L + CT, end: 2 * L + CT, kind: "load" },
  { tile: 1, start: 2 * L + CT, end: 2 * (L + CT), kind: "compute" },
];

const PIPELINED: readonly Bar[] = TILES.flatMap((k) => [
  { tile: k, start: CT * k, end: CT * k + L, kind: "load" as const },
  { tile: k, start: L + CT * k, end: L + CT * (k + 1), kind: "compute" as const },
]);

const SCENES = [
  { label: "한 warp 가 혼자 하면", summary: "tile 당 1.5 µs, 계산은 0.3 µs", note: "Load 1.2 µs 를 기다린 뒤 0.3 µs 계산하고, 다시 다음 load 를 기다립니다. Tensor 줄(Tensor Core 가 계산하는 시간)은 1.5 µs 중 0.3 µs 만 칠해집니다." },
  { label: "0.3 µs 마다 미리 냄", summary: "1.2 µs 뒤부터 계산이 쉬지 않음", note: "계산 한 번(0.3 µs)마다 새 tile 의 load 를 하나씩 내 두면, 첫 tile 이 도착한 1.2 µs 뒤부터는 tile 이 0.3 µs 마다 도착해 Tensor 줄이 끊기지 않습니다." },
  { label: "어느 순간을 잘라 세면", summary: "load 중 4 + 계산 중 1 = 5 stage", note: "Tile 0 을 계산하는 순간 tile 1·2·3·4 의 load 가 날아가는 중입니다. 1.2 ÷ 0.3 = 4개가 날아가는 중이고, 읽고 있는 tile 0 의 자리는 덮어쓸 수 없으니 하나를 더해 5칸이 필요합니다." },
  { label: "Shared memory 로", summary: "5 × 32 KB = 160 KB", note: "Stage 마다 A 16 KB + B 16 KB 이므로 160 KB 입니다. H100 의 threadblock 당 227 KB 안에는 32 KB stage 가 최대 7개 들어가며, epilogue 와 barrier 몫을 빼면 그보다 적습니다." },
] as const;

const C = { load: "#0284c7", compute: "#d97706", now: "#dc2626", base: "#64748b" } as const;

export default function StageTimelineViz() {
  return (
    <SceneShell
      eyebrow="Stage 수 세기"
      title="계산 한 번마다 load 를 미리 내면 계산 중인 순간에 5개 tile 이 stage 를 차지합니다"
      description="가로축은 시간(µs), 줄 하나가 tile 하나입니다. Load 1.2 µs 와 계산 0.3 µs 는 첫 절의 설명용 가정이며 측정값이 아닙니다. Stage 는 tile 한 벌을 담는 shared memory 칸입니다."
      ariaLabel="Load 1.2 마이크로초와 계산 0.3 마이크로초로 필요한 stage 수를 세는 시간표"
      scenes={SCENES}
      render={(active) => {
        const bars = active === 0 ? SERIAL : PIPELINED;
        const showNow = active >= 2;
        const inFlight = (bar: Bar) => bar.start < NOW && bar.end > NOW;
        const computeBars = bars.filter((bar) => bar.kind === "compute");
        return (
          <svg viewBox="0 0 360 248" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={X0} y={6} width={14} height={9} fill={`${C.load}40`} stroke={C.load} strokeWidth={1} />
            <text x={X0 + 19} y={14} fontSize={10.5} fill="currentColor">load 1.2 µs</text>
            <rect x={X0 + 104} y={6} width={14} height={9} fill={C.compute} />
            <text x={X0 + 123} y={14} fontSize={10.5} fill="currentColor">계산 0.3 µs</text>

            {TILES.map((k) => (
              <text key={k} x={X0 - 6} y={ROW_Y + k * ROW_H + BAR_H - 2} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.75}>
                tile {k}
              </text>
            ))}
            {bars.map((bar) => {
              const lit = !showNow || inFlight(bar);
              return (
                <rect
                  key={`${bar.tile}-${bar.kind}`}
                  x={tx(bar.start)}
                  y={ROW_Y + bar.tile * ROW_H}
                  width={tx(bar.end) - tx(bar.start)}
                  height={BAR_H}
                  fill={bar.kind === "load" ? `${C.load}40` : C.compute}
                  stroke={bar.kind === "load" ? C.load : C.compute}
                  strokeWidth={1}
                  opacity={lit ? 1 : 0.25}
                />
              );
            })}

            <text x={X0 - 6} y={TC_Y + BAR_H - 2} textAnchor="end" fontSize={10.5} fontWeight={700} fill="currentColor">Tensor</text>
            <rect x={X0} y={TC_Y} width={XW} height={BAR_H} fill="none" stroke={C.base} strokeWidth={1} strokeDasharray="2 2" />
            {computeBars.map((bar) => (
              <rect key={`tc-${bar.tile}`} x={tx(bar.start)} y={TC_Y} width={tx(bar.end) - tx(bar.start)} height={BAR_H} fill={C.compute} opacity={showNow ? 0.35 : 1} />
            ))}

            <line x1={X0} y1={AXIS_Y} x2={X0 + XW} y2={AXIS_Y} stroke={C.base} strokeWidth={1} />
            {[0, 0.6, 1.2, 1.8, 2.4, 3.0].map((t) => (
              <g key={t}>
                <line x1={tx(t)} y1={AXIS_Y} x2={tx(t)} y2={AXIS_Y + 4} stroke={C.base} strokeWidth={1} />
                <text x={tx(t)} y={AXIS_Y + 14} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>{t.toFixed(1)}</text>
              </g>
            ))}

            {showNow ? (
              <>
                <line x1={tx(NOW)} y1={ROW_Y - 4} x2={tx(NOW)} y2={TC_Y + BAR_H + 2} stroke={C.now} strokeWidth={1.25} />
                <text x={tx(NOW) - 5} y={ROW_Y + 5 * ROW_H + BAR_H - 2} textAnchor="end" fontSize={10.5} fontWeight={700} fill={C.now}>지금: 5칸 사용</text>
              </>
            ) : null}

            <g opacity={active === 3 ? 1 : 0.15}>
              <text x={X0 - 6} y={SMEM_Y + 11} textAnchor="end" fontSize={10.5} fontWeight={700} fill="currentColor">smem</text>
              <rect x={X0} y={SMEM_Y} width={SMEM_W} height={15} fill="none" stroke={C.base} strokeWidth={1} />
              {Array.from({ length: 7 }, (_, i) => (
                <rect
                  key={i}
                  x={X0 + (i * 32 * SMEM_W) / SMEM_MAX + 0.5}
                  y={SMEM_Y + 0.5}
                  width={(32 * SMEM_W) / SMEM_MAX - 1}
                  height={14}
                  fill={i < 5 ? `${C.load}55` : "none"}
                  stroke={C.load}
                  strokeWidth={1}
                  strokeDasharray={i < 5 ? undefined : "2 2"}
                />
              ))}
              <text x={X0} y={SMEM_Y + 29} fontSize={10.5} fill="currentColor">5 × 32 = 160 KB 사용</text>
              <text x={X0 + SMEM_W} y={SMEM_Y + 29} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.75}>점선까지 7칸 · 상한 227 KB</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
