import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── arrow marker defs (재사용) ── */
function ArrowDefs() {
  return (
    <defs>
      <marker id="ovArrowReth" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reth} />
      </marker>
      <marker id="ovArrowHelios" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.helios} />
      </marker>
      <marker id="ovArrowVerify" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.verify} />
      </marker>
      <marker id="ovArrowRpc" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rpc} />
      </marker>
      <marker id="ovArrowCache" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.cache} />
      </marker>
    </defs>
  );
}

/* ── Step 0: Reth MDBX vs Helios ProofDB flow ─────────── */
export function Step0() {
  const rethY = 28;
  const heliosY = 120;

  return (
    <g>
      <ArrowDefs />

      {/* ── Reth 경로 (위) ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* 라벨 */}
        <rect x={6} y={rethY - 8} width={48} height={16} rx={8}
          fill={C.reth} opacity={0.15} />
        <text x={30} y={rethY + 3} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.reth}>Reth</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}>
        <ModuleBox x={66} y={rethY - 12} w={80} h={40} label="revm (EVM)" sub="실행 엔진" color={C.reth} />
      </motion.g>

      {/* 화살표: EVM → StateProvider */}
      <motion.line x1={148} y1={rethY + 8} x2={178} y2={rethY + 8}
        stroke={C.reth} strokeWidth={1.2}
        markerEnd="url(#ovArrowReth)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}>
        <ActionBox x={180} y={rethY - 10} w={90} h={36} label="StateProvider" sub="Database trait" color={C.reth} />
      </motion.g>

      {/* 화살표: StateProvider → MDBX */}
      <motion.line x1={272} y1={rethY + 8} x2={302} y2={rethY + 8}
        stroke={C.reth} strokeWidth={1.2}
        markerEnd="url(#ovArrowReth)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}>
        {/* MDBX 실린더 표현 */}
        <rect x={304} y={rethY - 10} width={80} height={36} rx={6}
          fill="var(--card)" stroke={C.reth} strokeWidth={0.8} />
        <ellipse cx={344} cy={rethY - 6} rx={38} ry={5}
          fill={C.reth} opacity={0.12} stroke={C.reth} strokeWidth={0.5} />
        <text x={344} y={rethY + 10} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C.reth}>MDBX</text>
        <text x={344} y={rethY + 22} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">700GB+ 디스크</text>
      </motion.g>

      {/* 결과 값 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <motion.line x1={386} y1={rethY + 8} x2={416} y2={rethY + 8}
          stroke={C.reth} strokeWidth={1.2}
          markerEnd="url(#ovArrowReth)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.7, duration: 0.25 }} />
        <DataBox x={418} y={rethY - 4} w={52} h={26} label="값" color={C.reth} />
      </motion.g>

      {/* ── 구분선 ── */}
      <motion.line x1={20} y1={82} x2={460} y2={82}
        stroke="var(--border)" strokeWidth={0.8} strokeDasharray="6 4"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
        transition={{ delay: 0.4 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={170} y={74} width={140} height={16} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={85} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          동일한 Database trait 인터페이스
        </text>
      </motion.g>

      {/* ── Helios 경로 (아래) ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <rect x={6} y={heliosY - 6} width={52} height={16} rx={8}
          fill={C.helios} opacity={0.15} />
        <text x={32} y={heliosY + 5} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.helios}>Helios</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}>
        <ModuleBox x={66} y={heliosY - 10} w={80} h={40} label="revm (EVM)" sub="동일 엔진" color={C.helios} />
      </motion.g>

      {/* 화살표: EVM → ProofDB */}
      <motion.line x1={148} y1={heliosY + 10} x2={178} y2={heliosY + 10}
        stroke={C.helios} strokeWidth={1.2}
        markerEnd="url(#ovArrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.55, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <ActionBox x={180} y={heliosY - 8} w={78} h={36} label="ProofDB" sub="가상 DB" color={C.helios} />
      </motion.g>

      {/* 화살표: ProofDB → RPC */}
      <motion.line x1={260} y1={heliosY + 10} x2={284} y2={heliosY + 10}
        stroke={C.rpc} strokeWidth={1.2}
        markerEnd="url(#ovArrowRpc)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.25 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}>
        <AlertBox x={286} y={heliosY - 10} w={62} h={40} label="RPC" sub="신뢰 불가" color={C.danger} />
      </motion.g>

      {/* 화살표: RPC → 증명 검증 */}
      <motion.line x1={350} y1={heliosY + 10} x2={370} y2={heliosY + 10}
        stroke={C.verify} strokeWidth={1.2}
        markerEnd="url(#ovArrowVerify)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.85, duration: 0.25 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        <ActionBox x={372} y={heliosY - 8} w={58} h={36} label="MPT 검증" color={C.verify} />
      </motion.g>

      {/* 결과 값 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.05 }}>
        <motion.line x1={432} y1={heliosY + 10} x2={448} y2={heliosY + 10}
          stroke={C.verify} strokeWidth={1.2}
          markerEnd="url(#ovArrowVerify)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.05, duration: 0.2 }} />
        <DataBox x={418} y={heliosY - 2} w={52} h={26} label="값" color={C.verify} />
      </motion.g>

      {/* 하단 핵심 */}
      <motion.text x={240} y={178} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2 }}>
        EVM 코드 동일 — DB 레이어만 교체하면 무상태 실행
      </motion.text>
    </g>
  );
}

/* ── Step 1: ProofDB lazy loading ──────────────────── */
export function Step1() {
  const y1 = 24;   // 첫 접근 행
  const y2 = 120;  // 이후 접근 행

  return (
    <g>
      <ArrowDefs />

      {/* ── 첫 번째 접근 (위) ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x={6} y={y1 - 4} width={70} height={14} rx={7}
          fill={C.helios} opacity={0.12} />
        <text x={41} y={y1 + 6} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.helios}>첫 번째 접근</text>
      </motion.g>

      {/* EVM이 basic_account(addr) 호출 */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <ModuleBox x={10} y={y1 + 18} w={74} h={40} label="EVM" sub="basic(addr)" color={C.helios} />
      </motion.g>

      {/* 화살표 1: EVM → ProofDB */}
      <motion.line x1={86} y1={y1 + 38} x2={108} y2={y1 + 38}
        stroke={C.helios} strokeWidth={1.2} markerEnd="url(#ovArrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.25, duration: 0.25 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <ActionBox x={110} y={y1 + 18} w={74} h={40} label="ProofDB" sub="캐시 miss" color={C.helios} />
      </motion.g>

      {/* 화살표 2: ProofDB → RPC (get_proof) */}
      <motion.line x1={186} y1={y1 + 38} x2={208} y2={y1 + 38}
        stroke={C.rpc} strokeWidth={1.2} markerEnd="url(#ovArrowRpc)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.45, duration: 0.25 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <ModuleBox x={210} y={y1 + 18} w={80} h={40} label="RPC" sub="eth_getProof" color={C.rpc} />
      </motion.g>

      {/* 화살표 3: RPC → MPT 검증 */}
      <motion.line x1={292} y1={y1 + 38} x2={312} y2={y1 + 38}
        stroke={C.verify} strokeWidth={1.2} markerEnd="url(#ovArrowVerify)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.65, duration: 0.25 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <ActionBox x={314} y={y1 + 18} w={68} h={40} label="MPT 검증" sub="state root" color={C.verify} />
      </motion.g>

      {/* 화살표 4: 검증 → 캐시 저장 */}
      <motion.line x1={384} y1={y1 + 38} x2={406} y2={y1 + 38}
        stroke={C.cache} strokeWidth={1.2} markerEnd="url(#ovArrowCache)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.85, duration: 0.25 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        <DataBox x={408} y={y1 + 24} w={62} h={28} label="캐시 저장" color={C.cache} />
      </motion.g>

      {/* ── 구분선 + 라벨 ── */}
      <motion.line x1={20} y1={y1 + 80} x2={460} y2={y1 + 80}
        stroke="var(--border)" strokeWidth={0.8} strokeDasharray="6 4"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ delay: 0.6 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <rect x={175} y={y1 + 72} width={130} height={16} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={y1 + 83} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          같은 주소 두 번째 접근
        </text>
      </motion.g>

      {/* ── 두 번째 접근 (아래) — 캐시 히트, 짧은 경로 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <rect x={6} y={y2 - 2} width={70} height={14} rx={7}
          fill={C.cache} opacity={0.12} />
        <text x={41} y={y2 + 8} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.cache}>이후 접근</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}>
        <ModuleBox x={10} y={y2 + 16} w={74} h={40} label="EVM" sub="basic(addr)" color={C.cache} />
      </motion.g>

      {/* 화살표: EVM → ProofDB */}
      <motion.line x1={86} y1={y2 + 36} x2={108} y2={y2 + 36}
        stroke={C.cache} strokeWidth={1.2} markerEnd="url(#ovArrowCache)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.0, duration: 0.25 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.05 }}>
        <ActionBox x={110} y={y2 + 16} w={74} h={40} label="ProofDB" sub="캐시 hit!" color={C.cache} />
      </motion.g>

      {/* 즉시 반환 — 긴 화살표 */}
      <motion.line x1={186} y1={y2 + 36} x2={268} y2={y2 + 36}
        stroke={C.cache} strokeWidth={1.5} markerEnd="url(#ovArrowCache)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.15, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.25 }}>
        <DataBox x={270} y={y2 + 22} w={68} h={28} label="즉시 반환" color={C.cache} />
      </motion.g>

      {/* "RPC 없음" 표시 — 취소선 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}>
        <rect x={360} y={y2 + 20} width={100} height={32} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={410} y={y2 + 34} textAnchor="middle"
          fontSize={8} fill="var(--muted-foreground)" textDecoration="line-through">RPC 왕복</text>
        <text x={410} y={y2 + 46} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.cache}>불필요</text>
      </motion.g>

      {/* 하단 핵심 */}
      <motion.text x={240} y={190} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
        transition={{ delay: 1.4 }}>
        EVM이 접근하는 주소만 증명 요청 — 불필요한 네트워크 비용 제거
      </motion.text>
    </g>
  );
}

/* ── Step 2: revm 빌더 패턴 ────────────────────────── */
export function Step2() {
  /* 3단계 빌더: new DB → build EVM → transact */
  const stages = [
    {
      label: '1. ProofDB 생성',
      code: 'ProofDB::new(rpc, block)',
      desc: 'RPC + 블록 태그만으로 가상 DB',
      color: C.helios,
      y: 20,
    },
    {
      label: '2. EVM 빌드',
      code: 'Evm::builder().with_db(db).build()',
      desc: 'ProofDB를 DB로 주입',
      color: C.reth,
      y: 78,
    },
    {
      label: '3. 실행',
      code: 'evm.transact()',
      desc: '로컬 실행 → 결과 반환',
      color: C.verify,
      y: 136,
    },
  ];

  return (
    <g>
      <ArrowDefs />

      {/* 좌측: 빌더 패턴 3단계 */}
      {stages.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.25 }}>

          {/* 카드 배경 */}
          <rect x={20} y={s.y} width={210} height={46} rx={8}
            fill="var(--card)" stroke={s.color} strokeWidth={0.8} />
          {/* 좌측 액센트 */}
          <defs>
            <clipPath id={`ovBuilderClip${i}`}>
              <rect x={20} y={s.y} width={210} height={46} rx={8} />
            </clipPath>
          </defs>
          <rect x={20} y={s.y} width={4} height={46}
            fill={s.color} clipPath={`url(#ovBuilderClip${i})`} />

          {/* 라벨 */}
          <text x={34} y={s.y + 17} fontSize={9} fontWeight={700}
            fill={s.color}>{s.label}</text>

          {/* 코드 배경 */}
          <rect x={34} y={s.y + 23} width={186} height={16} rx={3}
            fill="var(--foreground)" opacity={0.06} />
          <text x={40} y={s.y + 34} fontSize={8} fontFamily="monospace"
            fill="var(--foreground)">{s.code}</text>

          {/* 단계 간 화살표 */}
          {i < 2 && (
            <motion.line
              x1={125} y1={s.y + 48} x2={125} y2={s.y + 58}
              stroke={stages[i + 1].color} strokeWidth={1.2}
              markerEnd={`url(#ovArrow${['Helios', 'Reth', 'Verify'][i + 1]})`}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: (i + 1) * 0.25 - 0.1, duration: 0.2 }} />
          )}
        </motion.g>
      ))}

      {/* 우측: Reth vs Helios 대비 — 코드가 동일함을 강조 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={258} y={20} width={200} height={162} rx={10}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
        <text x={358} y={42} textAnchor="middle" fontSize={10}
          fontWeight={700} fill="var(--foreground)">코드 비교</text>

        {/* Reth 쪽 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}>
          <rect x={270} y={52} width={176} height={48} rx={6}
            fill="var(--card)" stroke={C.reth} strokeWidth={0.6} />
          <defs>
            <clipPath id="ovRethClip">
              <rect x={270} y={52} width={176} height={48} rx={6} />
            </clipPath>
          </defs>
          <rect x={270} y={52} width={176} height={5}
            fill={C.reth} opacity={0.7} clipPath="url(#ovRethClip)" />
          <text x={280} y={72} fontSize={8} fontWeight={600} fill={C.reth}>Reth</text>
          <rect x={310} y={63} width={128} height={14} rx={3}
            fill="var(--foreground)" opacity={0.06} />
          <text x={316} y={73} fontSize={7.5} fontFamily="monospace"
            fill="var(--foreground)">MDBX::open(path)</text>
          <text x={280} y={92} fontSize={7} fill="var(--muted-foreground)">
            로컬 디스크 DB → 700GB+
          </text>
        </motion.g>

        {/* Helios 쪽 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}>
          <rect x={270} y={110} width={176} height={48} rx={6}
            fill="var(--card)" stroke={C.helios} strokeWidth={0.6} />
          <defs>
            <clipPath id="ovHeliosClip">
              <rect x={270} y={110} width={176} height={48} rx={6} />
            </clipPath>
          </defs>
          <rect x={270} y={110} width={176} height={5}
            fill={C.helios} opacity={0.7} clipPath="url(#ovHeliosClip)" />
          <text x={280} y={130} fontSize={8} fontWeight={600} fill={C.helios}>Helios</text>
          <rect x={310} y={121} width={128} height={14} rx={3}
            fill="var(--foreground)" opacity={0.06} />
          <text x={316} y={131} fontSize={7.5} fontFamily="monospace"
            fill="var(--foreground)">ProofDB::new(rpc, blk)</text>
          <text x={280} y={150} fontSize={7} fill="var(--muted-foreground)">
            증명 기반 가상 DB → 0 디스크
          </text>
        </motion.g>

        {/* 가운데 "=" 표시 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}>
          <rect x={348} y={99} width={20} height={14} rx={7}
            fill="var(--foreground)" opacity={0.08} />
          <text x={358} y={109} textAnchor="middle" fontSize={9}
            fontWeight={700} fill="var(--foreground)">{'='}</text>
        </motion.g>

        <motion.text x={358} y={172} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2 }}>
          with_db() 이후 코드는 완전히 동일
        </motion.text>
      </motion.g>
    </g>
  );
}
