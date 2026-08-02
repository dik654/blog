import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { dyna1990Spec } from './paper-spine/rlAdvancedSpecs';
import { DynaMechanismViz } from './paper-spine/viz/ModelBasedRlPaperViz';

export default function Dyna1990Paper() {
  return <FoundationalPaperStudy spec={{ ...dyna1990Spec, mechanismViz: DynaMechanismViz }} />;
}
