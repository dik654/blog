import {
  HardwareArrow,
  HardwareNode,
  HardwareViz,
} from "@/components/viz/hardware-flow";

export default function EthernetFabricViz() {
  return (
    <HardwareViz
      title="Ethernet link는 port 모양이 아니라 compatibility chain입니다"
      description="양 끝의 MAC rate부터 media까지 모두 맞아야 link가 성립하고, 그 뒤에도 shared fabric capacity를 확인합니다."
    >
      <div className="grid min-w-0 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <HardwareNode
          title="MAC rate"
          detail="endpoint speed · breakout"
          tone="neutral"
        />
        <HardwareArrow />
        <HardwareNode
          title="Lane · PHY"
          detail="grouping · encoding · FEC"
          tone="violet"
        />
        <HardwareArrow />
        <HardwareNode
          title="Module · media"
          detail="DAC · AOC · optic · fiber"
          tone="blue"
        />
        <HardwareArrow />
        <HardwareNode
          title="Fabric path"
          detail="ECMP · queue · active uplink"
          tone="emerald"
        />
      </div>
      <div className="mt-5">
        <HardwareNode
          title="운영 counter"
          detail="FEC·CRC·drop·queue·flap을 application p99와 같은 시간축에서 비교합니다."
          tone="amber"
        />
      </div>
    </HardwareViz>
  );
}
