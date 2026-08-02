import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { qLearning1992Spec } from './paper-spine/rlSpecs';
import { QLearningMechanismViz } from './paper-spine/viz/ValueLearningPaperViz';

export default function QLearning1992Paper() {
  return <FoundationalPaperStudy spec={{ ...qLearning1992Spec, mechanismViz: QLearningMechanismViz }} />;
}
