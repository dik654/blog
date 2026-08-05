import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { worldModels2018Spec } from './paper-spine/rlAdvancedSpecs';
import { WorldModelsMechanismViz } from './paper-spine/viz/ModelBasedRlPaperViz';

export default function WorldModels2018Paper() {
  return <FoundationalPaperStudy spec={{ ...worldModels2018Spec, mechanismViz: WorldModelsMechanismViz }} />;
}
