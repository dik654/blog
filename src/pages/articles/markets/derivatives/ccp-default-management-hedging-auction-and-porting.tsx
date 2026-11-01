import DerivativeDeepArticle from "./DerivativeDeepArticle";
import CcpDefaultManagementViz from "./CcpDefaultManagementViz";
import { ccpDefaultManagementData } from "./derivative-curriculum-gaps-data";

export default function CcpDefaultManagementArticle() {
  return <div className="space-y-16"><CcpDefaultManagementViz /><DerivativeDeepArticle data={ccpDefaultManagementData} /></div>;
}
