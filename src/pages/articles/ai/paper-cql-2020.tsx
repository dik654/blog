import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { cql2020Spec } from './paper-spine/rlAdvancedSpecs';
import { CqlMechanismViz } from './paper-spine/viz/OfflineRlPaperViz';

export default function Cql2020Paper() {
  return <FoundationalPaperStudy spec={{ ...cql2020Spec, mechanismViz: CqlMechanismViz }} />;
}
