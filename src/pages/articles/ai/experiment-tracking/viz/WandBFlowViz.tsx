import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. wandb.init — 실험 세션 시작',
    body: 'project 이름과 config(하이퍼파라미터)를 등록하면 고유 run이 생성된다' },
  { label: '2. wandb.config — 하이퍼파라미터 기록',
    body: '학습률, 배치 크기, 에폭 수 등 모든 설정을 key-value로 자동 저장' },
  { label: '3. wandb.log — 메트릭 실시간 전송',
    body: '매 epoch/step마다 loss, accuracy 등을 서버로 전송 — 실시간 차트 갱신' },
  { label: '4. Sweep — 자동 하이퍼파라미터 탐색',
    body: 'Bayesian/Random/Grid 전략으로 최적 조합 자동 탐색, 병렬 에이전트 지원' },
  { label: '5. Dashboard — 팀 협업 비교',
    body: '모든 팀원의 실험을 한 대시보드에서 비교. 태그, 필터, 그룹핑 지원' },
];

export default function WandBFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: wandb.init */}
          {step === 0 && (
            <g>
              <ActionBox x={30} y={30} w={130} h={45} label="wandb.init(" sub='project="my-exp"' color="#f59e0b" />
              <motion.path d="M165,52 L220,52" fill="none" stroke="#f59e0b" strokeWidth={1.5}
                markerEnd="url(#arrW)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
              <defs>
                <marker id="arrW" viewBox="0 0 10 10" refX={9} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                </marker>
              </defs>
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}>
                <ModuleBox x={225} y={20} w={140} h={55} label="W&B Cloud" sub="run 생성 + URL 반환" color="#f59e0b" />
              </motion.g>
              {/* config dict */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}>
                <rect x={30} y={100} width={340} height={70} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={40} y={118} fontSize={9} fontWeight={600} fill="#f59e0b">config = {'{'}</text>
                {[
                  { k: 'learning_rate', v: '0.001' },
                  { k: 'batch_size', v: '32' },
                  { k: 'epochs', v: '50' },
                ].map((kv, i) => (
                  <text key={i} x={60} y={133 + i * 13} fontSize={8} fill="var(--muted-foreground)">
                    {`"${kv.k}": ${kv.v},`}
                  </text>
                ))}
                <text x={40} y={170} fontSize={9} fontWeight={600} fill="#f59e0b">{'}'}</text>
              </motion.g>
            </g>
          )}

          {/* Step 1: wandb.config */}
          {step === 1 && (
            <g>
              <ModuleBox x={150} y={5} w={180} h={35} label="wandb.config" sub="하이퍼파라미터 레지스트리" color="#6366f1" />
              {[
                { k: 'learning_rate', v: '0.001', c: '#6366f1' },
                { k: 'batch_size', v: '32', c: '#3b82f6' },
                { k: 'epochs', v: '50', c: '#10b981' },
                { k: 'optimizer', v: '"AdamW"', c: '#f59e0b' },
                { k: 'dropout', v: '0.3', c: '#ec4899' },
              ].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={40} y={50 + i * 28} width={400} height={22} rx={4}
                    fill={`${p.c}08`} stroke={`${p.c}30`} strokeWidth={0.5} />
                  <text x={55} y={65 + i * 28} fontSize={9} fontWeight={600} fill={p.c}>{p.k}</text>
                  <text x={220} y={65 + i * 28} fontSize={9} fill="var(--foreground)">{p.v}</text>
                  <text x={350} y={65 + i * 28} fontSize={7} fill="var(--muted-foreground)">자동 저장</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: wandb.log */}
          {step === 2 && (
            <g>
              <ActionBox x={10} y={15} w={110} h={40} label="학습 루프" sub="epoch 1..50" color="#3b82f6" />
              <motion.path d="M125,35 L170,35" fill="none" stroke="#3b82f6" strokeWidth={1.5}
                markerEnd="url(#arrB)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }} />
              <defs>
                <marker id="arrB" viewBox="0 0 10 10" refX={9} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#3b82f6" />
                </marker>
              </defs>
              <ActionBox x={175} y={15} w={130} h={40} label="wandb.log({" sub='loss, acc, epoch})' color="#10b981" />
              <motion.path d="M310,35 L345,35" fill="none" stroke="#10b981" strokeWidth={1.5}
                markerEnd="url(#arrG)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }} />
              <defs>
                <marker id="arrG" viewBox="0 0 10 10" refX={9} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#10b981" />
                </marker>
              </defs>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={350} y={8} w={120} h={50} label="실시간 차트" sub="자동 갱신" color="#10b981" />
              </motion.g>
              {/* 간이 실시간 차트 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <rect x={40} y={70} width={400} height={105} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={55} y={88} fontSize={8} fontWeight={600} fill="#10b981">Loss (실시간)</text>
                <line x1={70} y1={95} x2={70} y2={160} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={70} y1={160} x2={420} y2={160} stroke="var(--border)" strokeWidth={0.5} />
                <motion.path d="M70,100 L120,115 L170,120 L220,128 L270,133 L320,138 L370,142 L420,145"
                  fill="none" stroke="#10b981" strokeWidth={2}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6 }} />
                <motion.circle r={3} fill="#10b981"
                  initial={{ cx: 70, cy: 100 }}
                  animate={{ cx: 420, cy: 145 }}
                  transition={{ duration: 1.2, delay: 0.6 }} />
              </motion.g>
            </g>
          )}

          {/* Step 3: Sweep */}
          {step === 3 && (
            <g>
              <ModuleBox x={160} y={5} w={160} h={40} label="W&B Sweep" sub="자동 탐색 오케스트레이터" color="#8b5cf6" />
              {/* 전략 */}
              {[
                { label: 'Bayesian', c: '#6366f1', x: 30 },
                { label: 'Random', c: '#3b82f6', x: 170 },
                { label: 'Grid', c: '#10b981', x: 310 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                  <DataBox x={s.x} y={60} w={100} h={32} label={s.label} sub="탐색 전략" color={s.c} />
                </motion.g>
              ))}
              {/* 병렬 에이전트 */}
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <rect x={50 + i * 100} y={110} width={75} height={30} rx={6}
                    fill={`#8b5cf610`} stroke="#8b5cf6" strokeWidth={0.8} />
                  <text x={87 + i * 100} y={128} textAnchor="middle"
                    fontSize={8} fontWeight={600} fill="#8b5cf6">Agent {i + 1}</text>
                </motion.g>
              ))}
              {/* 화살표 연결 */}
              {[0, 1, 2, 3].map((i) => (
                <motion.line key={`l${i}`}
                  x1={87 + i * 100} y1={110} x2={240} y2={45}
                  stroke="#8b5cf6" strokeWidth={0.5} opacity={0.3}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.6 + i * 0.1 }} />
              ))}
              <motion.text x={240} y={160} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ delay: 0.8 }}>
                병렬 에이전트가 각각 다른 파라미터 조합 실행
              </motion.text>
            </g>
          )}

          {/* Step 4: Dashboard */}
          {step === 4 && (
            <g>
              <ModuleBox x={140} y={5} w={200} h={35} label="Team Dashboard" sub="협업 실험 관리" color="#3b82f6" />
              {/* 팀원별 실험 */}
              {[
                { name: 'Alice', runs: 23, best: '0.94', c: '#6366f1' },
                { name: 'Bob', runs: 18, best: '0.92', c: '#10b981' },
                { name: 'Carol', runs: 31, best: '0.95', c: '#f59e0b' },
              ].map((m, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={30} y={55 + i * 42} width={420} height={35} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <circle cx={55} cy={72 + i * 42} r={10} fill={`${m.c}20`} stroke={m.c} strokeWidth={1} />
                  <text x={55} y={76 + i * 42} textAnchor="middle"
                    fontSize={8} fontWeight={700} fill={m.c}>{m.name[0]}</text>
                  <text x={80} y={69 + i * 42} fontSize={9} fontWeight={600} fill="var(--foreground)">{m.name}</text>
                  <text x={80} y={82 + i * 42} fontSize={7} fill="var(--muted-foreground)">{m.runs} runs</text>
                  <text x={300} y={76 + i * 42} fontSize={9} fill="var(--foreground)">Best: {m.best}</text>
                  {/* 미니 바 */}
                  <rect x={360} y={68 + i * 42} width={80} height={8} rx={4}
                    fill="var(--border)" opacity={0.3} />
                  <motion.rect x={360} y={68 + i * 42}
                    width={80 * parseFloat(m.best)} height={8} rx={4}
                    fill={m.c} initial={{ width: 0 }}
                    animate={{ width: 80 * parseFloat(m.best) }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }} />
                </motion.g>
              ))}
              <motion.text x={240} y={190} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ delay: 0.6 }}>
                태그·필터·그룹핑으로 실험 정리 + 리포트 자동 생성
              </motion.text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
