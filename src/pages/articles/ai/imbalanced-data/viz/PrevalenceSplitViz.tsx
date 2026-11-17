import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 1,000명 중 positive 50명(π=5%), all-negative model.
 * 칸 하나 = 10명, 100칸 중 5칸이 positive.
 * accuracy = 950/1000 = 95%, recall = 0/50 = 0. 50:50 batch는 model이 보는 비율만 바꾼다.
 */
const CELLS = 100;
const PER_CELL = 10;
const POSITIVE_CELLS = 5;

const SCENES = [
  { label: "모집단 나누기", summary: "950 negative + 50 positive", note: "칸 하나가 10명입니다. 100칸 중 진하게 칠한 5칸, 곧 50명이 positive이고 prevalence(전체 중 positive 비율)는 50/1,000=5%입니다." },
  { label: "모두 negative라고 답함", summary: "accuracy 950/1,000 = 95%", note: "Model이 모든 칸에 negative라고 답했습니다. 맞힌 것은 negative 950명이고 분모는 1,000명 전체라 accuracy는 95%입니다. Positive 50명은 전부 틀렸습니다." },
  { label: "Recall은 분모가 다름", summary: "recall 0/50 = 0", note: "Recall은 실제 positive 가운데 찾아낸 비율입니다. 분모가 positive 50명뿐이라 negative 950명을 맞힌 것은 들어가지 않고, 찾은 positive가 0명이므로 0입니다." },
  { label: "50:50 학습 batch", summary: "batch 50% · 운영 population 5%", note: "Sampling으로 학습 batch를 50:50으로 만들어도 바뀌는 것은 model이 보는 비율뿐입니다. 그림의 1,000명, 곧 운영 population은 여전히 positive 5%입니다." },
] as const;

const POS = "#dc2626";
const NEG = "#94a3b8";
const OK = "#2563eb";

function Ratio({ label, positiveShare, text }: { label: string; positiveShare: number; text: string }) {
  return (
    <div className="space-y-1 text-xs sm:text-sm">
      <div className="flex justify-between gap-2">
        <span className="font-semibold">{label}</span>
        <span className="font-mono">{text}</span>
      </div>
      <div className="flex h-4 overflow-hidden rounded-sm border border-border">
        <div style={{ width: `${(1 - positiveShare) * 100}%`, backgroundColor: NEG }} />
        <div style={{ width: `${positiveShare * 100}%`, backgroundColor: POS }} />
      </div>
    </div>
  );
}

export default function PrevalenceSplitViz() {
  return (
    <SceneShell
      eyebrow="π = 5%"
      title="같은 all-negative 답이 accuracy 95%와 recall 0을 동시에 만듭니다"
      description="칸 하나가 10명입니다. 빨간 칸이 실제 positive, 회색 칸이 실제 negative입니다. 두 지표는 분자뿐 아니라 분모가 다릅니다."
      ariaLabel="1,000명 중 50명 positive에서 all-negative model의 accuracy 95%, recall 0, 그리고 50:50 학습 batch와 운영 비율 비교"
      scenes={SCENES}
      render={(active) => {
        const predicting = active >= 1 && active <= 2;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center">
            <div className="mx-auto w-full max-w-[10rem] sm:max-w-[15rem]">
            <svg viewBox="0 0 200 200" role="img" aria-label={SCENES[active].summary} className="mx-auto block h-auto w-full">
              {Array.from({ length: CELLS }, (_, i) => {
                const row = Math.floor(i / 10);
                const col = i % 10;
                const positive = i >= CELLS - POSITIVE_CELLS;
                const inDenominator = active === 2 ? positive : true;
                const counted = active === 1 && !positive;
                const fill = positive ? POS : counted ? OK : NEG;
                return (
                  <g key={i} opacity={inDenominator ? 1 : 0.15}>
                    <rect x={2 + col * 19.6} y={2 + row * 19.6} width="16" height="16" rx="2" fill={fill} />
                    {predicting && positive ? (
                      <path d={`M${6 + col * 19.6},${6 + row * 19.6} l8,8 m0,-8 l-8,8`} stroke="#ffffff" strokeWidth="1.25" />
                    ) : null}
                  </g>
                );
              })}
            </svg>
            </div>
            <div className="min-h-[8.5rem] min-w-0 space-y-3 text-sm leading-6">
              {active === 0 ? (
                <>
                  <Ratio label="Negative" positiveShare={0} text={`${(CELLS - POSITIVE_CELLS) * PER_CELL}명`} />
                  <Ratio label="Positive" positiveShare={1} text={`${POSITIVE_CELLS * PER_CELL}명`} />
                  <p className="font-mono">π = 50 / 1,000 = 5%</p>
                </>
              ) : null}
              {active === 1 ? (
                <>
                  <p><span className="font-semibold" style={{ color: OK }}>파란 칸</span> = negative라고 답해 맞힌 950명</p>
                  <p><span className="font-semibold" style={{ color: POS }}>× 칸</span> = 놓친 positive 50명</p>
                  <p className="font-mono">accuracy = 950 / 1,000 = 95%</p>
                </>
              ) : null}
              {active === 2 ? (
                <>
                  <p>분모 = 실제 positive 50명만 (흐린 칸은 제외)</p>
                  <p>찾은 positive = 0명</p>
                  <p className="font-mono">recall = 0 / 50 = 0</p>
                </>
              ) : null}
              {active === 3 ? (
                <>
                  <Ratio label="학습 batch (sampling 후)" positiveShare={0.5} text="50 : 50" />
                  <Ratio label="운영 population" positiveShare={0.05} text="5%" />
                  <p className="text-muted-foreground">Batch 크기는 이 글이 정하지 않아 비율만 그렸습니다.</p>
                </>
              ) : null}
            </div>
          </div>
        );
      }}
    />
  );
}
