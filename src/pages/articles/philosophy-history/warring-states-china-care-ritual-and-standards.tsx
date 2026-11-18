import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { warringStatesChinaData } from "./philosophy-history-data";
import BudgetShiftViz from "./warring-states-china-care-ritual-and-standards/viz/BudgetShiftViz";
import DebateNetworkViz from "./warring-states-china-care-ritual-and-standards/viz/DebateNetworkViz";

const data: PhilosophyHistoryArticleData = {
  ...warringStatesChinaData,
  figures: {
    case: { 0: <BudgetShiftViz /> },
    picture: { 0: <DebateNetworkViz /> },
  },
};

export default function WarringStatesChinaCareRitualAndStandards() {
  return <PhilosophyHistoryArticle data={data} />;
}
