import SceneShell from "./SceneShell";

/**
 * 본문 대응: #slice-analysis — 영어 95, 한국어 88, 자원이 적은 언어 72, 가중 평균 90 근처.
 * 비중 55·35·10은 본문에 없는 가정: 52.25 + 30.8 + 7.2 = 90.25.
 * 72→62(가정): 89.25. 여기에 95→97(가정): 53.35 + 30.8 + 6.2 = 90.35.
 */
const SHARES = [55, 35, 10];
const NAMES = ["영어", "한국어", "자원이 적은 언어"];
const BASE_ACC = [95, 88, 72];

const SCENES = [
  { label: "폭이 곧 평균에 주는 힘", summary: "52.25 + 30.8 + 7.2 = 90.25%", acc: [95, 88, 72], note: "평균은 정확도에 비중을 곱해 더한 값입니다. 자원이 적은 언어는 72%로 낮아도 폭이 좁아 평균에 7.2만 보탭니다." },
  { label: "좁은 slice 가 10%p 더 떨어지면 (가정)", summary: "72 → 62%, 평균 90.25 → 89.25%", acc: [95, 88, 62], note: "비중 10%인 slice 가 10%p 떨어져도 평균은 1%p만 내려갑니다. 그림의 평균선이 거의 움직이지 않습니다." },
  { label: "넓은 slice 가 조금 오르면 (가정)", summary: "95 → 97%, 평균 89.25 → 90.35%", acc: [97, 88, 62], note: "영어가 2%p 오르자 평균은 처음의 90.25%보다 오히려 높아졌습니다. 한 slice 의 붕괴가 다른 slice 의 개선에 가려지는 모습입니다." },
] as const;

const W = 360;
const H = 204;
const X0 = 36;
const X1 = 350;
const BASE = 156;
const TOP = 22;
const yAt = (value: number) => BASE - ((BASE - TOP) * value) / 100;
const pxPerShare = (X1 - X0) / 100;
const STARTS = SHARES.map((_, index) => X0 + SHARES.slice(0, index).reduce<number>((sum, share) => sum + share, 0) * pxPerShare);

export default function SliceWeightViz() {
  return (
    <SceneShell
      eyebrow="가중 평균"
      title="좁은 slice 는 무너져도 평균을 거의 움직이지 못합니다"
      description="가로 폭은 표본에서 차지하는 비중, 세로 높이는 정확도입니다. 정확도 95·88·72는 본문의 예시이고, 글에 없는 비중 55·35·10은 가중 평균이 90 근처가 되도록 고른 가정입니다."
      ariaLabel="언어별 비중과 정확도로 계산한 가중 평균의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const accuracies: readonly number[] = scene.acc;
        const average = accuracies.reduce<number>((sum, value, index) => sum + (value * SHARES[index]) / 100, 0);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 50, 100].map((value) => (
              <text key={value} x={X0 - 5} y={yAt(value) + 4} textAnchor="end" fontSize={10} fill="#64748b">{value}%</text>
            ))}
            {accuracies.map((value, index) => {
              const width = SHARES[index] * pxPerShare;
              const changed = value !== BASE_ACC[index];
              const failing = index === 2;
              return (
                <g key={NAMES[index]}>
                  <rect x={STARTS[index]} y={yAt(value)} width={width} height={BASE - yAt(value)} fill={failing ? "#dc2626" : "#2563eb"} fillOpacity={failing ? 0.32 : 0.28} stroke={failing ? "#dc2626" : "#2563eb"} strokeWidth={1} />
                  {changed && value < BASE_ACC[index] && (
                    <rect x={STARTS[index]} y={yAt(BASE_ACC[index])} width={width} height={yAt(value) - yAt(BASE_ACC[index])} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                  )}
                  {changed && value > BASE_ACC[index] && (
                    <line x1={STARTS[index]} x2={STARTS[index] + width} y1={yAt(BASE_ACC[index])} y2={yAt(BASE_ACC[index])} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 2" />
                  )}
                  <text x={STARTS[index] + width / 2} y={yAt(value) + 26} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{value}%</text>
                </g>
              );
            })}
            <line x1={X0} x2={X1} y1={yAt(average)} y2={yAt(average)} stroke="#0f172a" strokeWidth={1} strokeDasharray="5 3" className="stroke-foreground" />
            <text x={X1} y={yAt(average) - 4} textAnchor="end" fontSize={11} fontWeight={700} className="fill-foreground">가중 평균 {average.toFixed(2)}%</text>
            <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={STARTS[0] + (SHARES[0] * pxPerShare) / 2} y={BASE + 15} textAnchor="middle" fontSize={10.5} fill="#64748b">영어 · 비중 55%</text>
            <text x={STARTS[1] + (SHARES[1] * pxPerShare) / 2} y={BASE + 15} textAnchor="middle" fontSize={10.5} fill="#64748b">한국어 · 35%</text>
            <text x={X1} y={BASE + 31} textAnchor="end" fontSize={10.5} fill="#dc2626">자원이 적은 언어 · 10% ↑</text>
          </svg>
        );
      }}
    />
  );
}
