import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { muZero2020Spec } from './paper-spine/rlAdvancedSpecs';
import { MuZeroMechanismViz } from './paper-spine/viz/ModelBasedRlPaperViz';

export default function MuZero2020Paper() {
  return <FoundationalPaperStudy spec={{ ...muZero2020Spec, mechanismViz: MuZeroMechanismViz }} />;
}
