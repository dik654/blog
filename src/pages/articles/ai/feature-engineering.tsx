import Overview from './feature-engineering/Overview';
import Numeric from './feature-engineering/Numeric';
import Categorical from './feature-engineering/Categorical';
import Interaction from './feature-engineering/Interaction';
import Aggregation from './feature-engineering/Aggregation';
import Selection from './feature-engineering/Selection';

export default function FeatureEngineeringArticle() {
  return (
    <>
      <Overview />
      <Numeric />
      <Categorical />
      <Interaction />
      <Aggregation />
      <Selection />
    </>
  );
}
