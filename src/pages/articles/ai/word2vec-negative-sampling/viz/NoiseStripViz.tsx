import SceneShell from "./SceneShell";

/**
 * 본문 대응: #noise — 빈도 [1,1,1,16,1](가정). 3/4승 → [1,1,1,8,1], 합 12. saw 16/20 → 8/12 = 2/3, 균등 1/5.
 * 칸 하나가 무게 1이며 각 줄의 전체 폭은 합 하나에 해당한다.
 */
const STRIPS = [
  { name: "빈도 그대로", weights: [1, 1, 1, 16, 1], text: "saw 16/20", from: 0 },
  { name: "3/4승", weights: [1, 1, 1, 8, 1], text: "saw 8/12 = 2/3", from: 1 },
  { name: "모두 똑같이", weights: [1, 1, 1, 1, 1], text: "saw 1/5", from: 3 },
] as const;

const SCENES = [
  { label: "빈도 그대로", summary: "saw 16/20", note: "전체 자료의 출현 횟수를 그대로 쓰면 스무 칸 중 열여섯 칸이 saw입니다. 추첨 대부분이 saw로 몰립니다." },
  { label: "3/4승", summary: "16 → 8, 1 → 1", note: "16의 3/4승은 8이고 1은 그대로 1입니다. 무게 합은 20에서 12가 됩니다." },
  { label: "합으로 나누기", summary: "q(saw) = 2/3, q(red) = 1/12", note: "변환한 무게 전체를 분모로 나눠 합이 1인 확률을 만듭니다. saw의 비중은 16/20에서 8/12로 줄고, red는 1/20에서 1/12로 늘어납니다." },
  { label: "양 끝과 비교", summary: "16/20 > 2/3 > 1/5", note: "3/4승은 빈도 그대로와 모두 똑같이의 사이에 있습니다. 3/4는 논문에서 선택한 지수이며, 모든 자료에서 최적이라는 수학 법칙은 아닙니다." },
] as const;

export default function NoiseStripViz() {
  return (
    <SceneShell
      eyebrow="추첨 비중 · 가정한 빈도"
      title="saw의 비중이 16/20에서 2/3로 줄어듭니다"
      description="한 줄의 전체 폭이 추첨 한 번의 전체 비중이고 칸 하나가 무게 1입니다. 파랑이 saw, 회색이 나머지 넷이며 빈도는 가정값입니다."
      ariaLabel="빈도 그대로, 3/4승, 균등의 세 줄에서 saw가 차지하는 칸 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          {STRIPS.map((strip) => {
            const show = active >= strip.from;
            const total = strip.weights.reduce((sum, value) => sum + value, 0);
            return (
              <div key={strip.name} className={show ? "" : "invisible"}>
                <div className="mb-1 flex flex-wrap justify-between gap-x-3 text-xs">
                  <span className="font-semibold">{strip.name} · 합 {total}</span>
                  <span className="font-mono font-bold text-primary">{strip.text}</span>
                </div>
                <div className="flex gap-[2px]">
                  {strip.weights.map((weight, word) =>
                    Array.from({ length: weight }, (_, cell) => (
                      <span key={`${word}-${cell}`} className="h-7 min-w-0 rounded-[2px]" style={{ flex: "1 1 0", backgroundColor: word === 3 ? "#2563eb" : "#94a3b8" }} />
                    )),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
