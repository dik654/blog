import ModernArticle from "./server-vs-desktop/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { serverVsDesktopFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
export default function ServerVsDesktopArticle() { return <><HardwareTeachOpening data={hardwareTeachCases.serverVsDesktop} /><HardwareTeachMechanism data={hardwareTeachCases.serverVsDesktop}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={serverVsDesktopFieldLab} /></>; }
