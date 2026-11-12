import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-stream — t_reuse(b) ≥ max_{o∈C(b)} t_done(o).
 * 본문 예: copy 2ms → kernel 5ms → D2H 1ms가 같은 dependency chain이면 output은 8ms 뒤에 재사용한다.
 * 4ms에 output을 읽는 시점은 race를 보이려는 가정이다.
 */
const OPS = [
  { name: "H2D copy", start: 0, end: 2, color: "#64748b" },
  { name: "kernel", start: 2, end: 7, color: "#2563eb" },
  { name: "D2H", start: 7, end: 8, color: "#7c3aed" },
] as const;

const DONE = OPS[OPS.length - 1].end;
const EARLY_READ = 4;

const X0 = 74;
const XW = 270;
const MAX_MS = 10;
const xOf = (ms: number) => X0 + (ms / MAX_MS) * XW;

const BAD = "#dc2626";
const GOOD = "#16a34a";
const MUTED = "#94a3b8";
const INK = "#64748b";

const SCENES = [
  {
    label: "제출하면 host는 곧바로 돌아옵니다",
    summary: "반환 0ms · 완료 8ms",
    note: "Async 호출은 stream에 작업을 넣고 바로 반환합니다. 반환 시각은 0ms 근처지만 GPU는 그때부터 copy 2ms, kernel 5ms, D2H 1ms를 차례로 진행합니다. 반환은 완료가 아닙니다.",
  },
  {
    label: "완료 전에 output을 건드리면",
    summary: "4ms에 읽기 → race",
    note: "4ms에 output을 읽는다고 해 봅시다(가정). D2H가 아직 시작하지 않아 output은 채워지지 않았습니다. 덮어쓰거나 해제해도 마찬가지입니다. 빨간 구간 전체가 손대면 안 되는 시간입니다. Input도 그것을 읽는 작업이 끝나기 전에 덮으면 같은 race가 생깁니다.",
  },
  {
    label: "완료를 관측한 뒤에만",
    summary: "event·sync로 8ms 확인 → 재사용",
    note: "Event나 stream synchronize가 마지막 D2H 완료(8ms)를 관측한 뒤에야 output을 읽고 덮고 해제할 수 있습니다. 같은 buffer를 쓰는 작업 가운데 가장 늦게 끝나는 것이 기준입니다.",
  },
] as const;

export default function AsyncLifetimeViz() {
  return (
    <SceneShell
      eyebrow="반환과 완료 사이"
      title="Async 함수가 반환해도 GPU는 아직 buffer를 쓰고 있습니다"
      description="가로축은 제출 뒤 흐른 시간(ms)입니다. H2D는 host 메모리에서 GPU로, D2H는 GPU에서 host로 가는 복사입니다. Stream은 GPU에 넣은 작업이 넣은 순서대로 실행되는 줄이고, event·synchronize는 그 줄의 작업이 끝났음을 host가 확인하는 수단입니다."
      ariaLabel="async 제출 뒤 host 반환, stream 작업, output buffer 재사용 가능 시점"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 150" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`} className="mx-auto h-auto w-full max-w-[560px]">
          <text x={8} y={30} fontSize={10} fontWeight={700} fill={INK}>host</text>
          <text x={8} y={66} fontSize={10} fontWeight={700} fill={INK}>stream</text>
          <text x={8} y={102} fontSize={10} fontWeight={700} fill={INK}>output</text>
          <text x={8} y={112} fontSize={9} fill={MUTED}>buffer</text>

          <line x1={X0} y1={26} x2={xOf(MAX_MS)} y2={26} stroke={MUTED} strokeWidth={1} />
          <circle cx={xOf(0)} cy={26} r={3.5} fill={INK} />
          <text x={xOf(0) + 6} y={20} fontSize={9.5} fill={INK}>제출·반환</text>

          {OPS.map((op) => (
            <g key={op.name}>
              <rect x={xOf(op.start)} y={54} width={xOf(op.end) - xOf(op.start)} height={18} rx={3} fill={op.color} fillOpacity={0.85} />
              <text x={(xOf(op.start) + xOf(op.end)) / 2} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">
                {op.end - op.start >= 2 ? op.name : "D2H"}
              </text>
            </g>
          ))}

          {active >= 1 && (
            <rect x={xOf(0)} y={92} width={xOf(DONE) - xOf(0)} height={14} rx={2} fill={BAD} fillOpacity={0.18} stroke={BAD} strokeWidth={1} />
          )}
          {active >= 1 && (
            <text x={xOf(0) + 4} y={102} fontSize={9} fill={BAD}>읽기·덮기·해제 금지</text>
          )}
          {active === 1 && (
            <g>
              <line x1={xOf(EARLY_READ)} y1={26} x2={xOf(EARLY_READ)} y2={106} stroke={BAD} strokeWidth={1.25} strokeDasharray="3 2" />
              <circle cx={xOf(EARLY_READ)} cy={26} r={3.5} fill={BAD} />
              <text x={xOf(EARLY_READ) + 5} y={20} fontSize={9.5} fontWeight={700} fill={BAD}>output 읽기 (가정) → race</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <line x1={xOf(DONE)} y1={26} x2={xOf(DONE)} y2={106} stroke={GOOD} strokeWidth={1.25} />
              <circle cx={xOf(DONE)} cy={26} r={3.5} fill={GOOD} />
              <text x={xOf(DONE) - 4} y={20} textAnchor="end" fontSize={9.5} fontWeight={700} fill={GOOD}>event·sync가 완료 관측</text>
              <rect x={xOf(DONE)} y={92} width={xOf(MAX_MS) - xOf(DONE)} height={14} rx={2} fill={GOOD} fillOpacity={0.18} stroke={GOOD} strokeWidth={1} />
              <text x={xOf(DONE) + 3} y={102} fontSize={9} fill={GOOD}>재사용</text>
            </g>
          )}

          <line x1={X0} y1={124} x2={xOf(MAX_MS)} y2={124} stroke={MUTED} strokeWidth={1} />
          {[0, 2, 4, 6, 8, 10].map((ms) => (
            <g key={ms}>
              <line x1={xOf(ms)} y1={124} x2={xOf(ms)} y2={128} stroke={MUTED} strokeWidth={1} />
              <text x={xOf(ms)} y={138} textAnchor="middle" fontSize={9.5} fill={MUTED}>{ms}</text>
            </g>
          ))}
          <text x={xOf(MAX_MS)} y={148} textAnchor="end" fontSize={9} fill={MUTED}>ms</text>
        </svg>
      )}
    />
  );
}
