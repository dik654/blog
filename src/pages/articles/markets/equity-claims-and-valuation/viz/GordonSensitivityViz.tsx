import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";

/**
 * 본문 대응: ddm 의 ExplainedFormula — 분모가 r−g라는 작은 수여서 g를 조금만
 * 바꿔도 평가액이 폭발한다는 성질. 식만 보면 "성장률이 높으면 비싸다" 정도로
 * 읽히지만, 실제 모양은 r에 가까워질수록 수직으로 치솟는다.
 */
const D1 = 1000;
const R = 0.08;

function value(gPercent: number) {
  return D1 / (R - gPercent / 100);
}

export default function GordonSensitivityViz() {
  const points = [3, 4, 6];

  return (
    <div className="not-prose rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">
        성장률 가정을 조금 바꾸면 평가액이 얼마나 달라지는가
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        1년 뒤 배당 {D1.toLocaleString("ko-KR")}원, 요구 수익률 {R * 100}%로
        고정하고 성장률만 움직인 결과입니다. x는 영구 성장률, y는 주당 가치입니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs
          height={240}
          preserveAspectRatio={false}
          viewBox={{ x: [-0.3, 7.4], y: [-14000, 105000], padding: 0 }}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: (v) => `${v}%` }}
            yAxis={{ lines: 20000, labels: (v) => `${v / 10000}만` }}
          />
          <Plot.OfX y={(g) => value(g)} color={Theme.blue} domain={[0, 7.4]} />
          {points.map((g) => (
            <Point key={g} x={g} y={value(g)} color={Theme.pink} />
          ))}
          <Text x={1.25} y={value(3) + 5500} size={13} color={Theme.pink}>
            g=3% · {Math.round(value(3)).toLocaleString("ko-KR")}원
          </Text>
          <Text x={3.05} y={value(4) + 9500} size={13} color={Theme.pink}>
            g=4% · {Math.round(value(4)).toLocaleString("ko-KR")}원
          </Text>
          <Text x={4.6} y={value(6) - 6000} size={13} color={Theme.pink}>
            g=6% · {Math.round(value(6)).toLocaleString("ko-KR")}원
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        성장률을 3%에서 4%로 1%포인트만 올려도 값이{" "}
        {Math.round((value(4) / value(3) - 1) * 100)}% 오르고, 6%로 올리면{" "}
        {(value(6) / value(3)).toFixed(1)}배가 됩니다. 요구 수익률 {R * 100}%에
        가까워질수록 곡선이 수직으로 치솟기 때문입니다. 그래서 이 모형으로 나온
        숫자는 언제나 &ldquo;어떤 g를 썼는가&rdquo;와 함께 읽어야 하며, 영구
        성장률이 경제 전체의 장기 성장률을 넘지 않는다는 제약을 같이 걸지 않으면
        원하는 답을 만들어 내는 도구가 됩니다.
      </p>
    </div>
  );
}
