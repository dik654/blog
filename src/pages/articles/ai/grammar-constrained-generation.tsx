import Decoder from "./grammar-constrained-generation/Decoder";
import FormalLanguage from "./grammar-constrained-generation/FormalLanguage";
import Overview from "./grammar-constrained-generation/Overview";
import Serving from "./grammar-constrained-generation/Serving";
import TreeSitter from "./grammar-constrained-generation/TreeSitter";

export default function GrammarConstrainedGenerationArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <FormalLanguage />
      <TreeSitter />
      <Decoder />
      <Serving />
    </div>
  );
}
