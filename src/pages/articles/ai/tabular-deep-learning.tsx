import Overview from "./tabular-deep-learning/Overview";
import TabNet from "./tabular-deep-learning/TabNet";
import FTTransformer from "./tabular-deep-learning/FTTransformer";
import WhenDLWins from "./tabular-deep-learning/WhenDLWins";

export default function TabularDeepLearningArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <TabNet />
      <FTTransformer />
      <WhenDLWins />
    </div>
  );
}
