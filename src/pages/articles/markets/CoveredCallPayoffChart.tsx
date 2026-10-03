import { Coordinates, Mafs, Plot, Point, Text, Theme } from "mafs";

/** 만기 주가만 바꾸며 같은 주식을 보유한 두 전략의 손익을 비교합니다. */
export default function CoveredCallPayoffChart() {
  return (
    <figure className="my-6 min-w-0 rounded-lg border border-border bg-background p-4">
      <figcaption className="text-sm leading-7">
        가로축은 만기 주가, 세로축은 주당 순손익입니다. 매수가 100·행사가 105·프리미엄 3을
        고정합니다. 실선은 커버드콜, 점선은 주식만 보유한 경우입니다. 전체 100주 손익은
        세로축 값에 100을 곱합니다.
      </figcaption>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs height={280} preserveAspectRatio={false} viewBox={{ x: [50, 145], y: [-45, 45], padding: 0 }}>
          <Coordinates.Cartesian xAxis={{ lines: 10, labels: (value) => value >= 60 ? String(value) : "" }} yAxis={{ lines: 10, labels: false }} />
          {[-40, -20, 20, 40].map((value) => (
            <Text key={value} x={53} y={value} attach="e" size={12}>{value}</Text>
          ))}
          <Plot.OfX y={(price) => price - 100} color={Theme.blue} weight={1.25} style="dashed" />
          <Plot.OfX y={(price) => Math.min(price, 105) - 100 + 3} color={Theme.blue} weight={1.25} />
          <Point x={97} y={0} color={Theme.blue} />
          <Point x={105} y={8} color={Theme.blue} />
        </Mafs>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        주가 90에서 −7, 103에서 6, 120에서 8입니다. 105 위에서는 상승분을 넘기므로 이익이
        8에서 멈춥니다. 97 아래에서는 받은 3을 넘는 하락 손실이 남습니다.
      </p>
    </figure>
  );
}
