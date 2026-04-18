import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './ExternalDataData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function ExternalDataViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ed-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">3대 공개 딥페이크 데이터셋</text>

              {[
                {
                  x: 15, color: COLORS.ffpp, name: 'FaceForensics++',
                  stats: ['원본 1,000개', '조작 5,000개', '5가지 기법'],
                  tag: '학술 표준',
                },
                {
                  x: 185, color: COLORS.dfdc, name: 'DFDC',
                  stats: ['10만 클립', '3,426명', '다양한 환경'],
                  tag: '대규모',
                },
                {
                  x: 355, color: COLORS.celebdf, name: 'CelebDF-v2',
                  stats: ['원본 590개', '합성 5,639개', '고품질 합성'],
                  tag: '고품질',
                },
              ].map((ds, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.15 }}>
                  <rect x={ds.x} y={38} width={155} height={130} rx={8}
                    fill={`${ds.color}08`} stroke={ds.color} strokeWidth={1.5} />

                  <text x={ds.x + 77} y={58} textAnchor="middle" fontSize={10} fontWeight={700}
                    fill={ds.color}>{ds.name}</text>
                  <line x1={ds.x + 10} y1={64} x2={ds.x + 145} y2={64}
                    stroke={ds.color} strokeOpacity={0.3} strokeWidth={0.6} />

                  {/* 태그 */}
                  <rect x={ds.x + 42} y={70} width={70} height={18} rx={9}
                    fill={ds.color} fillOpacity={0.15} stroke={ds.color} strokeWidth={0.6} />
                  <text x={ds.x + 77} y={83} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill={ds.color}>{ds.tag}</text>

                  {/* 통계 */}
                  {ds.stats.map((stat, si) => (
                    <text key={si} x={ds.x + 25} y={104 + si * 16} fontSize={8}
                      fill="var(--muted-foreground)">
                      {stat}
                    </text>
                  ))}
                </motion.g>
              ))}

              {/* 하단 메시지 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={80} y={185} width={360} height={30} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={205} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill="var(--foreground)">각 데이터셋의 조작 기법이 다르다 — 전부 합쳐서 학습해야 일반화</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">조작 기법 × 데이터셋 매핑</text>

              {/* 매핑 테이블 */}
              <rect x={20} y={40} width={480} height={170} rx={8}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

              {/* 헤더 */}
              <rect x={20} y={40} width={480} height={24} rx={0}
                fill="var(--muted)" opacity={0.3} />
              <text x={95} y={56} textAnchor="middle" fontSize={8} fontWeight={700}
                fill="var(--foreground)">조작 기법</text>
              <text x={220} y={56} textAnchor="middle" fontSize={8} fontWeight={700}
                fill={COLORS.ffpp}>FF++</text>
              <text x={320} y={56} textAnchor="middle" fontSize={8} fontWeight={700}
                fill={COLORS.dfdc}>DFDC</text>
              <text x={420} y={56} textAnchor="middle" fontSize={8} fontWeight={700}
                fill={COLORS.celebdf}>CelebDF</text>

              {/* 행 */}
              {[
                { name: 'Face2Face', ff: true, dfdc: false, celeb: false },
                { name: 'FaceSwap', ff: true, dfdc: true, celeb: false },
                { name: 'DeepFakes', ff: true, dfdc: true, celeb: true },
                { name: 'NeuralTextures', ff: true, dfdc: false, celeb: false },
                { name: 'FaceShifter', ff: false, dfdc: true, celeb: false },
              ].map((row, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.08 }}>
                  <text x={95} y={82 + i * 24} textAnchor="middle" fontSize={8}
                    fill="var(--foreground)">{row.name}</text>
                  {[
                    { x: 220, v: row.ff, c: COLORS.ffpp },
                    { x: 320, v: row.dfdc, c: COLORS.dfdc },
                    { x: 420, v: row.celeb, c: COLORS.celebdf },
                  ].map((cell, ci) => (
                    <g key={ci}>
                      {cell.v ? (
                        <text x={cell.x} y={82 + i * 24} textAnchor="middle" fontSize={10}
                          fontWeight={700} fill={cell.c}>&#10003;</text>
                      ) : (
                        <text x={cell.x} y={82 + i * 24} textAnchor="middle" fontSize={9}
                          fill="var(--muted-foreground)">-</text>
                      )}
                    </g>
                  ))}
                  {i < 4 && <line x1={30} y1={88 + i * 24} x2={490} y2={88 + i * 24}
                    stroke="var(--border)" strokeWidth={0.3} />}
                </motion.g>
              ))}

              {/* 빈 셀 = 자체 합성 필요 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <AlertBox x={140} y={205} w={240} h={28}
                  label="빈 셀 = 자체 합성으로 채워야 할 영역"
                  color={COLORS.label} />
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">합성 데이터 생성 파이프라인</text>

              {/* 원본 영상 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <ModuleBox x={20} y={50} w={90} h={45} label="원본 영상"
                  sub="실제 얼굴 데이터" color={COLORS.ffpp} />
              </motion.g>

              {/* 합성 도구들 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <line x1={115} y1={72} x2={145} y2={72}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#ed-arrow)" />
              </motion.g>

              {[
                { y: 40, label: 'SimSwap', color: '#3b82f6' },
                { y: 78, label: 'DeepFaceLab', color: '#10b981' },
                { y: 116, label: 'FaceSwap', color: '#f59e0b' },
              ].map((tool, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.12 }}>
                  <ActionBox x={150} y={tool.y} w={95} h={30} label={tool.label}
                    sub="자동 합성" color={tool.color} />
                </motion.g>
              ))}

              {/* 합성 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                {[0, 1, 2].map(i => (
                  <line key={i} x1={250} y1={[55, 93, 131][i]}
                    x2={290} y2={90}
                    stroke="#888" strokeWidth={0.6} markerEnd="url(#ed-arrow)" />
                ))}

                <rect x={295} y={60} width={100} height={60} rx={8}
                  fill={COLORS.synth} fillOpacity={0.06} stroke={COLORS.synth} strokeWidth={1.2} />
                <text x={345} y={82} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={COLORS.synth}>합성 데이터</text>
                <text x={345} y={96} textAnchor="middle" fontSize={7.5}
                  fill="var(--muted-foreground)">기법/강도/해상도</text>
                <text x={345} y={108} textAnchor="middle" fontSize={7.5}
                  fill="var(--muted-foreground)">직접 제어 가능</text>
              </motion.g>

              {/* 결합 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.75 }}>
                <line x1={400} y1={90} x2={430} y2={90}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#ed-arrow)" />
                <ModuleBox x={435} y={65} w={70} h={48} label="학습"
                  sub="train set" color={COLORS.synth} />
              </motion.g>

              {/* 주의사항 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.85 }}>
                <rect x={60} y={165} width={400} height={60} rx={8}
                  fill="var(--card)" stroke={COLORS.label} strokeWidth={1} strokeDasharray="4 3" />
                <text x={260} y={185} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.label}>주의: 합성 품질이 테스트와 유사해야</text>
                <text x={260} y={200} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">쉬운 합성(저품질)으로 학습하면 → 고품질 딥페이크 탐지 실패</text>
                <text x={260} y={215} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">합성 난이도를 테스트 수준에 맞추는 것이 핵심</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">라벨 품질 관리 파이프라인</text>

              {/* 원본 데이터 + 노이즈 라벨 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={45} width={130} height={55} rx={8}
                  fill={COLORS.label} fillOpacity={0.06} stroke={COLORS.label} strokeWidth={1} />
                <text x={85} y={64} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.label}>학습 데이터</text>
                <text x={85} y={78} textAnchor="middle" fontSize={7.5}
                  fill="var(--muted-foreground)">라벨 오류 1~5%</text>
                <text x={85} y={90} textAnchor="middle" fontSize={7.5}
                  fill={COLORS.label}>무시할 수 없는 수준</text>
              </motion.g>

              {/* 검증 단계 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <line x1={155} y1={72} x2={185} y2={72}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#ed-arrow)" />
              </motion.g>

              {/* Confident Learning */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={190} y={40} width={140} height={65} rx={8}
                  fill={COLORS.dfdc} fillOpacity={0.06} stroke={COLORS.dfdc} strokeWidth={1.2} />
                <text x={260} y={60} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={COLORS.dfdc}>Confident Learning</text>
                <text x={260} y={75} textAnchor="middle" fontSize={7.5}
                  fill="var(--muted-foreground)">cleanlab 라이브러리</text>
                <text x={260} y={88} textAnchor="middle" fontSize={7.5}
                  fill="var(--muted-foreground)">예측-라벨 불일치 자동 탐지</text>
              </motion.g>

              {/* 수동 검수 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.55 }}>
                <line x1={335} y1={72} x2={365} y2={72}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#ed-arrow)" />
                <ActionBox x={370} y={50} w={90} h={38} label="수동 검수"
                  sub="불일치 샘플 검토" color={COLORS.synth} />
              </motion.g>

              {/* 결과: 깨끗한 데이터 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <line x1={415} y1={92} x2={415} y2={115}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#ed-arrow)" />
                <DataBox x={370} y={118} w={90} h={28} label="정제 데이터"
                  sub="오류 라벨 제거" color={COLORS.dfdc} />
              </motion.g>

              {/* 추가 전략 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.8 }}>
                <rect x={40} y={160} width={440} height={70} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={180} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="var(--foreground)">라벨 노이즈 대응 전략</text>
                <line x1={55} y1={186} x2={465} y2={186} stroke="var(--border)" strokeWidth={0.3} />

                {[
                  { x: 60, label: 'Label Smoothing', desc: 'soft label (0.05~0.1)', color: COLORS.ffpp },
                  { x: 210, label: '노이즈 제거', desc: 'cleanlab 탐지 후 제거', color: COLORS.dfdc },
                  { x: 360, label: 'MixUp 학습', desc: '라벨 보간으로 강건성↑', color: COLORS.celebdf },
                ].map((strategy, i) => (
                  <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.9 + i * 0.1 }}>
                    <circle cx={strategy.x + 10} cy={200} r={6} fill={strategy.color} opacity={0.2}
                      stroke={strategy.color} strokeWidth={0.8} />
                    <text x={strategy.x + 10} y={203} textAnchor="middle" fontSize={7}
                      fontWeight={700} fill={strategy.color}>{i + 1}</text>
                    <text x={strategy.x + 25} y={197} fontSize={8} fontWeight={600}
                      fill={strategy.color}>{strategy.label}</text>
                    <text x={strategy.x + 25} y={211} fontSize={7}
                      fill="var(--muted-foreground)">{strategy.desc}</text>
                  </motion.g>
                ))}
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
