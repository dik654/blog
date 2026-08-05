import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { recoveryRl2021Spec } from './paper-spine/rlSafetySpecs';
import { RecoveryRlMechanismViz } from './paper-spine/viz/SafePolicyPaperViz';

export default function RecoveryRl2021Paper() {
  return <FoundationalPaperStudy spec={{ ...recoveryRl2021Spec, mechanismViz: RecoveryRlMechanismViz }} />;
}
