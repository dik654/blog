import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const FRI_COLOR = '#10b981';
const KZG_COLOR = '#6366f1';
const WRAP_COLOR = '#f59e0b';

const STEPS = [
  {
    label: '① 개요: FRI vs KZG',
    body: 'FRI는 hash 기반 post-quantum, KZG는 pairing 기반 constant-size.\n두 polynomial commitment scheme의 trade-off를 4단계로 비교.',
  },
  {
    label: '② Proof 크기 (log scale)',
    body: 'FRI: 10~100KB (Merkle path 다수).\nKZG: 48B (BLS12-381 G1 point 1개).\n로그 스케일로 표현해도 자릿수가 다르다.',
  },
  {
    label: '③ Verifier 성능 & 비용',
    body: 'FRI verifier: hash 수천 회, on-chain gas 비쌈.\nKZG verifier: pairing 2회, 상수 시간.\nL1에서는 KZG, L2 recursive에서는 FRI가 유리.',
  },
  {
    label: '④ Plonky3 전략: FRI → Groth16 wrap',
    body: 'Prove layer는 FRI (빠른 prover, trusted setup 없음).\n최종 wrap은 Groth16/PLONK (48B proof, L1 검증 저렴).\n두 방식의 장점만 취합하는 이중 레이어.',
  },
];

const FRI_TRAITS = [
  { k: 'Setup', v: 'Trustless' },
  { k: 'PQ', v: 'Secure' },
  { k: 'Prover', v: 'Fast' },
  { k: 'Proof', v: '10-100KB' },
];

const KZG_TRAITS = [
  { k: 'Setup', v: 'Trusted' },
  { k: 'PQ', v: 'Broken' },
  { k: 'Prover', v: 'Medium' },
  { k: 'Proof', v: '48 bytes' },
];

// 로그 스케일 암시용 막대 길이 (실제 비율이 아닌 로그 감각)
const SIZE_BARS = [
  { label: 'FRI ~50KB', color: FRI_COLOR, width: 320, text: '50,000 B' },
  { label: 'KZG 48B', color: KZG_COLOR, width: 18, text: '48 B' },
];

const PERF = [
  { metric: 'Verifier time', fri: 'ms~s', kzg: 'μs (2 pairings)', friPct: 0.85, kzgPct: 0.15 },
  { metric: 'On-chain gas', fri: 'Very High', kzg: 'Low', friPct: 0.9, kzgPct: 0.2 },
  { metric: 'Prover time', fri: 'Fast', kzg: 'Medium', friPct: 0.3, kzgPct: 0.55 },
];

export default function PCSCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ① 좌/우 2카드 개요 */}
          {step === 0 && (
            <g>
              {[
                { x: 20, title: 'FRI', sub: 'STARK / Hash-based', color: FRI_COLOR, traits: FRI_TRAITS },
                { x: 250, title: 'KZG', sub: 'SNARK / Pairing', color: KZG_COLOR, traits: KZG_TRAITS },
              ].map((card) => (
                <g key={card.title}>
                  <motion.rect
                    x={card.x} y={15} width={210} height={180} rx={8}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    fill={`${card.color}10`} stroke={card.color} strokeWidth={1.2}
                  />
                  <text x={card.x + 14} y={38} fontSize={14} fontWeight={700} fill={card.color}>{card.title}</text>
                  <text x={card.x + 14} y={54} fontSize={9} fill={card.color} opacity={0.7}>{card.sub}</text>
                  <line x1={card.x + 14} y1={64} x2={card.x + 196} y2={64} stroke={card.color} strokeWidth={0.4} opacity={0.4} />
                  {card.traits.map((t, i) => (
                    <motion.g key={t.k}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}>
                      <text x={card.x + 14} y={86 + i * 28} fontSize={10} fill={card.color} opacity={0.6}>{t.k}</text>
                      <text x={card.x + 196} y={86 + i * 28} fontSize={11} fontWeight={600} fill={card.color} textAnchor="end">{t.v}</text>
                    </motion.g>
                  ))}
                </g>
              ))}
            </g>
          )}

          {/* ② Proof 크기 막대 (로그 스케일 암시) */}
          {step === 1 && (
            <g>
              <text x={20} y={30} fontSize={11} fontWeight={600} fill="#9ca3af">Proof size (log-scale visual)</text>
              {SIZE_BARS.map((b, i) => (
                <g key={b.label}>
                  <text x={20} y={70 + i * 60} fontSize={10} fontWeight={600} fill={b.color}>{b.label}</text>
                  <motion.rect
                    x={20} y={78 + i * 60} height={22} rx={4}
                    initial={{ width: 0 }}
                    animate={{ width: b.width }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    fill={`${b.color}30`} stroke={b.color} strokeWidth={1}
                  />
                  <text x={25 + b.width} y={93 + i * 60} fontSize={9} fontWeight={600} fill={b.color}>{b.text}</text>
                </g>
              ))}
              {/* 로그 축 표시 */}
              <line x1={20} y1={180} x2={460} y2={180} stroke="#9ca3af" strokeWidth={0.5} opacity={0.4} />
              {['10B', '100B', '1KB', '10KB', '100KB'].map((t, i) => (
                <g key={t}>
                  <line x1={20 + i * 100} y1={178} x2={20 + i * 100} y2={184} stroke="#9ca3af" strokeWidth={0.5} opacity={0.5} />
                  <text x={20 + i * 100} y={198} fontSize={8} fill="#9ca3af" textAnchor="middle">{t}</text>
                </g>
              ))}
              <text x={20} y={212} fontSize={8} fill="#9ca3af" opacity={0.7}>* 실제 비율이 아닌 자릿수 감각용</text>
            </g>
          )}

          {/* ③ verifier 성능/비용 비교 */}
          {step === 2 && (
            <g>
              <text x={20} y={25} fontSize={11} fontWeight={600} fill="#9ca3af">Verifier 성능 / 비용</text>
              <text x={160} y={42} fontSize={9} fontWeight={600} fill={FRI_COLOR} textAnchor="middle">FRI</text>
              <text x={360} y={42} fontSize={9} fontWeight={600} fill={KZG_COLOR} textAnchor="middle">KZG</text>
              {PERF.map((p, i) => {
                const y = 60 + i * 45;
                return (
                  <g key={p.metric}>
                    <text x={20} y={y + 14} fontSize={9} fill="#d1d5db" fontWeight={500}>{p.metric}</text>
                    {/* FRI bar */}
                    <rect x={100} y={y + 4} width={120} height={14} rx={3} fill={`${FRI_COLOR}10`} stroke={`${FRI_COLOR}30`} strokeWidth={0.5} />
                    <motion.rect
                      x={100} y={y + 4} height={14} rx={3}
                      initial={{ width: 0 }}
                      animate={{ width: 120 * p.friPct }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      fill={`${FRI_COLOR}60`} stroke={FRI_COLOR} strokeWidth={0.8}
                    />
                    <text x={110} y={y + 14} fontSize={8} fill={FRI_COLOR} fontWeight={600}>{p.fri}</text>
                    {/* KZG bar */}
                    <rect x={260} y={y + 4} width={200} height={14} rx={3} fill={`${KZG_COLOR}10`} stroke={`${KZG_COLOR}30`} strokeWidth={0.5} />
                    <motion.rect
                      x={260} y={y + 4} height={14} rx={3}
                      initial={{ width: 0 }}
                      animate={{ width: 200 * p.kzgPct }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 0.1 }}
                      fill={`${KZG_COLOR}60`} stroke={KZG_COLOR} strokeWidth={0.8}
                    />
                    <text x={270} y={y + 14} fontSize={8} fill={KZG_COLOR} fontWeight={600}>{p.kzg}</text>
                  </g>
                );
              })}
              <text x={20} y={210} fontSize={8} fill="#9ca3af" opacity={0.7}>막대가 길수록 비용/시간 높음</text>
            </g>
          )}

          {/* ④ Plonky3 전략: FRI → wrap → Groth16 퍼널 */}
          {step === 3 && (
            <g>
              <text x={240} y={22} fontSize={11} fontWeight={600} fill="#9ca3af" textAnchor="middle">Plonky3 이중 레이어</text>

              {/* FRI 박스 (큰) */}
              <motion.rect
                x={30} y={70} width={150} height={90} rx={8}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                fill={`${FRI_COLOR}12`} stroke={FRI_COLOR} strokeWidth={1.3}
              />
              <text x={105} y={100} fontSize={14} fontWeight={700} fill={FRI_COLOR} textAnchor="middle">FRI</text>
              <text x={105} y={118} fontSize={9} fill={FRI_COLOR} opacity={0.8} textAnchor="middle">Prove layer</text>
              <text x={105} y={134} fontSize={9} fill={FRI_COLOR} opacity={0.7} textAnchor="middle">Fast prover</text>
              <text x={105} y={150} fontSize={9} fill={FRI_COLOR} opacity={0.6} textAnchor="middle">~50KB proof</text>

              {/* wrap 화살표 (퍼널 효과) */}
              <motion.path
                d="M 180 85 L 290 100 L 290 130 L 180 145 Z"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.18 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                fill={WRAP_COLOR}
              />
              <motion.line
                x1={182} y1={115} x2={288} y2={115}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                stroke={WRAP_COLOR} strokeWidth={1.8}
                markerEnd="url(#arrowWrap)"
              />
              <text x={235} y={108} fontSize={10} fontWeight={700} fill={WRAP_COLOR} textAnchor="middle">wrap</text>
              <text x={235} y={135} fontSize={8} fill={WRAP_COLOR} opacity={0.8} textAnchor="middle">recursive SNARK</text>

              <defs>
                <marker id="arrowWrap" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L5,3 L0,6 Z" fill={WRAP_COLOR} />
                </marker>
              </defs>

              {/* Groth16 박스 (작은) */}
              <motion.rect
                x={300} y={90} width={150} height={50} rx={8}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                fill={`${KZG_COLOR}12`} stroke={KZG_COLOR} strokeWidth={1.3}
              />
              <text x={375} y={110} fontSize={12} fontWeight={700} fill={KZG_COLOR} textAnchor="middle">Groth16 / PLONK</text>
              <text x={375} y={126} fontSize={9} fill={KZG_COLOR} opacity={0.75} textAnchor="middle">Final wrap · 48B</text>

              {/* 하단 설명 */}
              <text x={105} y={182} fontSize={8} fill="#9ca3af" textAnchor="middle" opacity={0.8}>빠른 prover</text>
              <text x={235} y={182} fontSize={8} fill="#9ca3af" textAnchor="middle" opacity={0.8}>크기 축소</text>
              <text x={375} y={182} fontSize={8} fill="#9ca3af" textAnchor="middle" opacity={0.8}>L1 저렴 검증</text>

              <text x={240} y={205} fontSize={9} fill="#d1d5db" textAnchor="middle" fontWeight={500}>best of both worlds</text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
