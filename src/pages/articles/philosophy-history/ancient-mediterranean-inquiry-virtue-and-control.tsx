import PhilosophyHistoryArticle, { type PhilosophyHistoryArticleData } from "./PhilosophyHistoryArticle";
import SocratesWitnessViz from "./ancient-mediterranean-inquiry-virtue-and-control/viz/SocratesWitnessViz";
import TenHourThreeToolsViz from "./ancient-mediterranean-inquiry-virtue-and-control/viz/TenHourThreeToolsViz";
import { ancientMediterraneanData } from "./philosophy-history-data";

const data: PhilosophyHistoryArticleData = {
  ...ancientMediterraneanData,
  figures: {
    need: { 0: <SocratesWitnessViz /> },
    mechanism: { 0: <TenHourThreeToolsViz /> },
  },
};

export default function AncientMediterraneanInquiryVirtueAndControl() {
  return <PhilosophyHistoryArticle data={data} />;
}
