import Krea2Architecture from './krea-2-foundation-model/Architecture';
import Krea2Overview from './krea-2-foundation-model/Overview';
import Krea2TrainingOperation from './krea-2-foundation-model/TrainingOperation';

export default function Krea2FoundationModelArticle() {
  return (
    <div className="space-y-16">
      <Krea2Overview />
      <Krea2Architecture />
      <Krea2TrainingOperation />
    </div>
  );
}
