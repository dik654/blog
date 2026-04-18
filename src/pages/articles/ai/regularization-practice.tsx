import Overview from './regularization-practice/Overview';
import Dropout from './regularization-practice/Dropout';
import WeightDecay from './regularization-practice/WeightDecay';
import EarlyStopping from './regularization-practice/EarlyStopping';
import LabelSmoothing from './regularization-practice/LabelSmoothing';

export default function RegularizationPracticeArticle() {
  return (
    <>
      <Overview />
      <Dropout />
      <WeightDecay />
      <EarlyStopping />
      <LabelSmoothing />
    </>
  );
}
