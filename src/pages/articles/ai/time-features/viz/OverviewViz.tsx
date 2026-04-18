import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: '일반 피처 vs 시계열 피처',
    body: '일반 테이블은 행 순서가 무의미하지만, 시계열은 시간 순서 자체가 정보 — 셔플하면 의미가 사라진다.',
  },
  {
    label: '시간 순서가 담는 3가지 정보',
    body: '래그(과거 값) → 관성/추세 포착, 롤링(구간 통계) → 변동성·안정성 포착, 주기(sin/cos) → 반복 패턴 포착.',
  },
  {
    label: '시계열 피처의 실전 활용',
    body: '수요 예측(재고 최적화), 스포츠 분석(K리그 경기력 추세), 금융(변동성 지표) 등 시간 의존적 문제에서 핵심 역할.',
  },
  {
    label: '시계열 피처 파이프라인',
    body: '원본 시계열 → 래그/차분 → 롤링 통계 → 주기 인코딩 → 최종 피처 테이블. 미래 누출 방지가 필수.',
  },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 일반 vs 시계열 비교 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 일반 테이블 */}
              <text x={100} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">일반 테이블</text>
              {[0, 1, 2, 3].map((i) => (
                <g key={`normal-${i}`}>
                  <rect x={50} y={30 + i * 28} width={100} height={22} rx={4} fill={`#6366f1${i === 2 ? '30' : '15'}`} stroke="#6366f1" strokeWidth={0.5} />
                  <text x={100} y={45 + i * 28} textAnchor="middle" fontSize={9} fill="var(--foreground)">행 {i + 1}: 독립</text>
                </g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <text x={100} y={150} textAnchor="middle" fontSize={8} fill="#6366f1">↕ 순서 바꿔도 OK</text>
                <path d="M80,152 C80,165 120,165 120,152" fill="none" stroke="#6366f1" strokeWidth={0.8} strokeDasharray="3 2" />
              </motion.g>

              {/* 시계열 테이블 */}
              <text x={340} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">시계열 테이블</text>
              {[0, 1, 2, 3].map((i) => (
                <g key={`ts-${i}`}>
                  <rect x={290} y={30 + i * 28} width={100} height={22} rx={4} fill={`#10b981${i === 2 ? '30' : '15'}`} stroke="#10b981" strokeWidth={0.5} />
                  <text x={340} y={45 + i * 28} textAnchor="middle" fontSize={9} fill="var(--foreground)">t={i + 1}: 순서 중요</text>
                  {i > 0 && (
                    <motion.line x1={280} y1={37 + i * 28} x2={280} y2={50 + (i - 1) * 28}
                      stroke="#10b981" strokeWidth={1.2} markerEnd="url(#arrowGreen)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.1 * i }} />
                  )}
                </g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={340} y={150} textAnchor="middle" fontSize={8} fill="#ef4444">✕ 순서 바꾸면 정보 손실</text>
              </motion.g>

              {/* 구분선 */}
              <line x1={220} y1={20} x2={220} y2={170} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={220} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">핵심 차이: 행 간 의존성</text>

              <defs>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#10b981" />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* Step 1: 3가지 정보 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={180} y={10} w={120} h={36} label="시계열 데이터" color="#6366f1" />

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <line x1={200} y1={46} x2={80} y2={80} stroke="var(--border)" strokeWidth={0.8} />
                <ActionBox x={20} y={80} w={120} h={42} label="래그 (Lag)" sub="과거 값 → 관성·추세" color="#3b82f6" />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <line x1={240} y1={46} x2={240} y2={80} stroke="var(--border)" strokeWidth={0.8} />
                <ActionBox x={180} y={80} w={120} h={42} label="롤링 (Rolling)" sub="구간 통계 → 변동성" color="#10b981" />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.45 }}>
                <line x1={280} y1={46} x2={400} y2={80} stroke="var(--border)" strokeWidth={0.8} />
                <ActionBox x={340} y={80} w={120} h={42} label="주기 (Cyclic)" sub="sin/cos → 반복 패턴" color="#f59e0b" />
              </motion.g>

              {/* 하단 화살표들 → 피처 테이블 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <line x1={80} y1={122} x2={200} y2={155} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={240} y1={122} x2={240} y2={155} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={400} y1={122} x2={280} y2={155} stroke="var(--border)" strokeWidth={0.5} />
                <DataBox x={190} y={155} w={100} h={30} label="피처 테이블" color="#8b5cf6" />
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: 실전 활용 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { x: 30, label: '수요 예측', sub: '재고 최적화', color: '#3b82f6', examples: ['래그: 어제 판매량', '롤링: 7일 평균', '주기: 요일 패턴'] },
                { x: 180, label: 'K리그 분석', sub: '경기력 추세', color: '#10b981', examples: ['래그: 이전 경기 결과', '롤링: 최근 5경기 승률', '주기: 시즌 주기'] },
                { x: 330, label: '금융 분석', sub: '변동성 지표', color: '#f59e0b', examples: ['래그: 전일 종가', '롤링: 20일 이평선', '주기: 분기 패턴'] },
              ].map((item, idx) => (
                <motion.g key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: idx * 0.15 }}>
                  <ModuleBox x={item.x} y={10} w={120} h={36} label={item.label} sub={item.sub} color={item.color} />
                  {item.examples.map((ex, i) => (
                    <g key={i}>
                      <rect x={item.x + 5} y={56 + i * 26} width={110} height={20} rx={10} fill={`${item.color}12`} stroke={`${item.color}40`} strokeWidth={0.5} />
                      <text x={item.x + 60} y={70 + i * 26} textAnchor="middle" fontSize={8} fill="var(--foreground)">{ex}</text>
                    </g>
                  ))}
                </motion.g>
              ))}

              <motion.text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                모든 도메인에서 공통: 시간 축을 따라 피처를 추출
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: 파이프라인 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { x: 10, label: '원본', sub: '시계열', color: '#6366f1' },
                { x: 105, label: '래그/차분', sub: 'y(t-k)', color: '#3b82f6' },
                { x: 200, label: '롤링 통계', sub: 'mean/std', color: '#10b981' },
                { x: 295, label: '주기 인코딩', sub: 'sin/cos', color: '#f59e0b' },
                { x: 390, label: '피처 테이블', sub: '최종 출력', color: '#8b5cf6' },
              ].map((item, idx) => (
                <motion.g key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: idx * 0.12 }}>
                  <ActionBox x={item.x} y={60} w={85} h={44} label={item.label} sub={item.sub} color={item.color} />
                  {idx < 4 && (
                    <motion.line x1={item.x + 88} y1={82} x2={item.x + 102} y2={82}
                      stroke={item.color} strokeWidth={1.2} markerEnd={`url(#arrP${idx})`}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ ...sp, delay: idx * 0.12 + 0.1 }} />
                  )}
                </motion.g>
              ))}

              {/* 미래 누출 경고 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.7 }}>
                <rect x={140} y={130} width={200} height={30} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={240} y={149} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">주의: 미래 누출(Leakage) 방지 필수</text>
              </motion.g>

              <defs>
                {[0, 1, 2, 3].map((i) => (
                  <marker key={i} id={`arrP${i}`} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                    <path d="M0,0 L10,5 L0,10 Z" fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i]} />
                  </marker>
                ))}
              </defs>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
