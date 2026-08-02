import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { lyapunovSafe2018Spec } from './paper-spine/rlSafetySpecs';
import { LyapunovSafeMechanismViz } from './paper-spine/viz/SafePolicyPaperViz';

export default function LyapunovSafeRl2018Paper() {
  return <FoundationalPaperStudy spec={{ ...lyapunovSafe2018Spec, mechanismViz: LyapunovSafeMechanismViz }} />;
}
