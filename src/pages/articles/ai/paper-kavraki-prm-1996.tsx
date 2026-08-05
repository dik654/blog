import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { kavrakiPrm1996Spec } from './paper-spine/robotPlanningSpecs';
import { KavrakiPrmMechanismViz } from './paper-spine/viz/RobotPlanningControlPaperViz';

export default function PaperKavrakiPrm1996Article() {
  return (
    <FoundationalPaperStudy
      spec={{ ...kavrakiPrm1996Spec, mechanismViz: KavrakiPrmMechanismViz }}
    />
  );
}
