import Overview from './llm-serving-ops/Overview';
import LiteLLMGateway from './llm-serving-ops/LiteLLMGateway';
import KubernetesFleet from './llm-serving-ops/KubernetesFleet';
import ServingDeployment from './llm-serving-ops/ServingDeployment';
import Observability from './llm-serving-ops/Observability';

export default function LLMServingOpsArticle() {
  return (
    <>
      <Overview />
      <LiteLLMGateway />
      <KubernetesFleet />
      <ServingDeployment />
      <Observability />
    </>
  );
}
