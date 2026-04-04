import { motion } from 'framer-motion';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './VerifyTraceVizData';

/** Step 3: signing_root 계산 — 3단계 합성 과정 */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.root}>
        signing_root 계산: 도메인 분리 + SSZ 해시
      </text>

      {/* ── 상단 경로: header → object_root ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0 }}>
        <DataBox x={14} y={30} w={92} h={28} label="header" sub="slot, root" color={C.root} />
      </motion.g>

      <motion.line x1={110} y1={44} x2={146} y2={44}
        stroke={C.root} strokeWidth={1} markerEnd="url(#vtArrowR)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }} />
      <motion.text x={128} y={38} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        SSZ
      </motion.text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <ActionBox x={150} y={28} w={105} h={32}
          label="hash_tree_root" sub="SSZ 해시" color={C.root} />
      </motion.g>

      <motion.line x1={258} y1={44} x2={294} y2={44}
        stroke={C.root} strokeWidth={1} markerEnd="url(#vtArrowR)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}>
        <DataBox x={298} y={30} w={108} h={28} label="object_root" sub="32B" color={C.root} />
      </motion.g>

      {/* ── 중단 경로: 도메인 구성 요소 → domain ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        {/* 3개 구성 요소 */}
        <rect x={14} y={78} width={80} height={22} rx={4}
          fill="var(--card)" stroke={C.root} strokeWidth={0.6} />
        <text x={54} y={93} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={C.root}>DOMAIN_SYNC</text>
        <text x={54} y={76} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">0x07000000</text>

        <rect x={102} y={78} width={76} height={22} rx={4}
          fill="var(--card)" stroke={C.root} strokeWidth={0.6} />
        <text x={140} y={93} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={C.root}>fork_version</text>
        <text x={140} y={76} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">0x04 (Deneb)</text>

        <rect x={186} y={78} width={80} height={22} rx={4}
          fill="var(--card)" stroke={C.root} strokeWidth={0.6} />
        <text x={226} y={93} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={C.root}>genesis_root</text>
        <text x={226} y={76} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">[:28]</text>
      </motion.g>

      {/* 도메인 합성 화살표 */}
      <motion.line x1={275} y1={89} x2={304} y2={89}
        stroke={C.root} strokeWidth={1} markerEnd="url(#vtArrowR)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}>
        <DataBox x={308} y={76} w={86} h={26} label="domain" sub="32B" color={C.root} />
      </motion.g>

      {/* ── 하단: object_root + domain → signing_root ── */}
      {/* 두 결과가 합쳐지는 수직선 */}
      <motion.line x1={352} y1={60} x2={352} y2={120}
        stroke={C.root} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.4}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.3 }} />

      <motion.line x1={352} y1={120} x2={270} y2={144}
        stroke={C.root} strokeWidth={1} markerEnd="url(#vtArrowR)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.1, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        <ActionBox x={148} y={130} w={118} h={32}
          label="hash_tree_root" sub="SigningData{}" color={C.root} />
      </motion.g>

      <motion.line x1={144} y1={146} x2={110} y2={146}
        stroke={C.root} strokeWidth={1} markerEnd="url(#vtArrowL)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.35, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}>
        <DataBox x={10} y={132} w={96} h={28} label="signing_root" sub="32B" color={C.root} />
      </motion.g>

      {/* 우측 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}>
        <text x={240} y={186} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.root}>
          도메인 분리 → 서명 재사용 방지 (3중 보호)
        </text>
      </motion.g>

      {/* 화살표 마커 정의 */}
      <defs>
        <marker id="vtArrowR" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.root} />
        </marker>
        <marker id="vtArrowL" viewBox="0 0 10 10" refX={1} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 10 0 L 0 5 L 10 10 z" fill={C.root} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 4: 페어링 비교 — 두 경로가 GT에서 만남 */
export function Step4() {
  const midY = 100;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.pairing}>
        페어링 비교: e(agg_pk, H(m)) == e(G, sig)
      </text>

      {/* ── 상단 경로: agg_pk + H(m) → lhs ── */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}>
        <DataBox x={16} y={32} w={80} h={26} label="agg_pk" sub="G1" color="#8b5cf6" />
      </motion.g>
      <motion.text x={56} y={66} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        (Σ pk_i)
      </motion.text>

      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <DataBox x={120} y={32} w={80} h={26} label="H(m)" sub="G2" color="#f59e0b" />
      </motion.g>
      <motion.text x={160} y={66} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        hash_to_g2(root)
      </motion.text>

      {/* 상단 pairing 화살표 */}
      <motion.line x1={204} y1={45} x2={268} y2={midY - 8}
        stroke={C.pairing} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }} />
      <motion.line x1={100} y1={45} x2={268} y2={midY - 8}
        stroke={C.pairing} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }} />

      {/* ── 하단 경로: G + sig → rhs ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <DataBox x={16} y={142} w={80} h={26} label="G" sub="G1 생성원" color="#8b5cf6" />
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        <DataBox x={120} y={142} w={80} h={26} label="sig" sub="G2" color="#f59e0b" />
      </motion.g>
      <motion.text x={160} y={176} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        (Σ sk_i) · H(m)
      </motion.text>

      {/* 하단 pairing 화살표 */}
      <motion.line x1={204} y1={155} x2={268} y2={midY + 8}
        stroke={C.pairing} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }} />
      <motion.line x1={100} y1={155} x2={268} y2={midY + 8}
        stroke={C.pairing} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }} />

      {/* 중앙 pairing 연산 */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}>
        <ActionBox x={272} y={midY - 20} w={78} h={40}
          label="pairing" sub="e: G1×G2→GT" color={C.pairing} />
      </motion.g>

      {/* 결과 화살표 */}
      <motion.line x1={354} y1={midY - 6} x2={386} y2={midY - 14}
        stroke={C.pairing} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.3 }} />
      <motion.line x1={354} y1={midY + 6} x2={386} y2={midY + 14}
        stroke={C.pairing} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.3 }} />

      {/* lhs / rhs */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}>
        <text x={400} y={midY - 10} fontSize={9} fontWeight={600}
          fill={C.pairing}>lhs (GT)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}>
        <text x={400} y={midY + 18} fontSize={9} fontWeight={600}
          fill={C.pairing}>rhs (GT)</text>
      </motion.g>

      {/* == 비교 */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, type: 'spring' }}>
        <text x={428} y={midY + 5} textAnchor="middle" fontSize={16}
          fontWeight={700} fill={C.pairing}>{'=='}</text>
      </motion.g>

      {/* 결과 */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}>
        <text x={456} y={midY + 5} fontSize={16} fontWeight={700}
          fill="#10b981">{'✓'}</text>
      </motion.g>

      {/* 수식 설명 */}
      <motion.text x={240} y={192} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}>
        쌍선형성: e(a·G, B) = e(G, a·B) → 서명자 = 공개키 소유자
      </motion.text>
    </g>
  );
}

/** Step 5: 전체 파이프라인 — 5단계 수평 요약 */
export function Step5() {
  const y = 70;
  const stages = [
    { x: 10,  label: 'bits',    sub: '512비트', color: C.filter },
    { x: 95,  label: 'filter',  sub: '→486 pk', color: C.filter },
    { x: 180, label: 'pk 합산', sub: '→48B',    color: C.aggpk },
    { x: 265, label: 'root',    sub: '→32B',    color: C.root },
    { x: 350, label: 'pairing', sub: '→GT',     color: C.pairing },
  ];

  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.pipeline}>
        verify_sync_committee_sig() 전체 흐름
      </text>

      {/* 5 stage 순차 등장 */}
      {stages.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}>
          {/* 단계 박스 */}
          <rect x={s.x} y={y} width={75} height={40} rx={8}
            fill="var(--card)" stroke={s.color} strokeWidth={1} />
          <rect x={s.x} y={y} width={75} height={5} rx={4}
            fill={s.color} opacity={0.7} />
          <text x={s.x + 37.5} y={y + 24} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">{s.label}</text>
          <text x={s.x + 37.5} y={y + 35} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">{s.sub}</text>

          {/* 화살표 (마지막 제외) */}
          {i < stages.length - 1 && (
            <motion.line
              x1={s.x + 78} y1={y + 20} x2={stages[i + 1].x - 3} y2={y + 20}
              stroke={s.color} strokeWidth={1} markerEnd={`url(#pipeArrow${i})`}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.2 + 0.15, duration: 0.25 }}
            />
          )}
        </motion.g>
      ))}

      {/* 최종 결과 */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}>
        <circle cx={445} cy={y + 20} r={14}
          fill="#10b981" opacity={0.15} />
        <circle cx={445} cy={y + 20} r={14}
          fill="none" stroke="#10b981" strokeWidth={1.2} />
        <text x={445} y={y + 25} textAnchor="middle" fontSize={14}
          fontWeight={700} fill="#10b981">{'✓'}</text>
      </motion.g>

      {/* 데이터 크기 흐름 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}>
        <text x={240} y={y + 60} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          512 bits → 486 pk → 48B agg_pk → 32B root → GT (576B) → bool
        </text>
      </motion.g>

      {/* 처리 시간 비교 */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}>
        <rect x={100} y={150} width={280} height={34} rx={8}
          fill="var(--card)" stroke={C.pipeline} strokeWidth={0.5} />
        <text x={240} y={166} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.pipeline}>
          Helios: ~3ms (페어링 1회)
        </text>
        <text x={240} y={178} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          vs Reth: 블록 실행 수 초 — 1000배 차이
        </text>
      </motion.g>

      {/* 화살표 마커 정의 */}
      <defs>
        {stages.map((s, i) => (
          <marker key={i} id={`pipeArrow${i}`} viewBox="0 0 10 10"
            refX={9} refY={5} markerWidth={5} markerHeight={5}
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={s.color} />
          </marker>
        ))}
      </defs>
    </g>
  );
}
