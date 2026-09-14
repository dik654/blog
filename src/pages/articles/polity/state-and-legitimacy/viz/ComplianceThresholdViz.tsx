import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";

/**
 * 본문 대응: legitimacy 의 ExplainedFormula — 필요한 집행 자원이 불응률에 비례해
 * 직선으로 늘고, 가용 자원선과 만나는 지점에서 통치가 무너진다. 가로축을
 * 불응률로 잡은 이유는 순응률로 잡으면 세로축이 화면 밖으로 밀려나 눈금이
 * 사라지기 때문이다(순응률 = 100 − 불응률).
 */
const POPULATION = 1000; // 만 명 단위
const COST_PER_PERSON = 1;
const AVAILABLE = 50;

function required(noncompliancePercent: number) {
  return (noncompliancePercent / 100) * POPULATION * COST_PER_PERSON;
}

const THRESHOLD = (AVAILABLE / (POPULATION * COST_PER_PERSON)) * 100;

export default function ComplianceThresholdViz() {
  return (
    <div className="not-prose rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">
        따르지 않는 사람이 늘면 필요한 집행 자원이 얼마나 늘어나는가
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        인구 {POPULATION}만 명, 한 명을 강제하는 비용 {COST_PER_PERSON},
        동원 가능한 집행 자원 {AVAILABLE}로 두었습니다. x는 따르지 않는 사람의
        비율, y는 필요한 집행 자원이며 가로 점선이 가용 자원입니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs
          height={240}
          preserveAspectRatio={false}
          viewBox={{ x: [-0.6, 20.6], y: [-26, 215], padding: 0 }}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: 5, labels: (v) => `${v}%` }}
            yAxis={{ lines: 50 }}
          />
          <Plot.OfX y={(x) => required(x)} color={Theme.pink} domain={[0, 20]} />
          <Plot.OfX y={() => AVAILABLE} color={Theme.blue} style="dashed" />
          <Point x={THRESHOLD} y={AVAILABLE} color={Theme.blue} />
          <Text x={THRESHOLD + 0.8} y={AVAILABLE - 16} size={13} color={Theme.blue}>
            불응 {THRESHOLD}% (순응 {100 - THRESHOLD}%)에서 한계
          </Text>
          <Point x={10} y={required(10)} color={Theme.pink} />
          <Text x={10.6} y={required(10) + 20} size={13} color={Theme.pink}>
            불응 10%면 필요 {required(10)} · 가용의 두 배
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        따르지 않는 사람이 {THRESHOLD}%를 넘으면, 곧 순응률이{" "}
        {100 - THRESHOLD}% 아래로 내려가면 필요한 자원이 가용량을 넘어섭니다.
        그때부터는 집행하지 못한 위반이 쌓여 순응률을 더 떨어뜨립니다. 통치가
        서서히 나빠지다가 어느 지점에서 급격히 무너지는 것처럼 보이는 이유가
        이 임계 구조입니다. 다만 이 계산은 불응이 흩어져 있다고 가정하므로,
        조직적으로 몰리면 1인당 비용이 올라 한계가 더 앞당겨집니다.
      </p>
    </div>
  );
}
