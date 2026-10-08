import NetworkRouteIntro from "./network/NetworkRouteIntro";
import InfiniBand from "./network/InfiniBand";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { collectiveFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function GpuCollectiveNetworkArticle() {
  return <article><HardwareTeachOpening data={hardwareTeachCases.collective} /><HardwareTeachMechanism data={hardwareTeachCases.collective}><NetworkRouteIntro mode="collective" /><InfiniBand /></HardwareTeachMechanism><HardwareFieldLab data={collectiveFieldLab} /></article>;
}
