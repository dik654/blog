import Overview from './experiment-tracking/Overview';
import WandB from './experiment-tracking/WandB';
import MLflow from './experiment-tracking/MLflow';
import Reproducibility from './experiment-tracking/Reproducibility';

export default function ExperimentTrackingArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <WandB />
      <MLflow />
      <Reproducibility />
    </div>
  );
}
