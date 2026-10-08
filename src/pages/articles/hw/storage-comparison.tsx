import ModernArticle from "./storage-comparison/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { storageComparisonFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
export default function StorageComparisonArticle() { return <><HardwareTeachOpening data={hardwareTeachCases.storageComparison} /><HardwareTeachMechanism data={hardwareTeachCases.storageComparison}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={storageComparisonFieldLab} /></>; }
