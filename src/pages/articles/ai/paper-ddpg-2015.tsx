import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { ddpg2015Spec } from './paper-spine/rlSpecs';
import { DdpgMechanismViz } from './paper-spine/viz/ContinuousControlPaperViz';

export default function Ddpg2015Paper() {
  return <FoundationalPaperStudy spec={{ ...ddpg2015Spec, mechanismViz: DdpgMechanismViz }} />;
}
