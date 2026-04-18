import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, CREW_AGENTS, PROCESS_TYPES } from './CrewAIData';

const W = 480, H = 220;

export default function CrewAIViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Agent 정의 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">Agent = role + goal + tools</text>

              {CREW_AGENTS.map((a, i) => (
                <motion.g key={a.role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.15 }}>
                  <rect x={20 + i * 155} y={34} width={140} height={110} rx={10}
                    fill={`${a.color}08`} stroke={a.color} strokeWidth={1} />

                  {/* Role header */}
                  <rect x={20 + i * 155} y={34} width={140} height={26} rx={10}
                    fill={`${a.color}18`} />
                  <rect x={20 + i * 155} y={50} width={140} height={10}
                    fill={`${a.color}18`} />
                  <text x={90 + i * 155} y={52} textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={a.color}>{a.role}</text>

                  {/* Goal */}
                  <text x={90 + i * 155} y={82} textAnchor="middle" fontSize={9}
                    fill="var(--foreground)">role="{a.role}"</text>

                  {/* Tools */}
                  {a.tools.map((tool, ti) => (
                    <DataBox key={tool}
                      x={35 + i * 155 + ti * 62} y={96}
                      w={56} h={22} label={tool} color={a.color} />
                  ))}

                  <text x={90 + i * 155} y={136} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">전문 도구 {a.tools.length}개</text>
                </motion.g>
              ))}

              <text x={240} y={168} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                각 Agent가 명확한 역할 + 전문 도구를 보유
              </text>
            </motion.g>
          )}

          {/* Step 1: Task 정의 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">Task = description + expected_output + agent</text>

              {/* Task cards */}
              {[
                { name: 'Task 1: 매뉴얼 검색', desc: '장비 매뉴얼에서\n관련 정보 추출', output: '관련 문서 요약', agent: '매뉴얼 검색', color: '#6366f1' },
                { name: 'Task 2: 데이터 분석', desc: '센서 데이터에서\n이상 패턴 탐지', output: '이상 유형 + 심각도', agent: '데이터 분석', color: '#10b981' },
                { name: 'Task 3: 조치 판단', desc: '검색 + 분석 결과를\n종합하여 판단', output: '조치 권고 보고서', agent: '의사결정', color: '#f59e0b' },
              ].map((t, i) => (
                <motion.g key={t.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.15 }}>
                  <rect x={20 + i * 155} y={34} width={140} height={130} rx={8}
                    fill="var(--card)" stroke={t.color} strokeWidth={1} />

                  {/* Task name */}
                  <rect x={20 + i * 155} y={34} width={140} height={24} rx={8}
                    fill={`${t.color}15`} />
                  <rect x={20 + i * 155} y={50} width={140} height={8}
                    fill={`${t.color}15`} />
                  <text x={90 + i * 155} y={50} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={t.color}>{t.name}</text>

                  {/* Description */}
                  {t.desc.split('\n').map((line, li) => (
                    <text key={li} x={90 + i * 155} y={76 + li * 14} textAnchor="middle"
                      fontSize={8.5} fill="var(--foreground)">{line}</text>
                  ))}

                  {/* Expected output */}
                  <line x1={30 + i * 155} y1={108} x2={150 + i * 155} y2={108}
                    stroke="var(--border)" strokeWidth={0.5} />
                  <text x={90 + i * 155} y={122} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">출력: {t.output}</text>

                  {/* Agent badge */}
                  <DataBox x={45 + i * 155} y={132} w={90} h={22}
                    label={t.agent} color={t.color} />
                </motion.g>
              ))}

              <text x={240} y={190} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                각 Task에 담당 Agent와 기대 출력을 명시
              </text>
            </motion.g>
          )}

          {/* Step 2: Crew 구성 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Crew outer box */}
              <rect x={40} y={10} width={400} height={160} rx={12}
                fill="var(--card)" stroke="#8b5cf6" strokeWidth={1.5} />
              <rect x={40} y={10} width={400} height={28} rx={12}
                fill="#8b5cf618" />
              <rect x={40} y={30} width={400} height={8}
                fill="#8b5cf618" />
              <text x={240} y={30} textAnchor="middle" fontSize={12}
                fontWeight={700} fill="#8b5cf6">Crew</text>

              {/* Agents row */}
              <text x={60} y={58} fontSize={9} fontWeight={600}
                fill="var(--foreground)">agents:</text>
              {CREW_AGENTS.map((a, i) => (
                <motion.g key={a.role}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}>
                  <ModuleBox x={60 + i * 130} y={64} w={115} h={36}
                    label={a.role} color={a.color} />
                </motion.g>
              ))}

              {/* Process */}
              <text x={60} y={120} fontSize={9} fontWeight={600}
                fill="var(--foreground)">process:</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <DataBox x={110} y={110} w={130} h={26}
                  label="Process.sequential" color="#8b5cf6" />
              </motion.g>

              {/* Tasks */}
              <text x={260} y={120} fontSize={9} fontWeight={600}
                fill="var(--foreground)">tasks:</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <DataBox x={300} y={110} w={120} h={26}
                  label="[t1, t2, t3]" color="#8b5cf6" />
              </motion.g>

              {/* kickoff */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}>
                <rect x={160} y={180} width={160} height={28} rx={14}
                  fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
                <text x={240} y={198} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill="#8b5cf6">crew.kickoff()</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: Sequential vs Hierarchical */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Sequential (left) */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}>
                <text x={120} y={18} textAnchor="middle" fontSize={11}
                  fontWeight={700} fill="#6366f1">Sequential</text>

                {['T1', 'T2', 'T3'].map((t, i) => {
                  const y = 34 + i * 50;
                  const colors = ['#6366f1', '#10b981', '#f59e0b'];
                  return (
                    <motion.g key={t}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.12 }}>
                      <rect x={70} y={y} width={100} height={34} rx={6}
                        fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1} />
                      <text x={120} y={y + 21} textAnchor="middle" fontSize={10}
                        fontWeight={600} fill={colors[i]}>{t}</text>
                      {i < 2 && (
                        <line x1={120} y1={y + 34} x2={120} y2={y + 50}
                          stroke="var(--muted-foreground)" strokeWidth={0.8} opacity={0.4} />
                      )}
                    </motion.g>
                  );
                })}

                <text x={120} y={200} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">예측 가능 + 감사 추적</text>
              </motion.g>

              {/* Divider */}
              <line x1={240} y1={10} x2={240} y2={210}
                stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* Hierarchical (right) */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}>
                <text x={360} y={18} textAnchor="middle" fontSize={11}
                  fontWeight={700} fill="#f59e0b">Hierarchical</text>

                {/* Manager */}
                <ModuleBox x={310} y={30} w={100} h={36}
                  label="Manager" sub="동적 분배" color="#f59e0b" />

                {/* Workers */}
                {['W1', 'W2', 'W3'].map((w, i) => {
                  const x = 270 + i * 65;
                  return (
                    <motion.g key={w}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}>
                      <rect x={x} y={100} width={50} height={30} rx={6}
                        fill="#f59e0b12" stroke="#f59e0b" strokeWidth={0.8} />
                      <text x={x + 25} y={119} textAnchor="middle" fontSize={10}
                        fontWeight={600} fill="#f59e0b">{w}</text>
                      <line x1={360} y1={66} x2={x + 25} y2={100}
                        stroke="#f59e0b" strokeWidth={0.6} opacity={0.4} />
                    </motion.g>
                  );
                })}

                {/* Dynamic assignment arrows */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}>
                  <line x1={295} y1={130} x2={360} y2={150}
                    stroke="#f59e0b" strokeWidth={0.6} strokeDasharray="3 2" opacity={0.4} />
                  <line x1={360} y1={130} x2={360} y2={150}
                    stroke="#f59e0b" strokeWidth={0.6} strokeDasharray="3 2" opacity={0.4} />
                  <text x={360} y={162} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">동적 재배분</text>
                </motion.g>

                <text x={360} y={200} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">유연하지만 매니저 의존</text>
              </motion.g>

              {/* Recommendation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <rect x={70} y={182} width={120} height={20} rx={4}
                  fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
                <text x={130} y={196} textAnchor="middle" fontSize={8}
                  fontWeight={600} fill="#10b981">제조: Sequential 권장</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
