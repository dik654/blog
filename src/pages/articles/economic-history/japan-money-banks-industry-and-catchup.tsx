import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { japanIndustrializationData } from "./economic-history-regional-data";

export default function Article() {
  return <WorldHistoryArticle data={japanIndustrializationData} />;
}
