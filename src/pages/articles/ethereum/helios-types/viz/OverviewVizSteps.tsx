import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── Step 0: CL 타입 vs EL 타입 비교 ─────────────── */
export function Step0() {
  const clFields = [
    { label: 'slot', size: '8B' },
    { label: 'proposer_index', size: '8B' },
    { label: 'parent_root', size: '32B' },
    { label: 'state_root', size: '32B' },
    { label: 'body_root', size: '32B' },
  ];

  const elFields = [
    { label: 'parent_hash' },
    { label: 'beneficiary' },
    { label: 'state_root' },
    { label: 'tx_root' },
    { label: 'receipts_root' },
    { label: 'gas_limit' },
    { label: 'gas_used' },
    { label: 'timestamp' },
    { label: 'base_fee' },
    { label: '... +6 more' },
  ];

  return (
    <g>
      {/* ── 좌측: CL 타입 영역 ── */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}>
        {/* CL 배경 카드 */}
        <rect x={10} y={8} width={220} height={184} rx={10}
          fill="var(--card)" stroke={C.cl} strokeWidth={1} />
        <rect x={10} y={8} width={220} height={22} rx={0}
          fill={C.cl} opacity={0.12}
          clipPath="url(#ovClClip)" />
        <defs>
          <clipPath id="ovClClip"><rect x={10} y={8} width={220} height={184} rx={10} /></clipPath>
        </defs>

        <text x={24} y={24} fontSize={10} fontWeight={700} fill={C.cl}>
          CL 타입 (합의 레이어)
        </text>
        <text x={218} y={24} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">
          SSZ 인코딩
        </text>

        {/* BeaconBlockHeader 구조체 */}
        <rect x={22} y={36} width={196} height={16} rx={4}
          fill={C.cl} opacity={0.08} />
        <text x={30} y={48} fontSize={8} fontWeight={600} fill={C.cl}>
          BeaconBlockHeader
        </text>
        <text x={210} y={48} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">
          112B 고정
        </text>

        {/* 5개 필드 */}
        {clFields.map((f, i) => (
          <motion.g key={f.label}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}>
            <rect x={26} y={56 + i * 18} width={188} height={14} rx={3}
              fill="var(--card)" stroke={f.label === 'state_root' ? C.cl : 'var(--border)'}
              strokeWidth={f.label === 'state_root' ? 1.2 : 0.4} />
            <text x={34} y={66 + i * 18} fontSize={8} fontWeight={f.label === 'state_root' ? 700 : 500}
              fill={f.label === 'state_root' ? C.cl : 'var(--foreground)'}>{f.label}</text>
            <text x={208} y={66 + i * 18} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">{f.size}</text>
          </motion.g>
        ))}

        {/* state_root 강조 화살표 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <line x1={216} y1={117} x2={222} y2={117}
            stroke={C.cl} strokeWidth={1} />
          <text x={224} y={114} fontSize={7} fontWeight={600} fill={C.cl}>
            모든 증명의
          </text>
          <text x={224} y={123} fontSize={7} fontWeight={600} fill={C.cl}>
            기준점
          </text>
        </motion.g>

        {/* 추가 CL 타입들 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <DataBox x={22} y={152} w={92} h={28} label="SyncAggregate" sub="서명 참여" color={C.cl} />
          <DataBox x={120} y={152} w={100} h={28} label="LightClientUpdate" sub="동기화 메시지" color={C.cl} />
        </motion.g>
      </motion.g>

      {/* ── 우측: EL 타입 영역 ── */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}>
        {/* EL 배경 카드 */}
        <rect x={250} y={8} width={220} height={184} rx={10}
          fill="var(--card)" stroke={C.el} strokeWidth={1} />
        <rect x={250} y={8} width={220} height={22} rx={0}
          fill={C.el} opacity={0.12}
          clipPath="url(#ovElClip)" />
        <defs>
          <clipPath id="ovElClip"><rect x={250} y={8} width={220} height={184} rx={10} /></clipPath>
        </defs>

        <text x={264} y={24} fontSize={10} fontWeight={700} fill={C.el}>
          EL 타입 (실행 레이어)
        </text>
        <text x={458} y={24} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">
          RLP 인코딩
        </text>

        {/* Header 구조체 */}
        <rect x={262} y={36} width={196} height={16} rx={4}
          fill={C.el} opacity={0.08} />
        <text x={270} y={48} fontSize={8} fontWeight={600} fill={C.el}>
          Header
        </text>
        <text x={450} y={48} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">
          15필드, 가변 크기
        </text>

        {/* 10개 필드 (압축) */}
        {elFields.map((f, i) => (
          <motion.g key={f.label}
            initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.04 }}>
            <rect x={266} y={56 + i * 13} width={188} height={10} rx={2}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
            <text x={272} y={64 + i * 13} fontSize={7}
              fill="var(--foreground)">{f.label}</text>
          </motion.g>
        ))}

        {/* Reth/alloy 처리 표시 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <rect x={262} y={164} width={196} height={20} rx={6}
            fill={C.el} opacity={0.08} stroke={C.el} strokeWidth={0.5}
            strokeDasharray="4 3" />
          <text x={360} y={178} textAnchor="middle" fontSize={8}
            fill={C.el} fontWeight={600}>Reth / alloy가 처리</text>
        </motion.g>
      </motion.g>

      {/* ── 하단 비교 요약 ── */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}>
        <text x={120} y={200} textAnchor="middle" fontSize={7}
          fill={C.cl} fontWeight={600}>Helios 직접 관리</text>
        <text x={360} y={200} textAnchor="middle" fontSize={7}
          fill={C.el} fontWeight={600}>alloy 라이브러리 위임</text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Helios 데이터 흐름 — CL → 검증 → EL ── */
export function Step1() {
  /* CL 데이터 */
  const clData = [
    { label: 'header', sub: 'slot + roots' },
    { label: 'committee', sub: '512 공개키' },
    { label: 'sync_aggregate', sub: 'BLS 서명' },
  ];

  /* EL 데이터 */
  const elData = [
    { label: 'account', sub: 'balance, nonce' },
    { label: 'storage', sub: 'contract state' },
  ];

  return (
    <g>
      {/* 화살표 마커 */}
      <defs>
        <marker id="ovArrowCl" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.cl} />
        </marker>
        <marker id="ovArrowV" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.verify} />
        </marker>
        <marker id="ovArrowB" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.bridge} />
        </marker>
      </defs>

      {/* ── 단계 1: CL 데이터 (좌) ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}>
        <ModuleBox x={10} y={10} w={108} h={42} label="Beacon API" sub="CL 노드 응답" color={C.cl} />

        {clData.map((d, i) => (
          <motion.g key={d.label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}>
            <DataBox x={14} y={62 + i * 38} w={100} h={30} label={d.label} sub={d.sub} color={C.cl} />
          </motion.g>
        ))}
      </motion.g>

      {/* ── 단계 2: 검증 (중앙) ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}>
        {/* 검증 영역 배경 */}
        <rect x={148} y={28} width={130} height={150} rx={10}
          fill={C.verify} opacity={0.04} stroke={C.verify} strokeWidth={0.8}
          strokeDasharray="4 3" />
        <text x={213} y={46} textAnchor="middle" fontSize={9} fontWeight={700}
          fill={C.verify}>검증 단계</text>

        {/* 3개 검증 액션 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}>
          <ActionBox x={158} y={54} w={110} h={30} label="BLS 서명 검증" sub="2/3 위원회 서명" color={C.verify} />
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}>
          <ActionBox x={158} y={92} w={110} h={30} label="헤더 갱신" sub="finalized 진행" color={C.verify} />
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}>
          <ActionBox x={158} y={130} w={110} h={30} label="Merkle 증명" sub="state_root 기준" color={C.verify} />
        </motion.g>

        {/* 내부 수직 화살표 */}
        <motion.line x1={213} y1={85} x2={213} y2={91}
          stroke={C.verify} strokeWidth={1} markerEnd="url(#ovArrowV)"
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: 0.7 }} />
        <motion.line x1={213} y1={123} x2={213} y2={129}
          stroke={C.verify} strokeWidth={1} markerEnd="url(#ovArrowV)"
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }} />
      </motion.g>

      {/* ── CL → 검증 화살표 ── */}
      <motion.path d="M 116 78 L 155 70"
        stroke={C.cl} strokeWidth={1.2} fill="none" markerEnd="url(#ovArrowCl)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }} />
      <motion.path d="M 116 112 L 155 108"
        stroke={C.cl} strokeWidth={1.2} fill="none" markerEnd="url(#ovArrowCl)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.55, duration: 0.3 }} />
      <motion.path d="M 116 146 L 155 145"
        stroke={C.cl} strokeWidth={1.2} fill="none" markerEnd="url(#ovArrowCl)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }} />

      {/* ── 단계 3: EL 데이터 (우) ── */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}>
        <ModuleBox x={318} y={10} w={108} h={42} label="EL 상태" sub="Reth / alloy" color={C.el} />

        {elData.map((d, i) => (
          <motion.g key={d.label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1 }}>
            <DataBox x={326} y={72 + i * 42} w={92} h={30} label={d.label} sub={d.sub} color={C.el} />
          </motion.g>
        ))}
      </motion.g>

      {/* ── 검증 → EL 화살표 ── */}
      <motion.path d="M 270 145 L 322 100"
        stroke={C.bridge} strokeWidth={1.2} fill="none" markerEnd="url(#ovArrowB)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.95, duration: 0.3 }} />

      {/* state_root 연결 라벨 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}>
        <rect x={282} y={118} width={58} height={14} rx={4}
          fill="var(--card)" stroke={C.bridge} strokeWidth={0.5} />
        <text x={311} y={128} textAnchor="middle" fontSize={7}
          fontWeight={600} fill={C.bridge}>state_root</text>
      </motion.g>

      {/* ── 하단 흐름 요약 ── */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}>
        <rect x={100} y={182} width={280} height={16} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={193} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">
          CL 타입으로 추적 → 수학으로 검증 → EL 상태 접근
        </text>
      </motion.g>
    </g>
  );
}
