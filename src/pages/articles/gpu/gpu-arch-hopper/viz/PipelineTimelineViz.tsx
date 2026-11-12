import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tma — T_stage = max(T_copy, T_compute), T_pipe ≈ T_fill + (L−1)T_stage + T_drain.
 * 본문 예: copy 3µs, compute 5µs. 그림은 L = 4 tiles와 shared buffer 2개를 가정한다.
 * 겹침 없음: 4 × (3 + 5) = 32µs.
 * 두 buffer 겹침: copy 0–3(b0), 3–6(b1), 8–11(b0), 13–16(b1) / compute 3–8, 8–13, 13–18, 18–23 → 23µs.
 * tile 3의 copy는 buffer 0을 읽는 tile 1 compute가 8µs에 끝날 때까지 기다린다(6µs에 시작하면 덮어씀).
 */
const COPY = 3;
const COMPUTE = 5;
const TILES = 4;

type Bar = { tile: number; start: number; end: number; buffer: 0 | 1 };

const SERIAL_COPY: Bar[] = Array.from({ length: TILES }, (_, i) => ({ tile: i + 1, start: i * (COPY + COMPUTE), end: i * (COPY + COMPUTE) + COPY, buffer: 0 }));
const SERIAL_COMPUTE: Bar[] = SERIAL_COPY.map((bar) => ({ ...bar, start: bar.end, end: bar.end + COMPUTE }));

const OVERLAP_COPY: Bar[] = [
  { tile: 1, start: 0, end: 3, buffer: 0 },
  { tile: 2, start: 3, end: 6, buffer: 1 },
  { tile: 3, start: 8, end: 11, buffer: 0 },
  { tile: 4, start: 13, end: 16, buffer: 1 },
];
const OVERLAP_COMPUTE: Bar[] = [
  { tile: 1, start: 3, end: 8, buffer: 0 },
  { tile: 2, start: 8, end: 13, buffer: 1 },
  { tile: 3, start: 13, end: 18, buffer: 0 },
  { tile: 4, start: 18, end: 23, buffer: 1 },
];

const SCENES = [
  { label: "겹치지 않으면", summary: "4 × (3 + 5) = 32µs", mode: "serial", note: "한 tile을 다 옮긴 뒤 계산하고, 계산이 끝나야 다음 tile을 옮기면 매 tile마다 3µs와 5µs를 더합니다. 겹침이 막힌 경우가 이 합에 가깝습니다." },
  { label: "두 buffer로 겹치면", summary: "3 + 3 × 5 + 5 = 23µs", mode: "overlap", note: "tile 1을 계산하는 동안 다른 buffer에 tile 2를 옮깁니다. 첫 copy 3µs가 지나면 compute가 쉬지 않고 5µs마다 tile 하나를 끝냅니다. 느린 compute가 간격을 정하므로 3µs copy는 그 밑에 숨습니다. 처음 채우기(fill, 첫 copy 3µs)와 마지막 비우기(drain, 마지막 compute 5µs)가 남아 4 × 5 = 20µs보다 깁니다." },
  { label: "덮어쓰기를 막는 기다림", summary: "tile 3 copy는 8µs까지 대기", mode: "hazard", note: "tile 3은 tile 1과 같은 buffer 0을 씁니다. tile 2의 copy가 6µs에 끝났다고 바로 시작하면 아직 tile 1을 읽고 있는 buffer 0을 덮어씁니다. barrier phase로 tile 1 계산이 끝났음을 확인한 8µs에 시작합니다. compute가 더 느려서 이 기다림이 전체 시간을 늘리지는 않습니다." },
] as const;

const W = 360;
const H = 168;
const LEFT = 68;
const RIGHT = 350;
const MAX_T = 32;
const COPY_Y = 34;
const COMPUTE_Y = 82;
const BAR_H = 30;
const AXIS_Y = 128;
const tx = (t: number) => LEFT + (t / MAX_T) * (RIGHT - LEFT);
const fill = (buffer: 0 | 1) => (buffer === 0 ? "#2563eb" : "#0d9488");
const ticks = [0, 8, 16, 23, 32];
/** 두 buffer 경우를 식의 세 항으로 나눈 구간(가정): 첫 copy, 3번의 5µs 간격, 마지막 compute. */
const SPANS = [
  { from: 0, to: 3, label: "fill 3" },
  { from: 3, to: 18, label: "(4−1) × 5 = 15" },
  { from: 18, to: 23, label: "drain 5" },
] as const;

function Bars({ bars, y, dim, mono }: { bars: Bar[]; y: number; dim?: number; mono: boolean }) {
  return (
    <>
      {bars.map((bar) => (
        <g key={`${y}-${bar.tile}`} opacity={dim === undefined || dim === bar.tile ? 1 : 0.35}>
          <rect x={tx(bar.start)} y={y} width={tx(bar.end) - tx(bar.start) - 1} height={BAR_H} rx={3} fill={mono ? "#64748b" : fill(bar.buffer)} />
          <text x={(tx(bar.start) + tx(bar.end)) / 2} y={y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{`t${bar.tile}`}</text>
        </g>
      ))}
    </>
  );
}

export default function PipelineTimelineViz() {
  return (
    <SceneShell
      eyebrow="Copy와 compute 겹치기"
      title="느린 단계가 간격을 정하고, 처음과 끝은 따로 남습니다"
      description="가로축은 시간(µs)입니다. 위 줄은 TMA가 tile을 shared memory로 옮기는 copy, 아래 줄은 warpgroup이 그 tile을 계산하는 compute입니다. copy 3µs·compute 5µs는 본문 예이고, tile 4개(t1–t4)와 buffer 2개는 그림을 위한 가정입니다."
      note={
        <>
          색은 tile이 놓인 shared buffer입니다. <span className="font-semibold text-[#2563eb]">파랑</span> = buffer 0, <span className="font-semibold text-[#0d9488]">청록</span> = buffer 1, 회색 = 겹침 없는 경우.
        </>
      }
      ariaLabel="tile 네 개의 copy와 compute를 겹치지 않으면 32마이크로초, 두 buffer로 겹치면 23마이크로초가 걸리는 시간표"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const serial = scene.mode === "serial";
        const hazard = scene.mode === "hazard";
        const end = serial ? 32 : 23;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT - 8} y={COPY_Y + 19} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">copy</text>
            <text x={LEFT - 8} y={COMPUTE_Y + 19} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">compute</text>
            <Bars bars={serial ? SERIAL_COPY : OVERLAP_COPY} y={COPY_Y} mono={serial} dim={hazard ? 3 : undefined} />
            <Bars bars={serial ? SERIAL_COMPUTE : OVERLAP_COMPUTE} y={COMPUTE_Y} mono={serial} dim={hazard ? 1 : undefined} />
            {hazard && (
              <g>
                <rect x={tx(6)} y={COPY_Y - 1} width={tx(9) - tx(6)} height={BAR_H + 2} rx={3} fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={tx(7.6)} y={COPY_Y - 6} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">6µs 시작 ✗</text>
                <line x1={tx(8)} x2={tx(8)} y1={COPY_Y - 4} y2={COMPUTE_Y + BAR_H + 4} stroke="#dc2626" strokeWidth={1} />
                <text x={tx(8.4)} y={COPY_Y - 6} textAnchor="start" fontSize={12} fontWeight={700} fill="#2563eb">8µs 시작 ✓</text>
              </g>
            )}
            {!serial && !hazard && (
              <g fontSize={11} fill="#475569">
                {SPANS.map((span) => (
                  <g key={span.label}>
                    <line x1={tx(span.from) + 1} x2={tx(span.to) - 1} y1={COMPUTE_Y + BAR_H + 6} y2={COMPUTE_Y + BAR_H + 6} stroke="#475569" strokeWidth={1} />
                    <text x={(tx(span.from) + tx(span.to)) / 2} y={COMPUTE_Y + BAR_H + 18} textAnchor="middle">{span.label}</text>
                  </g>
                ))}
              </g>
            )}
            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y + 8} y2={AXIS_Y + 8} stroke="#94a3b8" strokeWidth={1} />
            {ticks.map((t) => (
              <g key={t}>
                <line x1={tx(t)} x2={tx(t)} y1={AXIS_Y + 4} y2={AXIS_Y + 12} stroke="#94a3b8" strokeWidth={1} />
                <text x={tx(t)} y={AXIS_Y + 26} textAnchor="middle" fontSize={12} fontWeight={t === end ? 700 : 400} fill={t === end ? "#0f766e" : "#64748b"}>{t}</text>
              </g>
            ))}
            <line x1={tx(end)} x2={tx(end)} y1={COPY_Y - 2} y2={AXIS_Y + 8} stroke="#0f766e" strokeWidth={1} strokeDasharray="3 3" />
          </svg>
        );
      }}
    />
  );
}
