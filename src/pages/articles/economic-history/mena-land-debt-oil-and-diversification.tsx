import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { menaLandOilData } from "./economic-history-regional-data";

export default function Article() {
  return <WorldHistoryArticle data={menaLandOilData} />;
}
