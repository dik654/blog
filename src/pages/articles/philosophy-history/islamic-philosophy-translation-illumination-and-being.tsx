import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import TwoBranchesViz from "./islamic-philosophy-translation-illumination-and-being/viz/TwoBranchesViz";
import { islamicPhilosophyDevelopmentData } from "./philosophy-history-data";

const data: PhilosophyHistoryArticleData = {
  ...islamicPhilosophyDevelopmentData,
  figures: {
    picture: { 0: <TwoBranchesViz /> },
  },
};

export default function IslamicPhilosophyTranslationIlluminationAndBeing() {
  return <PhilosophyHistoryArticle data={data} />;
}
