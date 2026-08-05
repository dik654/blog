import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { whitneyCoordinatedControl1972Spec } from './paper-spine/robotKinematicsSpecs';
import { WhitneyCoordinatedControlMechanismViz } from './paper-spine/viz/RobotKinematicsRetimingPaperViz';

export default function PaperWhitneyCoordinatedControl1972Article() {
  return (
    <FoundationalPaperStudy
      spec={{ ...whitneyCoordinatedControl1972Spec, mechanismViz: WhitneyCoordinatedControlMechanismViz }}
    />
  );
}
