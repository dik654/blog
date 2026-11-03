import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function NetworkBudgetViz() {
  return (
    <HardwareViz
      eyebrow="같은 TRAFFIC의 두 장부"
      title="포트 상한과 장애 뒤 완료 속도를 따로 계산합니다"
      description="첫 줄은 한 flow의 payload goodput, 둘째 줄은 leaf 전체의 aggregate capacity 사례입니다."
      note="두 계산 모두 출발점입니다. 실제 승인은 같은 traffic matrix에서 ECMP 불균형·queue·retransmit과 p99 completion을 함께 측정합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <HardwareNode title="광고 속도" metric="800Gb/s ÷ 8" detail="bit를 byte로 단위 변환" tone="violet" />
        <HardwareArrow label="=" />
        <HardwareNode title="물리 상한" metric="100GB/s" detail="protocol·queue 전 raw ceiling" tone="blue" />
        <HardwareArrow label="measure" />
        <HardwareNode title="실제 payload" metric="80GB ÷ 1.1s = 72.7GB/s" detail="완료한 유효 byte만 계산" tone="emerald" />
      </div>
      <div className="mt-3 grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <HardwareNode title="Host 요구량" metric="8 × 100G = 800G" detail="같은 leaf의 단방향 합" tone="violet" />
        <HardwareArrow label="compare" />
        <HardwareNode title="정상 uplink" metric="4 × 200G = 800G · 1.00:1" detail="이상적 aggregate는 동일" tone="emerald" />
        <HardwareArrow label="1 link down" />
        <HardwareNode title="장애 uplink" metric="800 ÷ 600 = 1.33:1" detail="한 경로가 빠진 뒤 oversubscribed" tone="rose" />
      </div>
    </HardwareViz>
  );
}
