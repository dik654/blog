import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";

export default function GenesisViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="초기값 하나의 전파"
      title="Alice의 잔액 100을 101로 바꾸면 첫 블록의 해시까지 달라집니다"
      description="두 설정은 체인 번호 777과 나머지 입력이 모두 같다고 가정합니다. 다른 값은 Alice의 초기 잔액 하나뿐입니다."
      note="R₁₀₀·G₁₀₀은 실제 해시값이 아니라 서로 다른 결과가 만들어짐을 나타내는 기호입니다."
    >
      <div className="grid gap-3">
        {[
          ["설정 A", "Alice=100", "계정 인코딩 A", "상태 루트 R₁₀₀", "첫 블록 해시 G₁₀₀"],
          ["설정 B", "Alice=101", "계정 인코딩 B", "상태 루트 R₁₀₁", "첫 블록 해시 G₁₀₁"],
        ].map(([name, balance, account, root, genesis], branchIndex) => (
          <section key={name} className="grid gap-px bg-border p-px sm:grid-cols-[6rem_repeat(4,minmax(0,1fr))] sm:items-stretch">
            <div className="min-w-0 bg-background px-3 py-3">
              <span className="text-[9px] font-bold text-muted-foreground">체인 777</span>
              <strong className="mt-1 block text-xs">{name}</strong>
            </div>
            {[balance, account, root, genesis].map((value, index) => (
              <div key={value} className="min-w-0 bg-background px-3 py-3">
                <span className="block text-[9px] font-bold text-muted-foreground">
                  {index === 0 ? "초기 계정" : index === 1 ? "정규화" : index === 2 ? "상태 약속" : "체인 정체성"}
                </span>
                <strong className={`mt-1 block break-keep text-xs leading-5 ${branchIndex === 1 && index >= 2 ? "text-primary" : ""}`}>{value}</strong>
              </div>
            ))}
          </section>
        ))}
      </div>
      <div className="mt-4 border-y border-border py-3 text-center">
        <p className="break-keep text-sm font-black">R₁₀₀ ≠ R₁₀₁이므로 G₁₀₀ ≠ G₁₀₁입니다.</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">체인 번호가 같아도 첫 상태가 다르면 같은 장부에서 출발하지 않습니다.</p>
      </div>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("make-genesis")} />
        </div>
      )}
    </VizFrame>
  );
}
