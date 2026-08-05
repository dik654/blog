import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { kalmanOptimalControl1960Spec } from './paper-spine/robotControlSpecs';
import { KalmanOptimalControlMechanismViz } from './paper-spine/viz/RobotPlanningControlPaperViz';

export default function PaperKalmanOptimalControl1960Article() {
  return (
    <FoundationalPaperStudy
      spec={{ ...kalmanOptimalControl1960Spec, mechanismViz: KalmanOptimalControlMechanismViz }}
    />
  );
}
