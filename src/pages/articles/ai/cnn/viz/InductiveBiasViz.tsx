import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import {
  STEPS, sp, C, IMG, POS_A, POS_B,
  OVERVIEW_CARDS, DEPTH_LAYERS,
} from './InductiveBiasVizData';
import BiasOverview from './BiasOverview';
import BiasHierarchy from './BiasHierarchy';

export default function InductiveBiasViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <BiasOverview cards={OVERVIEW_CARDS} sp={sp} />}

          {/* Step 1: Locality - 3x3 kernel on grid with only 9 connections */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={35} y={12} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="var(--foreground)">입력 (5×5)</text>
              {IMG.map((row, r) => row.map((v, c) => {
                const inK = r >= 1 && r <= 3 && c >= 1 && c <= 3;
                return (
                  <g key={`l${r}${c}`}>
                    <rect x={c * C} y={18 + r * C} width={C} height={C}
                      fill={inK ? '#3b82f630' : v ? '#64748b25' : '#64748b08'}
                      stroke={inK ? '#3b82f6' : '#94a3b8'} strokeWidth={inK ? 1 : 0.3} />
                    <text x={c * C + C / 2} y={18 + r * C + C / 2 + 3}
                      textAnchor="middle" fontSize={9}
                      fill={inK ? '#3b82f6' : 'var(--foreground)'}>{v}</text>
                  </g>
                );
              }))}
              <rect x={C} y={18 + C} width={3 * C} height={3 * C} rx={2}
                fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 2" />
              <text x={110} y={35} fontSize={10} fontWeight={700} fill="var(--foreground)">연결 수 비교</text>
              <rect x={110} y={42} width={22} height={12} rx={2} fill="#3b82f6" />
              <text x={138} y={52} fontSize={10} fontWeight={700} fill="#3b82f6">CNN: 9 (3×3)</text>
              <rect x={110} y={60} width={62} height={12} rx={2} fill="#ef4444" />
              <text x={178} y={70} fontSize={10} fontWeight={700} fill="#ef4444">FC: 25 (5×5)</text>
              <rect x={300} y={20} width={185} height={70} rx={6}
                fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
              <text x={392} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
                수용야(Receptive Field)
              </text>
              <text x={310} y={55} fontSize={10} fill="var(--foreground)">
                한 출력 뉴런이 볼 수 있는 입력 범위
              </text>
              <text x={310} y={70} fontSize={10} fill="#3b82f6" fontWeight={600}>
                Conv 3×3 → 수용야 = 9 픽셀
              </text>
              <text x={310} y={82} fontSize={10} fill="#ef4444">
                FC → 전체 25 픽셀 (정보 낭비)
              </text>
            </motion.g>
          )}

          {/* Step 2: Translation invariance */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={220} y={12} textAnchor="middle" fontSize={10}
                fontWeight={700} fill="#8b5cf6">커널 1개가 모든 위치 순회</text>
              <text x={35} y={24} textAnchor="middle" fontSize={9} fill="var(--foreground)">위치 A</text>
              {POS_A.map((row, r) => row.map((v, c) => {
                const hit = r <= 2 && c <= 1;
                return (
                  <rect key={`a${r}${c}`} x={c * C} y={30 + r * C} width={C} height={C}
                    fill={hit && v ? '#8b5cf640' : v ? '#64748b20' : '#64748b08'}
                    stroke={hit ? '#8b5cf6' : '#94a3b850'} strokeWidth={hit ? 0.8 : 0.3} />
                );
              }))}
              <text x={35} y={108} textAnchor="middle" fontSize={10}
                fontWeight={700} fill="#10b981">출력: 2.0</text>
              <text x={90} y={70} textAnchor="middle" fontSize={14}
                fontWeight={700} fill="#8b5cf6">=</text>
              <text x={135} y={24} textAnchor="middle" fontSize={9} fill="var(--foreground)">위치 B</text>
              {POS_B.map((row, r) => row.map((v, c) => {
                const hit = r >= 2 && c >= 3;
                return (
                  <rect key={`b${r}${c}`} x={100 + c * C} y={30 + r * C} width={C} height={C}
                    fill={hit && v ? '#8b5cf640' : v ? '#64748b20' : '#64748b08'}
                    stroke={hit ? '#8b5cf6' : '#94a3b850'} strokeWidth={hit ? 0.8 : 0.3} />
                );
              }))}
              <text x={135} y={108} textAnchor="middle" fontSize={10}
                fontWeight={700} fill="#10b981">출력: 2.0</text>
              <rect x={215} y={25} width={270} height={90} rx={6}
                fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
              <text x={350} y={42} textAnchor="middle" fontSize={10}
                fontWeight={700} fill="#8b5cf6">평행이동 불변성</text>
              <text x={225} y={58} fontSize={10} fill="var(--foreground)">
                같은 패턴 → 어디서나 같은 출력
              </text>
              <text x={225} y={74} fontSize={10} fill="#10b981" fontWeight={600}>
                가중치 공유 → 파라미터 25→9 (64% 절약)
              </text>
              <text x={225} y={90} fontSize={10} fill="var(--muted-foreground)">
                FC: 위치마다 별도 가중치 필요
              </text>
              <text x={225} y={106} fontSize={10} fill="#ef4444">
                한계: 물체의 상대적 배치 정보 손실
              </text>
            </motion.g>
          )}

          {step === 3 && <BiasHierarchy layers={DEPTH_LAYERS} sp={sp} />}
        </svg>
      )}
    </StepViz>
  );
}
