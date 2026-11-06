import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dedup-contamination — 8-gram, 13-gram, 50글자 substring, 10-token(skip 최대 4).
 * 겹침 길이(9단어, 38글자)와 문장은 설명용 가정이다. 단위가 달라 한 축에 놓지 않는다.
 */
const WORD_COLS = 16;
const OVERLAP_START = 3;
const OVERLAP_LEN = 9;
const CHAR_CELLS = 50;
const CHAR_OVERLAP = 38;
const SKIPPED = [3, 6, 7, 11];
const TOKEN_CELLS = 14;

const SCENES = [
  { label: "GPT-2: 8-gram", summary: "겹침 9단어 ≥ 8 → 잡힘", note: "n-gram은 연속한 n개 단어입니다. 연속 8단어 창이 겹친 구간 안에 들어가므로 오염으로 판정합니다. 이 9단어가 우연히 같은 표현이었다면 오염이 아닌데 오염으로 잡는 false positive입니다." },
  { label: "GPT-3: 13-gram", summary: "겹침 9단어 < 13 → 안 잡힘", note: "같은 겹침이 13단어 창에는 차지 않습니다. 우연한 일치는 피하지만, 이 9단어가 진짜 유출이었다면 놓치게 됩니다. 창이 길수록 이런 일이 늘 수 있습니다." },
  { label: "GPT-4: 50글자", summary: "겹침 38글자 < 50 → 안 잡힘", note: "단위가 단어에서 글자로 바뀝니다. 칸 하나가 한 글자이고, 연속 50글자가 일치해야 잡습니다. 단어 창과 단위가 달라 길이를 직접 견주지는 않습니다." },
  { label: "Llama-2: 10 token", summary: "일치 10개, 건너뜀 4개 → 잡힘", note: "단어 대신 token을 세며 최대 4개 위치를 건너뛸 수 있습니다. 중간이 조금 달라도 일치한 token 10개가 이어지면 겹침으로 봅니다. 건너뛴 자리는 설명용으로 고른 가정입니다." },
  { label: "바꿔 쓴 문장", summary: "창을 채울 연속 일치 없음 → 안 잡힘", note: "뜻은 같아도 표현을 바꾸면 긴 연속 일치가 사라지고, 몇 도처럼 짧은 일치만 남아 어떤 창도 채우지 못합니다. 어느 임계값을 써도 정확 일치 방식으로는 이런 rephrasing 유출을 잡지 못합니다." },
] as const;

function WordRow({ name }: { name: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-muted-foreground">{name}</p>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${WORD_COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: WORD_COLS }, (_, index) => {
          const shared = index >= OVERLAP_START && index < OVERLAP_START + OVERLAP_LEN;
          return <span key={index} className={`h-5 rounded-sm border ${shared ? "border-blue-600 bg-blue-500/30" : "border-border bg-background"}`} />;
        })}
      </div>
    </div>
  );
}

function WindowBar({ size, caught }: { size: number; caught: boolean }) {
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${WORD_COLS}, minmax(0, 1fr))` }}>
      <span
        className={`rounded-sm border py-0.5 text-center text-[11px] font-bold ${caught ? "border-blue-600 text-blue-700 dark:text-blue-400" : "border-dashed border-red-600 text-red-700 dark:text-red-400"}`}
        style={{ gridColumn: `${OVERLAP_START + 1} / span ${size}` }}
      >
        연속 {size}단어 창
      </span>
    </div>
  );
}

export default function OverlapThresholdViz() {
  return (
    <SceneShell
      eyebrow="겹침 임계값"
      title="창의 길이가 무엇을 잡고 무엇을 놓칠지 정합니다"
      description="파란 칸은 평가 문항과 학습 문서에서 똑같이 나타난 부분입니다. 겹침 길이는 임계값의 차이를 보이려고 정한 가정이며, 어떤 모델의 실제 사례도 아닙니다."
      ariaLabel="모델별 contamination 검사 임계값이 같은 겹침을 다르게 판정하는 비교"
      scenes={SCENES}
      render={(active) => {
        if (active <= 1) {
          return (
            <div className="min-w-0 space-y-2">
              <WordRow name="평가 문항 (칸 하나 = 단어 하나)" />
              <WordRow name="학습 문서" />
              <WindowBar size={active === 0 ? 8 : 13} caught={active === 0} />
            </div>
          );
        }
        if (active === 2) {
          return (
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold text-muted-foreground">칸 하나 = 글자 하나, 50칸이 모두 차야 잡힘</p>
              <div className="grid grid-cols-10 gap-0.5">
                {Array.from({ length: CHAR_CELLS }, (_, index) => (
                  <span key={index} className={`h-4 rounded-sm border ${index < CHAR_OVERLAP ? "border-blue-600 bg-blue-500/30" : "border-dashed border-red-600"}`} />
                ))}
              </div>
            </div>
          );
        }
        if (active === 3) {
          return (
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold text-muted-foreground">칸 하나 = token 하나</p>
              <div className="grid grid-cols-7 gap-1 sm:grid-cols-[repeat(14,minmax(0,1fr))]">
                {Array.from({ length: TOKEN_CELLS }, (_, index) => {
                  const skipped = SKIPPED.includes(index);
                  return (
                    <span key={index} className={`rounded-sm border py-1 text-center text-[11px] font-bold ${skipped ? "border-dashed border-amber-600 text-amber-700 dark:text-amber-400" : "border-blue-600 bg-blue-500/30"}`}>
                      {skipped ? "skip" : "일치"}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        }
        return (
          <div className="min-w-0 space-y-2 text-sm">
            <p className="rounded-md border border-border bg-background px-3 py-2"><span className="text-xs font-bold text-muted-foreground">평가 문항 </span>물은 몇 도에서 끓는가</p>
            <p className="rounded-md border border-border bg-background px-3 py-2"><span className="text-xs font-bold text-muted-foreground">학습 문서 </span>끓는점이 몇 도인지 알려 주세요</p>
          </div>
        );
      }}
    />
  );
}
