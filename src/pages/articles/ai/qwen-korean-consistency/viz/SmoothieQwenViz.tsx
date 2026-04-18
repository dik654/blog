import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, SCALE_CURVE, PROB_BEFORE_AFTER, BENCHMARK } from './SmoothieQwenData';

const W = 480, H = 220;

export default function SmoothieQwenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <LmHeadShape />}
          {step === 1 && <CollectCJK />}
          {step === 2 && <ScaleCurve />}
          {step === 3 && <RowScale />}
          {step === 4 && <ProbShift />}
          {step === 5 && <BenchmarkBars />}
          {step === 6 && <Deployment />}
        </svg>
      )}
    </StepViz>
  );
}

function LmHeadShape() {
  const cx = W / 2;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={cx} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">lm_head W: 152K rows × 4096 cols</text>
      {/* 행렬 박스 */}
      <rect x={cx - 90} y={50} width={120} height={130} rx={4}
        fill="#3b82f608" stroke="#3b82f6" strokeWidth={1} />
      <text x={cx - 30} y={45} textAnchor="middle" fontSize={8.5}
        fill="var(--muted-foreground)">4096 hidden dim →</text>
      <text x={cx - 100} y={120} textAnchor="end" fontSize={8.5}
        fill="var(--muted-foreground)">152K{'\n'}tokens ↓</text>
      {/* 몇 개 row 강조 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={cx - 86} y={60 + i * 24} width={112} height={3}
          fill={i === 2 ? '#ef4444' : '#3b82f6'} opacity={i === 2 ? 1 : 0.5} />
      ))}
      <text x={cx + 36} y={106} fontSize={8} fill="#ef4444">W[t, :] ← row 단위</text>
      {/* 우측 설명 */}
      <DataBox x={cx + 90} y={70} w={100} h={32}
        label="z = W · h" color="#10b981" outlined />
      <text x={cx + 140} y={118} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">row 하나당</text>
      <text x={cx + 140} y={130} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">토큰 하나</text>
      <text x={cx + 140} y={146} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">독립적</text>
      <text x={cx} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">row만 만져도 모델 다른 부분은 그대로 — 부작용이 row 하나에 갇힌다</text>
    </motion.g>
  );
}

function CollectCJK() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">vocab 한 번 순회 → 한자 토큰 ID 집합</text>
      <ActionBox x={20} y={56} w={140} h={42}
        label="for t in vocab" sub="get_vocab() 순회" color="#3b82f6" />
      <text x={170} y={82} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={185} y={56} w={140} h={42}
        label="decode + check" sub="U+4E00~9FFF?" color="#a855f7" />
      <text x={335} y={82} fontSize={12} fill="var(--muted-foreground)">→</text>
      <DataBox x={350} y={64} w={110} h={28}
        label="cjk_ids set" color="#ef4444" outlined />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={60} y={120} width={360} height={64} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={75} y={138} fontSize={9} fontWeight={700} fill="var(--foreground)">예시 분류:</text>
        <text x={75} y={154} fontSize={9} fill="#ef4444">"分析"  → cjk ✓</text>
        <text x={200} y={154} fontSize={9} fill="#3b82f6">"분석"  → 한글 ✗</text>
        <text x={75} y={168} fontSize={9} fill="#ef4444">"問題"  → cjk ✓</text>
        <text x={200} y={168} fontSize={9} fill="#10b981">"def"   → ascii ✗</text>
      </motion.g>
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">결과: 약 2~3만 개 한자 토큰 ID (vocab의 15~20%)</text>
    </motion.g>
  );
}

function ScaleCurve() {
  const x0 = 70, y0 = 165, w = 340, h = 110;
  const toX = (v: number) => x0 + v * w;
  const toY = (v: number) => y0 - (v - 0.4) * (h / 0.6);
  const path = SCALE_CURVE.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${toX(p.x).toFixed(1)} ${toY(p.y).toFixed(1)}`
  ).join(' ');
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">α = min_scale + (1 − min_scale) · σ(−s · (purity − 0.5))</text>
      <text x={W / 2} y={40} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">min_scale=0.5, smoothness=10.0</text>
      {/* axes */}
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke="var(--border)" strokeWidth={1} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke="var(--border)" strokeWidth={1} />
      {/* y ticks */}
      {[0.5, 0.75, 1.0].map((v) => (
        <g key={v}>
          <line x1={x0 - 3} y1={toY(v)} x2={x0} y2={toY(v)}
            stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <text x={x0 - 6} y={toY(v) + 3} textAnchor="end" fontSize={7.5}
            fill="var(--muted-foreground)">{v.toFixed(2)}</text>
        </g>
      ))}
      {/* x ticks */}
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={toX(v)} y1={y0} x2={toX(v)} y2={y0 + 3}
            stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <text x={toX(v)} y={y0 + 13} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">{v}</text>
        </g>
      ))}
      <text x={x0 + w / 2} y={y0 + 25} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">한자 purity (토큰 안 한자 비율)</text>
      <text x={x0 - 28} y={y0 - h / 2} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)" transform={`rotate(-90 ${x0 - 28} ${y0 - h / 2})`}>α (스케일)</text>
      {/* curve */}
      <motion.path d={path} fill="none" stroke="#3b82f6" strokeWidth={1.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      {/* annotations */}
      <text x={toX(0.85)} y={toY(0.55)} fontSize={8} fill="#ef4444">순한자: α=0.5</text>
      <text x={toX(0.05)} y={toY(0.95)} fontSize={8} fill="#10b981">순한국어: α≈1</text>
    </motion.g>
  );
}

function RowScale() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">W[t, :] ← α_t · W[t, :]   — 한 줄짜리 변환</text>
      {/* before */}
      <text x={120} y={56} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">Before</text>
      <rect x={50} y={62} width={140} height={90} rx={4}
        fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.8} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const isCjk = i === 1 || i === 3 || i === 4;
        return (
          <rect key={i} x={56} y={70 + i * 13} width={128} height={5}
            fill={isCjk ? '#ef4444' : '#3b82f6'} opacity={0.7} />
        );
      })}
      {/* arrow */}
      <text x={210} y={108} fontSize={14} fontWeight={700}
        fill="var(--muted-foreground)">→</text>
      <text x={215} y={124} fontSize={8} fill="var(--muted-foreground)">scale</text>
      {/* after */}
      <text x={350} y={56} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">After</text>
      <rect x={280} y={62} width={140} height={90} rx={4}
        fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.8} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const isCjk = i === 1 || i === 3 || i === 4;
        const w = isCjk ? 64 : 128;
        return (
          <motion.rect key={i} x={286} y={70 + i * 13} height={5}
            initial={{ width: 128 }} animate={{ width: w }}
            transition={{ delay: 0.1 + i * 0.05 }}
            fill={isCjk ? '#ef4444' : '#3b82f6'} opacity={isCjk ? 0.5 : 0.7} />
        );
      })}
      <text x={W / 2} y={180} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한자 row만 절반으로 — 한국어 row는 그대로</text>
      <text x={W / 2} y={196} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">linear 연산이라 z[t] = α · (W_old[t] · h) 정확히 비례 축소</text>
    </motion.g>
  );
}

function ProbShift() {
  const x0 = 80, barH = 14, gap = 18;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">softmax 분포 — 한국어 토큰이 상대적으로 부상</text>
      <text x={170} y={42} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--muted-foreground)">Before (가드 없음)</text>
      <text x={360} y={42} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--muted-foreground)">After (Smoothie)</text>
      {PROB_BEFORE_AFTER.map((p, i) => {
        const isCn = p.kind === 'cn';
        const color = isCn ? '#ef4444' : '#3b82f6';
        const y = 56 + i * gap;
        return (
          <motion.g key={p.tok}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}>
            <text x={x0 - 8} y={y + 11} textAnchor="end" fontSize={9}
              fontWeight={700} fill={color}>{p.tok}</text>
            <rect x={x0} y={y} width={p.before * 200} height={barH}
              fill={`${color}40`} stroke={color} strokeWidth={0.6} />
            <text x={x0 + p.before * 200 + 4} y={y + 11} fontSize={7.5}
              fill="var(--muted-foreground)">{(p.before * 100).toFixed(0)}%</text>
            <rect x={290} y={y} width={p.after * 200} height={barH}
              fill={`${color}40`} stroke={color} strokeWidth={0.6} />
            <text x={290 + p.after * 200 + 4} y={y + 11} fontSize={7.5}
              fill="var(--muted-foreground)">{(p.after * 100).toFixed(0)}%</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={155} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">P(分析) 55→32% / P(분석) 30→42% — 부호가 뒤집힌다</text>
      <text x={W / 2} y={170} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">prompt가 못 건드린 0.1 logit 격차를 weight 한 번으로 끝낸다</text>
    </motion.g>
  );
}

function BenchmarkBars() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">벤치마크 영향 (저자 보고 추정)</text>
      {BENCHMARK.map((b, i) => {
        const y = 50 + i * 32;
        const isLeak = b.name.includes('leak');
        const beforeW = isLeak ? b.before * 4 : b.before * 2.4;
        const afterW = isLeak ? b.after * 4 : b.after * 2.4;
        return (
          <motion.g key={b.name}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <text x={90} y={y + 10} textAnchor="end" fontSize={9}
              fontWeight={700} fill="var(--foreground)">{b.name}</text>
            <rect x={100} y={y} width={beforeW} height={9}
              fill="#a3a3a340" stroke="#a3a3a3" strokeWidth={0.5} />
            <text x={104 + beforeW} y={y + 8} fontSize={7.5}
              fill="var(--muted-foreground)">{b.before}</text>
            <rect x={100} y={y + 12} width={afterW} height={9}
              fill={isLeak ? '#10b98140' : '#3b82f640'}
              stroke={isLeak ? '#10b981' : '#3b82f6'} strokeWidth={0.5} />
            <text x={104 + afterW} y={y + 20} fontSize={7.5}
              fill="var(--muted-foreground)">{b.after} {isLeak ? '↓' : ''}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">정확도 평균 −2% / 한자 leakage −36% — 비대칭적으로 좋은 trade</text>
    </motion.g>
  );
}

function Deployment() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">드롭인 교체 — 모델 이름만 바꾸면 끝</text>
      <ModuleBox x={30} y={56} w={150} h={42}
        label="Qwen3-8B" sub="원본" color="#a3a3a3" />
      <text x={195} y={82} fontSize={14} fontWeight={700} fill="#3b82f6">→</text>
      <ModuleBox x={215} y={56} w={210} h={42}
        label="dnotitia/Smoothie-Qwen3-8B" sub="HF에 이미 변환됨" color="#3b82f6" />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={40} y={120} width={400} height={68} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={55} y={138} fontSize={9} fontWeight={700}
          fill="var(--foreground)">지원 사이즈</text>
        <text x={55} y={154} fontSize={9} fill="var(--muted-foreground)">• Qwen3: 0.6B / 1.7B / 4B / 8B / 14B / 32B / 235B</text>
        <text x={55} y={168} fontSize={9} fill="var(--muted-foreground)">• Qwen2.5: 0.5B ~ 72B 전 사이즈</text>
        <text x={55} y={182} fontSize={9} fill="var(--muted-foreground)">• Apache 2.0 — 상용 OK / 자체 변환은 smoothie-qwen 패키지 1회 호출</text>
      </motion.g>
    </motion.g>
  );
}
