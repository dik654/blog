import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethFlow, RethStep } from "../../reth-viz-primitives";

export default function ComponentsViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="부품 의존 관계"
      title="앞 부품이 만든 형식이 다음 부품이 받을 수 있는 입력을 정합니다"
      description="거래 풀을 바꾸면 네트워크와 페이로드 빌더가 요구하는 거래 형식도 다시 맞는지 확인해야 합니다."
    >
      <RethFlow>
        <RethStep
          index="01"
          title="실행기"
          body="ChainSpec과 EVM 규칙으로 블록의 상태 변화를 계산합니다."
        />
        <RethStep
          index="02"
          title="거래 풀"
          body="검증된 거래 형식과 후보를 고르는 순서를 제공합니다."
        />
        <RethStep
          index="03"
          title="네트워크·페이로드"
          body="거래 풀과 조회 계층의 출력을 받아 전파와 블록 후보 생성을 구성합니다."
        />
        <RethStep
          index="04"
          title="부가 기능"
          body="RPC·Engine 검증기·ExEx 훅을 핵심 부품의 수명주기 경계에 붙입니다."
          accent
        />
      </RethFlow>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("node-components")} />
        </div>
      )}
    </VizFrame>
  );
}
