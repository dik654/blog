import Overview from "./knowledge-distillation/Overview";
import Logit from "./knowledge-distillation/Logit";
import Feature from "./knowledge-distillation/Feature";
import LLMDistill from "./knowledge-distillation/LLMDistill";
import OnPolicy from "./knowledge-distillation/OnPolicy";
import SelfDistill from "./knowledge-distillation/SelfDistill";

export default function KnowledgeDistillationArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Logit />
      <Feature />
      <LLMDistill />
      <OnPolicy />
      <SelfDistill />
    </div>
  );
}
