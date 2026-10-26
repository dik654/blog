import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";

export default function ChainSpecViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="한 규칙 묶음 · 네 판단 경로"
      title="저장된 체인 규칙과 현재 블록 문맥을 함께 읽어 같은 결정을 만듭니다"
      description="Reth v2.8.1의 ChainSpec은 체인·제네시스·하드포크 조건·수수료와 블롭 매개변수를 묶습니다. 아래 네 경로는 같은 입력에서 같은 활성 규칙을 골라야 합니다."
    >
      <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.1fr)_8rem_minmax(0,1.25fr)] lg:items-center">
        <section className="border border-border p-4" aria-label="ChainSpec에 들어 있는 값">
          <p className="text-[10px] font-black text-primary">저장된 규칙 묶음</p>
          <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px">
            {[
              ["체인", "번호 777"],
              ["첫 상태", "G₁₀₀"],
              ["변경 조건", "Timestamp(1,000)"],
              ["매개변수", "수수료 · 블롭"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 bg-background px-3 py-3">
                <span className="block text-[9px] font-bold text-muted-foreground">{label}</span>
                <strong className="mt-1 block break-keep text-xs leading-5">{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <div className="border-y border-border px-3 py-4 text-center" aria-label="현재 블록 문맥">
          <p className="text-[9px] font-bold text-muted-foreground">현재 문맥</p>
          <p className="mt-1 font-mono text-sm font-black">t=1,000</p>
          <p className="mt-2 text-lg text-primary" aria-hidden>→</p>
          <p className="text-xs font-black text-primary">새 규칙</p>
        </div>

        <section className="border border-border p-4" aria-label="같은 규칙 결정을 사용하는 경로">
          <p className="text-[10px] font-black text-primary">같은 결정이 필요한 경로</p>
          <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px">
            {[
              ["검증기", "헤더가 유효한가"],
              ["EVM", "어떤 실행 규칙인가"],
              ["페이로드 빌더", "어떤 필드를 넣는가"],
              ["네트워크", "피어 일정이 맞는가"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 bg-background px-3 py-3">
                <strong className="block break-keep text-xs">{label}</strong>
                <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("chainspec-struct")} />
        </div>
      )}
    </VizFrame>
  );
}
