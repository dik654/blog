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
