import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #leverage 첫 두 문단 — 자산 100억, 차입 50억(연 5%) 여부와 자산 수익률 8%·3%.
 * 이자 = 50 × 5% = 2.5억. 8%: 8/100 = 8% vs 5.5/50 = 11%. 3%: 3/100 = 3% vs 0.5/50 = 1%.
 */
const SCENES = [
  { label: "8억을 벌고 빚이 없으면", summary: "8 ÷ 100 = 8%", debt: 0, earn: 8, roe: 8, ref: null, note: "자산 100억 원이 전부 주주 돈입니다. 번 8억 원이 모두 주주 몫이고, 주주가 넣은 100억 원 대비 8%입니다." },
  { label: "같은 8억, 50억을 빌렸으면", summary: "(8 − 2.5) ÷ 50 = 11%", debt: 50, earn: 8, roe: 11, ref: 8, note: "50억 원을 연 5%에 빌렸으므로 이자 2.5억 원을 먼저 떼고 5.5억 원이 남습니다. 남은 몫은 줄었지만 주주가 넣은 돈도 50억 원이라 비율은 11%로 올라갑니다." },
  { label: "3억만 벌고 빚이 없으면", summary: "3 ÷ 100 = 3%", debt: 0, earn: 3, roe: 3, ref: null, note: "사업이 나빠져 자산 수익률이 3%로 떨어진 경우입니다. 빚이 없으면 주주 수익률도 3%입니다." },
  { label: "같은 3억, 50억을 빌렸으면", summary: "(3 − 2.5) ÷ 50 = 1%", debt: 50, earn: 3, roe: 1, ref: 3, note: "이자 2.5억 원은 사업이 나빠져도 그대로 나갑니다. 0.5억 원만 남아 주주 수익률은 1%입니다. 좋을 때는 8%가 11%로, 나쁠 때는 3%가 1%로 벌어졌습니다." },
] as const;

const DEBT = "#64748b";
const EQUITY = "#6366f1";
const INTEREST = "#d97706";
const RATE = 0.05;
const ROE_SCALE = 12;
const LEGEND = [
  { label: "빌린 돈", color: DEBT },
  { label: "이자", color: INTEREST },
  { label: "주주 돈·주주 몫", color: EQUITY },
] as const;

function Row({ label, children, value }: { label: string; children: ReactNode; value: string }) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_5.5rem] sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="relative flex h-6 min-w-0 overflow-hidden rounded-sm bg-muted/40">{children}</div>
      <span className="text-right font-mono">{value}</span>
    </div>
  );
}

function Seg({ share, color, text }: { share: number; color: string; text: string }) {
  if (share <= 0) return null;
  return (
    <div className="flex h-full items-center justify-center overflow-hidden whitespace-nowrap text-[11px] font-semibold text-white" style={{ width: `${share * 100}%`, backgroundColor: color }}>
      {share >= 0.45 ? text : ""}
    </div>
  );
}

export default function LeverageSplitViz() {
  return (
    <SceneShell
      eyebrow="빚을 섞은 같은 사업"
      title="이자를 먼저 떼고, 남은 몫을 주주가 넣은 돈으로 나눕니다"
      description="단위는 억 원입니다. 자산 100억 원짜리 같은 사업을 빚 없이 운영할 때와 50억 원을 연 5%에 빌려 운영할 때, 자산 수익률 8%와 3%에서 주주 몫을 비교합니다."
      ariaLabel="부채 유무와 자산 수익률에 따른 주주 수익률 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const equity = 100 - scene.debt;
        const interest = scene.debt * RATE;
        const residual = scene.earn - interest;
        return (
          <div className="min-w-0 space-y-3">
            <Row label="돈을 댄 곳" value={scene.debt ? "50 + 50" : "100"}>
              <Seg share={scene.debt / 100} color={DEBT} text="빌린 돈 50" />
              <Seg share={equity / 100} color={EQUITY} text={`주주 돈 ${equity}`} />
            </Row>
            <Row label="한 해 번 돈" value={scene.debt ? `${interest} + ${residual}` : `${scene.earn}`}>
              <Seg share={interest / 8} color={INTEREST} text={`이자 ${interest}`} />
              <Seg share={residual / 8} color={EQUITY} text={`주주 몫 ${residual}`} />
            </Row>
            <Row label="주주 수익률" value={`${scene.roe}%`}>
              <Seg share={scene.roe / ROE_SCALE} color={EQUITY} text={`${scene.roe}%`} />
              {scene.ref !== null && (
                <div className="absolute inset-y-0 border-l border-dashed border-foreground/70" style={{ left: `${(scene.ref / ROE_SCALE) * 100}%` }} aria-hidden />
              )}
            </Row>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {LEGEND.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
              <span className={scene.ref !== null ? "" : "invisible"}>┆ 점선 = 빚이 없을 때 {scene.ref ?? 0}%</span>
            </div>
          </div>
        );
      }}
    />
  );
}
