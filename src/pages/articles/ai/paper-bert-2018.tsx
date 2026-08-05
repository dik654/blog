import FoundationalPaperStudy from './paper-spine/FoundationalPaperStudy';
import { bertPaperSpec } from './paper-spine/specs';

export default function BertPaper() {
  return <FoundationalPaperStudy spec={bertPaperSpec} />;
}
