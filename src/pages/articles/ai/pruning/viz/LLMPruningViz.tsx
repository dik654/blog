import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './LLMPruningVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function SparseGPTOverviewViz() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">SparseGPT: 재학습 없는 LLM 프루닝</text>
      <ModuleBox x={30} y={30} w={110} h={48} label="GPT-175B" sub="Dense 모델" color={COLORS.sparse} />
      <motion.path d="M 140 54 L 168 54" fill="none" stroke="var(--muted-foreground)"
        strokeWidth={1} markerEnd="url(#arrowL)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <ActionBox x={172} y={30} w={130} h={48} label="SparseGPT" sub="Hessian 기반 프루닝" color={COLORS.hessian} />
      <motion.path d="M 302 54 L 330 54" fill="none" stroke="var(--muted-foreground)"
        strokeWidth={1} markerEnd="url(#arrowL)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }} />
      <ModuleBox x={334} y={30} w={120} h={48} label="Sparse GPT" sub="50% 희소" color={COLORS.sparse} />

      {/* 핵심 특징 */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <DataBox x={40} y={100} w={120} h={34} label="128 샘플"
          sub="보정 데이터" color={COLORS.hessian} />
        <DataBox x={180} y={100} w={120} h={34} label="4시간"
          sub="단일 GPU" color={COLORS.perf} />
        <DataBox x={320} y={100} w={120} h={34} label="재학습 불필요"
          sub="One-shot" color={COLORS.wanda} />
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={60} y={148} width={360} height={30} rx={6}
          fill={`${COLORS.sparse}10`} stroke={COLORS.sparse} strokeWidth={0.6} />
        <text x={240} y={167} textAnchor="middle" fontSize={8} fill={COLORS.sparse} fontWeight={600}>
          Frantar & Alistarh (2023): "One-shot 프루닝으로 LLM 압축이 실용적 수준에 도달"
        </text>
      </motion.g>

      <defs>
        <marker id="arrowL" viewBox="0 0 8 8" refX={7} refY={4}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}

function SparseGPTMechanismViz() {
  const cols = 6;
  const cellW = 40;
  const cellH = 22;
  const startX = 100;
  const startY = 35;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">열 단위 순차 프루닝 + 오차 보상</text>
      {/* 행렬 시각화 */}
      <text x={startX - 15} y={startY + 8} textAnchor="end" fontSize={8}
        fill="var(--muted-foreground)">W</text>
      {Array.from({ length: 3 }).map((_, ri) =>
        Array.from({ length: cols }).map((_, ci) => {
          const x = startX + ci * cellW;
          const y = startY + ri * cellH;
          const isPruned = ci < 3;
          const isCompensated = ci === 3;
          const isProcessing = ci === 3;
          return (
            <motion.g key={`${ri}-${ci}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...sp, delay: ci * 0.1 }}>
              <rect x={x} y={y} width={cellW - 2} height={cellH - 2} rx={3}
                fill={isPruned ? `${COLORS.pruned}20` :
                  isProcessing ? `${COLORS.hessian}20` : `${COLORS.sparse}12`}
                stroke={isPruned ? COLORS.pruned :
                  isProcessing ? COLORS.hessian : COLORS.sparse}
                strokeWidth={isProcessing ? 1.5 : 0.5} />
              <text x={x + cellW / 2 - 1} y={y + cellH / 2 + 3} textAnchor="middle"
                fontSize={8} fill={isPruned ? COLORS.pruned :
                  isCompensated ? COLORS.hessian : 'var(--foreground)'}>
                {isPruned ? '0' : isCompensated ? '+δ' : 'w'}
              </text>
            </motion.g>
          );
        })
      )}
      {/* 열 라벨 */}
      {Array.from({ length: cols }).map((_, ci) => {
        const x = startX + ci * cellW;
        const isPruned = ci < 3;
        const isProcessing = ci === 3;
        return (
          <text key={ci} x={x + cellW / 2 - 1} y={startY - 4} textAnchor="middle"
            fontSize={7} fill={isPruned ? COLORS.pruned : isProcessing ? COLORS.hessian : 'var(--muted-foreground)'}
            fontWeight={isProcessing ? 700 : 400}>
            col {ci}
          </text>
        );
      })}
      {/* 프로세스 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <path d="M 120 110 L 220 110" fill="none" stroke={COLORS.pruned}
          strokeWidth={1.5} markerEnd="url(#arrowL)" />
        <text x={170} y={124} textAnchor="middle" fontSize={8}
          fill={COLORS.pruned} fontWeight={600}>처리 완료 (pruned)</text>
        <path d="M 240 110 L 260 110" fill="none" stroke={COLORS.hessian}
          strokeWidth={1.5} />
        <circle cx={260} cy={110} r={3} fill={COLORS.hessian} />
        <text x={265} y={124} fontSize={8}
          fill={COLORS.hessian} fontWeight={600}>현재 열</text>
      </motion.g>
      {/* 보상 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={80} y={140} width={320} height={42} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={156} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={COLORS.hessian}>δ = -w_pruned × H⁻¹_col / H_diag</text>
        <text x={240} y={172} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          프루닝된 열의 오차를 남은 열에 분배 → 전체 출력 변화 최소화
        </text>
      </motion.g>
    </g>
  );
}

function WandaViz() {
  /* |w| × ||x||₂ 스코어 시각화 */
  const scores = [
    { w: 0.8, x_norm: 0.1, score: 0.08, kept: false },
    { w: 0.2, x_norm: 3.5, score: 0.70, kept: true },
    { w: 0.5, x_norm: 2.0, score: 1.00, kept: true },
    { w: 0.9, x_norm: 0.05, score: 0.05, kept: false },
    { w: 0.3, x_norm: 1.8, score: 0.54, kept: true },
    { w: 0.1, x_norm: 0.3, score: 0.03, kept: false },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Wanda: |w| × ||x||₂ 스코어</text>
      {/* 테이블 헤더 */}
      {['|w|', '||x||₂', 'Score', '판정'].map((h, i) => (
        <text key={i} x={130 + i * 80} y={36} textAnchor="middle" fontSize={8}
          fontWeight={700} fill="var(--foreground)">{h}</text>
      ))}
      <line x1={80} y1={40} x2={420} y2={40} stroke="var(--border)" strokeWidth={0.5} />
      {scores.map((s, i) => {
        const y = 50 + i * 22;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={80} y={y - 2} width={340} height={18} rx={3}
              fill={s.kept ? `${COLORS.wanda}06` : `${COLORS.pruned}06`} />
            <text x={130} y={y + 11} textAnchor="middle" fontSize={8}
              fill="var(--foreground)">{s.w.toFixed(1)}</text>
            <text x={210} y={y + 11} textAnchor="middle" fontSize={8}
              fill="var(--foreground)">{s.x_norm.toFixed(1)}</text>
            <text x={290} y={y + 11} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={s.kept ? COLORS.wanda : COLORS.pruned}>
              {s.score.toFixed(2)}
            </text>
            <text x={370} y={y + 11} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={s.kept ? COLORS.wanda : COLORS.pruned}>
              {s.kept ? '유지' : '제거'}
            </text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={80} y={186} width={340} height={14} rx={3}
          fill={`${COLORS.wanda}12`} />
        <text x={250} y={196} textAnchor="middle" fontSize={8}
          fill={COLORS.wanda} fontWeight={600}>
          가중치 크더라도 입력 활성화 0이면 기여도 0 → 제거
        </text>
      </motion.g>
    </g>
  );
}

function PerformanceViz() {
  const results = [
    { model: 'LLaMA-7B', dense: 5.68, sparse: 6.55, wanda: 6.72, nm: 7.26 },
    { model: 'LLaMA-13B', dense: 5.09, sparse: 5.63, wanda: 5.78, nm: 6.15 },
    { model: 'LLaMA-30B', dense: 4.10, sparse: 4.45, wanda: 4.57, nm: 5.02 },
  ];
  const maxPPL = 8;
  const barScale = 35;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">50% 희소성 성능 비교 (PPL ↓ = 더 좋음)</text>
      {/* 범례 */}
      {[
        { label: 'Dense', color: '#888888' },
        { label: 'SparseGPT 50%', color: COLORS.sparse },
        { label: 'Wanda 50%', color: COLORS.wanda },
        { label: 'Wanda 2:4', color: COLORS.perf },
      ].map((l, i) => (
        <g key={i}>
          <rect x={80 + i * 100} y={22} width={10} height={8} rx={2}
            fill={l.color} fillOpacity={0.6} />
          <text x={94 + i * 100} y={30} fontSize={7}
            fill="var(--muted-foreground)">{l.label}</text>
        </g>
      ))}

      {results.map((r, ri) => {
        const baseY = 50 + ri * 50;
        const bars = [
          { val: r.dense, color: '#888888' },
          { val: r.sparse, color: COLORS.sparse },
          { val: r.wanda, color: COLORS.wanda },
          { val: r.nm, color: COLORS.perf },
        ];
        return (
          <motion.g key={ri}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: ri * 0.15 }}>
            <text x={68} y={baseY + 22} textAnchor="end" fontSize={9} fontWeight={600}
              fill="var(--foreground)">{r.model}</text>
            {bars.map((b, bi) => {
              const y = baseY + bi * 10;
              const w = (b.val / maxPPL) * barScale * 5;
              return (
                <g key={bi}>
                  <rect x={75} y={y} width={w} height={8} rx={2}
                    fill={b.color} fillOpacity={0.5} />
                  <text x={75 + w + 3} y={y + 7} fontSize={7}
                    fill={b.color} fontWeight={600}>{b.val.toFixed(2)}</text>
                </g>
              );
            })}
          </motion.g>
        );
      })}
    </g>
  );
}

export default function LLMPruningViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SparseGPTOverviewViz />}
          {step === 1 && <SparseGPTMechanismViz />}
          {step === 2 && <WandaViz />}
          {step === 3 && <PerformanceViz />}
        </svg>
      )}
    </StepViz>
  );
}
