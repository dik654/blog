import { motion } from 'framer-motion';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './UpdateTraceVizData';

/** Step 0: 슬롯 순서 검사 — 타임라인에 3 슬롯 배치 */
export function Step0() {
  const y = 80;
  const slots = [
    { x: 40,  label: 'finalized', sub: 'slot 8000000', value: 8000000 },
    { x: 180, label: 'attested',  sub: 'slot 8000032', value: 8000032 },
    { x: 320, label: 'signature', sub: 'slot 8000033', value: 8000033 },
  ];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.slot}>
        validate_update() — 슬롯 순서 검사
      </text>

      {/* 타임라인 축 */}
      <motion.line
        x1={30} y1={y + 42} x2={450} y2={y + 42}
        stroke="var(--border)" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <text x={455} y={y + 46} fontSize={7} fill="var(--muted-foreground)">시간 →</text>

      {/* 3개 슬롯 */}
      {slots.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.25 }}>
          <DataBox x={s.x} y={y - 10} w={120} h={30}
            label={`${s.label}_header`} sub={s.sub} color={C.slot} />
          {/* 타임라인 위 점 */}
          <circle cx={s.x + 60} cy={y + 42} r={4} fill={C.slot} />
        </motion.g>
      ))}

      {/* 부등호 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        <text x={155} y={y + 58} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={C.slot}>{'<'}</text>
        <text x={295} y={y + 58} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={C.slot}>{'<'}</text>
      </motion.g>

      {/* 유효 판정 */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}>
        <circle cx={440} cy={y} r={12}
          fill={C.slot} opacity={0.15} />
        <circle cx={440} cy={y} r={12}
          fill="none" stroke={C.slot} strokeWidth={1} />
        <text x={440} y={y + 5} textAnchor="middle" fontSize={14}
          fontWeight={700} fill={C.slot}>{'✓'}</text>
      </motion.g>

      {/* 역순 공격 경고 */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}>
        <rect x={80} y={152} width={320} height={32} rx={8}
          fill="var(--card)" stroke={C.slot} strokeWidth={0.5} />
        <text x={240} y={166} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.slot}>
          역순이면 거부 — 미래 슬롯 서명 공격 방지
        </text>
        <text x={240} y={178} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          signature_slot {'<='} attested_header.slot → Err("sig slot too old")
        </text>
      </motion.g>

      {/* 화살표 마커 */}
      <defs>
        <marker id="utArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.slot} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: BLS 서명 검증 — verify 함수 참조 파이프라인 */
export function Step1() {
  const y = 60;
  const stages = [
    { x: 10,  label: 'bits',    sub: '512비트',   color: '#6366f1' },
    { x: 105, label: 'filter',  sub: '→ ~486 pk', color: '#6366f1' },
    { x: 200, label: 'agg_pk',  sub: 'G1 합산',   color: '#8b5cf6' },
    { x: 295, label: 'root',    sub: '도메인분리', color: '#f59e0b' },
    { x: 390, label: 'pairing', sub: 'GT 비교',   color: '#06b6d4' },
  ];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.bls}>
        verify_sync_committee_sig() — BLS 검증
      </text>

      <motion.text x={240} y={38} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}>
        helios-consensus VerifyTrace의 5단계와 동일
      </motion.text>

      {/* 5 stage 파이프라인 */}
      {stages.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.18 }}>
          <rect x={s.x} y={y} width={80} height={36} rx={7}
            fill="var(--card)" stroke={s.color} strokeWidth={1} />
          <rect x={s.x} y={y} width={80} height={4.5} rx={4}
            fill={s.color} opacity={0.7} />
          <text x={s.x + 40} y={y + 22} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">{s.label}</text>
          <text x={s.x + 40} y={y + 33} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">{s.sub}</text>

          {/* 화살표 (마지막 제외) */}
          {i < stages.length - 1 && (
            <motion.line
              x1={s.x + 83} y1={y + 18} x2={stages[i + 1].x - 3} y2={y + 18}
              stroke={s.color} strokeWidth={1}
              markerEnd={`url(#utPipe${i})`}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.2 + i * 0.18 + 0.1, duration: 0.2 }}
            />
          )}
        </motion.g>
      ))}

      {/* 수식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        <rect x={80} y={110} width={320} height={28} rx={8}
          fill="var(--card)" stroke={C.bls} strokeWidth={0.5} />
        <text x={240} y={128} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.bls}>
          e(agg_pk, H(m)) == e(G, sig) → 서명 유효
        </text>
      </motion.g>

      {/* 하단 비교 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        <text x={240} y={160} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          Reth: 블록 실행으로 검증 (수 초) | Helios: 페어링 1회 (~3ms)
        </text>
      </motion.g>

      {/* BLS 결과 */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring' }}>
        <text x={240} y={185} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.bls}>
          검증 실패 → Err("BLS verify failed") — Update 거부
        </text>
      </motion.g>

      {/* 화살표 마커 */}
      <defs>
        {stages.map((s, i) => (
          <marker key={i} id={`utPipe${i}`} viewBox="0 0 10 10"
            refX={9} refY={5} markerWidth={5} markerHeight={5}
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={s.color} />
          </marker>
        ))}
      </defs>
    </g>
  );
}

/** Step 2: finalized_header 교체 — 슬롯 비교 + 교체 애니메이션 */
export function Step2() {
  const storeY = 55;
  const updateY = 120;

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.finalized}>
        apply_update() — finalized_header 갱신
      </text>

      {/* Store 현재 상태 */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <rect x={20} y={storeY - 14} width={8} height={52} rx={4}
          fill={C.finalized} opacity={0.6} />
        <text x={38} y={storeY - 2} fontSize={8} fontWeight={600}
          fill="var(--foreground)">Store (현재)</text>
        <DataBox x={38} y={storeY + 4} w={160} h={28}
          label="finalized_header" sub="slot 8000000" color={C.finalized} />
      </motion.g>

      {/* Update 수신값 */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}>
        <rect x={20} y={updateY - 14} width={8} height={52} rx={4}
          fill={C.slot} opacity={0.6} />
        <text x={38} y={updateY - 2} fontSize={8} fontWeight={600}
          fill="var(--foreground)">Update (수신)</text>
        <DataBox x={38} y={updateY + 4} w={160} h={28}
          label="finalized_header" sub="slot 8000064" color={C.slot} />
      </motion.g>

      {/* 비교 화살표 */}
      <motion.line x1={200} y1={storeY + 18} x2={240} y2={storeY + 40}
        stroke={C.finalized} strokeWidth={1} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }} />
      <motion.line x1={200} y1={updateY + 18} x2={240} y2={updateY - 6}
        stroke={C.slot} strokeWidth={1} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }} />

      {/* 비교 결과 */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}>
        <ActionBox x={245} y={storeY + 26} w={110} h={34}
          label="슬롯 비교" sub="8000064 > 8000000" color={C.finalized} />
      </motion.g>

      {/* 교체 결과 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}>
        <motion.line x1={358} y1={storeY + 43} x2={388} y2={storeY + 43}
          stroke={C.finalized} strokeWidth={1.2}
          markerEnd="url(#utFinArrow)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }} />
        <DataBox x={392} y={storeY + 28} w={75} h={30}
          label="교체" sub="slot 8000064" color={C.finalized} />
      </motion.g>

      {/* 하단 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}>
        <text x={240} y={186} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.finalized}>
          finalized = 되돌릴 수 없음 (2/3 stake, ~100억$ 슬래싱 비용)
        </text>
      </motion.g>

      <defs>
        <marker id="utFinArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.finalized} />
        </marker>
      </defs>
    </g>
  );
}
