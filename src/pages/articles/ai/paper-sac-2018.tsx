import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { sac2018Spec } from './paper-spine/rlSpecs';
import { SacMechanismViz } from './paper-spine/viz/ContinuousControlPaperViz';

export default function Sac2018Paper() {
  return <FoundationalPaperStudy spec={{ ...sac2018Spec, mechanismViz: SacMechanismViz }} />;
}
