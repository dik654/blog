import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

/* ── 색상: RpcMethodsVizData 기준 ── */
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
    label: '호출: eth_getBalance(addr, block)',
    body: 'DApp이 특정 주소의 잔액을 요청한다. Helios는 RPC 응답을 그대로 신뢰하지 않고, Merkle 증명을 통해 직접 검증한다.',
  },
  {
    label: 'RPC 요청: get_proof(addr, &[], block)',
    body: 'EIP-1186 표준으로 account proof를 요청한다. balance만 필요하므로 storageKeys는 빈 배열 — 스토리지 증명은 불필요하다.',
  },
  {
    label: 'MPT 검증: state_root → keccak(addr) 경로',
    body: 'CL이 확인한 state_root를 기점으로, keccak(addr) 해시를 키로 MPT 트라이를 탐색한다. 각 노드의 해시를 재계산하며 경로 무결성을 검증.',
  },
  {
    label: 'Account 디코딩 → balance 추출',
    body: 'MPT 리프에서 RLP로 인코딩된 Account 구조체를 디코딩한다. 4개 필드 중 balance(인덱스 1)만 추출해서 반환.',
  },
  {
    label: 'Reth 비교: MDBX ~0.1ms vs Helios ~150ms',
    body: 'Reth는 로컬 MDBX에서 직접 읽어 0.1ms 이내에 응답한다. Helios는 RPC + 증명 검증에 ~150ms가 걸리지만, RPC를 신뢰하지 않아도 된다.',
  },
];

export default function GetBalanceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ── 공통 marker 정의 ── */}
          <defs>
            <marker id="arr-gb-rpc" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rpc} />
            </marker>
            <marker id="arr-gb-proof" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proof} />
            </marker>
            <marker id="arr-gb-ok" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.ok} />
            </marker>
            <marker id="arr-gb-muted" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.muted} />
            </marker>
            <marker id="arr-gb-trust" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.trust} />
            </marker>
          </defs>

          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>

            {/* ════════════════════════════════════════════
                Step 0: 호출 — eth_getBalance(addr, block)
               ════════════════════════════════════════════ */}
            {step === 0 && (
              <g>
                {/* DApp 모듈 */}
                <motion.g {...fade(0)}>
                  <ModuleBox x={20} y={30} w={80} h={48} label="DApp" sub="잔액 조회" color={C.muted} />
                </motion.g>

                {/* 화살표: DApp → eth_getBalance */}
                <motion.line x1={104} y1={54} x2={140} y2={54}
                  stroke={C.rpc} strokeWidth={1.2} markerEnd="url(#arr-gb-rpc)"
                  {...drawLine(0.15)} />

                {/* eth_getBalance 모듈 */}
                <motion.g {...fade(0.2)}>
                  <ModuleBox x={144} y={22} w={190} h={64} label="eth_getBalance" sub="Helios ExecutionRpc" color={C.rpc} />
                </motion.g>

                {/* 파라미터 박스들 — 함수 안에 배치 */}
                <motion.g {...fade(0.35)}>
                  <DataBox x={155} y={100} w={80} h={30} label="addr" sub="0xAbCd..." color={C.rpc} />
                </motion.g>
                <motion.g {...fade(0.45)}>
                  <DataBox x={248} y={100} w={80} h={30} label="block" sub={'"latest"'} color={C.rpc} />
                </motion.g>

                {/* 파라미터 → 함수 연결선 */}
                <motion.line x1={195} y1={86} x2={195} y2={100}
                  stroke={C.rpc} strokeWidth={0.8} strokeDasharray="3 2"
                  {...drawLine(0.4)} />
                <motion.line x1={288} y1={86} x2={288} y2={100}
                  stroke={C.rpc} strokeWidth={0.8} strokeDasharray="3 2"
                  {...drawLine(0.5)} />

                {/* 화살표: eth_getBalance → 결과 */}
                <motion.line x1={338} y1={54} x2={370} y2={54}
                  stroke={C.ok} strokeWidth={1.2} markerEnd="url(#arr-gb-ok)"
                  {...drawLine(0.55)} />

                {/* 결과 */}
                <motion.g {...fade(0.6)}>
                  <DataBox x={374} y={38} w={90} h={32} label="U256" sub="잔액 (wei)" color={C.ok} />
                </motion.g>

                {/* 하단 설명 */}
                <motion.g {...fade(0.7)}>
                  <rect x={60} y={150} width={360} height={26} rx={13}
                    fill={`${C.rpc}10`} stroke={C.rpc} strokeWidth={0.5} />
                  <text x={240} y={167} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.rpc}>
                    RPC 응답을 그대로 반환하지 않는다 — 증명 검증 후 반환
                  </text>
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 1: RPC 요청 — get_proof
               ════════════════════════════════════════════ */}
            {step === 1 && (
              <g>
                {/* Helios 모듈 */}
                <motion.g {...fade(0)}>
                  <ModuleBox x={10} y={40} w={90} h={48} label="Helios" sub="라이트 클라이언트" color={C.rpc} />
                </motion.g>

                {/* 화살표: Helios → get_proof */}
                <motion.line x1={104} y1={64} x2={140} y2={64}
                  stroke={C.rpc} strokeWidth={1.2} markerEnd="url(#arr-gb-rpc)"
                  {...drawLine(0.15)} />

                {/* get_proof 액션 */}
                <motion.g {...fade(0.2)}>
                  <ActionBox x={144} y={34} w={150} h={60} label="get_proof" sub="EIP-1186" color={C.proof} />
                </motion.g>

                {/* get_proof 파라미터 3개 — 내부 표시 */}
                <motion.g {...fade(0.3)}>
                  <text x={220} y={68} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">
                    (addr, &amp;[], block)
                  </text>
                </motion.g>

                {/* storageKeys 강조 — 빈 배열 */}
                <motion.g {...fade(0.4)}>
                  <rect x={144} y={104} width={150} height={30} rx={6}
                    fill={`${C.bloom}10`} stroke={C.bloom} strokeWidth={0.8} strokeDasharray="3 2" />
                  <text x={219} y={118} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.bloom}>
                    storageKeys: [] (빈 배열)
                  </text>
                  <text x={219} y={130} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    balance만 필요 → 스토리지 증명 불필요
                  </text>
                </motion.g>

                {/* 화살표: get_proof → RPC 서버 */}
                <motion.line x1={298} y1={64} x2={340} y2={64}
                  stroke={C.proof} strokeWidth={1.2} markerEnd="url(#arr-gb-proof)"
                  {...drawLine(0.35)} />

                {/* RPC 서버 */}
                <motion.g {...fade(0.4)}>
                  <ModuleBox x={344} y={30} w={120} h={68} label="RPC 서버" sub="신뢰하지 않음" color={C.trust} />
                </motion.g>

                {/* 응답 — AccountProof */}
                <motion.g {...fade(0.55)}>
                  <motion.path
                    d="M 404 98 L 404 150 L 320 150"
                    fill="none" stroke={C.proof} strokeWidth={1}
                    markerEnd="url(#arr-gb-proof)"
                    {...drawLine(0.6)} />
                  <DataBox x={200} y={155} w={120} h={30}
                    label="AccountProof" sub="Merkle 증명 노드들" color={C.proof} />
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 2: MPT 검증 — 트라이 탐색
               ════════════════════════════════════════════ */}
            {step === 2 && (
              <g>
                {/* 배경 — verify_proof 영역 */}
                <motion.g {...fade(0)}>
                  <rect x={15} y={8} width={450} height={190} rx={10}
                    fill={`${C.proof}06`} stroke={C.proof} strokeWidth={0.5} strokeDasharray="5 3" />
                  <text x={240} y={24} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill={C.proof}>
                    verify_proof(state_root, keccak(addr), proof)
                  </text>
                </motion.g>

                {/* state_root — CL에서 검증된 값 */}
                <motion.g {...fade(0.1)}>
                  <DataBox x={30} y={36} w={100} h={30} label="state_root" sub="CL 검증 완료" color={C.ok} />
                </motion.g>

                {/* 화살표: state_root → Branch */}
                <motion.line x1={80} y1={66} x2={80} y2={82}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-gb-ok)"
                  {...drawLine(0.2)} />

                {/* MPT 노드: Branch (Level 0) */}
                <motion.g {...fade(0.25)}>
                  <rect x={35} y={84} width={90} height={28} rx={6}
                    fill="var(--card)" stroke={C.proof} strokeWidth={1} />
                  <text x={80} y={96} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.proof}>Branch</text>
                  <text x={80} y={107} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">16개 자식</text>
                </motion.g>

                {/* keccak(addr) 해시 키 표시 */}
                <motion.g {...fade(0.15)}>
                  <rect x={280} y={36} width={170} height={28} rx={14}
                    fill={`${C.bloom}12`} stroke={C.bloom} strokeWidth={0.8} />
                  <text x={365} y={50} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.bloom}>
                    key = keccak256(addr)
                  </text>
                  <text x={365} y={60} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    니블 단위로 경로 결정
                  </text>
                </motion.g>

                {/* 화살표: Branch → Extension — 니블 [a] */}
                <motion.line x1={125} y1={98} x2={175} y2={98}
                  stroke={C.proof} strokeWidth={1} markerEnd="url(#arr-gb-proof)"
                  {...drawLine(0.35)} />
                <motion.g {...fade(0.35)}>
                  <text x={150} y={93} textAnchor="middle"
                    fontSize={7} fontWeight={600} fill={C.bloom}>
                    [a]
                  </text>
                </motion.g>

                {/* MPT 노드: Extension (Level 1) */}
                <motion.g {...fade(0.4)}>
                  <rect x={178} y={84} width={100} height={28} rx={6}
                    fill="var(--card)" stroke={C.proof} strokeWidth={1} />
                  <text x={228} y={96} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.proof}>Extension</text>
                  <text x={228} y={107} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">공유 접두사 압축</text>
                </motion.g>

                {/* 화살표: Extension → Branch2 — 니블 [3f] */}
                <motion.line x1={278} y1={98} x2={325} y2={98}
                  stroke={C.proof} strokeWidth={1} markerEnd="url(#arr-gb-proof)"
                  {...drawLine(0.5)} />
                <motion.g {...fade(0.5)}>
                  <text x={302} y={93} textAnchor="middle"
                    fontSize={7} fontWeight={600} fill={C.bloom}>
                    [3f]
                  </text>
                </motion.g>

                {/* MPT 노드: Branch2 (Level 2) */}
                <motion.g {...fade(0.55)}>
                  <rect x={328} y={84} width={90} height={28} rx={6}
                    fill="var(--card)" stroke={C.proof} strokeWidth={1} />
                  <text x={373} y={96} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.proof}>Branch</text>
                  <text x={373} y={107} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">16개 자식</text>
                </motion.g>

                {/* 화살표: Branch2 → Leaf — 아래로 */}
                <motion.line x1={373} y1={112} x2={373} y2={132}
                  stroke={C.proof} strokeWidth={1} markerEnd="url(#arr-gb-proof)"
                  {...drawLine(0.6)} />
                <motion.g {...fade(0.6)}>
                  <text x={382} y={125} fontSize={7} fontWeight={600} fill={C.bloom}>
                    [7]
                  </text>
                </motion.g>

                {/* MPT 노드: Leaf — 최종 */}
                <motion.g {...fade(0.65)}>
                  <rect x={310} y={134} width={126} height={28} rx={6}
                    fill={`${C.ok}12`} stroke={C.ok} strokeWidth={1.2} />
                  <text x={373} y={146} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>Leaf (Account)</text>
                  <text x={373} y={157} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">RLP 인코딩된 데이터</text>
                </motion.g>

                {/* 검증 과정 설명 — 각 노드마다 해시 재계산 */}
                <motion.g {...fade(0.75)}>
                  <rect x={30} y={140} width={240} height={46} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={150} y={156} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill="var(--foreground)">
                    각 노드에서 해시 재계산
                  </text>
                  <text x={150} y={168} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    keccak(child_rlp) == parent_hash 이면 경로 유효
                  </text>
                  <text x={150} y={179} textAnchor="middle"
                    fontSize={7} fill={C.ok}>
                    최종: root 해시 == state_root 이면 검증 완료
                  </text>
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 3: Account 디코딩 → balance 추출
               ════════════════════════════════════════════ */}
            {step === 3 && (
              <g>
                {/* RLP 디코딩 영역 */}
                <motion.g {...fade(0)}>
                  <ActionBox x={20} y={20} w={120} h={40} label="RLP Decode" sub="Leaf 데이터 파싱" color={C.proof} />
                </motion.g>

                {/* 화살표 → Account 구조체 */}
                <motion.line x1={144} y1={40} x2={170} y2={40}
                  stroke={C.proof} strokeWidth={1} markerEnd="url(#arr-gb-proof)"
                  {...drawLine(0.15)} />

                {/* Account 구조체 제목 */}
                <motion.g {...fade(0.15)}>
                  <text x={320} y={18} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    Account 구조체
                  </text>
                </motion.g>

                {/* 4개 필드 — 세로 배열 */}
                {/* nonce */}
                <motion.g {...fade(0.2)}>
                  <rect x={175} y={28} width={290} height={32} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={195} y={42} fontSize={7.5} fontWeight={600} fill="var(--muted-foreground)">
                    [0]
                  </text>
                  <text x={230} y={42} fontSize={8} fontWeight={600} fill="var(--foreground)">
                    nonce
                  </text>
                  <text x={360} y={42} textAnchor="middle"
                    fontSize={7.5} fill="var(--muted-foreground)">
                    트랜잭션 카운터 — u64
                  </text>
                </motion.g>

                {/* balance — 강조! */}
                <motion.g {...fade(0.35)}>
                  <rect x={175} y={64} width={290} height={36} rx={6}
                    fill={`${C.ok}12`} stroke={C.ok} strokeWidth={1.5} />
                  <text x={195} y={80} fontSize={7.5} fontWeight={700} fill={C.ok}>
                    [1]
                  </text>
                  <text x={230} y={80} fontSize={9} fontWeight={700} fill={C.ok}>
                    balance
                  </text>
                  <text x={360} y={80} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.ok}>
                    잔액 (wei) — U256
                  </text>
                  {/* 추출 화살표 */}
                  <motion.path d="M 465 82 L 465 82"
                    fill="none" stroke={C.ok} strokeWidth={0} />
                </motion.g>

                {/* storage_root */}
                <motion.g {...fade(0.45)}>
                  <rect x={175} y={104} width={290} height={32} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={195} y={118} fontSize={7.5} fontWeight={600} fill="var(--muted-foreground)">
                    [2]
                  </text>
                  <text x={238} y={118} fontSize={8} fontWeight={600} fill="var(--foreground)">
                    storage_root
                  </text>
                  <text x={375} y={118} textAnchor="middle"
                    fontSize={7.5} fill="var(--muted-foreground)">
                    스토리지 트라이 루트 — B256
                  </text>
                </motion.g>

                {/* code_hash */}
                <motion.g {...fade(0.55)}>
                  <rect x={175} y={140} width={290} height={32} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={195} y={154} fontSize={7.5} fontWeight={600} fill="var(--muted-foreground)">
                    [3]
                  </text>
                  <text x={235} y={154} fontSize={8} fontWeight={600} fill="var(--foreground)">
                    code_hash
                  </text>
                  <text x={370} y={154} textAnchor="middle"
                    fontSize={7.5} fill="var(--muted-foreground)">
                    컨트랙트 코드 해시 — B256
                  </text>
                </motion.g>

                {/* 추출 결과 화살표 */}
                <motion.g {...fade(0.65)}>
                  <motion.path
                    d="M 465 82 L 470 82"
                    fill="none" stroke={C.ok} strokeWidth={1.2}
                    {...drawLine(0.65)} />
                </motion.g>

                {/* 하단 요약 */}
                <motion.g {...fade(0.7)}>
                  <rect x={40} y={182} width={400} height={22} rx={11}
                    fill={`${C.ok}10`} stroke={C.ok} strokeWidth={0.5} />
                  <text x={240} y={196} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill={C.ok}>
                    getBalance → [1] 추출 / getTransactionCount → [0] 추출 / getCode → [3] 검증
                  </text>
                </motion.g>
              </g>
            )}

            {/* ════════════════════════════════════════════
                Step 4: Reth 비교 — MDBX vs Helios
               ════════════════════════════════════════════ */}
            {step === 4 && (
              <g>
                {/* 제목 */}
                <motion.g {...fade(0)}>
                  <text x={240} y={18} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--foreground)">
                    같은 결과, 다른 경로
                  </text>
                </motion.g>

                {/* ── 좌측: Reth (풀 노드) ── */}
                <motion.g {...fade(0.1)}>
                  <rect x={15} y={30} width={210} height={145} rx={8}
                    fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={120} y={46} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.ok}>Reth (풀 노드)</text>
                </motion.g>

                {/* Reth 요청 */}
                <motion.g {...fade(0.15)}>
                  <ModuleBox x={30} y={56} w={80} h={38} label="getBalance" sub="RPC 핸들러" color={C.ok} />
                </motion.g>

                {/* 화살표 → MDBX */}
                <motion.line x1={114} y1={75} x2={140} y2={75}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-gb-ok)"
                  {...drawLine(0.25)} />

                {/* MDBX 직접 조회 */}
                <motion.g {...fade(0.3)}>
                  <DataBox x={144} y={58} w={70} h={34} label="MDBX" sub="로컬 DB" color={C.ok} />
                </motion.g>

                {/* 화살표 → balance */}
                <motion.line x1={120} y1={102} x2={120} y2={120}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#arr-gb-ok)"
                  {...drawLine(0.35)} />

                {/* Reth 결과 */}
                <motion.g {...fade(0.4)}>
                  <DataBox x={68} y={124} w={102} h={30} label="balance" sub="~0.1ms" color={C.ok} />
                </motion.g>

                {/* 속도 바 — Reth (매우 짧음) */}
                <motion.g {...fade(0.5)}>
                  <rect x={30} y={160} width={180} height={8} rx={4}
                    fill="var(--border)" opacity={0.3} />
                  <motion.rect x={30} y={160} width={2} height={8} rx={4}
                    fill={C.ok}
                    initial={{ width: 0 }}
                    animate={{ width: 2 }}
                    transition={{ delay: 0.55, duration: 0.2 }} />
                  <text x={120} y={160} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    0.1ms (즉시)
                  </text>
                </motion.g>

                {/* ── 우측: Helios (라이트 클라이언트) ── */}
                <motion.g {...fade(0.1)}>
                  <rect x={245} y={30} width={225} height={145} rx={8}
                    fill={`${C.proof}06`} stroke={C.proof} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={357} y={46} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={C.proof}>Helios (라이트 클라이언트)</text>
                </motion.g>

                {/* Helios 체인: RPC → proof → verify → balance */}
                <motion.g {...fade(0.2)}>
                  <ActionBox x={260} y={56} w={58} h={34} label="RPC" sub="요청" color={C.rpc} />
                </motion.g>
                <motion.line x1={322} y1={73} x2={335} y2={73}
                  stroke={C.rpc} strokeWidth={0.8} markerEnd="url(#arr-gb-rpc)"
                  {...drawLine(0.3)} />

                <motion.g {...fade(0.35)}>
                  <ActionBox x={339} y={56} w={58} h={34} label="Proof" sub="수신" color={C.proof} />
                </motion.g>
                <motion.line x1={401} y1={73} x2={414} y2={73}
                  stroke={C.proof} strokeWidth={0.8} markerEnd="url(#arr-gb-proof)"
                  {...drawLine(0.4)} />

                <motion.g {...fade(0.45)}>
                  <ActionBox x={418} y={56} w={42} h={34} label="검증" color={C.proof} />
                </motion.g>

                {/* 아래로 화살표 */}
                <motion.line x1={357} y1={94} x2={357} y2={120}
                  stroke={C.proof} strokeWidth={1} markerEnd="url(#arr-gb-proof)"
                  {...drawLine(0.5)} />

                {/* Helios 결과 */}
                <motion.g {...fade(0.55)}>
                  <DataBox x={306} y={124} w={102} h={30} label="balance" sub="~150ms" color={C.proof} />
                </motion.g>

                {/* 속도 바 — Helios (길지만 trustless) */}
                <motion.g {...fade(0.6)}>
                  <rect x={260} y={160} width={196} height={8} rx={4}
                    fill="var(--border)" opacity={0.3} />
                  <motion.rect x={260} y={160} width={0} height={8} rx={4}
                    fill={C.proof}
                    initial={{ width: 0 }}
                    animate={{ width: 196 }}
                    transition={{ delay: 0.65, duration: 0.5 }} />
                  <text x={358} y={160} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">
                    ~150ms (네트워크 + 검증)
                  </text>
                </motion.g>

                {/* 하단 비교 요약 */}
                <motion.g {...fade(0.8)}>
                  <rect x={30} y={184} width={420} height={22} rx={11}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={130} y={198} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.ok}>
                    Reth: 빠르지만 디스크 필요
                  </text>
                  <text x={240} y={198} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">|</text>
                  <text x={350} y={198} textAnchor="middle"
                    fontSize={7.5} fontWeight={600} fill={C.proof}>
                    Helios: 느리지만 무신뢰
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
