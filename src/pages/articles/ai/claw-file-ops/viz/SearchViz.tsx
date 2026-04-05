export default function SearchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">glob_search vs grep_search — 역할 분리</text>

        {/* glob_search */}
        <rect x={30} y={56} width={240} height={204} rx={10}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1.2} />
        <text x={150} y={80} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          glob_search
        </text>
        <text x={150} y={98} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          파일명 패턴 매칭
        </text>

        <g transform="translate(45, 112)">
          <rect x={0} y={0} width={210} height={26} rx={3}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={17} fontSize={9.5} fontFamily="monospace" fill="#3b82f6">**/*.rs</text>

          <rect x={0} y={34} width={210} height={26} rx={3}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={51} fontSize={9.5} fontFamily="monospace" fill="#3b82f6">src/**/*.ts</text>

          <rect x={0} y={68} width={210} height={26} rx={3}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={85} fontSize={9.5} fontFamily="monospace" fill="#3b82f6">test_*.py</text>
        </g>

        <text x={150} y={222} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">
          → 파일 목록 반환
        </text>
        <text x={150} y={236} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          수정 시각 순 정렬
        </text>
        <text x={150} y={250} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          1000개 상한
        </text>

        {/* grep_search */}
        <rect x={290} y={56} width={240} height={204} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.2} />
        <text x={410} y={80} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          grep_search
        </text>
        <text x={410} y={98} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          파일 내용 정규식
        </text>

        <g transform="translate(305, 112)">
          <rect x={0} y={0} width={210} height={26} rx={3}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={17} fontSize={9.5} fontFamily="monospace" fill="#10b981">fn handle_.*</text>

          <rect x={0} y={34} width={210} height={26} rx={3}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={51} fontSize={9.5} fontFamily="monospace" fill="#10b981">TODO|FIXME</text>

          <rect x={0} y={68} width={210} height={26} rx={3}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={10} y={85} fontSize={9.5} fontFamily="monospace" fill="#10b981">\bError\b</text>
        </g>

        <text x={410} y={222} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
          → 매칭 줄 반환
        </text>
        <text x={410} y={236} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ripgrep 라이브러리 기반
        </text>
        <text x={410} y={250} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          3가지 OutputMode
        </text>

        <text x={280} y={284} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">gitignore 자동 적용 · 바이너리 파일 자동 스킵</text>
      </svg>
    </div>
  );
}
