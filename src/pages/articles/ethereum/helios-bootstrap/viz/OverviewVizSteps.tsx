import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── Step 0: 풀 노드 vs 경량 클라이언트 ─────────────── */
export function Step0() {
  /* Reth 경로 — 긴 체인 (제네시스 → 수억 블록 → 현재 상태) */
  const rethY = 30;
  /* Helios 경로 — 짧은 (체크포인트 → 검증 → 현재 상태) */
  const heliosY = 130;
  /* 블록 점 애니메이션 데이터 */
  const blockDots = Array.from({ length: 28 }, (_, i) => ({
    cx: 100 + i * 10,
    delay: i * 0.03,
  }));

  return (
    <g>
      {/* ── Reth 경로 (위) ── */}
      <ModuleBox x={10} y={rethY - 4} w={70} h={36} label="Genesis" sub="블록 #0" color={C.reth} />

      {/* 긴 체인을 흘러가는 점들 */}
      {blockDots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx} cy={rethY + 14} r={2.2}
          fill={C.reth}
          initial={{ opacity: 0, cx: 90 }}
          animate={{ opacity: [0, 0.7, 0.4], cx: d.cx }}
          transition={{ delay: 0.3 + d.delay, duration: 0.4 }}
        />
      ))}

      {/* 체인 연결선 */}
      <motion.line
        x1={82} y1={rethY + 14} x2={385} y2={rethY + 14}
        stroke={C.reth} strokeWidth={1} opacity={0.25}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <ModuleBox x={390} y={rethY - 4} w={80} h={36} label="현재 상태" sub="블록 #20M" color={C.reth} />
      </motion.g>

      {/* Reth 비용 */}
      <motion.text
        x={240} y={rethY + 38} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        수억 블록 실행 · 수일 소요 · 700GB+ 디스크
      </motion.text>

      {/* ── 구분선 ── */}
      <motion.line
        x1={30} y1={90} x2={450} y2={90}
        stroke="var(--border)" strokeWidth={0.8} strokeDasharray="6 4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={170} y={82} width={140} height={16} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={93} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          같은 목표: 현재 상태 접근
        </text>
      </motion.g>

      {/* ── Helios 경로 (아래) ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}>
        <DataBox x={60} y={heliosY - 2} w={90} h={32} label="Checkpoint" sub="32바이트 해시" color={C.helios} />
      </motion.g>

      {/* 짧은 화살표 */}
      <motion.path
        d="M 155 144 L 185 144"
        stroke={C.helios} strokeWidth={1.5} fill="none"
        markerEnd="url(#arrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <ActionBox x={190} y={heliosY - 5} w={80} h={36} label="Merkle 검증" sub="수학적 증명" color={C.helios} />
      </motion.g>

      {/* 짧은 화살표 */}
      <motion.path
        d="M 275 144 L 305 144"
        stroke={C.helios} strokeWidth={1.5} fill="none"
        markerEnd="url(#arrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <ModuleBox x={310} y={heliosY - 4} w={80} h={36} label="현재 상태" sub="즉시 사용" color={C.helios} />
      </motion.g>

      {/* Helios 비용 */}
      <motion.text
        x={240} y={heliosY + 46} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        1회 HTTP + Merkle 검증 · 수 초 · ~0 디스크
      </motion.text>

      {/* 화살표 마커 */}
      <defs>
        <marker id="arrowHelios" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.helios} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 1: 체크포인트 3가지 구성요소 ────────────── */
export function Step1() {
  /* finalized_header 필드들 */
  const headerFields = [
    { label: 'slot', val: '8,000,000' },
    { label: 'state_root', val: '0xab12..3e4f' },
    { label: 'proposer_index', val: '42195' },
    { label: 'parent_root', val: '0xf3e8..' },
    { label: 'body_root', val: '0x71bc..' },
  ];

  /* 512 dot grid: 32×16 */
  const COLS = 32;
  const ROWS = 16;
  const dotR = 1.4;
  const dotGapX = 3.6;
  const dotGapY = 3.4;
  const gridX0 = 24;
  const gridY0 = 80;

  /* branch 해시 5개 */
  const branches = ['branch[0]', 'branch[1]', 'branch[2]', 'branch[3]', 'branch[4]'];

  return (
    <g>
      {/* ── Card 1: finalized_header ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}>
        {/* 카드 배경 */}
        <rect x={8} y={6} width={220} height={60} rx={8}
          fill="var(--card)" stroke={C.checkpoint} strokeWidth={0.8} />
        <rect x={8} y={6} width={220} height={5} rx={0}
          fill={C.checkpoint} opacity={0.7}
          clipPath="url(#hdrClip)" />
        <defs>
          <clipPath id="hdrClip"><rect x={8} y={6} width={220} height={60} rx={8} /></clipPath>
        </defs>
        <text x={16} y={24} fontSize={10} fontWeight={700}
          fill={C.checkpoint}>finalized_header</text>
        <text x={190} y={24} fontSize={7} fill="var(--muted-foreground)">확정 블록 헤더</text>

        {/* 필드들을 두 줄로 배치 */}
        {headerFields.map((f, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const fx = 16 + col * 72;
          const fy = 34 + row * 16;
          return (
            <g key={f.label}>
              <rect x={fx} y={fy} width={66} height={13} rx={3}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
              <text x={fx + 3} y={fy + 9} fontSize={7} fontWeight={600}
                fill="var(--foreground)">{f.label}</text>
              <text x={fx + 64} y={fy + 9} textAnchor="end" fontSize={7}
                fill="var(--muted-foreground)">{f.val}</text>
            </g>
          );
        })}
      </motion.g>

      {/* ── Card 2: current_sync_committee (512 dots) ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <rect x={8} y={72} width={160} height={68} rx={8}
          fill="var(--card)" stroke={C.helios} strokeWidth={0.8} />
        <rect x={8} y={72} width={160} height={5} rx={0}
          fill={C.helios} opacity={0.7}
          clipPath="url(#cmtClip)" />
        <defs>
          <clipPath id="cmtClip"><rect x={8} y={72} width={160} height={68} rx={8} /></clipPath>
        </defs>
        <text x={90} y={87} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.helios}>current_sync_committee</text>

        {/* 512개 dot — 작은 격자 */}
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const idx = row * COLS + col;
            return (
              <motion.circle
                key={idx}
                cx={gridX0 + col * dotGapX}
                cy={gridY0 + 16 + row * dotGapY}
                r={dotR}
                fill={C.helios}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.4 + (col * 0.004) + (row * 0.01) }}
              />
            );
          })
        )}

        <text x={90} y={138} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">512 x 48B = 24KB</text>
      </motion.g>

      {/* ── Card 3: committee_branch ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={8} y={148} width={220} height={46} rx={8}
          fill="var(--card)" stroke={C.trust} strokeWidth={0.8} />
        <rect x={8} y={148} width={220} height={5} rx={0}
          fill={C.trust} opacity={0.7}
          clipPath="url(#brClip)" />
        <defs>
          <clipPath id="brClip"><rect x={8} y={148} width={220} height={46} rx={8} /></clipPath>
        </defs>
        <text x={16} y={166} fontSize={9} fontWeight={600}
          fill={C.trust}>committee_branch</text>
        <text x={192} y={166} fontSize={7} fill="var(--muted-foreground)">depth=5</text>

        {/* 5개 해시 박스 */}
        {branches.map((b, i) => (
          <motion.g key={b}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.08 }}>
            <rect x={16 + i * 42} y={174} width={38} height={14} rx={4}
              fill="var(--card)" stroke={C.trust} strokeWidth={0.5} />
            <text x={35 + i * 42} y={184} textAnchor="middle" fontSize={7}
              fontWeight={600} fill={C.trust}>{b}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* ── 우측 연결 요약 ── */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}>
        <rect x={250} y={30} width={220} height={140} rx={10}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
        <text x={360} y={52} textAnchor="middle" fontSize={10}
          fontWeight={700} fill="var(--foreground)">Bootstrap 응답</text>
        <text x={360} y={66} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">/eth/v1/beacon/light_client/bootstrap</text>

        {/* 3개 구성요소 화살표 */}
        {[
          { label: 'header', color: C.checkpoint, y: 88 },
          { label: 'committee', color: C.helios, y: 116 },
          { label: 'branch', color: C.trust, y: 144 },
        ].map((item, i) => (
          <motion.g key={item.label}
            initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.15 }}>
            <circle cx={280} cy={item.y} r={4} fill={item.color} opacity={0.8} />
            <text x={290} y={item.y + 4} fontSize={9} fontWeight={600}
              fill="var(--foreground)">{item.label}</text>
            <text x={450} y={item.y + 4} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">
              {i === 0 ? 'slot, state_root...' : i === 1 ? '512 × G1 공개키' : '5개 형제 해시'}
            </text>
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 2: 신뢰 모델 ─────────────────────────── */
export function Step2() {
  const verifyItems = [
    { label: 'Merkle branch', desc: '위원회 소속 증명', color: C.verify },
    { label: 'BLS 서명', desc: '블록 헤더 유효성', color: C.verify },
    { label: 'Merkle-Patricia', desc: '상태 데이터 무결성', color: C.verify },
  ];

  return (
    <g>
      {/* ── 중앙 구분선 ── */}
      <motion.line
        x1={240} y1={14} x2={240} y2={188}
        stroke="var(--border)" strokeWidth={1.2} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={210} y={90} width={60} height={18} rx={9}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
        <text x={228} y={102.5} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.trust}>신뢰</text>
        <text x={252} y={102.5} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.verify}>검증</text>
      </motion.g>

      {/* ── 왼쪽: 신뢰 (작은 영역) ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}>
        {/* 자물쇠 아이콘 형태 */}
        <rect x={40} y={44} width={160} height={110} rx={10}
          fill="var(--card)" stroke={C.trust} strokeWidth={1} />

        {/* 자물쇠 상단 아치 */}
        <path d="M 100 64 C 100 44 140 44 140 64" fill="none"
          stroke={C.trust} strokeWidth={2.5} strokeLinecap="round" />
        {/* 자물쇠 몸통 */}
        <rect x={95} y={64} width={50} height={35} rx={4}
          fill={C.trust} opacity={0.15} stroke={C.trust} strokeWidth={1} />
        <circle cx={120} cy={78} r={4} fill={C.trust} opacity={0.6} />
        <line x1={120} y1={82} x2={120} y2={90}
          stroke={C.trust} strokeWidth={2} strokeLinecap="round" />

        <text x={120} y={116} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.trust}>체크포인트 블록 루트</text>
        <text x={120} y={130} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">32바이트 해시 1개</text>
        <text x={120} y={144} textAnchor="middle" fontSize={7}
          fill={C.danger}>거짓이면 다른 체인을 따라감</text>
      </motion.g>

      {/* ── 오른쪽: 검증 (큰 영역 — 3항목) ── */}
      {verifyItems.map((item, i) => (
        <motion.g key={item.label}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.2 }}>
          <rect x={262} y={30 + i * 52} width={200} height={44} rx={8}
            fill="var(--card)" stroke={item.color} strokeWidth={0.8} />
          {/* 좌측 액센트 */}
          <rect x={262} y={30 + i * 52} width={4} height={44} rx={0}
            fill={item.color} opacity={0.7}
            clipPath={`url(#verClip${i})`} />
          <defs>
            <clipPath id={`verClip${i}`}>
              <rect x={262} y={30 + i * 52} width={200} height={44} rx={8} />
            </clipPath>
          </defs>

          {/* 체크마크 */}
          <circle cx={280} cy={52 + i * 52} r={8}
            fill={item.color} opacity={0.15} />
          <text x={280} y={56 + i * 52} textAnchor="middle"
            fontSize={12} fontWeight={700} fill={item.color}>{'✓'}</text>

          <text x={296} y={48 + i * 52} fontSize={10}
            fontWeight={600} fill="var(--foreground)">{item.label}</text>
          <text x={296} y={62 + i * 52} fontSize={8}
            fill="var(--muted-foreground)">→ {item.desc}</text>
        </motion.g>
      ))}

      {/* 하단 대비 강조 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}>
        <text x={120} y={186} textAnchor="middle" fontSize={7.5}
          fill={C.trust}>신뢰 1가지</text>
        <text x={362} y={186} textAnchor="middle" fontSize={7.5}
          fill={C.verify}>수학 검증 3가지</text>
        <text x={240} y={198} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">
          대부분은 수학으로 검증 — 신뢰 최소화
        </text>
      </motion.g>
    </g>
  );
}
