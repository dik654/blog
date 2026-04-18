import Overview from './imbalanced-data/Overview';
import Sampling from './imbalanced-data/Sampling';
import Loss from './imbalanced-data/Loss';
import Threshold from './imbalanced-data/Threshold';
import Evaluation from './imbalanced-data/Evaluation';

export default function ImbalancedDataArticle() {
  return (
    <>
      <Overview />
      <Sampling />
      <Loss />
      <Threshold />
      <Evaluation />
    </>
  );
}
