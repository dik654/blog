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
    label: '호출: eth_sendRawTransaction(signedTx)',
    body: '서명된 트랜잭션 raw bytes를 RPC에 전달한다',
  },
  {
    label: '왜 증명이 불가능한가',
    body: '읽기는 이미 존재하는 상태, 쓰기는 미래 행동 — 증명할 대상이 없다',
  },
  {
    label: '프록시 전달: Helios → RPC → 네트워크',
    body: '경량 클라이언트는 TxPool을 유지하지 않는다. RPC가 전파했는지 확인 불가',
  },
  {
    label: '보완: trust on write, verify on read',
    body: 'TX 해시를 기록 → 이후 eth_getTransactionReceipt로 블록 포함을 증명 기반으로 확인',
  },
];

export default function SendTxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ── 공통 마커 정의 ── */}
          <defs>
            <marker id="arr-stx-rpc" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rpc} />
            </marker>
            <marker id="arr-stx-ok" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.ok} />
            </marker>
            <marker id="arr-stx-trust" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.trust} />
            </marker>
            <marker id="arr-stx-muted" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.muted} />
            </marker>
            <marker id="arr-stx-proof" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proof} />
            </marker>
          </defs>

          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>

            {/* ════════════════════════════════════════════
                Step 0: 호출 — eth_sendRawTransaction(signedTx)
               ════════════════════════════════════════════ */}
            {step === 0 && (
              <g>
                {/* DApp 모듈 */}
                <motion.g {...fade(0)}>
                  <ModuleBox x={15} y={35} w={80} h={48} label="DApp" sub="TX 전송" color={C.muted} />
                </motion.g>

                {/* 화살표: DApp → sendRawTx */}
                <motion.line x1={99} y1={59} x2={130} y2={59}
                  stroke={C.rpc} strokeWidth={1.2} markerEnd="url(#arr-stx-rpc)"
                  {...drawLine(0.15)} />

                {/* sendRawTransaction 모듈 */}
                <motion.g {...fade(0.2)}>
                  <ModuleBox x={134} y={25} w={210} h={68} label="sendRawTransaction" sub="Helios ExecutionRpc" color={C.rpc} />
                </motion.g>

                {/* 서명된 TX 바이트 — 함수 아래 데이터 */}
                <motion.g {...fade(0.35)}>
                  <DataBox x={144} y={106} w={190} h={32} label="0x02f8..." sub="서명된 raw bytes (EIP-1559)" color={C.rpc} />
                </motion.g>

                {/* 파라미터 연결선 */}
                <motion.line x1={239} y1={93} x2={239} y2={106}
                  stroke={C.rpc} strokeWidth={0.8} strokeDasharray="3 2"
                  {...drawLine(0.4)} />

                {/* 화살표: sendRawTx → tx_hash */}
                <motion.line x1={348} y1={59} x2={380} y2={59}
                  stroke={C.trust} strokeWidth={1.2} markerEnd="url(#arr-stx-trust)"
                  {...drawLine(0.5)} />

                {/* 결과: tx_hash */}
                <motion.g {...fade(0.55)}>
                  <DataBox x={384} y={43} w={80} h={32} label="tx_hash" sub="B256" color={C.trust} />
                </motion.g>

                {/* 하단 경고 배너 */}
                <motion.g {...fade(0.7)}>
                  <rect x={60} y={158} width={360} height={26} rx={13}
                    fill={`${C.trust}10`} stroke={C.trust} strokeWidth={0.5} />
                  <text x={240} y={175} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.trust}>
                    Helios에서 유일하게 Merkle 증명 없이 RPC를 신뢰하는 메서드
                  </text>
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 1: 왜 증명이 불가능한가
               ════════════════════════════════════════════ */}
            {step === 1 && (
              <g>
                {/* 제목 */}
                <motion.g {...fade(0)}>
                  <text x={240} y={18} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    읽기 vs 쓰기 — 증명 가능 여부
                  </text>
                </motion.g>

                {/* ── 좌측: 읽기 (증명 가능) ── */}
                <motion.g {...fade(0.1)}>
                  <rect x={15} y={28} width={210} height={150} rx={8}
                    fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.8} />
                  <text x={120} y={44} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>
                    읽기 (4개) — 과거/현재 상태
                  </text>
                </motion.g>

                {/* 읽기 메서드 4개 */}
                {[
                  { label: 'getBalance', y: 52 },
                  { label: 'getCode', y: 78 },
                  { label: 'getStorage', y: 104 },
                  { label: 'eth_call', y: 130 },
                ].map((m, i) => (
                  <motion.g key={m.label} {...fade(0.15 + i * 0.08)}>
                    <ActionBox x={28} y={m.y} w={120} h={22} label={m.label} color={C.ok} />
                    {/* 체크마크 */}
                    <text x={162} y={m.y + 15} fontSize={11} fill={C.ok}>✓</text>
                    {/* Merkle proof 라벨 */}
                    <text x={186} y={m.y + 15} fontSize={7} fill={C.ok} fontWeight={600}>
                      Merkle 증명
                    </text>
                  </motion.g>
                ))}

                {/* 읽기 설명 */}
                <motion.g {...fade(0.55)}>
                  <text x={120} y={168} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    이미 블록에 기록된 상태 → 증명 가능
                  </text>
                </motion.g>

                {/* ── 중앙 구분선 ── */}
                <motion.line x1={240} y1={32} x2={240} y2={175}
                  stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3"
                  {...drawLine(0.1)} />

                {/* ── 우측: 쓰기 (증명 불가) ── */}
                <motion.g {...fade(0.1)}>
                  <rect x={255} y={28} width={210} height={150} rx={8}
                    fill={`${C.trust}06`} stroke={C.trust} strokeWidth={0.8} strokeDasharray="5 3" />
                  <text x={360} y={44} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.trust}>
                    쓰기 (1개) — 미래 행동
                  </text>
                </motion.g>

                {/* sendRawTx 단일 메서드 */}
                <motion.g {...fade(0.4)}>
                  <AlertBox x={275} y={58} w={170} h={42}
                    label="sendRawTransaction" sub="증명 대상 없음" color={C.trust} />
                </motion.g>

                {/* 미래 시점 표시 — 타임라인 화살표 */}
                <motion.g {...fade(0.55)}>
                  {/* 시간축 */}
                  <motion.line x1={285} y1={120} x2={445} y2={120}
                    stroke={C.muted} strokeWidth={0.8} markerEnd="url(#arr-stx-muted)"
                    {...drawLine(0.6)} />
                  {/* 과거: 블록 존재 */}
                  <rect x={285} y={128} width={60} height={18} rx={4}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={315} y={140} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">과거 블록</text>
                  {/* 현재 */}
                  <circle cx={370} cy={120} r={3} fill={C.bloom} />
                  <text x={370} y={140} textAnchor="middle"
                    fontSize={7} fontWeight={600} fill={C.bloom}>현재</text>
                  {/* 미래: 물음표 */}
                  <rect x={400} y={128} width={40} height={18} rx={4}
                    fill={`${C.trust}08`} stroke={C.trust} strokeWidth={0.5} strokeDasharray="3 2" />
                  <text x={420} y={140} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.trust}>?</text>
                </motion.g>

                {/* 우측 설명 */}
                <motion.g {...fade(0.7)}>
                  <text x={360} y={168} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    아직 일어나지 않은 행동 → 증명 불가
                  </text>
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 2: 프록시 전달 — Helios → RPC → 네트워크
               ════════════════════════════════════════════ */}
            {step === 2 && (
              <g>
                {/* ── 상단: Helios 프록시 흐름 ── */}
                <motion.g {...fade(0)}>
                  <text x={240} y={16} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    Helios: 프록시 전달 (검증 없음)
                  </text>
                </motion.g>

                {/* 신뢰 경계 영역 */}
                <motion.g {...fade(0.05)}>
                  <rect x={130} y={26} width={240} height={70} rx={8}
                    fill={`${C.trust}06`} stroke={C.trust} strokeWidth={0.8} strokeDasharray="5 3" />
                  <text x={250} y={38} textAnchor="middle"
                    fontSize={7} fontWeight={600} fill={C.trust}>
                    Trust Boundary
                  </text>
                </motion.g>

                {/* Helios 모듈 */}
                <motion.g {...fade(0.1)}>
                  <ModuleBox x={15} y={44} w={90} h={44} label="Helios" sub="라이트 클라이언트" color={C.rpc} />
                </motion.g>

                {/* 화살표: Helios → RPC */}
                <motion.line x1={109} y1={66} x2={148} y2={66}
                  stroke={C.trust} strokeWidth={1.2} markerEnd="url(#arr-stx-trust)"
                  {...drawLine(0.2)} />

                {/* pass-through 라벨 */}
                <motion.g {...fade(0.25)}>
                  <rect x={112} y={74} width={38} height={14} rx={3}
                    fill="var(--card)" stroke="none" />
                  <text x={131} y={84} textAnchor="middle"
                    fontSize={7} fill={C.trust} fontWeight={600}>
                    그대로
                  </text>
                </motion.g>

                {/* RPC 서버 */}
                <motion.g {...fade(0.2)}>
                  <ModuleBox x={152} y={44} w={100} h={44} label="RPC 서버" sub="신뢰 의존" color={C.trust} />
                </motion.g>

                {/* 화살표: RPC → P2P */}
                <motion.line x1={256} y1={66} x2={290} y2={66}
                  stroke={C.ok} strokeWidth={1.2} markerEnd="url(#arr-stx-ok)"
                  {...drawLine(0.35)} />

                {/* P2P 네트워크 */}
                <motion.g {...fade(0.35)}>
                  <ModuleBox x={294} y={44} w={100} h={44} label="P2P 네트워크" sub="mempool 전파" color={C.ok} />
                </motion.g>

                {/* 검증 없음 표시 — Helios 하단 */}
                <motion.g {...fade(0.45)}>
                  <AlertBox x={405} y={44} w={65} h={44}
                    label="검증 없음" sub="프록시만" color={C.trust} />
                </motion.g>

                {/* ── 하단: Reth 비교 ── */}
                <motion.g {...fade(0.5)}>
                  <rect x={15} y={110} width={450} height={72} rx={8}
                    fill={`${C.ok}04`} stroke={C.ok} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={240} y={126} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>
                    비교: Reth (풀 노드)
                  </text>
                </motion.g>

                {/* Reth 흐름: sendRawTx → TxPool → P2P 전파 → mempool */}
                <motion.g {...fade(0.55)}>
                  <ActionBox x={30} y={134} w={90} h={34} label="sendRawTx" sub="검증 포함" color={C.ok} />
                </motion.g>
                <motion.line x1={124} y1={151} x2={148} y2={151}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-stx-ok)"
                  {...drawLine(0.6)} />
                <motion.g {...fade(0.6)}>
                  <ActionBox x={152} y={134} w={80} h={34} label="TxPool" sub="로컬 풀" color={C.ok} />
                </motion.g>
                <motion.line x1={236} y1={151} x2={260} y2={151}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-stx-ok)"
                  {...drawLine(0.65)} />
                <motion.g {...fade(0.65)}>
                  <ActionBox x={264} y={134} w={80} h={34} label="P2P 전파" sub="gossip" color={C.ok} />
                </motion.g>
                <motion.line x1={348} y1={151} x2={372} y2={151}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-stx-ok)"
                  {...drawLine(0.7)} />
                <motion.g {...fade(0.7)}>
                  <DataBox x={376} y={136} w={78} h={30} label="mempool" sub="블록 대기" color={C.ok} />
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 3: 보완 — trust on write, verify on read
               ════════════════════════════════════════════ */}
            {step === 3 && (
              <g>
                {/* 제목 */}
                <motion.g {...fade(0)}>
                  <text x={240} y={16} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    쓰기만 신뢰, 확인은 다시 증명
                  </text>
                </motion.g>

                {/* ── Phase 1: Trust (쓰기) ── */}
                <motion.g {...fade(0.05)}>
                  <rect x={15} y={28} width={215} height={120} rx={8}
                    fill={`${C.trust}06`} stroke={C.trust} strokeWidth={0.8} strokeDasharray="5 3" />
                  <text x={122} y={44} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.trust}>
                    Phase 1: 신뢰 (Trust)
                  </text>
                </motion.g>

                {/* sendRawTx 호출 */}
                <motion.g {...fade(0.1)}>
                  <ActionBox x={30} y={52} w={120} h={34} label="sendRawTx" sub="서명 TX 전송" color={C.trust} />
                </motion.g>

                {/* 화살표: sendRawTx → tx_hash */}
                <motion.line x1={154} y1={69} x2={176} y2={69}
                  stroke={C.trust} strokeWidth={1} markerEnd="url(#arr-stx-trust)"
                  {...drawLine(0.2)} />

                {/* tx_hash 기록 */}
                <motion.g {...fade(0.25)}>
                  <DataBox x={30} y={96} w={90} h={30} label="tx_hash" sub="B256 기록" color={C.trust} />
                </motion.g>

                {/* RPC 전달 표시 */}
                <motion.g {...fade(0.2)}>
                  <AlertBox x={135} y={52} w={82} h={34} label="RPC 전달" sub="검증 없이" color={C.trust} />
                </motion.g>

                {/* 저장 아이콘: 화살표 내려감 */}
                <motion.line x1={90} y1={86} x2={75} y2={96}
                  stroke={C.trust} strokeWidth={0.8} strokeDasharray="3 2"
                  {...drawLine(0.3)} />

                {/* ── 연결 화살표: Phase 1 → Phase 2 (시간 경과) ── */}
                <motion.g {...fade(0.4)}>
                  <motion.path
                    d="M 230 90 C 242 90, 248 90, 252 90"
                    fill="none" stroke={C.bloom} strokeWidth={1.5}
                    markerEnd="url(#arr-stx-muted)"
                    {...drawLine(0.45)} />
                  {/* 시간 경과 라벨 */}
                  <rect x={228} y={74} width={36} height={14} rx={3}
                    fill="var(--card)" stroke={C.bloom} strokeWidth={0.5} />
                  <text x={246} y={84} textAnchor="middle"
                    fontSize={7} fontWeight={600} fill={C.bloom}>
                    시간
                  </text>
                </motion.g>

                {/* ── Phase 2: Verify (읽기) ── */}
                <motion.g {...fade(0.35)}>
                  <rect x={255} y={28} width={215} height={120} rx={8}
                    fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.8} />
                  <text x={362} y={44} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>
                    Phase 2: 검증 (Verify)
                  </text>
                </motion.g>

                {/* getTransactionReceipt 호출 */}
                <motion.g {...fade(0.45)}>
                  <ActionBox x={270} y={52} w={130} h={34} label="getReceipt" sub="tx_hash로 조회" color={C.ok} />
                </motion.g>

                {/* 화살표: getReceipt → Merkle 증명 */}
                <motion.line x1={335} y1={86} x2={335} y2={96}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-stx-ok)"
                  {...drawLine(0.55)} />

                {/* Merkle 증명 검증 */}
                <motion.g {...fade(0.55)}>
                  <DataBox x={270} y={100} w={130} h={30} label="Merkle 증명 확인" sub="블록 포함 검증" color={C.ok} />
                </motion.g>

                {/* 체크마크 */}
                <motion.g {...fade(0.6)}>
                  <text x={416} y={72} fontSize={13} fill={C.ok}>✓</text>
                  <text x={416} y={86} fontSize={7} fill={C.ok} textAnchor="middle">
                    증명
                  </text>
                </motion.g>

                {/* tx_hash 연결: Phase1 기록 → Phase2 조회 */}
                <motion.g {...fade(0.5)}>
                  <motion.path
                    d="M 120 126 L 120 152 L 335 152 L 335 134"
                    fill="none" stroke={C.muted} strokeWidth={0.8} strokeDasharray="4 2"
                    {...drawLine(0.5)} />
                  <rect x={195} y={145} width={60} height={14} rx={3}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={225} y={155} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    tx_hash
                  </text>
                </motion.g>

                {/* 하단 요약 배너 */}
                <motion.g {...fade(0.7)}>
                  <rect x={40} y={172} width={400} height={22} rx={11}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={145} y={186} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.trust}>
                    쓰기: RPC 신뢰 (불가피)
                  </text>
                  <text x={240} y={186} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">→</text>
                  <text x={340} y={186} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.ok}>
                    확인: Merkle 증명 (trustless)
                  </text>
                </motion.g>
              </g>
            )}

          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
