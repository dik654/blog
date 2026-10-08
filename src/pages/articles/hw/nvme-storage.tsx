import ModernArticle from "./nvme-storage/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { nvmeFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
export default function NVMeStorageArticle() { return <><HardwareTeachOpening data={hardwareTeachCases.nvme} /><HardwareTeachMechanism data={hardwareTeachCases.nvme}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={nvmeFieldLab} /></>; }
