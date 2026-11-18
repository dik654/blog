import SceneShell from "./SceneShell";

/**
 * 본문 대응: #experiment 07 · Crash·reorg — "Execution 전후와 publish 전 경계에서 process를 중지".
 * 경로 순서는 #ownership 표: 부모 state view → block executor(임시 state·receipt) → post-execution 판정 → canonical state.
 * 기각 조건(#decision)의 "partial state 노출"과 복구 조건(#recovery)의 parent view·canonical head·fixture 일치를 그대로 쓴다.
 */
const W = 360;
const H = 118;
const BOX_W = 72;
const BOX_H = 48;
const BOX_Y = 34;
const GAP = (W - 16 - 4 * BOX_W) / 3;
const boxX = (index: number) => 8 + index * (BOX_W + GAP);
/** 중지 지점 ①②③: 실행 전(0과 1 사이), 실행 후(1과 2 사이), publish 전(2와 3 사이) */
const stopX = (index: number) => boxX(index) + BOX_W + GAP / 2;

const ACCENT = "#2563eb";
const STOP = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const STAGES = [
  { title: "부모 상태", writer: "snapshot" },
  { title: "실행", writer: "executor·revm" },
  { title: "사후 검증", writer: "consensus" },
  { title: "canonical", writer: "chain update" },
] as const;

const SCENES = [
  { label: "블록 하나가 지나는 길", summary: "부모 → 실행 → 사후 검증 → canonical", note: "상태 소유권 표의 순서입니다. 고정한 부모 상태를 읽어 실행기가 임시 state와 receipt를 만들고, 사후 검증이 그 결과를 판정한 뒤, 검증을 통과한 chain update 경로만 canonical state(노드가 정본으로 삼는 상태)를 씁니다." },
  { label: "① 실행 전에 중지", summary: "임시 결과 없음", note: "실행을 시작하기 전에 process를 멈춥니다. 이 블록의 임시 결과는 아직 만들어지지 않았고 canonical state에도 반영되지 않았습니다." },
  { label: "② 실행 후에 중지", summary: "임시 결과 있음 · 판정 전", note: "실행은 끝나 BundleState와 receipt가 생겼지만 사후 검증을 받기 전에 멈춥니다. 이 결과는 아직 판정받지 않은 임시 결과입니다." },
  { label: "③ publish 전에 중지", summary: "판정 통과 · canonical 반영 전", note: "사후 검증은 통과했지만 canonical state를 갱신하기 직전에 멈춥니다. 세 지점 모두에서 이 블록은 아직 canonical에 쓰이지 않은 상태입니다." },
  { label: "재시작 뒤 대조", summary: "restart · unwind · 재실행을 base와 비교", note: "각 지점에서 재시작한 뒤 restart, ancestor unwind, re-execution 결과를 base와 대조합니다. parent view·canonical head·전체 fixture가 다시 일치해야 하고, partial state(부분 상태)가 한 번이라도 노출되면 기각 조건입니다." },
] as const;

const ROWS = [
  { label: "임시 결과", values: ["—", "아직 없음", "BundleState·receipt (판정 전)", "판정 통과", "재실행 결과를 base와 비교"] },
  { label: "canonical", values: ["—", "이 블록 미반영", "이 블록 미반영", "이 블록 미반영", "parent view·head·fixture 일치?"] },
] as const;

export default function CrashBoundaryViz() {
  return (
    <SceneShell
      eyebrow="07 · Crash·reorg 실험"
      title="process를 세 경계에서 멈춰 보고, 임시 결과가 정본으로 새지 않는지 봅니다"
      description="네 칸은 블록 하나가 거치는 상태 경로이고, 빨간 점선 ①②③은 process를 멈추는 지점입니다."
      note="중지 지점의 순서만 나타냅니다. 대상 환경의 crash·restart 결과는 아직 측정하지 않았습니다."
      ariaLabel="실행 전, 실행 후, publish 전 세 지점에서 process를 멈추고 재시작 결과를 대조하는 실험"
      scenes={SCENES}
      render={(active) => {
        const stop = active >= 1 && active <= 3 ? active - 1 : -1;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {STAGES.map((stage, index) => {
                const reached = stop === -1 ? active === 0 || active === 4 : index <= stop;
                return (
                  <g key={stage.title}>
                    <rect x={boxX(index)} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill="none" stroke={reached ? ACCENT : MUTED} strokeWidth={reached ? 1.25 : 1} strokeDasharray={reached ? undefined : "3 3"} />
                    <text x={boxX(index) + BOX_W / 2} y={BOX_Y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill={reached ? ACCENT : TEXT}>{stage.title}</text>
                    <text x={boxX(index) + BOX_W / 2} y={BOX_Y + 36} textAnchor="middle" fontSize={10} fill={TEXT}>{stage.writer}</text>
                    {index < 3 && (
                      <path d={`M ${boxX(index) + BOX_W + 2} ${BOX_Y + BOX_H / 2} L ${boxX(index + 1) - 3} ${BOX_Y + BOX_H / 2}`} stroke={MUTED} strokeWidth={1} markerEnd="url(#crash-arrow)" />
                    )}
                  </g>
                );
              })}
              <defs>
                <marker id="crash-arrow" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={6} markerHeight={6} orient="auto">
                  <path d="M0 0 L6 3 L0 6 z" fill={MUTED} />
                </marker>
              </defs>
              {[0, 1, 2].map((index) => {
                const on = stop === index || active === 4;
                return (
                  <g key={index} opacity={on ? 1 : 0.35}>
                    <line x1={stopX(index)} x2={stopX(index)} y1={18} y2={BOX_Y + BOX_H + 12} stroke={STOP} strokeWidth={1.25} strokeDasharray="3 2" />
                    <text x={stopX(index)} y={13} textAnchor="middle" fontSize={11} fontWeight={700} fill={STOP}>{["①", "②", "③"][index]}</text>
                  </g>
                );
              })}
              <text x={stopX(0)} y={H - 8} textAnchor="middle" fontSize={10} fill={TEXT}>실행 전</text>
              <text x={stopX(1)} y={H - 8} textAnchor="middle" fontSize={10} fill={TEXT}>실행 후</text>
              <text x={stopX(2)} y={H - 8} textAnchor="middle" fontSize={10} fill={TEXT}>publish 전</text>
            </svg>

            <div className="mt-3 grid grid-cols-[5rem_minmax(0,1fr)] gap-1 text-xs">
              {ROWS.map((row) => (
                <div key={row.label} className="contents">
                  <span className="self-center font-bold text-muted-foreground">{row.label}</span>
                  <span className={`min-h-9 rounded border px-2 py-2 leading-5 ${active === 0 ? "border-dashed border-border text-muted-foreground/50" : active === 4 ? "border-blue-600 font-bold" : "border-border font-bold"}`}>{row.values[active]}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
