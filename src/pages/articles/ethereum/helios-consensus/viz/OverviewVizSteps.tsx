import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── 화살표 헬퍼 ── */
function Arrow({ x1, y1, x2, y2, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; delay?: number }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <line x1={x1} y1={y1} x2={x2 - 4} y2={y2} stroke="var(--border)" strokeWidth={1} />
      <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 3} ${x2 - 5},${y2 + 3}`} fill="var(--border)" />
    </motion.g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 0: 풀 노드 vs 경량 클라이언트
   왼: Reth (모든 TX 실행 → state_root 재계산)
   우: Helios (BLS 서명 검증 → 서명 유효)
   ══════════════════════════════════════════════════════ */
export function Step0() {
  return (
    <g>
      {/* ── Reth 경로 (상단) ── */}
      <ModuleBox x={10} y={12} w={80} h={44} label="Reth" sub="풀 노드" color={C.reth} />
      <Arrow x1={90} y1={34} x2={108} y2={34} delay={0.1} />

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <ActionBox x={108} y={14} w={100} h={40} label="모든 TX 실행" sub="수억 TX, EVM" color={C.reth} />
      </motion.g>
      <Arrow x1={208} y1={34} x2={226} y2={34} delay={0.25} />

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <ActionBox x={226} y={14} w={100} h={40} label="state_root 비교" sub="결과 = 헤더?" color={C.reth} />
      </motion.g>
      <Arrow x1={326} y1={34} x2={344} y2={34} delay={0.4} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <DataBox x={344} y={18} w={60} h={30} label="✓ 유효" color={C.flow} />
      </motion.g>

      {/* Reth 비용 라벨 */}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.5 }}
        x={210} y={68} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        수일 소요 · 700GB · CPU 집약
      </motion.text>

      {/* ── 구분선 ── */}
      <line x1={10} y1={82} x2={470} y2={82} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />
      <text x={240} y={93} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
        같은 목표: 블록 헤더 신뢰
      </text>

      {/* ── Helios 경로 (하단) ── */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <ModuleBox x={10} y={104} w={80} h={44} label="Helios" sub="경량 클라이언트" color={C.bls} />
      </motion.g>
      <Arrow x1={90} y1={126} x2={108} y2={126} delay={0.4} />

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
        <ActionBox x={108} y={106} w={100} h={40} label="BLS 서명 검증" sub="1회 페어링" color={C.bls} />
      </motion.g>
      <Arrow x1={208} y1={126} x2={226} y2={126} delay={0.55} />

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <ActionBox x={226} y={106} w={100} h={40} label="서명 유효?" sub="e(pk,H(m))=e(G,sig)" color={C.bls} />
      </motion.g>
      <Arrow x1={326} y1={126} x2={344} y2={126} delay={0.7} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
        <DataBox x={344} y={110} w={60} h={30} label="✓ 유효" color={C.flow} />
      </motion.g>

      {/* Helios 비용 라벨 */}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }}
        x={210} y={160} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        수 ms · ~0 디스크 · 수학 연산
      </motion.text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 1: verify 함수 5단계 파이프라인 (수평 흐름)
   [512 bits] → 필터 → 합산 → signing_root → 페어링 → ✓/✗
   ══════════════════════════════════════════════════════ */
export function Step1() {
  const stages = [
    { label: '비트맵 필터', dataIn: '512 bits', dataOut: '~480 PK', section: '섹션 2-1', x: 0 },
    { label: '정족수 확인', dataIn: '', dataOut: '≥ 342', section: '섹션 2-2', x: 96 },
    { label: 'PK 합산', dataIn: '', dataOut: '48B agg_pk', section: '섹션 2-3', x: 192 },
    { label: 'signing_root', dataIn: '', dataOut: '32B root', section: '섹션 2-4', x: 288 },
    { label: '페어링 비교', dataIn: '', dataOut: '✓ / ✗', section: '섹션 2-5', x: 384 },
  ];

  return (
    <g>
      {/* 단계 제목 */}
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
        verify_sync_committee_sig() 파이프라인
      </text>

      {stages.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}
        >
          {/* 단계 박스 */}
          <rect x={s.x + 8} y={40} width={82} height={36} rx={6}
            fill="var(--card)" stroke={C.bls} strokeWidth={0.8} />
          <rect x={s.x + 8} y={40} width={82} height={4} rx={2}
            fill={C.bls} opacity={0.7} />
          <text x={s.x + 49} y={60} textAnchor="middle"
            fontSize={8.5} fontWeight={600} fill="var(--foreground)">{s.label}</text>
          <text x={s.x + 49} y={71} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">{s.section}</text>

          {/* 입력 데이터 라벨 (첫 번째만) */}
          {i === 0 && (
            <text x={s.x + 49} y={34} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={C.bls}>{s.dataIn}</text>
          )}

          {/* 출력 데이터 라벨 */}
          <text x={s.x + 49} y={88} textAnchor="middle"
            fontSize={7} fill={C.flow}>{s.dataOut}</text>

          {/* 단계 간 화살표 */}
          {i < 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.08 }}>
              <line x1={s.x + 90} y1={58} x2={s.x + 100} y2={58}
                stroke="var(--border)" strokeWidth={1} />
              <polygon points={`${s.x + 104},${58} ${s.x + 100},${55} ${s.x + 100},${61}`}
                fill="var(--border)" />
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* 하단 비교 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={80} y={100} width={320} height={22} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          전체 ~3ms · Reth 블록 실행 수 초 대비 1000배+ 빠름
        </text>
      </motion.g>
    </g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 2: 512명 위원회 — 100만+ 검증자 중 선출
   상단: 검증자 구름(많은 점) → 하단: 512 격자 (참여/미참여)
   ══════════════════════════════════════════════════════ */
export function Step2() {
  /* 100만+ 검증자 점 (대표적으로 80개 정도 표시) */
  const cloudDots: { cx: number; cy: number }[] = [];
  for (let i = 0; i < 80; i++) {
    const seed1 = ((i * 7 + 13) * 31) % 1000;
    const seed2 = ((i * 11 + 7) * 23) % 1000;
    cloudDots.push({
      cx: 30 + (seed1 / 1000) * 260,
      cy: 16 + (seed2 / 1000) * 40,
    });
  }

  /* 512 격자 (32×16) — 일부 밝게(참여), 일부 어둡게(미참여) */
  const gridCols = 32;
  const gridRows = 16;
  const dotR = 2.8;
  const dotGap = 7.4;
  const gridX = 30;
  const gridY = 100;

  const gridDots: { cx: number; cy: number; active: boolean }[] = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const idx = r * gridCols + c;
      /* 약 95% 참여 (486/512) */
      const seed = ((idx * 17 + 3) * 41) % 100;
      gridDots.push({
        cx: gridX + c * dotGap,
        cy: gridY + r * dotGap,
        active: seed < 95,
      });
    }
  }
  const activeCount = gridDots.filter(d => d.active).length;

  return (
    <g>
      {/* ── 상단: 100만+ 검증자 구름 ── */}
      <text x={160} y={12} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
        100만+ 이더리움 검증자
      </text>
      {cloudDots.map((d, i) => (
        <motion.circle key={i} cx={d.cx} cy={d.cy} r={1.8}
          fill={C.muted} opacity={0.35}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ delay: i * 0.005 }}
        />
      ))}

      {/* ── 선출 화살표 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={160} y1={60} x2={160} y2={88} stroke={C.bls} strokeWidth={1.2} />
        <polygon points="160,92 156,86 164,86" fill={C.bls} />
        <rect x={170} y={66} width={100} height={18} rx={4} fill="var(--card)" stroke={C.bls} strokeWidth={0.5} />
        <text x={220} y={78} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.bls}>
          RANDAO로 512명 선출
        </text>
      </motion.g>

      {/* ── 하단: 512 격자 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {gridDots.map((d, i) => (
          <motion.circle key={i} cx={d.cx} cy={d.cy} r={dotR}
            fill={d.active ? C.grid : C.gridOff}
            opacity={d.active ? 0.8 : 0.2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.001 }}
          />
        ))}
      </motion.g>

      {/* ── 우측 정보 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        {/* 참여율 */}
        <rect x={290} y={100} width={170} height={50} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <circle cx={306} cy={116} r={4} fill={C.grid} opacity={0.8} />
        <text x={316} y={119} fontSize={7.5} fill="var(--foreground)">참여 (bit=1): {activeCount}명</text>
        <circle cx={306} cy={132} r={4} fill={C.gridOff} opacity={0.3} />
        <text x={316} y={135} fontSize={7.5} fill="var(--foreground)">미참여 (bit=0): {512 - activeCount}명</text>
        <text x={306} y={146} fontSize={7} fill="var(--muted-foreground)">정족수: 342명 이상 (2/3)</text>

        {/* 교체 주기 */}
        <rect x={290} y={158} width={170} height={28} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={375} y={170} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          ⏱ 256 에폭(~27h)마다 교체
        </text>
        <text x={375} y={181} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          장기 고정 방지 → 매수·공모 차단
        </text>
      </motion.g>
    </g>
  );
}
