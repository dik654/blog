import Overview from "./lr-scheduling/Overview";
import StepExponential from "./lr-scheduling/StepExponential";
import Cosine from "./lr-scheduling/Cosine";
import OneCycle from "./lr-scheduling/OneCycle";
import Warmup from "./lr-scheduling/Warmup";

export default function LrSchedulingArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <StepExponential />
      <Cosine />
      <OneCycle />
      <Warmup />
    </div>
  );
}
