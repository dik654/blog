import Overview from "./memory/Overview";
import DDR from "./memory/DDR";
import ECC from "./memory/ECC";
import RDIMM from "./memory/RDIMM";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { memoryFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function MemoryArticle() {
  return (
    <>
      <p className="mb-10 border-l-2 border-primary pl-4 text-lg font-semibold leading-8 text-foreground">
        한 문장 답: 서버 메모리는 DIMM 용량 합계가 아니라, 작업이 요구하는 byte를
        담고 모든 채널로 제때 공급하며 오류가 난 물리 위치를 찾아 격리할 수 있는
        구성으로 고릅니다.
      </p>
      <HardwareTeachOpening data={hardwareTeachCases.memory} />
      <HardwareTeachMechanism data={hardwareTeachCases.memory}>
        <Overview />
        <DDR />
        <ECC />
        <RDIMM />
      </HardwareTeachMechanism>
      <HardwareFieldLab data={memoryFieldLab} />
    </>
  );
}
