/**
 * GitHub git push RCE (CVE-2026-3854) — 5 단계 공격 체인.
 * 공격자 / push 처리기 / 메타데이터 / hook 실행자 / 신뢰 경계.
 */
export default function AttackChainViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">git push RCE 공격 체인 — 신뢰 경계 침범 흐름</text>

        {/* 공격자 */}
        <g>
          <rect x={20} y={50} width={140} height={56} rx={6}
            fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} />
          <text x={90} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">공격자</text>
          <text x={90} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">push 권한 1명</text>
          <text x={90} y={99} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">payload = -o "..."</text>
        </g>

        {/* 화살표 1 → push 처리기 */}
        <g>
          <line x1={160} y1={78} x2={210} y2={78} stroke="#ef4444" strokeWidth={1.4} />
          <polygon points="210,78 204,75 204,81" fill="#ef4444" />
          <text x={185} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">1. push</text>
        </g>

        {/* push 처리기 */}
        <g>
          <rect x={210} y={50} width={150} height={56} rx={6}
            fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1} />
          <text x={285} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">push 처리기</text>
          <text x={285} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">옵션 파싱 → 메타 빌드</text>
          <text x={285} y={99} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">⚠ 살균 누락</text>
        </g>

        {/* 화살표 2 */}
        <g>
          <line x1={360} y1={78} x2={410} y2={78} stroke="#ef4444" strokeWidth={1.4} />
          <polygon points="410,78 404,75 404,81" fill="#ef4444" />
          <text x={385} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">2. parse</text>
        </g>

        {/* 메타데이터 */}
        <g>
          <rect x={410} y={50} width={150} height={56} rx={6}
            fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
          <text x={485} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">내부 메타데이터</text>
          <text x={485} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">key=value 평문 객체</text>
          <text x={485} y={99} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">+ 가짜 필드 인젝션</text>
        </g>

        {/* 화살표 3 (꺾어 내려감) */}
        <g>
          <line x1={485} y1={106} x2={485} y2={150} stroke="#ef4444" strokeWidth={1.4} />
          <polygon points="485,150 482,144 488,144" fill="#ef4444" />
          <text x={500} y={132} fontSize={9} fontWeight={600} fill="#ef4444">3. inject</text>
        </g>

        {/* 신뢰 경계 (점선) */}
        <g>
          <line x1={20} y1={140} x2={W - 20} y2={140} stroke="#9ca3af" strokeWidth={1} strokeDasharray="6 4" />
          <text x={W - 30} y={135} textAnchor="end" fontSize={9} fontStyle="italic" fill="#9ca3af">신뢰 경계 (사용자 ↔ 사내)</text>
        </g>

        {/* 후행 서비스 */}
        <g>
          <rect x={410} y={150} width={150} height={56} rx={6}
            fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1} />
          <text x={485} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">후행 서비스</text>
          <text x={485} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">메타 = 신뢰 값으로 해석</text>
          <text x={485} y={199} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">재검증 없음</text>
        </g>

        {/* 화살표 4 (수평 왼쪽) */}
        <g>
          <line x1={410} y1={178} x2={360} y2={178} stroke="#ef4444" strokeWidth={1.4} />
          <polygon points="360,178 366,175 366,181" fill="#ef4444" />
          <text x={385} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">4. forward</text>
        </g>

        {/* hook 샌드박스 */}
        <g>
          <rect x={210} y={150} width={150} height={56} rx={6}
            fill="#06b6d4" fillOpacity={0.08} stroke="#06b6d4" strokeWidth={1} />
          <text x={285} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#06b6d4">hook 샌드박스</text>
          <text x={285} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">평소엔 격리</text>
          <text x={285} y={199} textAnchor="middle" fontSize={9} fontStyle="italic" fill="#ef4444">샌드박스 우회됨</text>
        </g>

        {/* 화살표 5 (왼쪽으로 + 아래로) */}
        <g>
          <line x1={210} y1={178} x2={170} y2={178} stroke="#ef4444" strokeWidth={1.4} />
          <line x1={170} y1={178} x2={170} y2={232} stroke="#ef4444" strokeWidth={1.4} />
          <polygon points="170,232 167,226 173,226" fill="#ef4444" />
          <text x={130} y={170} textAnchor="end" fontSize={9} fontWeight={600} fill="#ef4444">5. execute</text>
        </g>

        {/* RCE 결과 */}
        <g>
          <rect x={70} y={232} width={200} height={56} rx={6}
            fill="#ef4444" fillOpacity={0.18} stroke="#ef4444" strokeWidth={1.5} />
          <text x={170} y={252} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">RCE — 임의 명령 실행</text>
          <text x={170} y={268} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">서버 권한 = hook 실행자 권한</text>
          <text x={170} y={281} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">평소 안 가는 분기 → 카운터 +1</text>
        </g>

        {/* 방어선 박스 */}
        <g>
          <rect x={300} y={232} width={400} height={56} rx={6}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" />
          <text x={500} y={252} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">75 분 패치 — 다층 방어</text>
          <text x={500} y={268} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1차: push option 살균 (구분자 차단)</text>
          <text x={500} y={281} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">2차: 미사용 코드 경로 production 이미지에서 제거</text>
        </g>

        {/* 교훈 */}
        <text x={W / 2} y={320} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          핵심 교훈 — 경계에서 살균 / 내부 서비스도 재검증 / 비정상 분기 카운터 / 이미지 미니마이제이션
        </text>
        <text x={W / 2} y={340} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          공격에 필요한 것: push 권한 1 명 + 가공된 push option 한 줄
        </text>
        <text x={W / 2} y={358} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          관측가능성이 패치 속도를 만든다 — 평소 0 인 카운터에 알람 걸어두기
        </text>
      </svg>
    </div>
  );
}
