import WorldHistoryArticle, { type WorldHistoryArticleData } from "./WorldHistoryArticle";
import { digitalInformationOrderData } from "./global-history-foundations-expansion-data";
import ExposureFunnelViz from "./open-web-platform-curation-and-digital-divides/viz/ExposureFunnelViz";
import FeedbackLoopViz from "./open-web-platform-curation-and-digital-divides/viz/FeedbackLoopViz";
import LayerControlViz from "./open-web-platform-curation-and-digital-divides/viz/LayerControlViz";

const data: WorldHistoryArticleData = {
  ...digitalInformationOrderData,
  figures: {
    "black-box": { 0: <LayerControlViz /> },
    case: { 0: <ExposureFunnelViz /> },
    mechanism: { 0: <FeedbackLoopViz /> },
  },
};

export default function OpenWebPlatformCurationAndDigitalDividesArticle() {
  return <WorldHistoryArticle data={data} />;
}
