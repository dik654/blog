import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './CategoricalVizData';

export default function CategoricalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Label Encoding */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">범주 → 정수 매핑</text>
              {[
                { cat: '서울', val: 0, y: 50 },
                { cat: '부산', val: 1, y: 85 },
                { cat: '대구', val: 2, y: 120 },
                { cat: '인천', val: 3, y: 155 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <DataBox x={100} y={item.y} w={80} h={28} label={item.cat} color={COLORS.label} />
                  <line x1={185} y1={item.y + 14} x2={280} y2={item.y + 14} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowC)" />
                  <rect x={290} y={item.y} width={50} height={28} rx={14} fill={`${COLORS.label}15`} stroke={COLORS.label} strokeWidth={1} />
                  <text x={315} y={item.y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.label}>{item.val}</text>
                </motion.g>
              ))}
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.label} fontWeight={600}>
                순서가 있는 범주(학력: 초등=0, 중등=1, 고등=2)에 적합
              </text>
            </motion.g>
          )}

          {/* Step 1: One-Hot Encoding */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">범주 → 이진 벡터</text>
              {/* Categories */}
              {['서울', '부산', '대구'].map((cat, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <DataBox x={30} y={50 + i * 50} w={70} h={28} label={cat} color={COLORS.onehot} />
                  <line x1={105} y1={64 + i * 50} x2={150} y2={64 + i * 50} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowC)" />
                </motion.g>
              ))}
              {/* Matrix header */}
              {['서울', '부산', '대구'].map((h, i) => (
                <text key={i} x={185 + i * 80} y={40} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{h}</text>
              ))}
              {/* Matrix values */}
              {[
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
              ].map((row, ri) =>
                row.map((v, ci) => (
                  <motion.g key={`${ri}-${ci}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.2 + (ri * 3 + ci) * 0.05 }}>
                    <rect x={160 + ci * 80} y={50 + ri * 50} width={50} height={28} rx={4}
                      fill={v === 1 ? `${COLORS.onehot}25` : 'var(--card)'} stroke={v === 1 ? COLORS.onehot : 'var(--border)'} strokeWidth={v === 1 ? 1.5 : 0.5} />
                    <text x={185 + ci * 80} y={68 + ri * 50} textAnchor="middle" fontSize={12}
                      fontWeight={v === 1 ? 700 : 400} fill={v === 1 ? COLORS.onehot : 'var(--muted-foreground)'}>{v}</text>
                  </motion.g>
                ))
              )}
              <text x={260} y={215} textAnchor="middle" fontSize={9} fill={COLORS.onehot} fontWeight={600}>
                범주 수가 많으면(100+) 차원 폭발 — 15개 이하에서 사용
              </text>
            </motion.g>
          )}

          {/* Step 2: Target Encoding */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">범주 → 타겟 평균값</text>
              {[
                { cat: '서울', count: 'n=1500', mean: '0.72', x: 30, y: 50 },
                { cat: '부산', count: 'n=800', mean: '0.58', x: 30, y: 95 },
                { cat: '제주', count: 'n=15', mean: '0.90?', x: 30, y: 140 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <DataBox x={item.x} y={item.y} w={80} h={32} label={item.cat} sub={item.count} color={COLORS.target} />
                  <line x1={115} y1={item.y + 16} x2={170} y2={item.y + 16} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowC)" />
                  <rect x={175} y={item.y + 2} width={60} height={28} rx={14} fill={`${COLORS.target}15`} stroke={COLORS.target} strokeWidth={1} />
                  <text x={205} y={item.y + 20} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.target}>{item.mean}</text>
                </motion.g>
              ))}
              {/* Smoothing explanation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={290} y={80} w={200} h={55} label="스무딩 공식" sub="(n × cat_mean + m × global_mean) / (n + m)" color={COLORS.target} />
                <text x={390} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">n이 작은 제주 → 전체 평균에 가중</text>
                <line x1={240} y1={156} x2={290} y2={115} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
              </motion.g>
              <text x={260} y={215} textAnchor="middle" fontSize={9} fill={COLORS.target} fontWeight={600}>
                관측 수 적은 범주는 스무딩으로 과적합 방지
              </text>
            </motion.g>
          )}

          {/* Step 3: Frequency Encoding */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">범주 → 출현 비율</text>
              {[
                { cat: '서울', freq: 0.45, w: 180 },
                { cat: '부산', freq: 0.25, w: 100 },
                { cat: '대구', freq: 0.15, w: 60 },
                { cat: '인천', freq: 0.10, w: 40 },
                { cat: '기타', freq: 0.05, w: 20 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <text x={95} y={55 + i * 32} textAnchor="end" fontSize={10} fill="var(--foreground)">{item.cat}</text>
                  <rect x={105} y={42 + i * 32} width={item.w} height={20} rx={3} fill={`${COLORS.freq}30`} stroke={COLORS.freq} strokeWidth={0.5} />
                  <text x={110 + item.w + 8} y={56 + i * 32} fontSize={10} fontWeight={600} fill={COLORS.freq}>
                    {item.freq.toFixed(2)}
                  </text>
                </motion.g>
              ))}
              <text x={260} y={215} textAnchor="middle" fontSize={9} fill={COLORS.freq} fontWeight={600}>
                정보 누수 없음 — 동일 빈도 범주는 구분 불가가 단점
              </text>
            </motion.g>
          )}

          {/* Step 4: Entity Embedding */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">신경망으로 밀집 벡터 학습</text>
              {/* Input categories */}
              {['서울', '부산', '대구'].map((cat, i) => (
                <DataBox key={i} x={20} y={50 + i * 55} w={65} h={28} label={cat} color={COLORS.embed} />
              ))}
              {/* Embedding lookup */}
              <ModuleBox x={130} y={65} w={100} h={55} label="Embedding" sub="학습 가능 행렬" color={COLORS.embed} />
              {/* Arrows in */}
              {[0, 1, 2].map(i => (
                <line key={i} x1={88} y1={64 + i * 55} x2={130} y2={92} stroke="var(--muted-foreground)" strokeWidth={0.6} />
              ))}
              {/* Output vectors */}
              {[
                { label: '[0.3, -0.8, 0.5]', y: 50 },
                { label: '[0.1, 0.6, -0.2]', y: 90 },
                { label: '[0.4, -0.1, 0.7]', y: 130 },
              ].map((v, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <line x1={235} y1={92} x2={280} y2={v.y + 14} stroke="var(--muted-foreground)" strokeWidth={0.6} />
                  {/* Vector cells */}
                  {[0, 1, 2].map(j => (
                    <rect key={j} x={285 + j * 55} y={v.y} width={50} height={28} rx={4}
                      fill={`${COLORS.embed}15`} stroke={COLORS.embed} strokeWidth={0.8} />
                  ))}
                  <text x={310} y={v.y + 18} textAnchor="middle" fontSize={9} fill={COLORS.embed} fontWeight={600}>
                    {v.label.split(',')[0].replace('[', '')}
                  </text>
                  <text x={365} y={v.y + 18} textAnchor="middle" fontSize={9} fill={COLORS.embed} fontWeight={600}>
                    {v.label.split(',')[1]?.trim()}
                  </text>
                  <text x={420} y={v.y + 18} textAnchor="middle" fontSize={9} fill={COLORS.embed} fontWeight={600}>
                    {v.label.split(',')[2]?.replace(']', '').trim()}
                  </text>
                </motion.g>
              ))}
              <text x={260} y={200} textAnchor="middle" fontSize={9} fill={COLORS.embed} fontWeight={600}>
                유사한 범주는 벡터 공간에서 가까이 위치 — 고카디널리티에 강력
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrowC" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
