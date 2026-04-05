import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function PluginArchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Plugin Tool 서브프로세스 실행</text>

        <defs>
          <marker id="pa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* LLM 요청 */}
        <ActionBox x={15} y={60} w={95} h={48}
          label="LLM"
          sub="tool_use"
          color="#8b5cf6" />

        {/* claw-code 메인 */}
        <ModuleBox x={125} y={55} w={130} h={58}
          label="claw-code"
          sub="메인 프로세스"
          color="#3b82f6" />

        {/* 플러그인 프로세스 */}
        <ModuleBox x={355} y={55} w={175} h={58}
          label="Plugin 서브프로세스"
          sub="entrypoint (별도 언어)"
          color="#10b981" />

        {/* 화살표 */}
        <line x1={110} y1={84} x2={125} y2={84} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#pa-arr)" />

        {/* stdin/stdout 통신 — 간격 100px 확보 */}
        <line x1={255} y1={72} x2={355} y2={72} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#pa-arr)" />
        <text x={305} y={66} textAnchor="middle" fontSize={9} fill="#3b82f6">stdin: JSON</text>

        <line x1={355} y1={96} x2={255} y2={96} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#pa-arr)" />
        <text x={305} y={108} textAnchor="middle" fontSize={9} fill="#10b981">stdout: JSON</text>

        {/* 격리 */}
        <rect x={350} y={140} width={185} height={130} rx={8}
          fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={1} strokeDasharray="4 3" />
        <text x={442} y={158} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          격리 (Unix rlimit)
        </text>

        <DataBox x={360} y={166} w={165} h={28}
          label="RLIMIT_AS"
          sub="128MB 메모리"
          color="#10b981" />
        <DataBox x={360} y={198} w={165} h={28}
          label="RLIMIT_CPU"
          sub="10초 CPU"
          color="#10b981" />
        <DataBox x={360} y={230} w={165} h={28}
          label="timeout 30s"
          sub="tokio::timeout"
          color="#10b981" />

        {/* 장점 표시 */}
        <g transform="translate(25, 150)">
          <text x={0} y={12} fontSize={10} fontWeight={700} fill="var(--foreground)">격리 이점:</text>
          <text x={0} y={30} fontSize={9} fill="var(--muted-foreground)">✓ 크래시 격리</text>
          <text x={0} y={46} fontSize={9} fill="var(--muted-foreground)">✓ 메모리 누수 방지</text>
          <text x={0} y={62} fontSize={9} fill="var(--muted-foreground)">✓ 언어 무관 (Python, Go, Bash)</text>
          <text x={0} y={78} fontSize={9} fill="var(--muted-foreground)">✓ 샌드박스 적용 가능</text>
        </g>

        <text x={280} y={296} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">호출당 fork/exec (~20ms 오버헤드)</text>
      </svg>
    </div>
  );
}
