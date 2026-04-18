import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ModuleBox, DataBox } from '@/components/viz/boxes';
import { STEPS, SINGLE_PROBLEMS, MULTI_AGENTS, MFG_DOMAINS } from './OverviewData';

const W = 480, H = 210;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 단일 LLM 한계 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Single LLM box */}
              <rect x={170} y={20} width={140} height={44} rx={8}
                fill="#6366f115" stroke="#6366f1" strokeWidth={1.5} />
              <text x={240} y={38} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">단일 LLM</text>
              <text x={240} y={54} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="#6366f1">모든 작업을 혼자 처리</text>

              {/* Problems */}
              {SINGLE_PROBLEMS.map((p, i) => (
                <motion.g key={p.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}>
                  <AlertBox x={40 + i * 150} y={100} w={120} h={48}
                    label={p.label} sub={p.desc} color={p.color} />
                </motion.g>
              ))}

              {/* Arrows from LLM to problems */}
              {SINGLE_PROBLEMS.map((_, i) => (
                <motion.line key={i}
                  x1={240} y1={64} x2={100 + i * 150} y2={100}
                  stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} />
              ))}

              <text x={240} y={175} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">복잡한 작업일수록 단일 LLM 실패율 증가</text>
            </motion.g>
          )}

          {/* Step 1: 멀티 에이전트 역할 분담 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Orchestrator */}
              <ModuleBox x={185} y={12} w={110} h={40}
                label="Orchestrator" sub="작업 분배" color="#8b5cf6" />

              {/* Worker agents */}
              {MULTI_AGENTS.map((a, i) => (
                <motion.g key={a.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}>
                  <ModuleBox x={40 + i * 155} y={90} w={120} h={48}
                    label={a.label} sub={a.role} color={a.color} />
                  {/* Arrow from orchestrator */}
                  <line x1={240} y1={52} x2={100 + i * 155} y2={90}
                    stroke={a.color} strokeWidth={1} opacity={0.5} />
                  <polygon
                    points={`${100 + i * 155 - 3},${88} ${100 + i * 155},${92} ${100 + i * 155 + 3},${88}`}
                    fill={a.color} opacity={0.6} />
                </motion.g>
              ))}

              <text x={240} y={170} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                각 에이전트가 전문 도구만 보유 → 프롬프트 단순화
              </text>
            </motion.g>
          )}

          {/* Step 2: 제조 3대 과제 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={24} textAnchor="middle" fontSize={12}
                fontWeight={700} fill="var(--foreground)">제조 현장 3대 AI 과제</text>

              {MFG_DOMAINS.map((d, i) => (
                <motion.g key={d.label}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.15 }}>
                  <rect x={40 + i * 150} y={50} width={120} height={90} rx={10}
                    fill={`${d.color}10`} stroke={d.color} strokeWidth={1.2} />
                  <circle cx={100 + i * 150} cy={78} r={14}
                    fill={`${d.color}20`} stroke={d.color} strokeWidth={1} />
                  <text x={100 + i * 150} y={82} textAnchor="middle"
                    fontSize={11} fontWeight={700} fill={d.color}>
                    {i === 0 ? 'Q' : i === 1 ? 'M' : 'O'}
                  </text>
                  <text x={100 + i * 150} y={110} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill="var(--foreground)">{d.label}</text>
                  <text x={100 + i * 150} y={126} textAnchor="middle"
                    fontSize={8} fill="var(--muted-foreground)">{d.sub}</text>
                </motion.g>
              ))}

              {/* Connecting line */}
              <motion.line x1={160} y1={95} x2={190} y2={95}
                stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
              <motion.line x1={310} y1={95} x2={340} y2={95}
                stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />

              <text x={240} y={170} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                각 과제에 전문 에이전트 팀을 배치하여 해결
              </text>
            </motion.g>
          )}

          {/* Step 3: 프레임워크 비교 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* LangGraph */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}>
                <rect x={30} y={30} width={190} height={130} rx={10}
                  fill="#6366f108" stroke="#6366f1" strokeWidth={1.2} />
                <rect x={30} y={30} width={190} height={28} rx={10}
                  fill="#6366f118" />
                <rect x={30} y={48} width={190} height={10}
                  fill="#6366f118" />
                <text x={125} y={50} textAnchor="middle" fontSize={12}
                  fontWeight={700} fill="#6366f1">LangGraph</text>
                <text x={125} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">상태 그래프 기반</text>
                <text x={125} y={96} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">세밀한 흐름 제어</text>
                <text x={125} y={112} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">조건부 라우팅</text>
                <text x={125} y={128} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">체크포인트 내장</text>
                <DataBox x={65} y={140} w={120} h={24}
                  label="복잡한 워크플로우" color="#6366f1" />
              </motion.g>

              {/* CrewAI */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}>
                <rect x={260} y={30} width={190} height={130} rx={10}
                  fill="#10b98108" stroke="#10b981" strokeWidth={1.2} />
                <rect x={260} y={30} width={190} height={28} rx={10}
                  fill="#10b98118" />
                <rect x={260} y={48} width={190} height={10}
                  fill="#10b98118" />
                <text x={355} y={50} textAnchor="middle" fontSize={12}
                  fontWeight={700} fill="#10b981">CrewAI</text>
                <text x={355} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">역할 기반 팀</text>
                <text x={355} y={96} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">Agent + Task + Crew</text>
                <text x={355} y={112} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">빠른 프로토타이핑</text>
                <text x={355} y={128} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">Sequential / Hierarchical</text>
                <DataBox x={295} y={140} w={120} h={24}
                  label="팀 역할 분담" color="#10b981" />
              </motion.g>

              <text x={240} y={190} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                제어 정밀도 → LangGraph | 빠른 구현 → CrewAI
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
