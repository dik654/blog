import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import HundredHectareLedgerViz from "./indigenous-land-and-latin-american-liberation/viz/HundredHectareLedgerViz";
import { indigenousLatinAmericanData } from "./philosophy-history-expansion-data";

const data: PhilosophyHistoryArticleData = {
  ...indigenousLatinAmericanData,
  figures: {
    case: { 0: <HundredHectareLedgerViz /> },
  },
};

export default function IndigenousLandAndLatinAmericanLiberation() {
  return <PhilosophyHistoryArticle data={data} />;
}
