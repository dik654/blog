import { motion } from 'framer-motion';

const C = '#6366f1', C2 = '#10b981', C3 = '#f59e0b', C4 = '#ec4899';
const MUT = 'var(--muted-foreground)';
const CX = 480;

const VW = 56, VH = 34, VG = 6;
const VTOT = 8 * VW + 7 * VG;
const VX0 = CX - VTOT / 2;
const vx = (i: number) => VX0 + i * (VW + VG);
const vcx = (i: number) => vx(i) + VW / 2;

/* 4-bit example row */
function BitEx({ x, y, label, bits, note, color }: {
  x: number; y: number; label: string; bits: number[]; note?: string; color: string;
}) {
  return (
    <g>
      <text x={x} y={y + 11} fontSize={11} fill={color}>{label}</text>
      {bits.map((b, i) => (
        <g key={i}>
          <rect x={x + 24 + i * 22} y={y} width={18} height={16} rx={2}
            fill={b ? `${color}18` : 'transparent'} stroke={color} strokeWidth={.4} />
          <text x={x + 24 + i * 22 + 9} y={y + 12} textAnchor="middle"
            fontSize={12} fontWeight={600} fill={color}>{b}</text>
        </g>
      ))}
      {note && <text x={x + 24 + bits.length * 22 + 4} y={y + 11} fontSize={10} fill={MUT}>{note}</text>}
    </g>
  );
}

export default function CompressionStep2() {
  const boxX = 80, boxW = 800, boxY = 4, boxH = 400;
  const inY = 38;
  const compY = inY + VH + 22;
  const compH = 158;
  const outY = compY + compH + 28;

  const t2x = vx(0) + 6;
  const t1x = vx(4) + 6;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ═══ Outer round box ═══ */}
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx={14}
        fill={`${C3}04`} stroke={C3} strokeWidth={1} strokeDasharray="6 3" />
      <text x={boxX + 16} y={boxY + 24} fontSize={17} fontWeight={700} fill={C3}>
        라운드 t 내부
      </text>
      <text x={boxX + boxW - 16} y={boxY + 24} textAnchor="end" fontSize={14} fill={MUT}>
        (R1~R64 모두 이 구조)
      </text>

      {/* External inputs */}
      <rect x={4} y={compY} width={64} height={30} rx={7}
        fill={`${C2}14`} stroke={C2} strokeWidth={.8} />
      <text x={36} y={compY + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill={C2}>Wₜ</text>
      <line x1={68} y1={compY + 15} x2={boxX} y2={compY + 15} stroke={C2} strokeWidth={.8} />
      <text x={36} y={compY + 44} textAnchor="middle" fontSize={9} fill={C2}>워드 확장에서</text>
      <text x={36} y={compY + 54} textAnchor="middle" fontSize={9} fill={C2}>준비한 워드</text>

      <rect x={4} y={compY + 62} width={64} height={30} rx={7}
        fill={`${C4}14`} stroke={C4} strokeWidth={.8} />
      <text x={36} y={compY + 82} textAnchor="middle" fontSize={14} fontWeight={700} fill={C4}>Kₜ</text>
      <line x1={68} y1={compY + 77} x2={boxX} y2={compY + 77} stroke={C4} strokeWidth={.8} />
      <text x={36} y={compY + 106} textAnchor="middle" fontSize={9} fill={C4}>SHA-256 사양에</text>
      <text x={36} y={compY + 116} textAnchor="middle" fontSize={9} fill={C4}>정해진 상수</text>

      {/* ═══ Input row ═══ */}
      <text x={VX0 - 10} y={inY + VH / 2 + 5} textAnchor="end" fontSize={13} fill={MUT}>입력</text>
      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((v, i) => (
        <g key={v}>
          <rect x={vx(i)} y={inY} width={VW} height={VH} rx={5}
            fill={`${C}12`} stroke={C} strokeWidth={.8} />
          <text x={vcx(i)} y={inY + VH / 2 + 7} textAnchor="middle"
            fontSize={17} fontWeight={700} fill={C}>{v}</text>
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <line key={`d2${i}`} x1={vcx(i)} y1={inY + VH} x2={vcx(i)} y2={compY}
          stroke={C3} strokeWidth={.4} opacity={.2} />
      ))}
      {[4, 5, 6, 7].map(i => (
        <line key={`d1${i}`} x1={vcx(i)} y1={inY + VH} x2={vcx(i)} y2={compY}
          stroke={C3} strokeWidth={.4} opacity={.2} />
      ))}

      {/* ═══ ① T₂ box ═══ */}
      <rect x={vx(0) - 6} y={compY} width={3 * (VW + VG) + 12} height={compH} rx={8}
        fill={`${C3}06`} stroke={C3} strokeWidth={.6} />
      <text x={t2x} y={compY + 18} fontSize={14} fontWeight={700} fill={C3}>
        ① a,b,c 혼합 → T₂
      </text>
      <text x={t2x} y={compY + 36} fontSize={12} fill={C3}>
        Σ₀(a): 비트를 3방향 회전 후 XOR
      </text>
      <text x={t2x} y={compY + 54} fontSize={12} fill={C3}>
        Maj(a,b,c): 비트별 다수결
      </text>
      {/* Maj bit example */}
      <BitEx x={t2x} y={compY + 64} label="a:" bits={[1, 0, 1, 1]} color={C} />
      <BitEx x={t2x} y={compY + 82} label="b:" bits={[1, 1, 0, 1]} color={C}
        note="2개 이상 1→1" />
      <BitEx x={t2x} y={compY + 100} label="c:" bits={[0, 1, 1, 1]} color={C} />
      <line x1={t2x} y1={compY + 118} x2={t2x + 115} y2={compY + 118}
        stroke={C3} strokeWidth={.5} />
      <BitEx x={t2x} y={compY + 120} label="M:" bits={[1, 1, 1, 1]} color={C3} />
      <text x={t2x} y={compY + 150} fontSize={13} fontWeight={700} fill={C3}>
        T₂ = Σ₀ + Maj
      </text>

      {/* ═══ ② T₁ box ═══ */}
      <rect x={vx(4) - 6} y={compY} width={4 * (VW + VG) + 12} height={compH} rx={8}
        fill={`${C3}06`} stroke={C3} strokeWidth={.6} />
      <text x={t1x} y={compY + 18} fontSize={14} fontWeight={700} fill={C3}>
        ② e,f,g,h + Wₜ + Kₜ → T₁
      </text>
      <text x={t1x} y={compY + 36} fontSize={12} fill={C3}>
        Σ₁(e): 비트를 3방향 회전 후 XOR
      </text>
      <text x={t1x} y={compY + 54} fontSize={12} fill={C3}>
        Ch(e,f,g): e가 1이면 f, 0이면 g 선택
      </text>
      {/* Ch bit example */}
      <BitEx x={t1x} y={compY + 64} label="e:" bits={[1, 0, 1, 0]} color={C}
        note="← 선택 기준" />
      <BitEx x={t1x} y={compY + 82} label="f:" bits={[1, 1, 0, 0]} color={C2}
        note="← e=1이면" />
      <BitEx x={t1x} y={compY + 100} label="g:" bits={[0, 0, 1, 1]} color={C4}
        note="← e=0이면" />
      <line x1={t1x} y1={compY + 118} x2={t1x + 115} y2={compY + 118}
        stroke={C3} strokeWidth={.5} />
      <BitEx x={t1x} y={compY + 120} label="C:" bits={[1, 0, 0, 1]} color={C3} />
      <text x={t1x} y={compY + 150} fontSize={13} fontWeight={700} fill={C3}>
        T₁ = Σ₁ + Ch + h + Kₜ + Wₜ
      </text>

      {/* ═══ Arrows from computation to output ═══ */}
      <line x1={vcx(1)} y1={compY + compH} x2={vcx(0)} y2={outY}
        stroke={C3} strokeWidth={.7} />
      <line x1={vcx(5)} y1={compY + compH} x2={vcx(0) + VW / 2 + 10} y2={outY}
        stroke={C3} strokeWidth={.7} />
      <line x1={vcx(6)} y1={compY + compH} x2={vcx(4)} y2={outY}
        stroke={C3} strokeWidth={.7} />
      {/* d → e' : gap between columns 3-4 to avoid crossing c box */}
      {(() => {
        const gapX = vx(4) - VG / 2; // center of gap between output boxes 3 and 4
        return (
          <path d={`M ${vcx(3)},${inY + VH} L ${gapX},${inY + VH + 10}
                    L ${gapX},${outY + VH / 2} L ${vx(4)},${outY + VH / 2}`}
            fill="none" stroke={C} strokeWidth={.6} strokeDasharray="3 2" />
        );
      })()}

      {/* ═══ Output row ═══ */}
      <text x={VX0 - 10} y={outY + VH / 2 + 5} textAnchor="end" fontSize={13} fill={MUT}>출력</text>
      {["a'", 'a', 'b', 'c', "e'", 'e', 'f', 'g'].map((v, i) => {
        const isNew = i === 0 || i === 4;
        const col = isNew ? C2 : C;
        return (
          <g key={`o${i}`}>
            <rect x={vx(i)} y={outY} width={VW} height={VH} rx={5}
              fill={`${col}12`} stroke={col} strokeWidth={isNew ? 1 : .6} />
            <text x={vcx(i)} y={outY + VH / 2 + 7} textAnchor="middle"
              fontSize={15} fontWeight={isNew ? 700 : 500} fill={col}>{v}</text>
          </g>
        );
      })}
      <text x={vcx(0)} y={outY + VH + 14} textAnchor="middle" fontSize={11} fill={C2}>
        = T₁ + T₂
      </text>
      <text x={vcx(4)} y={outY + VH + 14} textAnchor="middle" fontSize={11} fill={C2}>
        = d + T₁
      </text>
      <text x={vcx(7) + VW / 2 + 10} y={outY + VH / 2 + 5} fontSize={13} fill={C4}>h 탈락</text>
      <text x={CX} y={outY + VH + 32} textAnchor="middle" fontSize={12} fill={MUT}>
        나머지 6개: 한 칸 오른쪽 시프트 (b'←a, c'←b, d'←c, f'←e, g'←f, h'←g)
      </text>
    </motion.g>
  );
}
