import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './ColorData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 간이 이미지 블록 — 색상 변형 시각화 */
function ColorBlock({ x, y, w, h, baseColor, brightness = 1, contrast = 1, saturation = 1 }: {
  x: number; y: number; w: number; h: number; baseColor: string;
  brightness?: number; contrast?: number; saturation?: number;
}) {
  const opacity = Math.min(1, brightness * 0.7);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={baseColor} opacity={opacity} />
      {/* contrast 시뮬레이션 — 밝은/어두운 영역 */}
      <rect x={x} y={y} width={w / 2} height={h} rx={6}
        fill="white" opacity={0.1 * contrast} />
      <rect x={x + w / 2} y={y} width={w / 2} height={h} rx={6}
        fill="black" opacity={0.08 * contrast} />
      {/* saturation 표시 — 테두리 두께 */}
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill="none" stroke={baseColor} strokeWidth={saturation * 2} />
    </g>
  );
}

export default function ColorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">ColorJitter — 4가지 색상 파라미터</text>

              {/* 원본 */}
              <text x={60} y={48} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">원본</text>
              <ColorBlock x={20} y={55} w={80} h={65} baseColor="#4a90d9" />

              {/* 4가지 변형 */}
              {[
                { label: 'Brightness+', color: '#6ab3ff', brightness: 1.4, y: 40 },
                { label: 'Contrast+', color: '#4a90d9', contrast: 2.0, y: 40 },
                { label: 'Saturation+', color: '#2563eb', saturation: 2.0, y: 130 },
                { label: 'Hue Shift', color: '#d94a7a', brightness: 1, y: 130 },
              ].map((item, i) => {
                const col = Math.floor(i / 2);
                const row = i % 2;
                const xPos = 160 + row * 170;
                const yPos = item.y;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: i * 0.12 }}>
                    <text x={xPos + 40} y={yPos + 8} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">{item.label}</text>
                    <ColorBlock x={xPos} y={yPos + 15} w={80} h={55} baseColor={item.color}
                      brightness={item.brightness || 1} contrast={item.contrast || 1}
                      saturation={item.saturation || 1} />
                  </motion.g>
                );
              })}

              {/* 조합 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <text x={260} y={220} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  4가지를 독립 랜덤 적용 → 조합 폭발로 다양성 극대화
                </text>
                <text x={260} y={238} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1 — 일반적 범위
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Normalization — 사전학습 분포 맞추기</text>

              {/* ImageNet 통계 */}
              <ModuleBox x={60} y={45} w={160} h={50} label="ImageNet 통계" sub="120만 장 기준" color={COLORS.normalize} />

              {/* RGB 채널별 값 */}
              {[
                { ch: 'R', mean: '0.485', std: '0.229', color: '#ef4444' },
                { ch: 'G', mean: '0.456', std: '0.224', color: '#10b981' },
                { ch: 'B', mean: '0.406', std: '0.225', color: '#3b82f6' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
                  <DataBox x={60 + i * 60} y={110} w={55} h={28}
                    label={`${item.ch}: μ=${item.mean}`} sub={`σ=${item.std}`} color={item.color} />
                </motion.g>
              ))}

              {/* 수식 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={280} y={55} width={210} height={80} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={385} y={80} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">정규화 공식</text>
                <text x={385} y={100} textAnchor="middle" fontSize={10}
                  fill={COLORS.normalize}>x_norm = (x - mean) / std</text>
                <text x={385} y={118} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">채널별 독립 적용</text>
              </motion.g>

              {/* 주의사항 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={60} y={160} width={400} height={70} rx={6}
                  fill={`${COLORS.normalize}08`} stroke={COLORS.normalize} strokeWidth={0.5} />
                <text x={260} y={182} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.normalize}>사전학습 모델 사용 시 반드시 동일 통계 적용</text>
                <text x={260} y={200} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">ResNet, EfficientNet 등은 ImageNet mean/std로 학습됨</text>
                <text x={260} y={215} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">다른 mean/std를 쓰면 첫 번째 레이어 입력 분포가 어긋나 전이학습 효과 감소</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">CLAHE — 지역 히스토그램 평활화</text>

              {/* 전역 vs 지역 비교 */}
              <text x={130} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">전역 평활화</text>

              {/* 단일 히스토그램 */}
              <rect x={40} y={58} width={180} height={80} rx={4}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                const h = [30, 15, 8, 12, 35, 50, 25, 10];
                return (
                  <motion.rect key={i} x={52 + i * 20} y={128 - h[i]} width={14} height={h[i]}
                    rx={2} fill={COLORS.clahe} opacity={0.5}
                    initial={{ height: 0, y: 128 }} animate={{ height: h[i], y: 128 - h[i] }}
                    transition={{ ...sp, delay: i * 0.04 }} />
                );
              })}
              <text x={130} y={148} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">밝은 영역 과포화 위험</text>

              {/* CLAHE — 타일 분할 */}
              <text x={390} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">CLAHE (타일별 적응)</text>

              {/* 4x2 타일 그리드 */}
              {[0, 1].map(r =>
                [0, 1, 2, 3].map(c => {
                  const heights = [[20, 25, 30, 15], [10, 35, 20, 28]];
                  return (
                    <motion.g key={`${r}-${c}`}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...sp, delay: 0.2 + (r * 4 + c) * 0.05 }}>
                      <rect x={300 + c * 48} y={58 + r * 45} width={44} height={40} rx={3}
                        fill="var(--card)" stroke={COLORS.clahe} strokeWidth={0.5} />
                      {/* 각 타일의 미니 히스토그램 */}
                      {[0, 1, 2].map(b => {
                        const bh = heights[r][c] * (0.5 + b * 0.25);
                        return (
                          <rect key={b} x={305 + c * 48 + b * 12} y={88 + r * 45 - bh}
                            width={8} height={bh} rx={1}
                            fill={COLORS.clahe} opacity={0.4 + c * 0.1} />
                        );
                      })}
                    </motion.g>
                  );
                })
              )}
              <text x={390} y={160} textAnchor="middle" fontSize={8}
                fill={COLORS.clahe}>타일별 독립 평활화 → 지역 디테일 보존</text>

              {/* clip limit 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <ActionBox x={120} y={180} w={280} h={36} label="clip_limit=2.0 — 히스토그램 상한 제한으로 과도한 증폭 방지"
                  sub="tile_grid_size=(8,8) — 타일 크기. 작을수록 세밀한 적응" color={COLORS.clahe} />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Random Erasing — 가려짐 시뮬레이션</text>

              {/* 원본 이미지 */}
              <rect x={30} y={45} width={140} height={140} rx={6}
                fill={`${COLORS.normalize}15`} stroke={COLORS.normalize} strokeWidth={0.8} />
              {/* 간이 물체(원) */}
              <circle cx={100} cy={115} r={35} fill={COLORS.normalize} opacity={0.4} />
              <text x={100} y={120} textAnchor="middle" fontSize={9} fill={COLORS.normalize}>물체</text>
              <text x={100} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">원본</text>

              {/* 화살표 */}
              <motion.text x={205} y={120} textAnchor="middle" fontSize={18}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp}>→</motion.text>

              {/* Erased 이미지 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={240} y={45} width={140} height={140} rx={6}
                  fill={`${COLORS.normalize}15`} stroke={COLORS.normalize} strokeWidth={0.8} />
                <circle cx={310} cy={115} r={35} fill={COLORS.normalize} opacity={0.4} />
                {/* 랜덤 영역 마스킹 */}
                <motion.rect x={275} y={90} width={50} height={35} rx={2}
                  fill={COLORS.erasing} opacity={0.8}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.4 }} />
                <text x={300} y={112} textAnchor="middle" fontSize={8}
                  fill="white" fontWeight={600}>Erased</text>
                <text x={310} y={200} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">마스킹 적용</text>
              </motion.g>

              {/* 파라미터 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={400} y={50} width={110} height={130} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={455} y={72} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">파라미터</text>
                {[
                  { k: 'p', v: '0.5' },
                  { k: 'scale', v: '(0.02, 0.33)' },
                  { k: 'ratio', v: '(0.3, 3.3)' },
                  { k: 'value', v: '0 or random' },
                ].map((item, i) => (
                  <g key={i}>
                    <text x={412} y={95 + i * 22} fontSize={8} fontWeight={600}
                      fill={COLORS.erasing}>{item.k}</text>
                    <text x={412} y={106 + i * 22} fontSize={7}
                      fill="var(--muted-foreground)">{item.v}</text>
                  </g>
                ))}
              </motion.g>

              <text x={260} y={230} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                모델이 부분 가려짐에서도 물체를 인식하도록 강제
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
