import Overview from "./tabular-deep-learning/Overview";
import TabNet from "./tabular-deep-learning/TabNet";
import FTTransformer from "./tabular-deep-learning/FTTransformer";
import WhenDLWins from "./tabular-deep-learning/WhenDLWins";
import {
  TabularModelFamilyLocator,
  TabularModelFamilyMapReturn,
} from "./shared/TabularModelFamilyLocator";

export default function TabularDeepLearningArticle() {
  return (
    <div className="space-y-12">
      <TabularModelFamilyLocator current="deep" />
      <Overview />
      <TabNet />
      <FTTransformer />
      <WhenDLWins />
      <TabularModelFamilyMapReturn current="deep" />
    </div>
  );
}
