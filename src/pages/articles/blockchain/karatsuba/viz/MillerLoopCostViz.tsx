import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  miller: '#6366f1',
  finalExp: '#8b5cf6',
  doubling: '#10b981',
  addition: '#f59e0b',
  naive: '#ef4444',
  karat: '#10b981',
  app: '#06b6d4',
};

const STEPS = [
  { label: '① Pairing = Miller + FinalExp', body: 'BN254 ate pairing 은 두 단계: Miller Loop + Final Exponentiation. 각각 Fp12 위에서 동작.' },
  { label: '② Miller Loop drill-down', body: '64 iterations (log2(t)≈64). 매 iter: doubling step ~38m, bit set 이면 addition step ~47m 추가. 총 ~4,000 Fp mults.' },
  { label: '③ Final Exp drill-down', body: 'Easy part: Frobenius 로 저비용. Hard part: ~400 cyclotomic squaring + ~30 Fp12 mults = ~3,600 Fp mults.' },
  { label: '④ 총합 ~7,600 Fp mults', body: 'Miller 4,000 + Final 3,600 = 7,600 Fp mults. 20ns/Fp mult 기준 ≈ 0.15 ms/pairing.' },
  { label: '⑤ Karatsuba 효과', body: 'Without: ~18,000m / 0.36 ms. With: ~7,600m / 0.15 ms. **2.4x speedup**.' },
  { label: '⑥ 응용 누적 영향', body: 'Groth16 verify=3 pairings, BLS sig=1 pairing, Ethereum precompile=181k gas. Karatsuba 절감이 곱해져 누적.' },
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Step1() {
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        BN254 Pairing = Miller Loop + Final Exponentiation
      </text>

      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={40} y={70} width={200} height={140} rx={10}
          fill={`${C.miller}15`} stroke={C.miller} strokeWidth={1.5} />
        <text x={140} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.miller}>
          Miller Loop
        </text>
        <line x1={60} y1={112} x2={220} y2={112} stroke={C.miller} strokeWidth={0.6} opacity={0.4} />
        <text x={140} y={138} textAnchor="middle" fontSize={10} fill="#cbd5e1">64 iterations</text>
        <text x={140} y={158} textAnchor="middle" fontSize={10} fill="#cbd5e1">doubling + addition</text>
        <text x={140} y={186} textAnchor="middle" fontSize={18} fontWeight={800} fill={C.miller}>~4,000m</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <text x={260} y={144} textAnchor="middle" fontSize={20} fontWeight={800} fill="#e2e8f0">+</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
        <rect x={280} y={70} width={200} height={140} rx={10}
          fill={`${C.finalExp}15`} stroke={C.finalExp} strokeWidth={1.5} />
        <text x={380} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.finalExp}>
          Final Exponentiation
        </text>
        <line x1={300} y1={112} x2={460} y2={112} stroke={C.finalExp} strokeWidth={0.6} opacity={0.4} />
        <text x={380} y={138} textAnchor="middle" fontSize={10} fill="#cbd5e1">easy + hard part</text>
        <text x={380} y={158} textAnchor="middle" fontSize={10} fill="#cbd5e1">cyclotomic sq</text>
        <text x={380} y={186} textAnchor="middle" fontSize={18} fontWeight={800} fill={C.finalExp}>~3,600m</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={260} y={246} textAnchor="middle" fontSize={11} fill="#94a3b8">
          e(P, Q) : G₁ × G₂ → G_T  ⊂  𝔽_{'{p^12}'}
        </text>
        <text x={260} y={272} textAnchor="middle" fontSize={11} fontWeight={700} fill="#e2e8f0">
          Total ≈ 7,600 Fp mults
        </text>
      </motion.g>
    </svg>
  );
}

function Step2() {
  // 64 iteration bars, doubling vs addition coloring
  // Approx 33 of 64 are also addition (Hamming weight)
  const iters = Array.from({ length: 64 }, (_, i) => ({
    add: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 62, 63].includes(i),
  }));
  const X0 = 30, BAR_W = 6, GAP = 1, BASE_Y = 130;
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        Miller Loop: 64 iterations
      </text>

      {iters.map((it, i) => {
        const x = X0 + i * (BAR_W + GAP);
        const dh = 38;
        const ah = it.add ? 47 : 0;
        const dHpx = dh * 0.6;
        const aHpx = ah * 0.6;
        return (
          <g key={i}>
            <motion.rect
              x={x} y={BASE_Y - dHpx} width={BAR_W} height={dHpx} rx={1}
              fill={`${C.doubling}55`} stroke={C.doubling} strokeWidth={0.4}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, delay: i * 0.005 }}
              style={{ transformOrigin: `${x}px ${BASE_Y}px` }} />
            {it.add && (
              <motion.rect
                x={x} y={BASE_Y - dHpx - aHpx} width={BAR_W} height={aHpx} rx={1}
                fill={`${C.addition}55`} stroke={C.addition} strokeWidth={0.4}
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.005 }}
                style={{ transformOrigin: `${x}px ${BASE_Y - dHpx}px` }} />
            )}
          </g>
        );
      })}
      <line x1={X0} y1={BASE_Y} x2={X0 + 64 * (BAR_W + GAP)} y2={BASE_Y}
        stroke="#475569" strokeWidth={0.8} />
      <text x={X0} y={BASE_Y + 14} fontSize={8} fill="#94a3b8">iter 0</text>
      <text x={X0 + 64 * (BAR_W + GAP) - 24} y={BASE_Y + 14} fontSize={8} fill="#94a3b8">iter 63</text>

      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={50} y={170} width={14} height={10} rx={2} fill={`${C.doubling}55`} stroke={C.doubling} strokeWidth={0.6} />
        <text x={70} y={179} fontSize={9} fontWeight={600} fill={C.doubling}>Doubling step (~38m, every iter)</text>
        <rect x={290} y={170} width={14} height={10} rx={2} fill={`${C.addition}55`} stroke={C.addition} strokeWidth={0.6} />
        <text x={310} y={179} fontSize={9} fontWeight={600} fill={C.addition}>Addition step (~47m, bit set)</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
        <text x={260} y={216} textAnchor="middle" fontSize={10} fill="#cbd5e1">
          64 × 38 (doubling) + 33 × 47 (addition)
        </text>
        <text x={260} y={240} textAnchor="middle" fontSize={14} fontWeight={800} fill={C.miller}>
          ≈ 4,000 Fp mults
        </text>
        <text x={260} y={262} textAnchor="middle" fontSize={8} fill="#94a3b8">
          cyclotomic sq 9m + sparse mult 13m + line eval 6m + adds (per doubling)
        </text>
        <text x={260} y={278} textAnchor="middle" fontSize={8} fill="#94a3b8">
          line eval 10m + sparse mult 13m + adds (per addition, Hamming weight ≈ 33)
        </text>
      </motion.g>
    </svg>
  );
}

function Step3() {
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        Final Exponentiation: easy + hard part
      </text>

      {/* Easy part - small box */}
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
        <rect x={40} y={70} width={140} height={70} rx={8}
          fill={`${C.finalExp}10`} stroke={C.finalExp} strokeWidth={1.2} strokeDasharray="3 2" />
        <text x={110} y={92} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.finalExp}>
          Easy part
        </text>
        <text x={110} y={108} textAnchor="middle" fontSize={9} fill="#cbd5e1">
          f^(p^6−1) · f^(p^2+1)
        </text>
        <text x={110} y={128} textAnchor="middle" fontSize={9} fill="#cbd5e1">
          Frobenius (저비용)
        </text>
      </motion.g>

      {/* Hard part - large box */}
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={210} y={50} width={270} height={140} rx={10}
          fill={`${C.finalExp}25`} stroke={C.finalExp} strokeWidth={1.6} />
        <text x={345} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.finalExp}>
          Hard part
        </text>
        <text x={345} y={94} textAnchor="middle" fontSize={9} fill="#cbd5e1">
          f^((p^4 − p^2 + 1) / r)
        </text>
        <line x1={230} y1={104} x2={460} y2={104} stroke={C.finalExp} strokeWidth={0.6} opacity={0.4} />

        <text x={280} y={128} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.doubling}>
          ~400
        </text>
        <text x={280} y={144} textAnchor="middle" fontSize={8} fill="#cbd5e1">cyclotomic sq</text>

        <text x={345} y={128} textAnchor="middle" fontSize={11} fontWeight={800} fill="#e2e8f0">+</text>

        <text x={410} y={128} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.addition}>
          ~30
        </text>
        <text x={410} y={144} textAnchor="middle" fontSize={8} fill="#cbd5e1">Fp12 mults</text>

        <text x={345} y={172} textAnchor="middle" fontSize={9} fill="#94a3b8">
          (Karabina/GS exponentiation)
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={50} y1={222} x2={470} y2={222} stroke="#475569" strokeWidth={0.6} />
        <text x={110} y={244} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.finalExp}>
          ~50m
        </text>
        <text x={110} y={258} textAnchor="middle" fontSize={8} fill="#94a3b8">easy</text>
        <text x={345} y={244} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.finalExp}>
          ~3,550m
        </text>
        <text x={345} y={258} textAnchor="middle" fontSize={8} fill="#94a3b8">hard</text>
        <text x={260} y={282} textAnchor="middle" fontSize={13} fontWeight={800} fill={C.finalExp}>
          Total Final Exp ≈ 3,600 Fp mults
        </text>
      </motion.g>
    </svg>
  );
}

function Step4() {
  // Stacked horizontal bar: Miller (4000) + Final (3600) = 7600
  const TOTAL = 7600;
  const X0 = 60, W_MAX = 400;
  const wMiller = (4000 / TOTAL) * W_MAX;
  const wFinal = (3600 / TOTAL) * W_MAX;
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        BN254 Pairing 총 비용
      </text>

      {/* Top: separated bars */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <text x={X0 - 8} y={86} textAnchor="end" fontSize={9} fontWeight={600} fill={C.miller}>Miller</text>
        <motion.rect x={X0} y={72} height={24} rx={3}
          fill={`${C.miller}30`} stroke={C.miller} strokeWidth={1.2}
          initial={{ width: 0 }} animate={{ width: (4000 / TOTAL) * W_MAX }}
          transition={{ ...sp, duration: 0.6 }} />
        <text x={X0 + (4000 / TOTAL) * W_MAX + 6} y={88} fontSize={10} fontWeight={700} fill={C.miller}>4,000m</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <text x={X0 - 8} y={120} textAnchor="end" fontSize={9} fontWeight={600} fill={C.finalExp}>Final Exp</text>
        <motion.rect x={X0} y={106} height={24} rx={3}
          fill={`${C.finalExp}30`} stroke={C.finalExp} strokeWidth={1.2}
          initial={{ width: 0 }} animate={{ width: (3600 / TOTAL) * W_MAX }}
          transition={{ ...sp, duration: 0.6, delay: 0.2 }} />
        <text x={X0 + (3600 / TOTAL) * W_MAX + 6} y={122} fontSize={10} fontWeight={700} fill={C.finalExp}>3,600m</text>
      </motion.g>

      {/* Stacked total bar */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.45 }}>
        <text x={X0 - 8} y={184} textAnchor="end" fontSize={9} fontWeight={700} fill="#e2e8f0">Total</text>
        <motion.rect x={X0} y={170} width={wMiller} height={28} rx={3}
          fill={`${C.miller}55`} stroke={C.miller} strokeWidth={1.2}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ transformOrigin: `${X0}px 184px` }} />
        <motion.rect x={X0 + wMiller} y={170} width={wFinal} height={28} rx={3}
          fill={`${C.finalExp}55`} stroke={C.finalExp} strokeWidth={1.2}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          style={{ transformOrigin: `${X0 + wMiller}px 184px` }} />
        <text x={X0 + wMiller / 2} y={188} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">Miller</text>
        <text x={X0 + wMiller + wFinal / 2} y={188} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">FinalExp</text>
        <text x={X0 + W_MAX + 8} y={188} fontSize={11} fontWeight={800} fill="#e2e8f0">7,600m</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.1 }}>
        <rect x={120} y={232} width={280} height={48} rx={8}
          fill={`${C.karat}10`} stroke={C.karat} strokeWidth={1} />
        <text x={260} y={252} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.karat}>
          ≈ 0.15 ms / pairing
        </text>
        <text x={260} y={268} textAnchor="middle" fontSize={9} fill="#94a3b8">
          20 ns/Fp mult × 7,600 mults
        </text>
      </motion.g>
    </svg>
  );
}

function Step5() {
  // Without vs With Karatsuba comparison
  const X0 = 130, W_MAX = 320, MAX = 18000;
  const rows = [
    { name: 'Without Karatsuba', m: 18000, ms: '0.36 ms', color: C.naive, badge: null as string | null },
    { name: 'With Karatsuba',    m: 7600,  ms: '0.15 ms', color: C.karat, badge: '2.4x 빠름' },
  ];
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        Karatsuba 적용 효과
      </text>

      {rows.map((r, i) => {
        const w = (r.m / MAX) * W_MAX;
        const y = 70 + i * 90;
        return (
          <g key={r.name}>
            <text x={X0 - 8} y={y + 18} textAnchor="end" fontSize={10}
              fontWeight={700} fill={r.color}>{r.name}</text>
            <motion.rect x={X0} y={y + 4} width={w} height={28} rx={4}
              fill={`${r.color}30`} stroke={r.color} strokeWidth={1.4}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.25 }}
              style={{ transformOrigin: `${X0}px ${y + 18}px` }} />
            <motion.text x={X0 + w + 8} y={y + 22} fontSize={11} fontWeight={800} fill={r.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.25 }}>
              {r.m.toLocaleString()}m
            </motion.text>
            <motion.text x={X0} y={y + 50} fontSize={9} fill="#cbd5e1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.25 }}>
              ≈ {r.ms} / pairing
            </motion.text>
            {r.badge && (
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.85 }}>
                <rect x={X0 + w + 70} y={y + 4} width={86} height={28} rx={14}
                  fill={C.karat} />
                <text x={X0 + w + 113} y={y + 22} textAnchor="middle" fontSize={11}
                  fontWeight={800} fill="#0b1220">{r.badge}</text>
              </motion.g>
            )}
          </g>
        );
      })}

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 1.05 }}>
        <line x1={X0} y1={258} x2={X0 + W_MAX} y2={258} stroke="#475569" strokeWidth={0.6} />
        <text x={X0 + W_MAX / 2} y={278} textAnchor="middle" fontSize={10} fontWeight={700} fill="#e2e8f0">
          Fp12 곱셈 144 → 54 (2.7x) 가 페어링 전체에서 2.4x speedup 으로 환산
        </text>
      </motion.g>
    </svg>
  );
}

function Step6() {
  const apps = [
    { title: 'Groth16 verify', metric: '3', sub: 'pairings' },
    { title: 'BLS signature',  metric: '1', sub: 'pairing' },
    { title: 'EIP-197 (ETH)',  metric: '181k', sub: 'gas / pairing' },
  ];
  return (
    <svg viewBox="0 0 520 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e8f0">
        응용에서 누적되는 Karatsuba 절감
      </text>

      {apps.map((a, i) => {
        const x = 30 + i * 160;
        return (
          <motion.g key={a.title}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.1 + i * 0.18 }}>
            <rect x={x} y={56} width={140} height={120} rx={10}
              fill={`${C.app}12`} stroke={C.app} strokeWidth={1.3} />
            <text x={x + 70} y={80} textAnchor="middle" fontSize={11}
              fontWeight={700} fill={C.app}>{a.title}</text>
            <line x1={x + 20} y1={90} x2={x + 120} y2={90}
              stroke={C.app} strokeWidth={0.5} opacity={0.4} />
            <text x={x + 70} y={128} textAnchor="middle" fontSize={22}
              fontWeight={800} fill={C.app}>{a.metric}</text>
            <text x={x + 70} y={154} textAnchor="middle" fontSize={9} fill="#cbd5e1">{a.sub}</text>
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={40} y={198} width={440} height={70} rx={10}
          fill={`${C.karat}10`} stroke={C.karat} strokeWidth={1.2} strokeDasharray="4 2" />
        <text x={260} y={220} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.karat}>
          누적 영향
        </text>
        <text x={260} y={240} textAnchor="middle" fontSize={9} fill="#cbd5e1">
          Groth16 batch verify N proofs → (N+1) pairings × 2.4x speedup
        </text>
        <text x={260} y={256} textAnchor="middle" fontSize={9} fill="#cbd5e1">
          BLS aggregation (~1M sigs/epoch) → CPU/gas 비용 직접 절반 이하
        </text>
      </motion.g>
    </svg>
  );
}

export default function MillerLoopCostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        step === 0 ? <Step1 /> :
        step === 1 ? <Step2 /> :
        step === 2 ? <Step3 /> :
        step === 3 ? <Step4 /> :
        step === 4 ? <Step5 /> :
        <Step6 />
      )}
    </StepViz>
  );
}
