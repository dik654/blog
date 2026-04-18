import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Teacher 모델 */}
          <ModuleBox x={10} y={20} w={100} h={55} label="Teacher" sub="대규모 모델" color={C.teacher} />

          {/* Teacher → soft target 화살표 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={110} y1={47} x2={150} y2={47}
                stroke={C.teacher} strokeWidth={1} markerEnd="url(#kd-arr-t)" />
            </motion.g>
          )}

          {/* Hard label */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={155} y={10} width={90} height={28} rx={4}
                fill={`${C.hard}12`} stroke={C.hard} strokeWidth={0.8} />
              <text x={200} y={22} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.hard}>Hard Label</text>
              <text x={200} y={33} textAnchor="middle" fontSize={7.5} fill={C.muted}>[0, 1, 0]</text>
            </motion.g>
          )}

          {/* Soft target */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={155} y={48} width={90} height={28} rx={4}
                fill={`${C.soft}12`} stroke={C.soft} strokeWidth={0.8} />
              <text x={200} y={60} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.soft}>Soft Target</text>
              <text x={200} y={71} textAnchor="middle" fontSize={7.5} fill={C.muted}>[0.05, 0.85, 0.10]</text>
            </motion.g>
          )}

          {/* Temperature knob */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <circle cx={200} cy={110} r={22} fill={`${C.temp}10`} stroke={C.temp} strokeWidth={1} />
              <text x={200} y={107} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.temp}>T</text>
              <text x={200} y={118} textAnchor="middle" fontSize={7} fill={C.muted}>Temperature</text>

              {/* T=1 bar */}
              <rect x={140} y={145} width={10} height={30} rx={2} fill={C.hard} opacity={0.7} />
              <rect x={153} y={170} width={10} height={5} rx={2} fill={C.hard} opacity={0.3} />
              <rect x={166} y={168} width={10} height={7} rx={2} fill={C.hard} opacity={0.3} />
              <text x={158} y={185} textAnchor="middle" fontSize={7} fill={C.muted}>T=1</text>

              {/* T=5 bar — 더 평탄 */}
              <rect x={210} y={155} width={10} height={20} rx={2} fill={C.soft} opacity={0.7} />
              <rect x={223} y={162} width={10} height={13} rx={2} fill={C.soft} opacity={0.5} />
              <rect x={236} y={160} width={10} height={15} rx={2} fill={C.soft} opacity={0.5} />
              <text x={228} y={185} textAnchor="middle" fontSize={7} fill={C.muted}>T=5</text>
            </motion.g>
          )}

          {/* Student 모델 */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              {/* soft target → student 화살표 */}
              <line x1={245} y1={62} x2={290} y2={50}
                stroke={C.soft} strokeWidth={1} markerEnd="url(#kd-arr-s)" />
              <ModuleBox x={295} y={20} w={90} h={55} label="Student" sub="경량 모델" color={C.student} />

              {/* 크기 비교 */}
              <text x={340} y={95} textAnchor="middle" fontSize={8} fill={C.student}>1/4 ~ 1/10 크기</text>
              <text x={340} y={106} textAnchor="middle" fontSize={7.5} fill={C.muted}>95%+ 성능 유지</text>
            </motion.g>
          )}

          {/* Dark Knowledge 강조 */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={310} y={130} width={150} height={50} rx={8}
                fill={`${C.soft}08`} stroke={C.soft} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={385} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.soft}>Dark Knowledge</text>
              <text x={385} y={163} textAnchor="middle" fontSize={7.5} fill={C.muted}>오답 확률 속 클래스 관계 정보</text>
              <text x={385} y={174} textAnchor="middle" fontSize={7.5} fill={C.muted}>→ Student 일반화 향상</text>
            </motion.g>
          )}

          <defs>
            <marker id="kd-arr-t" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.teacher} />
            </marker>
            <marker id="kd-arr-s" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.soft} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
