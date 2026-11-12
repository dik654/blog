import IsmsOperationsArticle from "../isms-operations-article";
import ZoneFlowViz from "./viz/ZoneFlowViz";
import DecisionLayersViz from "./viz/DecisionLayersViz";
import SignalActionViz from "./viz/SignalActionViz";
import SiemJoinViz from "./viz/SiemJoinViz";
// Static audit index: id="overview" id="zone-flow-policy" id="detect-enforce-observe" id="infra-release" id="paper-nist-firewall-policy" id="paper-nist-log-management" id="paper-kisa-isms-guide-infra"
export default function ModernSecurityInfraArticle() {
  return (
    <IsmsOperationsArticle
      article="isms-security-infra"
      vizBefore={{
        "first:0": <ZoneFlowViz />,
        "first:1": <DecisionLayersViz />,
        "second:0": <SignalActionViz />,
        "second:1": <SiemJoinViz />,
      }}
    />
  );
}
