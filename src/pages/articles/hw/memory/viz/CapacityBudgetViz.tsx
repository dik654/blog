import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function CapacityBudgetViz() {
  return (
    <HardwareViz
      eyebrow="용량 계산"
      title="256GiB가 탈락하는 용량 장부"
      description="숫자는 제품 권장이 아니라 working-set 장부를 따라가는 설명용 사례입니다."
      note="236GiB의 20%는 47.2GiB입니다. 따라서 요구량은 283.2GiB이며, 공유 page와 reclaim까지 정확히 예측하려면 실제 workload trace가 더 필요합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="실제 작업"
          metric="peak RSS 180GiB"
          detail="가장 많이 쓴 시점의 resident data"
          tone="blue"
        />
        <HardwareArrow label="+" />
        <HardwareNode
          title="함께 쓰는 공간"
          metric="24 + 32 = 56GiB"
          detail="OS·cache와 동시 job"
          tone="violet"
        />
        <HardwareArrow label="=" />
        <HardwareNode
          title="현재 필요량"
          metric="180 + 56 = 236GiB"
          detail="성장 여유를 넣기 전"
          tone="emerald"
        />
      </div>
      <div className="mt-3 grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="성장 여유 20%"
          metric="236 × 0.20 = 47.2GiB"
          detail="늘어날 작업과 측정 오차를 위한 가정"
          tone="amber"
        />
        <HardwareArrow label="+" />
        <HardwareNode
          title="최종 요구량"
          metric="236 + 47.2 = 283.2GiB"
          detail="지원 가능한 다음 구성과 비교"
          tone="blue"
        />
        <HardwareArrow label="compare" />
        <HardwareNode
          title="256GiB 구성"
          metric="256 < 283.2 · 탈락"
          detail="benchmark 전에 capacity gate에서 중지"
          tone="rose"
        />
      </div>
    </HardwareViz>
  );
}
