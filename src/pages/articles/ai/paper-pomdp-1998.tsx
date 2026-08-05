import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { pomdp1998Spec } from './paper-spine/rlPomdpSpecs';
import { PomdpMechanismViz } from './paper-spine/viz/PartialObservabilityPaperViz';

export default function PaperPomdp1998Article() {
  return <FoundationalPaperStudy spec={{ ...pomdp1998Spec, mechanismViz: PomdpMechanismViz }} />;
}
