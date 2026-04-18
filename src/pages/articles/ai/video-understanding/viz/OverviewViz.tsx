import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './OverviewVizData';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrOvw" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 이미지 vs 비디오 차원 비교 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 이미지: 2D 사각형 */}
              <text x={110} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.image}>Image</text>
              <rect x={40} y={30} width={140} height={100} rx={6} fill={`${COLORS.image}10`} stroke={COLORS.image} strokeWidth={1.5} />
              <text x={110} y={75} textAnchor="middle" fontSize={10} fill={COLORS.image} fontWeight={600}>H x W x C</text>
              <text x={110} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">224 x 224 x 3</text>
              <text x={110} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">= 150K 값</text>

              {/* 화살표 */}
              <text x={230} y={85} textAnchor="middle" fontSize={18} fill={COLORS.time}>+T</text>
              <line x1={200} y1={80} x2={260} y2={80} stroke={COLORS.time} strokeWidth={1.5} markerEnd="url(#arrOvw)" />

              {/* 비디오: 3D 스택 */}
              <text x={370} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.video}>Video</text>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.rect
                  key={i}
                  x={290 + i * 8} y={30 + i * 8} width={120} height={80} rx={4}
                  fill={`${COLORS.video}08`} stroke={COLORS.video} strokeWidth={0.8}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}
                />
              ))}
              <text x={370} y={90} textAnchor="middle" fontSize={10} fill={COLORS.video} fontWeight={600}>T x H x W x C</text>
              <text x={370} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">16 x 224 x 224 x 3</text>
              <text x={370} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">= 2.4M 값 (16x)</text>

              {/* 하단 요약 */}
              <rect x={80} y={160} width={320} height={40} rx={8} fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.time}>
                시간 축 T 추가 = 데이터 볼륨 x16~x64 증가
              </text>
              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                메모리, 연산량, 샘플링 전략 모두 달라짐
              </text>
            </motion.g>
          )}

          {/* Step 1: 시공간 피처 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 프레임 그리드 */}
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">시공간 피처 추출</text>

              {/* 3개 프레임 */}
              {[0, 1, 2].map((i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={30 + i * 150} y={35} width={120} height={80} rx={6}
                    fill={`${COLORS.spatial}08`} stroke={COLORS.spatial} strokeWidth={1} />
                  <text x={90 + i * 150} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.spatial}>
                    Frame {i}
                  </text>
                  {/* 공간 피처: 작은 박스들 */}
                  <rect x={42 + i * 150} y={60} width={24} height={24} rx={3} fill={`${COLORS.spatial}20`} stroke={COLORS.spatial} strokeWidth={0.5} />
                  <rect x={72 + i * 150} y={60} width={24} height={24} rx={3} fill={`${COLORS.spatial}20`} stroke={COLORS.spatial} strokeWidth={0.5} />
                  <rect x={102 + i * 150} y={60} width={24} height={24} rx={3} fill={`${COLORS.spatial}20`} stroke={COLORS.spatial} strokeWidth={0.5} />
                  <text x={90 + i * 150} y={104} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">공간(위치/형태)</text>
                </motion.g>
              ))}

              {/* 시간 축 화살표 */}
              <motion.line x1={155} y1={75} x2={175} y2={75} stroke={COLORS.time} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.3 }}
                markerEnd="url(#arrOvw)" />
              <motion.line x1={305} y1={75} x2={325} y2={75} stroke={COLORS.time} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.4 }}
                markerEnd="url(#arrOvw)" />

              {/* 하단: 결합 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <DataBox x={60} y={130} w={120} h={32} label="Spatial Feature" sub="물체, 장면" color={COLORS.spatial} />
                <text x={220} y={150} textAnchor="middle" fontSize={14} fontWeight={700} fill={COLORS.flow}>+</text>
                <DataBox x={260} y={130} w={120} h={32} label="Temporal Feature" sub="동작, 변화" color={COLORS.time} />
                <line x1={240} y1={172} x2={240} y2={190} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOvw)" />
                <ActionBox x={175} y={194} w={130} h={28} label="Spatiotemporal" sub="시공간 통합" color={COLORS.video} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: 핵심 과제 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">비디오 이해 핵심 과제</text>

              {[
                { name: 'Action Recognition', desc: '"달리기" / "점프"', sub: '전체 → 하나의 레이블', color: COLORS.image, y: 35 },
                { name: 'Temporal Localization', desc: '"3초~7초에 골"', sub: '시간 구간 탐지', color: COLORS.time, y: 95 },
                { name: 'Video Captioning', desc: '"사람이 공을 찬다"', sub: '영상 → 자연어', color: COLORS.video, y: 155 },
              ].map((task, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={30} y={task.y} width={420} height={50} rx={8}
                    fill={`${task.color}08`} stroke={task.color} strokeWidth={1.2} />
                  <circle cx={60} cy={task.y + 25} r={12} fill={task.color} fillOpacity={0.2} stroke={task.color} strokeWidth={1} />
                  <text x={60} y={task.y + 29} textAnchor="middle" fontSize={10} fontWeight={700} fill={task.color}>{i + 1}</text>
                  <text x={90} y={task.y + 20} fontSize={11} fontWeight={700} fill={task.color}>{task.name}</text>
                  <text x={90} y={task.y + 36} fontSize={9} fill="var(--muted-foreground)">{task.sub}</text>
                  <rect x={310} y={task.y + 10} width={130} height={28} rx={14} fill={`${task.color}12`} stroke={task.color} strokeWidth={0.6} />
                  <text x={375} y={task.y + 28} textAnchor="middle" fontSize={9} fontWeight={600} fill={task.color}>{task.desc}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 3: 실전 응용 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">실전 응용 사례</text>

              {[
                { name: '구조물 안정성', detail: '10초 시뮬레이션 영상', how: '균열 진행 / 변위 추적', color: COLORS.time },
                { name: '딥페이크 탐지', detail: '동영상 프레임 분석', how: '깜빡임 / 입 비동기', color: COLORS.video },
                { name: '의료 영상', detail: '초음파 / 내시경', how: '병변 진행 추적', color: COLORS.spatial },
              ].map((app, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <ModuleBox x={20 + i * 155} y={35} w={140} h={52} label={app.name} sub={app.detail} color={app.color} />
                  <rect x={35 + i * 155} y={100} width={110} height={26} rx={13}
                    fill={`${app.color}10`} stroke={app.color} strokeWidth={0.6} />
                  <text x={90 + i * 155} y={117} textAnchor="middle" fontSize={8} fontWeight={600} fill={app.color}>{app.how}</text>
                </motion.g>
              ))}

              {/* 공통점 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
                <line x1={90} y1={135} x2={240} y2={165} stroke={COLORS.flow} strokeWidth={0.8} strokeDasharray="3 2" />
                <line x1={245} y1={135} x2={240} y2={165} stroke={COLORS.flow} strokeWidth={0.8} strokeDasharray="3 2" />
                <line x1={400} y1={135} x2={240} y2={165} stroke={COLORS.flow} strokeWidth={0.8} strokeDasharray="3 2" />
                <ActionBox x={170} y={170} w={140} h={34} label="시간 축 패턴 분석" sub="공통 핵심 능력" color={COLORS.app} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
