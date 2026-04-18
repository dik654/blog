import Overview from './pruning/Overview';
import Unstructured from './pruning/Unstructured';
import Structured from './pruning/Structured';
import LLMPruning from './pruning/LLMPruning';
import Recovery from './pruning/Recovery';

export default function PruningArticle() {
  return (
    <>
      <Overview />
      <Unstructured />
      <Structured />
      <LLMPruning />
      <Recovery />
    </>
  );
}
