export default function OverrideViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 310" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Override Scope 3단계 — 일시적 권한 변경</text>

        {/* Once */}
        <rect x={30} y={60} width={160} height={100} rx={8}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1} />
        <text x={110} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">Once</text>
        <text x={110} y={106} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1회 호출 후 제거</text>
        <text x={110} y={122} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">사용자 Y 응답 1회</text>
        <text x={110} y={142} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#3b82f6">이번만 허용</text>

        {/* Session */}
        <rect x={200} y={60} width={160} height={100} rx={8}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={1} />
        <text x={280} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Session</text>
        <text x={280} y={106} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">세션 종료 시 제거</text>
        <text x={280} y={122} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">/allow-all 명령</text>
        <text x={280} y={142} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#f59e0b">세션 내 유지</text>

        {/* Persistent */}
        <rect x={370} y={60} width={160} height={100} rx={8}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={450} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Persistent</text>
        <text x={450} y={106} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Policy 파일에 병합</text>
        <text x={450} y={122} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">&quot;Always&quot; 응답</text>
        <text x={450} y={142} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">재시작 후에도 유지</text>

        {/* 보안 원칙 */}
        <rect x={30} y={185} width={500} height={90} rx={8}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={1} />
        <text x={280} y={208} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
          보안 불변성: Override는 Deny를 뒤집지 못함
        </text>
        <text x={280} y={230} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          ✗ 기본 Enforcer가 Deny하면 Override로 Allow 불가
        </text>
        <text x={280} y={248} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          ✓ Override는 Allow를 강화(Deny/Prompt)만 가능
        </text>
        <text x={280} y={264} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">모든 확장(훅·플러그인·Override)의 공통 원칙</text>
      </svg>
    </div>
  );
}
