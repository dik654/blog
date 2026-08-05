import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { seq2seqPaperSpec } from './paper-spine/specs';

export default function Seq2SeqPaper() {
  return <FoundationalPaperStudy spec={seq2seqPaperSpec} />;
}
