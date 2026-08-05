import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { shinMcKay1985Spec } from './paper-spine/robotTrajectorySpecs';
import { ShinMcKayTimeOptimalMechanismViz } from './paper-spine/viz/RobotKinematicsRetimingPaperViz';

export default function PaperShinMcKayTimeOptimal1985Article() {
  return (
    <FoundationalPaperStudy
      spec={{ ...shinMcKay1985Spec, mechanismViz: ShinMcKayTimeOptimalMechanismViz }}
    />
  );
}
