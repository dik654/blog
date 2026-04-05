import { ModuleBox, DataBox } from '@/components/viz/boxes';

export default function SandboxViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">bubblewrap 샌드박스 — 네임스페이스 격리</text>

        {/* 전체 시스템 */}
        <rect x={30} y={48} width={500} height={248} rx={10}
          fill="var(--muted)" opacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
        <text x={46} y={68} fontSize={11} fontWeight={700} fill="var(--foreground)">Host System</text>

        {/* read-only 바인드 */}
        <DataBox x={50} y={82} w={108} h={34}
          label="/usr (ro)"
          sub="read-only"
          color="#10b981" />
        <DataBox x={166} y={82} w={108} h={34}
          label="/lib (ro)"
          sub="read-only"
          color="#10b981" />
        <DataBox x={282} y={82} w={108} h={34}
          label="/bin (ro)"
          sub="read-only"
          color="#10b981" />
        <DataBox x={398} y={82} w={108} h={34}
          label="/etc (ro)"
          sub="read-only"
          color="#10b981" />

        {/* 샌드박스 컨테이너 */}
        <rect x={50} y={134} width={460} height={150} rx={8}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={280} y={156} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          bwrap 샌드박스 (격리)
        </text>

        <ModuleBox x={70} y={168} w={180} h={48}
          label="/workspace (rw)"
          sub="유일한 쓰기 경로"
          color="#f59e0b" />

        <DataBox x={270} y={174} w={110} h={36}
          label="/tmp (tmpfs)"
          sub="임시"
          color="#8b5cf6" />
        <DataBox x={390} y={174} w={110} h={36}
          label="/proc"
          sub="격리됨"
          color="#8b5cf6" />

        <rect x={70} y={228} width={420} height={36} rx={4}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
        <text x={280} y={250} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          --unshare-net · --unshare-pid (네트워크·PID 격리)
        </text>

        <text x={280} y={316} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">macOS/Windows: 샌드박스 없이 권한 모델만 (graceful degradation)</text>
      </svg>
    </div>
  );
}
