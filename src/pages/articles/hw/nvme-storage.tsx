import ModernArticle from "./nvme-storage/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { nvmeFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
import FlashRewriteViz from "./nvme-storage/viz/FlashRewriteViz";
export default function NVMeStorageArticle() { return <><HardwareTeachOpening data={hardwareTeachCases.nvme} pathVisual={<FlashRewriteViz />} /><HardwareTeachMechanism data={hardwareTeachCases.nvme}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={nvmeFieldLab} /></>; }
