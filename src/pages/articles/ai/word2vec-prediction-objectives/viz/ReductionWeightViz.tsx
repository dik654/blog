import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reduction — (가정) 이웃 2개·6개인 두 중심, 모든 쌍의 손실 1.
 * 전체 합: 2와 6. 중심별 평균: 1과 1(쌍 하나 1/2, 1/6). 전체 쌍 수 8로 나눔: 2/8과 6/8(쌍 하나 1/8).
 * 막대의 축은 세 장면 모두 0~6으로 같습니다.
 */
const SCENES = [
  { label: "쌍을 전부 더합니다", summary: "2 + 6 = 8", weight: [1, 1], weightText: ["1", "1"], note: "칸 하나가 이웃 쌍 하나이고 손실은 모두 1(가정)입니다. 쌍마다 같은 무게를 주므로 이웃이 많은 중심의 기여가 2와 6으로 벌어집니다." },
  { label: "중심마다 먼저 평균", summary: "1 + 1 = 2", weight: [1 / 2, 1 / 6], weightText: ["1/2", "1/6"], note: "각 중심의 이웃 수로 먼저 나누면 두 중심의 기여가 1과 1로 같아집니다. 그 대신 이웃 6개 중심의 쌍 하나는 1/6, 이웃 2개 중심의 쌍 하나는 1/2의 무게를 받습니다." },
  { label: "전체 쌍 수 하나로 나눕니다", summary: "2/8 + 6/8 = 1", weight: [1 / 8, 1 / 8], weightText: ["1/8", "1/8"], note: "전체 쌍 수 8 하나로 나누면 쌍마다 1/8로 무게가 같습니다. 첫 장면을 같은 배율로 줄인 것이고, 자료와 쌍 목록이 고정되어 있을 때 합의 일정한 배율입니다. 중심별 평균과는 비율이 다릅니다." },
] as const;

const CENTERS = [
  { name: "이웃 2개인 중심", count: 2, color: "#2563eb" },
  { name: "이웃 6개인 중심", count: 6, color: "#d97706" },
];
const AXIS = 6;

export default function ReductionWeightViz() {
  return (
    <SceneShell
      eyebrow="합과 평균의 무게"
      title="같은 손실을 세 가지 분모로 더하면 어느 중심이 커질까요"
      description="칸 하나가 이웃 쌍 하나이고 칸의 너비가 그 쌍이 받는 무게입니다. 세 장면 모두 같은 0~6 축에 그립니다. 중심은 예측의 기준이 되는 가운데 단어 위치입니다. 이웃 수와 손실은 가정입니다."
      ariaLabel="이웃 2개와 6개인 두 중심의 기여를 합, 중심별 평균, 전체 평균으로 비교하는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {CENTERS.map((center, c) => {
              const w = scene.weight[c];
              const total = center.count * w;
              return (
                <div key={center.name}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                    <span className="font-semibold">{center.name}</span>
                    <span className="font-mono text-xs">쌍 하나 {scene.weightText[c]} · 합 {active === 2 ? `${center.count}/8` : total}</span>
                  </div>
                  <div className="flex h-8 min-w-0 rounded-sm bg-muted/40">
                    {Array.from({ length: center.count }, (_, i) => (
                      <span key={i} className="h-full border-r border-background" style={{ width: `${(w / AXIS) * 100}%`, backgroundColor: center.color }} />
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between font-mono text-xs text-muted-foreground"><span>0</span><span>2</span><span>4</span><span>6</span></div>
          </div>
        );
      }}
    />
  );
}
