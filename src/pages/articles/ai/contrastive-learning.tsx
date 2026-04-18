import Overview from './contrastive-learning/Overview';
import SimCLR from './contrastive-learning/SimCLR';
import Triplet from './contrastive-learning/Triplet';
import Supervised from './contrastive-learning/Supervised';
import Application from './contrastive-learning/Application';

export default function ContrastiveLearningArticle() {
  return (
    <>
      <Overview />
      <SimCLR />
      <Triplet />
      <Supervised />
      <Application />
    </>
  );
}
