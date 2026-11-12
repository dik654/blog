import SceneShell from "./SceneShell";

/**
 * 본문 대응: SoftmaxLoss.tsx #temperature-scale — 코사인 값을 그대로 소프트맥스에 넣으면 평평하고,
 * 배율을 곱하면 차이가 벌어지며, 표현이 엉킨 초반에 큰 배율은 잘못된 칸에 확률을 몰아 준다.
 * 한 행(이미지 하나 × 문장 5개)의 코사인 값은 설명용 가정이다.
 * 정렬된 행 [0.30, 0.20, 0.10, 0.10, 0.00]: t=1 → 0.233…, t=10 → 0.592…, t=100 → 1.000…
 * 엉킨 행 [0.10, 0.30, 0.20, 0.10, 0.00]: t=1 → 짝 0.191, t=100 → 짝 0.000·오답 1.000
 */
const ALIGNED = [0.3, 0.2, 0.1, 0.1, 0.0] as const;
const TANGLED = [0.1, 0.3, 0.2, 0.1, 0.0] as const;

const SCENES = [
  {
    label: "배율 1 · 코사인 그대로",
    summary: "짝 0.233 · 나머지 0.17~0.21",
    row: ALIGNED,
    t: 1,
    note: "코사인은 -1~1 사이의 작은 값이고, 이 행(가정)에서는 칸끼리 차이가 0.3 이하입니다. 지수 안의 차이도 0.3 이하라 다섯 칸 확률이 거의 같습니다.",
  },
  {
    label: "배율 10",
    summary: "짝 0.592",
    row: ALIGNED,
    t: 10,
    note: "10을 곱하면 0.1 차이가 지수 안에서 1 차이가 됩니다. 순위는 그대로이고 짝 칸으로 확률이 모입니다.",
  },
  {
    label: "배율 100",
    summary: "짝 1.000 · 나머지 0.000",
    row: ALIGNED,
    t: 100,
    note: "배율이 크면 작은 차이도 크게 벌어져 분포가 날카로워집니다. 미세한 차이까지 구분하게 미는 쪽입니다.",
  },
  {
    label: "초반 · 엉킨 행 × 배율 1",
    summary: "오답 칸 0.233 · 짝 0.191",
    row: TANGLED,
    t: 1,
    note: "초반에는 표현이 엉켜 오답 칸의 코사인이 더 클 수 있습니다. 배율이 낮으면 확률이 여러 칸에 퍼집니다.",
  },
  {
    label: "초반 · 엉킨 행 × 배율 100",
    summary: "오답 칸 1.000 · 짝 0.000",
    row: TANGLED,
    t: 100,
    note: "같은 행에 큰 배율을 곱하면 확률이 거의 전부 오답 칸에 몰립니다. 본문의 '잘못된 쌍에 강한 기울기'가 이 상태입니다.",
  },
] as const;

const PAIR = "#10b981";
const WRONG = "#ef4444";
const OTHER = "#6366f1";

function softmax(row: readonly number[], t: number) {
  const ex = row.map((v) => Math.exp(t * v));
  const sum = ex.reduce<number>((a, b) => a + b, 0);
  return ex.map((v) => v / sum);
}

export default function TemperatureScaleViz() {
  return (
    <SceneShell
      eyebrow="학습되는 온도"
      title="같은 코사인 값도 곱하는 배율에 따라 확률이 평평하거나 한 칸에 몰립니다"
      description="이미지 하나 × 문장 5개인 한 행입니다. 소프트맥스는 각 값에 지수를 취한 뒤 행의 합으로 나눠 확률로 바꾸는 연산이고, 막대는 그 확률이며 다섯 확률의 합은 언제나 1입니다. 코사인 값과 배율 10·100은 설명용 가정입니다."
      note="실제 학습에서 배율이 어떤 값을 지나 어디서 멈추는지는 데이터가 정하며, 이 그림의 배율 값은 가정입니다."
      ariaLabel="배율 1, 10, 100에서 한 행의 소프트맥스 확률 비교와 학습 초반 엉킨 행"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const row: readonly number[] = scene.row;
        const probs = softmax(row, scene.t);
        const rowMax = Math.max(...row);
        return (
          <div className="min-w-0 space-y-1.5">
            <div className="grid grid-cols-[4.5rem_3.25rem_minmax(0,1fr)_3rem] gap-2 text-[11px] text-muted-foreground">
              <span>문장</span>
              <span className="text-right">코사인</span>
              <span>확률 (배율 {scene.t})</span>
              <span className="text-right">값</span>
            </div>
            {row.map((cos, j) => {
              const isPair = j === 0;
              const isWrongTop = !isPair && cos === rowMax;
              const color = isPair ? PAIR : isWrongTop ? WRONG : OTHER;
              return (
                <div key={j} className="grid grid-cols-[4.5rem_3.25rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
                  <span className={isPair || isWrongTop ? "font-bold" : "text-muted-foreground"}>
                    {isPair ? "짝" : isWrongTop ? "오답 최고" : `문장 ${j + 1}`}
                  </span>
                  <span className="text-right font-mono">{cos.toFixed(2)}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div
                      className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${probs[j] * 100}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-right font-mono">{probs[j].toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
