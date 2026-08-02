/**
 * 쿠버네티스 클러스터 아키텍처 — 컨트롤 플레인 + 워커 노드.
 * 컴포넌트 간 흐름 (apiserver ↔ scheduler ↔ kubelet) 을 화살표로.
 */
export default function ClusterArchViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">쿠버네티스 아키텍처 — 컨트롤 플레인 vs 워커 노드</text>

        {/* 컨트롤 플레인 영역 */}
        <g>
          <rect x={20} y={45} width={300} height={320} rx={8}
            fill="#3b82f6" fillOpacity={0.04} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 2" />
          <text x={170} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">Control Plane</text>
          <text x={170} y={75} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            클러스터의 두뇌 — etcd 가 단일 진실
          </text>
        </g>

        {/* etcd */}
        <g>
          <rect x={50} y={95} width={120} height={50} rx={5}
            fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={1} />
          <text x={110} y={114} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">etcd</text>
          <text x={110} y={127} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">분산 KV 스토어</text>
          <text x={110} y={138} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">모든 객체 상태 보존</text>
        </g>

        {/* kube-apiserver */}
        <g>
          <rect x={185} y={95} width={120} height={50} rx={5}
            fill="#3b82f6" fillOpacity={0.18} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={245} y={114} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">kube-apiserver</text>
          <text x={245} y={127} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">유일한 etcd 진입점</text>
          <text x={245} y={138} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">RBAC · admission</text>
        </g>

        {/* etcd ↔ apiserver */}
        <g>
          <line x1={170} y1={120} x2={185} y2={120} stroke="#3b82f6" strokeWidth={1.2} />
          <line x1={170} y1={120} x2={177} y2={117} stroke="#3b82f6" strokeWidth={1.2} />
          <line x1={170} y1={120} x2={177} y2={123} stroke="#3b82f6" strokeWidth={1.2} />
        </g>

        {/* scheduler */}
        <g>
          <rect x={50} y={170} width={120} height={45} rx={5}
            fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1} />
          <text x={110} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">scheduler</text>
          <text x={110} y={202} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">Pod → Node 결정</text>
        </g>

        {/* controller-manager */}
        <g>
          <rect x={185} y={170} width={120} height={45} rx={5}
            fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={1} />
          <text x={245} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">controller-manager</text>
          <text x={245} y={202} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">reconcile loop 모음</text>
        </g>

        {/* cloud-controller */}
        <g>
          <rect x={50} y={235} width={255} height={45} rx={5}
            fill="#8b5cf6" fillOpacity={0.12} stroke="#8b5cf6" strokeWidth={1} />
          <text x={177} y={253} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">cloud-controller-manager (LB · 볼륨 · 노드 라이프사이클)</text>
          <text x={177} y={267} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">EKS · GKE · AKS 에선 매니지드</text>
        </g>

        {/* DNS / addons */}
        <g>
          <rect x={50} y={300} width={255} height={45} rx={5}
            fill="#ec4899" fillOpacity={0.12} stroke="#ec4899" strokeWidth={1} />
          <text x={177} y={318} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ec4899">addons (CoreDNS · CNI · metrics-server)</text>
          <text x={177} y={332} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">실제로는 워커에 Pod 로 떠 있음</text>
        </g>

        {/* 워커 노드 */}
        <g>
          <rect x={350} y={45} width={350} height={320} rx={8}
            fill="#06b6d4" fillOpacity={0.04} stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 2" />
          <text x={525} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill="#06b6d4">Worker Nodes (다수)</text>
          <text x={525} y={75} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            실제 Pod 가 도는 곳 — kubelet 이 apiserver 에 watch
          </text>
        </g>

        {/* 워커 노드 1 */}
        <g>
          <rect x={365} y={95} width={155} height={130} rx={6}
            fill="#06b6d4" fillOpacity={0.06} stroke="#06b6d4" strokeWidth={1} />
          <text x={442} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill="#06b6d4">Node 1</text>
          {/* kubelet */}
          <rect x={375} y={120} width={135} height={26} rx={3}
            fill="#06b6d4" fillOpacity={0.18} stroke="#06b6d4" strokeWidth={0.8} />
          <text x={442} y={137} textAnchor="middle" fontSize={9} fontWeight={600} fill="#06b6d4">kubelet</text>
          {/* kube-proxy */}
          <rect x={375} y={150} width={135} height={22} rx={3}
            fill="#06b6d4" fillOpacity={0.1} stroke="#06b6d4" strokeWidth={0.6} />
          <text x={442} y={165} textAnchor="middle" fontSize={9} fill="#06b6d4">kube-proxy (iptables · ipvs)</text>
          {/* runtime */}
          <rect x={375} y={176} width={135} height={22} rx={3}
            fill="#06b6d4" fillOpacity={0.1} stroke="#06b6d4" strokeWidth={0.6} />
          <text x={442} y={191} textAnchor="middle" fontSize={9} fill="#06b6d4">containerd · runc</text>
          {/* Pods */}
          <text x={442} y={213} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">Pod A · Pod B · Pod C ...</text>
        </g>

        {/* 워커 노드 2 */}
        <g>
          <rect x={530} y={95} width={155} height={130} rx={6}
            fill="#06b6d4" fillOpacity={0.06} stroke="#06b6d4" strokeWidth={1} />
          <text x={607} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill="#06b6d4">Node 2</text>
          <rect x={540} y={120} width={135} height={26} rx={3}
            fill="#06b6d4" fillOpacity={0.18} stroke="#06b6d4" strokeWidth={0.8} />
          <text x={607} y={137} textAnchor="middle" fontSize={9} fontWeight={600} fill="#06b6d4">kubelet</text>
          <rect x={540} y={150} width={135} height={22} rx={3}
            fill="#06b6d4" fillOpacity={0.1} stroke="#06b6d4" strokeWidth={0.6} />
          <text x={607} y={165} textAnchor="middle" fontSize={9} fill="#06b6d4">kube-proxy</text>
          <rect x={540} y={176} width={135} height={22} rx={3}
            fill="#06b6d4" fillOpacity={0.1} stroke="#06b6d4" strokeWidth={0.6} />
          <text x={607} y={191} textAnchor="middle" fontSize={9} fill="#06b6d4">containerd · runc</text>
          <text x={607} y={213} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">Pod D · Pod E · Pod F ...</text>
        </g>

        {/* apiserver ↔ kubelet (watch) */}
        <g>
          <line x1={305} y1={120} x2={365} y2={130} stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 2" />
          <line x1={305} y1={120} x2={530} y2={130} stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 2" />
          <text x={350} y={108} fontSize={8} fontStyle="italic" fill="var(--muted-foreground)">watch (long poll)</text>
        </g>

        {/* 워커 노드 3 (생략) */}
        <g>
          <rect x={365} y={235} width={320} height={45} rx={6}
            fill="#06b6d4" fillOpacity={0.04} stroke="#06b6d4" strokeWidth={0.8} strokeDasharray="2 2" />
          <text x={525} y={253} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">Node 3 ... Node N</text>
          <text x={525} y={268} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">노드 풀 = 같은 라벨·taint 의 묶음 (e.g., gpu · spot · ci-runner)</text>
        </g>

        {/* CNI plugin */}
        <g>
          <rect x={365} y={290} width={320} height={45} rx={6}
            fill="#94a3b8" fillOpacity={0.12} stroke="#94a3b8" strokeWidth={1} />
          <text x={525} y={308} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">CNI Plugin (Calico · Cilium · Flannel)</text>
          <text x={525} y={323} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">Pod IP · NetworkPolicy · cross-node 연결</text>
        </g>

        <text x={W / 2} y={358} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          핵심 — 모든 변경은 apiserver 만 통한다 / etcd 는 백업·복원 절차의 단일 출처
        </text>
      </svg>
    </div>
  );
}
