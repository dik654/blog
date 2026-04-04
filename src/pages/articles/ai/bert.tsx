import Overview from './bert/Overview';
import SelfAttention from './bert/SelfAttention';
import PreTraining from './bert/PreTraining';
import FineTuning from './bert/FineTuning';

export default function BertArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <SelfAttention />
      <PreTraining />
      <FineTuning />
    </div>
  );
}
