import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { drqn2015Spec } from './paper-spine/rlPomdpSpecs';
import { DrqnMechanismViz } from './paper-spine/viz/PartialObservabilityPaperViz';

export default function PaperDrqn2015Article() {
  return <FoundationalPaperStudy spec={{ ...drqn2015Spec, mechanismViz: DrqnMechanismViz }} />;
}
