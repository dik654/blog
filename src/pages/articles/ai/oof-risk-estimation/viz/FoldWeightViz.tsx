import SceneShell from "../../cross-validation/viz/CvSceneShell";

/**
 * 본문 대응: #why-weight — 20행 묶음(평균 손실 0.2)과 80행 묶음(0.4)(가정).
 * 묶음마다 1/2: 한 행 1/40 vs 1/160(4배) → 0.5×0.2 + 0.5×0.4 = 0.30.
 * 행마다 1/100: 묶음 몫 0.2와 0.8 → 0.2×0.2 + 0.8×0.4 = 0.36.
 */
type WeightScene = { label: string; summary: string; note: string; share: readonly number[]; row: readonly string[]; rowValue: readonly number[] };

const SCENES: readonly WeightScene[] = [
  {
    label: "묶음마다 절반",
    summary: "0.10 + 0.20 = 0.30",
    note: "두 묶음이 1/2씩 받으면 20행 묶음의 1/2은 20행에, 80행 묶음의 1/2은 80행에 나뉩니다. 첫 묶음의 한 행(1/40)이 뒤 묶음의 한 행(1/160)보다 4배 크게 반영됩니다.",
    share: [0.5, 0.5],
    row: ["1/40", "1/160"],
    rowValue: [1 / 40, 1 / 160],
  },
  {
    label: "행마다 1/100",
    summary: "0.04 + 0.32 = 0.36",
    note: "모든 행이 1/100을 받으면 20행 묶음의 몫은 0.2, 80행 묶음의 몫은 0.8입니다. 각 몫에 그 묶음의 평균 손실을 곱해 더하면 0.36입니다.",
    share: [0.2, 0.8],
    row: ["1/100", "1/100"],
    rowValue: [1 / 100, 1 / 100],
  },
];

const LOSS: readonly number[] = [0.2, 0.4];
const NAMES: readonly string[] = ["20행 묶음", "80행 묶음"];
const COLORS: readonly string[] = ["#2563eb", "#d97706"];
const ROW_MAX = 1 / 40;

const fmt = (value: number) => value.toFixed(2);

export default function FoldWeightViz() {
  return (
    <SceneShell
      eyebrow="무게 나누기"
      title="묶음 평균을 같은 무게로 세면 작은 묶음의 행이 커집니다"
      description="평균 손실 0.2인 20행 묶음과 0.4인 80행 묶음의 가정 사례입니다. 막대 전체가 평가 무게 1입니다."
      ariaLabel="묶음마다 같은 무게와 행마다 같은 무게에서 한 행의 무게와 전체 평균 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const contributions = scene.share.map((share, index) => share * LOSS[index]);
        return (
          <div className="min-w-0 space-y-5 text-xs sm:text-sm">
            <div>
              <p className="mb-1.5 font-semibold">묶음이 받는 무게</p>
              <div className="flex h-7 min-w-0 overflow-hidden rounded-sm border border-border">
                {scene.share.map((share, index) => (
                  <div
                    key={NAMES[index]}
                    className="flex h-full items-center justify-center font-mono font-bold text-white transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${share * 100}%`, backgroundColor: COLORS[index] }}
                  >
                    {share}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold">그 안의 한 행이 받는 무게</p>
              {scene.row.map((label, index) => (
                <div key={NAMES[index]} className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2">
                  <span className="text-muted-foreground">{NAMES[index]}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div
                      className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${(scene.rowValue[index] / ROW_MAX) * 100}%`, backgroundColor: COLORS[index] }}
                    />
                  </div>
                  <span className="text-right font-mono font-bold">{label}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold">무게 × 묶음 평균 손실</p>
              {contributions.map((value, index) => (
                <div key={NAMES[index]} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 font-mono">
                  <span className="font-sans text-muted-foreground">{NAMES[index]}</span>
                  <span>
                    {scene.share[index]} × {LOSS[index]} = {fmt(value)}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 border-t border-border pt-1.5 font-mono font-bold">
                <span className="font-sans">전체 평균</span>
                <span style={{ color: "#dc2626" }}>{fmt(contributions.reduce<number>((sum, value) => sum + value, 0))}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
