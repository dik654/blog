import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './SamplingVizData';

/* 프레임 인덱스 시각화 헬퍼 */
function FrameBar({ x, y, w, h, idx, selected, color }: {
  x: number; y: number; w: number; h: number; idx: number; selected: boolean; color: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2}
        fill={selected ? color : `${COLORS.skip}30`}
        stroke={selected ? color : 'none'} strokeWidth={selected ? 1 : 0}
        opacity={selected ? 1 : 0.4} />
      {selected && (
        <text x={x + w / 2} y={y + h + 10} textAnchor="middle" fontSize={7} fill={color} fontWeight={600}>{idx}</text>
      )}
    </g>
  );
}

export default function SamplingViz() {
  const totalFrames = 32;
  const barW = 10;
  const gap = 2;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrSmp" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Uniform Sampling */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.uniform}>
                Uniform Sampling
              </text>
              <text x={240} y={32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                32프레임에서 8개를 균등 간격(stride=4)으로 추출
              </text>

              {/* 전체 프레임 바 */}
              {Array.from({ length: totalFrames }).map((_, i) => {
                const selected = i % 4 === 0;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.02 }}>
                    <FrameBar x={52 + i * (barW + gap)} y={50} w={barW} h={50}
                      idx={i} selected={selected} color={COLORS.uniform} />
                  </motion.g>
                );
              })}

              {/* 선택된 프레임 → 결과 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.6 }}>
                <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">선택된 8프레임</text>
                {[0, 4, 8, 12, 16, 20, 24, 28].map((idx, i) => (
                  <rect key={i} x={100 + i * 38} y={140} width={28} height={28} rx={4}
                    fill={`${COLORS.uniform}20`} stroke={COLORS.uniform} strokeWidth={1.2} />
                ))}
                {[0, 4, 8, 12, 16, 20, 24, 28].map((idx, i) => (
                  <text key={`t${i}`} x={114 + i * 38} y={158} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={COLORS.uniform}>{idx}</text>
                ))}
              </motion.g>

              <DataBox x={160} y={182} w={160} h={28} label="전체 시간 범위 커버" color={COLORS.uniform} />
            </motion.g>
          )}

          {/* Step 1: Temporal Stride */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.stride}>
                Temporal Stride
              </text>
              <text x={240} y={32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                시작점(0)에서 stride=2로 연속 추출 — 지역 시간 연속성 보존
              </text>

              {Array.from({ length: totalFrames }).map((_, i) => {
                const selected = i < 16 && i % 2 === 0;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.02 }}>
                    <FrameBar x={52 + i * (barW + gap)} y={50} w={barW} h={50}
                      idx={i} selected={selected} color={COLORS.stride} />
                  </motion.g>
                );
              })}

              {/* 커버리지 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={52} y={115} width={192} height={4} rx={2} fill={COLORS.stride} opacity={0.6} />
                <text x={148} y={130} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.stride}>커버 구간</text>
                <rect x={244} y={115} width={192} height={4} rx={2} fill={COLORS.skip} opacity={0.3} />
                <text x={340} y={130} textAnchor="middle" fontSize={8} fill={COLORS.skip}>미커버 구간</text>
              </motion.g>

              <AlertBox x={150} y={145} w={180} h={40} label="후반부 누락 위험" sub="긴 영상에서 문제" color={COLORS.selected} />
              <DataBox x={150} y={192} w={180} h={26} label="지역 연속성 우수" color={COLORS.stride} />
            </motion.g>
          )}

          {/* Step 2: Key Frame Selection */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.keyframe}>
                Key Frame Selection
              </text>
              <text x={240} y={32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                프레임 간 변화량이 큰 지점을 선택 (장면 전환, 급격한 움직임)
              </text>

              {/* 변화량 그래프 */}
              {(() => {
                const changes = [2, 3, 1, 8, 2, 1, 9, 3, 1, 2, 7, 1, 3, 2, 6, 1, 2, 3, 1, 8, 2, 1, 2, 1, 7, 3, 1, 2, 1, 3, 6, 2];
                const maxH = 60;
                const threshold = 6;
                return (
                  <>
                    {/* 임계값 선 */}
                    <line x1={52} y1={50 + maxH - threshold * 6} x2={440} y2={50 + maxH - threshold * 6}
                      stroke={COLORS.keyframe} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.5} />
                    <text x={445} y={50 + maxH - threshold * 6 + 3} fontSize={7} fill={COLORS.keyframe}>임계값</text>

                    {changes.map((c, i) => {
                      const h = c * 6;
                      const selected = c >= threshold;
                      return (
                        <motion.rect
                          key={i}
                          x={52 + i * (barW + gap)} y={50 + maxH - h} width={barW} height={h}
                          rx={2} fill={selected ? COLORS.keyframe : `${COLORS.skip}40`}
                          stroke={selected ? COLORS.keyframe : 'none'} strokeWidth={selected ? 1 : 0}
                          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                          style={{ transformOrigin: `${52 + i * (barW + gap) + barW / 2}px ${50 + maxH}px` }}
                          transition={{ ...sp, delay: i * 0.02 }}
                        />
                      );
                    })}
                    <text x={240} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                      막대 높이 = 프레임 간 변화량 (히스토그램 차이 / optical flow 크기)
                    </text>
                  </>
                );
              })()}

              <ActionBox x={100} y={140} w={130} h={32} label="장면 전환 포착" sub="급변 구간 확보" color={COLORS.keyframe} />
              <AlertBox x={260} y={140} w={130} h={32} label="정적 구간 부족" sub="균일 보완 필요" color={COLORS.selected} />

              <rect x={80} y={185} width={320} height={28} rx={8} fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={203} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
                실전: Uniform + Key Frame 혼합 전략이 가장 robust
              </text>
            </motion.g>
          )}

          {/* Step 3: 트레이드오프 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                프레임 수 vs 정확도 vs 메모리
              </text>

              {/* 축 */}
              <line x1={60} y1={45} x2={60} y2={160} stroke="var(--border)" strokeWidth={1} />
              <line x1={60} y1={160} x2={420} y2={160} stroke="var(--border)" strokeWidth={1} />
              <text x={50} y={42} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">성능</text>
              <text x={425} y={168} fontSize={8} fill="var(--muted-foreground)">프레임 수</text>

              {/* 정확도 곡선 — 로그형 포화 */}
              <motion.path
                d="M80,145 C120,100 180,70 250,58 C320,48 380,45 410,44"
                fill="none" stroke={COLORS.uniform} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8 }}
              />
              <text x={415} y={40} fontSize={8} fontWeight={600} fill={COLORS.uniform}>정확도</text>

              {/* 메모리 곡선 — 선형 증가 */}
              <motion.path
                d="M80,150 L200,120 L320,85 L410,52"
                fill="none" stroke={COLORS.selected} strokeWidth={2} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8, delay: 0.2 }}
              />
              <text x={415} y={56} fontSize={8} fontWeight={600} fill={COLORS.selected}>GPU 메모리</text>

              {/* 실전 구간 하이라이트 */}
              <motion.rect x={140} y={40} width={120} height={125} rx={4}
                fill={COLORS.stride} fillOpacity={0.08} stroke={COLORS.stride} strokeWidth={1} strokeDasharray="4 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}
              />
              <text x={200} y={178} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.stride}>Sweet Spot</text>
              <text x={200} y={190} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">8~32 프레임</text>

              {/* 프레임 수 레이블 */}
              {[
                { n: '4', x: 90 },
                { n: '8', x: 150 },
                { n: '16', x: 200 },
                { n: '32', x: 260 },
                { n: '64', x: 340 },
                { n: '128', x: 400 },
              ].map((f, i) => (
                <text key={i} x={f.x} y={172} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{f.n}</text>
              ))}

              {/* 전략 요약 */}
              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                짧은 클립(2~5초) → 전체 프레임 사용 가능 | 긴 영상(수분) → 클립 분할 + 집계
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
