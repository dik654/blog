import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { chinaSince1800Data } from "./economic-history-regional-data";

export default function Article() {
  return <WorldHistoryArticle data={chinaSince1800Data} />;
}
