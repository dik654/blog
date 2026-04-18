import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, ORCH_WORKERS, TRADEOFFS } from './ArchitectureData';

const W = 480, H = 220;

export default function ArchitectureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 계층형 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Orchestrator at top */}
              <ModuleBox x={185} y={14} w={110} h={44}
                label="Orchestrator" sub="작업 분해 + 위임" color="#8b5cf6" />

              {/* Workers */}
              {ORCH_WORKERS.map((w, i) => (
                <motion.g key={w.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.12 }}>
                  <ActionBox x={55 + i * 145} y={100} w={110} h={42}
                    label={`${w.label} Worker`} sub="전문 도구" color={w.color} />
                  {/* Arrow down */}
                  <line x1={240} y1={58} x2={110 + i * 145} y2={100}
                    stroke={w.color} strokeWidth={1} opacity={0.5} />
                  <polygon
                    points={`${110 + i * 145 - 3},${98} ${110 + i * 145},${102} ${110 + i * 145 + 3},${98}`}
                    fill={w.color} opacity={0.6} />
                </motion.g>
              ))}

              {/* Return arrows */}
              {ORCH_WORKERS.map((w, i) => (
                <motion.line key={`ret-${i}`}
                  x1={110 + i * 145} y1={100} x2={240} y2={58}
                  stroke={w.color} strokeWidth={0.6} strokeDasharray="3 2" opacity={0.3}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }} />
              ))}

              <text x={240} y={170} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                Worker 간 직접 통신 없음 — Orchestrator 경유
              </text>

              {/* Warning note */}
              <rect x={150} y={180} width={180} height={20} rx={4}
                fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={240} y={194} textAnchor="middle" fontSize={8}
                fill="#f59e0b">병목 위험: Orchestrator 과부하</text>
            </motion.g>
          )}

          {/* Step 1: 수평형 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">Peer-to-Peer 통신</text>

              {/* 3 agents in triangle */}
              {['Agent A', 'Agent B', 'Agent C'].map((name, i) => {
                const angle = (i * 120 - 90) * Math.PI / 180;
                const cx = 240 + Math.cos(angle) * 70;
                const cy = 110 + Math.sin(angle) * 60;
                const colors = ['#6366f1', '#10b981', '#f59e0b'];
                return (
                  <motion.g key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.12 }}>
                    <circle cx={cx} cy={cy} r={28}
                      fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1.2} />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10}
                      fontWeight={600} fill={colors[i]}>{name}</text>
                  </motion.g>
                );
              })}

              {/* Bidirectional arrows between all pairs */}
              {[[0,1],[1,2],[0,2]].map(([a,b], idx) => {
                const angleA = (a * 120 - 90) * Math.PI / 180;
                const angleB = (b * 120 - 90) * Math.PI / 180;
                const ax = 240 + Math.cos(angleA) * 70;
                const ay = 110 + Math.sin(angleA) * 60;
                const bx = 240 + Math.cos(angleB) * 70;
                const by = 110 + Math.sin(angleB) * 60;
                return (
                  <motion.line key={idx}
                    x1={ax} y1={ay} x2={bx} y2={by}
                    stroke="var(--border)" strokeWidth={1} strokeDasharray="4 2"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.4 + idx * 0.1 }} />
                );
              })}

              <text x={240} y={195} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                자유 통신 — 유연하지만 대화 발산 위험
              </text>
            </motion.g>
          )}

          {/* Step 2: 파이프라인형 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">순차 처리 파이프라인</text>

              {['수집', '변환', '분석', '보고'].map((label, i) => {
                const colors = ['#64748b', '#6366f1', '#10b981', '#f59e0b'];
                const x = 50 + i * 110;
                return (
                  <motion.g key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}>
                    <rect x={x} y={70} width={90} height={50} rx={8}
                      fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1.2} />
                    <text x={x + 45} y={92} textAnchor="middle" fontSize={11}
                      fontWeight={600} fill={colors[i]}>{label}</text>
                    <text x={x + 45} y={108} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">Agent {i + 1}</text>
                    {/* Arrow to next */}
                    {i < 3 && (
                      <line x1={x + 90} y1={95} x2={x + 110} y2={95}
                        stroke={colors[i]} strokeWidth={1} opacity={0.5}
                        markerEnd="url(#arrowPipe)" />
                    )}
                  </motion.g>
                );
              })}

              <defs>
                <marker id="arrowPipe" viewBox="0 0 6 6" refX={6} refY={3}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" opacity={0.5} />
                </marker>
              </defs>

              <text x={240} y={150} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                A 출력 → B 입력 → C 입력 — 디버그 용이
              </text>
              <rect x={150} y={160} width={180} height={20} rx={4}
                fill="#ef444408" stroke="#ef4444" strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={240} y={174} textAnchor="middle" fontSize={8}
                fill="#ef4444">피드백 루프 없음 — 앞 단계 수정 불가</text>
            </motion.g>
          )}

          {/* Step 3: 선택 기준 비교 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">아키텍처 선택 기준</text>

              {/* Header row */}
              <text x={90} y={48} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="var(--foreground)">패턴</text>
              <text x={210} y={48} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="var(--foreground)">제어력</text>
              <text x={310} y={48} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="var(--foreground)">유연성</text>
              <text x={410} y={48} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="var(--foreground)">복잡도</text>
              <line x1={30} y1={54} x2={450} y2={54}
                stroke="var(--border)" strokeWidth={0.5} />

              {TRADEOFFS.map((t, i) => {
                const y = 70 + i * 46;
                const colors = ['#8b5cf6', '#10b981', '#6366f1'];
                return (
                  <motion.g key={t.pattern}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}>
                    <text x={90} y={y + 10} textAnchor="middle" fontSize={10}
                      fontWeight={600} fill={colors[i]}>{t.pattern}</text>
                    {/* Control bar */}
                    <rect x={170} y={y} width={80} height={8} rx={4}
                      fill="var(--border)" opacity={0.2} />
                    <rect x={170} y={y} width={80 * t.control} height={8} rx={4}
                      fill={colors[i]} opacity={0.7} />
                    {/* Flexibility bar */}
                    <rect x={270} y={y} width={80} height={8} rx={4}
                      fill="var(--border)" opacity={0.2} />
                    <rect x={270} y={y} width={80 * t.flexibility} height={8} rx={4}
                      fill={colors[i]} opacity={0.7} />
                    {/* Complexity bar */}
                    <rect x={370} y={y} width={80} height={8} rx={4}
                      fill="var(--border)" opacity={0.2} />
                    <rect x={370} y={y} width={80 * t.complexity} height={8} rx={4}
                      fill={colors[i]} opacity={0.7} />
                  </motion.g>
                );
              })}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <rect x={120} y={185} width={240} height={22} rx={4}
                  fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.8} />
                <text x={240} y={200} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#8b5cf6">제조 현장 → 계층형 (책임 명확)</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
