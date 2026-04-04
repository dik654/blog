import DeploymentViz from './viz/DeploymentViz';
import ModelLoading from './ModelLoading';
import HPACustomMetrics from './HPACustomMetrics';

export default function ServingDeployment() {
  return (
    <section id="serving-deployment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서빙 배포 패턴</h2>
      <div className="not-prose mb-8"><DeploymentViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          vLLM/TGI를 K8s에 배포하는 프로덕션 패턴<br />
          핵심 고려사항: 모델 로딩 시간 최소화, GPU 활용률 기반 스케일링,
          무중단 배포
        </p>
        <ModelLoading />
        <HPACustomMetrics />
      </div>
    </section>
  );
}
