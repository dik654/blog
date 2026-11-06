import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mixture — GPT-3의 원본 비중·weight·epoch.
 * 300B × 60% = 180B, 300B × 3% = 9B. 역산: 180B ÷ 0.44 ≈ 409B, 9B ÷ 3.4 ≈ 2.6B.
 * Wikipedia의 원본 비중은 글에 "1%도 안 됨"으로만 있어 막대 길이를 정하지 않는다.
 */
const SOURCES = [
  { name: "Common Crawl (필터링)", share: 82, shareText: "약 82%", weight: 60, tokens: "180B", epochs: 0.44, color: "#2563eb" },
  { name: "Wikipedia", share: null, shareText: "1%도 안 됨", weight: 3, tokens: "9B", epochs: 3.4, color: "#d97706" },
];
const PASS_SLOTS = [0, 1, 2, 3];
const TRAINING = 300;

const SCENES = [
  { label: "원본 비중", summary: "토큰 수로 약 82% · 1% 미만", note: "먼저 전체 원본 토큰 중 몇 퍼센트인지입니다. Wikipedia는 글에 정확한 값이 없어 막대 없이 범위만 적었습니다." },
  { label: "Mixture weight", summary: "60% · 3%", note: "학습에 넣을 비율은 원본 비중과 다릅니다. Common Crawl은 줄고 Wikipedia는 올랐습니다. 두 값을 바꿔 읽으면 안 됩니다." },
  { label: "300B token 배분", summary: "180B · 9B", note: `학습 token ${TRAINING}B에 weight를 곱하면 각각이 받는 양입니다. 300B × 60% = 180B, 300B × 3% = 9B입니다.` },
  { label: "몇 번 돌았나", summary: "0.44 epoch · 3.4 epoch", note: "epoch은 source 전체를 한 번 보는 단위입니다. Common Crawl은 다 못 보고 Wikipedia는 같은 문서를 여러 번 봅니다. 역산한 원본은 약 409B와 2.6B입니다." },
] as const;

function Bar({ label, value, text, color, on }: { label: string; value: number | null; text: string; color: string; on: boolean }) {
  return (
    <div className={`grid grid-cols-[4.75rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs ${on ? "" : "opacity-35"}`}>
      <span className={on ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-3 rounded-sm bg-muted/40">
        {value !== null && <div className="h-full rounded-sm" style={{ width: `${value}%`, backgroundColor: color }} />}
      </div>
      <span className="text-right font-mono">{text}</span>
    </div>
  );
}

export default function MixtureEpochViz() {
  return (
    <SceneShell
      eyebrow="비중과 반복 횟수"
      title="원본에서 큰 쪽은 덜 돌고 작은 쪽은 여러 번 돕니다"
      description="GPT-3 데이터 중 글이 epoch까지 준 두 source입니다. 막대는 전체가 100%, epoch 칸은 하나가 1 epoch입니다."
      ariaLabel="Common Crawl과 Wikipedia의 원본 비중, mixture weight, 학습 token, epoch 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          {SOURCES.map((source) => {
            const whole = Math.floor(source.epochs);
            return (
              <div key={source.name} className="min-w-0 space-y-0.5">
                <p className="text-sm font-bold">{source.name}</p>
                <Bar label="원본 비중" value={source.share} text={source.shareText} color="#94a3b8" on={active === 0} />
                <Bar label="weight" value={source.weight} text={`${source.weight}%`} color={source.color} on={active === 1} />
                <p className={`grid grid-cols-[4.75rem_minmax(0,1fr)] gap-2 text-xs ${active === 2 ? "font-bold" : "opacity-35"}`}>
                  <span>학습 token</span>
                  <span className="font-mono">{active >= 2 ? `${TRAINING}B × ${source.weight}% = ${source.tokens}` : "−"}</span>
                </p>
                <div className={`grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-2 text-xs ${active === 3 ? "" : "opacity-35"}`}>
                  <span className="font-bold">{active === 3 ? `${source.epochs} epoch` : "epoch"}</span>
                  <div className="grid grid-cols-4 gap-1">
                    {PASS_SLOTS.map((slot) => {
                      const fill = active !== 3 ? 0 : slot < whole ? 100 : slot === whole ? Math.round((source.epochs - whole) * 100) : 0;
                      return (
                        <div key={slot} className="h-3 rounded-sm border border-border bg-background">
                          <div className="h-full" style={{ width: `${fill}%`, backgroundColor: source.color }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
