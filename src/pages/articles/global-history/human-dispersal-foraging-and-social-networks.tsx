import WorldHistoryArticle from "./WorldHistoryArticle";
import { humanDispersalData } from "./global-history-foundations-expansion-data";
import DroughtResponseViz from "./human-dispersal-foraging-and-social-networks/viz/DroughtResponseViz";
import ShellEvidenceViz from "./human-dispersal-foraging-and-social-networks/viz/ShellEvidenceViz";

const data = {
  ...humanDispersalData,
  figures: {
    names: { 1: <ShellEvidenceViz /> },
    mechanism: { 0: <DroughtResponseViz /> },
  },
};

export default function HumanDispersalForagingAndSocialNetworksArticle() {
  return <WorldHistoryArticle data={data} />;
}
