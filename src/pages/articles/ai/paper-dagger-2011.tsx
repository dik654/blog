import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { dagger2011Spec } from './paper-spine/rlAdvancedSpecs';
import { DaggerMechanismViz } from './paper-spine/viz/OfflineRlPaperViz';

export default function Dagger2011Paper() {
  return <FoundationalPaperStudy spec={{ ...dagger2011Spec, mechanismViz: DaggerMechanismViz }} />;
}
