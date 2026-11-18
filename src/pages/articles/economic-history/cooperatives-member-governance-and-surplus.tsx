import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import MemberCycleViz from "./cooperatives-member-governance-and-surplus/viz/MemberCycleViz";
import SurplusSplitViz from "./cooperatives-member-governance-and-surplus/viz/SurplusSplitViz";
import { cooperativeMemberEconomyData } from "./economic-history-institutional-data";

const data = {
  ...cooperativeMemberEconomyData,
  figures: {
    case: { 0: <SurplusSplitViz /> },
    mechanism: { 0: <MemberCycleViz /> },
  },
};

export default function CooperativesMemberGovernanceAndSurplusArticle() {
  return <WorldHistoryArticle data={data} />;
}
