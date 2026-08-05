import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { denavitHartenberg1955Spec } from './paper-spine/robotKinematicsSpecs';
import { DenavitHartenbergMechanismViz } from './paper-spine/viz/RobotKinematicsRetimingPaperViz';

export default function PaperDenavitHartenberg1955Article() {
  return (
    <FoundationalPaperStudy
      spec={{ ...denavitHartenberg1955Spec, mechanismViz: DenavitHartenbergMechanismViz }}
    />
  );
}
