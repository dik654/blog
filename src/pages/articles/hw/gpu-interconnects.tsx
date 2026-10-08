import NetworkRouteIntro from "./network/NetworkRouteIntro";
import Interconnect from "./network/Interconnect";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { interconnectFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function GpuInterconnectsArticle() {
  return <article><HardwareTeachOpening data={hardwareTeachCases.interconnect} /><HardwareTeachMechanism data={hardwareTeachCases.interconnect}><NetworkRouteIntro mode="interconnect" /><Interconnect /></HardwareTeachMechanism><HardwareFieldLab data={interconnectFieldLab} /></article>;
}
