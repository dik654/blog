import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, STATE_FIELDS, GRAPH_NODES, GRAPH_EDGES } from './LangGraphData';

const W = 480, H = 220;

export default function LangGraphViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: StateGraph 상태 객체 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">TypedDict 공유 상태</text>

              {/* State box */}
              <rect x={130} y={34} width={220} height={120} rx={10}
                fill="#6366f108" stroke="#6366f1" strokeWidth={1.2} />
              <text x={240} y={52} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="#6366f1">AgentState</text>
              <line x1={140} y1={58} x2={340} y2={58}
                stroke="#6366f1" strokeWidth={0.5} opacity={0.3} />

              {STATE_FIELDS.map((f, i) => (
                <motion.g key={f.name}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}>
                  <text x={150} y={78 + i * 28} fontSize={10}
                    fontWeight={600} fontFamily="monospace" fill="#6366f1">{f.name}</text>
                  <text x={260} y={78 + i * 28} fontSize={9}
                    fill="var(--muted-foreground)">{f.type}</text>
                  <text x={345} y={78 + i * 28} textAnchor="end" fontSize={8}
                    fill="var(--muted-foreground)">{f.desc}</text>
                </motion.g>
              ))}

              {/* Arrows showing state flows through nodes */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <text x={80} y={90} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">Node A</text>
                <line x1={100} y1={90} x2={128} y2={90}
                  stroke="#6366f1" strokeWidth={1} opacity={0.4}
                  markerEnd="url(#arrowLG)" />
                <text x={400} y={90} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">Node B</text>
                <line x1={352} y1={90} x2={380} y2={90}
                  stroke="#6366f1" strokeWidth={1} opacity={0.4}
                  markerEnd="url(#arrowLG)" />
              </motion.g>

              <defs>
                <marker id="arrowLG" viewBox="0 0 6 6" refX={6} refY={3}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#6366f1" opacity={0.5} />
                </marker>
              </defs>

              <text x={240} y={180} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                모든 노드가 동일한 상태 객체를 읽고 수정한다
              </text>
            </motion.g>
          )}

          {/* Step 1: 노드와 엣지 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Graph nodes */}
              {GRAPH_NODES.map((n, i) => (
                <motion.g key={n.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}>
                  {n.id === 'router' ? (
                    /* Diamond shape for router */
                    <g>
                      <polygon
                        points={`${n.x},${n.y} ${n.x + 30},${n.y + 22} ${n.x},${n.y + 44} ${n.x - 30},${n.y + 22}`}
                        fill={`${n.color}15`} stroke={n.color} strokeWidth={1.2} />
                      <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize={10}
                        fontWeight={600} fill={n.color}>{n.label}</text>
                    </g>
                  ) : (
                    <g>
                      <rect x={n.x - 40} y={n.y} width={80} height={36} rx={6}
                        fill={`${n.color}12`} stroke={n.color} strokeWidth={1} />
                      <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize={10}
                        fontWeight={600} fill={n.color}>{n.label}</text>
                    </g>
                  )}
                </motion.g>
              ))}

              {/* Edges */}
              {GRAPH_EDGES.slice(0, 5).map((e, i) => {
                const from = GRAPH_NODES.find(n => n.id === e.from)!;
                const to = GRAPH_NODES.find(n => n.id === e.to)!;
                const fy = from.id === 'router' ? from.y + 44 : from.y + 36;
                const ty = to.id === 'router' ? to.y + 22 : to.y;
                return (
                  <motion.line key={i}
                    x1={from.x} y1={fy} x2={to.x} y2={ty}
                    stroke="var(--muted-foreground)" strokeWidth={0.8} opacity={0.4}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }} />
                );
              })}

              {/* Code annotations */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <rect x={350} y={10} width={120} height={50} rx={4}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={360} y={26} fontSize={8} fontFamily="monospace"
                  fill="#6366f1">add_node("분석", fn)</text>
                <text x={360} y={42} fontSize={8} fontFamily="monospace"
                  fill="#10b981">add_edge("분석","판단")</text>
                <text x={360} y={54} fontSize={7.5} fontFamily="monospace"
                  fill="var(--muted-foreground)"># 그래프 구축 API</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: 조건부 라우팅 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">조건부 라우팅</text>

              {/* Router diamond */}
              <polygon
                points="240,34 275,60 240,86 205,60"
                fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={240} y={64} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="#8b5cf6">router</text>

              {/* Condition labels */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}>
                {/* Left: 검색 필요 */}
                <line x1={205} y1={60} x2={120} y2={110}
                  stroke="#6366f1" strokeWidth={1} opacity={0.5} />
                <rect x={100} y={72} width={70} height={18} rx={3}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={135} y={84} textAnchor="middle" fontSize={8}
                  fill="#6366f1">검색 필요</text>
                <ActionBox x={60} y={104} w={120} h={38}
                  label="검색 Agent" sub="VectorDB 조회" color="#6366f1" />

                {/* Center: 분석 필요 */}
                <line x1={240} y1={86} x2={240} y2={110}
                  stroke="#10b981" strokeWidth={1} opacity={0.5} />
                <rect x={205} y={90} width={70} height={18} rx={3}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={102} textAnchor="middle" fontSize={8}
                  fill="#10b981">분석 필요</text>
                <ActionBox x={180} y={110} w={120} h={38}
                  label="분석 Agent" sub="데이터 처리" color="#10b981" />

                {/* Right: 판단 */}
                <line x1={275} y1={60} x2={360} y2={110}
                  stroke="#f59e0b" strokeWidth={1} opacity={0.5} />
                <rect x={310} y={72} width={70} height={18} rx={3}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={345} y={84} textAnchor="middle" fontSize={8}
                  fill="#f59e0b">판단 필요</text>
                <ActionBox x={300} y={104} w={120} h={38}
                  label="판단 Agent" sub="조치 결정" color="#f59e0b" />
              </motion.g>

              {/* Code snippet */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <rect x={100} y={160} width={280} height={36} rx={4}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={110} y={175} fontSize={8} fontFamily="monospace"
                  fill="#8b5cf6">def router(state):</text>
                <text x={120} y={190} fontSize={8} fontFamily="monospace"
                  fill="var(--muted-foreground)">  return "검색" if need_search(state) else "분석"</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: 체크포인트 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">체크포인트 & Human-in-the-loop</text>

              {/* Timeline with checkpoints */}
              <line x1={60} y1={70} x2={420} y2={70}
                stroke="var(--border)" strokeWidth={1.5} />

              {['Node A', 'Node B', 'Human', 'Node C'].map((label, i) => {
                const x = 90 + i * 100;
                const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
                const isHuman = i === 2;
                return (
                  <motion.g key={label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.12 }}>
                    {/* Checkpoint dot */}
                    <circle cx={x} cy={70} r={5}
                      fill={colors[i]} />
                    <text x={x} y={62} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">CP{i + 1}</text>

                    {/* Node/Human box */}
                    {isHuman ? (
                      <g>
                        <rect x={x - 40} y={85} width={80} height={38} rx={6}
                          fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1}
                          strokeDasharray="4 2" />
                        <text x={x} y={102} textAnchor="middle" fontSize={10}
                          fontWeight={600} fill="#f59e0b">승인 대기</text>
                        <text x={x} y={116} textAnchor="middle" fontSize={8}
                          fill="var(--muted-foreground)">Human Review</text>
                      </g>
                    ) : (
                      <rect x={x - 40} y={85} width={80} height={38} rx={6}
                        fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1} />
                    )}
                    {!isHuman && (
                      <>
                        <text x={x} y={102} textAnchor="middle" fontSize={10}
                          fontWeight={600} fill={colors[i]}>{label}</text>
                        <text x={x} y={116} textAnchor="middle" fontSize={8}
                          fill="var(--muted-foreground)">실행</text>
                      </>
                    )}
                  </motion.g>
                );
              })}

              {/* Error + recovery */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}>
                <rect x={280} y={140} width={160} height={40} rx={6}
                  fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={360} y={156} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#ef4444">오류 발생 시</text>
                <text x={360} y={172} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">CP2에서 재개 → 데이터 보존</text>
                <line x1={290} y1={140} x2={190} y2={78}
                  stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.4} />
              </motion.g>

              {/* Saver note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <rect x={40} y={150} width={180} height={30} rx={4}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={50} y={166} fontSize={8} fontFamily="monospace"
                  fill="#6366f1">SqliteSaver / MemorySaver</text>
                <text x={50} y={176} fontSize={7.5}
                  fill="var(--muted-foreground)">매 노드 실행 후 자동 저장</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
