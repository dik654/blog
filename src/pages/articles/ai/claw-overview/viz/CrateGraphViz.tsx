import { ModuleBox } from '@/components/viz/boxes';

export default function CrateGraphViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 350" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">9개 크레이트 의존성 DAG</text>

        <defs>
          <marker id="cg-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" opacity={0.7} />
          </marker>
        </defs>

        {/* CLI (top) */}
        <ModuleBox x={205} y={50} w={150} h={44}
          label="rusty-claude-cli"
          sub="~10K LOC · CLI 진입점"
          color="#3b82f6" />

        {/* runtime (center) */}
        <ModuleBox x={205} y={140} w={150} h={58}
          label="runtime"
          sub="~24K LOC · 37 모듈"
          color="#8b5cf6" />

        {/* supporting crates (middle) */}
        <ModuleBox x={30} y={248} w={92} h={42}
          label="tools"
          sub="~7K LOC"
          color="#10b981" />
        <ModuleBox x={132} y={248} w={92} h={42}
          label="api"
          sub="~3K LOC"
          color="#10b981" />
        <ModuleBox x={234} y={248} w={92} h={42}
          label="commands"
          sub="~4K LOC"
          color="#10b981" />
        <ModuleBox x={336} y={248} w={92} h={42}
          label="plugins"
          sub="~3K LOC"
          color="#10b981" />
        <ModuleBox x={438} y={248} w={92} h={42}
          label="telemetry"
          sub="~2K LOC"
          color="#10b981" />

        {/* independent crates */}
        <ModuleBox x={20} y={50} w={118} h={42}
          label="compat-harness"
          sub="매니페스트 추출"
          color="#6b7280" />

        <ModuleBox x={422} y={50} w={118} h={42}
          label="mock-anthropic"
          sub="테스트 전용"
          color="#6b7280" />

        {/* Arrows: CLI → runtime */}
        <line x1={280} y1={94} x2={280} y2={140} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#cg-arr)" />

        {/* Arrows: runtime → supporting */}
        <line x1={230} y1={198} x2={76} y2={248} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#cg-arr)" />
        <line x1={250} y1={198} x2={178} y2={248} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#cg-arr)" />
        <line x1={280} y1={198} x2={280} y2={248} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#cg-arr)" />
        <line x1={310} y1={198} x2={382} y2={248} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#cg-arr)" />
        <line x1={330} y1={198} x2={484} y2={248} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#cg-arr)" />

        {/* compat-harness → runtime */}
        <line x1={138} y1={70} x2={205} y2={160} stroke="#6b7280" strokeWidth={0.8} strokeDasharray="3 2" markerEnd="url(#cg-arr)" />

        <text x={280} y={326} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">단방향 DAG · runtime 중앙 허브 (전체 LOC의 44%)</text>
      </svg>
    </div>
  );
}
