import SceneShell from "./SceneShell";
import { SPECTRUM_ROW } from "../trace";

/**
 * 본문 대응: #spectrum 1문단 — "흩어져 보이던 반복이 주파수 좌표에서는 하나의 큰 값으로 모입니다".
 * 같은 여덟 칸 x=[1,−1,…]에 다른 기준(k=2)을 대면 곱이 +1·−1로 상쇄되어 0,
 * k=0…7 전체를 계산하면 |X_4|=8만 남고 나머지는 0이다(DFT 산술).
 */
const N = SPECTRUM_ROW.length;
const row: readonly number[] = SPECTRUM_ROW;
const round = (value: number) => Math.round(value * 1e9) / 1e9 + 0;
const COS_K2 = row.map((_, n) => round(Math.cos((2 * Math.PI * 2 * n) / N)));
const PRODUCT_K2 = row.map((value, n) => value * COS_K2[n]);
const MAGNITUDES = Array.from({ length: N }, (_, k) => {
  const re = row.reduce<number>((sum, value, n) => sum + value * Math.cos((2 * Math.PI * k * n) / N), 0);
  const im = row.reduce<number>((sum, value, n) => sum - value * Math.sin((2 * Math.PI * k * n) / N), 0);
  return round(Math.hypot(re, im));
});
const PEAK = Math.max(...MAGNITUDES);

const SCENES = [
  {
    label: "다른 기준 k=2를 대면",
    summary: "곱의 합 0 → |X₂| = 0",
    note: "k=2 기준은 여덟 칸 안에서 두 번 반복하는 무늬입니다(실수값 cos(2π·2n/8)). 같은 밝기 줄과 곱하면 +1과 −1이 같은 수만큼 나와 합이 0이 됩니다. 허수부를 같은 방식으로 계산해도 0입니다.",
  },
  {
    label: "여덟 주파수 막대 전체",
    summary: "k=4만 8, 나머지 일곱 개는 0",
    note: "k=0부터 7까지 같은 계산을 하면 이 설명용 줄에서는 k=4 막대만 8이고 나머지는 모두 0입니다. 실제 얼굴 crop에는 많은 방향과 반복 횟수가 함께 들어 있어 여러 막대에 값이 나뉩니다.",
  },
] as const;

function sign(value: number) {
  if (value > 0) return "+1";
  if (value < 0) return "−1";
  return "0";
}

function Cells({ label, values }: { label: string; values: readonly number[] }) {
  return (
    <div className="grid grid-cols-[4.5rem_repeat(8,minmax(0,1fr))] gap-px bg-border p-px">
      <strong className="flex items-center bg-background px-2 text-[10px] leading-4">{label}</strong>
      {values.map((value, index) => (
        <span
          key={`${label}-${index}`}
          className={`flex min-h-9 items-center justify-center bg-background font-mono text-xs font-bold ${value > 0 ? "text-primary" : "text-muted-foreground"}`}
        >
          {sign(value)}
        </span>
      ))}
    </div>
  );
}

export default function SpectrumBarsViz() {
  return (
    <SceneShell
      eyebrow="막대 하나로 모인다는 뜻"
      title="다른 기준에서는 곱이 상쇄되어 k=4 막대 하나만 남습니다"
      description="위 그림과 같은 설명용 밝기 줄(+1, −1 반복)입니다. 다른 반복 횟수의 기준을 대어 보고, k=0–7 여덟 막대를 한꺼번에 그립니다."
      ariaLabel="k=2 기준과의 곱이 상쇄되는 계산과 k=0부터 7까지의 주파수 막대 크기"
      scenes={SCENES}
      render={(active) =>
        active === 0 ? (
          <div className="min-w-0 space-y-2">
            <Cells label="밝기 xₙ" values={row} />
            <Cells label="k=2 기준" values={COS_K2} />
            <Cells label="곱" values={PRODUCT_K2} />
            <p className="pt-1 font-mono text-xs font-bold">
              합 = {PRODUCT_K2.filter((v) => v > 0).length}×(+1) + {PRODUCT_K2.filter((v) => v < 0).length}×(−1) = {round(PRODUCT_K2.reduce<number>((s, v) => s + v, 0))}
            </p>
          </div>
        ) : (
          <div className="min-w-0">
            <div className="grid h-40 grid-cols-8 items-end gap-1 border-b border-border sm:gap-2">
              {MAGNITUDES.map((magnitude, k) => (
                <div key={k} className="flex h-full flex-col items-center justify-end">
                  <span className="mb-1 font-mono text-[11px] font-bold">{magnitude}</span>
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: `${(magnitude / PEAK) * 80}%`, backgroundColor: k === 4 ? "#2563eb" : "#94a3b8", minHeight: 2 }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-8 gap-1 text-center font-mono text-[11px] text-muted-foreground sm:gap-2">
              {MAGNITUDES.map((_, k) => (
                <span key={k}>k={k}</span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">막대 높이 = |X_k| (0인 막대는 바닥선만 표시)</p>
          </div>
        )
      }
    />
  );
}
