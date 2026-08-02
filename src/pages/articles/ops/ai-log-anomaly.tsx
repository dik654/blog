import Overview from './ai-log-anomaly/Overview';
import Detection from './ai-log-anomaly/Detection';
import AgentSafety from './ai-log-anomaly/AgentSafety';

export default function AiLogAnomaly() {
  return (
    <>
      <Overview />
      <Detection />
      <AgentSafety />
    </>
  );
}
