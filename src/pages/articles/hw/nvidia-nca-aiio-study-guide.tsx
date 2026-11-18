import CloudCertificationArticle from "../cloud/CloudCertificationArticle";
import { ncaAiioStudyGuideData } from "./ai-infrastructure-study/ncaAiioData";
import TwoNodeStallViz from "./nvidia-nca-aiio-study-guide/viz/TwoNodeStallViz";

export default function NvidiaNcaAiioStudyGuideArticle() {
  return <CloudCertificationArticle data={ncaAiioStudyGuideData} paragraphLead={{ overview: { 0: <TwoNodeStallViz /> } }} />;
}
