import Overview from "./training-pipeline/Overview";
import Dataset from "./training-pipeline/Dataset";
import Loop from "./training-pipeline/Loop";
import Checkpoint from "./training-pipeline/Checkpoint";
import Logging from "./training-pipeline/Logging";
import {
  TrainingRunFamilyLocator,
  TrainingRunFamilyMapReturn,
} from "./shared/TrainingRunFamilyLocator";

export default function TrainingPipelineArticle() {
  return (
    <div className="space-y-12" data-teach-level="0">
      <TrainingRunFamilyLocator current="pipeline" />
      <Overview />
      <Dataset />
      <Loop />
      <Checkpoint />
      <Logging />
      <TrainingRunFamilyMapReturn current="pipeline" />
    </div>
  );
}
