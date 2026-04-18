import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './FaceExtractionData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function FaceExtractionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fe-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">얼굴 검출: 3가지 검출기 비교</text>

              {/* 입력 이미지 */}
              <rect x={20} y={45} width={80} height={100} rx={6} fill="var(--muted)" opacity={0.3}
                stroke="var(--border)" strokeWidth={0.5} />
              <text x={60} y={88} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">입력</text>
              <text x={60} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">이미지</text>
              {/* 바운딩 박스 */}
              <motion.rect x={35} y={55} width={40} height={45} rx={3}
                fill="none" stroke={COLORS.detect} strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }} />

              {/* 검출기 3종 비교 */}
              {[
                { name: 'MTCNN', y: 40, sub: '3단계 캐스케이드', acc: '정확도 높음', spd: '속도 보통', bar: 85, color: '#3b82f6' },
                { name: 'RetinaFace', y: 105, sub: 'FPN 단일패스', acc: '정확도 최고', spd: '속도 느림', bar: 95, color: '#10b981' },
                { name: 'MediaPipe', y: 170, sub: '모바일 최적화', acc: '정확도 보통', spd: '속도 최고', bar: 70, color: '#f59e0b' },
              ].map((det, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.15 }}>
                  {/* 화살표 */}
                  <line x1={105} y1={95} x2={135} y2={det.y + 25}
                    stroke="#888" strokeWidth={0.8} markerEnd="url(#fe-arrow)" />

                  <rect x={140} y={det.y} width={180} height={48} rx={8}
                    fill={`${det.color}08`} stroke={det.color} strokeWidth={1.2} />
                  <text x={230} y={det.y + 16} textAnchor="middle" fontSize={10} fontWeight={700}
                    fill={det.color}>{det.name}</text>
                  <text x={230} y={det.y + 28} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{det.sub}</text>

                  {/* 정확도 바 */}
                  <rect x={148} y={det.y + 34} width={100} height={5} rx={2.5}
                    fill="var(--border)" opacity={0.3} />
                  <motion.rect x={148} y={det.y + 34} width={det.bar} height={5} rx={2.5}
                    fill={det.color}
                    initial={{ width: 0 }} animate={{ width: det.bar }}
                    transition={{ ...sp, delay: 0.4 + i * 0.1 }} />
                  <text x={258} y={det.y + 39} fontSize={7} fill={det.color}>{det.acc}</text>
                </motion.g>
              ))}

              {/* 대회 추천 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={340} y={60} width={160} height={120} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={420} y={82} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="var(--foreground)">대회 추천 조합</text>
                <line x1={355} y1={88} x2={485} y2={88} stroke="var(--border)" strokeWidth={0.5} />
                <text x={360} y={105} fontSize={8} fill={COLORS.detect}>1순위: RetinaFace</text>
                <text x={375} y={118} fontSize={7} fill="var(--muted-foreground)">정확도 우선, GPU 충분할 때</text>
                <text x={360} y={135} fontSize={8} fill={COLORS.crop}>2순위: MTCNN</text>
                <text x={375} y={148} fontSize={7} fill="var(--muted-foreground)">속도-정확도 균형</text>
                <text x={360} y={165} fontSize={8} fill="var(--muted-foreground)">실시간: MediaPipe</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">랜드마크 정렬: Affine Transform</text>

              {/* 정렬 전 얼굴 */}
              <text x={100} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.landmark}>정렬 전</text>
              <rect x={40} y={55} width={120} height={130} rx={8}
                fill="var(--muted)" opacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
              {/* 기울어진 얼굴 윤곽 */}
              <motion.ellipse cx={100} cy={115} rx={35} ry={45}
                fill="none" stroke={COLORS.landmark} strokeWidth={1.2}
                transform="rotate(-15 100 115)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={sp} />
              {/* 5점 랜드마크 */}
              {[
                { cx: 82, cy: 98, label: '왼눈' },
                { cx: 112, cy: 92, label: '오른눈' },
                { cx: 100, cy: 112, label: '코' },
                { cx: 86, cy: 128, label: '왼입' },
                { cx: 110, cy: 124, label: '오른입' },
              ].map((pt, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
                  <circle cx={pt.cx} cy={pt.cy} r={3} fill={COLORS.landmark} />
                  <text x={pt.cx} y={pt.cy - 6} textAnchor="middle" fontSize={6.5}
                    fill={COLORS.landmark}>{pt.label}</text>
                </motion.g>
              ))}

              {/* 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <line x1={170} y1={115} x2={220} y2={115}
                  stroke={COLORS.landmark} strokeWidth={1.5} markerEnd="url(#fe-arrow)" />
                <text x={195} y={106} textAnchor="middle" fontSize={7} fill={COLORS.landmark}>Affine</text>
                <text x={195} y={128} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">회전+스케일</text>
              </motion.g>

              {/* 정렬 후 얼굴 */}
              <text x={310} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.landmark}>정렬 후</text>
              <rect x={250} y={55} width={120} height={130} rx={8}
                fill="var(--muted)" opacity={0.15} stroke={COLORS.landmark} strokeWidth={0.8} />
              <motion.ellipse cx={310} cy={115} rx={35} ry={45}
                fill="none" stroke={COLORS.landmark} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                transition={{ ...sp, delay: 0.6 }} />
              {/* 정렬된 5점 */}
              {[
                { cx: 290, cy: 100, label: '왼눈' },
                { cx: 330, cy: 100, label: '오른눈' },
                { cx: 310, cy: 118, label: '코' },
                { cx: 295, cy: 132, label: '왼입' },
                { cx: 325, cy: 132, label: '오른입' },
              ].map((pt, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: 0.6 + i * 0.06 }}>
                  <circle cx={pt.cx} cy={pt.cy} r={3} fill={COLORS.landmark} />
                  <text x={pt.cx} y={pt.cy - 6} textAnchor="middle" fontSize={6.5}
                    fill={COLORS.landmark}>{pt.label}</text>
                </motion.g>
              ))}

              {/* 수평선 기준 */}
              <motion.line x1={280} y1={100} x2={340} y2={100}
                stroke={COLORS.landmark} strokeWidth={0.8} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.8 }} />

              {/* 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <rect x={390} y={60} width={115} height={80} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={447} y={80} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill="var(--foreground)">왜 정렬이 필수?</text>
                <text x={398} y={96} fontSize={7.5} fill="var(--muted-foreground)">같은 사람도</text>
                <text x={398} y={108} fontSize={7.5} fill="var(--muted-foreground)">각도 다르면</text>
                <text x={398} y={120} fontSize={7.5} fill={COLORS.landmark}>다른 피처 추출</text>
                <text x={398} y={132} fontSize={7.5} fill="var(--muted-foreground)">→ 성능 하락</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">크롭 + 리사이즈 파이프라인</text>

              {/* 원본 이미지 */}
              <rect x={20} y={45} width={90} height={120} rx={6}
                fill="var(--muted)" opacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
              <text x={65} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">원본</text>
              <text x={65} y={112} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">다양한 크기</text>
              {/* 바운딩 박스 */}
              <motion.rect x={35} y={55} width={40} height={50} rx={2}
                fill="none" stroke={COLORS.detect} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />

              {/* 마진 확장 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <line x1={115} y1={95} x2={145} y2={95}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#fe-arrow)" />
                <text x={130} y={88} textAnchor="middle" fontSize={7} fill={COLORS.crop}>x1.3</text>
              </motion.g>

              {/* 마진 확장된 크롭 */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={150} y={45} width={90} height={120} rx={6}
                  fill="var(--muted)" opacity={0.15} stroke={COLORS.crop} strokeWidth={1} />
                <rect x={160} y={52} width={70} height={88} rx={2}
                  fill="none" stroke={COLORS.detect} strokeWidth={0.8} strokeDasharray="3 2" />
                <rect x={153} y={48} width={84} height={102} rx={2}
                  fill="none" stroke={COLORS.crop} strokeWidth={1.2} />
                <text x={195} y={100} textAnchor="middle" fontSize={8} fill={COLORS.crop}>마진 1.3x</text>
                <text x={195} y={112} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">턱+이마+귀 포함</text>
              </motion.g>

              {/* 리사이즈 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <line x1={245} y1={95} x2={275} y2={95}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#fe-arrow)" />
                <text x={260} y={88} textAnchor="middle" fontSize={7} fill={COLORS.crop}>resize</text>
              </motion.g>

              {/* 최종 입력 */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={280} y={55} width={80} height={80} rx={6}
                  fill={COLORS.crop} fillOpacity={0.08} stroke={COLORS.crop} strokeWidth={1.5} />
                <text x={320} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.crop}>224x224</text>
                <text x={320} y={105} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">또는 299x299</text>
              </motion.g>

              {/* 백본 입력 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <line x1={365} y1={95} x2={395} y2={95}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#fe-arrow)" />
                <ModuleBox x={400} y={70} w={100} h={48} label="백본 모델" sub="EfficientNet 등" color={COLORS.detect} />
              </motion.g>

              {/* 비율 유지 팁 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <rect x={135} y={178} width={250} height={32} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  짧은 변 기준 리사이즈 → center crop (비율 왜곡 방지)
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">비디오 프레임 샘플링 전략</text>

              {/* 비디오 프레임 시퀀스 */}
              <text x={260} y={45} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                비디오: 수백~수천 프레임
              </text>
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.rect key={i} x={30 + i * 29} y={54} width={24} height={18} rx={2}
                  fill="var(--border)" opacity={0.3}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                  transition={{ ...sp, delay: i * 0.02 }} />
              ))}

              {/* 3가지 샘플링 전략 */}
              {[
                {
                  y: 85, label: '균등 샘플링', color: COLORS.detect,
                  desc: '등간격 K개 추출', indices: [0, 3, 7, 11, 15],
                },
                {
                  y: 130, label: '품질 기반', color: COLORS.landmark,
                  desc: '블러/가림 없는 프레임', indices: [1, 4, 6, 10, 14],
                },
                {
                  y: 175, label: '키프레임', color: COLORS.sample,
                  desc: '장면 전환 근처', indices: [2, 5, 8, 12, 15],
                },
              ].map((strategy, si) => (
                <motion.g key={si} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + si * 0.15 }}>
                  <ActionBox x={20} y={strategy.y} w={90} h={32} label={strategy.label}
                    sub={strategy.desc} color={strategy.color} />
                  {/* 선택된 프레임 하이라이트 */}
                  {strategy.indices.map((idx, ii) => (
                    <motion.rect key={ii} x={130 + ii * 50} y={strategy.y + 4} width={40} height={24} rx={3}
                      fill={strategy.color} fillOpacity={0.15} stroke={strategy.color} strokeWidth={1}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...sp, delay: 0.4 + si * 0.15 + ii * 0.05 }} />
                  ))}
                  {strategy.indices.map((idx, ii) => (
                    <text key={`t-${ii}`} x={150 + ii * 50} y={strategy.y + 20} textAnchor="middle"
                      fontSize={7} fill={strategy.color}>F{idx + 1}</text>
                  ))}
                </motion.g>
              ))}

              {/* 집계 방식 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <line x1={400} y1={100} x2={440} y2={145}
                  stroke="#888" strokeWidth={0.6} />
                <line x1={400} y1={145} x2={440} y2={145}
                  stroke="#888" strokeWidth={0.6} />
                <line x1={400} y1={190} x2={440} y2={145}
                  stroke="#888" strokeWidth={0.6} />
                <DataBox x={440} y={130} w={70} h={30} label="집계" sub="평균/투표" color={COLORS.sample} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
