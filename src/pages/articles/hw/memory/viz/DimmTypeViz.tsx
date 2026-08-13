import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function DimmTypeViz() {
  return (
    <HardwareViz
      title="DIMM 이름은 전기적 load와 data path의 선택입니다"
      description="용량 순위표가 아니라 controller가 어떤 buffer와 rank 구조를 지원하는지 따라갑니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="Memory controller"
          detail="지원 type · channel · DPC"
          tone="blue"
        />
        <HardwareArrow label="CA / data" />
        <HardwareNode
          title="Buffer choice"
          detail="UDIMM direct · RDIMM RCD · MRDIMM mux"
          tone="violet"
        />
        <HardwareArrow label="drive ranks" />
        <HardwareNode
          title="DRAM geometry"
          detail="rank · density · 3DS stack"
          tone="emerald"
        />
      </div>
      <div className="mt-5">
        <HardwareNode
          title="승인 조건"
          detail="CPU memory specification, board QVL, slot population rule와 firmware revision이 모두 맞아야 합니다."
          tone="amber"
        />
      </div>
    </HardwareViz>
  );
}
