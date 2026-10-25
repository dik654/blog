import Coverage from "./Coverage";
import FailureStages from "./FailureStages";
import Lineage from "./Lineage";
import Overview from "./Overview";

export default function DeepfakePreprocessingLineageArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <Overview />
      <FailureStages />
      <Coverage />
      <Lineage />
    </div>
  );
}
