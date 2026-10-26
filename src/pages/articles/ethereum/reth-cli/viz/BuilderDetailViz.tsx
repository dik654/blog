import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethDecision, RethReceipt } from "../../reth-viz-primitives";

export default function BuilderDetailViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="컴파일 단계 · 조립 조건"
      title="빌더 상태는 빠진 의존성을 실행 전에 드러냅니다"
      description="정확한 형식과 메서드 이름은 릴리스마다 달라질 수 있지만, 입력 형식이 다음 단계의 허용 동작을 제한합니다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-3">
        <RethReceipt label="입력" value="NodeConfig<ChainSpec>" />
        <RethReceipt label="조립 완료" value="형식 + 핵심 부품 + 부가 기능" />
        <RethReceipt label="실행 결과" value="NodeHandle + 단계별 시작 기록" />
      </div>
      <div className="mt-6">
        <RethDecision
          question="필수 부품과 부가 기능의 트레이트 조건을 모두 만족합니까?"
          yes="실행 문맥이 데이터베이스와 조회 계층을 열고 부품 빌더를 호출합니다."
          no="현재 빌더 상태에는 실행 메서드가 없거나 트레이트 조건이 성립하지 않습니다."
        />
      </div>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("builder-states")} />
        </div>
      )}
    </VizFrame>
  );
}
