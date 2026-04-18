import Overview from './gradient-boosting/Overview';
import Boosting from './gradient-boosting/Boosting';
import XGBoost from './gradient-boosting/XGBoost';
import LightGBM from './gradient-boosting/LightGBM';
import CatBoost from './gradient-boosting/CatBoost';
import Comparison from './gradient-boosting/Comparison';

export default function GradientBoostingArticle() {
  return (
    <>
      <Overview />
      <Boosting />
      <XGBoost />
      <LightGBM />
      <CatBoost />
      <Comparison />
    </>
  );
}
