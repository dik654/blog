import BadFaithViz from "./existentialism-facticity-freedom-and-bad-faith/viz/BadFaithViz";
import ChangeRouteViz from "./existentialism-facticity-freedom-and-bad-faith/viz/ChangeRouteViz";
import DayLedgerViz from "./existentialism-facticity-freedom-and-bad-faith/viz/DayLedgerViz";
import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import { existentialismData } from "./philosophy-history-modern-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...existentialismData,
  figures: {
    case: { 0: <DayLedgerViz /> },
    names: { 1: <BadFaithViz /> },
    mechanism: { 0: <ChangeRouteViz /> },
  },
};

export default function ExistentialismFacticityFreedomAndBadFaith() {
  return <PhilosophyHistoryArticle data={data} />;
}
