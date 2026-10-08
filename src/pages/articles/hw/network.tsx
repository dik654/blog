import Overview from "./network/Overview";
import Ethernet from "./network/Ethernet";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { networkFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function NetworkArticle() {
  return (
    <>
      <HardwareTeachOpening data={hardwareTeachCases.network} />
      <HardwareTeachMechanism data={hardwareTeachCases.network}>
        <Overview />
        <Ethernet />
      </HardwareTeachMechanism>
      <HardwareFieldLab data={networkFieldLab} />
    </>
  );
}
