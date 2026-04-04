import { motion } from 'framer-motion';
import { DataBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ProofTraceVizData';

/* ── 공통: 화살표 마커 ── */
function Defs() {
  return (
    <defs>
      <marker id="ptArr2" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--foreground)" />
      </marker>
      <marker id="ptArr2V" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.nested} />
      </marker>
      <marker id="ptArr2C" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.pipeline} />
      </marker>
    </defs>
  );
}

/** Step 3: 중첩 트라이 — state trie → account → storageRoot → storage trie */
export function Step3() {
  return (
    <g>
      <Defs />
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.nested}>
        중첩 트라이: State Trie → Storage Trie
      </text>

      {/* ── 1단계: State Trie (좌측) ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        {/* State Trie 영역 */}
        <rect x={10} y={28} width={180} height={154} rx={8}
          fill="var(--card)" stroke={C.mpt} strokeWidth={0.8}
          strokeDasharray="4 3" />
        <text x={100} y={44} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.mpt}>State Trie</text>

        {/* 트리 구조 — 루트 → 노드 → 리프 */}
        <circle cx={100} cy={58} r={8}
          fill={`${C.mpt}20`} stroke={C.mpt} strokeWidth={1} />
        <text x={100} y={62} textAnchor="middle"
          fontSize={7} fontWeight={700} fill={C.mpt}>R</text>

        {/* 분기선 */}
        <motion.line x1={94} y1={66} x2={60} y2={84}
          stroke={C.mpt} strokeWidth={0.6} opacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }} />
        <motion.line x1={100} y1={66} x2={100} y2={84}
          stroke={C.mpt} strokeWidth={0.6} opacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }} />
        <motion.line x1={106} y1={66} x2={140} y2={84}
          stroke={C.mpt} strokeWidth={1} opacity={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }} />

        {/* 비활성 노드 */}
        <circle cx={60} cy={90} r={5}
          fill="var(--border)" opacity={0.3} />
        <circle cx={100} cy={90} r={5}
          fill="var(--border)" opacity={0.3} />

        {/* 활성 경로 노드 */}
        <motion.circle cx={140} cy={90} r={6}
          fill={`${C.mpt}30`} stroke={C.mpt} strokeWidth={1}
          initial={{ r: 0 }} animate={{ r: 6 }}
          transition={{ delay: 0.5 }} />

        {/* 아래 리프 */}
        <motion.line x1={140} y1={96} x2={130} y2={110}
          stroke={C.mpt} strokeWidth={1} opacity={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.2 }} />

        {/* 리프: Account */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}>
          <rect x={48} y={114} width={120} height={58} rx={6}
            fill="var(--card)" stroke={C.nested} strokeWidth={1} />
          <text x={108} y={128} textAnchor="middle"
            fontSize={7.5} fontWeight={700} fill={C.nested}>Account</text>

          {/* 4필드 */}
          <text x={58} y={141} fontSize={7} fill="var(--foreground)">nonce: 42</text>
          <text x={58} y={151} fontSize={7} fill="var(--foreground)">balance: 1.5 ETH</text>
          <text x={58} y={161} fontSize={7} fontWeight={600} fill={C.nested}>storage_root: 0xa3...</text>
          <text x={58} y={171} fontSize={7} fill="var(--muted-foreground)">code_hash: 0xf1...</text>
        </motion.g>
      </motion.g>

      {/* ── 연결 화살표: storage_root → Storage Trie ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1 }}>
        <motion.line x1={170} y1={158} x2={216} y2={120}
          stroke={C.nested} strokeWidth={1.5} markerEnd="url(#ptArr2V)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 0.4 }} />
        <rect x={176} y={126} width={50} height={14} rx={3}
          fill="var(--card)" stroke="none" />
        <text x={201} y={136} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.nested}>
          루트 전달
        </text>
      </motion.g>

      {/* ── 2단계: Storage Trie (우측) ── */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}>
        {/* Storage Trie 영역 */}
        <rect x={220} y={28} width={248} height={154} rx={8}
          fill="var(--card)" stroke={C.nested} strokeWidth={0.8}
          strokeDasharray="4 3" />
        <text x={344} y={44} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.nested}>Storage Trie</text>

        {/* Storage Trie 루트 — storage_root */}
        <circle cx={344} cy={60} r={8}
          fill={`${C.nested}20`} stroke={C.nested} strokeWidth={1} />
        <text x={344} y={64} textAnchor="middle"
          fontSize={7} fontWeight={700} fill={C.nested}>SR</text>

        {/* 분기 */}
        <motion.line x1={338} y1={68} x2={300} y2={86}
          stroke={C.nested} strokeWidth={0.6} opacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.4, duration: 0.2 }} />
        <motion.line x1={344} y1={68} x2={344} y2={86}
          stroke={C.nested} strokeWidth={1} opacity={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.4, duration: 0.2 }} />
        <motion.line x1={350} y1={68} x2={388} y2={86}
          stroke={C.nested} strokeWidth={0.6} opacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.4, duration: 0.2 }} />

        {/* 비활성 */}
        <circle cx={300} cy={92} r={5}
          fill="var(--border)" opacity={0.3} />
        <circle cx={388} cy={92} r={5}
          fill="var(--border)" opacity={0.3} />

        {/* 활성 경로 */}
        <motion.circle cx={344} cy={92} r={6}
          fill={`${C.nested}30`} stroke={C.nested} strokeWidth={1}
          initial={{ r: 0 }} animate={{ r: 6 }}
          transition={{ delay: 1.6 }} />

        {/* 리프로 연결 */}
        <motion.line x1={344} y1={98} x2={344} y2={116}
          stroke={C.nested} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.7, duration: 0.2 }} />

        {/* 스토리지 값 */}
        <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.9 }}>
          <rect x={296} y={118} width={96} height={30} rx={12}
            fill={`${C.nested}15`} stroke={C.nested} strokeWidth={1} />
          <text x={344} y={132} textAnchor="middle"
            fontSize={8} fontWeight={700} fill={C.nested}>slot[0]</text>
          <text x={344} y={143} textAnchor="middle"
            fontSize={7} fill="var(--foreground)">= 1000 (U256)</text>
        </motion.g>

        {/* keccak(key) 라벨 */}
        <text x={260} y={72} fontSize={7}
          fill="var(--muted-foreground)">path = keccak(key)</text>
      </motion.g>

      {/* ── 하단: 2단계 보안 설명 ── */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1 }}>
        <text x={240} y={196} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.nested}>
          1단계에서 storage_root 검증 → 2단계에서 그 루트 아래 슬롯 검증. 가짜 루트는 1단계에서 차단.
        </text>
      </motion.g>
    </g>
  );
}

/** Step 4: 전체 파이프라인 + Reth 비교 */
export function Step4() {
  // Helios 파이프라인 단계
  const stages = [
    { x: 12,  label: 'keccak',  sub: '경로 생성', color: C.keccak },
    { x: 102, label: 'MPT',     sub: '증명 검증', color: C.mpt },
    { x: 192, label: 'RLP',     sub: '디코딩',    color: C.rlp },
    { x: 282, label: 'Storage', sub: '중첩 트라이', color: C.nested },
  ];

  return (
    <g>
      <Defs />
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.pipeline}>
        verify_account_proof + verify_storage_proof
      </text>

      {/* ── Helios 경로 ── */}
      <motion.text x={12} y={40} fontSize={8}
        fontWeight={700} fill={C.pipeline}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}>
        Helios (경량 클라이언트)
      </motion.text>

      {stages.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.2 }}>
          {/* Stage 박스 */}
          <rect x={s.x} y={50} width={80} height={36} rx={6}
            fill="var(--card)" stroke={s.color} strokeWidth={1} />
          <rect x={s.x} y={50} width={80} height={5} rx={3}
            fill={s.color} opacity={0.7} />
          <text x={s.x + 40} y={70} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">{s.label}</text>
          <text x={s.x + 40} y={80} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">{s.sub}</text>

          {/* 화살표 (마지막 제외) */}
          {i < stages.length - 1 && (
            <motion.line
              x1={s.x + 84} y1={68} x2={stages[i + 1].x - 4} y2={68}
              stroke={s.color} strokeWidth={0.8} markerEnd="url(#ptArr2)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.2 }}
            />
          )}
        </motion.g>
      ))}

      {/* 최종 결과 */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring' }}>
        <circle cx={390} cy={68} r={14}
          fill="#10b981" opacity={0.15} />
        <circle cx={390} cy={68} r={14}
          fill="none" stroke="#10b981" strokeWidth={1.2} />
        <text x={390} y={73} textAnchor="middle" fontSize={14}
          fontWeight={700} fill="#10b981">{'✓'}</text>
        <text x={424} y={64} fontSize={7} fill="var(--foreground)">검증 완료</text>
        <text x={424} y={74} fontSize={7} fill="var(--muted-foreground)">~0.5ms</text>
      </motion.g>

      {/* ── 구분선 ── */}
      <motion.line x1={12} y1={100} x2={468} y2={100}
        stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.3, duration: 0.3 }} />
      <motion.text x={240} y={112} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        vs
      </motion.text>

      {/* ── Reth 경로 (짧음) ── */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}>
        <text x={12} y={130} fontSize={8}
          fontWeight={700} fill="#ef4444">
          Reth (풀 노드)
        </text>

        {/* DB 직접 읽기 */}
        <ModuleBox x={12} y={138} w={100} h={36}
          label="StateProvider" sub="DB 직접 읽기" color="#ef4444" />

        <motion.line x1={116} y1={156} x2={148} y2={156}
          stroke="#ef4444" strokeWidth={1} markerEnd="url(#ptArr2)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.7, duration: 0.2 }} />

        {/* DB */}
        <rect x={152} y={142} width={80} height={28} rx={6}
          fill="var(--card)" stroke="#ef4444" strokeWidth={0.6} />
        <text x={192} y={158} textAnchor="middle" fontSize={8}
          fill="var(--foreground)">MDBX</text>
        <text x={192} y={168} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">700GB+</text>

        <motion.line x1={236} y1={156} x2={268} y2={156}
          stroke="#ef4444" strokeWidth={1} markerEnd="url(#ptArr2)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.8, duration: 0.2 }} />

        {/* 결과 */}
        <text x={280} y={152} fontSize={9}
          fontWeight={600} fill="#ef4444">값 반환</text>
        <text x={280} y={164} fontSize={7}
          fill="var(--muted-foreground)">~0.1ms / 증명 불필요</text>
      </motion.g>

      {/* ── 비교 요약 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2 }}>
        <rect x={320} y={128} width={150} height={50} rx={6}
          fill="var(--card)" stroke={C.pipeline} strokeWidth={0.5} />
        <text x={395} y={144} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.pipeline}>트레이드오프</text>
        <text x={330} y={158} fontSize={7}
          fill="var(--foreground)">Helios: 저장 0, 증명 필요</text>
        <text x={330} y={170} fontSize={7}
          fill="var(--foreground)">Reth: 700GB 저장, 직접 읽기</text>
      </motion.g>
    </g>
  );
}
