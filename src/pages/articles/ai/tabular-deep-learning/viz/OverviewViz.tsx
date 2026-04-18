import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS as C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 벤치마크 결과 바 차트 데이터 */
const benchmarks = [
  { name: 'XGBoost', score: 0.84, color: C.gbm },
  { name: 'LightGBM', score: 0.82, color: C.gbm },
  { name: 'CatBoost', score: 0.81, color: C.gbm },
  { name: 'TabNet', score: 0.74, color: C.dl },
  { name: 'MLP', score: 0.71, color: C.dl },
  { name: 'FT-Trans', score: 0.78, color: C.dl },
];

/* 테이블 데이터 특성 아이콘 */
const features = [
  { label: '수치형', ex: '나이, 소득', x: 30 },
  { label: '범주형', ex: '직업, 도시', x: 180 },
  { label: '혼합', ex: '순서 없음', x: 330 },
];

/* DL 조건 */
const dlConditions = [
  { label: '100K+ 샘플', y: 40, icon: '📊' },
  { label: '멀티모달', y: 100, icon: '🔗' },
  { label: '고카디널리티', y: 160, icon: '🏷️' },
];

/* 모델 진화 타임라인 */
const timeline = [
  { name: 'Wide&Deep', year: '2016', x: 20 },
  { name: 'DeepFM', year: '2017', x: 120 },
  { name: 'TabNet', year: '2019', x: 220 },
  { name: 'FT-Trans', year: '2021', x: 330 },
  { name: 'TabPFN', year: '2022', x: 430 },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              {/* 벤치마크 바 차트 */}
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                45개 데이터셋 평균 정규화 성능
              </text>
              {benchmarks.map((b, i) => (
                <motion.g key={b.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <text x={70} y={48 + i * 30} textAnchor="end" fontSize={10} fontWeight={600}
                    fill={b.color}>{b.name}</text>
                  <rect x={80} y={38 + i * 30} width={0} height={18} rx={4}
                    fill={b.color} opacity={0.15} />
                  <motion.rect x={80} y={38 + i * 30} height={18} rx={4}
                    fill={b.color} opacity={0.8}
                    initial={{ width: 0 }} animate={{ width: b.score * 380 }}
                    transition={{ ...sp, delay: i * 0.08 + 0.2 }} />
                  <motion.text x={80 + b.score * 380 + 8} y={52 + i * 30}
                    fontSize={9} fontWeight={600} fill={b.color}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 + 0.5 }}>
                    {b.score.toFixed(2)}
                  </motion.text>
                </motion.g>
              ))}
              {/* GBM / DL 범례 */}
              <rect x={380} y={204} width={10} height={10} rx={2} fill={C.gbm} />
              <text x={394} y={213} fontSize={9} fill={C.gbm}>GBM</text>
              <rect x={430} y={204} width={10} height={10} rx={2} fill={C.dl} />
              <text x={444} y={213} fontSize={9} fill={C.dl}>DL</text>
            </g>
          )}

          {step === 1 && (
            <g>
              {/* 테이블 데이터 특성 */}
              {features.map((f, i) => (
                <motion.g key={f.label} initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.1 }}>
                  <ModuleBox x={f.x} y={20} w={130} h={52} label={f.label} sub={f.ex}
                    color={C.data} />
                </motion.g>
              ))}
              {/* 화살표 → 문제점 */}
              <motion.line x1={260} y1={80} x2={260} y2={105} stroke={C.warn}
                strokeWidth={1.5} markerEnd="url(#arrowWarn)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4 }} />
              <defs>
                <marker id="arrowWarn" viewBox="0 0 10 10" refX={8} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
                </marker>
              </defs>
              <AlertBox x={170} y={110} w={180} h={52}
                label="DL의 약점" sub="공간 관계 없음 + 과적합 취약" color={C.warn} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <text x={260} y={190} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  이미지·텍스트와 달리 — 피처 순서를 바꿔도 의미 동일
                </text>
                <text x={260} y={206} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  GBM은 결정 경계를 split으로 직접 학습 → 적은 데이터에도 강건
                </text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              {/* DL이 이기는 3조건 */}
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.dl}>DL이 GBM에 접근·추월하는 조건</text>
              {dlConditions.map((c, i) => (
                <motion.g key={c.label} initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: i * 0.15 }}>
                  <text x={40} y={c.y + 15} fontSize={20}>{c.icon}</text>
                  <DataBox x={75} y={c.y} w={140} h={36} label={c.label} color={C.dl} />
                  {/* 화살표 → 효과 */}
                  <line x1={220} y1={c.y + 18} x2={260} y2={c.y + 18}
                    stroke={C.dl} strokeWidth={1} strokeDasharray="4 3" />
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={270} y={30} width={220} height={170} rx={10}
                  fill={C.dl + '08'} stroke={C.dl} strokeWidth={0.8} />
                <text x={380} y={55} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.dl}>DL 이점</text>
                <text x={380} y={80} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">파라미터 용량으로 복잡 패턴 학습</text>
                <text x={380} y={100} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">이미지·텍스트 인코더 결합 가능</text>
                <text x={380} y={120} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">임베딩으로 희소 범주 표현</text>
                <text x={380} y={150} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C.dl}>사전학습 → 파인튜닝 파이프라인</text>
                <text x={380} y={170} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">GBM에는 없는 전이 학습 전략</text>
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              {/* 타임라인 */}
              <motion.line x1={20} y1={80} x2={500} y2={80}
                stroke="var(--border)" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }} />
              {timeline.map((t, i) => (
                <motion.g key={t.name} initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.12 }}>
                  <circle cx={t.x + 35} cy={80} r={5} fill={C.dl} />
                  <text x={t.x + 35} y={65} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={C.dl}>{t.name}</text>
                  <text x={t.x + 35} y={100} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">{t.year}</text>
                </motion.g>
              ))}
              {/* 핵심 전략 박스 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}>
                <rect x={60} y={130} width={170} height={50} rx={8}
                  fill={C.data + '10'} stroke={C.data} strokeWidth={0.8} />
                <text x={145} y={150} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.data}>피처 선택 자동화</text>
                <text x={145} y={166} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">TabNet — sparse attention mask</text>

                <rect x={290} y={130} width={170} height={50} rx={8}
                  fill={C.dl + '10'} stroke={C.dl} strokeWidth={0.8} />
                <text x={375} y={150} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.dl}>피처 토큰화</text>
                <text x={375} y={166} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">FT-Transformer — self-attention</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
