import PlatformTeeArticle from "../platform-tee-article";
import OasisCommitmentCompareViz from "./viz/OasisCommitmentCompareViz";
import OasisReceiptFlowViz from "./viz/OasisReceiptFlowViz";
export default function ModernOasisArticle(){return <PlatformTeeArticle platform="oasis" slots={{ beforeSequence: <OasisReceiptFlowViz />, beforeFormula: <OasisCommitmentCompareViz /> }}/>;}
