import { Coordinates, Mafs, Plot, Point, Text, Theme } from "mafs";

/** 동일한 만기 가격에서 콜 매수자와 매도자의 순손익을 비교합니다. */
export default function OptionPayoffChart() {
  return (
    <figure className="my-6 min-w-0 rounded-lg border border-border bg-background p-4">
      <figcaption className="text-sm leading-7">
        가로축은 만기 주가, 세로축은 한 단위의 순손익입니다. 행사가 100과 프리미엄 8을
        고정했습니다. 실선은 매수자, 점선은 매도자이며 108에서 손익이 0이 됩니다.
      </figcaption>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs height={260} preserveAspectRatio={false} viewBox={{ x: [50, 155], y: [-55, 55], padding: 0 }}>
          <Coordinates.Cartesian xAxis={{ lines: 20 }} yAxis={{ lines: 20, labels: false }} />
          {[-40, -20, 20, 40].map((value) => (
            <Text key={value} x={53} y={value} attach="e" size={12}>{value}</Text>
          ))}
          <Plot.OfX y={(price) => Math.max(price - 100, 0) - 8} color={Theme.blue} weight={1.25} />
          <Plot.OfX y={(price) => 8 - Math.max(price - 100, 0)} color={Theme.blue} weight={1.25} style="dashed" />
          <Point x={108} y={0} color={Theme.blue} />
        </Mafs>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        매수자: 주가 90에서 −8, 108에서 0, 120에서 12. 매도자는 같은 크기에 부호만 반대입니다.
        만기 전 가격의 시간가치와 증거금 요구는 이 그래프에 들어 있지 않습니다.
      </p>
    </figure>
  );
}
