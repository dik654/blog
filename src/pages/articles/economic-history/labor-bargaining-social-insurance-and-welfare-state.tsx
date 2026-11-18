import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { laborWelfareStateData } from "./economic-history-thematic-data";
import IncidenceViz from "./labor-bargaining-social-insurance-and-welfare-state/viz/IncidenceViz";
import IncomeLedgerViz from "./labor-bargaining-social-insurance-and-welfare-state/viz/IncomeLedgerViz";
import SocialInsuranceTimelineViz from "./labor-bargaining-social-insurance-and-welfare-state/viz/SocialInsuranceTimelineViz";

export default function LaborBargainingSocialInsuranceAndWelfareStateArticle() {
  return (
    <WorldHistoryArticle
      data={{
        ...laborWelfareStateData,
        figures: {
          case: { 0: <IncomeLedgerViz /> },
          picture: { 1: <SocialInsuranceTimelineViz /> },
          need: { 1: <IncidenceViz /> },
        },
      }}
    />
  );
}
