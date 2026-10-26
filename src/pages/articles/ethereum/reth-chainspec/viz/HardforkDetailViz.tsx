import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";

export default function HardforkDetailViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="경계 판정 · 같은 조건의 앞과 뒤"
      title="시각 조건은 블록 번호가 아니라 후보 헤더의 시각과 비교합니다"
      description="변경 시각 1,000이라는 설명용 조건에 후보 시각 999와 1,000을 각각 넣어 봅니다."
      note="1,000은 작동 원리를 보기 위한 가정입니다. 실제 체인 일정은 고정한 ChainSpec과 공식 네트워크 규격에서 확인합니다."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { time: "999", expression: "999 ≥ 1,000", answer: "거짓", rule: "이전 규칙 유지" },
          { time: "1,000", expression: "1,000 ≥ 1,000", answer: "참", rule: "새 규칙 선택" },
        ].map((item) => (
          <section key={item.time} className="border border-border p-4">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <span className="text-[10px] font-bold text-muted-foreground">후보 헤더 시각</span>
              <strong className="font-mono text-lg">{item.time}</strong>
            </div>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_5rem] gap-px bg-border p-px">
              <div className="min-w-0 bg-background px-3 py-3 font-mono text-sm font-black">{item.expression}</div>
              <div className="min-w-0 bg-background px-3 py-3 text-center text-sm font-black text-primary">{item.answer}</div>
            </div>
            <p className="mt-3 break-keep text-sm font-bold">{item.rule}</p>
          </section>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4" aria-label="ForkCondition이 구분하는 네 조건">
        {[
          ["블록 번호", "n ≥ N"],
          ["누적 난이도", "D−d ≥ Df"],
          ["헤더 시각", "t ≥ T"],
          ["비활성", "항상 거짓"],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 bg-background px-3 py-3">
            <strong className="block break-keep text-xs">{label}</strong>
            <span className="mt-1 block font-mono text-[10px] text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("fork-condition")} />
        </div>
      )}
    </VizFrame>
  );
}
