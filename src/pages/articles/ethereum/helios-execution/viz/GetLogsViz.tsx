import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

/* ── 색상 팔레트 ── */
const C = {
  proof: '#6366f1',
  rpc: '#3b82f6',
  ok: '#10b981',
  bloom: '#f59e0b',
  trust: '#ef4444',
  muted: '#94a3b8',
};

/* ── 애니메이션 헬퍼 ── */
const fade = (d: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: d },
});

const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ── 스텝 정의 ── */
const STEPS = [
  {
    label: '호출: eth_getLogs(filter)',
    body: '다른 4개 메서드와 달리 get_proof가 아닌 Bloom Filter 기반 검증을 사용한다.',
  },
  {
    label: 'Bloom Filter: 2048비트 비트맵',
    body: 'keccak256의 처음 6바이트에서 3개 인덱스 추출. 주소 + 토픽 최대 4개 = 최대 15비트 세팅.',
  },
  {
    label: 'Bloom 판정: false positive vs false negative 없음',
    body: '모든 비트가 1이면 "포함 가능" (오탐 존재). 하나라도 0이면 "확실히 미포함" (미탐 없음).',
  },
  {
    label: '2단계: Bloom 필터링 → receipt 정확 확인',
    body: 'Bloom이 후보를 걸러서 불필요한 receipt 다운로드를 방지한다.',
  },
  {
    label: '증명 기준: receipts_root (state_root 아님)',
    body: '블록 헤더에는 state_root, transactions_root, receipts_root 3개가 있다.',
  },
];

/* ── Bloom Filter 비트 그리드 생성 ── */
// 32x4 = 128 셀로 2048비트를 축약 표현 (각 셀 = 16비트 범위)
const COLS = 32;
const ROWS = 4;
const CELL_W = 12;
const CELL_H = 12;
const GRID_X = 24;
const GRID_Y = 62;

// keccak(address) → 3 bit positions (blue)
const ADDR_BITS = [3, 18, 45]; // 셀 인덱스
// keccak(topic) → 3 bit positions (amber)
const TOPIC_BITS = [12, 67, 99];
// 기존 다른 로그들이 세팅한 비트 (muted)
const OTHER_BITS = [7, 15, 22, 31, 38, 52, 61, 73, 84, 91, 108, 117];

function getCellColor(idx: number): string {
  if (ADDR_BITS.includes(idx)) return C.rpc;
  if (TOPIC_BITS.includes(idx)) return C.bloom;
  if (OTHER_BITS.includes(idx)) return C.muted;
  return 'none';
}

function getCellFill(idx: number): string {
  if (ADDR_BITS.includes(idx)) return `${C.rpc}30`;
  if (TOPIC_BITS.includes(idx)) return `${C.bloom}30`;
  if (OTHER_BITS.includes(idx)) return `${C.muted}15`;
  return 'var(--card)';
}

export default function GetLogsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ── 공통 marker 정의 ── */}
          <defs>
            <marker id="arr-gl-rpc" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rpc} />
            </marker>
            <marker id="arr-gl-proof" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proof} />
            </marker>
            <marker id="arr-gl-ok" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.ok} />
            </marker>
            <marker id="arr-gl-bloom" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.bloom} />
            </marker>
            <marker id="arr-gl-muted" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.muted} />
            </marker>
            <marker id="arr-gl-trust" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.trust} />
            </marker>
          </defs>

          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>

            {/* ════════════════════════════════════════════
                Step 0: 호출 — eth_getLogs(filter)
               ════════════════════════════════════════════ */}
            {step === 0 && (
              <g>
                {/* eth_getLogs 모듈 */}
                <motion.g {...fade(0)}>
                  <ModuleBox x={160} y={8} w={160} h={48} label="eth_getLogs" sub="Bloom Filter 기반 검증" color={C.rpc} />
                </motion.g>

                {/* 필터 파라미터 DataBox 4개 */}
                <motion.g {...fade(0.15)}>
                  <DataBox x={28} y={72} w={90} h={28} label="address" sub="0xAbCd..." color={C.rpc} />
                </motion.g>
                <motion.g {...fade(0.25)}>
                  <DataBox x={130} y={72} w={90} h={28} label="topics[]" sub="이벤트 시그니처" color={C.bloom} />
                </motion.g>
                <motion.g {...fade(0.35)}>
                  <DataBox x={232} y={72} w={90} h={28} label="fromBlock" sub="시작 블록" color={C.muted} />
                </motion.g>
                <motion.g {...fade(0.45)}>
                  <DataBox x={334} y={72} w={90} h={28} label="toBlock" sub="종료 블록" color={C.muted} />
                </motion.g>

                {/* 파라미터 → 함수 연결선 */}
                <motion.line x1={73} y1={56} x2={73} y2={72}
                  stroke={C.rpc} strokeWidth={0.7} strokeDasharray="3 2"
                  {...drawLine(0.2)} />
                <motion.line x1={175} y1={56} x2={175} y2={72}
                  stroke={C.bloom} strokeWidth={0.7} strokeDasharray="3 2"
                  {...drawLine(0.3)} />
                <motion.line x1={277} y1={56} x2={277} y2={72}
                  stroke={C.muted} strokeWidth={0.7} strokeDasharray="3 2"
                  {...drawLine(0.4)} />
                <motion.line x1={379} y1={56} x2={379} y2={72}
                  stroke={C.muted} strokeWidth={0.7} strokeDasharray="3 2"
                  {...drawLine(0.5)} />

                {/* 하단: 검증 방식 차이 강조 */}
                <motion.g {...fade(0.6)}>
                  <rect x={40} y={118} width={170} height={34} rx={6}
                    fill={`${C.proof}08`} stroke={C.proof} strokeWidth={0.5} />
                  <text x={125} y={132} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.proof}>
                    다른 메서드: get_proof
                  </text>
                  <text x={125} y={144} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    MPT Merkle 증명
                  </text>
                </motion.g>

                <motion.g {...fade(0.6)}>
                  <text x={230} y={136} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--muted-foreground)">
                    vs
                  </text>
                </motion.g>

                <motion.g {...fade(0.7)}>
                  <rect x={260} y={118} width={170} height={34} rx={6}
                    fill={`${C.bloom}10`} stroke={C.bloom} strokeWidth={1} />
                  <text x={345} y={132} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.bloom}>
                    getLogs: Bloom Filter
                  </text>
                  <text x={345} y={144} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    비트맵 기반 확률적 검증
                  </text>
                </motion.g>

                {/* 화살표: 왼쪽 → 오른쪽 (전환) */}
                <motion.line x1={210} y1={135} x2={258} y2={135}
                  stroke={C.bloom} strokeWidth={1} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.75)} />

                {/* 결과 */}
                <motion.g {...fade(0.8)}>
                  <DataBox x={150} y={166} w={180} h={28} label="Vec<Log>" sub="검증된 이벤트 로그 반환" color={C.ok} />
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 1: Bloom Filter 2048비트 비트맵
               ════════════════════════════════════════════ */}
            {step === 1 && (
              <g>
                {/* 제목 */}
                <motion.g {...fade(0)}>
                  <text x={240} y={14} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    logsBloom: 2048비트 (256바이트) 비트맵
                  </text>
                </motion.g>

                {/* 해시 수식 영역 */}
                <motion.g {...fade(0.1)}>
                  <rect x={24} y={24} width={432} height={28} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={240} y={37} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill="var(--foreground)">
                    hash = keccak256(data)
                  </text>
                  <text x={240} y={47} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    bit[0] = hash[0:2] % 2048  |  bit[1] = hash[2:4] % 2048  |  bit[2] = hash[4:6] % 2048
                  </text>
                </motion.g>

                {/* 비트맵 그리드 — 32x4 */}
                {Array.from({ length: ROWS }).map((_, row) =>
                  Array.from({ length: COLS }).map((_, col) => {
                    const idx = row * COLS + col;
                    const cx = GRID_X + col * (CELL_W + 1.5);
                    const cy = GRID_Y + row * (CELL_H + 1.5);
                    const color = getCellColor(idx);
                    const fill = getCellFill(idx);
                    const isSet = color !== 'none';
                    const delay = 0.2 + idx * 0.002;

                    return (
                      <motion.g key={idx} {...fade(delay)}>
                        <rect x={cx} y={cy} width={CELL_W} height={CELL_H} rx={2}
                          fill={fill}
                          stroke={isSet ? color : 'var(--border)'}
                          strokeWidth={isSet ? 1.2 : 0.3} />
                        {isSet && (
                          <text x={cx + CELL_W / 2} y={cy + CELL_H / 2 + 3}
                            textAnchor="middle" fontSize={7} fontWeight={700}
                            fill={color}>
                            1
                          </text>
                        )}
                      </motion.g>
                    );
                  })
                )}

                {/* 범례 — address 비트 */}
                <motion.g {...fade(0.5)}>
                  <rect x={24} y={126} width={10} height={10} rx={2}
                    fill={`${C.rpc}30`} stroke={C.rpc} strokeWidth={1} />
                  <text x={38} y={134} fontSize={7.5} fontWeight={600} fill={C.rpc}>
                    keccak(address) → 3비트
                  </text>
                </motion.g>

                {/* 범례 — topic 비트 */}
                <motion.g {...fade(0.55)}>
                  <rect x={170} y={126} width={10} height={10} rx={2}
                    fill={`${C.bloom}30`} stroke={C.bloom} strokeWidth={1} />
                  <text x={184} y={134} fontSize={7.5} fontWeight={600} fill={C.bloom}>
                    keccak(topic) → 3비트
                  </text>
                </motion.g>

                {/* 범례 — 기존 비트 */}
                <motion.g {...fade(0.6)}>
                  <rect x={320} y={126} width={10} height={10} rx={2}
                    fill={`${C.muted}15`} stroke={C.muted} strokeWidth={1} />
                  <text x={334} y={134} fontSize={7.5} fontWeight={600} fill={C.muted}>
                    다른 로그 비트
                  </text>
                </motion.g>

                {/* 하단: 입력 예시 */}
                <motion.g {...fade(0.65)}>
                  <rect x={24} y={146} width={200} height={24} rx={12}
                    fill={`${C.rpc}10`} stroke={C.rpc} strokeWidth={0.5} />
                  <text x={124} y={161} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.rpc}>
                    주소 1개 → 3비트 세팅
                  </text>
                </motion.g>

                <motion.g {...fade(0.7)}>
                  <rect x={240} y={146} width={216} height={24} rx={12}
                    fill={`${C.bloom}10`} stroke={C.bloom} strokeWidth={0.5} />
                  <text x={348} y={161} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.bloom}>
                    토픽 최대 4개 → 최대 12비트 세팅
                  </text>
                </motion.g>

                {/* 합계 */}
                <motion.g {...fade(0.75)}>
                  <text x={240} y={186} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill="var(--foreground)">
                    한 로그 항목당 최대 15비트 (= 3 + 4 x 3)
                  </text>
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 2: Bloom 판정 — false positive vs false negative
               ════════════════════════════════════════════ */}
            {step === 2 && (
              <g>
                {/* 제목 */}
                <motion.g {...fade(0)}>
                  <text x={240} y={14} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    Bloom Filter 검사 결과: 두 가지 경우
                  </text>
                </motion.g>

                {/* ── 왼쪽: 모든 비트 1 → 포함 가능 ── */}
                <motion.g {...fade(0.1)}>
                  <rect x={15} y={26} width={215} height={160} rx={8}
                    fill={`${C.bloom}06`} stroke={C.bloom} strokeWidth={0.6} />
                  <text x={122} y={42} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.bloom}>
                    모든 비트가 1
                  </text>
                </motion.g>

                {/* 비트 표시 — 6개 모두 채워짐 */}
                <motion.g {...fade(0.2)}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <g key={i}>
                      <rect x={30 + i * 32} y={50} width={26} height={18} rx={3}
                        fill={`${C.bloom}25`} stroke={C.bloom} strokeWidth={1} />
                      <text x={43 + i * 32} y={62} textAnchor="middle"
                        fontSize={8} fontWeight={700} fill={C.bloom}>1</text>
                    </g>
                  ))}
                </motion.g>

                {/* 화살표 → 판정 */}
                <motion.line x1={122} y1={72} x2={122} y2={84}
                  stroke={C.bloom} strokeWidth={1} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.3)} />

                {/* 판정 결과 */}
                <motion.g {...fade(0.35)}>
                  <AlertBox x={42} y={88} w={160} h={38}
                    label="포함 가능" sub="false positive 존재" color={C.bloom} />
                </motion.g>

                {/* 화살표 → receipt 확인 필요 */}
                <motion.line x1={122} y1={130} x2={122} y2={142}
                  stroke={C.bloom} strokeWidth={1} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.45)} />

                {/* 다음 단계 */}
                <motion.g {...fade(0.5)}>
                  <ActionBox x={52} y={146} w={140} h={32}
                    label="receipt 확인 필요" sub="정확한 대조 필요" color={C.bloom} />
                </motion.g>

                {/* ── 우측: 비트 하나라도 0 → 확실히 미포함 ── */}
                <motion.g {...fade(0.1)}>
                  <rect x={250} y={26} width={215} height={160} rx={8}
                    fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.6} />
                  <text x={357} y={42} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>
                    비트 하나라도 0
                  </text>
                </motion.g>

                {/* 비트 표시 — 4번째가 0 */}
                <motion.g {...fade(0.2)}>
                  {[1, 1, 1, 0, 1, 1].map((v, i) => (
                    <g key={i}>
                      <rect x={265 + i * 32} y={50} width={26} height={18} rx={3}
                        fill={v ? `${C.ok}20` : `${C.trust}10`}
                        stroke={v ? C.ok : C.trust}
                        strokeWidth={v ? 0.8 : 1.5} />
                      <text x={278 + i * 32} y={62} textAnchor="middle"
                        fontSize={8} fontWeight={700}
                        fill={v ? C.ok : C.trust}>
                        {v}
                      </text>
                    </g>
                  ))}
                </motion.g>

                {/* 화살표 → 판정 */}
                <motion.line x1={357} y1={72} x2={357} y2={84}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-gl-ok)"
                  {...drawLine(0.3)} />

                {/* 판정 결과 */}
                <motion.g {...fade(0.35)}>
                  <rect x={277} y={88} width={160} height={38} rx={6}
                    fill={`${C.ok}10`} stroke={C.ok} strokeWidth={1.2} />
                  <text x={357} y={105} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>
                    확실히 미포함
                  </text>
                  <text x={357} y={118} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    false negative 없음
                  </text>
                </motion.g>

                {/* 화살표 → 즉시 제외 */}
                <motion.line x1={357} y1={130} x2={357} y2={142}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-gl-ok)"
                  {...drawLine(0.45)} />

                {/* 다음 단계 */}
                <motion.g {...fade(0.5)}>
                  <ActionBox x={287} y={146} w={140} h={32}
                    label="즉시 제외" sub="다운로드 불필요" color={C.ok} />
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 3: 2단계 — Bloom 필터링 → receipt 확인
               ════════════════════════════════════════════ */}
            {step === 3 && (
              <g>
                {/* 제목 */}
                <motion.g {...fade(0)}>
                  <text x={240} y={14} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    2단계 검증 파이프라인
                  </text>
                </motion.g>

                {/* ── Stage 1: Bloom Filter (빠른 필터) ── */}
                <motion.g {...fade(0.1)}>
                  <rect x={15} y={26} width={215} height={155} rx={8}
                    fill={`${C.bloom}06`} stroke={C.bloom} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={122} y={42} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.bloom}>Stage 1: Bloom Filter</text>
                </motion.g>

                {/* 입력 블록들 */}
                <motion.g {...fade(0.15)}>
                  <DataBox x={30} y={50} w={60} h={24} label="Block N" color={C.muted} />
                </motion.g>
                <motion.g {...fade(0.2)}>
                  <DataBox x={30} y={78} w={60} h={24} label="Block N+1" color={C.muted} />
                </motion.g>
                <motion.g {...fade(0.25)}>
                  <DataBox x={30} y={106} w={60} h={24} label="Block N+2" color={C.muted} />
                </motion.g>
                <motion.g {...fade(0.3)}>
                  <DataBox x={30} y={134} w={60} h={24} label="Block N+3" color={C.muted} />
                </motion.g>

                {/* logsBloom 필터 적용 — 화살표들 */}
                <motion.line x1={94} y1={62} x2={120} y2={62}
                  stroke={C.bloom} strokeWidth={0.8} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.3)} />
                <motion.line x1={94} y1={90} x2={120} y2={90}
                  stroke={C.bloom} strokeWidth={0.8} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.35)} />
                <motion.line x1={94} y1={118} x2={120} y2={118}
                  stroke={C.bloom} strokeWidth={0.8} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.4)} />
                <motion.line x1={94} y1={146} x2={120} y2={146}
                  stroke={C.bloom} strokeWidth={0.8} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.45)} />

                {/* Bloom 체크 결과 */}
                <motion.g {...fade(0.35)}>
                  <rect x={124} y={54} width={16} height={16} rx={3}
                    fill={`${C.bloom}20`} stroke={C.bloom} strokeWidth={1} />
                  <text x={132} y={65} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill={C.bloom}>?</text>
                </motion.g>
                <motion.g {...fade(0.4)}>
                  <rect x={124} y={82} width={16} height={16} rx={3}
                    fill={`${C.ok}20`} stroke={C.ok} strokeWidth={1} />
                  <text x={132} y={94} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill={C.ok}>x</text>
                </motion.g>
                <motion.g {...fade(0.45)}>
                  <rect x={124} y={110} width={16} height={16} rx={3}
                    fill={`${C.bloom}20`} stroke={C.bloom} strokeWidth={1} />
                  <text x={132} y={122} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill={C.bloom}>?</text>
                </motion.g>
                <motion.g {...fade(0.5)}>
                  <rect x={124} y={138} width={16} height={16} rx={3}
                    fill={`${C.ok}20`} stroke={C.ok} strokeWidth={1} />
                  <text x={132} y={150} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill={C.ok}>x</text>
                </motion.g>

                {/* 결과 라벨 */}
                <motion.g {...fade(0.45)}>
                  <text x={160} y={65} fontSize={7} fill={C.bloom} fontWeight={600}>후보</text>
                </motion.g>
                <motion.g {...fade(0.5)}>
                  <text x={160} y={94} fontSize={7} fill={C.ok} fontWeight={600}>제외</text>
                </motion.g>
                <motion.g {...fade(0.55)}>
                  <text x={160} y={122} fontSize={7} fill={C.bloom} fontWeight={600}>후보</text>
                </motion.g>
                <motion.g {...fade(0.6)}>
                  <text x={160} y={150} fontSize={7} fill={C.ok} fontWeight={600}>제외</text>
                </motion.g>

                {/* 속도 표시 */}
                <motion.g {...fade(0.55)}>
                  <rect x={42} y={164} width={160} height={14} rx={7}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
                  <text x={122} y={174} textAnchor="middle"
                    fontSize={7} fontWeight={600} fill={C.bloom}>
                    비트 연산만 ~0.01ms/블록
                  </text>
                </motion.g>

                {/* ── 큰 화살표: Stage 1 → Stage 2 ── */}
                <motion.path
                  d="M 230 100 L 252 100"
                  fill="none" stroke={C.bloom} strokeWidth={1.5}
                  markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.5)} />
                <motion.g {...fade(0.55)}>
                  <text x={241} y={93} textAnchor="middle"
                    fontSize={7} fontWeight={600} fill={C.bloom}>
                    2개만
                  </text>
                  <text x={241} y={110} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    통과
                  </text>
                </motion.g>

                {/* ── Stage 2: Receipt 정확 확인 ── */}
                <motion.g {...fade(0.4)}>
                  <rect x={256} y={26} width={210} height={155} rx={8}
                    fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={361} y={42} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>Stage 2: Receipt 검증</text>
                </motion.g>

                {/* 후보 블록 receipt 다운로드 */}
                <motion.g {...fade(0.55)}>
                  <ActionBox x={270} y={54} w={120} h={32}
                    label="Receipt 다운로드" sub="Block N" color={C.rpc} />
                </motion.g>
                <motion.g {...fade(0.6)}>
                  <ActionBox x={270} y={94} w={120} h={32}
                    label="Receipt 다운로드" sub="Block N+2" color={C.rpc} />
                </motion.g>

                {/* 정확 대조 — address + topic 완전 일치 */}
                <motion.line x1={394} y1={70} x2={410} y2={70}
                  stroke={C.ok} strokeWidth={0.8} markerEnd="url(#arr-gl-ok)"
                  {...drawLine(0.65)} />
                <motion.line x1={394} y1={110} x2={410} y2={110}
                  stroke={C.ok} strokeWidth={0.8} markerEnd="url(#arr-gl-ok)"
                  {...drawLine(0.7)} />

                <motion.g {...fade(0.7)}>
                  <text x={440} y={68} textAnchor="middle"
                    fontSize={7} fontWeight={700} fill={C.ok}>
                    일치
                  </text>
                  <text x={440} y={78} textAnchor="middle"
                    fontSize={7} fill={C.ok}>
                    Log
                  </text>
                </motion.g>

                <motion.g {...fade(0.75)}>
                  <text x={440} y={108} textAnchor="middle"
                    fontSize={7} fontWeight={700} fill={C.trust}>
                    불일치
                  </text>
                  <text x={440} y={118} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    오탐
                  </text>
                </motion.g>

                {/* 설명 */}
                <motion.g {...fade(0.75)}>
                  <rect x={270} y={138} width={182} height={36} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
                  <text x={361} y={152} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill="var(--foreground)">
                    address + topic 완전 일치 확인
                  </text>
                  <text x={361} y={165} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    Bloom 오탐(false positive) 걸러냄
                  </text>
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 4: 증명 기준 — receipts_root
               ════════════════════════════════════════════ */}
            {step === 4 && (
              <g>
                {/* 블록 헤더 영역 — 중앙 상단 */}
                <motion.g {...fade(0)}>
                  <ModuleBox x={155} y={4} w={170} h={42}
                    label="Block Header" sub="3개의 Merkle Root" color={C.muted} />
                </motion.g>

                {/* 3개 루트 — 가로 배열 */}
                <motion.g {...fade(0.15)}>
                  <DataBox x={24} y={58} w={130} h={28}
                    label="state_root" sub="계정/스토리지 상태" color={C.proof} />
                </motion.g>
                <motion.g {...fade(0.2)}>
                  <DataBox x={170} y={58} w={140} h={28}
                    label="transactions_root" sub="트랜잭션 목록" color={C.muted} />
                </motion.g>
                <motion.g {...fade(0.25)}>
                  <DataBox x={326} y={58} w={130} h={28}
                    label="receipts_root" sub="실행 결과 (로그)" color={C.bloom} />
                </motion.g>

                {/* 헤더 → 루트 연결선 */}
                <motion.line x1={200} y1={46} x2={89} y2={58}
                  stroke={C.proof} strokeWidth={0.7} strokeDasharray="3 2"
                  {...drawLine(0.15)} />
                <motion.line x1={240} y1={46} x2={240} y2={58}
                  stroke={C.muted} strokeWidth={0.7} strokeDasharray="3 2"
                  {...drawLine(0.2)} />
                <motion.line x1={280} y1={46} x2={391} y2={58}
                  stroke={C.bloom} strokeWidth={0.7} strokeDasharray="3 2"
                  {...drawLine(0.25)} />

                {/* ── 좌측: state_root 기반 메서드들 ── */}
                <motion.g {...fade(0.3)}>
                  <rect x={10} y={96} width={200} height={94} rx={8}
                    fill={`${C.proof}06`} stroke={C.proof} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={110} y={112} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.proof}>
                    state_root 기반 검증
                  </text>
                </motion.g>

                {/* 화살표: state_root → 좌측 박스 */}
                <motion.line x1={89} y1={86} x2={89} y2={96}
                  stroke={C.proof} strokeWidth={1} markerEnd="url(#arr-gl-proof)"
                  {...drawLine(0.3)} />

                <motion.g {...fade(0.4)}>
                  <ActionBox x={22} y={120} w={85} h={28}
                    label="getBalance" color={C.proof} />
                </motion.g>
                <motion.g {...fade(0.45)}>
                  <ActionBox x={115} y={120} w={85} h={28}
                    label="getCode" color={C.proof} />
                </motion.g>
                <motion.g {...fade(0.5)}>
                  <ActionBox x={22} y={154} w={85} h={28}
                    label="getStorageAt" color={C.proof} />
                </motion.g>
                <motion.g {...fade(0.55)}>
                  <ActionBox x={115} y={154} w={85} h={28}
                    label="getTransactionCount" color={C.proof} />
                </motion.g>

                {/* ── 우측: receipts_root 기반 ── */}
                <motion.g {...fade(0.3)}>
                  <rect x={240} y={96} width={230} height={94} rx={8}
                    fill={`${C.bloom}08`} stroke={C.bloom} strokeWidth={1} />
                  <text x={355} y={112} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.bloom}>
                    receipts_root 기반 검증
                  </text>
                </motion.g>

                {/* 화살표: receipts_root → 우측 박스 */}
                <motion.line x1={391} y1={86} x2={391} y2={96}
                  stroke={C.bloom} strokeWidth={1} markerEnd="url(#arr-gl-bloom)"
                  {...drawLine(0.35)} />

                <motion.g {...fade(0.45)}>
                  <ModuleBox x={270} y={120} w={170} h={48}
                    label="eth_getLogs" sub="Bloom Filter + Receipt 검증" color={C.bloom} />
                </motion.g>

                {/* getLogs 내부 경로 표시 */}
                <motion.g {...fade(0.6)}>
                  <text x={355} y={180} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.bloom}>
                    logsBloom 필드가 receipts_root 산하
                  </text>
                </motion.g>

                {/* 유일한 메서드 강조 */}
                <motion.g {...fade(0.65)}>
                  <rect x={105} y={192} width={290} height={0} rx={0}
                    fill="transparent" />
                </motion.g>
              </g>
            )}

          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
