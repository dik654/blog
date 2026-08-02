import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { cpo2017Spec } from './paper-spine/rlSafetySpecs';
import { CpoMechanismViz } from './paper-spine/viz/SafePolicyPaperViz';

export default function Cpo2017Paper() {
  return <FoundationalPaperStudy spec={{ ...cpo2017Spec, mechanismViz: CpoMechanismViz }} />;
}
