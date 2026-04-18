import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, PIPELINE_FLOW, SECURITY_ITEMS } from './ManufacturingData';

const W = 480, H = 220;

export default function ManufacturingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 전체 파이프라인 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">제조 멀티 에이전트 파이프라인</text>

              {PIPELINE_FLOW.map((p, i) => {
                const x = 20 + i * 95;
                const isAgent = i > 0 && i < 4;
                return (
                  <motion.g key={p.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}>
                    {isAgent ? (
                      <ModuleBox x={x} y={50} w={85} h={48}
                        label={p.label} color={p.color} />
                    ) : (
                      <g>
                        <rect x={x} y={55} width={85} height={38} rx={19}
                          fill={`${p.color}12`} stroke={p.color} strokeWidth={1} />
                        <text x={x + 42} y={78} textAnchor="middle" fontSize={9}
                          fontWeight={600} fill={p.color}>{p.label}</text>
                      </g>
                    )}
                    {/* Arrow to next */}
                    {i < 4 && (
                      <motion.line
                        x1={x + 85} y1={74} x2={x + 95} y2={74}
                        stroke="var(--muted-foreground)" strokeWidth={0.8} opacity={0.4}
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.2 }} />
                    )}
                  </motion.g>
                );
              })}

              {/* Data flow labels */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}>
                <text x={160} y={115} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">매뉴얼 컨텍스트</text>
                <text x={255} y={115} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">센서 분석 결과</text>
                <text x={350} y={115} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">종합 판단</text>
              </motion.g>

              {/* Shared state */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}>
                <rect x={100} y={130} width={280} height={30} rx={6}
                  fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.8} strokeDasharray="4 2" />
                <text x={240} y={150} textAnchor="middle" fontSize={9}
                  fill="#8b5cf6">공유 상태: messages + context + analysis_result</text>
              </motion.g>

              <text x={240} y={185} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                3개 에이전트가 순차 협업하여 운영자 질문을 처리
              </text>
            </motion.g>
          )}

          {/* Step 1: RAG Agent */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={180} y={8} w={120} h={40}
                label="RAG Agent" sub="매뉴얼 검색" color="#6366f1" />

              {/* VectorDB */}
              <motion.g initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <rect x={30} y={70} width={130} height={80} rx={8}
                  fill="#6366f108" stroke="#6366f1" strokeWidth={1} />
                {/* Cylinder shape for DB */}
                <ellipse cx={95} cy={85} rx={40} ry={8}
                  fill="#6366f118" stroke="#6366f1" strokeWidth={0.6} />
                <rect x={55} y={85} width={80} height={30}
                  fill="#6366f108" stroke="none" />
                <line x1={55} y1={85} x2={55} y2={115}
                  stroke="#6366f1" strokeWidth={0.6} />
                <line x1={135} y1={85} x2={135} y2={115}
                  stroke="#6366f1" strokeWidth={0.6} />
                <ellipse cx={95} cy={115} rx={40} ry={8}
                  fill="#6366f108" stroke="#6366f1" strokeWidth={0.6} />
                <text x={95} y={105} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#6366f1">VectorDB</text>
                <text x={95} y={140} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">FAISS / Chroma</text>
              </motion.g>

              {/* Documents */}
              <motion.g initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <rect x={320} y={70} width={130} height={80} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={385} y={90} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="var(--foreground)">인덱싱 대상</text>
                <text x={385} y={108} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">장비 매뉴얼 PDF</text>
                <text x={385} y={122} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">과거 고장 이력</text>
                <text x={385} y={136} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">정비 보고서</text>
              </motion.g>

              {/* Flow arrows */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                <line x1={240} y1={48} x2={160} y2={80}
                  stroke="#6366f1" strokeWidth={0.8} opacity={0.4} />
                <text x={185} y={64} fontSize={8} fill="#6366f1">query</text>
                <line x1={160} y1={110} x2={220} y2={170}
                  stroke="#6366f1" strokeWidth={0.8} opacity={0.4} />
                <text x={175} y={148} fontSize={8} fill="#6366f1">top-k 결과</text>
              </motion.g>

              {/* Output */}
              <DataBox x={180} y={168} w={120} h={28}
                label="관련 문서 컨텍스트" color="#6366f1" />
            </motion.g>
          )}

          {/* Step 2: Analysis Agent */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={180} y={8} w={120} h={40}
                label="Analysis Agent" sub="데이터 분석" color="#10b981" />

              {/* Sensor data input */}
              <motion.g initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <rect x={20} y={65} width={130} height={90} rx={8}
                  fill="#10b98108" stroke="#10b981" strokeWidth={1} />
                <text x={85} y={82} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#10b981">센서 데이터</text>

                {/* Mini chart */}
                <polyline
                  points="35,105 50,95 65,100 80,88 95,105 110,92 125,98 135,110"
                  fill="none" stroke="#10b981" strokeWidth={1.2} />
                <line x1={35} y1={110} x2={135} y2={110}
                  stroke="var(--border)" strokeWidth={0.5} />
                <text x={85} y={142} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">진동 / 온도 / 전류</text>
              </motion.g>

              {/* Analysis tools */}
              <motion.g initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <rect x={320} y={65} width={140} height={90} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={390} y={82} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="var(--foreground)">분석 도구</text>

                <ActionBox x={335} y={90} w={110} h={24}
                  label="pandas + scipy" color="#10b981" />
                <text x={390} y={130} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">통계 분석 + 임계값</text>
                <text x={390} y={144} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">이상 구간 식별</text>
              </motion.g>

              {/* Flow */}
              <line x1={150} y1={105} x2={180} y2={60}
                stroke="#10b981" strokeWidth={0.8} opacity={0.4} />
              <line x1={300} y1={48} x2={330} y2={80}
                stroke="#10b981" strokeWidth={0.8} opacity={0.4} />

              {/* Output */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <DataBox x={165} y={175} w={150} h={28}
                  label="이상 패턴 + 심각도 레포트" color="#10b981" />
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: Decision Agent */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={180} y={8} w={120} h={40}
                label="Decision Agent" sub="조치 판단" color="#f59e0b" />

              {/* Inputs */}
              <motion.g initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <DataBox x={20} y={65} w={130} h={28}
                  label="RAG 결과" color="#6366f1" />
                <DataBox x={20} y={105} w={130} h={28}
                  label="분석 결과" color="#10b981" />
                <line x1={150} y1={79} x2={190} y2={40}
                  stroke="#6366f1" strokeWidth={0.8} opacity={0.4} />
                <line x1={150} y1={119} x2={190} y2={48}
                  stroke="#10b981" strokeWidth={0.8} opacity={0.4} />
              </motion.g>

              {/* Decision outputs */}
              <motion.g initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {[
                  { label: '장비 정지', desc: '긴급 조치', color: '#ef4444', y: 65 },
                  { label: '예방 정비', desc: '스케줄 등록', color: '#f59e0b', y: 100 },
                  { label: '정상 운전', desc: '모니터링 유지', color: '#10b981', y: 135 },
                ].map((d, i) => (
                  <motion.g key={d.label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}>
                    <rect x={320} y={d.y} width={140} height={28} rx={6}
                      fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
                    <text x={390} y={d.y + 14} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={d.color}>{d.label}</text>
                    <text x={390} y={d.y + 24} textAnchor="middle" fontSize={7.5}
                      fill="var(--muted-foreground)">{d.desc}</text>
                    <line x1={300} y1={44} x2={320} y2={d.y + 14}
                      stroke={d.color} strokeWidth={0.6} opacity={0.4} />
                  </motion.g>
                ))}
              </motion.g>

              {/* Output report */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <rect x={140} y={180} width={200} height={26} rx={6}
                  fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
                <text x={240} y={197} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#f59e0b">근거 포함 보고서 출력</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 4: 로컬 LLM + 보안 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11}
                fontWeight={700} fill="var(--foreground)">로컬 LLM 연동 — 보안 + 비용</text>

              {/* Ollama server */}
              <motion.g initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <rect x={150} y={30} width={180} height={60} rx={10}
                  fill="#10b98108" stroke="#10b981" strokeWidth={1.2} />
                <text x={240} y={52} textAnchor="middle" fontSize={11}
                  fontWeight={700} fill="#10b981">Ollama</text>
                <text x={240} y={68} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">llama3 / mistral — 사내 GPU 서버</text>
                <text x={240} y={82} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">3개 에이전트 교대 실행</text>
              </motion.g>

              {/* Security items */}
              {SECURITY_ITEMS.map((s, i) => (
                <motion.g key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.12 }}>
                  <rect x={20 + i * 155} y={110} width={140} height={55} rx={8}
                    fill={`${s.color}08`} stroke={s.color} strokeWidth={0.8} />
                  <circle cx={45 + i * 155} cy={128} r={9}
                    fill={`${s.color}20`} stroke={s.color} strokeWidth={0.8} />
                  <text x={45 + i * 155} y={132} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={s.color}>
                    {i === 0 ? 'L' : i === 1 ? 'V' : '$'}
                  </text>
                  <text x={100 + i * 155} y={128} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="var(--foreground)">{s.label}</text>
                  <text x={90 + i * 155} y={152} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}

              {/* No external API line */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <rect x={130} y={180} width={220} height={22} rx={4}
                  fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={240} y={195} textAnchor="middle" fontSize={9}
                  fill="#ef4444">외부 API 호출 없음 — 데이터 유출 원천 차단</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
