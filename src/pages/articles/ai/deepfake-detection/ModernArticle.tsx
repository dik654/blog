import Overview from "./Overview";
import SourceGroups from "./SourceGroups";
import DomainRisk from "./DomainRisk";
import ReleaseBoundary from "./ReleaseBoundary";

export default function DeepfakeDetectionArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <Overview />
      <SourceGroups />
      <DomainRisk />
      <ReleaseBoundary />
    </div>
  );
}
