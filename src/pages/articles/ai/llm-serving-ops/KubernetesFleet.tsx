import GPUFleetViz from './viz/GPUFleetViz';
import GPUOperator from './GPUOperator';
import GPUAutoscaling from './GPUAutoscaling';

export default function KubernetesFleet() {
  return (
    <section id="k8s-gpu-fleet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Kubernetes GPU Fleet 관리</h2>
      <div className="not-prose mb-8"><GPUFleetViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM 서빙의 물리적 기반 — GPU Fleet을 Kubernetes로 오케스트레이션<br />
          핵심: <strong>NVIDIA GPU Operator</strong>로 드라이버·런타임 자동 관리,
          <strong>Karpenter</strong>로 수요 기반 노드 프로비저닝
        </p>
        <GPUOperator />
        <GPUAutoscaling />
      </div>
    </section>
  );
}
