import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { mayneMpc2000Spec } from './paper-spine/robotControlSpecs';
import { MayneMpcMechanismViz } from './paper-spine/viz/RobotPlanningControlPaperViz';

export default function PaperMayneMpc2000Article() {
  return (
    <FoundationalPaperStudy
      spec={{ ...mayneMpc2000Spec, mechanismViz: MayneMpcMechanismViz }}
    />
  );
}
