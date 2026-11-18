import SceneShell from "./SceneShell";

/**
 * 본문 대응: #train-sample — teacher forcing은 정답 prefix가 모두 있어 위치별 score를 함께 계산하고,
 * sampling은 x₁을 뽑아야 x₂의 조건이 생기므로 T번의 결정이 순서대로 이어진다.
 * KV cache는 이전 projection 재계산을 줄이지만 순서(token dependency)는 그대로다. T=4는 가정.
 */
const SCENES = [
  {
    label: "학습: 정답 prefix가 이미 있습니다",
    summary: "4개 위치를 함께 계산 가능",
    note: "Teacher forcing은 학습 때 model이 뽑은 token 대신 dataset의 정답 token을 prefix로 넣는 방식입니다. 네 위치의 조건이 모두 미리 정해져 있으므로 x₁~x₄의 score를 기다림 없이 함께 계산할 수 있습니다.",
  },
  {
    label: "생성: 앞 token을 뽑아야 다음 조건이 생깁니다",
    summary: "4번의 결정이 순서대로",
    note: "생성 때는 정답이 없습니다. 1단계에서 x₁을 뽑아야 2단계의 prefix가 생기므로 네 결정이 한 줄로 이어집니다. 여기서는 단계마다 앞 위치들의 중간 계산 결과(본문의 hidden projection)를 다시 계산한다고 둡니다(가정).",
  },
  {
    label: "KV cache: 재계산은 줄고 순서는 남습니다",
    summary: "여전히 4단계",
    note: "KV cache는 앞 token에서 계산한 hidden projection을 저장해 다음 단계에서 다시 쓰는 방법입니다. 주황 재계산 칸이 회색 재사용 칸으로 바뀌지만, 단계 수는 그대로 4이고 x₂는 여전히 x₁을 기다립니다.",
  },
] as const;

const POSITIONS = ["x₁", "x₂", "x₃", "x₄"] as const;

type Cell = { text: string; tone: "new" | "old" | "empty" | "cache" };

function cellFor(step: number, pos: number, cache: boolean): Cell {
  if (pos === step) return { text: "뽑음", tone: "new" };
  if (pos < step) return cache ? { text: "재사용", tone: "cache" } : { text: "재계산", tone: "old" };
  return { text: "대기", tone: "empty" };
}

const TONE: Record<Cell["tone"], string> = {
  new: "border-[#2563eb] bg-[#2563eb]/10 font-bold text-[#1d4ed8] dark:text-[#93c5fd]",
  old: "border-[#d97706] bg-[#d97706]/10 text-[#b45309] dark:text-[#fbbf24]",
  cache: "border-border bg-muted/40 text-muted-foreground",
  empty: "border-dashed border-border text-muted-foreground/60",
};

export default function TrainVsSampleViz() {
  return (
    <SceneShell
      eyebrow="학습과 생성"
      title="학습은 함께 계산하고 생성은 한 칸씩 기다립니다"
      description="길이 T=4인 sequence(가정)를 위치 x₁~x₄로 나눴습니다. 위 줄은 학습, 아래 네 줄은 생성의 단계별 상태입니다. Prefix는 현재 위치 앞의 token 묶음입니다."
      ariaLabel="teacher forcing 학습의 동시 계산과 생성의 순차 단계, KV cache 적용 전후 비교"
      scenes={SCENES}
      render={(active) => {
        const trainOn = active === 0;
        const genOn = active >= 1;
        const cache = active >= 2;
        return (
          <div className="min-w-0 text-[11px] sm:text-xs">
            <div className="grid grid-cols-[4.5rem_repeat(4,minmax(0,1fr))] gap-1.5">
              <span />
              {POSITIONS.map((p) => (
                <span key={p} className="text-center font-mono font-bold">{p}</span>
              ))}
              <span className={`self-center font-bold ${trainOn ? "text-foreground" : "text-muted-foreground"}`}>학습 1회</span>
              {POSITIONS.map((p) => (
                <span
                  key={`t-${p}`}
                  className={`rounded-md border px-1 py-1.5 text-center ${trainOn ? TONE.new : "border-border text-muted-foreground"}`}
                >
                  정답
                </span>
              ))}
            </div>
            <div className="my-3 border-t border-border" />
            <div className={`grid grid-cols-[4.5rem_repeat(4,minmax(0,1fr))] gap-1.5 ${genOn ? "" : "opacity-40"}`}>
              {[0, 1, 2, 3].map((step) => (
                <div key={step} className="contents">
                  <span className="self-center font-bold">생성 {step + 1}단계</span>
                  {POSITIONS.map((p, pos) => {
                    const cell = genOn ? cellFor(step, pos, cache) : { text: "·", tone: "empty" as const };
                    return (
                      <span key={`${step}-${p}`} className={`rounded-md border px-1 py-1.5 text-center ${TONE[cell.tone]}`}>
                        {cell.text}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-border pt-3 text-right font-mono font-bold">
              {active === 0 ? "학습: 위치 4개를 함께" : cache ? "생성: 4단계 · 재계산 칸 0개" : "생성: 4단계 · 재계산 칸 6개"}
            </p>
          </div>
        );
      }}
    />
  );
}
