import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { STEPS, COLORS } from './GeometricData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 간이 이미지 표현 — 집 모양 */
function HouseIcon({ x, y, size, color, scaleX = 1, rotate = 0 }: {
  x: number; y: number; size: number; color: string; scaleX?: number; rotate?: number;
}) {
  return (
    <g transform={`translate(${x + size / 2}, ${y + size / 2}) rotate(${rotate}) scale(${scaleX}, 1) translate(${-size / 2}, ${-size / 2})`}>
      <rect x={0} y={0} width={size} height={size} rx={4} fill={`${color}18`} stroke={color} strokeWidth={0.8} />
      {/* 지붕 삼각형 */}
      <polygon points={`${size * 0.2},${size * 0.45} ${size * 0.5},${size * 0.15} ${size * 0.8},${size * 0.45}`}
        fill={color} opacity={0.5} />
      {/* 몸체 */}
      <rect x={size * 0.25} y={size * 0.45} width={size * 0.5} height={size * 0.4}
        fill={color} opacity={0.3} />
      {/* 문 */}
      <rect x={size * 0.4} y={size * 0.55} width={size * 0.2} height={size * 0.3}
        fill={color} opacity={0.6} />
    </g>
  );
}

export default function GeometricViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Horizontal Flip — 좌우 반전</text>

              {/* Before */}
              <text x={130} y={48} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">원본</text>
              <HouseIcon x={65} y={55} size={130} color={COLORS.original} />

              {/* Arrow */}
              <motion.text x={260} y={125} textAnchor="middle" fontSize={18}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp}>
                →
              </motion.text>

              {/* After — flipped */}
              <text x={390} y={48} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Flip</text>
              <motion.g initial={{ scaleX: 1 }} animate={{ scaleX: 1 }} transition={sp}>
                <HouseIcon x={325} y={55} size={130} color={COLORS.flipped} scaleX={-1} />
              </motion.g>

              {/* 주의사항 */}
              <rect x={60} y={200} width={400} height={35} rx={6}
                fill={`${COLORS.flipped}08`} stroke={COLORS.flipped} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={260} y={222} textAnchor="middle" fontSize={9} fill={COLORS.flipped}>
                주의: 좌우 구분이 중요한 도메인(문자 인식, 의료 좌/우)에서는 사용 금지
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Rotation — 각도 제한이 핵심</text>

              {/* 원본 */}
              <HouseIcon x={25} y={50} size={90} color={COLORS.original} />
              <text x={70} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">원본</text>

              {/* ±15° 회전 */}
              {[-15, 15].map((angle, i) => (
                <motion.g key={angle} initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <HouseIcon x={145 + i * 120} y={50} size={90} color={COLORS.rotated} rotate={angle} />
                  <text x={190 + i * 120} y={155} textAnchor="middle" fontSize={8}
                    fill={COLORS.rotated}>{angle > 0 ? '+' : ''}{angle}°</text>
                </motion.g>
              ))}

              {/* 과도한 회전 — 의미 변질 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <HouseIcon x={400} y={50} size={90} color={COLORS.affine} rotate={90} />
                <text x={445} y={155} textAnchor="middle" fontSize={8}
                  fill={COLORS.affine}>90° — 의미 변질</text>
              </motion.g>

              {/* 도메인별 허용 범위 */}
              <rect x={40} y={175} width={440} height={55} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              {[
                { domain: '얼굴', range: '±15°', x: 130 },
                { domain: '자연 이미지', range: '±30°', x: 260 },
                { domain: '항공/위성', range: '0~360°', x: 390 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <text x={item.x} y={197} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill="var(--foreground)">{item.domain}</text>
                  <text x={item.x} y={215} textAnchor="middle" fontSize={9}
                    fill={COLORS.rotated}>{item.range}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Random Crop & Resize</text>

              {/* 원본 큰 이미지 */}
              <rect x={30} y={40} width={160} height={160} rx={6}
                fill={`${COLORS.original}10`} stroke={COLORS.original} strokeWidth={0.8} />
              <text x={110} y={58} textAnchor="middle" fontSize={8}
                fill={COLORS.original}>원본 256×256</text>

              {/* 랜덤 crop 영역 */}
              <motion.rect x={60} y={70} width={100} height={100} rx={4}
                fill="transparent" stroke={COLORS.cropped} strokeWidth={1.5} strokeDasharray="5 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
              <motion.text x={110} y={130} textAnchor="middle" fontSize={8}
                fill={COLORS.cropped}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                crop 영역
              </motion.text>

              {/* 화살표 */}
              <motion.line x1={200} y1={120} x2={260} y2={120}
                stroke="#888" strokeWidth={1} markerEnd="url(#geo-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.4 }} />
              <text x={230} y={112} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">resize</text>

              <defs>
                <marker id="geo-arrow" viewBox="0 0 10 10" refX={9} refY={5}
                  markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
                </marker>
              </defs>

              {/* Resize 결과 */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={270} y={40} width={160} height={160} rx={6}
                  fill={`${COLORS.cropped}15`} stroke={COLORS.cropped} strokeWidth={0.8} />
                <text x={350} y={125} textAnchor="middle" fontSize={9}
                  fill={COLORS.cropped}>224×224로 복원</text>
              </motion.g>

              {/* scale 범위 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <text x={260} y={225} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  scale=(0.08, 1.0) — 작은 crop은 확대, 큰 crop은 미세 이동 효과
                </text>
                <text x={260} y={240} textAnchor="middle" fontSize={8} fill={COLORS.cropped}>
                  ImageNet 표준: RandomResizedCrop(224)
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Affine Transform — 복합 변환</text>

              {/* 변환 행렬 */}
              <rect x={160} y={35} width={200} height={45} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={260} y={55} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">[a b tx; c d ty]</text>
              <text x={260} y={70} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">2x3 아핀 변환 행렬 — 6개 파라미터</text>

              {/* 4가지 변환 요소 */}
              {[
                { label: 'Translate', sub: '±10%', x: 40, color: COLORS.original },
                { label: 'Scale', sub: '0.8~1.2', x: 165, color: COLORS.rotated },
                { label: 'Rotate', sub: '±15°', x: 290, color: COLORS.cropped },
                { label: 'Shear', sub: '±10°', x: 415, color: COLORS.affine },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={item.x} y={100} width={80} height={80} rx={6}
                    fill={`${item.color}12`} stroke={item.color} strokeWidth={0.8} />
                  <text x={item.x + 40} y={135} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={item.color}>{item.label}</text>
                  <text x={item.x + 40} y={150} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{item.sub}</text>
                </motion.g>
              ))}

              {/* 합성 화살표 */}
              {[0, 1, 2].map(i => (
                <motion.text key={i} x={130 + i * 125} y={140} textAnchor="middle" fontSize={14}
                  fill="var(--muted-foreground)"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.1 }}>+</motion.text>
              ))}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <rect x={120} y={200} width={280} height={35} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={222} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">
                  한 번의 행렬 곱으로 모든 변환을 동시 적용 — 효율적
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Elastic Deformation — 비정형 왜곡</text>

              {/* 원본 그리드 */}
              <text x={130} y={48} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">원본 그리드</text>
              {[0, 1, 2, 3, 4, 5, 6].map(r =>
                [0, 1, 2, 3, 4, 5, 6].map(c => (
                  <circle key={`${r}-${c}`} cx={50 + c * 25} cy={60 + r * 25}
                    r={1.5} fill={COLORS.original} opacity={0.5} />
                ))
              )}
              {/* 수직선 */}
              {[0, 1, 2, 3, 4, 5, 6].map(c => (
                <line key={`v${c}`} x1={50 + c * 25} y1={60} x2={50 + c * 25} y2={210}
                  stroke={COLORS.original} strokeWidth={0.4} opacity={0.3} />
              ))}
              {/* 수평선 */}
              {[0, 1, 2, 3, 4, 5, 6].map(r => (
                <line key={`h${r}`} x1={50} y1={60 + r * 25} x2={200} y2={60 + r * 25}
                  stroke={COLORS.original} strokeWidth={0.4} opacity={0.3} />
              ))}

              {/* 화살표 */}
              <text x={260} y={140} textAnchor="middle" fontSize={14}
                fill="var(--muted-foreground)">→</text>

              {/* 변형 그리드 — 물결 효과 */}
              <text x={400} y={48} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Elastic 변형</text>
              {[0, 1, 2, 3, 4, 5, 6].map(r =>
                [0, 1, 2, 3, 4, 5, 6].map(c => {
                  const dx = Math.sin(r * 0.8 + c * 0.5) * 6;
                  const dy = Math.cos(c * 0.7 + r * 0.4) * 6;
                  return (
                    <motion.circle key={`e${r}-${c}`}
                      cx={320 + c * 25 + dx} cy={60 + r * 25 + dy}
                      r={1.5} fill={COLORS.elastic}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                      transition={{ ...sp, delay: (r * 7 + c) * 0.01 }} />
                  );
                })
              )}
              {/* 변형 수직선 */}
              {[0, 1, 2, 3, 4, 5, 6].map(c => {
                const pts = [0, 1, 2, 3, 4, 5, 6].map(r => {
                  const dx = Math.sin(r * 0.8 + c * 0.5) * 6;
                  const dy = Math.cos(c * 0.7 + r * 0.4) * 6;
                  return `${320 + c * 25 + dx},${60 + r * 25 + dy}`;
                }).join(' ');
                return (
                  <motion.polyline key={`ev${c}`} points={pts}
                    fill="none" stroke={COLORS.elastic} strokeWidth={0.4} opacity={0.4}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                    transition={{ ...sp, delay: 0.2 }} />
                );
              })}

              {/* 파라미터 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <text x={260} y={238} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  alpha(변형 강도) × sigma(부드러움) — 의료 영상에서 세포·조직 변형 시뮬레이션
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
