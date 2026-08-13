import Decision from "./agent-sandbox-security/Decision";
import Egress from "./agent-sandbox-security/Egress";
import Gpu from "./agent-sandbox-security/Gpu";
import KubernetesHardening from "./agent-sandbox-security/KubernetesHardening";
import Overview from "./agent-sandbox-security/Overview";
import RuntimeBoundary from "./agent-sandbox-security/RuntimeBoundary";
import ThreatSignals from "./agent-sandbox-security/ThreatSignals";

export default function AgentSandboxSecurityArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <ThreatSignals />
      <RuntimeBoundary />
      <KubernetesHardening />
      <Egress />
      <Gpu />
      <Decision />
    </div>
  );
}
