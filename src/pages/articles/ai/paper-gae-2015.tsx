import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { gae2015Spec } from './paper-spine/rlSpecs';
import { GaeMechanismViz } from './paper-spine/viz/PolicyGradientPaperViz';

export default function Gae2015Paper() {
  return (
    <FoundationalPaperStudy
      spec={{ ...gae2015Spec, mechanismViz: GaeMechanismViz }}
    />
  );
}
