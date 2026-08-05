/**
 * K8s stateful 앱 배포 워크플로우 — 11 단계.
 */
export default function K8sWorkflowViz() {
  const steps = [
    { n: '1', label: 'Manifest 작성', sub: 'StatefulSet · volumeClaimTemplates · Helm/Kustomize', color: '#3b82f6' },
    { n: '2', label: '자원 요청 + QoS', sub: 'Guaranteed (request=limit) 권장', color: '#3b82f6' },
    { n: '3', label: '헬스 체크 분리', sub: 'startup · readiness · liveness 분리', color: '#10b981' },
    { n: '4', label: '분산 정책', sub: 'antiAffinity + topologySpread', color: '#10b981' },
    { n: '5', label: 'PodDisruptionBudget', sub: 'maxUnavailable 1 또는 minAvailable 80%', color: '#f59e0b' },
    { n: '6', label: 'Graceful shutdown', sub: 'terminationGracePeriodSeconds 600+ · preStop hook', color: '#f59e0b' },
    { n: '7', label: 'Service · Ingress · NetworkPolicy', sub: 'headless Service · default-deny + 화이트리스트', color: '#8b5cf6' },
    { n: '8', label: 'RBAC + ServiceAccount', sub: 'zero 부터 + IRSA / Workload Identity', color: '#8b5cf6' },
    { n: '9', label: '옵저버빌리티 + 알람', sub: 'ServiceMonitor + Grafana + 4 골든 시그널', color: '#ec4899' },
    { n: '10', label: '백업 + 복구', sub: 'Velero · CSI snapshot · 분기 1회 검증', color: '#ec4899' },
    { n: '11', label: 'Pod Security Admission', sub: 'restricted 라벨 + seccomp / AppArmor', color: '#06b6d4' },
  ];

  const W = 720;
  const H = 500;
  const itemH = 36;
  const yStart = 50;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">K8s Stateful 앱 배포 — 11 단계 표준 워크플로우</text>

        {steps.map((s, i) => {
          const y = yStart + i * (itemH + 4);
          return (
            <g key={s.n}>
              <circle cx={45} cy={y + itemH / 2} r={14}
                fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={1.4} />
              <text x={45} y={y + itemH / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={s.color}>{s.n}</text>

              <rect x={75} y={y} width={620} height={itemH} rx={5}
                fill={s.color} fillOpacity={0.05} stroke={s.color} strokeWidth={0.8} />
              <text x={88} y={y + 16} fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={88} y={y + 30} fontSize={9.5} fill="var(--muted-foreground)">{s.sub}</text>

              {i < steps.length - 1 && (
                <line x1={45} y1={y + itemH + 1} x2={45} y2={y + itemH + 4}
                  stroke={s.color} strokeWidth={1.5} />
              )}
            </g>
          );
        })}

        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9} fontStyle="italic"
          fill="var(--muted-foreground)">순서를 거꾸로 하거나 단계를 빠뜨리면 운영 중 사고로 직결</text>
      </svg>
    </div>
  );
}
