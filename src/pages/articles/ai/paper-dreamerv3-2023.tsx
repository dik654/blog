import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { dreamerV3Spec } from './paper-spine/rlAdvancedSpecs';
import { DreamerV3MechanismViz } from './paper-spine/viz/ModelBasedRlPaperViz';

export default function DreamerV3Paper() {
  return <FoundationalPaperStudy spec={{ ...dreamerV3Spec, mechanismViz: DreamerV3MechanismViz }} />;
}
