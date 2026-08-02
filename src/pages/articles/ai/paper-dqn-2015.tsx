import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { dqn2015Spec } from './paper-spine/rlSpecs';
import { DqnMechanismViz } from './paper-spine/viz/ValueLearningPaperViz';

export default function Dqn2015Paper() {
  return <FoundationalPaperStudy spec={{ ...dqn2015Spec, mechanismViz: DqnMechanismViz }} />;
}
