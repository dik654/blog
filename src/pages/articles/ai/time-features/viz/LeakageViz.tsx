import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: '미래 누출(Future Leakage)이란',
    body: '학습 시점에 알 수 없는 미래 정보가 피처에 포함되는 것.\n검증 성능은 높지만 실전에서는 무용지물 — "시험지를 미리 본 것"과 동일.',
  },
  {
    label: '잘못된 예: 전체 데이터로 롤링 통계 계산',
    body: 'df["rmean_7"].rolling(7).mean()을 전체 데이터에 먼저 적용한 뒤 train/test 분할.\nt=100에서의 rolling mean에 t=101~106의 값이 포함될 수 있음 (center=True 시).',
  },
  {
    label: '올바른 순서: 분할 → 피처 생성',
    body: '1) 시간 순서로 train/test 분할 → 2) train 데이터만으로 피처 계산.\ntest의 피처도 해당 시점까지의 train 값만 사용해야 안전.',
  },
  {
    label: 'TimeSeriesSplit vs KFold',
    body: '일반 KFold: 랜덤 분할 → 미래 데이터가 학습에 포함됨.\nTimeSeriesSplit: 항상 과거→미래 방향으로 분할. 시계열 교차검증의 표준.',
  },
  {
    label: '누출 방지 체크리스트',
    body: '1) rolling/shift는 train 데이터 내에서만 계산\n2) target encoding은 fold 내 train에서만\n3) 분할 전 정규화/표준화 금지\n4) GroupKFold 사용 시 시간 그룹 주의.',
  },
];

export default function LeakageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 미래 누출 개념 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 시간축 */}
              <line x1={40} y1={100} x2={440} y2={100} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <text x={440} y={113} fontSize={7} fill="var(--muted-foreground)">시간 →</text>

              {/* 과거 구간 */}
              <rect x={40} y={70} width={200} height={30} rx={6} fill="#3b82f615" stroke="#3b82f6" strokeWidth={0.8} />
              <text x={140} y={89} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">과거 (학습 가능)</text>

              {/* 미래 구간 */}
              <rect x={250} y={70} width={180} height={30} rx={6} fill="#ef444415" stroke="#ef4444" strokeWidth={0.8} />
              <text x={340} y={89} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">미래 (예측 대상)</text>

              {/* 분할선 */}
              <line x1={245} y1={55} x2={245} y2={115} stroke="var(--foreground)" strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={245} y={50} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--foreground)">현재(t)</text>

              {/* 누출 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <path d="M340,105 C340,140 140,140 140,105" fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#leakArr)" />
                <rect x={185} y={138} width={110} height={20} rx={4} fill="var(--card)" stroke="#ef4444" strokeWidth={0.5} />
                <text x={240} y={152} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">미래 정보 누출!</text>
              </motion.g>

              <defs>
                <marker id="leakArr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* Step 1: 잘못된 예 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <AlertBox x={150} y={5} w={180} h={30} label="잘못된 파이프라인" color="#ef4444" />

              {/* 파이프라인 흐름 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <ModuleBox x={20} y={50} w={120} h={40} label="전체 데이터" sub="train + test 혼합" color="#6366f1" />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <line x1={145} y1={70} x2={170} y2={70} stroke="#ef4444" strokeWidth={1} markerEnd="url(#wrongArr)" />
                <ActionBox x={175} y={50} w={130} h={40} label="rolling(7).mean()" sub="전체에 적용" color="#ef4444" />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <line x1={310} y1={70} x2={335} y2={70} stroke="#ef4444" strokeWidth={1} markerEnd="url(#wrongArr)" />
                <ActionBox x={340} y={50} w={120} h={40} label="train/test 분할" sub="시간순 분리" color="#94a3b8" />
              </motion.g>

              {/* 문제 설명 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={60} y={110} width={360} height={60} rx={8} fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />

                {/* 윈도우 시각화 */}
                {[95, 96, 97, 98, 99, 100, 101].map((t, i) => {
                  const x = 90 + i * 42;
                  const isFuture = t > 99;
                  return (
                    <g key={t}>
                      <rect x={x} y={120} width={36} height={18} rx={3}
                        fill={isFuture ? '#ef444425' : '#3b82f615'} stroke={isFuture ? '#ef4444' : '#3b82f6'} strokeWidth={0.5} />
                      <text x={x + 18} y={133} textAnchor="middle" fontSize={8}
                        fill={isFuture ? '#ef4444' : '#3b82f6'} fontWeight={isFuture ? 600 : 400}>t={t}</text>
                    </g>
                  );
                })}
                <text x={240} y={158} textAnchor="middle" fontSize={8} fill="#ef4444" fontWeight={600}>
                  center=True → t=100,101이 rolling에 포함 = 미래 누출
                </text>
              </motion.g>

              <defs>
                <marker id="wrongArr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* Step 2: 올바른 순서 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={195} y={5} w={90} h={28} label="올바른 순서" color="#10b981" outlined />

              {/* Step 1: 시간순 분할 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={45} width={12} height={12} rx={6} fill="#10b981" />
                <text x={26} y={54} textAnchor="middle" fontSize={8} fontWeight={700} fill="white">1</text>
                <ActionBox x={40} y={42} w={130} h={35} label="시간순 분할" sub="train: ~t₀ | test: t₀~" color="#10b981" />
              </motion.g>

              {/* Step 2: train에서만 피처 생성 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <line x1={175} y1={60} x2={195} y2={60} stroke="#10b981" strokeWidth={0.8} markerEnd="url(#okArr)" />
                <rect x={200} y={45} width={12} height={12} rx={6} fill="#10b981" />
                <text x={206} y={54} textAnchor="middle" fontSize={8} fontWeight={700} fill="white">2</text>
                <ActionBox x={220} y={42} w={130} h={35} label="피처 생성" sub="train 데이터만 사용" color="#3b82f6" />
              </motion.g>

              {/* Step 3: 모델 학습 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.4 }}>
                <line x1={355} y1={60} x2={375} y2={60} stroke="#10b981" strokeWidth={0.8} markerEnd="url(#okArr)" />
                <rect x={380} y={45} width={12} height={12} rx={6} fill="#10b981" />
                <text x={386} y={54} textAnchor="middle" fontSize={8} fontWeight={700} fill="white">3</text>
                <ModuleBox x={400} y={42} w={60} h={35} label="학습" color="#8b5cf6" />
              </motion.g>

              {/* 시간축 시각화 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <line x1={40} y1={120} x2={440} y2={120} stroke="var(--muted-foreground)" strokeWidth={0.5} />

                <rect x={40} y={100} width={200} height={20} rx={4} fill="#3b82f615" stroke="#3b82f6" strokeWidth={0.5} />
                <text x={140} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Train</text>

                <rect x={250} y={100} width={100} height={20} rx={4} fill="#f59e0b15" stroke="#f59e0b" strokeWidth={0.5} />
                <text x={300} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Val</text>

                <rect x={360} y={100} width={80} height={20} rx={4} fill="#10b98115" stroke="#10b981" strokeWidth={0.5} />
                <text x={400} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Test</text>

                <text x={240} y={145} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  항상 과거 → 미래 방향. 역방향 참조 금지.
                </text>
              </motion.g>

              {/* 화살표 — test 피처도 과거만 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <path d="M140,120 C140,155 300,155 300,120" fill="none" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={220} y={165} textAnchor="middle" fontSize={7} fill="#f59e0b">val 피처도 train 범위만 참조</text>
              </motion.g>

              <defs>
                <marker id="okArr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#10b981" />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* Step 3: TimeSeriesSplit vs KFold */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* KFold (잘못된) */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">KFold (잘못됨)</text>
              {[0, 1, 2].map((fold) => {
                const y = 28 + fold * 24;
                const segments = Array.from({ length: 10 }, (_, i) => {
                  const isTest = fold === 0 ? (i >= 3 && i <= 4) : fold === 1 ? (i >= 6 && i <= 7) : (i >= 0 && i <= 1);
                  return isTest;
                });
                return (
                  <motion.g key={`kf-${fold}`} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: fold * 0.1 }}>
                    <text x={20} y={y + 12} fontSize={7} fill="var(--muted-foreground)">F{fold + 1}</text>
                    {segments.map((isTest, i) => (
                      <rect key={i} x={35 + i * 18} y={y} width={16} height={16} rx={2}
                        fill={isTest ? '#ef444430' : '#3b82f615'} stroke={isTest ? '#ef4444' : '#3b82f6'} strokeWidth={0.4} />
                    ))}
                  </motion.g>
                );
              })}
              <text x={120} y={105} textAnchor="middle" fontSize={7} fill="#ef4444">미래 데이터가 train에 포함</text>

              {/* 구분선 */}
              <line x1={240} y1={15} x2={240} y2={180} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* TimeSeriesSplit (올바른) */}
              <text x={360} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">TimeSeriesSplit</text>
              {[0, 1, 2].map((fold) => {
                const y = 28 + fold * 24;
                const trainEnd = 4 + fold * 2;
                const testStart = trainEnd;
                const testEnd = testStart + 2;
                return (
                  <motion.g key={`ts-${fold}`} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: 0.3 + fold * 0.1 }}>
                    <text x={260} y={y + 12} fontSize={7} fill="var(--muted-foreground)">F{fold + 1}</text>
                    {Array.from({ length: 10 }, (_, i) => {
                      const isTrain = i < trainEnd;
                      const isTest = i >= testStart && i < testEnd;
                      const isUnused = !isTrain && !isTest;
                      return (
                        <rect key={i} x={275 + i * 18} y={y} width={16} height={16} rx={2}
                          fill={isTest ? '#f59e0b30' : isTrain ? '#10b98115' : 'var(--card)'}
                          stroke={isTest ? '#f59e0b' : isTrain ? '#10b981' : 'var(--border)'} strokeWidth={0.4}
                          opacity={isUnused ? 0.3 : 1} />
                      );
                    })}
                  </motion.g>
                );
              })}
              <text x={360} y={105} textAnchor="middle" fontSize={7} fill="#10b981">항상 과거 → 미래 방향</text>

              {/* 범례 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={120} y={120} width={240} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                {[
                  { color: '#3b82f6', label: 'Train (KFold)' },
                  { color: '#ef4444', label: 'Test (KFold)' },
                  { color: '#10b981', label: 'Train (TS Split)' },
                  { color: '#f59e0b', label: 'Test (TS Split)' },
                ].map((item, i) => (
                  <g key={item.label}>
                    <rect x={130 + (i % 2) * 115} y={130 + Math.floor(i / 2) * 18} width={10} height={10} rx={2}
                      fill={`${item.color}30`} stroke={item.color} strokeWidth={0.5} />
                    <text x={145 + (i % 2) * 115} y={139 + Math.floor(i / 2) * 18} fontSize={8}
                      fill="var(--foreground)">{item.label}</text>
                  </g>
                ))}
              </motion.g>
            </motion.g>
          )}

          {/* Step 4: 체크리스트 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                누출 방지 체크리스트
              </text>

              {[
                { icon: '1', text: 'rolling/shift → train 데이터 내에서만 계산', color: '#3b82f6' },
                { icon: '2', text: 'target encoding → fold 내 train에서만 계산', color: '#10b981' },
                { icon: '3', text: '정규화(StandardScaler) → 분할 후 train에 fit', color: '#f59e0b' },
                { icon: '4', text: 'GroupKFold → 시간 그룹이 train/test 걸치지 않도록', color: '#8b5cf6' },
                { icon: '5', text: 'center=True, min_periods 옵션 → 미래 참조 여부 확인', color: '#ef4444' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={60} y={30 + i * 32} width={360} height={26} rx={6}
                    fill="var(--card)" stroke={item.color} strokeWidth={0.5} />
                  <circle cx={80} cy={43 + i * 32} r={9} fill={item.color} fillOpacity={0.15} />
                  <text x={80} y={47 + i * 32} textAnchor="middle" fontSize={9} fontWeight={700} fill={item.color}>{item.icon}</text>
                  <text x={100} y={47 + i * 32} fontSize={9} fill="var(--foreground)">{item.text}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
