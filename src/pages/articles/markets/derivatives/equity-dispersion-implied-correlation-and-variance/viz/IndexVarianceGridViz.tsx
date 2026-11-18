import SceneShell from "./SceneShell";
import { VarianceGrid, VarianceTotalBar } from "./VarianceGrid";

/**
 * 본문 대응: #case — 비중 0.5·변동성 0.2인 두 종목(가정).
 * 대각 칸 = 0.5²×0.2² = 0.01, 두 칸 합 0.02 → √0.02 ≈ 14.14%.
 * 상관 0.5면 엇갈린 칸 = 0.5×0.5×0.2×0.2×0.5 = 0.005씩, 교차항 0.01 → 0.03 → √0.03 ≈ 17.32%.
 */
const WEIGHT = 0.5;
const VOL = 0.2;
const DIAG = WEIGHT * WEIGHT * VOL * VOL;
const crossCell = (rho: number) => WEIGHT * WEIGHT * VOL * VOL * rho;
const volPct = (variance: number) => `${(Math.sqrt(variance) * 100).toFixed(2)}%`;

const SCENES = [
  {
    label: "각 종목 자신의 몫",
    summary: "0.5² × 0.2² = 0.01씩",
    rho: null,
    note: "분산은 변동성을 제곱한 값입니다. 대각선 두 칸은 종목 A와 B가 각자 지수에 남기는 몫으로, 비중 0.5와 변동성 0.2를 각각 제곱해 곱한 0.01입니다. 엇갈린 두 칸은 아직 비워 둡니다.",
  },
  {
    label: "상관 0: 엇갈린 칸이 0",
    summary: `0.01 + 0.01 = 0.02 → √ ≈ ${volPct(2 * DIAG)}`,
    rho: 0,
    note: "두 종목이 서로 무관하게 움직이면 엇갈린 칸은 0입니다. 지수 분산은 대각선 두 칸의 합 0.02이고, 제곱근을 씌우면 지수 변동성은 약 14.14%입니다.",
  },
  {
    label: "상관 0.5: 엇갈린 칸이 채워짐",
    summary: `0.02 + 0.01 = 0.03 → √ ≈ ${volPct(2 * DIAG + 2 * crossCell(0.5))}`,
    rho: 0.5,
    note: "엇갈린 칸 하나는 0.5×0.5×0.2×0.2×0.5 = 0.005입니다. 두 칸을 합친 교차항 0.01이 더해져 분산은 0.03, 지수 변동성은 약 17.32%가 됩니다. 종목 변동성 20%는 그대로이고 엇갈린 칸만 달라졌습니다.",
  },
] as const;

export default function IndexVarianceGridViz() {
  return (
    <SceneShell
      eyebrow="지수 분산 칸 나누기"
      title="엇갈린 두 칸이 14.14%와 17.32%를 가릅니다"
      description="두 종목 지수의 분산을 2×2 칸으로 펼쳤습니다. 칸 하나 = 비중 × 비중 × 변동성 × 변동성 × 상관이고, 같은 종목끼리는 상관 1입니다. 칸을 채운 높이는 0.01을 가득으로 둔 같은 축입니다. 비중 0.5·변동성 20%는 글의 가정입니다."
      ariaLabel="비중 0.5, 변동성 20퍼센트 두 종목의 지수 분산을 대각선 칸과 엇갈린 칸으로 나누어 상관 0과 0.5에서 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cross = scene.rho === null ? null : crossCell(scene.rho);
        const crossSum = cross === null ? 0 : 2 * cross;
        return (
          <div className="min-w-0 space-y-5">
            <VarianceGrid
              diag={DIAG}
              diagLabel="0.5²×0.2²"
              cross={cross}
              crossLabel={scene.rho === null ? "아직 비움" : `0.5×0.5×0.2×0.2×${scene.rho}`}
            />
            <VarianceTotalBar
              segments={[
                { key: "diag", label: "대각 0.02", value: 2 * DIAG, color: "#64748b" },
                ...(crossSum > 0 ? [{ key: "cross", label: "교차 0.01", value: crossSum, color: "#2563eb" }] : []),
              ]}
            />
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-md border border-border px-2 py-2">
                <span className="block text-muted-foreground">각 종목 변동성</span>
                <span className="font-mono text-sm font-bold">20%</span>
              </div>
              <div className="rounded-md border border-border px-2 py-2">
                <span className="block text-muted-foreground">지수 변동성 = √분산</span>
                <span className="font-mono text-sm font-bold">{scene.rho === null ? "−" : volPct(2 * DIAG + crossSum)}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
