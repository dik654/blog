/**
 * CI/CD 신 서비스 배포 워크플로우 — 10 단계 종 흐름.
 */
export default function CicdWorkflowViz() {
  const steps = [
    { n: '1', label: 'Repo 부트스트랩', sub: 'branch protection · CODEOWNERS', color: '#3b82f6' },
    { n: '2', label: 'CI 워크플로 작성', sub: 'permissions 명시 · SHA pin · cache', color: '#3b82f6' },
    { n: '3', label: 'OIDC trust policy', sub: 'long-lived 시크릿 제거', color: '#10b981' },
    { n: '4', label: '빌드 + 서명 + provenance', sub: 'SBOM · CVE · cosign · SLSA', color: '#10b981' },
    { n: '5', label: '배포 게이트', sub: 'Kyverno + ArgoCD reconcile', color: '#f59e0b' },
    { n: '6', label: '카나리 + 자동 롤백', sub: 'Argo Rollouts · SLI 검증', color: '#f59e0b' },
    { n: '7', label: '옵저버빌리티 + 알람', sub: '4 골든 시그널 + trace + log', color: '#8b5cf6' },
    { n: '8', label: '런북 + 게임데이', sub: 'postmortem 템플릿 · 모의 사고', color: '#8b5cf6' },
    { n: '9', label: '시크릿 회전', sub: '자동 이벤트 + 침해 30 분 플레이북', color: '#ec4899' },
    { n: '10', label: '정기 audit + 개선', sub: '월/분기/연 단위', color: '#ec4899' },
  ];

  const W = 720;
  const H = 460;
  const itemH = 36;
  const yStart = 50;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">CI/CD 신 서비스 배포 — 10 단계 표준 워크플로우</text>

        {steps.map((s, i) => {
          const y = yStart + i * (itemH + 4);
          return (
            <g key={s.n}>
              {/* 번호 원 */}
              <circle cx={45} cy={y + itemH / 2} r={14}
                fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={1.4} />
              <text x={45} y={y + itemH / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={s.color}>{s.n}</text>

              {/* 본문 박스 */}
              <rect x={75} y={y} width={620} height={itemH} rx={5}
                fill={s.color} fillOpacity={0.05} stroke={s.color} strokeWidth={0.8} />
              <text x={88} y={y + 16} fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
              <text x={88} y={y + 30} fontSize={9.5} fill="var(--muted-foreground)">{s.sub}</text>

              {/* 연결선 */}
              {i < steps.length - 1 && (
                <line x1={45} y1={y + itemH + 1} x2={45} y2={y + itemH + 4}
                  stroke={s.color} strokeWidth={1.5} />
              )}
            </g>
          );
        })}

        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9} fontStyle="italic"
          fill="var(--muted-foreground)">한 번 셋업하면 다음 서비스는 같은 템플릿 — 의사결정 비용 0, 보안 수준 일관</text>
      </svg>
    </div>
  );
}
