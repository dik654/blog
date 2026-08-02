import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { mansonDoubleLinearFatigue1967Spec } from './paper-spine/robotStructuralSpecs';

export default function PaperMansonDoubleLinearFatigue1967() {
  return <FoundationalPaperStudy spec={mansonDoubleLinearFatigue1967Spec} />;
}
