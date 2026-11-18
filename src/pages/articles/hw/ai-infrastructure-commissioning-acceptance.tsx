import CloudCertificationArticle from "../cloud/CloudCertificationArticle";
import { commissioningAcceptanceData } from "./ai-infrastructure-study/data";
import NcclScaleOutViz from "./ai-infrastructure-commissioning-acceptance/viz/NcclScaleOutViz";

export default function CommissioningAcceptanceArticle() {
  return (
    <CloudCertificationArticle
      data={commissioningAcceptanceData}
      paragraphLead={{ source: { 0: <NcclScaleOutViz /> } }}
    />
  );
}
