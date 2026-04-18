import Overview from './hyperparameter-tuning/Overview';
import Optuna from './hyperparameter-tuning/Optuna';
import SearchSpace from './hyperparameter-tuning/SearchSpace';
import Pruning from './hyperparameter-tuning/Pruning';

export default function HyperparameterTuningArticle() {
  return (
    <>
      <Overview />
      <Optuna />
      <SearchSpace />
      <Pruning />
    </>
  );
}
