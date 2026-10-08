import NetworkRouteIntro from "./network/NetworkRouteIntro";
import RDMA from "./network/RDMA";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { rdmaFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function RdmaRoceArticle() {
  return <article><HardwareTeachOpening data={hardwareTeachCases.rdma} /><HardwareTeachMechanism data={hardwareTeachCases.rdma}><NetworkRouteIntro mode="rdma" /><RDMA /></HardwareTeachMechanism><HardwareFieldLab data={rdmaFieldLab} /></article>;
}
