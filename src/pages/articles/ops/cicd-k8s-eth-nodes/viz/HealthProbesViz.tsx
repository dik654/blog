/**
 * K8s 헬스 체크 3 종 — startup · readiness · liveness 의 시간선과 책임 분리.
 */
export default function HealthProbesViz() {
  const W = 720;
  const H = 320;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">헬스 체크 3 종 — startup · readiness · liveness 의 시간선</text>

        {/* 시간선 */}
        <line x1={50} y1={250} x2={690} y2={250} stroke="#94a3b8" strokeWidth={1.5} />
        <text x={50} y={272} fontSize={9} fill="var(--muted-foreground)">Pod 시작</text>
        <text x={690} y={272} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">Pod 종료</text>

        {/* startup 구간 */}
        <g>
          <rect x={70} y={50} width={180} height={70} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1.4} />
          <text x={160} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">startup probe</text>
          <text x={160} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">앱 시작 완료 신호</text>
          <text x={160} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실패 시 → restart</text>
          <text x={160} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">slow start 보호</text>

          <line x1={160} y1={120} x2={160} y2={250} stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="2 2" />
          <line x1={70} y1={245} x2={250} y2={245} stroke="#3b82f6" strokeWidth={2.5} />
          <text x={160} y={235} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#3b82f6">시작 ~ 준비됨</text>
        </g>

        {/* readiness 구간 */}
        <g>
          <rect x={270} y={50} width={180} height={70} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1.4} />
          <text x={360} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">readiness probe</text>
          <text x={360} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">트래픽 받을 준비</text>
          <text x={360} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실패 시 → endpoint 제외</text>
          <text x={360} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">무거운 체크 OK</text>

          <line x1={360} y1={120} x2={360} y2={250} stroke="#10b981" strokeWidth={0.8} strokeDasharray="2 2" />
          <line x1={250} y1={245} x2={690} y2={245} stroke="#10b981" strokeWidth={2.5} />
          <text x={470} y={262} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#10b981">계속 체크 — 일시 미준비 시 traffic 만 차단</text>
        </g>

        {/* liveness 구간 */}
        <g>
          <rect x={490} y={50} width={200} height={70} rx={6}
            fill="#ef4444" fillOpacity={0.10} stroke="#ef4444" strokeWidth={1.4} />
          <text x={590} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">liveness probe</text>
          <text x={590} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">살아 있나 (가벼운 ping)</text>
          <text x={590} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실패 시 → restart</text>
          <text x={590} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">deadlock 감지</text>

          <line x1={590} y1={120} x2={590} y2={250} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="2 2" />
          <line x1={250} y1={240} x2={690} y2={240} stroke="#ef4444" strokeWidth={2.5} />
        </g>

        {/* 함정 박스 */}
        <g>
          <rect x={50} y={140} width={640} height={50} rx={6}
            fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
          <text x={370} y={158} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">⚠ 흔한 함정 — 셋 분리 안 함</text>
          <text x={370} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">liveness · readiness 같은 endpoint 사용 → sync 도중 OOM-restart 폭주</text>
          <text x={370} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">slow start 앱은 startup 없으면 liveness 가 시작 도중 fail 처리</text>
        </g>

        {/* 결론 */}
        <text x={W / 2} y={300} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          endpoint 분리 — /healthz (liveness) · /ready (readiness) · /startup (startup)
        </text>
      </svg>
    </div>
  );
}
