import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { reinforce1992Spec } from './paper-spine/rlSpecs';
import { ReinforceMechanismViz } from './paper-spine/viz/PolicyGradientPaperViz';

export default function Reinforce1992Paper() {
  return (
    <FoundationalPaperStudy
      spec={{ ...reinforce1992Spec, mechanismViz: ReinforceMechanismViz }}
    />
  );
}
