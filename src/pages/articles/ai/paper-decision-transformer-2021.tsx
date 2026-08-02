import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { decisionTransformer2021Spec } from './paper-spine/rlAdvancedSpecs';
import { DecisionTransformerMechanismViz } from './paper-spine/viz/OfflineRlPaperViz';

export default function DecisionTransformer2021Paper() {
  return <FoundationalPaperStudy spec={{ ...decisionTransformer2021Spec, mechanismViz: DecisionTransformerMechanismViz }} />;
}
