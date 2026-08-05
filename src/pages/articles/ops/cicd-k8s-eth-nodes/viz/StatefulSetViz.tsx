/**
 * StatefulSet 의 핵심 특징 — 안정 ID + PVC 1:1 영속 바인딩 + 순서 시작.
 * Deployment 와의 차이점이 핵심.
 */
export default function StatefulSetViz() {
  const W = 720;
  const H = 360;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">StatefulSet — 안정 ID · PVC 영속 · 순서 시작</text>

        {/* StatefulSet 컨트롤러 */}
        <g>
          <rect x={250} y={45} width={220} height={50} rx={6}
            fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={360} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">StatefulSet: validators</text>
          <text x={360} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">replicas: 3 · volumeClaimTemplates 정의</text>
        </g>

        {/* Pod 0 */}
        <g>
          <rect x={50} y={130} width={170} height={150} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1} />
          <text x={135} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">validators-0</text>
          <text x={135} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">stable DNS:</text>
          <text x={135} y={178} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#10b981">validators-0.svc</text>
          {/* PVC */}
          <rect x={70} y={195} width={130} height={70} rx={5}
            fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={1} />
          <text x={135} y={213} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">PVC: data-validators-0</text>
          <text x={135} y={228} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">slashing_protection.json</text>
          <text x={135} y={241} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">keystore</text>
          <text x={135} y={258} textAnchor="middle" fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">노드 교체에도 같은 PV 재마운트</text>
        </g>

        {/* Pod 1 */}
        <g>
          <rect x={275} y={130} width={170} height={150} rx={8}
            fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={1} />
          <text x={360} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">validators-1</text>
          <text x={360} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">stable DNS:</text>
          <text x={360} y={178} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#f59e0b">validators-1.svc</text>
          <rect x={295} y={195} width={130} height={70} rx={5}
            fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeWidth={1} />
          <text x={360} y={213} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">PVC: data-validators-1</text>
          <text x={360} y={228} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">독립 keys + DB</text>
          <text x={360} y={258} textAnchor="middle" fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">replica 별 1:1 바인딩</text>
        </g>

        {/* Pod 2 */}
        <g>
          <rect x={500} y={130} width={170} height={150} rx={8}
            fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1} />
          <text x={585} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">validators-2</text>
          <text x={585} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">stable DNS:</text>
          <text x={585} y={178} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#8b5cf6">validators-2.svc</text>
          <rect x={520} y={195} width={130} height={70} rx={5}
            fill="#8b5cf6" fillOpacity={0.18} stroke="#8b5cf6" strokeWidth={1} />
          <text x={585} y={213} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">PVC: data-validators-2</text>
          <text x={585} y={228} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">storageClass: local-path</text>
          <text x={585} y={258} textAnchor="middle" fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">NVMe 직결 → 빠른 IOPS</text>
        </g>

        {/* SS → Pod 화살표 */}
        <g>
          <line x1={300} y1={95} x2={135} y2={130} stroke="#3b82f6" strokeWidth={1} />
          <line x1={360} y1={95} x2={360} y2={130} stroke="#3b82f6" strokeWidth={1} />
          <line x1={420} y1={95} x2={585} y2={130} stroke="#3b82f6" strokeWidth={1} />
          <text x={140} y={117} fontSize={8.5} fontWeight={600} fill="#3b82f6">1번째</text>
          <text x={365} y={117} fontSize={8.5} fontWeight={600} fill="#3b82f6">2번째</text>
          <text x={555} y={117} fontSize={8.5} fontWeight={600} fill="#3b82f6">3번째</text>
        </g>

        {/* 비교: Deployment */}
        <g>
          <rect x={20} y={295} width={680} height={55} rx={6}
            fill="#94a3b8" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />
          <text x={360} y={314} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">vs Deployment — 무작위 Pod ID, 공유 볼륨, 병렬 시작 (stateless 워크로드용)</text>
          <text x={360} y={330} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">검증자 · 데이터베이스 · 합의 노드 등 인스턴스 정체성이 중요한 경우 → StatefulSet</text>
          <text x={360} y={343} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">웹 서버 · API 게이트웨이 등 인스턴스가 동등한 경우 → Deployment</text>
        </g>
      </svg>
    </div>
  );
}
