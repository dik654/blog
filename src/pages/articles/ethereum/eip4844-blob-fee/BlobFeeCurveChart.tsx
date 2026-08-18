import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";

/**
 * fake_exponential(factor, excess, denom)이 근사하는 닫힌 형태 factor·e^(excess/denom)의 모양을
 * 보여준다. 실제 계산은 정수 Taylor 항을 반복해서 더하는 recurrence(본문 수식 참고)지만,
 * "excess가 늘어날수록 price가 얼마나 가파르게 뛰는가"라는 질문은 이 곡선 모양이 더 잘 답한다.
 * 축은 excess/update-fraction, price/factor로 무차원화해 특정 fork 상수에 묶이지 않게 한다.
 */
export default function BlobFeeCurveChart() {
  const toyExcess = 1.5; // 본문 worked example(E=2,U=5,T=3→next excess=4)을 update fraction=2.67 근방으로 정규화한 참고점
  const toyPrice = Math.exp(toyExcess);

  return (
    <div className="not-prose rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">excess가 커질수록 price는 얼마나 가파르게 뛰는가</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        x = excess ÷ update fraction, y = price ÷ factor로 무차원화했습니다. 실제 client는 이 곡선을
        정수 recurrence로 근사하지만(위 수식), 모양 자체는 이 지수 곡선과 같습니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs height={220} viewBox={{ x: [0, 3], y: [0, 20], padding: 0 }}>
          <Coordinates.Cartesian
            xAxis={{ lines: 0.5, labels: (v) => v.toFixed(1) }}
            yAxis={{ lines: 5 }}
          />
          <Plot.OfX y={(x) => Math.exp(x)} color={Theme.blue} />
          <Point x={toyExcess} y={toyPrice} color={Theme.pink} />
          <Text x={toyExcess + 0.12} y={toyPrice + 1.5} size={13} color={Theme.pink}>
            excess=1.5×denom → price≈{toyPrice.toFixed(1)}×factor
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        x=1(즉 excess=update fraction)까지는 완만하지만, x가 2·3으로 늘어나면 price는 각각
        e²≈7.4배, e³≈20배로 뛰어오릅니다. Target을 반복해서 넘기면 price가 선형이 아니라
        기하급수적으로 벌금을 매기는 이유입니다.
      </p>
    </div>
  );
}
