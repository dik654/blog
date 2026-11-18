import NetworkRouteIntro from "./network/NetworkRouteIntro";
import Interconnect from "./network/Interconnect";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { interconnectFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";
import InterconnectBarrierViz from "./network/viz/InterconnectBarrierViz";

export default function GpuInterconnectsArticle() {
  return <article><HardwareTeachOpening data={hardwareTeachCases.interconnect} numbersVisual={<InterconnectBarrierViz />} /><HardwareTeachMechanism data={hardwareTeachCases.interconnect}><NetworkRouteIntro mode="interconnect" /><Interconnect /></HardwareTeachMechanism><HardwareFieldLab data={interconnectFieldLab} /></article>;
}
