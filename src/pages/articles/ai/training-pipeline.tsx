import Overview from './training-pipeline/Overview';
import Dataset from './training-pipeline/Dataset';
import Loop from './training-pipeline/Loop';
import Checkpoint from './training-pipeline/Checkpoint';
import Logging from './training-pipeline/Logging';

export default function TrainingPipelineArticle() {
  return (
    <>
      <Overview />
      <Dataset />
      <Loop />
      <Checkpoint />
      <Logging />
    </>
  );
}
