export default function GPUAutoscaling() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Karpenter GPU 오토스케일링</h3>
      <p>
        Karpenter — Pending Pod 감지 → 최적 인스턴스 타입 선택 → 노드 프로비저닝<br />
        Cluster Autoscaler 대비 장점: 노드 그룹 없이 인스턴스 타입 자동 선택,
        30초 내 프로비저닝 시작
      </p>
      <div className="grid gap-4 sm:grid-cols-3 mt-4">
        <div className="rounded-lg border-l-4 border-sky-500 bg-sky-500/5 p-4">
          <p className="font-semibold text-sky-600 dark:text-sky-400 mb-1">GPU 인스턴스 타입</p>
          <p className="text-sm text-muted-foreground">
            <code>instance-family: [p4d, p5]</code><br />
            p4d — A100 (80GB HBM2e)<br />
            p5 — H100 (80GB HBM3)<br />
            <code>nvidia.com/gpu: Exists</code> — GPU 보유 노드만 대상.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-amber-500 bg-amber-500/5 p-4">
          <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">스케일링 상한 정책</p>
          <p className="text-sm text-muted-foreground">
            <code>limits.nvidia.com/gpu: "32"</code><br />
            Fleet 전체 GPU 총량 제한 — 비용 폭주 방지.<br />
            Taint <code>NoSchedule</code>로 일반 워크로드 격리.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-rose-500 bg-rose-500/5 p-4">
          <p className="font-semibold text-rose-600 dark:text-rose-400 mb-1">Consolidation 전략</p>
          <p className="text-sm text-muted-foreground">
            <code>consolidationPolicy: WhenEmpty</code><br />
            빈 GPU 노드를 즉시 회수 — 유휴 비용 제거.<br />
            GPU 노드는 시간당 $10~$30이므로 빠른 회수가 핵심.
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs text-foreground/70">
        GPU 노드는 시간당 $10~$30 → consolidationPolicy로
        유휴 노드를 빠르게 회수하는 것이 비용 최적화의 핵심
      </p>
    </>
  );
}
