import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { chinaSince1800Data } from "./economic-history-regional-data";
import ReformTimelineViz from "./china-since-1800-households-markets-and-reform/viz/ReformTimelineViz";
import ResidualChainViz from "./china-since-1800-households-markets-and-reform/viz/ResidualChainViz";

const data = {
  ...chinaSince1800Data,
  figures: {
    mechanism: { 0: <ResidualChainViz /> },
    source: { 0: <ReformTimelineViz /> },
  },
};

export default function Article() {
  return <WorldHistoryArticle data={data} />;
}
