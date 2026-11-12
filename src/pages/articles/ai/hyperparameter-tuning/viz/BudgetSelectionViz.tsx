import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case, #selection-contract — A·B·C 각 10 GPU분, 예산 30.
 * 누적 10 → 20 → 30, 같은 비용의 넷째 후보를 더하면 40으로 예산을 넘는다.
 * 선택용 손실 0.24·0.20·0.22 중 최소 B, 별도 독립 평가 0.23은 따로 남긴다. (모두 본문의 가정)
 */
const COST = 10;
const BUDGET = 30;
const AXIS_MAX = 40;

const CANDIDATES = [
  { name: "A", loss: 0.24 },
  { name: "B", loss: 0.2 },
  { name: "C", loss: 0.22 },
  { name: "넷째", loss: null },
] as const;

const SCENES = [
  { label: "A를 실행합니다", summary: "누적 10 / 예산 30", runs: 1, note: "후보 하나를 2,000번 갱신하는 데 10 GPU분이 듭니다. 예산과 비교하는 값은 이 한 건의 비용이 아니라 지금까지 쓴 비용의 합입니다." },
  { label: "B·C까지 실행합니다", summary: "10 + 10 + 10 = 30", runs: 3, note: "세 실행을 더하면 30 GPU분으로 예산을 다 썼습니다. 실패한 실행이 자원을 썼다면 그 비용도 이 막대에 더해집니다." },
  { label: "같은 비용의 넷째 후보를 더하면", summary: "누적 40 > 예산 30", runs: 4, note: "넷째 후보 한 건의 비용 10도 30보다 작습니다. 그래도 합은 40이 되어 예산선을 넘습니다. 후보별 검사만으로는 전체 예산을 지킬 수 없는 이유입니다." },
  { label: "B를 고르고 따로 평가합니다", summary: "선택 0.20 · 독립 평가 0.23", runs: 3, note: "예산 안에서 유효한 점수를 얻은 A·B·C 가운데 선택용 손실(작을수록 좋음)이 가장 작은 B를 고릅니다. 시험하지 않은 설정까지 포함한 최선이라는 증명은 아닙니다. 고정한 B 절차를 선택에 쓰지 않은 자료로 평가한 0.23을 0.20과 함께 남깁니다." },
] as const;

const W = 360;
const LEFT = 16;
const RIGHT = 16;
const BAR_Y = 26;
const BAR_H = 26;
const x = (value: number) => LEFT + (value / AXIS_MAX) * (W - LEFT - RIGHT);
const FILL = ["#2563eb", "#3b82f6", "#60a5fa", "#dc2626"] as const;

export default function BudgetSelectionViz() {
  return (
    <SceneShell
      eyebrow="누적 비용과 선택"
      title="후보 비용을 쌓아 예산과 비교하고 B를 고릅니다"
      description="위 막대 한 칸이 후보 한 건의 비용 10 GPU분입니다. 아래 줄은 각 후보의 선택용 손실이고, 넷째 후보는 비용만 가정합니다. 비용·손실·평가값은 모두 본문의 가정입니다."
      ariaLabel="A, B, C 후보의 누적 비용을 예산 30과 비교하고 선택용 손실로 B를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = scene.runs * COST;
        const selecting = active === 3;
        return (
          <div className="min-w-0">
            <p className={`text-sm font-bold ${total > BUDGET ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
              {`누적 ${total} GPU분${total > BUDGET ? " · 예산 30 초과" : " · 예산 30 이내"}`}
            </p>
            <svg viewBox={`0 0 ${W} 86`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`누적 ${total} GPU분, 예산 ${BUDGET} GPU분`}>
              <rect x={x(0)} y={BAR_Y} width={x(AXIS_MAX) - x(0)} height={BAR_H} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={1} />
              {CANDIDATES.map((candidate, index) => {
                const shown = index < scene.runs;
                return (
                  <g key={candidate.name} opacity={shown ? 1 : 0}>
                    <rect x={x(index * COST) + 0.5} y={BAR_Y + 0.5} width={x(COST) - x(0) - 1} height={BAR_H - 1} rx={2} fill={FILL[index]} opacity={index === 3 ? 0.85 : 0.9} />
                    <text x={x(index * COST + COST / 2)} y={BAR_Y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">
                      {candidate.name}
                    </text>
                  </g>
                );
              })}
              <line x1={x(BUDGET)} x2={x(BUDGET)} y1={BAR_Y - 10} y2={BAR_Y + BAR_H + 8} stroke="#0f172a" strokeWidth={1.25} strokeDasharray="3 2" className="dark:stroke-slate-200" />
              <text x={x(BUDGET)} y={BAR_Y - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">
                예산 30
              </text>
              {[0, 10, 20, 30, 40].map((tick) => (
                <text key={tick} x={x(tick)} y={BAR_Y + BAR_H + 20} textAnchor="middle" fontSize={12} fill="#64748b">
                  {tick}
                </text>
              ))}
            </svg>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {CANDIDATES.map((candidate, index) => {
                const shown = index < scene.runs;
                const chosen = selecting && candidate.name === "B";
                const fourth = index === 3;
                return (
                  <div
                    key={candidate.name}
                    className={`rounded-lg border px-1 py-2 text-center text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
                      chosen ? "border-primary bg-primary/10" : fourth ? "border-dashed border-red-600" : "border-border"
                    } ${shown ? "opacity-100" : "opacity-25"}`}
                  >
                    <span className="block font-semibold">{fourth ? "넷째 (가정)" : `후보 ${candidate.name}`}</span>
                    <span className={`block font-mono ${chosen ? "font-bold text-primary" : "text-muted-foreground"}`}>
                      {candidate.loss === null ? "비용 10" : shown ? candidate.loss.toFixed(2) : "미실행"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={`mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center text-xs transition-opacity duration-300 motion-reduce:transition-none ${selecting ? "opacity-100" : "opacity-25"}`}>
              <div className="rounded-lg border border-border px-2 py-2">
                <span className="block text-muted-foreground">선택할 때 본 값</span>
                <strong className="font-mono">B 0.20</strong>
              </div>
              <span className="text-muted-foreground">함께 기록</span>
              <div className="rounded-lg border border-primary px-2 py-2">
                <span className="block text-muted-foreground">닫아 둔 자료의 독립 평가</span>
                <strong className="font-mono text-primary">B 0.23</strong>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
