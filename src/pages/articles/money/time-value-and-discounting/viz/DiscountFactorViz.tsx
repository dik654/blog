import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";

/**
 * 본문 대응: discounting 의 ExplainedFormula — 할인계수가 기간과 할인율에 따라
 * 얼마나 빨리 작아지는지. 식만 보면 "조금씩 줄어든다"로 읽히기 쉬워서
 * 3%와 8% 두 곡선이 벌어지는 모양을 따로 보여 준다.
 */
export default function DiscountFactorViz() {
  const years = 10;
  const low = 1 / 1.03 ** years;
  const high = 1 / 1.08 ** years;

  return (
    <div className="not-prose rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">
        먼 미래의 1원은 오늘 얼마가 되는가
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        x는 기다리는 햇수 n, y는 그 시점의 1원이 오늘 갖는 값입니다. 위 곡선이
        할인율 3%, 아래 곡선이 8%입니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs height={220} preserveAspectRatio={false} viewBox={{ x: [-0.9, 30.9], y: [-0.13, 1.06], padding: 0 }}>
          <Coordinates.Cartesian
            xAxis={{ lines: 5, labels: (v) => String(v) }}
            yAxis={{ lines: 0.25, labels: (v) => v.toFixed(2) }}
          />
          <Plot.OfX y={(n) => 1 / 1.03 ** n} color={Theme.blue} />
          <Plot.OfX y={(n) => 1 / 1.08 ** n} color={Theme.pink} />
          <Point x={years} y={low} color={Theme.blue} />
          <Point x={years} y={high} color={Theme.pink} />
          <Text x={years + 0.8} y={low + 0.06} size={13} color={Theme.blue}>
            3% · 10년 → 0.74
          </Text>
          <Text x={years + 0.8} y={high - 0.13} size={13} color={Theme.pink}>
            8% · 10년 → 0.46
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        10년에서는 0.74와 0.46으로 1.6배 차이지만 30년에서는 0.41과 0.10으로 네
        배 넘게 벌어집니다. 사업 기간이 길수록 할인율을 어떻게 잡았는지가
        결론을 좌우한다는 뜻이며, 그래서 평가액을 말할 때는 r을 함께 밝혀야
        합니다.
      </p>
    </div>
  );
}
