import WorldHistoryArticle from "./WorldHistoryArticle";
import { knowledgeInstitutionsData } from "./global-history-foundations-expansion-data";
import CopyLineageViz from "./monasteries-schools-manuscripts-and-knowledge-transmission/viz/CopyLineageViz";
import PatronageCutViz from "./monasteries-schools-manuscripts-and-knowledge-transmission/viz/PatronageCutViz";

const data = {
  ...knowledgeInstitutionsData,
  figures: {
    picture: { 1: <CopyLineageViz /> },
    mechanism: { 0: <PatronageCutViz /> },
  },
};

export default function MonasteriesSchoolsManuscriptsAndKnowledgeTransmissionArticle() {
  return <WorldHistoryArticle data={data} />;
}
