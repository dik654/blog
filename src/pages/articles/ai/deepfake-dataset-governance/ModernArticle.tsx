import Overview from "./Overview";
import Provenance from "./Provenance";
import Coverage from "./Coverage";
import Release from "./Release";

export default function DeepfakeDatasetGovernanceArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <Overview />
      <Provenance />
      <Coverage />
      <Release />
    </div>
  );
}
