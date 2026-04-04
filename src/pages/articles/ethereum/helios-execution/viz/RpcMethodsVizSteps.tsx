import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './RpcMethodsVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({
  initial: { pathLength: 0 }, animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ================================================================
   Step 0 — 4개 메서드 공통 패턴: get_proof → verify → extract
   수평 파이프라인 × 4행
   ================================================================ */
export function Step0() {
  const methods = [
    { name: 'getBalance',          field: 'balance',  sub: 'account[1]' },
    { name: 'getCode',             field: 'code_hash', sub: 'keccak 검증' },
    { name: 'getStorageAt',        field: 'storage',  sub: '2단계 MPT' },
    { name: 'getTransactionCount', field: 'nonce',    sub: 'account[0]' },
  ];

  const rowH = 40;
  const startY = 22;

  return (
    <g>
      {/* 헤더 라벨 */}
      <text x={240} y={14} textAnchor="middle"
        fontSize={9} fontWeight={700} fill="var(--foreground)">
        4개 RPC 메서드 — 동일한 검증 파이프라인
      </text>

      {/* 단계 헤더 */}
      <motion.g {...fade(0)}>
        <text x={80} y={startY} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.rpc}>① RPC 요청</text>
        <text x={228} y={startY} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.proof}>② MPT 검증</text>
        <text x={380} y={startY} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.ok}>③ 필드 추출</text>
      </motion.g>

      {/* 4행 파이프라인 */}
      {methods.map((m, i) => {
        const y = startY + 10 + i * rowH;
        const delay = 0.1 + i * 0.12;

        return (
          <motion.g key={m.name} {...fade(delay)}>
            {/* 메서드 이름 */}
            <ModuleBox x={18} y={y} w={120} h={30} label={m.name} color={C.rpc} />

            {/* 화살표 1: → get_proof */}
            <motion.line x1={142} y1={y + 15} x2={162} y2={y + 15}
              stroke={C.rpc} strokeWidth={1} markerEnd="url(#arrRpc)"
              {...drawLine(delay + 0.15)} />

            {/* verify 박스 */}
            <ActionBox x={166} y={y} w={120} h={30}
              label="verify_proof" sub={`state_root 기준`} color={C.proof} />

            {/* 화살표 2: → extract */}
            <motion.line x1={290} y1={y + 15} x2={310} y2={y + 15}
              stroke={C.proof} strokeWidth={1} markerEnd="url(#arrProof)"
              {...drawLine(delay + 0.25)} />

            {/* 결과 필드 */}
            <motion.g {...fade(delay + 0.3)}>
              <DataBox x={314} y={y} w={90} h={30}
                label={m.field} sub={m.sub} color={C.ok} />
            </motion.g>

            {/* 검증 완료 체크 */}
            <motion.g {...fade(delay + 0.4)}>
              <text x={418} y={y + 18} fontSize={12} fill={C.ok}>{'✓'}</text>
            </motion.g>
          </motion.g>
        );
      })}

      {/* 하단 요약 */}
      <motion.g {...fade(0.8)}>
        <rect x={40} y={178} width={400} height={18} rx={9}
          fill={`${C.proof}10`} stroke={C.proof} strokeWidth={0.6} />
        <text x={240} y={190} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.proof}>
          공통: CL이 확인한 state_root 기준 → RPC 응답을 수학적으로 검증
        </text>
      </motion.g>

      {/* marker 정의 */}
      <defs>
        <marker id="arrRpc" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rpc} />
        </marker>
        <marker id="arrProof" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proof} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — getLogs: Bloom Filter 시각화
   2048비트 필터에서 address/topic 매칭
   ================================================================ */
export function Step1() {
  /* 비트맵 시각화용 — 24×6 그리드 (144개, 대표 표현) */
  const cols = 32;
  const rows = 4;
  const cellW = 12;
  const cellH = 10;
  const gridX = 50;
  const gridY = 50;

  /* 3개 해시 함수가 세팅하는 비트 위치 (대표 예시) */
  const addressBits = [3, 14, 27];   // address 해시 → 3비트
  const topicBits = [8, 19, 30];     // topic 해시 → 3비트
  const activeBits = new Set([...addressBits, ...topicBits]);

  /* false positive 예시 비트 — 다른 로그가 세팅해둔 비트 */
  const noiseBits = new Set([1, 5, 11, 16, 22, 25, 31, 36, 42, 48,
    55, 60, 67, 72, 80, 85, 90, 98, 105, 110, 115, 120]);

  return (
    <g>
      {/* 제목 */}
      <text x={240} y={14} textAnchor="middle"
        fontSize={9} fontWeight={700} fill="var(--foreground)">
        logsBloom — 2048비트 Bloom Filter
      </text>

      {/* keccak → 3비트 설명 */}
      <motion.g {...fade(0.1)}>
        <text x={240} y={30} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          keccak256(address/topic) → 하위 11비트씩 3개 추출 → 2048비트 중 3곳에 1 세팅
        </text>
      </motion.g>

      {/* 비트맵 영역 배경 */}
      <rect x={gridX - 4} y={gridY - 4} width={cols * cellW + 8} height={rows * cellH + 8}
        rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

      {/* 비트 셀 */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = r * cols + c;
          const isAddr = addressBits.includes(idx);
          const isTopic = topicBits.includes(idx);
          const isActive = activeBits.has(idx);
          const isNoise = noiseBits.has(idx);
          const fill = isAddr ? C.rpc : isTopic ? C.bloom : isNoise ? `${C.muted}40` : `${C.muted}15`;
          const delay = 0.2 + (isActive ? 0.4 : 0);

          return (
            <motion.rect
              key={idx}
              x={gridX + c * cellW} y={gridY + r * cellH}
              width={cellW - 1.5} height={cellH - 1.5} rx={2}
              fill={fill}
              stroke={isActive ? (isAddr ? C.rpc : C.bloom) : 'none'}
              strokeWidth={isActive ? 1.2 : 0}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay }}
            />
          );
        })
      )}

      {/* 범례 */}
      <motion.g {...fade(0.7)}>
        {/* address 비트 */}
        <rect x={gridX} y={gridY + rows * cellH + 12} width={10} height={10} rx={2} fill={C.rpc} />
        <text x={gridX + 14} y={gridY + rows * cellH + 20}
          fontSize={7.5} fill="var(--foreground)">address 비트 (3개)</text>

        {/* topic 비트 */}
        <rect x={gridX + 120} y={gridY + rows * cellH + 12} width={10} height={10} rx={2} fill={C.bloom} />
        <text x={gridX + 134} y={gridY + rows * cellH + 20}
          fontSize={7.5} fill="var(--foreground)">topic 비트 (3개)</text>

        {/* noise 비트 */}
        <rect x={gridX + 240} y={gridY + rows * cellH + 12} width={10} height={10} rx={2}
          fill={`${C.muted}40`} />
        <text x={gridX + 254} y={gridY + rows * cellH + 20}
          fontSize={7.5} fill="var(--muted-foreground)">다른 로그가 세팅</text>
      </motion.g>

      {/* 검증 결과 영역 */}
      <motion.g {...fade(0.9)}>
        <rect x={40} y={148} width={190} height={44} rx={8}
          fill="var(--card)" stroke={C.ok} strokeWidth={0.6} />
        <text x={135} y={164} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.ok}>6개 비트 모두 1</text>
        <text x={135} y={178} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          {"→ 포함 가능 (false positive 존재)"}
        </text>

        <rect x={250} y={148} width={190} height={44} rx={8}
          fill="var(--card)" stroke={C.trust} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={345} y={164} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.trust}>비트 하나라도 0</text>
        <text x={345} y={178} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          {"→ 확실히 미포함 (false negative 없음)"}
        </text>
      </motion.g>
    </g>
  );
}

/* ================================================================
   Step 2 — sendRawTransaction: 비검증 신뢰 경로
   4개 검증 경로 vs 1개 신뢰 경로 대비
   ================================================================ */
export function Step2() {
  return (
    <g>
      {/* 제목 */}
      <text x={240} y={14} textAnchor="middle"
        fontSize={9} fontWeight={700} fill="var(--foreground)">
        5개 메서드 신뢰 모델 — 4개 검증 vs 1개 신뢰
      </text>

      {/* ── 좌측: 검증 경로 (4개) ── */}
      <rect x={10} y={24} width={210} height={120} rx={8}
        fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={115} y={40} textAnchor="middle"
        fontSize={8} fontWeight={700} fill={C.ok}>Merkle 증명 검증 (4개)</text>

      {['getBalance', 'getCode', 'getStorageAt', 'getTxCount'].map((name, i) => {
        const y = 48 + i * 22;
        return (
          <motion.g key={name} {...fade(0.1 + i * 0.08)}>
            <rect x={22} y={y} width={120} height={18} rx={4}
              fill="var(--card)" stroke={C.proof} strokeWidth={0.5} />
            <text x={82} y={y + 12} textAnchor="middle"
              fontSize={8} fontWeight={600} fill="var(--foreground)">{name}</text>

            {/* 화살표 → 검증 완료 */}
            <motion.line x1={146} y1={y + 9} x2={172} y2={y + 9}
              stroke={C.ok} strokeWidth={0.8} markerEnd="url(#arrOk)"
              {...drawLine(0.3 + i * 0.08)} />

            <text x={186} y={y + 12} fontSize={10} fill={C.ok}>{'✓'}</text>
          </motion.g>
        );
      })}

      {/* ── 우측: 신뢰 경로 (sendTx) ── */}
      <rect x={240} y={24} width={230} height={120} rx={8}
        fill={`${C.trust}06`} stroke={C.trust} strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={355} y={40} textAnchor="middle"
        fontSize={8} fontWeight={700} fill={C.trust}>RPC 신뢰 위임 (1개)</text>

      {/* sendRawTransaction 흐름 */}
      <motion.g {...fade(0.3)}>
        <AlertBox x={258} y={50} w={110} h={34}
          label="sendRawTx" sub="로컬 검증 불가" color={C.trust} />
      </motion.g>

      <motion.line x1={372} y1={67} x2={392} y2={67}
        stroke={C.trust} strokeWidth={1} markerEnd="url(#arrTrust)"
        {...drawLine(0.5)} />

      <motion.g {...fade(0.55)}>
        <ModuleBox x={396} y={50} w={62} h={34}
          label="RPC" sub="프록시 전달" color={C.trust} />
      </motion.g>

      {/* 사후 확인 경로 */}
      <motion.g {...fade(0.65)}>
        <motion.path
          d="M 313 88 L 313 104 L 380 104"
          fill="none" stroke={C.bloom} strokeWidth={0.8}
          strokeDasharray="3 2" markerEnd="url(#arrBloom)"
          {...drawLine(0.7)} />

        <rect x={384} y={94} width={76} height={22} rx={4}
          fill="var(--card)" stroke={C.bloom} strokeWidth={0.5} />
        <text x={422} y={108} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.bloom}>사후 receipt 확인</text>
      </motion.g>

      {/* TX hash 기록 */}
      <motion.g {...fade(0.75)}>
        <text x={355} y={132} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          TX 해시 기록 → getTransactionReceipt로 포함 증명
        </text>
      </motion.g>

      {/* ── 하단: 신뢰 비율 요약 ── */}
      <motion.g {...fade(0.9)}>
        <rect x={30} y={152} width={420} height={40} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

        {/* 검증 바 (80%) */}
        <rect x={45} y={162} width={256} height={12} rx={6}
          fill={`${C.ok}20`} />
        <rect x={45} y={162} width={256} height={12} rx={6}
          fill={C.ok} opacity={0.7} />
        <text x={173} y={171} textAnchor="middle"
          fontSize={7.5} fontWeight={700} fill="#fff">4/5 검증 가능 (80%)</text>

        {/* 신뢰 바 (20%) */}
        <rect x={305} y={162} width={64} height={12} rx={6}
          fill={C.trust} opacity={0.7} />
        <text x={337} y={171} textAnchor="middle"
          fontSize={7} fontWeight={700} fill="#fff">1/5</text>

        <text x={240} y={184} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          읽기는 전부 증명 검증 — 쓰기만 RPC 신뢰 필요
        </text>
      </motion.g>

      {/* marker 정의 */}
      <defs>
        <marker id="arrOk" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.ok} />
        </marker>
        <marker id="arrTrust" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.trust} />
        </marker>
        <marker id="arrBloom" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.bloom} />
        </marker>
      </defs>
    </g>
  );
}
