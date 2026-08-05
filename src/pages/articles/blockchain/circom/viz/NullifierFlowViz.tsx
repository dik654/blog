import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const SECRET = '#ef4444';     // nullifier/secret — 증명자 비밀
const COMMIT = '#10b981';     // commitment — 공개 OK
const NULLIFIER = '#f59e0b';  // nullifierHash — 출금 시 공개
const MERKLE = '#6366f1';     // merkle tree
const DEPOSIT = '#84cc16';    // 다른 예치자들
const WITHDRAW = '#ec4899';   // 출금 실행

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.5 };

const STEPS = [
  {
    label: '① Setup — 비밀 생성',
    body: '증명자가 로컬에서 nullifier와 secret을 무작위로 생성합니다.\n이 두 값은 절대 공개되지 않으며, 증명자만 보관합니다.',
  },
  {
    label: '② 입금 — commitment 공개',
    body: 'Poseidon(nullifier, secret) → commitment 계산 후 onchain에 제출합니다.\n컨트랙트는 commitment를 Merkle tree에 insert하고 고정 금액을 예치받습니다.',
  },
  {
    label: '③ 시간 경과 — 익명성 집합 성장',
    body: '다른 사용자들의 deposit이 계속 쌓이며 tree가 커집니다.\n출금자가 "어느 leaf의 주인"인지 onchain에서 구분할 수 없게 됩니다 (anonymous set).',
  },
  {
    label: '④ 출금 준비 — proof 생성',
    body: 'Poseidon(nullifier) → nullifierHash를 공개하고,\n회로 내부에서 commitment ∈ tree를 Merkle proof로 증명합니다.\nsecret은 여전히 노출되지 않습니다.',
  },
  {
    label: '⑤ 출금 실행 — 이중 사용 방지',
    body: '컨트랙트는 nullifierHash가 set에 이미 있는지 체크합니다.\n없으면 출금을 처리하고 hash를 set에 추가 — 같은 nullifier로 두 번 인출 불가.',
  },
];

// 좌측: 증명자 비밀 영역
const L_X = 18, L_W = 150;
// 우측: onchain 영역
const R_X = 270, R_W = 195;

// Merkle tree leaf 위치 (우측)
const LEAVES = [
  { x: R_X + 14,  y: 116, label: 'd₀' },
  { x: R_X + 52,  y: 116, label: 'd₁' },
  { x: R_X + 90,  y: 116, label: 'C*' },  // 내 commitment
  { x: R_X + 128, y: 116, label: 'd₂' },
  { x: R_X + 166, y: 116, label: 'd₃' },
];
const MY_LEAF = 2;

// Merkle 부모 노드 (단순화된 2단 구조)
const PARENTS = [
  { x: R_X + 33,  y: 88 },
  { x: R_X + 109, y: 88 },
  { x: R_X + 147, y: 88 },
];
const ROOT = { x: R_X + 90, y: 62 };

export default function NullifierFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        // 각 단계별 visibility
        const showSecret = step >= 0;
        const showPoseidonCommit = step === 1;
        const showCommitmentWire = step >= 1;
        const showMyLeaf = step >= 1;
        const showOtherLeaves = step >= 2;
        const showTreeStructure = step >= 2;
        const showPoseidonNullifier = step === 3;
        const showNullifierHash = step >= 3;
        const showMerkleProof = step === 3;
        const showNullifierSet = step >= 3;
        const showCheckAnim = step === 4;
        const showWithdraw = step === 4;

        return (
          <svg viewBox="0 0 480 220" className="w-full max-w-3xl" style={{ height: 'auto' }}>
            {/* 좌측 영역 배경 */}
            <rect x={L_X - 6} y={6} width={L_W + 12} height={200} rx={8}
              fill={`${SECRET}05`} stroke={SECRET} strokeWidth={0.6}
              strokeDasharray="3 2" opacity={0.6} />
            <text x={L_X + L_W / 2} y={18} textAnchor="middle"
              fontSize={8.5} fontWeight={700} fill={SECRET}>증명자 비밀 영역 (offchain)</text>

            {/* 우측 영역 배경 */}
            <rect x={R_X - 6} y={6} width={R_W + 12} height={200} rx={8}
              fill={`${MERKLE}05`} stroke={MERKLE} strokeWidth={0.6}
              strokeDasharray="3 2" opacity={0.6} />
            <text x={R_X + R_W / 2} y={18} textAnchor="middle"
              fontSize={8.5} fontWeight={700} fill={MERKLE}>onchain 영역 (컨트랙트)</text>

            {/* ── 좌측: nullifier / secret 카드 ── */}
            <motion.g animate={{ opacity: showSecret ? 1 : 0.2 }} transition={sp}>
              <DataBox x={L_X + 12} y={38} w={62} h={28}
                label="nullifier" sub="rand₁" color={SECRET} outlined />
              <DataBox x={L_X + 82} y={38} w={62} h={28}
                label="secret" sub="rand₂" color={SECRET} outlined />
            </motion.g>

            {/* Poseidon hasher (commitment 생성) */}
            {showPoseidonCommit && (
              <motion.g initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }} transition={sp}>
                <circle cx={L_X + 78} cy={90} r={13}
                  fill={`${COMMIT}18`} stroke={COMMIT} strokeWidth={1.4} />
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: `${L_X + 78}px 90px` }}>
                  <path d={`M ${L_X + 78} ${78} L ${L_X + 78} ${86}`}
                    stroke={COMMIT} strokeWidth={1.5} />
                  <path d={`M ${L_X + 78} ${94} L ${L_X + 78} ${102}`}
                    stroke={COMMIT} strokeWidth={1.5} />
                  <path d={`M ${L_X + 66} ${90} L ${L_X + 74} ${90}`}
                    stroke={COMMIT} strokeWidth={1.5} />
                  <path d={`M ${L_X + 82} ${90} L ${L_X + 90} ${90}`}
                    stroke={COMMIT} strokeWidth={1.5} />
                </motion.g>
                <text x={L_X + 78} y={92} textAnchor="middle"
                  fontSize={7.5} fontWeight={700} fill={COMMIT}>H</text>
                <text x={L_X + 78} y={114} textAnchor="middle"
                  fontSize={7.5} fontWeight={600} fill={COMMIT}>Poseidon(2)</text>
                {/* 입력 선 */}
                <line x1={L_X + 43} y1={66} x2={L_X + 70} y2={84}
                  stroke={SECRET} strokeWidth={1} opacity={0.5} />
                <line x1={L_X + 113} y1={66} x2={L_X + 86} y2={84}
                  stroke={SECRET} strokeWidth={1} opacity={0.5} />
              </motion.g>
            )}

            {/* Poseidon hasher (nullifierHash 생성) */}
            {showPoseidonNullifier && (
              <motion.g initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }} transition={sp}>
                <circle cx={L_X + 43} cy={130} r={12}
                  fill={`${NULLIFIER}18`} stroke={NULLIFIER} strokeWidth={1.4} />
                <motion.g
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: `${L_X + 43}px 130px` }}>
                  <path d={`M ${L_X + 43} ${120} L ${L_X + 43} ${126}`}
                    stroke={NULLIFIER} strokeWidth={1.5} />
                  <path d={`M ${L_X + 43} ${134} L ${L_X + 43} ${140}`}
                    stroke={NULLIFIER} strokeWidth={1.5} />
                  <path d={`M ${L_X + 33} ${130} L ${L_X + 39} ${130}`}
                    stroke={NULLIFIER} strokeWidth={1.5} />
                  <path d={`M ${L_X + 47} ${130} L ${L_X + 53} ${130}`}
                    stroke={NULLIFIER} strokeWidth={1.5} />
                </motion.g>
                <text x={L_X + 43} y={132} textAnchor="middle"
                  fontSize={7} fontWeight={700} fill={NULLIFIER}>H</text>
                <text x={L_X + 43} y={152} textAnchor="middle"
                  fontSize={7.5} fontWeight={600} fill={NULLIFIER}>Poseidon</text>
                {/* nullifier → hasher */}
                <line x1={L_X + 43} y1={66} x2={L_X + 43} y2={118}
                  stroke={NULLIFIER} strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
              </motion.g>
            )}

            {/* nullifierHash 결과 카드 (좌측) */}
            {showNullifierHash && (
              <motion.g initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }} transition={sp}>
                <DataBox x={L_X + 80} y={164} w={72} h={26}
                  label="nullifierHash" sub="H(null)" color={NULLIFIER} outlined />
              </motion.g>
            )}

            {/* ── commitment 전송 선 (좌→우) ── */}
            {showCommitmentWire && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <motion.path
                  d={`M ${L_X + 146} 90 Q 220 90, ${LEAVES[MY_LEAF].x + 10} 120`}
                  stroke={COMMIT} strokeWidth={1.3} fill="none"
                  strokeDasharray="3 2" markerEnd="url(#arrowCommit)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }} />
                <text x={210} y={86} textAnchor="middle"
                  fontSize={8} fontWeight={700} fill={COMMIT}>commitment</text>
              </motion.g>
            )}

            {/* ── nullifierHash 전송 선 (좌→우) ── */}
            {showNullifierHash && step >= 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <motion.path
                  d={`M ${L_X + 154} 177 Q 230 177, ${R_X + 12} 170`}
                  stroke={NULLIFIER} strokeWidth={1.3} fill="none"
                  strokeDasharray="3 2" markerEnd="url(#arrowNull)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }} />
                <text x={218} y={172} textAnchor="middle"
                  fontSize={8} fontWeight={700} fill={NULLIFIER}>nullifierHash</text>
              </motion.g>
            )}

            {/* ── 우측: Merkle tree ── */}
            {/* Root */}
            {showTreeStructure && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={ROOT.x - 22} y={ROOT.y - 8} width={44} height={16} rx={4}
                  fill={`${MERKLE}18`} stroke={MERKLE} strokeWidth={1.2} />
                <text x={ROOT.x} y={ROOT.y + 3} textAnchor="middle"
                  fontSize={8} fontWeight={700} fill={MERKLE}>root</text>
              </motion.g>
            )}

            {/* Parents */}
            {showTreeStructure && PARENTS.map((p, i) => (
              <motion.g key={`p${i}`} initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.08 * i }}>
                <circle cx={p.x} cy={p.y} r={6}
                  fill={`${MERKLE}15`} stroke={MERKLE} strokeWidth={1} />
                <line x1={p.x} y1={p.y - 6} x2={ROOT.x} y2={ROOT.y + 8}
                  stroke={MERKLE} strokeWidth={0.6} opacity={0.5} />
              </motion.g>
            ))}

            {/* Leaves */}
            {LEAVES.map((l, i) => {
              const isMine = i === MY_LEAF;
              const visible = isMine ? showMyLeaf : showOtherLeaves;
              const color = isMine ? COMMIT : DEPOSIT;
              // Merkle proof에서 sibling 경로 강조
              const isProofPath = showMerkleProof && (i === MY_LEAF || i === MY_LEAF - 1);
              return (
                <motion.g key={`l${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
                  transition={{ ...sp, delay: isMine ? 0 : 0.06 * i }}>
                  <rect x={l.x} y={l.y} width={20} height={18} rx={3}
                    fill={`${color}18`} stroke={color}
                    strokeWidth={isProofPath ? 1.8 : 1} />
                  <text x={l.x + 10} y={l.y + 12} textAnchor="middle"
                    fontSize={7.5} fontWeight={700} fill={color}>{l.label}</text>
                  {/* leaf → parent 선 */}
                  {showTreeStructure && (
                    <line x1={l.x + 10} y1={l.y}
                      x2={PARENTS[Math.floor(i / 2)] ? PARENTS[Math.floor(i / 2)].x : ROOT.x}
                      y2={PARENTS[Math.floor(i / 2)] ? PARENTS[Math.floor(i / 2)].y + 6 : ROOT.y + 8}
                      stroke={isProofPath ? NULLIFIER : MERKLE}
                      strokeWidth={isProofPath ? 1.4 : 0.6}
                      opacity={isProofPath ? 0.9 : 0.5} />
                  )}
                </motion.g>
              );
            })}

            {/* Merkle proof 강조 텍스트 */}
            {showMerkleProof && (
              <motion.text
                x={R_X + R_W / 2} y={46} textAnchor="middle"
                fontSize={8} fontWeight={700} fill={NULLIFIER}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                Merkle proof: C* ∈ tree
              </motion.text>
            )}

            {/* ── Nullifier Set (우측 하단) ── */}
            {showNullifierSet && (
              <motion.g initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={R_X + 10} y={160} width={R_W - 20} height={38} rx={5}
                  fill={`${NULLIFIER}08`} stroke={NULLIFIER}
                  strokeWidth={0.9} strokeDasharray="3 2" />
                <text x={R_X + R_W / 2} y={172} textAnchor="middle"
                  fontSize={7.5} fontWeight={700} fill={NULLIFIER}>spent nullifier set</text>
                {/* 기존 슬롯들 */}
                {[0, 1, 2].map((i) => (
                  <rect key={`slot${i}`}
                    x={R_X + 26 + i * 28} y={180} width={20} height={12} rx={2}
                    fill={`${NULLIFIER}15`} stroke={NULLIFIER} strokeWidth={0.7} opacity={0.5} />
                ))}
                {/* 새로 추가되는 슬롯 (step 4) */}
                {showCheckAnim && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: 0.3 }}>
                    <rect x={R_X + 110} y={180} width={20} height={12} rx={2}
                      fill={`${NULLIFIER}35`} stroke={NULLIFIER} strokeWidth={1.3} />
                    <text x={R_X + 120} y={189} textAnchor="middle"
                      fontSize={7} fontWeight={700} fill={NULLIFIER}>new</text>
                    {/* 체크 애니메이션 */}
                    <motion.path
                      d={`M ${R_X + 138} 186 L ${R_X + 143} 191 L ${R_X + 150} 182`}
                      stroke={COMMIT} strokeWidth={1.8} fill="none"
                      strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }} />
                  </motion.g>
                )}
              </motion.g>
            )}

            {/* ── 출금 실행 배지 (step 4) ── */}
            {showWithdraw && (
              <motion.g
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.8 }}>
                <ActionBox x={L_X + 18} y={103} w={110} h={24}
                  label="출금 완료" sub="이중 사용 차단" color={WITHDRAW} />
              </motion.g>
            )}

            {/* ── step별 상단 배너 ── */}
            {step === 0 && (
              <motion.text
                key="banner-0"
                x={L_X + L_W / 2} y={96} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={SECRET}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                증명자만 알고 있음
              </motion.text>
            )}
            {step === 2 && (
              <motion.text
                key="banner-2"
                x={R_X + R_W / 2} y={164} textAnchor="middle"
                fontSize={8.5} fontWeight={700} fill={DEPOSIT}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                anonymous set 성장
              </motion.text>
            )}
            {step === 2 && (
              <AlertBox x={L_X + 22} y={110} w={110} h={36}
                label="구분 불가" sub="어떤 leaf 인가?" color={MERKLE} />
            )}

            {/* arrow markers */}
            <defs>
              <marker id="arrowCommit" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={COMMIT} />
              </marker>
              <marker id="arrowNull" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={NULLIFIER} />
              </marker>
            </defs>
          </svg>
        );
      }}
    </StepViz>
  );
}
