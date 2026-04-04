import { motion } from 'framer-motion';
import { DataBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ProofTraceVizData';

/* ── 공통: 화살표 마커 ── */
export function ArrowDefs() {
  return (
    <defs>
      <marker id="ptArr" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--foreground)" />
      </marker>
      <marker id="ptArrG" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.mpt} />
      </marker>
      <marker id="ptArrA" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rlp} />
      </marker>
      <marker id="ptArrK" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.keccak} />
      </marker>
    </defs>
  );
}

/** Step 0: 주소 → keccak256 해시 경로 변환 */
export function Step0() {
  const addrHex = '0xd8dA6BF2...';
  const hashHex = '0x5b9e7c...a1f3';
  // nibble(16진수 한 자리)를 4비트 경로로 쪼개는 시각화
  const nibbles = ['5', 'b', '9', 'e', '7', 'c', '...'];

  return (
    <g>
      <ArrowDefs />
      <text x={240} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.keccak}>
        keccak256(address) → 트라이 경로
      </text>

      {/* 입력: 주소 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <DataBox x={20} y={36} w={130} h={30} label={addrHex} sub="20바이트 주소" color={C.keccak} />
      </motion.g>

      {/* 화살표 */}
      <motion.line x1={155} y1={51} x2={190} y2={51}
        stroke={C.keccak} strokeWidth={1.2} markerEnd="url(#ptArrK)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }} />

      {/* keccak256 연산 박스 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <ActionBox x={194} y={34} w={95} h={34}
          label="keccak256" sub="SHA-3 변형" color={C.keccak} />
      </motion.g>

      {/* 화살표 */}
      <motion.line x1={293} y1={51} x2={324} y2={51}
        stroke={C.keccak} strokeWidth={1.2} markerEnd="url(#ptArrK)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }} />

      {/* 출력: 32바이트 해시 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}>
        <DataBox x={328} y={36} w={130} h={30} label={hashHex} sub="32바이트 해시" color={C.keccak} />
      </motion.g>

      {/* 하단: nibble 분해 시각화 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}>
        <text x={240} y={92} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">
          해시 → nibble(4비트) 경로로 분해
        </text>

        {/* nibble 칩들 */}
        {nibbles.map((n, i) => {
          const cx = 120 + i * 36;
          return (
            <motion.g key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}>
              <rect x={cx} y={102} width={28} height={24} rx={5}
                fill="var(--card)" stroke={C.keccak} strokeWidth={0.8} />
              <text x={cx + 14} y={118} textAnchor="middle"
                fontSize={10} fontWeight={700} fill={C.keccak}>{n}</text>
            </motion.g>
          );
        })}

        {/* 화살표 연결선 (nibble 사이) */}
        {nibbles.slice(0, -1).map((_, i) => {
          const x1 = 120 + i * 36 + 28;
          const x2 = 120 + (i + 1) * 36;
          return (
            <motion.line key={`nl-${i}`}
              x1={x1 + 1} y1={114} x2={x2 - 1} y2={114}
              stroke={C.keccak} strokeWidth={0.6} opacity={0.4}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 1.2 + i * 0.08, duration: 0.15 }} />
          );
        })}
      </motion.g>

      {/* 왜 해시? 설명 박스 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}>
        <rect x={80} y={140} width={320} height={40} rx={8}
          fill="var(--card)" stroke={C.keccak} strokeWidth={0.5} />
        <text x={240} y={157} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.keccak}>
          왜 해시하는가?
        </text>
        <text x={240} y={170} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          주소 분포가 편향되어도 해시가 균등 → 트라이 깊이 균형 유지 (최대 64 nibble)
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: MPT 경로 시각화 — root → branch → extension → leaf */
export function Step1() {
  // MPT 노드 위치 (트리 구조로 배치)
  const rootX = 200, rootY = 22;
  const branchX = 154, branchY = 62;
  const extX = 210, extY = 110;
  const leafX = 268, leafY = 156;

  return (
    <g>
      <ArrowDefs />
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.mpt}>
        Merkle-Patricia Trie 경로 검증
      </text>

      {/* ── 루트: state_root (해시) ── */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}>
        {/* 루트 원형 */}
        <circle cx={rootX + 32} cy={rootY + 14} r={16}
          fill="var(--card)" stroke={C.mpt} strokeWidth={1.5} />
        <text x={rootX + 32} y={rootY + 11} textAnchor="middle"
          fontSize={7.5} fontWeight={700} fill={C.mpt}>state</text>
        <text x={rootX + 32} y={rootY + 20} textAnchor="middle"
          fontSize={7} fill={C.mpt}>root</text>
      </motion.g>

      {/* ── 루트 → 브랜치 화살표 ── */}
      <motion.line x1={rootX + 20} y1={rootY + 28} x2={branchX + 65} y2={branchY + 2}
        stroke={C.mpt} strokeWidth={1} markerEnd="url(#ptArrG)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }} />
      <motion.text x={rootX - 2} y={rootY + 36} fontSize={7}
        fill={C.mpt} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}>
        nibble[0] = 5
      </motion.text>

      {/* ── Branch Node: 16개 슬롯 시각화 ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        {/* 배경 */}
        <rect x={branchX - 48} y={branchY} width={236} height={38} rx={6}
          fill="var(--card)" stroke={C.mpt} strokeWidth={0.8} />
        {/* 상단 라벨 */}
        <rect x={branchX - 48} y={branchY} width={236} height={5} rx={3}
          fill={C.mpt} opacity={0.7} />
        <text x={branchX - 42} y={branchY + 16} fontSize={7.5}
          fontWeight={700} fill={C.mpt}>Branch</text>

        {/* 16개 슬롯 (0~f) */}
        {Array.from({ length: 16 }, (_, i) => {
          const sx = branchX + 2 + i * 11.5;
          const isActive = i === 0x5; // nibble 5가 활성
          return (
            <g key={i}>
              <rect x={sx} y={branchY + 12} width={10} height={18} rx={2}
                fill={isActive ? C.mpt : 'var(--border)'}
                opacity={isActive ? 0.3 : 0.15} />
              <text x={sx + 5} y={branchY + 24} textAnchor="middle"
                fontSize={7} fontWeight={isActive ? 700 : 400}
                fill={isActive ? C.mpt : 'var(--muted-foreground)'}>
                {i.toString(16)}
              </text>
            </g>
          );
        })}

        {/* 해시 일치 체크 */}
        <motion.text x={branchX + 200} y={branchY + 24} fontSize={10}
          fontWeight={700} fill={C.mpt}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}>
          {'✓'}
        </motion.text>
      </motion.g>

      {/* ── 브랜치 → 익스텐션 화살표 ── */}
      <motion.line x1={branchX + 70} y1={branchY + 38} x2={extX + 30} y2={extY + 2}
        stroke={C.mpt} strokeWidth={1} markerEnd="url(#ptArrG)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }} />
      <motion.text x={branchX + 48} y={branchY + 50} fontSize={7}
        fill={C.mpt} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}>
        nibble[1] = b
      </motion.text>

      {/* ── Extension Node: 공통 경로 압축 ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}>
        <rect x={extX - 16} y={extY} width={150} height={34} rx={6}
          fill="var(--card)" stroke={C.mpt} strokeWidth={0.8} />
        {/* 좌측 액센트 바 */}
        <rect x={extX - 16} y={extY} width={4} height={34} rx={2}
          fill={C.mpt} opacity={0.8} />
        <text x={extX - 6} y={extY + 14} fontSize={7.5}
          fontWeight={700} fill={C.mpt}>Extension</text>
        {/* 압축된 경로 */}
        <text x={extX - 6} y={extY + 26} fontSize={7}
          fill="var(--foreground)">
          shared: [9, e] → 2 nibble 단축
        </text>
        {/* 해시 일치 체크 */}
        <motion.text x={extX + 142} y={extY + 22} fontSize={10}
          fontWeight={700} fill={C.mpt}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}>
          {'✓'}
        </motion.text>
      </motion.g>

      {/* ── 익스텐션 → 리프 화살표 ── */}
      <motion.line x1={extX + 60} y1={extY + 34} x2={leafX + 20} y2={leafY + 2}
        stroke={C.mpt} strokeWidth={1} markerEnd="url(#ptArrG)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.3, duration: 0.3 }} />
      <motion.text x={extX + 38} y={extY + 46} fontSize={7}
        fill={C.mpt} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.35 }}>
        nibble[4..] = 7c...
      </motion.text>

      {/* ── Leaf Node: 최종 값 ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}>
        <rect x={leafX - 16} y={leafY} width={140} height={34} rx={14}
          fill="var(--card)" stroke={C.mpt} strokeWidth={0.8} />
        <rect x={leafX - 16} y={leafY} width={140} height={34} rx={14}
          fill={`${C.mpt}10`} />
        <text x={leafX + 54} y={leafY + 15} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.mpt}>Leaf</text>
        <text x={leafX + 54} y={leafY + 26} textAnchor="middle"
          fontSize={7} fill="var(--foreground)">
          remainder + RLP(account)
        </text>
        {/* 해시 일치 체크 */}
        <motion.text x={leafX + 132} y={leafY + 22} fontSize={10}
          fontWeight={700} fill={C.mpt}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7, type: 'spring' }}>
          {'✓'}
        </motion.text>
      </motion.g>

      {/* ── 우측: 노드 타입 범례 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}>
        <rect x={8} y={138} width={130} height={54} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={73} y={152} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.mpt}>검증 원리</text>
        <text x={16} y={165} fontSize={7}
          fill="var(--foreground)">hash(child) == parent[slot]</text>
        <text x={16} y={178} fontSize={7}
          fill="var(--muted-foreground)">루트→리프: 해시 체인 일치 확인</text>
      </motion.g>
    </g>
  );
}

/** Step 2: RLP 바이트 → 4필드 분해 */
export function Step2() {
  const fields = [
    { label: 'nonce', size: '8B', color: '#6366f1', desc: '트랜잭션 카운터' },
    { label: 'balance', size: '32B', color: '#10b981', desc: 'ETH 잔액 (wei)' },
    { label: 'storage_root', size: '32B', color: '#8b5cf6', desc: '스토리지 트라이 루트' },
    { label: 'code_hash', size: '32B', color: '#f59e0b', desc: '컨트랙트 코드 해시' },
  ];

  return (
    <g>
      <ArrowDefs />
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.rlp}>
        RLP 디코딩 → Account 구조체
      </text>

      {/* RLP 바이트 스트림 (원본) */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <rect x={40} y={32} width={180} height={30} rx={6}
          fill="var(--card)" stroke={C.rlp} strokeWidth={0.8} />
        <text x={130} y={44} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.rlp}>RLP encoded bytes</text>
        <text x={130} y={56} textAnchor="middle"
          fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          f8 44 80 88 0d e0 b6 b3 a7...
        </text>
      </motion.g>

      {/* 화살표 + Account::decode */}
      <motion.line x1={224} y1={47} x2={260} y2={47}
        stroke={C.rlp} strokeWidth={1.2} markerEnd="url(#ptArrA)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <ActionBox x={264} y={32} w={100} h={30}
          label="Account::decode" sub="alloy_rlp" color={C.rlp} />
      </motion.g>

      {/* 분해 화살표들 */}
      {fields.map((f, i) => {
        const fy = 82 + i * 28;
        return (
          <motion.g key={f.label}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.15 }}>

            {/* 연결선 */}
            <motion.line
              x1={314} y1={62} x2={314} y2={fy + 2}
              stroke={C.rlp} strokeWidth={0.5} opacity={0.3}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.65 + i * 0.15, duration: 0.15 }} />
            <motion.line
              x1={314} y1={fy + 12} x2={280} y2={fy + 12}
              stroke={f.color} strokeWidth={0.8} markerEnd="url(#ptArr)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.7 + i * 0.15, duration: 0.2 }} />

            {/* 필드 박스 */}
            <rect x={56} y={fy} width={220} height={24} rx={5}
              fill="var(--card)" stroke={f.color} strokeWidth={0.7} />

            {/* 필드명 */}
            <text x={68} y={fy + 16} fontSize={9}
              fontWeight={600} fill={f.color}>{f.label}</text>

            {/* 크기 */}
            <rect x={160} y={fy + 4} width={32} height={16} rx={8}
              fill={`${f.color}15`} />
            <text x={176} y={fy + 15} textAnchor="middle"
              fontSize={7} fill={f.color}>{f.size}</text>

            {/* 설명 */}
            <text x={204} y={fy + 16} fontSize={7}
              fill="var(--muted-foreground)">{f.desc}</text>
          </motion.g>
        );
      })}

      {/* 좌측 RLP 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        <rect x={340} y={86} width={130} height={54} rx={6}
          fill="var(--card)" stroke={C.rlp} strokeWidth={0.5} />
        <text x={405} y={102} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.rlp}>RLP 규칙</text>
        <text x={350} y={116} fontSize={7}
          fill="var(--foreground)">f8: 리스트 (1바이트 길이)</text>
        <text x={350} y={128} fontSize={7}
          fill="var(--muted-foreground)">필드 순서 고정 (EIP-161)</text>
      </motion.g>
    </g>
  );
}
