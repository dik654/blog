import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MONO = '#ef4444';
const SPLIT = '#10b981';
const SUPER = '#a855f7';
const HEX = '#f59e0b';
const BIN = '#10b981';
const KEC = '#ef4444';
const POS = '#10b981';
const MUTED = '#94a3b8';

const STEPS = [
  {
    label: '① 단일 거대 회로의 한계',
    body: '140+ opcode 를 하나의 회로에 다 넣으면 rows 1B+ · prover memory 수백 GB 가 필요.\n수정 한 번에 전체 재검증, proof 크기 선형 증가 → verifier gas 폭주.',
  },
  {
    label: '② 11개 서브회로로 분할',
    body: 'EVM / State / Bytecode / Copy / Keccak / MPT / Poseidon / Tx / ECC / PI / Sig.\n관심사 분리 + 독립 prove (multi-core/GPU) + lookup table 로 일관성 보장.',
  },
  {
    label: '③ SuperCircuit 통합',
    body: '11 서브회로의 공통 constraint 를 묶어 단일 proof 로 전체 EVM 실행을 증명.\n공유 테이블 (RwTable, TxTable) 이 회로 간 데이터 흐름을 연결.',
  },
  {
    label: '④ Hexary vs Binary MPT',
    body: '이더리움 표준 MPT 는 Hexary (16 children) — 비교적 얕지만 노드당 16 hash.\nScroll zkTrie 는 Binary (2 children) — 깊지만 노드당 2 hash, 총 hash 수 ~4x 적음.',
  },
  {
    label: '⑤ Keccak vs Poseidon constraint',
    body: 'Keccak ~150,000 constraints/hash — 비트 단위 분해가 SNARK 회로에서 폭주.\nPoseidon ~200 constraints/hash — 필드 연산만 사용 → 약 750x 효율.',
  },
  {
    label: '⑥ 종합: zkTrie 선택의 결과',
    body: '4x hash 적음 × 750x 제약 효율 = SNARK 비용 약 3000x 절감.\nTrade-off: 이더리움과 다른 state root → L1 bridge 별도 매핑, Scroll node 양쪽 state 유지.',
  },
];

// ① 단일 거대 회로의 문제 — 빨간 경고
function StepMonolith() {
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 거대한 회로 박스 */}
      <motion.rect x={120} y={40} width={280} height={170} rx={10}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        fill={`${MONO}14`} stroke={MONO} strokeWidth={1.6} strokeDasharray="5 3" />

      <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={800} fill={MONO}>
        단일 거대 회로
      </text>
      <text x={260} y={78} textAnchor="middle" fontSize={9} fill={`${MONO}cc`}>
        140+ opcode 가 하나의 회로에
      </text>

      {/* 내부 격자 — opcode 가득 찬 느낌 */}
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 14 }).map((__, c) => (
          <motion.rect key={`g-${r}-${c}`}
            x={134 + c * 19} y={92 + r * 14} width={16} height={11} rx={1.5}
            initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
            transition={{ delay: 0.2 + (r * 14 + c) * 0.005 }}
            fill={`${MONO}30`} stroke={`${MONO}60`} strokeWidth={0.3} />
        ))
      )}

      {/* 경고 라벨 3개 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
        <rect x={20} y={228} width={150} height={48} rx={6}
          fill={`${MONO}14`} stroke={MONO} strokeWidth={1} strokeDasharray="3 2" />
        <text x={95} y={246} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={MONO}>
          rows 1B+
        </text>
        <text x={95} y={262} textAnchor="middle" fontSize={8} fill={`${MONO}cc`}>
          prover memory 수백 GB
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <rect x={185} y={228} width={150} height={48} rx={6}
          fill={`${MONO}14`} stroke={MONO} strokeWidth={1} strokeDasharray="3 2" />
        <text x={260} y={246} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={MONO}>
          변경 = 전체 재검증
        </text>
        <text x={260} y={262} textAnchor="middle" fontSize={8} fill={`${MONO}cc`}>
          디버깅 극히 어려움
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
        <rect x={350} y={228} width={150} height={48} rx={6}
          fill={`${MONO}14`} stroke={MONO} strokeWidth={1} strokeDasharray="3 2" />
        <text x={425} y={246} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={MONO}>
          proof 선형 증가
        </text>
        <text x={425} y={262} textAnchor="middle" fontSize={8} fill={`${MONO}cc`}>
          verifier gas 폭주
        </text>
      </motion.g>

      <motion.text x={260} y={295} textAnchor="middle" fontSize={9} fontWeight={700} fill={MONO}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
        → 실용적 zkEVM 구현 불가능
      </motion.text>
    </svg>
  );
}

// ② 11개 서브회로 그리드
const SUBS = [
  { id: 'EVM', desc: 'opcode' },
  { id: 'State', desc: 'RWTable' },
  { id: 'Bytecode', desc: 'code hash' },
  { id: 'Copy', desc: 'memory' },
  { id: 'Keccak', desc: 'SHA3' },
  { id: 'MPT', desc: 'state tree' },
  { id: 'Poseidon', desc: 'ZK hash' },
  { id: 'Tx', desc: 'tx sig' },
  { id: 'ECC', desc: 'ECDSA' },
  { id: 'PI', desc: 'block hdr' },
  { id: 'Sig', desc: 'agg sig' },
];

function StepSplit() {
  // 11개를 4 columns x 3 rows (마지막 줄 일부 빈 칸)
  const cols = 4;
  const cellW = 110;
  const cellH = 60;
  const gridW = cols * cellW + (cols - 1) * 12;
  const startX = (520 - gridW) / 2;

  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={SPLIT}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        11개 서브회로 — 관심사 분리
      </motion.text>

      {SUBS.map((s, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cellW + 12);
        const y = 44 + row * (cellH + 14);
        return (
          <motion.g key={s.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}>
            <rect x={x} y={y} width={cellW} height={cellH} rx={7}
              fill={`${SPLIT}10`} stroke={SPLIT} strokeWidth={1.2} />
            <rect x={x} y={y} width={cellW} height={4} rx={2} fill={SPLIT} opacity={0.7} />
            <text x={x + cellW / 2} y={y + 28} textAnchor="middle" fontSize={11} fontWeight={700} fill={SPLIT}>
              {s.id}
            </text>
            <text x={x + cellW / 2} y={y + 44} textAnchor="middle" fontSize={8} fill={`${SPLIT}aa`}>
              {s.desc}
            </text>
          </motion.g>
        );
      })}

      {/* 하단 lookup 연결 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <rect x={70} y={262} width={380} height={26} rx={5}
          fill={`${SPLIT}10`} stroke={SPLIT} strokeWidth={0.8} />
        <text x={260} y={279} textAnchor="middle" fontSize={9} fontWeight={700} fill={SPLIT}>
          서브회로 간 lookup table 연결 → 일관성 보장 + 병렬 prove
        </text>
      </motion.g>
    </svg>
  );
}

// ③ SuperCircuit 통합 — 11 박스 → 단일 proof 노드로 화살표 수렴
function StepSuper() {
  // 11 서브회로 위치 — 상단/좌우에 호 형태로 배치
  const center = { x: 260, y: 220 };
  const positions = SUBS.map((s, i) => {
    const cols = 11;
    const x = 30 + i * ((520 - 60) / (cols - 1));
    const y = 60;
    return { ...s, x, y };
  });

  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={SUPER}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        SuperCircuit — 단일 proof 통합
      </motion.text>

      {/* 화살표: 각 서브회로 → 중심 */}
      {positions.map((p, i) => (
        <motion.line key={`arr-${i}`}
          x1={p.x} y1={p.y + 22} x2={center.x} y2={center.y - 22}
          stroke={SUPER} strokeWidth={0.7} opacity={0.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ delay: 0.4 + i * 0.04, duration: 0.5 }} />
      ))}

      {/* 11 서브회로 상단 박스 */}
      {positions.map((p, i) => (
        <motion.g key={p.id}
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + i * 0.04 }}>
          <rect x={p.x - 19} y={p.y} width={38} height={22} rx={4}
            fill={`${SUPER}14`} stroke={SUPER} strokeWidth={0.9} />
          <text x={p.x} y={p.y + 14} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={SUPER}>
            {p.id}
          </text>
        </motion.g>
      ))}

      {/* 중앙 SuperCircuit 노드 */}
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}>
        <circle cx={center.x} cy={center.y} r={38} fill={`${SUPER}22`} stroke={SUPER} strokeWidth={2} />
        <circle cx={center.x} cy={center.y} r={28} fill={`${SUPER}10`} stroke={SUPER} strokeWidth={0.8} />
        <text x={center.x} y={center.y - 2} textAnchor="middle" fontSize={11} fontWeight={800} fill={SUPER}>
          Super
        </text>
        <text x={center.x} y={center.y + 11} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={SUPER}>
          Circuit
        </text>
      </motion.g>

      {/* 하단 단일 proof */}
      <motion.line x1={center.x} y1={center.y + 38} x2={center.x} y2={center.y + 56}
        stroke={SUPER} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3 }} />
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
        <rect x={170} y={272} width={180} height={22} rx={11}
          fill={`${SUPER}22`} stroke={SUPER} strokeWidth={1.2} />
        <text x={260} y={287} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={SUPER}>
          single proof for full EVM exec
        </text>
      </motion.g>
    </svg>
  );
}

// ④ Hexary vs Binary MPT 트리 비교
function StepTrieCompare() {
  // 좌측 hexary tree — depth 2, root + 16 leaves
  const hexRoot = { x: 130, y: 70 };
  const hexLeaves = Array.from({ length: 16 }, (_, i) => ({
    x: 22 + i * 14,
    y: 130,
  }));

  // 우측 binary tree — depth 4, 2^4 = 16 leaves
  const binRoot = { x: 390, y: 60 };
  const binLevels: { x: number; y: number; parent?: { x: number; y: number } }[][] = [];
  // Build binary tree
  binLevels.push([binRoot]);
  for (let lv = 1; lv <= 4; lv++) {
    const count = 1 << lv;
    const spread = 200;
    const startX = 390 - spread / 2;
    const step = spread / (count - 1 || 1);
    const y = 60 + lv * 32;
    const nodes = Array.from({ length: count }, (_, i) => {
      const parentIdx = i >> 1;
      return { x: startX + i * step, y, parent: binLevels[lv - 1][parentIdx] };
    });
    binLevels.push(nodes);
  }

  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 좌측: Hexary */}
      <motion.text x={130} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={HEX}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Ethereum MPT (Hexary)
      </motion.text>
      <text x={130} y={36} textAnchor="middle" fontSize={8} fill={`${HEX}aa`}>
        16 children · Keccak hash
      </text>

      {/* hexary edges */}
      {hexLeaves.map((leaf, i) => (
        <motion.line key={`he-${i}`}
          x1={hexRoot.x} y1={hexRoot.y + 7} x2={leaf.x + 5} y2={leaf.y}
          stroke={HEX} strokeWidth={0.6} opacity={0.55}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 + i * 0.02 }} />
      ))}

      {/* hexary root */}
      <motion.circle cx={hexRoot.x} cy={hexRoot.y} r={9}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        fill={`${HEX}33`} stroke={HEX} strokeWidth={1.4} />

      {/* hexary leaves */}
      {hexLeaves.map((leaf, i) => (
        <motion.rect key={`hl-${i}`}
          x={leaf.x} y={leaf.y} width={10} height={10} rx={1.5}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.15 + i * 0.02 }}
          fill={`${HEX}22`} stroke={HEX} strokeWidth={0.7} />
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <text x={130} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={HEX}>
          depth = log₁₆(N)
        </text>
        <text x={130} y={172} textAnchor="middle" fontSize={8} fill={`${HEX}cc`}>
          16 hash / node
        </text>
      </motion.g>

      {/* 가운데 구분선 */}
      <line x1={260} y1={50} x2={260} y2={260} stroke={MUTED} strokeWidth={0.5} strokeDasharray="2 3" opacity={0.5} />

      {/* 우측: Binary */}
      <motion.text x={390} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={BIN}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Scroll zkTrie (Binary)
      </motion.text>
      <text x={390} y={36} textAnchor="middle" fontSize={8} fill={`${BIN}aa`}>
        2 children · Poseidon hash
      </text>

      {/* binary edges */}
      {binLevels.slice(1).map((level, lv) =>
        level.map((node, i) => (
          <motion.line key={`be-${lv}-${i}`}
            x1={node.parent!.x} y1={node.parent!.y + 4} x2={node.x} y2={node.y - 3}
            stroke={BIN} strokeWidth={0.5} opacity={0.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.25 + lv * 0.1 + i * 0.005 }} />
        ))
      )}

      {/* binary nodes */}
      {binLevels.map((level, lv) =>
        level.map((node, i) => (
          <motion.circle key={`bn-${lv}-${i}`}
            cx={node.x} cy={node.y} r={lv === 0 ? 7 : Math.max(2.2, 5 - lv * 0.6)}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2 + lv * 0.1 + i * 0.005 }}
            fill={`${BIN}33`} stroke={BIN} strokeWidth={lv === 0 ? 1.4 : 0.6} />
        ))
      )}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <text x={390} y={222} textAnchor="middle" fontSize={9} fontWeight={700} fill={BIN}>
          depth = log₂(N)
        </text>
        <text x={390} y={236} textAnchor="middle" fontSize={8} fill={`${BIN}cc`}>
          2 hash / node
        </text>
      </motion.g>

      {/* 하단 결론 */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
        <rect x={70} y={270} width={380} height={22} rx={5}
          fill={`${BIN}10`} stroke={BIN} strokeWidth={0.8} />
        <text x={260} y={285} textAnchor="middle" fontSize={9} fontWeight={700} fill={BIN}>
          Binary trie 가 깊지만 노드당 hash 수 적어 총 hash ~4× 절감
        </text>
      </motion.g>
    </svg>
  );
}

// ⑤ Keccak vs Poseidon constraint 비교 (로그 스케일 막대)
function StepConstraintBar() {
  const items = [
    { name: 'Keccak', cost: 150000, color: KEC, sub: 'bit-level XOR/AND/NOT' },
    { name: 'Poseidon', cost: 200, color: POS, sub: 'field ops only' },
  ];
  const maxCost = 150000;
  const maxBar = 360;
  // log scale
  const widthOf = (c: number) => maxBar * (Math.log10(c) / Math.log10(maxCost));

  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        SNARK 회로 내 1 hash 제약 수 (log scale)
      </motion.text>

      {items.map((it, i) => {
        const y = 70 + i * 90;
        const w = widthOf(it.cost);
        return (
          <g key={it.name}>
            <text x={30} y={y - 8} fontSize={11} fontWeight={800} fill={it.color}>
              {it.name}
            </text>
            <text x={90} y={y - 8} fontSize={8} fill={`${it.color}aa`}>
              {it.sub}
            </text>
            {/* track */}
            <rect x={30} y={y} width={maxBar} height={28} rx={4}
              fill={`${it.color}08`} stroke={`${it.color}30`} strokeWidth={0.5} />
            <motion.rect x={30} y={y} height={28} rx={4}
              initial={{ width: 0 }} animate={{ width: w }}
              transition={{ delay: 0.3 + i * 0.3, duration: 0.7 }}
              fill={`${it.color}33`} stroke={it.color} strokeWidth={1.3} />
            <motion.text x={40 + w} y={y + 18} fontSize={10} fontWeight={700} fill={it.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.3 }}>
              ~{it.cost.toLocaleString()} constraints
            </motion.text>
          </g>
        );
      })}

      {/* 비율 결과 배너 */}
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6 }}>
        <rect x={80} y={250} width={360} height={36} rx={8}
          fill={`${POS}18`} stroke={POS} strokeWidth={1.4} />
        <text x={260} y={266} textAnchor="middle" fontSize={11} fontWeight={800} fill={POS}>
          Poseidon ≈ 750× 효율
        </text>
        <text x={260} y={279} textAnchor="middle" fontSize={8} fill={`${POS}cc`}>
          150,000 / 200 — prover 시간이 결정적으로 줄어듦
        </text>
      </motion.g>
    </svg>
  );
}

// ⑥ 종합 결과 + trade-off
function StepSummary() {
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={12} fontWeight={800} fill={SUPER}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        zkTrie 선택의 종합 효과
      </motion.text>

      {/* 곱셈 다이어그램: 4x × 750x = 3000x */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <rect x={30} y={56} width={140} height={64} rx={8}
          fill={`${BIN}14`} stroke={BIN} strokeWidth={1.3} />
        <text x={100} y={78} textAnchor="middle" fontSize={11} fontWeight={800} fill={BIN}>
          ~4×
        </text>
        <text x={100} y={94} textAnchor="middle" fontSize={8.5} fill={`${BIN}cc`}>
          Binary trie
        </text>
        <text x={100} y={108} textAnchor="middle" fontSize={8.5} fill={`${BIN}cc`}>
          fewer hashes
        </text>
      </motion.g>

      <motion.text x={185} y={94} textAnchor="middle" fontSize={18} fontWeight={800} fill={MUTED}
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}>
        ×
      </motion.text>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x={200} y={56} width={140} height={64} rx={8}
          fill={`${POS}14`} stroke={POS} strokeWidth={1.3} />
        <text x={270} y={78} textAnchor="middle" fontSize={11} fontWeight={800} fill={POS}>
          ~750×
        </text>
        <text x={270} y={94} textAnchor="middle" fontSize={8.5} fill={`${POS}cc`}>
          Poseidon
        </text>
        <text x={270} y={108} textAnchor="middle" fontSize={8.5} fill={`${POS}cc`}>
          per-hash constraints
        </text>
      </motion.g>

      <motion.text x={355} y={94} textAnchor="middle" fontSize={18} fontWeight={800} fill={MUTED}
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0 }}>
        =
      </motion.text>

      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}>
        <rect x={370} y={50} width={130} height={76} rx={10}
          fill={`${SUPER}22`} stroke={SUPER} strokeWidth={1.8} />
        <text x={435} y={75} textAnchor="middle" fontSize={13} fontWeight={800} fill={SUPER}>
          ~3000×
        </text>
        <text x={435} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill={SUPER}>
          SNARK 효율
        </text>
        <text x={435} y={106} textAnchor="middle" fontSize={8} fill={`${SUPER}cc`}>
          state-proof cost
        </text>
        <text x={435} y={118} textAnchor="middle" fontSize={8} fill={`${SUPER}cc`}>
          절감
        </text>
      </motion.g>

      {/* Trade-off 박스 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
        <rect x={30} y={150} width={460} height={92} rx={8}
          fill={`${HEX}10`} stroke={HEX} strokeWidth={1.1} strokeDasharray="4 3" />
        <text x={48} y={172} fontSize={11} fontWeight={800} fill={HEX}>
          Trade-off: L1 bridge 별도 매핑
        </text>
        <text x={48} y={192} fontSize={9} fill={`${HEX}dd`}>
          • 이더리움과 다른 trie → state root 불일치
        </text>
        <text x={48} y={208} fontSize={9} fill={`${HEX}dd`}>
          • L1 ↔ L2 bridge 가 별도 state mapping 유지
        </text>
        <text x={48} y={224} fontSize={9} fill={`${HEX}dd`}>
          • Scroll node 는 EVM state + zkTrie state 양쪽 보관
        </text>
      </motion.g>

      {/* 하단 결론 */}
      <motion.text x={260} y={272} textAnchor="middle" fontSize={10} fontWeight={700} fill={SUPER}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
        SNARK 비용 절감 vs L1 호환성 — Scroll 은 prover 효율을 우선
      </motion.text>
    </svg>
  );
}

export default function SubCircuitArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <StepMonolith />;
        if (step === 1) return <StepSplit />;
        if (step === 2) return <StepSuper />;
        if (step === 3) return <StepTrieCompare />;
        if (step === 4) return <StepConstraintBar />;
        return <StepSummary />;
      }}
    </StepViz>
  );
}
