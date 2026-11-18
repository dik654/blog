import PhilosophyHistoryArticle from "./PhilosophyHistoryArticle";
import BonusSplitViz from "./critical-theory-immanent-critique-ideology-and-emancipation/viz/BonusSplitViz";
import { criticalTheoryData } from "./philosophy-history-modern-expansion-data";

export default function CriticalTheoryImmanentCritiqueIdeologyAndEmancipation() {
  return <PhilosophyHistoryArticle data={{ ...criticalTheoryData, figures: { case: { 0: <BonusSplitViz /> } } }} />;
}
