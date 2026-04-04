import { motion } from 'framer-motion';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './VerifyTraceVizData';

/* ── 도트 격자 생성 (32×16 = 512) ── */
const COLS = 32;
const ROWS = 16;
const DOT_R = 3.2;
const GAP_X = 11.2;
const GAP_Y = 9.6;
const GRID_X0 = 24;
const GRID_Y0 = 26;

/** 참여 여부 시드 — 약 486/512 = 95% 참여 */
function isParticipant(i: number): boolean {
  // 의사난수로 약 5%를 미참여로 설정
  const hash = ((i * 2654435761) >>> 0) % 100;
  return hash >= 5;
}

const participantCount = Array.from({ length: 512 }, (_, i) => isParticipant(i)).filter(Boolean).length;

/** Step 0: 비트맵 필터링 — 512 dots grid */
export function Step0() {
  return (
    <g>
      {/* 격자 — 32×16 = 512개 dot */}
      {Array.from({ length: ROWS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => {
          const idx = row * COLS + col;
          const active = isParticipant(idx);
          const cx = GRID_X0 + col * GAP_X;
          const cy = GRID_Y0 + row * GAP_Y;
          return (
            <motion.circle
              key={idx}
              cx={cx} cy={cy} r={DOT_R}
              fill={active ? C.filter : 'var(--border)'}
              opacity={active ? 0.85 : 0.35}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: active ? 0.85 : 0.35, r: DOT_R }}
              transition={{ delay: (col * 0.008) + (row * 0.02), duration: 0.2 }}
            />
          );
        })
      )}

      {/* 하단 필터 결과 */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <rect x={120} y={178} width={240} height={20} rx={10}
          fill="var(--card)" stroke={C.filter} strokeWidth={1} />
        <text x={240} y={192} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.filter}>
          {participantCount} / 512 참여 (bit = 1)
        </text>
      </motion.g>

      {/* 우측 범례 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <circle cx={400} cy={36} r={4} fill={C.filter} opacity={0.85} />
        <text x={410} y={40} fontSize={8} fill="var(--foreground)">참여</text>
        <circle cx={400} cy={52} r={4} fill="var(--border)" opacity={0.35} />
        <text x={410} y={56} fontSize={8} fill="var(--muted-foreground)">미참여</text>
        <text x={400} y={76} fontSize={7} fill="var(--muted-foreground)">
          bits: Bitvector{'<'}512{'>'}
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: 정족수 확인 — progress bar with 2/3 threshold */
export function Step1() {
  const barX = 40;
  const barY = 80;
  const barW = 400;
  const barH = 28;
  const thresholdRatio = 2 / 3;
  const participantRatio = participantCount / 512;
  const thresholdX = barX + barW * thresholdRatio;

  return (
    <g>
      <text x={240} y={30} textAnchor="middle" fontSize={12}
        fontWeight={700} fill={C.quorum}>
        정족수 확인: participants * 3 {'≥'} 512 * 2
      </text>

      {/* 전체 바 배경 */}
      <rect x={barX} y={barY} width={barW} height={barH} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

      {/* 참여자 채움 — 애니메이션 */}
      <motion.rect
        x={barX} y={barY} height={barH} rx={6}
        fill={C.quorum} opacity={0.25}
        initial={{ width: 0 }}
        animate={{ width: barW * participantRatio }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* 2/3 임계선 (빨간 점선) */}
      <motion.line
        x1={thresholdX} y1={barY - 8} x2={thresholdX} y2={barY + barH + 8}
        stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
      <motion.text x={thresholdX} y={barY - 14} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#ef4444"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        2/3 임계선 (342)
      </motion.text>

      {/* 참여자 수 라벨 */}
      <motion.text x={barX + barW * participantRatio} y={barY + barH + 20}
        textAnchor="middle" fontSize={10} fontWeight={600} fill={C.quorum}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        {participantCount}명 참여
      </motion.text>

      {/* 스케일 라벨 */}
      <text x={barX} y={barY + barH + 20} fontSize={8}
        fill="var(--muted-foreground)">0</text>
      <text x={barX + barW} y={barY + barH + 20} textAnchor="end"
        fontSize={8} fill="var(--muted-foreground)">512</text>

      {/* 통과 표시 */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}>
        <text x={barX + barW * participantRatio + 30} y={barY + barH / 2 + 5}
          fontSize={18} fontWeight={700} fill={C.quorum}>{'✓'}</text>
      </motion.g>

      {/* 하단 설명 */}
      <motion.text x={240} y={160} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        {participantCount} {'×'} 3 = {participantCount * 3} {'≥'} 512 {'×'} 2 = 1024 → 통과
      </motion.text>

      {/* BFT 연결 */}
      <motion.text x={240} y={180} textAnchor="middle" fontSize={8}
        fontWeight={600} fill={C.quorum}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        Casper FFG 동일 임계값 — BFT 안전성 보장
      </motion.text>
    </g>
  );
}

/** Step 2: 공개키 합산 — G1 점 수렴 애니메이션 */
export function Step2() {
  // 여러 작은 점이 하나의 큰 점으로 수렴
  const centerX = 180;
  const centerY = 100;
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const radius = 60 + (i % 3) * 15;
    return {
      startX: centerX + Math.cos(angle) * radius,
      startY: centerY + Math.sin(angle) * radius,
    };
  });

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={12}
        fontWeight={700} fill={C.aggpk}>G1 점 합산: fold(identity, +)</text>

      {/* 시작: identity (무한원점) */}
      <motion.text x={centerX} y={centerY + 4} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 1 }} animate={{ opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}>
        identity (O)
      </motion.text>

      {/* 개별 G1 점들이 중심으로 수렴 */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          r={4}
          fill={C.aggpk}
          opacity={0.7}
          initial={{ cx: p.startX, cy: p.startY }}
          animate={{ cx: centerX, cy: centerY }}
          transition={{
            delay: 0.2 + i * 0.06,
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 최종 합산 점 — 크게 나타남 */}
      <motion.circle
        cx={centerX} cy={centerY} r={14}
        fill={C.aggpk} opacity={0.2}
        initial={{ r: 0 }} animate={{ r: 14 }}
        transition={{ delay: 1.2, duration: 0.3 }}
      />
      <motion.circle
        cx={centerX} cy={centerY} r={14}
        fill="none" stroke={C.aggpk} strokeWidth={1.5}
        initial={{ r: 0 }} animate={{ r: 14 }}
        transition={{ delay: 1.2, duration: 0.3 }}
      />
      <motion.text x={centerX} y={centerY + 4} textAnchor="middle"
        fontSize={10} fontWeight={700} fill={C.aggpk}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        agg_pk
      </motion.text>

      {/* 수식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        <text x={centerX} y={centerY + 34} textAnchor="middle"
          fontSize={8} fill="var(--muted-foreground)">
          pk₁ + pk₂ + ... + pk₄₈₆ = agg_pk (48B)
        </text>
      </motion.g>

      {/* 우측 설명 박스 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}>
        <rect x={290} y={44} width={170} height={68} rx={8}
          fill="var(--card)" stroke={C.aggpk} strokeWidth={0.5} />
        <text x={375} y={62} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.aggpk}>BLS 선형성</text>
        <text x={375} y={78} textAnchor="middle" fontSize={8}
          fill="var(--foreground)">sig = (Σ sk_i) · H(m)</text>
        <text x={375} y={92} textAnchor="middle" fontSize={8}
          fill="var(--foreground)">agg_pk = (Σ sk_i) · G</text>
        <text x={375} y={106} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">개별 검증 486회 = 집계 1회</text>
      </motion.g>

      {/* 하단 */}
      <motion.text x={240} y={185} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}>
        타원곡선 점 덧셈 (modular arithmetic) — identity에서 시작, 순차 누적
      </motion.text>
    </g>
  );
}
