import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function EccPathViz() {
  return (
    <HardwareViz
      title="ECC는 하나의 방패가 아니라 서로 다른 보호 경계입니다"
      description="DDR5 on-die ECC, system ECC와 운영 복구가 다루는 오류 위치를 순서대로 분리합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="DRAM cell array"
          detail="on-die ECC가 die 내부 read를 교정"
          tone="violet"
        />
        <HardwareArrow label="DQ / module" />
        <HardwareNode
          title="System codeword"
          detail="controller + ECC DIMM의 check bits"
          tone="blue"
        />
        <HardwareArrow label="syndrome" />
        <HardwareNode
          title="RAS operation"
          detail="log · isolate · replace · verify"
          tone="emerald"
        />
      </div>
      <div className="mt-5">
        <HardwareNode
          title="남는 경계"
          detail="On-die ECC는 module·bus 오류를 대신 보호하지 않으며, system ECC도 machine·service·backup 장애 영역을 대신하지 않습니다."
          tone="rose"
        />
      </div>
    </HardwareViz>
  );
}
