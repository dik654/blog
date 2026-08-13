import Overview from "./pruning/Overview";
import Unstructured from "./pruning/Unstructured";
import Structured from "./pruning/Structured";
import LLMPruning from "./pruning/LLMPruning";
import Recovery from "./pruning/Recovery";

export default function PruningArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Unstructured />
      <Structured />
      <LLMPruning />
      <Recovery />
    </div>
  );
}
