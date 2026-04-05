export default function PluginVsMcpViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Plugin vs MCP — 선택 기준</text>

        {/* Plugin 컬럼 */}
        <rect x={20} y={44} width={255} height={232} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.5} />
        <text x={147} y={66} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">Plugin</text>
        <text x={147} y={82} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">호출당 stateless</text>
        <line x1={35} y1={90} x2={260} y2={90} stroke="#10b981" strokeOpacity={0.3} strokeWidth={0.8} />

        <text x={35} y={108} fontSize={10} fontWeight={700} fill="var(--foreground)">수명</text>
        <text x={35} y={124} fontSize={9} fill="var(--muted-foreground)">• 호출당 fork/exec 후 종료</text>
        <text x={35} y={138} fontSize={9} fill="var(--muted-foreground)">• 서브프로세스 ~20ms 오버헤드</text>

        <text x={35} y={158} fontSize={10} fontWeight={700} fill="var(--foreground)">통신</text>
        <text x={35} y={174} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">• stdin/stdout JSON</text>
        <text x={35} y={188} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">• timeout 30s</text>

        <text x={35} y={208} fontSize={10} fontWeight={700} fill="var(--foreground)">유리한 경우</text>
        <text x={35} y={224} fontSize={9} fill="var(--muted-foreground)">✓ 프로젝트 전용 커스텀 도구</text>
        <text x={35} y={238} fontSize={9} fill="var(--muted-foreground)">✓ 사내 린터, 배포 스크립트</text>
        <text x={35} y={252} fontSize={9} fill="var(--muted-foreground)">✓ 언어 무관 (Bash, Python, Go)</text>
        <text x={35} y={266} fontSize={9} fill="var(--muted-foreground)">✓ 단발성 경량 연산</text>

        {/* MCP 컬럼 */}
        <rect x={285} y={44} width={255} height={232} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={412} y={66} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">MCP</text>
        <text x={412} y={82} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">연결당 stateful</text>
        <line x1={300} y1={90} x2={525} y2={90} stroke="#3b82f6" strokeOpacity={0.3} strokeWidth={0.8} />

        <text x={300} y={108} fontSize={10} fontWeight={700} fill="var(--foreground)">수명</text>
        <text x={300} y={124} fontSize={9} fill="var(--muted-foreground)">• 장수명 서버 — 세션 동안 유지</text>
        <text x={300} y={138} fontSize={9} fill="var(--muted-foreground)">• 연결 설정 1회, 이후 재사용</text>

        <text x={300} y={158} fontSize={10} fontWeight={700} fill="var(--foreground)">통신</text>
        <text x={300} y={174} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">• JSON-RPC (stdio/SSE/HTTP)</text>
        <text x={300} y={188} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">• timeout 120s</text>

        <text x={300} y={208} fontSize={10} fontWeight={700} fill="var(--foreground)">유리한 경우</text>
        <text x={300} y={224} fontSize={9} fill="var(--muted-foreground)">✓ DB 연결, API 세션 유지</text>
        <text x={300} y={238} fontSize={9} fill="var(--muted-foreground)">✓ 여러 도구가 리소스 공유</text>
        <text x={300} y={252} fontSize={9} fill="var(--muted-foreground)">✓ 외부 공개/공유 도구</text>
        <text x={300} y={266} fontSize={9} fill="var(--muted-foreground)">✓ 표준 프로토콜 필요</text>

        <text x={280} y={294} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">claw-code는 이중 확장 구조로 간단한 확장 + 복잡한 통합을 모두 커버</text>
      </svg>
    </div>
  );
}
