import Overview from "./modded-rtx4090-moe-serving/Overview";
import CapacityMod from "./modded-rtx4090-moe-serving/CapacityMod";
import NvlinkGapQuantified from "./modded-rtx4090-moe-serving/NvlinkGapQuantified";
import MoeCommunicationSensitivity from "./modded-rtx4090-moe-serving/MoeCommunicationSensitivity";
import EngineeringRecovery from "./modded-rtx4090-moe-serving/EngineeringRecovery";
import ReleaseGate from "./modded-rtx4090-moe-serving/ReleaseGate";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { modded4090FieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function ModdedRtx4090MoeServingArticle() {
  return (
    <div className="space-y-12">
      <HardwareTeachOpening data={hardwareTeachCases.modded4090} />
      <HardwareTeachMechanism data={hardwareTeachCases.modded4090}>
        <Overview />
        <CapacityMod />
        <NvlinkGapQuantified />
        <MoeCommunicationSensitivity />
        <EngineeringRecovery />
        <ReleaseGate />
      </HardwareTeachMechanism>
      <HardwareFieldLab data={modded4090FieldLab} />
    </div>
  );
}
