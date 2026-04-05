import Overview from './claw-subagent-orchestration/Overview';
import TeamLeadWorkers from './claw-subagent-orchestration/TeamLeadWorkers';
import AgentSelection from './claw-subagent-orchestration/AgentSelection';
import Guardrails from './claw-subagent-orchestration/Guardrails';

export default function ClawSubagentOrchestrationArticle() {
  return (
    <>
      <Overview />
      <TeamLeadWorkers />
      <AgentSelection />
      <Guardrails />
    </>
  );
}
