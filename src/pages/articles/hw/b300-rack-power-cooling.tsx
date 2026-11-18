import CloudCertificationArticle from "../cloud/CloudCertificationArticle";
import { rackPowerCoolingData } from "./ai-infrastructure-study/data";
import CoolingBoundaryViz from "./b300-rack-power-cooling/viz/CoolingBoundaryViz";
import FeedLossViz from "./b300-rack-power-cooling/viz/FeedLossViz";
import RackDensityViz from "./b300-rack-power-cooling/viz/RackDensityViz";
import SuPowerStackViz from "./b300-rack-power-cooling/viz/SuPowerStackViz";
import SupplyAirBandViz from "./b300-rack-power-cooling/viz/SupplyAirBandViz";

export default function B300RackPowerCoolingArticle() {
  return (
    <CloudCertificationArticle
      data={rackPowerCoolingData}
      paragraphLead={{
        case: { 1: <SuPowerStackViz />, 2: <RackDensityViz /> },
        need: { 0: <CoolingBoundaryViz /> },
        mechanism: { 0: <FeedLossViz /> },
        comparison: { 1: <SupplyAirBandViz /> },
      }}
    />
  );
}
