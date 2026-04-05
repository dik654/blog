import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

export default function TeamCronViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Team &amp; Cron — 자동화 통합</text>

        <defs>
          <marker id="tc-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Cron */}
        <ModuleBox x={25} y={62} w={150} h={58}
          label="CronScheduler"
          sub='"0 2 * * *"'
          color="#f59e0b" />

        {/* Task Template */}
        <DataBox x={205} y={68} w={150} h={46}
          label="TaskPacket template"
          sub="매 실행마다 복사"
          color="#3b82f6" />

        {/* Task Registry */}
        <ModuleBox x={385} y={62} w={150} h={58}
          label="TaskRegistry"
          sub="인메모리 CRUD"
          color="#8b5cf6" />

        <line x1={175} y1={91} x2={205} y2={91} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#tc-arr)" />
        <line x1={355} y1={91} x2={385} y2={91} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#tc-arr)" />

        {/* Team */}
        <ModuleBox x={205} y={156} w={150} h={58}
          label="Team"
          sub="담당 task_tags"
          color="#10b981" />

        <line x1={460} y1={120} x2={325} y2={156} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#tc-arr)" />
        <text x={380} y={138} fontSize={9} fill="var(--muted-foreground)">auto assign</text>

        {/* Workers */}
        <ActionBox x={70} y={246} w={95} h={40}
          label="Worker A"
          sub=""
          color="#3b82f6" />
        <ActionBox x={232} y={246} w={95} h={40}
          label="Worker B"
          sub=""
          color="#3b82f6" />
        <ActionBox x={395} y={246} w={95} h={40}
          label="Worker C"
          sub=""
          color="#3b82f6" />

        <line x1={250} y1={214} x2={117} y2={246} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={280} y1={214} x2={280} y2={246} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={310} y1={214} x2={443} y2={246} stroke="var(--border)" strokeWidth={0.5} />

        <text x={280} y={236} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">worker_pool (max_concurrent_tasks)</text>
      </svg>
    </div>
  );
}
