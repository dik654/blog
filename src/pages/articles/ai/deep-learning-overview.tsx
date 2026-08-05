import Overview from './deep-learning-overview/Overview';
import Representation from './deep-learning-overview/Representation';
import LearningLoop from './deep-learning-overview/LearningLoop';
import Compute from './deep-learning-overview/Compute';
import Limits from './deep-learning-overview/Limits';
import Roadmap from './deep-learning-overview/Roadmap';

export default function DeepLearningOverviewArticle() {
  return (
    <>
      <Overview />
      <Representation />
      <LearningLoop />
      <Compute />
      <Limits />
      <Roadmap />
    </>
  );
}
