import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";

/**
 * 본문 대응: exchange-problem 의 ExplainedFormula — n(n-1)/2 와 n-1 이 갈라지는 속도.
 * 식만 보면 "둘 다 n 이 커지면 커진다"로 읽히기 쉬우므로, 제곱과 직선이
 * 벌어지는 모양 자체를 따로 보여 준다.
 */
export default function BarterCostViz() {
  const sample = 10;
  const barterAt10 = (sample * (sample - 1)) / 2;
  const moneyAt10 = sample - 1;

  return (
    <div className="not-prose rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">
        물건 종류가 늘 때 외워야 할 비율 개수는 얼마나 빨리 늘어나는가
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        x는 거래되는 물건의 종류 수 n, y는 알고 있어야 하는 비율의 개수입니다.
        위 곡선이 직접 교환 n(n−1)/2, 아래 직선이 공통 매개를 쓸 때의 n−1입니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs height={220} viewBox={{ x: [0, 20], y: [0, 190], padding: 0 }}>
          <Coordinates.Cartesian
            xAxis={{ lines: 5, labels: (v) => String(v) }}
            yAxis={{ lines: 50 }}
          />
          <Plot.OfX y={(n) => (n * (n - 1)) / 2} color={Theme.pink} />
          <Plot.OfX y={(n) => n - 1} color={Theme.blue} />
          <Point x={sample} y={barterAt10} color={Theme.pink} />
          <Point x={sample} y={moneyAt10} color={Theme.blue} />
          <Text x={sample + 0.4} y={barterAt10 + 16} size={13} color={Theme.pink}>
            n=10 → 45개
          </Text>
          <Text x={sample + 0.4} y={moneyAt10 + 16} size={13} color={Theme.blue}>
            n=10 → 9개
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        n이 10일 때는 45개와 9개로 다섯 배 차이지만, n이 100이면 4,950개와
        99개로 쉰 배가 됩니다. 종류가 늘어날수록 차이 자체가 커지는 것이
        요점이며, 이 그래프는 계산 단위를 하나로 모을 때의 이익만 보여 줍니다.
      </p>
    </div>
  );
}
