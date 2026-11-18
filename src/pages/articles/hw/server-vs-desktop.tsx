import ModernArticle from "./server-vs-desktop/ModernArticle";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { serverVsDesktopFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
import LaneBudgetViz from "./server-vs-desktop/viz/LaneBudgetViz";
export default function ServerVsDesktopArticle() { return <><HardwareTeachOpening data={hardwareTeachCases.serverVsDesktop} numbersVisual={<LaneBudgetViz />} /><HardwareTeachMechanism data={hardwareTeachCases.serverVsDesktop}><ModernArticle /></HardwareTeachMechanism><HardwareFieldLab data={serverVsDesktopFieldLab} /></>; }
