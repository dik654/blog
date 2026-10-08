import ModernArticle from "./gpu-comparison/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { gpuComparisonFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function GPUComparisonArticle() {
  return <><HardwareTeachOpening data={hardwareTeachCases.gpuComparison} /><HardwareTeachMechanism data={hardwareTeachCases.gpuComparison}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={gpuComparisonFieldLab} /></>;
}
