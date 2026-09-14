import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";

/**
 * 본문 대응: duration 의 ExplainedFormula — 가격-수익률 관계가 직선이 아니라
 * 아래로 볼록한 곡선이라는 사실. 수정 듀레이션은 한 점에서의 접선이고,
 * 볼록성은 접선과 실제 곡선 사이의 간격을 설명한다.
 */
const FACE = 100;
const COUPON = 5;
const YEARS = 10;
const BASE_Y = 0.05;

function price(y: number) {
  let sum = 0;
  for (let t = 1; t <= YEARS; t += 1) sum += COUPON / (1 + y) ** t;
  return sum + FACE / (1 + y) ** YEARS;
}

/** 5% 지점에서의 수정 듀레이션(수치 미분으로 계산) */
const H = 1e-5;
const SLOPE = (price(BASE_Y + H) - price(BASE_Y - H)) / (2 * H);
const MODIFIED_DURATION = -SLOPE / price(BASE_Y);

function tangent(y: number) {
  return price(BASE_Y) + SLOPE * (y - BASE_Y);
}

export default function PriceYieldCurveViz() {
  const basePrice = price(BASE_Y);
  const jumpY = 0.09;

  return (
    <div className="not-prose rounded-lg border border-border/70 bg-background p-4 sm:p-6">
      <p className="text-xs font-bold text-primary">
        듀레이션은 접선이고, 실제 가격은 그 접선 위에 있습니다
      </p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        액면 {FACE}, 표면금리 {COUPON}%, 만기 {YEARS}년 채권의 가격입니다. x는
        수익률, y는 가격이며 직선이 수익률 {BASE_Y * 100}% 지점의 듀레이션 근사,
        곡선이 실제 가격입니다.
      </p>
      <div className="themed-mafs mt-4 min-w-0 overflow-x-auto">
        <Mafs height={240} preserveAspectRatio={false} viewBox={{ x: [-0.4, 12.4], y: [-22, 168], padding: 0 }}>
          <Coordinates.Cartesian
            xAxis={{ lines: 2, labels: (v) => `${v}%` }}
            yAxis={{ lines: 50 }}
          />
          <Plot.OfX y={(x) => price(x / 100)} color={Theme.blue} />
          <Plot.OfX y={(x) => tangent(x / 100)} color={Theme.pink} />
          <Point x={BASE_Y * 100} y={basePrice} color={Theme.blue} />
          <Text x={BASE_Y * 100 + 0.3} y={basePrice + 8} size={13} color={Theme.blue}>
            기준점 {BASE_Y * 100}% · {basePrice.toFixed(1)}
          </Text>
          <Point x={jumpY * 100} y={price(jumpY)} color={Theme.blue} />
          <Point x={jumpY * 100} y={tangent(jumpY)} color={Theme.pink} />
          <Text x={jumpY * 100 + 0.4} y={tangent(jumpY) - 16} size={13} color={Theme.pink}>
            직선 근사 {tangent(jumpY).toFixed(1)}
          </Text>
          <Text x={jumpY * 100 + 0.4} y={price(jumpY) + 16} size={13} color={Theme.blue}>
            실제 {price(jumpY).toFixed(1)}
          </Text>
        </Mafs>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        이 채권의 수정 듀레이션은 약 {MODIFIED_DURATION.toFixed(1)}이므로 금리가
        1%포인트 오르면 가격이 약 {MODIFIED_DURATION.toFixed(1)}% 떨어진다고
        읽습니다. 그런데 4%포인트가 오르면 직선 근사는{" "}
        {tangent(jumpY).toFixed(1)}을 가리키는데 실제 가격은{" "}
        {price(jumpY).toFixed(1)}로 그보다 높습니다. 곡선이 아래로 볼록해서
        생기는 이 차이를 볼록성이라 부르며, 손실은 근사보다 작고 이익은 더
        크다는 방향으로 항상 유리하게 작용합니다.
      </p>
    </div>
  );
}
