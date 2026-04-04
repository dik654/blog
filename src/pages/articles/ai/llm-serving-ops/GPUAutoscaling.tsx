import CodePanel from '@/components/ui/code-panel';

const KARPENTER_YAML = `apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu-pool
spec:
  template:
    spec:
      requirements:
        - key: karpenter.k8s.aws/instance-family
          operator: In
          values: [p4d, p5]        # A100 / H100
        - key: nvidia.com/gpu
          operator: Exists
      taints:
        - key: nvidia.com/gpu
          effect: NoSchedule
  limits:
    nvidia.com/gpu: "32"           # Fleet 전체 GPU 상한
  disruption:
    consolidationPolicy: WhenEmpty # 빈 GPU 노드 즉시 회수`;

export default function GPUAutoscaling() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Karpenter GPU 오토스케일링</h3>
      <p>
        Karpenter — Pending Pod 감지 → 최적 인스턴스 타입 선택 → 노드 프로비저닝<br />
        Cluster Autoscaler 대비 장점: 노드 그룹 없이 인스턴스 타입 자동 선택,
        30초 내 프로비저닝 시작
      </p>
      <CodePanel title="karpenter NodePool" code={KARPENTER_YAML}
        annotations={[
          { lines: [9, 12], color: 'sky', note: 'GPU 인스턴스 패밀리 지정 — p4d(A100) / p5(H100)' },
          { lines: [18, 19], color: 'amber', note: 'Fleet GPU 총량 상한 — 비용 폭주 방지' },
          { lines: [20, 21], color: 'rose', note: 'WhenEmpty — 빈 GPU 노드 즉시 회수 (비용 절감)' },
        ]}
      />
      <p className="mt-2 text-xs text-foreground/70">
        GPU 노드는 시간당 $10~$30 → consolidationPolicy로
        유휴 노드를 빠르게 회수하는 것이 비용 최적화의 핵심
      </p>
    </>
  );
}
