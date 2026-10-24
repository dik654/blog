import VizFrame from "@/components/viz/VizFrame";

const blocks = [
  ["잠재 격자", "h × w × c"],
  ["패치 변환", "N개 토큰 × d"],
  ["DiT 블록", "어텐션 + FFN"],
  ["출력 변환", "N × 패치 정보량"],
  ["격자 복원", "v̂ₜ 또는 ε̂ₜ"],
] as const;

export default function DiffusionTransformerBlockViz() {
  return (
    <VizFrame
      eyebrow="확산 Transformer"
      title="DiT는 잡음 잠재값을 토큰으로 바꾸고 같은 모양의 복원 방향을 돌려줍니다"
      description="Transformer가 이미지 파일을 직접 만드는 것은 아닙니다. 한 표본추출 단계에서 잠재값·시점·조건을 읽고 다음 solver 갱신에 쓸 속도나 잡음 텐서를 냅니다."
      note="원래 DiT의 클래스 조건 실험과 현대 텍스트·이미지 생성의 다중모달 흐름은 같은 구조가 아닙니다. 이 그림은 공통 텐서 계약만 보여 줍니다."
    >
      <div data-viz-canvas className="min-w-0">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:hidden">
          <StageCard index={0} stage={blocks[0]} />
          <FlowArrow direction="right" />
          <StageCard index={1} stage={blocks[1]} />
          <span aria-hidden className="col-span-3 text-center text-primary">↓</span>
          <div className="col-span-3">
            <StageCard index={2} stage={blocks[2]} />
          </div>
          <span aria-hidden className="col-span-3 text-center text-primary">↓</span>
          <StageCard index={3} stage={blocks[3]} />
          <FlowArrow direction="right" />
          <StageCard index={4} stage={blocks[4]} />
        </div>
        <div className="hidden grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-3 md:grid">
          {blocks.map((stage, index) => (
            <div key={stage[0]} className="contents">
              <StageCard index={index} stage={stage} />
              {index < blocks.length - 1 ? <FlowArrow direction="right" /> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-2 border-t border-border pt-4 md:mt-5 md:grid-cols-3 md:gap-3 md:pt-5">
        <Condition label="시점" value="t → 크기·이동·게이트 조절" />
        <Condition label="텍스트·이미지 조건" value="교차 어텐션 또는 결합 흐름" />
        <Condition label="위치" value="2D·3D 위치 부호화로 토큰 위치 보존" />
      </div>
    </VizFrame>
  );
}

function StageCard({ index, stage }: { index: number; stage: (typeof blocks)[number] }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 md:p-4">
      <div className="flex items-baseline gap-2 md:block">
        <p className="shrink-0 text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</p>
        <p className="break-keep text-sm font-bold leading-5 md:mt-2 md:leading-6">{stage[0]}</p>
      </div>
      <p className="mt-1 break-keep font-mono text-[10px] leading-4 text-muted-foreground md:mt-2 md:text-xs md:leading-5">{stage[1]}</p>
    </div>
  );
}

function FlowArrow({ direction }: { direction: "right" }) {
  return <span aria-hidden className="text-center text-primary">{direction === "right" ? "→" : "↓"}</span>;
}

function Condition({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-primary/45 pl-4">
      <p className="text-xs font-black">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{value}</p>
    </div>
  );
}
