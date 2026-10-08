import Addressing from "./b300-switchless-network/Addressing";
import Measurement from "./b300-switchless-network/Measurement";
import Nccl from "./b300-switchless-network/Nccl";
import Operations from "./b300-switchless-network/Operations";
import Overview from "./b300-switchless-network/Overview";
import Ports from "./b300-switchless-network/Ports";
import Topology from "./b300-switchless-network/Topology";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { b300SwitchlessFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function B300SwitchlessNetworkArticle() {
  return (
    <div className="space-y-12">
      <HardwareTeachOpening data={hardwareTeachCases.b300Switchless} />
      <HardwareTeachMechanism data={hardwareTeachCases.b300Switchless}>
        <Overview />
        <Ports />
        <Topology />
        <Addressing />
        <Nccl />
        <Measurement />
        <Operations />
      </HardwareTeachMechanism>
      <HardwareFieldLab data={b300SwitchlessFieldLab} />
    </div>
  );
}
