import ModernArticle from "./power-cooling/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { powerCoolingFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
export default function PowerCoolingArticle() { return <><HardwareTeachOpening data={hardwareTeachCases.powerCooling} /><HardwareTeachMechanism data={hardwareTeachCases.powerCooling}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={powerCoolingFieldLab} /></>; }
