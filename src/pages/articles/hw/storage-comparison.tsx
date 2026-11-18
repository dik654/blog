import ModernArticle from "./storage-comparison/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { storageComparisonFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
import CheckpointLossViz from "./storage-comparison/viz/CheckpointLossViz";
export default function StorageComparisonArticle() { return <><HardwareTeachOpening data={hardwareTeachCases.storageComparison} numbersVisual={<CheckpointLossViz />} /><HardwareTeachMechanism data={hardwareTeachCases.storageComparison}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={storageComparisonFieldLab} /></>; }
