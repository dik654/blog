import Overview from "./attention-theory/Overview";
import Additive from "./attention-theory/Additive";
import Multiplicative from "./attention-theory/Multiplicative";
import SelfAttention from "./attention-theory/SelfAttention";

export default function AttentionTheoryArticle() {
  return (
    <div>
      <Overview />
      <Additive />
      <Multiplicative />
      <SelfAttention />
    </div>
  );
}
