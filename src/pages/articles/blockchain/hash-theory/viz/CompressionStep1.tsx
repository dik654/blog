import { motion } from 'framer-motion';

const C = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const MUT = 'var(--muted-foreground)';
const CX = 480;

export default function CompressionStep1() {
  const regs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const VW = 52, VH = 32, VG = 5;
  const VTOT = 8 * VW + 7 * VG;
  const pnX = 30, pnW = 900;

  /* Panel 1 */
  const p1Y = 6, p1H = 72, flowY1 = p1Y + 42;
  const regX = 290;

  /* Panel 2 */
  const p2Y = 120, p2H = 110, flowY2 = p2Y + 40;

  /* Pipeline */
  const pW = 56, pH = 30, pG = 14;
  const rounds = ['R1', 'R2', 'R3', '…', 'R64'];
  const pTot = 5 * pW + 4 * pG;
  const pX0 = CX - pTot / 2;
  const pipeY = 300;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ═══ Panel 1: Hash path ═══ */}
      <rect x={pnX} y={p1Y} width={pnW} height={p1H} rx={10}
        fill={`${C}04`} stroke={C} strokeWidth={.6} />
      <text x={pnX + 12} y={p1Y + 18} fontSize={12} fontWeight={700} fill={C}>준비 ①</text>

      <rect x={54} y={flowY1 - 14} width={150} height={28} rx={6}
        fill={`${C}08`} stroke={C} strokeWidth={.7} />
      <text x={129} y={flowY1 + 5} textAnchor="middle" fontSize={12} fontWeight={600} fill={C}>
        이전 해시 256-bit
      </text>
      <line x1={204} y1={flowY1} x2={regX - 6} y2={flowY1} stroke={C} strokeWidth={.8} />
      <text x={247} y={flowY1 - 8} textAnchor="middle" fontSize={12} fill={MUT}>8등분 →</text>

      {regs.map((r, i) => (
        <g key={r}>
          <rect x={regX + i * (VW + VG)} y={flowY1 - VH / 2} width={VW} height={VH} rx={5}
            fill={`${C}10`} stroke={C} strokeWidth={.7} />
          <text x={regX + i * (VW + VG) + VW / 2} y={flowY1 + 6}
            textAnchor="middle" fontSize={16} fontWeight={700} fill={C}>{r}</text>
        </g>
      ))}
      <line x1={regX + VTOT} y1={flowY1} x2={regX + VTOT + 20} y2={flowY1}
        stroke={C3} strokeWidth={.8} />
      <text x={regX + VTOT + 24} y={flowY1 + 5} fontSize={12} fontWeight={600} fill={C3}>
        → R1 시작 상태
      </text>

      {/* ═══ Separator ═══ */}
      <line x1={pnX + 60} y1={(p1Y + p1H + p2Y) / 2} x2={pnX + pnW - 60} y2={(p1Y + p1H + p2Y) / 2}
        stroke="var(--border)" strokeWidth={.5} strokeDasharray="6 4" />
      <text x={CX} y={(p1Y + p1H + p2Y) / 2 + 5} textAnchor="middle" fontSize={13} fill={MUT}>
        ↕ 이 두 과정은 독립적 — 서로 관계없이 각각 진행
      </text>

      {/* ═══ Panel 2: Message path ═══ */}
      <rect x={pnX} y={p2Y} width={pnW} height={p2H} rx={10}
        fill={`${C2}04`} stroke={C2} strokeWidth={.6} />
      <text x={pnX + 12} y={p2Y + 18} fontSize={12} fontWeight={700} fill={C2}>준비 ②</text>

      <rect x={54} y={flowY2 - 14} width={150} height={28} rx={6}
        fill={`${C2}08`} stroke={C2} strokeWidth={.7} />
      <text x={129} y={flowY2 + 5} textAnchor="middle" fontSize={12} fontWeight={600} fill={C2}>
        메시지 512-bit
      </text>

      {/* Stage: 16분할 */}
      <line x1={204} y1={flowY2} x2={282} y2={flowY2} stroke={C2} strokeWidth={.8} />
      <text x={243} y={flowY2 - 8} textAnchor="middle" fontSize={11} fill={MUT}>16분할 →</text>

      <rect x={282} y={flowY2 - 13} width={64} height={26} rx={5}
        fill={`${C2}10`} stroke={C2} strokeWidth={.5} />
      <text x={314} y={flowY2 + 5} textAnchor="middle" fontSize={12} fill={C2}>16개</text>

      {/* Stage: σ확장 */}
      <line x1={346} y1={flowY2} x2={486} y2={flowY2} stroke={C2} strokeWidth={.8} />
      <text x={416} y={flowY2 - 8} textAnchor="middle" fontSize={11} fill={MUT}>
        σ₀, σ₁ 확장 (1회만) →
      </text>

      <rect x={486} y={flowY2 - 15} width={130} height={30} rx={6}
        fill={`${C3}14`} stroke={C3} strokeWidth={.7} />
      <text x={551} y={flowY2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill={C3}>
        64개 워드 준비
      </text>

      {/* Stage: 주입 */}
      <line x1={616} y1={flowY2} x2={660} y2={flowY2} stroke={C3} strokeWidth={.8} />
      <text x={682} y={flowY2 + 5} fontSize={12} fontWeight={600} fill={C3}>
        → 매 라운드 Wₜ 주입
      </text>

      {/* σ explanation */}
      <text x={pnX + 14} y={p2Y + p2H - 12} fontSize={11} fill={MUT}>
        σ₀, σ₁ = 비트 회전(ROTR) + 시프트(SHR) + XOR. 이전 워드 4개를 섞어 새 워드 1개 생성.
      </text>

      {/* ═══ Convergence ═══ */}
      <text x={CX} y={p2Y + p2H + 22} textAnchor="middle" fontSize={13} fontWeight={500} fill={MUT}>
        ↓ 두 준비가 끝나면 라운드 시작
      </text>

      {/* ═══ Pipeline ═══ */}
      {rounds.map((r, i) => {
        const px = pX0 + i * (pW + pG);
        const isDots = r === '…';
        return (
          <g key={`p${i}`}>
            {i > 0 && <line x1={px - pG} y1={pipeY + pH / 2} x2={px} y2={pipeY + pH / 2}
              stroke={C3} strokeWidth={.8} />}
            <rect x={px} y={pipeY} width={pW} height={pH} rx={5}
              fill={isDots ? 'transparent' : `${C3}14`}
              stroke={isDots ? 'transparent' : C3} strokeWidth={isDots ? 0 : .8} />
            <text x={px + pW / 2} y={pipeY + pH / 2 + 6} textAnchor="middle"
              fontSize={isDots ? 16 : 13} fontWeight={isDots ? 400 : 700} fill={C3}>{r}</text>
          </g>
        );
      })}

      {/* Hash → R1 only (initial state, once) */}
      <path d={`M ${regX + VTOT / 2},${p1Y + p1H} L ${pX0 + pW / 2},${pipeY}`}
        fill="none" stroke={C} strokeWidth={.6} strokeDasharray="3 2" />
      <text x={pX0 + pW / 2} y={pipeY - 6} textAnchor="middle" fontSize={11} fill={C}>
        a~h (1회)
      </text>

      {/* Message → ALL rounds (one word each) */}
      {rounds.map((r, i) => {
        if (r === '…') return null;
        const px = pX0 + i * (pW + pG) + pW / 2;
        const wt = i === 0 ? '0' : i === 1 ? '1' : i === 2 ? '2' : '63';
        return (
          <g key={`wf${i}`}>
            <line x1={px} y1={pipeY + pH} x2={px} y2={pipeY + pH + 16}
              stroke={C2} strokeWidth={.6} strokeDasharray="2 1" />
            <text x={px} y={pipeY + pH + 26} textAnchor="middle" fontSize={10} fill={C2}>
              {'W'}
              <tspan baselineShift="sub" fontSize="75%">{wt}</tspan>
            </text>
          </g>
        );
      })}
      <text x={CX} y={pipeY + pH + 42} textAnchor="middle" fontSize={12} fill={C2}>
        ↑ 매 라운드마다 워드 1개씩 주입
      </text>
    </motion.g>
  );
}
