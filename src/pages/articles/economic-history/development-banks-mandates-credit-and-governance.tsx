import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import CreditBufferViz from "./development-banks-mandates-credit-and-governance/viz/CreditBufferViz";
import LoanCycleViz from "./development-banks-mandates-credit-and-governance/viz/LoanCycleViz";
import { developmentBankHistoryData } from "./economic-history-institutional-data";

const data = {
  ...developmentBankHistoryData,
  figures: {
    overview: { 0: <CreditBufferViz /> },
    mechanism: { 0: <LoanCycleViz /> },
  },
};

export default function DevelopmentBanksMandatesCreditAndGovernanceArticle() {
  return <WorldHistoryArticle data={data} />;
}
