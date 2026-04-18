import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox, StatusBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '실험 100회 — 기록 없음',
    body: '"어제 결과가 더 좋았는데 뭘 바꿨더라?" 기록 없는 실험은 시간 낭비로 이어진다' },
  { label: '혼돈: 하이퍼파라미터 혼재',
    body: 'lr=0.001? 0.0003? batch=32? 64? 어떤 조합이 최적이었는지 알 수 없다' },
  { label: '체계적 추적 도입',
    body: '모든 실험을 자동 기록 — 하이퍼파라미터, 메트릭, 코드 버전, 환경 정보' },
  { label: '대시보드에서 비교 분석',
    body: '실험 간 메트릭 비교, 최적 조합 탐색, 팀원과 결과 공유' },
  { label: '재현 가능한 최적 결과',
    body: '시드, 환경, 코드, 데이터 버전까지 기록 — 누구나 동일 결과를 재현' },
];

export default function ExperimentChaosViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 실험들이 흩어져 있는 혼돈 상태 */}
          {step === 0 && (
            <g>
              {[
                { x: 30, y: 20, label: 'Exp #12', c: '#ef4444' },
                { x: 160, y: 60, label: 'Exp #37', c: '#f59e0b' },
                { x: 300, y: 15, label: 'Exp #58', c: '#6366f1' },
                { x: 80, y: 110, label: 'Exp #73', c: '#10b981' },
                { x: 240, y: 120, label: 'Exp #91', c: '#ec4899' },
                { x: 370, y: 80, label: 'Exp #99', c: '#3b82f6' },
              ].map((e, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.7, scale: 1, x: [0, (i % 2 ? 3 : -3), 0] }}
                  transition={{ delay: i * 0.08, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}>
                  <rect x={e.x} y={e.y} width={70} height={32} rx={6}
                    fill={`${e.c}15`} stroke={e.c} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={e.x + 35} y={e.y + 14} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={e.c}>{e.label}</text>
                  <text x={e.x + 35} y={e.y + 25} textAnchor="middle"
                    fontSize={7} fill="var(--muted-foreground)">lr=? batch=?</text>
                </motion.g>
              ))}
              <motion.text x={240} y={175} textAnchor="middle" fontSize={10}
                fill="#ef4444" fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}>
                어떤 실험이 최적이었는지 알 수 없다
              </motion.text>
            </g>
          )}

          {/* Step 1: 파라미터 혼재 */}
          {step === 1 && (
            <g>
              <AlertBox x={20} y={10} w={200} h={55} label="Exp #37" sub="lr=0.001, batch=32" color="#f59e0b" />
              <AlertBox x={260} y={10} w={200} h={55} label="Exp #58" sub="lr=0.0003, batch=64" color="#6366f1" />
              <AlertBox x={20} y={80} w={200} h={55} label="Exp #73" sub="lr=0.001, batch=64" color="#10b981" />
              <AlertBox x={260} y={80} w={200} h={55} label="Exp #91" sub="lr=0.0005, batch=32" color="#ec4899" />
              {/* 물음표 */}
              <motion.text x={240} y={170} textAnchor="middle" fontSize={11}
                fill="#ef4444" fontWeight={700}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                최적 조합 = ???
              </motion.text>
              {/* 혼란 화살표 */}
              {[[120, 65, 360, 80], [360, 65, 120, 80]].map(([x1, y1, x2, y2], i) => (
                <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.3 }} />
              ))}
            </g>
          )}

          {/* Step 2: 체계적 추적 */}
          {step === 2 && (
            <g>
              <ModuleBox x={170} y={5} w={140} h={45} label="Tracking Server" sub="W&B / MLflow" color="#3b82f6" />
              {[
                { x: 20, y: 75, label: 'Params', sub: 'lr, batch, epochs', c: '#6366f1' },
                { x: 140, y: 75, label: 'Metrics', sub: 'loss, acc, f1', c: '#10b981' },
                { x: 260, y: 75, label: 'Code', sub: 'git commit hash', c: '#f59e0b' },
                { x: 370, y: 75, label: 'Env', sub: 'pip, cuda, seed', c: '#ec4899' },
              ].map((d, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                  <DataBox x={d.x} y={d.y} w={95} h={38} label={d.label} sub={d.sub} color={d.c} />
                  {/* 화살표 위로 */}
                  <motion.line x1={d.x + 47} y1={d.y} x2={240} y2={50}
                    stroke={d.c} strokeWidth={1} opacity={0.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.15 + 0.2 }} />
                </motion.g>
              ))}
              <motion.text x={240} y={140} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ delay: 0.6 }}>
                모든 실험 메타데이터 자동 수집
              </motion.text>
            </g>
          )}

          {/* Step 3: 대시보드 비교 */}
          {step === 3 && (
            <g>
              <ModuleBox x={150} y={5} w={180} h={35} label="Dashboard" sub="실험 비교 뷰" color="#3b82f6" />
              {/* 간이 차트 — 3개 실험의 loss 커브 */}
              <rect x={40} y={50} width={400} height={110} rx={8}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={60} y={68} fontSize={8} fill="var(--muted-foreground)">Validation Loss</text>
              {/* Axes */}
              <line x1={70} y1={75} x2={70} y2={145} stroke="var(--border)" strokeWidth={0.5} />
              <line x1={70} y1={145} x2={420} y2={145} stroke="var(--border)" strokeWidth={0.5} />
              {/* x-axis labels */}
              {['0', '20', '40', '60', '80', '100'].map((l, i) => (
                <text key={i} x={70 + i * 70} y={155} fontSize={7} fill="var(--muted-foreground)" textAnchor="middle">{l}</text>
              ))}
              {/* 3 curves */}
              {[
                { d: 'M70,80 Q150,100 200,115 T420,135', c: '#ef4444', label: 'Exp #37' },
                { d: 'M70,82 Q140,95 190,105 T420,125', c: '#6366f1', label: 'Exp #58' },
                { d: 'M70,78 Q130,88 180,95 T420,100', c: '#10b981', label: 'Exp #73 ★' },
              ].map((curve, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.2 }}>
                  <motion.path d={curve.d} fill="none" stroke={curve.c} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.2 }} />
                  <rect x={325} y={68 + i * 14} width={8} height={8} rx={2} fill={curve.c} />
                  <text x={337} y={76 + i * 14} fontSize={8} fill={curve.c} fontWeight={600}>{curve.label}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 4: 재현 가능한 최적 결과 */}
          {step === 4 && (
            <g>
              <StatusBox x={160} y={5} w={160} h={45} label="Best: Exp #73" sub="val_acc=0.947" color="#10b981" progress={0.95} />
              {[
                { x: 20, y: 70, label: 'seed=42', c: '#6366f1' },
                { x: 120, y: 70, label: 'git: a3f2c1d', c: '#f59e0b' },
                { x: 240, y: 70, label: 'torch==2.1', c: '#3b82f6' },
                { x: 355, y: 70, label: 'CUDA 12.1', c: '#ec4899' },
              ].map((d, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                  <ActionBox x={d.x} y={d.y} w={90} h={32} label={d.label} color={d.c} />
                </motion.g>
              ))}
              {/* 재현 화살표 */}
              <motion.path d="M240,110 L240,135" fill="none" stroke="#10b981" strokeWidth={1.5}
                markerEnd="url(#arrowGreen)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }} />
              <defs>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX={9} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#10b981" />
                </marker>
              </defs>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={160} y={140} width={160} height={35} rx={8}
                  fill="#10b98115" stroke="#10b981" strokeWidth={1} />
                <text x={240} y={158} textAnchor="middle" fontSize={10}
                  fontWeight={700} fill="#10b981">100% 재현 가능</text>
                <text x={240} y={170} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">팀원 누구나 동일 결과</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
