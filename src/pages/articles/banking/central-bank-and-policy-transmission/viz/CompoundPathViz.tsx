import SceneShell from "./SceneShell";

/**
 * 본문 대응: #no-arbitrage — 1 × 1.045 × 1.04 × 1.035 = 1.124838, 세제곱근 − 1 ≈ 3.9992%.
 * 막대는 1원 위로 늘어난 몫만 그린다.
 */
const FACTORS = [1.045, 1.04, 1.035] as const;
const CUMULATIVE = FACTORS.map((_, year) => FACTORS.slice(0, year + 1).reduce<number>((product, factor) => product * factor, 1));
const FINAL = CUMULATIVE[2];
const FLAT_RATE = (Math.cbrt(FINAL) - 1) * 100;

const SCENES = [
  { label: "금리를 모를 때", shown: 0, summary: "둘째·셋째 해 금리 ?", note: "3년 고정금리와 매년 단기로 다시 굴리는 것은 미래 단기금리를 모르면 같은 확정 지급액을 보장하지 않습니다. 차환할 때의 금리가 바뀔 위험이 있습니다." },
  { label: "첫해", shown: 1, summary: "1 × 1.045 = 1.045원", note: "여기부터는 미래 각 1년 금리가 확실히 4.5%·4%·3.5%이고 거래·신용 비용이 없다고 가정합니다. 첫해에는 원금 1원에 1.045를 곱합니다." },
  { label: "둘째 해", shown: 2, summary: "1.045 × 1.04 = 1.0868원", note: "둘째 해에는 처음 1원이 아니라 첫해 결과에 1.04를 곱합니다." },
  { label: "셋째 해", shown: 3, summary: "1.0868 × 1.035 ≈ 1.1248원", note: "셋째 해에도 그 결과에 1.035를 곱합니다. 3년 뒤 금액은 세 성장배수의 곱입니다." },
  { label: "같은 결과의 한 수익률", shown: 3, summary: `세제곱근 − 1 ≈ ${FLAT_RATE.toFixed(4)}%`, note: "같은 결과를 주는 3년 연복리 수익률은 이 곱의 세제곱근에서 1을 뺀 약 3.9992%입니다. 산술 평균 4%와 가까워도 엄밀히 같지는 않습니다." },
] as const;

export default function CompoundPathViz() {
  return (
    <SceneShell
      eyebrow="곱으로 쌓이는 금액"
      title="매년 다시 굴린 1원은 합이 아니라 곱으로 쌓입니다"
      description="막대는 원금 1원 위로 늘어난 몫만 그렸습니다. 4.5%·4%·3.5%는 글의 가정입니다."
      ariaLabel="1원을 세 해 동안 곱해 쌓는 과정과 같은 결과의 연복리 수익률"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-3">
              {FACTORS.map((factor, year) => {
                const known = year < scene.shown;
                const value = CUMULATIVE[year];
                return (
                  <div key={factor} className="min-w-0 text-center">
                    <p className="text-xs text-muted-foreground">{year + 1}년째</p>
                    <p className={`mt-1 font-mono text-sm font-bold ${known ? "text-primary" : "text-muted-foreground/60"}`}>
                      {known ? `× ${factor}` : active === 0 && year === 0 ? "지금 금리" : "× ?"}
                    </p>
                    <div className="mt-2 flex h-16 items-end sm:h-24 border-b border-border">
                      {known && <div aria-hidden className="w-full rounded-t-sm bg-[#2563eb]" style={{ height: `${((value - 1) / (FINAL - 1)) * 100}%` }} />}
                    </div>
                    <p className="mt-1 font-mono text-xs font-semibold">{known ? value.toFixed(4) : "−"}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
                <span className="block font-bold">3년 뒤 1원의 값</span>
                {scene.shown === 3 ? "1.124838원" : active === 0 ? "아직 모름" : "계산 중"}
              </p>
              <p className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
                <span className="block font-bold">같은 결과의 연복리</span>
                {active === 4 ? `${FLAT_RATE.toFixed(4)}%` : "−"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
