import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";

/**
 * 본문 대응: many-assets 의 ExplainedFormula — 자산 수를 늘릴 때 포트폴리오
 * 표준편차가 평균 공분산의 제곱근으로 수렴하는 모양. 식만 보면 "늘리면
 * 줄어든다"로 읽히지만, 실제로는 스무 개 언저리에서 거의 평평해지고
 * 그 뒤로는 상관을 낮추는 것 말고는 방법이 없다는 점이 요점이다.
 */
const AVG_SD = 0.3;

function portfolioSd(n: number, rho: number) {
  const variance = AVG_SD * AVG_SD;
  const cov = rho * variance;
  return Math.sqrt(variance / n + ((n - 1) / n) * cov) * 100;
}

const FLOOR_LOW = Math.sqrt(0.1) * AVG_SD * 100;
const FLOOR_MID = Math.sqrt(0.3) * AVG_SD * 100;

export default function DiversificationCurveViz() {
  return (
    <div className="not-prose rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">
        종목을 늘리면 위험은 어디까지 내려가는가
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        평균 표준편차 {AVG_SD * 100}%인 자산을 균등하게 담았을 때입니다. x는
        담은 종목 수, y는 포트폴리오 표준편차이며 위 곡선이 평균 상관 0.3,
        아래 곡선이 0.1입니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs
          height={240}
          preserveAspectRatio={false}
          viewBox={{ x: [-2, 52], y: [-4, 32], padding: 0 }}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 10, labels: (v) => `${v}개` }}
            yAxis={{ lines: 10, labels: (v) => `${v}%` }}
          />
          <Plot.OfX y={(n) => portfolioSd(n, 0.3)} color={Theme.pink} domain={[1, 52]} />
          <Plot.OfX y={(n) => portfolioSd(n, 0.1)} color={Theme.blue} domain={[1, 52]} />
          <Plot.OfX y={() => FLOOR_MID} color={Theme.pink} style="dashed" />
          <Plot.OfX y={() => FLOOR_LOW} color={Theme.blue} style="dashed" />
          <Point x={20} y={portfolioSd(20, 0.3)} color={Theme.pink} />
          <Text x={22} y={portfolioSd(20, 0.3) + 3.4} size={13} color={Theme.pink}>
            상관 0.3 · 20개 → {portfolioSd(20, 0.3).toFixed(1)}%
          </Text>
          <Text x={22} y={FLOOR_LOW - 3.2} size={13} color={Theme.blue}>
            상관 0.1의 바닥 {FLOOR_LOW.toFixed(1)}%
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        상관이 0.3이면 종목을 무한히 늘려도 {FLOOR_MID.toFixed(1)}% 아래로는
        내려가지 않고, 스무 개만 담아도 이미 {portfolioSd(20, 0.3).toFixed(1)}%로
        바닥에 거의 닿습니다. 그 뒤로 종목을 더 늘리는 것은 거의 소용이
        없습니다. 바닥 자체를 낮추려면 개수가 아니라 상관을 낮춰야 하며, 상관을
        0.1로 내리면 바닥이 {FLOOR_LOW.toFixed(1)}%로 떨어집니다.
      </p>
    </div>
  );
}
