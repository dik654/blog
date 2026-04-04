const C = '#3b82f6', CM = 'var(--muted-foreground)', CF = 'var(--foreground)';

export default function EVMArchViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <svg viewBox="0 0 520 190" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {/* BlockContext */}
        <rect x={8} y={5} width={120} height={68} rx={4} fill={`${C}08`} stroke={C} strokeWidth={0.8} />
        <text x={68} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C}>BlockContext</text>
        <text x={68} y={34} textAnchor="middle" fontSize={10} fill={CM}>Coinbase, GasLimit</text>
        <text x={68} y={48} textAnchor="middle" fontSize={10} fill={CM}>Time, BaseFee</text>
        <line x1={16} y1={56} x2={120} y2={56} stroke={C} strokeWidth={0.3} opacity={0.2} />
        <text x={68} y={67} textAnchor="middle" fontSize={10} fill={C} opacity={0.7}>블록 환경 — 모든 tx 공유</text>

        {/* TxContext */}
        <rect x={8} y={96} width={120} height={68} rx={4} fill={`${C}08`} stroke={C} strokeWidth={0.8} />
        <text x={68} y={111} textAnchor="middle" fontSize={10} fontWeight={600} fill={C}>TxContext</text>
        <text x={68} y={125} textAnchor="middle" fontSize={10} fill={CM}>Origin (tx.origin)</text>
        <text x={68} y={139} textAnchor="middle" fontSize={10} fill={CM}>GasPrice</text>
        <line x1={16} y1={147} x2={120} y2={147} stroke={C} strokeWidth={0.3} opacity={0.2} />
        <text x={68} y={158} textAnchor="middle" fontSize={10} fill={C} opacity={0.7}>tx별 정보 — 매 tx마다 교체</text>

        {/* EVM — center */}
        <rect x={160} y={5} width={160} height={159} rx={6} fill={`${C}10`} stroke={C} strokeWidth={1.2} />
        <text x={240} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={C}>EVM</text>
        <text x={240} y={42} textAnchor="middle" fontSize={10} fill={CF}>StateDB — 상태 읽기/쓰기</text>
        <text x={240} y={58} textAnchor="middle" fontSize={10} fill={CF}>JumpTable[256] — opcode 디스패치</text>
        <text x={240} y={74} textAnchor="middle" fontSize={10} fill={CF}>depth — 재귀 깊이 (max 1024)</text>
        <line x1={170} y1={86} x2={310} y2={86} stroke={C} strokeWidth={0.4} opacity={0.3} />
        <text x={206} y={104} textAnchor="middle" fontSize={10} fontWeight={600} fill={C}>Call()</text>
        <text x={274} y={104} textAnchor="middle" fontSize={10} fontWeight={600} fill={C}>Run()</text>
        <text x={240} y={122} textAnchor="middle" fontSize={10} fill={CM}>Create · DelegateCall · StaticCall</text>
        <line x1={170} y1={132} x2={310} y2={132} stroke={C} strokeWidth={0.3} opacity={0.2} />
        <text x={240} y={146} textAnchor="middle" fontSize={10} fill={C} opacity={0.7}>실행 엔진 — 블록 내내</text>
        <text x={240} y={158} textAnchor="middle" fontSize={10} fill={C} opacity={0.7}>하나의 인스턴스 재사용</text>

        {/* ScopeContext */}
        <rect x={352} y={5} width={160} height={68} rx={4} fill={`${C}08`} stroke={C} strokeWidth={0.8} />
        <text x={432} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C}>ScopeContext</text>
        <text x={432} y={36} textAnchor="middle" fontSize={10} fill={CF}>Memory — 휘발성, 가스 이차 증가</text>
        <text x={432} y={50} textAnchor="middle" fontSize={10} fill={CF}>Stack — 256비트, 최대 1024</text>
        <line x1={360} y1={56} x2={504} y2={56} stroke={C} strokeWidth={0.3} opacity={0.2} />
        <text x={432} y={67} textAnchor="middle" fontSize={10} fill={C} opacity={0.7}>호출마다 생성, Pool에 반환</text>

        {/* Contract */}
        <rect x={352} y={96} width={160} height={68} rx={4} fill={`${C}08`} stroke={C} strokeWidth={0.8} />
        <text x={432} y={111} textAnchor="middle" fontSize={10} fontWeight={600} fill={C}>Contract</text>
        <text x={432} y={127} textAnchor="middle" fontSize={10} fill={CF}>Code(바이트코드) · Gas(잔여)</text>
        <text x={432} y={141} textAnchor="middle" fontSize={10} fill={CF}>caller · address · value</text>
        <line x1={360} y1={149} x2={504} y2={149} stroke={C} strokeWidth={0.3} opacity={0.2} />
        <text x={432} y={159} textAnchor="middle" fontSize={10} fill={C} opacity={0.7}>실행 대상 — 코드+호출 정보</text>

        {/* Arrows: left → center */}
        {[[128, 38, 160, 50], [128, 130, 160, 100]].map(([x1, y1, x2, y2], i) => (
          <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C} strokeWidth={0.6} markerEnd="url(#aA)" />
        ))}
        {/* Arrows: center → right */}
        {[[320, 38, 352, 38], [320, 130, 352, 130]].map(([x1, y1, x2, y2], i) => (
          <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C} strokeWidth={0.6} markerEnd="url(#aA)" />
        ))}
        <text x={336} y={30} textAnchor="middle" fontSize={10} fill={CM}>per-call</text>
        <text x={336} y={122} textAnchor="middle" fontSize={10} fill={CM}>per-call</text>

        {/* 전체 흐름 요약 */}
        <text x={260} y={182} textAnchor="middle" fontSize={10} fill={CM}>
          블록 정보 + tx 정보 → EVM이 Call/Run 실행 → 호출마다 ScopeContext + Contract 생성
        </text>

        <defs>
          <marker id="aA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={C} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
