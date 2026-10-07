import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { latinAmericaWorldMarketData } from "./economic-history-regional-data";

export default function Article() {
  return <WorldHistoryArticle data={latinAmericaWorldMarketData} />;
}
