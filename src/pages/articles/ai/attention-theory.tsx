import Overview from './attention-theory/Overview';
import Additive from './attention-theory/Additive';
import Multiplicative from './attention-theory/Multiplicative';
import SelfAttention from './attention-theory/SelfAttention';

export default function AttentionTheoryArticle() {
  return (
    <>
      <Overview />
      <Additive />
      <Multiplicative />
      <SelfAttention />
    </>
  );
}
