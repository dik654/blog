import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { lozanoPerezCspace1983Spec } from './paper-spine/robotPlanningSpecs';
import { LozanoPerezCspaceMechanismViz } from './paper-spine/viz/RobotPlanningControlPaperViz';

export default function PaperLozanoPerezCspace1983Article() {
  return (
    <FoundationalPaperStudy
      spec={{ ...lozanoPerezCspace1983Spec, mechanismViz: LozanoPerezCspaceMechanismViz }}
    />
  );
}
