import { DataBox } from '@/components/viz/boxes';

export default function InitViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">claw init — 프로젝트 타입 감지 &amp; 템플릿 생성</text>

        <defs>
          <marker id="in-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 감지 단계 */}
        <text x={280} y={54} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          프로젝트 시그널 감지
        </text>

        <g transform="translate(35, 66)">
          {[
            { label: 'Cargo.toml', lang: 'Rust', color: '#f59e0b' },
            { label: 'package.json', lang: 'TS/JS', color: '#3b82f6' },
            { label: 'pyproject.toml', lang: 'Python', color: '#10b981' },
            { label: 'go.mod', lang: 'Go', color: '#06b6d4' },
          ].map((det, i) => (
            <g key={det.label} transform={`translate(${i * 125}, 0)`}>
              <rect x={0} y={0} width={118} height={52} rx={5}
                fill={det.color} fillOpacity={0.1} stroke={det.color} strokeWidth={1} />
              <text x={59} y={21} textAnchor="middle" fontSize={9.5} fontWeight={700}
                fontFamily="monospace" fill={det.color}>{det.label}</text>
              <text x={59} y={38} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                → {det.lang}
              </text>
            </g>
          ))}
        </g>

        <line x1={280} y1={126} x2={280} y2={138} stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#in-arr)" />

        {/* 생성 파일 */}
        <text x={280} y={154} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          생성 파일
        </text>

        <g transform="translate(35, 166)">
          <DataBox x={0} y={0} w={156} h={42}
            label=".claw/config.json"
            sub="자동 블랙리스트"
            color="#10b981" />
          <DataBox x={167} y={0} w={156} h={42}
            label=".claw/CLAUDE.md"
            sub="언어·명령 템플릿"
            color="#10b981" />
          <DataBox x={334} y={0} w={156} h={42}
            label=".gitignore"
            sub="업데이트 (추가만)"
            color="#f59e0b" />
        </g>

        {/* 블랙리스트 */}
        <rect x={35} y={226} width={490} height={62} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={246} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">자동 블랙리스트 (언어별)</text>
        <text x={280} y={264} textAnchor="middle" fontSize={9} fontFamily="monospace"
          fill="var(--muted-foreground)">
          Rust: target/** · JS: node_modules/**, dist/** · Python: __pycache__/**
        </text>
        <text x={280} y={278} textAnchor="middle" fontSize={9} fontFamily="monospace"
          fill="var(--muted-foreground)">
          + 공통: .git/**, *.pem, .env*
        </text>
      </svg>
    </div>
  );
}
