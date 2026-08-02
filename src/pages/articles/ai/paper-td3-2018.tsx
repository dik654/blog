import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { td32018Spec } from './paper-spine/rlSpecs';
import { Td3MechanismViz } from './paper-spine/viz/ContinuousControlPaperViz';

export default function Td32018Paper() {
  return <FoundationalPaperStudy spec={{ ...td32018Spec, mechanismViz: Td3MechanismViz }} />;
}
