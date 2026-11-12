import SceneShell from "./SceneShell";

/**
 * 본문 대응: #xgrammar — 매 step 전체 vocabulary 검사 vs 대부분은 미리 계산·소수만 매 step 검사, stack 상태 재사용.
 * 칸 40개 중 4개를 state 의존 token으로 둔 것은 그림용 가정이다. 본문은 "대부분/소수"라고만 말하며
 * 실제 vocabulary는 수만 개다.
 */
const CELLS = 40;
const DEPENDENT = new Set([6, 17, 23, 34]);
const STEPS = [1, 2, 3] as const;

const SCENES = [
  {
    label: "그대로 구현하면 매 step 전체를 검사합니다",
    summary: "step마다 칸 전부",
    note: "칸 하나가 vocabulary token 하나입니다(칸 수는 그림용 가정). 모든 token을 매 step grammar에 넣어 보면 step이 늘 때마다 같은 양의 검사가 반복됩니다.",
  },
  {
    label: "대부분은 state와 무관하게 결과가 같습니다",
    summary: "미리 분류 · 소수만 남김",
    note: "Context-independent token은 지금 grammar state가 무엇이든 판정 결과가 늘 같은 token입니다. 이런 칸은 생성 전에 한 번 계산해 둡니다. 점선 강조 칸만 state에 따라 결과가 달라집니다.",
  },
  {
    label: "매 step에는 강조 칸만 다시 봅니다",
    summary: "step마다 소수 칸",
    note: "회색 칸은 저장해 둔 결과를 그대로 쓰고, state에 따라 달라지는 context-dependent token만 매 step 다시 검사합니다. 위 step 막대의 길이는 이 그림의 칸 수 비율이며 논문 배율이 아닙니다.",
  },
  {
    label: "같은 stack 상태는 한 번만 저장합니다",
    summary: "복제 대신 재사용",
    note: "Stack은 아직 닫지 않은 중첩을 쌓아 두는 기억 장소입니다. CFG recursion이 같은 stack 상태를 여러 번 만들 때 매번 복사하지 않고 저장해 둔 하나를 함께 가리킵니다.",
  },
] as const;

function Grid({ mode }: { mode: "all" | "split" | "dependent" }) {
  return (
    <div className="grid grid-cols-10 gap-1" aria-hidden>
      {Array.from({ length: CELLS }, (_, index) => {
        const dep = DEPENDENT.has(index);
        const cls =
          mode === "all"
            ? "border-primary bg-primary/15"
            : dep
              ? `border-dashed border-primary ${mode === "dependent" ? "bg-primary/25" : ""}`
              : "border-border bg-muted/60";
        return <span key={index} className={`h-5 rounded-sm border sm:h-6 ${cls}`} />;
      })}
    </div>
  );
}

function StepBars({ share }: { share: number }) {
  return (
    <div className="mt-3 space-y-1">
      {STEPS.map((step) => (
        <div key={step} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 text-[11px]">
          <span className="font-mono text-muted-foreground">step {step}</span>
          <div className="h-3 min-w-0 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm bg-primary/70" style={{ width: `${share * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="pt-1 text-[11px] text-muted-foreground">막대 = 그 step에 grammar로 검사하는 칸 수</p>
    </div>
  );
}

function StackColumn({ items, caption }: { items: readonly string[]; caption: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {items
        .slice()
        .reverse()
        .map((item, index) => (
          <span key={index} className="flex h-7 w-16 items-center justify-center rounded border border-border font-mono text-xs">
            {item}
          </span>
        ))}
      <span className="mt-1 text-[11px] text-muted-foreground">{caption}</span>
    </div>
  );
}

const STACK = ["[", "[", "["] as const;

export default function XGrammarCheckSplitViz() {
  return (
    <SceneShell
      eyebrow="검사량 나누기"
      title="미리 계산할 칸과 매 step 볼 칸을 나눕니다"
      description="칸 40개 중 점선 4칸만 state에 따라 결과가 달라진다고 둔 그림입니다(가정). 본문은 '대부분'과 '소수'라고만 말하며 실제 vocabulary는 수만 개입니다."
      ariaLabel="전체 vocabulary 검사, context-independent token 사전 계산, 소수 token만 매 step 검사, stack 상태 재사용"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          return (
            <div className="grid min-h-[14rem] grid-cols-2 items-end gap-4">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-muted-foreground">복제</p>
                <div className="flex gap-3">
                  <StackColumn items={STACK} caption="경로 A 사본" />
                  <StackColumn items={STACK} caption="경로 B 사본" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-primary">재사용</p>
                <div className="flex gap-2 text-[11px] text-primary">
                  <span>경로 A ↘</span>
                  <span>↙ 경로 B</span>
                </div>
                <StackColumn items={STACK} caption="저장된 stack 하나" />
              </div>
              <p className="col-span-2 text-center text-[11px] text-muted-foreground">stack 내용 [ [ [는 그림용 가정</p>
            </div>
          );
        }
        const mode = active === 0 ? "all" : active === 1 ? "split" : "dependent";
        return (
          <div className="min-h-[14rem]">
            <Grid mode={mode} />
            {active === 0 ? (
              <p className="mt-2 text-[11px] text-muted-foreground">
                <span className="mr-1 inline-block h-3 w-3 rounded-sm border border-primary bg-primary/15 align-middle" />
                모든 칸을 매 step grammar에 넣어 봄
              </p>
            ) : (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span>
                <span className="mr-1 inline-block h-3 w-3 rounded-sm border border-border bg-muted/60 align-middle" />
                미리 계산해 둔 token
              </span>
              <span>
                <span className="mr-1 inline-block h-3 w-3 rounded-sm border border-dashed border-primary align-middle" />
                state에 따라 달라지는 token
              </span>
            </div>
            )}
            {active === 1 ? (
              <p className="mt-3 text-[11px] text-muted-foreground">생성 전 한 번: 회색 칸의 판정 결과를 저장</p>
            ) : (
              <StepBars share={active === 0 ? 1 : DEPENDENT.size / CELLS} />
            )}
          </div>
        );
      }}
    />
  );
}
