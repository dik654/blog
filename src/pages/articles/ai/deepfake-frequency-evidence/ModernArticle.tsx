import Overview from "./Overview";
import Spectrum from "./Spectrum";
import Corruption from "./Corruption";
import JointError from "./JointError";

export default function DeepfakeFrequencyEvidenceArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <Overview />
      <Spectrum />
      <Corruption />
      <JointError />
    </div>
  );
}
