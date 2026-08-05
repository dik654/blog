import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { bahdanauPaperSpec } from './paper-spine/specs';

export default function BahdanauAttentionPaper() {
  return <FoundationalPaperStudy spec={bahdanauPaperSpec} />;
}
