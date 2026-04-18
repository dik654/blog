import Overview from './evaluation-metrics/Overview';
import Regression from './evaluation-metrics/Regression';
import Classification from './evaluation-metrics/Classification';
import Ranking from './evaluation-metrics/Ranking';
import Optimization from './evaluation-metrics/Optimization';

export default function EvaluationMetricsArticle() {
  return (
    <>
      <Overview />
      <Regression />
      <Classification />
      <Ranking />
      <Optimization />
    </>
  );
}
