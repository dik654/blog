import Overview from './knowledge-distillation/Overview';
import Logit from './knowledge-distillation/Logit';
import Feature from './knowledge-distillation/Feature';
import LLMDistill from './knowledge-distillation/LLMDistill';
import SelfDistill from './knowledge-distillation/SelfDistill';

export default function KnowledgeDistillationArticle() {
  return (
    <>
      <Overview />
      <Logit />
      <Feature />
      <LLMDistill />
      <SelfDistill />
    </>
  );
}
