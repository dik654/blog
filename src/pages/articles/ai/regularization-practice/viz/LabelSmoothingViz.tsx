import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS } from './LabelSmoothingData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const classes = ['고양이', '개', '새', '물고기', '토끼'];

function BarChart({ values, colors, ox, oy, w, h, label }: {
  values: number[]; colors: string[]; ox: number; oy: number; w: number; h: number; label: string;
}) {
  const barW = (w - (values.length + 1) * 6) / values.length;
  return (
    <g>
      <text x={ox + w / 2} y={oy - 6} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">{label}</text>
      <rect x={ox} y={oy} width={w} height={h} rx={4}
        fill="none" stroke="var(--border)" strokeWidth={0.4} />
      {values.map((v, i) => {
        const bx = ox + 6 + i * (barW + 6);
        const bh = v * (h - 20);
        return (
          <g key={i}>
            <motion.rect x={bx} y={oy + h - 10 - bh} width={barW} height={bh} rx={2}
              fill={colors[i]} fillOpacity={0.5} stroke={colors[i]} strokeWidth={0.6}
              initial={{ height: 0, y: oy + h - 10 }}
              animate={{ height: bh, y: oy + h - 10 - bh }}
              transition={{ ...sp, delay: i * 0.06 }} />
            <text x={bx + barW / 2} y={oy + h - 12 - bh} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={colors[i]}>{v.toFixed(2)}</text>
            <text x={bx + barW / 2} y={oy + h - 1} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">{classes[i]}</text>
          </g>
        );
      })}
    </g>
  );
}

/* Mixup 시각화: 두 이미지 합성 */
function MixupDiagram() {
  const lambda = 0.7;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Mixup: 선형 보간</text>

      {/* Image A */}
      <rect x={30} y={30} width={60} height={50} rx={4}
        fill={`${COLORS.hard}20`} stroke={COLORS.hard} strokeWidth={0.8} />
      <text x={60} y={52} textAnchor="middle" fontSize={9} fill={COLORS.hard}>고양이</text>
      <text x={60} y={64} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">xᵢ</text>

      {/* × λ */}
      <text x={110} y={55} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={COLORS.mixup}>× {lambda}</text>

      {/* + */}
      <text x={150} y={55} textAnchor="middle" fontSize={14} fontWeight={700}
        fill="var(--muted-foreground)">+</text>

      {/* Image B */}
      <rect x={170} y={30} width={60} height={50} rx={4}
        fill={`${COLORS.smooth}20`} stroke={COLORS.smooth} strokeWidth={0.8} />
      <text x={200} y={52} textAnchor="middle" fontSize={9} fill={COLORS.smooth}>개</text>
      <text x={200} y={64} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">xⱼ</text>

      {/* × (1-λ) */}
      <text x={250} y={55} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={COLORS.mixup}>× {(1 - lambda).toFixed(1)}</text>

      {/* → */}
      <text x={290} y={55} textAnchor="middle" fontSize={14}
        fill="var(--muted-foreground)">→</text>

      {/* 혼합 이미지 */}
      <rect x={310} y={30} width={60} height={50} rx={4}
        fill={`${COLORS.mixup}20`} stroke={COLORS.mixup} strokeWidth={1.2} />
      <text x={340} y={48} textAnchor="middle" fontSize={8} fill={COLORS.mixup}>혼합</text>
      <text x={340} y={60} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        λxᵢ+(1-λ)xⱼ
      </text>

      {/* 라벨 혼합 */}
      <rect x={390} y={30} width={70} height={50} rx={4}
        fill={`${COLORS.mixup}10`} stroke={COLORS.mixup} strokeWidth={0.6} />
      <text x={425} y={46} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.mixup}>
        혼합 라벨
      </text>
      <text x={425} y={58} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        고양이: 0.7
      </text>
      <text x={425} y={68} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        개: 0.3
      </text>

      {/* 수식 */}
      <rect x={50} y={95} width={380} height={32} rx={6}
        fill={`${COLORS.mixup}08`} stroke={COLORS.mixup} strokeWidth={0.6} />
      <text x={240} y={110} textAnchor="middle" fontSize={8} fontFamily="monospace"
        fill={COLORS.mixup} fontWeight={600}>
        x̃ = λ·xᵢ + (1-λ)·xⱼ, ỹ = λ·yᵢ + (1-λ)·yⱼ
      </text>
      <text x={240} y={122} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        λ ~ Beta(α, α), α=0.2~0.4 — 결정경계를 선형으로 부드럽게 만듦
      </text>
    </g>
  );
}

/* CutMix 시각화 */
function CutMixDiagram() {
  const cutRatio = 0.35;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">CutMix: 영역 교체</text>

      {/* Image A */}
      <rect x={40} y={30} width={80} height={70} rx={4}
        fill={`${COLORS.hard}15`} stroke={COLORS.hard} strokeWidth={0.8} />
      <text x={80} y={62} textAnchor="middle" fontSize={9} fill={COLORS.hard}>고양이</text>
      <text x={80} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Image A</text>

      {/* + */}
      <text x={140} y={65} textAnchor="middle" fontSize={14} fontWeight={700}
        fill="var(--muted-foreground)">+</text>

      {/* Image B (cut 영역) */}
      <rect x={160} y={30} width={80} height={70} rx={4}
        fill={`${COLORS.cutmix}15`} stroke={COLORS.cutmix} strokeWidth={0.8} />
      {/* cut 영역 하이라이트 */}
      <motion.rect x={170} y={40} width={80 * cutRatio} height={70 * cutRatio} rx={2}
        fill={COLORS.cutmix} fillOpacity={0.3} stroke={COLORS.cutmix} strokeWidth={1}
        strokeDasharray="3 1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
      <text x={200} y={62} textAnchor="middle" fontSize={9} fill={COLORS.cutmix}>개</text>
      <text x={200} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Image B</text>

      {/* → */}
      <text x={260} y={65} textAnchor="middle" fontSize={14}
        fill="var(--muted-foreground)">→</text>

      {/* 결합 이미지 */}
      <rect x={280} y={30} width={80} height={70} rx={4}
        fill={`${COLORS.hard}15`} stroke="var(--border)" strokeWidth={0.8} />
      <motion.rect x={290} y={40} width={80 * cutRatio} height={70 * cutRatio} rx={2}
        fill={`${COLORS.cutmix}30`} stroke={COLORS.cutmix} strokeWidth={0.8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }} />
      <text x={320} y={80} textAnchor="middle" fontSize={8} fill="var(--foreground)">혼합</text>
      <text x={320} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Result</text>

      {/* 라벨 */}
      <rect x={380} y={30} width={80} height={70} rx={4}
        fill={`${COLORS.cutmix}08`} stroke={COLORS.cutmix} strokeWidth={0.6} />
      <text x={420} y={48} textAnchor="middle" fontSize={8} fontWeight={600}
        fill={COLORS.cutmix}>혼합 라벨</text>
      <text x={420} y={62} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        고양이: {(1 - cutRatio * cutRatio).toFixed(2)}
      </text>
      <text x={420} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        개: {(cutRatio * cutRatio).toFixed(2)}
      </text>
      <text x={420} y={88} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        (면적 비율)
      </text>

      {/* 장점 */}
      <rect x={50} y={120} width={380} height={26} rx={6}
        fill={`${COLORS.cutmix}08`} stroke={COLORS.cutmix} strokeWidth={0.6} />
      <text x={240} y={136} textAnchor="middle" fontSize={8}
        fill={COLORS.cutmix} fontWeight={600}>
        Mixup보다 지역(local) 정보 보존 — 객체 탐지·세분화에 특히 효과적
      </text>
    </g>
  );
}

export default function LabelSmoothingViz() {
  const K = 5, eps = 0.1;
  const hard = [1.0, 0.0, 0.0, 0.0, 0.0];
  const smooth = hard.map(v => v === 1 ? 1 - eps + eps / K : eps / K);

  const hardColors = hard.map((_, i) => i === 0 ? COLORS.hard : '#aaaaaa');
  const smoothColors = smooth.map((_, i) => i === 0 ? COLORS.smooth : '#8888bb');

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <BarChart values={hard} colors={hardColors}
                ox={40} oy={18} w={400} h={120} label="Hard Label (원-핫)" />
              <text x={240} y={152} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">
                정답에 1.00 — 모델이 극단적 logit 출력을 강요받음 → 과신(overconfidence)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <BarChart values={smooth} colors={smoothColors}
                ox={40} oy={18} w={400} h={120}
                label={`Label Smoothing (ε=${eps}, K=${K})`} />
              <text x={240} y={152} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">
                정답: {smooth[0].toFixed(2)}, 나머지: {smooth[1].toFixed(2)}씩 — "확신하되, 지나치지 않게"
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <MixupDiagram />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <CutMixDiagram />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
