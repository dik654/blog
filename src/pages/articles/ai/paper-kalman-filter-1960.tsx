import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { kalman1960Spec } from './paper-spine/rlPomdpSpecs';
import { KalmanMechanismViz } from './paper-spine/viz/PartialObservabilityPaperViz';

export default function PaperKalmanFilter1960Article() {
  return <FoundationalPaperStudy spec={{ ...kalman1960Spec, mechanismViz: KalmanMechanismViz }} />;
}
