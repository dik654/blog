import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { p: '#6366f1', v: '#10b981', z: '#f59e0b' };

const STEPS = [
  { label: '세팅 — 공개 파라미터', body: 'p=23, q=11, g=4. 비밀키 x=3, 공개키 y = gˣ mod p = 4³ mod 23 = 18.' },
  { label: '① Commit — a = gʳ 전송', body: 'Prover가 r=7 선택, a = 4⁷ mod 23 = 8 → Verifier에게 전송.' },
  { label: '② Challenge — 랜덤 e 전송', body: 'Verifier가 e=2를 생성하여 Prover에게 전송.' },
  { label: '③ Response — z 계산', body: 'z = r + e·x mod q = 7 + 2·3 mod 11 = 2 → Verifier에게 전송.' },
  { label: '④ 검증 — gᶻ = a·yᵉ ?', body: 'gᶻ = 4² = 16.  a·yᵉ = 8·(18² mod 23) = 8·2 = 16.  16 = 16 ✓ 증명 성공!' },
];

const PX = 75, VX = 385, BY = 22, MID = 230;
const MSGS: { y: number; text: string; dir: 'right' | 'left'; color: string }[] = [
  { y: BY + 65, text: 'a = 8', dir: 'right', color: C.p },
  { y: BY + 100, text: 'e = 2', dir: 'left', color: C.v },
  { y: BY + 135, text: 'z = 2', dir: 'right', color: C.z },
];

export default function SchnorrViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Prover */}
          <rect x={PX - 38} y={BY - 8} width={76} height={42} rx={6}
            fill={`${C.p}12`} stroke={C.p} strokeWidth={1} />
          <text x={PX} y={BY + 10} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.p}>Prover</text>
          <text x={PX} y={BY + 25} textAnchor="middle" fontSize={9} fill={C.p} opacity={0.6}>x=3 (비밀)</text>
          {/* Verifier */}
          <rect x={VX - 38} y={BY - 8} width={76} height={42} rx={6}
            fill={`${C.v}12`} stroke={C.v} strokeWidth={1} />
          <text x={VX} y={BY + 10} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.v}>Verifier</text>
          <text x={VX} y={BY + 25} textAnchor="middle" fontSize={9} fill={C.v} opacity={0.6}>y=18 (공개)</text>

          {/* Setup */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <text x={MID} y={BY + 72} textAnchor="middle" fontSize={12} fill="var(--foreground)" fontWeight={500}>
                p = 23,  q = 11,  g = 4
              </text>
              <text x={MID} y={BY + 92} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                y = gˣ = 4³ mod 23 = 18
              </text>
            </motion.g>
          )}

          {/* Arrows */}
          {MSGS.map((m, i) => {
            if (step < i + 1) return null;
            const active = step === i + 1;
            const x1 = m.dir === 'right' ? PX + 42 : VX - 42;
            const x2 = m.dir === 'right' ? VX - 42 : PX + 42;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={Math.min(x1, x2)} y1={m.y} x2={Math.max(x1, x2)} y2={m.y}
                  stroke={m.color} strokeWidth={active ? 1.5 : 0.8} />
                <polygon points={m.dir === 'right'
                  ? `${x2 - 6},${m.y - 3} ${x2},${m.y} ${x2 - 6},${m.y + 3}`
                  : `${x2 + 6},${m.y - 3} ${x2},${m.y} ${x2 + 6},${m.y + 3}`}
                  fill={m.color} />
                <text x={MID} y={m.y - 8} textAnchor="middle" fontSize={11}
                  fontWeight={600} fill={m.color}>{m.text}</text>
              </motion.g>
            );
          })}

          {/* Computation annotations */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.3 }}>
              <rect x={PX - 38} y={MSGS[0].y + 8} width={120} height={18} rx={4}
                fill={`${C.p}10`} stroke={C.p} strokeWidth={0.6} />
              <text x={PX + 22} y={MSGS[0].y + 20} textAnchor="middle"
                fontSize={9} fill={C.p}>r=7, 4⁷ mod 23 = 8</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.3 }}>
              <rect x={PX - 38} y={MSGS[2].y + 8} width={120} height={18} rx={4}
                fill={`${C.z}10`} stroke={C.z} strokeWidth={0.6} />
              <text x={PX + 22} y={MSGS[2].y + 20} textAnchor="middle"
                fontSize={9} fill={C.z}>7 + 2·3 mod 11 = 2</text>
            </motion.g>
          )}

          {/* Verification */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <rect x={VX - 68} y={MSGS[2].y + 10} width={136} height={38} rx={6}
                fill={`${C.v}10`} stroke={C.v} strokeWidth={1} />
              <text x={VX} y={MSGS[2].y + 28} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.v}>
                gᶻ = 4² = 16
              </text>
              <text x={VX} y={MSGS[2].y + 42} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.v}>
                a·yᵉ = 8·2 = 16 ✓
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
