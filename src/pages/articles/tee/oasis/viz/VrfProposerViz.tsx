import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '에포크 비콘 — 600 블록마다 VRF 출력', body: 'Beacon.Entropy = VRF(prev_beacon, height) — 32바이트 무작위.\n미리 예측 불가, 이후 결정적.' },
  { label: 'PRNG seed 생성', body: 'seed = hash(beacon.Entropy, height, round).\n같은 입력 → 같은 seed (모든 노드 동일 결과).' },
  { label: 'Weighted random 선출', body: 'r = rand(seed) % totalPower.\n검증인 power 누적합으로 가중치 비례 선택.' },
  { label: 'Proposer 결정 — 조작 불가', body: 'VRF 가 미리 예측 불가 → proposer 매수·합법 manipulation 차단.\n스테이킹 많을수록 선출 확률↑ but 결정적.' },
];

export default function VrfProposerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Beacon */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
            <ModuleBox x={20} y={20} w={130} h={50}
              label="Beacon" sub="VRF entropy 32B" color="#6366f1" />
          </motion.g>

          {/* arrow to seed */}
          <motion.line x1={150} y1={45} x2={210} y2={45}
            stroke={step >= 1 ? '#3b82f6' : 'var(--border)'} strokeWidth={1.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} />

          {/* hash combiner */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.3 }}>
            <ActionBox x={210} y={20} w={120} h={50}
              label="hash(...)" sub="entropy·height·round" color="#10b981" />
          </motion.g>

          {/* arrow to PRNG */}
          <motion.line x1={330} y1={45} x2={365} y2={45}
            stroke={step >= 2 ? '#10b981' : 'var(--border)'} strokeWidth={1.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: step >= 2 ? 1 : 0 }} />

          {/* PRNG seed */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <DataBox x={365} y={32} w={100} h={26}
              label="seed → r" color="#f59e0b" outlined={step >= 2} />
          </motion.g>

          {/* Validators with power bars */}
          {[
            { name: 'V0', power: 30, color: '#6366f1' },
            { name: 'V1', power: 50, color: '#10b981' },
            { name: 'V2', power: 20, color: '#f59e0b' },
            { name: 'V3', power: 40, color: '#a855f7' },
            { name: 'V4', power: 60, color: '#ec4899' },
          ].map((v, i) => {
            const x = 30 + i * 90;
            const isSelected = step === 3 && v.name === 'V4'; // pick highest power
            return (
              <g key={v.name}>
                <motion.rect x={x} y={140 - v.power} width={60} height={v.power} rx={3}
                  fill={isSelected ? `${v.color}40` : `${v.color}15`}
                  stroke={isSelected ? v.color : `${v.color}40`}
                  strokeWidth={isSelected ? 1.5 : 0.6}
                  animate={{ opacity: step >= 2 ? 1 : 0.4 }} />
                <text x={x + 30} y={155} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">{v.name}</text>
                <text x={x + 30} y={166} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">power {v.power}</text>
                {isSelected && (
                  <motion.g initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                    <text x={x + 30} y={130 - v.power} textAnchor="middle" fontSize={11}
                      fill="#ec4899" fontWeight={700}>★</text>
                    <text x={x + 30} y={185} textAnchor="middle" fontSize={9}
                      fill="#ec4899" fontWeight={600}>proposer</text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* axis */}
          <line x1={20} y1={140} x2={460} y2={140} stroke="var(--border)" strokeWidth={0.5} />
          <text x={20} y={195} fontSize={8} fill="var(--muted-foreground)">
            Σ power = totalPower (cumulative selection)
          </text>

          {/* Step 3 callout */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={215} textAnchor="middle" fontSize={9} fill="#ec4899" fontWeight={600}>
                deterministic + unpredictable = manipulation-proof
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
