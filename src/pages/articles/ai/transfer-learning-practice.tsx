import Overview from "./transfer-learning-practice/Overview";
import Freezing from "./transfer-learning-practice/Freezing";
import LRStrategy from "./transfer-learning-practice/LRStrategy";
import FeatureVsFinetune from "./transfer-learning-practice/FeatureVsFinetune";
import DomainShift from "./transfer-learning-practice/DomainShift";

export default function TransferLearningPracticeArticle() {
  return <div className="space-y-12"><Overview /><Freezing /><LRStrategy /><FeatureVsFinetune /><DomainShift /></div>;
}
