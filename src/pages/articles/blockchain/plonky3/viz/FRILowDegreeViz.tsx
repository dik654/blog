import { useState } from 'react';
import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.55 };

const C = {
  even: '#10b981',
  odd: '#f59e0b',
  alpha: '#ec4899',
  fold: '#6366f1',
  sound: '#8b5cf6',
  muted: '#94a3b8',
};

// 8개 계수: c0..c7 (degree 7 polynomial)
const COEFFS = [
  { i: 0, v: 'c₀', parity: 'even' as const },
  { i: 1, v: 'c₁', parity: 'odd' as const },
  { i: 2, v: 'c₂', parity: 'even' as const },
  { i: 3, v: 'c₃', parity: 'odd' as const },
  { i: 4, v: 'c₄', parity: 'even' as const },
  { i: 5, v: 'c₅', parity: 'odd' as const },
  { i: 6, v: 'c₆', parity: 'even' as const },
  { i: 7, v: 'c₇', parity: 'odd' as const },
];

const STEPS = [
  {
    label: '① 문제 정의 — Low-Degree Testing',
    body: 'degree N polynomial f(x)가 정말 N 미만인지 증명. Naive: N+1개 evaluation 전수 검증 (선형 비용). FRI: degree를 매 단계 절반으로 접어 logarithmic 검증.',
  },
  {
    label: '② 분할 — f(x) = f_even(x²) + x·f_odd(x²)',
    body: '8개 계수를 짝수 인덱스(c₀,c₂,c₄,c₆ → f_even)와 홀수 인덱스(c₁,c₃,c₅,c₇ → f_odd)로 분리. 각 다항식의 degree는 원본의 절반.',
  },
  {
    label: '③ 접기 — f\'(y) = f_even(y) + α·f_odd(y)',
    body: 'Random challenge α로 두 다항식을 선형 결합. degree(f\') = degree(f) / 2. α는 verifier 또는 Fiat-Shamir로 생성, prover가 미리 알 수 없음.',
  },
  {
    label: '④ 반복 — degree N → N/2 → N/4 → ... → 1',
    body: '동일한 split + fold를 log₂(N)번 반복. degree 8 → 4 → 2 → 1. 매 iteration마다 새 commitment 전송, 검증 비용은 logarithmic.',
  },
  {
    label: '⑤ Final + Soundness',
    body: 'Constant polynomial 도달 후 verifier가 q개 query로 consistency 확인. Rate ρ가 작을수록 query 적게 필요, 하지만 prover 비용 증가. Conjectured soundness ~100-bit.',
  },
];

// degree bars data (step 4)
const BARS = [
  { iter: 0, deg: 8, len: 280 },
  { iter: 1, deg: 4, len: 140 },
  { iter: 2, deg: 2, len: 70 },
  { iter: 3, deg: 1, len: 35 },
];

const RATES = [
  { rho: '1/2', label: 'ρ=1/2', queries: 80, sound: '~100b', cost: '낮음' },
  { rho: '1/4', label: 'ρ=1/4', queries: 50, sound: '~100b', cost: '중간' },
  { rho: '1/8', label: 'ρ=1/8', queries: 35, sound: '~100b', cost: '높음' },
];

export default function FRILowDegreeViz() {
  const [rateIdx, setRateIdx] = useState(1);

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ============ Step 0: 문제 정의 ============ */}
          {step === 0 && (
            <g>
              {/* Naive 박스 */}
              <motion.rect x={20} y={30} width={200} height={70} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}
                fill={`${C.muted}10`} stroke={C.muted} strokeWidth={0.8} />
              <text x={120} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.muted}>
                Naive 방식
              </text>
              <text x={120} y={64} textAnchor="middle" fontSize={8} fill={C.muted}>
                f(x) 모든 N+1 evaluation 검증
              </text>
              <text x={120} y={80} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
                비용: O(N) — 선형
              </text>
              <text x={120} y={93} textAnchor="middle" fontSize={7} fill={C.muted}>
                degree 큰 경우 비현실적
              </text>

              {/* FRI 박스 */}
              <motion.rect x={260} y={30} width={200} height={70} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}
                fill={`${C.fold}15`} stroke={C.fold} strokeWidth={1.4} />
              <text x={360} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fold}>
                FRI 방식
              </text>
              <text x={360} y={64} textAnchor="middle" fontSize={8} fill={C.fold}>
                degree 절반씩 접고 q개만 query
              </text>
              <text x={360} y={80} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.even}>
                비용: O(log N) — 로그
              </text>
              <text x={360} y={93} textAnchor="middle" fontSize={7} fill={C.fold}>
                Reed-Solomon code 활용
              </text>

              {/* 화살표 */}
              <motion.path d="M 230 65 L 250 65" stroke={C.fold} strokeWidth={1.2}
                fill="none" markerEnd="url(#arrow0)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <defs>
                <marker id="arrow0" viewBox="0 0 10 10" refX={8} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.fold} />
                </marker>
              </defs>

              {/* 핵심 문구 */}
              <text x={240} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sound}>
                "polynomial f(x)의 degree &lt; N 임을 증명"
              </text>
              <text x={240} y={158} textAnchor="middle" fontSize={9} fill={C.muted}>
                STARK proof system의 핵심 building block
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill={C.fold}>
                trusted setup 불필요 · post-quantum 안전 · hash 기반
              </text>
            </g>
          )}

          {/* ============ Step 1: split ============ */}
          {step === 1 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fold}>
                f(x) = c₀ + c₁x + c₂x² + ... + c₇x⁷
              </text>

              {/* 원본 8개 계수 박스 */}
              {COEFFS.map((c, idx) => {
                const x = 80 + idx * 40;
                const targetX = c.parity === 'even'
                  ? 50 + Math.floor(c.i / 2) * 50
                  : 270 + Math.floor(c.i / 2) * 50;
                const targetY = 150;
                const color = c.parity === 'even' ? C.even : C.odd;
                return (
                  <g key={c.i}>
                    <motion.rect
                      width={32} height={28} rx={4}
                      initial={{ x: x, y: 40, fill: `${C.muted}15`, stroke: C.muted }}
                      animate={{ x: targetX, y: targetY, fill: `${color}25`, stroke: color }}
                      transition={{ ...sp, delay: 0.2 + idx * 0.05 }}
                      strokeWidth={1.2} />
                    <motion.text fontSize={9} fontWeight={700} textAnchor="middle"
                      initial={{ x: x + 16, y: 58, fill: C.muted }}
                      animate={{ x: targetX + 16, y: targetY + 18, fill: color }}
                      transition={{ ...sp, delay: 0.2 + idx * 0.05 }}>
                      {c.v}
                    </motion.text>
                  </g>
                );
              })}

              {/* even/odd 라벨 */}
              <motion.text x={130} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.even}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                f_even(y): 짝수 인덱스
              </motion.text>
              <motion.text x={350} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.odd}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                f_odd(y): 홀수 인덱스
              </motion.text>

              {/* 식 */}
              <motion.text x={130} y={200} textAnchor="middle" fontSize={9} fill={C.even}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                = c₀ + c₂y + c₄y² + c₆y³
              </motion.text>
              <motion.text x={350} y={200} textAnchor="middle" fontSize={9} fill={C.odd}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                = c₁ + c₃y + c₅y² + c₇y³
              </motion.text>

              {/* identity */}
              <motion.text x={240} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fold}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                f(x) = f_even(x²) + x · f_odd(x²)
              </motion.text>
            </g>
          )}

          {/* ============ Step 2: fold with α ============ */}
          {step === 2 && (
            <g>
              {/* f_even 박스 */}
              <motion.rect x={30} y={50} width={130} height={40} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}
                fill={`${C.even}20`} stroke={C.even} strokeWidth={1.4} />
              <text x={95} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.even}>
                f_even(y)
              </text>
              <text x={95} y={82} textAnchor="middle" fontSize={8} fill={C.even}>
                degree N/2
              </text>

              {/* α 원 */}
              <motion.circle cx={205} cy={70} r={20}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.3 }}
                fill={`${C.alpha}30`} stroke={C.alpha} strokeWidth={1.6} />
              <text x={205} y={67} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.alpha}>
                α
              </text>
              <text x={205} y={78} textAnchor="middle" fontSize={7} fill={C.alpha}>
                random
              </text>

              {/* f_odd 박스 */}
              <motion.rect x={250} y={50} width={130} height={40} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}
                fill={`${C.odd}20`} stroke={C.odd} strokeWidth={1.4} />
              <text x={315} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.odd}>
                f_odd(y)
              </text>
              <text x={315} y={82} textAnchor="middle" fontSize={8} fill={C.odd}>
                degree N/2
              </text>

              {/* 합산 화살표 */}
              <motion.path d="M 95 95 Q 95 130 200 140" stroke={C.even} strokeWidth={1}
                fill="none" strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.path d="M 315 95 Q 315 130 230 140" stroke={C.odd} strokeWidth={1}
                fill="none" strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.path d="M 215 92 Q 215 120 215 138" stroke={C.alpha} strokeWidth={1}
                fill="none" strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.6 }} />

              {/* f' 박스 */}
              <motion.rect x={120} y={145} width={200} height={40} rx={6}
                initial={{ opacity: 0, y: 130 }} animate={{ opacity: 1, y: 145 }}
                transition={{ ...sp, delay: 0.7 }}
                fill={`${C.fold}20`} stroke={C.fold} strokeWidth={1.6} />
              <text x={220} y={163} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fold}>
                f'(y) = f_even(y) + α · f_odd(y)
              </text>
              <text x={220} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fold}>
                degree(f') = degree(f) / 2
              </text>

              {/* 노트 */}
              <text x={395} y={205} textAnchor="end" fontSize={7} fill={C.muted}>
                Merkle commit(f') 전송
              </text>
            </g>
          )}

          {/* ============ Step 3: 반복 (degree 절반씩) ============ */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fold}>
                degree 8 → 4 → 2 → 1 (log₂N iterations)
              </text>

              {BARS.map((b, idx) => {
                const y = 45 + idx * 38;
                return (
                  <g key={b.iter}>
                    {/* iteration 라벨 */}
                    <text x={20} y={y + 16} fontSize={9} fontWeight={600} fill={C.fold}>
                      iter {b.iter}
                    </text>
                    {/* 막대 배경 */}
                    <rect x={70} y={y + 4} width={300} height={20} rx={3}
                      fill={`${C.muted}10`} stroke={C.muted} strokeWidth={0.4} />
                    {/* 막대 */}
                    <motion.rect x={70} y={y + 4} height={20} rx={3}
                      initial={{ width: 0 }} animate={{ width: b.len }}
                      transition={{ ...sp, delay: 0.15 * idx }}
                      fill={`${C.fold}30`} stroke={C.fold} strokeWidth={1.2} />
                    {/* degree 텍스트 */}
                    <motion.text x={75 + b.len} y={y + 18} fontSize={9} fontWeight={700} fill={C.fold}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.25 + 0.15 * idx }}>
                      degree {b.deg}
                    </motion.text>
                    {/* fold 화살표 */}
                    {idx < BARS.length - 1 && (
                      <motion.path d={`M 60 ${y + 28} L 60 ${y + 38}`} stroke={C.alpha}
                        strokeWidth={1} fill="none" markerEnd="url(#arrFold)"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ ...sp, delay: 0.3 + 0.15 * idx }} />
                    )}
                  </g>
                );
              })}
              <defs>
                <marker id="arrFold" viewBox="0 0 10 10" refX={5} refY={9}
                  markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M 0 0 L 10 0 L 5 10 z" fill={C.alpha} />
                </marker>
              </defs>

              {/* α 라벨들 */}
              {[0, 1, 2].map((i) => (
                <motion.text key={i} x={395} y={68 + i * 38} fontSize={8} fontWeight={600} fill={C.alpha}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.15 }}>
                  +α{i}
                </motion.text>
              ))}

              <text x={240} y={210} textAnchor="middle" fontSize={9} fill={C.muted}>
                매 단계 새 random α · 새 Merkle commitment
              </text>
            </g>
          )}

          {/* ============ Step 4: final + soundness ============ */}
          {step === 4 && (
            <g>
              {/* Final constant */}
              <motion.rect x={20} y={30} width={150} height={50} rx={6}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={sp}
                fill={`${C.even}20`} stroke={C.even} strokeWidth={1.6} />
              <text x={95} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.even}>
                Final: constant
              </text>
              <text x={95} y={65} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.even}>
                f_final = c
              </text>
              <text x={95} y={76} textAnchor="middle" fontSize={7} fill={C.even}>
                작은 수의 값만 verify
              </text>

              {/* Verifier query */}
              <motion.rect x={190} y={30} width={130} height={50} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}
                fill={`${C.alpha}15`} stroke={C.alpha} strokeWidth={1.4} />
              <text x={255} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.alpha}>
                Verifier
              </text>
              <text x={255} y={62} textAnchor="middle" fontSize={8} fill={C.alpha}>
                q개 random query
              </text>
              <text x={255} y={74} textAnchor="middle" fontSize={8} fill={C.alpha}>
                consistency check
              </text>

              {/* Soundness 박스 */}
              <motion.rect x={340} y={30} width={120} height={50} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}
                fill={`${C.sound}15`} stroke={C.sound} strokeWidth={1.4} />
              <text x={400} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sound}>
                Soundness
              </text>
              <text x={400} y={62} textAnchor="middle" fontSize={8} fill={C.sound}>
                {RATES[rateIdx].sound}
              </text>
              <text x={400} y={74} textAnchor="middle" fontSize={7} fill={C.sound}>
                conjectured
              </text>

              {/* Rate 토글 */}
              <text x={20} y={108} fontSize={9} fontWeight={700} fill={C.fold}>
                Rate ρ 선택:
              </text>
              {RATES.map((r, i) => (
                <g key={r.rho} style={{ cursor: 'pointer' }}
                  onClick={() => setRateIdx(i)}>
                  <motion.rect x={100 + i * 90} y={95} width={75} height={22} rx={4}
                    animate={{
                      fill: i === rateIdx ? `${C.sound}30` : `${C.muted}10`,
                      stroke: i === rateIdx ? C.sound : C.muted,
                      strokeWidth: i === rateIdx ? 1.5 : 0.6,
                    }} transition={sp} />
                  <text x={137 + i * 90} y={110} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={i === rateIdx ? C.sound : C.muted}>
                    {r.label}
                  </text>
                </g>
              ))}

              {/* Parameters 표시 */}
              <motion.rect x={20} y={130} width={440} height={70} rx={6}
                fill={`${C.fold}08`} stroke={C.fold} strokeWidth={0.6} />
              <text x={35} y={148} fontSize={9} fontWeight={700} fill={C.fold}>
                Parameters (ρ = {RATES[rateIdx].rho})
              </text>
              <text x={35} y={166} fontSize={8} fill={C.muted}>
                Queries q:
              </text>
              <motion.text key={`q-${rateIdx}`} x={100} y={166} fontSize={9} fontWeight={700}
                fill={C.alpha}
                initial={{ opacity: 0, y: 162 }} animate={{ opacity: 1, y: 166 }} transition={sp}>
                {RATES[rateIdx].queries}개
              </motion.text>
              <text x={170} y={166} fontSize={7} fill={C.muted}>
                (작을수록 적게)
              </text>

              <text x={35} y={183} fontSize={8} fill={C.muted}>
                Prover cost:
              </text>
              <motion.text key={`c-${rateIdx}`} x={100} y={183} fontSize={9} fontWeight={700}
                fill={C.fold}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                {RATES[rateIdx].cost}
              </motion.text>
              <text x={170} y={183} fontSize={7} fill={C.muted}>
                (작을수록 RS 확장 큼)
              </text>

              <text x={250} y={166} fontSize={8} fill={C.muted}>
                Trade-off: ρ ↓ → q ↓, prover work ↑
              </text>
              <text x={250} y={183} fontSize={8} fill={C.sound}>
                실용 기본값: ρ = 1/4 (Plonky3)
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
