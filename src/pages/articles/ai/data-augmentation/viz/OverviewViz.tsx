import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './OverviewData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">오버피팅: 학습 데이터를 외우는 모델</text>

              {/* 학습 곡선 — Train vs Val */}
              <text x={100} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">학습 곡선</text>
              <line x1={30} y1={60} x2={30} y2={200} stroke="#888" strokeWidth={0.5} />
              <line x1={30} y1={200} x2={230} y2={200} stroke="#888" strokeWidth={0.5} />
              <text x={15} y={65} fontSize={7} fill="var(--muted-foreground)">Acc</text>
              <text x={230} y={215} fontSize={7} fill="var(--muted-foreground)">Epoch</text>

              {/* Train 곡선 — 거의 100%까지 */}
              <motion.path d="M40,190 Q80,140 120,90 T220,68"
                fill="none" stroke={COLORS.overfit} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8 }} />
              <text x={225} y={65} fontSize={8} fill={COLORS.overfit}>Train 99%</text>

              {/* Val 곡선 — 정체 후 하락 */}
              <motion.path d="M40,190 Q80,150 120,125 T180,120 Q200,122 220,130"
                fill="none" stroke={COLORS.augment} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8, delay: 0.2 }} />
              <text x={225} y={134} fontSize={8} fill={COLORS.augment}>Val 82%</text>

              {/* 갭 표시 */}
              <motion.line x1={215} y1={72} x2={215} y2={126} stroke={COLORS.overfit}
                strokeWidth={2} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ ...sp, delay: 0.5 }} />
              <motion.text x={210} y={105} textAnchor="end" fontSize={9} fontWeight={600}
                fill={COLORS.overfit}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                갭 17%
              </motion.text>

              {/* 데이터 부족 시각화 */}
              <text x={390} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">학습 데이터</text>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.rect key={i} x={310 + i * 35} y={65} width={28} height={28} rx={4}
                  fill={COLORS.overfit} opacity={0.3}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: i * 0.06 }} />
              ))}
              <text x={390} y={112} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                5장 — 모델이 외울 수 있는 양
              </text>

              <AlertBox x={300} y={130} w={180} h={45} label="적은 데이터 = 오버피팅"
                sub="일반화 불가, 새 데이터에서 실패" color={COLORS.overfit} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">데이터 증강: 변형으로 다양성 확보</text>

              {/* 원본 이미지 */}
              <rect x={20} y={50} width={60} height={60} rx={6} fill={COLORS.augment} opacity={0.3} />
              <text x={50} y={85} textAnchor="middle" fontSize={9} fill={COLORS.augment}>원본</text>

              {/* 화살표 분기 */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.line key={i} x1={85} y1={80} x2={140} y2={45 + i * 40}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#ov-arrow)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: i * 0.08 }} />
              ))}

              {/* 변형 이미지들 */}
              {[
                { y: 30, label: '뒤집기', angle: 0, color: '#3b82f6' },
                { y: 70, label: '회전', angle: 15, color: '#10b981' },
                { y: 110, label: '크롭', angle: 0, color: '#f59e0b' },
                { y: 150, label: '밝기+', angle: 0, color: '#ef4444' },
                { y: 190, label: 'Mixup', angle: 0, color: '#8b5cf6' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
                  <rect x={145} y={item.y} width={50} height={35} rx={4}
                    fill={item.color} opacity={0.25} />
                  <text x={170} y={item.y + 21} textAnchor="middle" fontSize={8}
                    fill={item.color}>{item.label}</text>
                </motion.g>
              ))}

              {/* 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <line x1={210} y1={120} x2={270} y2={120} stroke="#888" strokeWidth={0.8}
                  markerEnd="url(#ov-arrow)" />
                <text x={310} y={85} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.result}>1장 → 6장</text>
                <text x={310} y={100} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">라벨은 동일</text>

                {/* 증강 후 데이터 박스 */}
                {[0, 1, 2].map(r =>
                  [0, 1, 2, 3, 4].map(c => (
                    <motion.rect key={`${r}-${c}`} x={370 + c * 28} y={50 + r * 28} width={24} height={24}
                      rx={3} fill={COLORS.result} opacity={0.2 + (r * 5 + c) * 0.03}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ ...sp, delay: 0.7 + (r * 5 + c) * 0.02 }} />
                  ))
                )}
                <text x={440} y={145} textAnchor="middle" fontSize={8}
                  fill={COLORS.result}>15배 증강</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">증강 전 vs 후 학습 곡선</text>

              {/* 증강 전 */}
              <text x={130} y={45} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.overfit}>증강 없음</text>
              <line x1={30} y1={55} x2={30} y2={190} stroke="#888" strokeWidth={0.5} />
              <line x1={30} y1={190} x2={240} y2={190} stroke="#888" strokeWidth={0.5} />
              <motion.path d="M40,180 Q80,130 120,85 T230,65"
                fill="none" stroke={COLORS.overfit} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={sp} />
              <motion.path d="M40,180 Q80,140 120,120 T200,115 Q215,117 230,125"
                fill="none" stroke={COLORS.overfit} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.15 }} />
              <text x={235} y={62} fontSize={7} fill={COLORS.overfit}>T 99%</text>
              <text x={235} y={128} fontSize={7} fill={COLORS.overfit}>V 82%</text>

              {/* 증강 후 */}
              <text x={400} y={45} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.result}>증강 적용</text>
              <line x1={290} y1={55} x2={290} y2={190} stroke="#888" strokeWidth={0.5} />
              <line x1={290} y1={190} x2={500} y2={190} stroke="#888" strokeWidth={0.5} />
              <motion.path d="M300,180 Q340,130 380,95 T490,78"
                fill="none" stroke={COLORS.result} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.3 }} />
              <motion.path d="M300,180 Q340,140 380,105 T490,88"
                fill="none" stroke={COLORS.result} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.45 }} />
              <text x={495} y={75} fontSize={7} fill={COLORS.result}>T 95%</text>
              <text x={495} y={92} fontSize={7} fill={COLORS.result}>V 91%</text>

              {/* 갭 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <DataBox x={90} y={200} w={100} h={28} label="갭 17%" sub="일반화 실패" color={COLORS.overfit} outlined />
                <DataBox x={350} y={200} w={100} h={28} label="갭 4%" sub="안정적 일반화" color={COLORS.result} outlined />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">도메인별 증강 전략</text>

              {/* 이미지 */}
              <ModuleBox x={20} y={45} w={140} h={55} label="이미지" sub="기하+색상+혼합" color={COLORS.augment} />
              {['Flip/Rotate', 'ColorJitter', 'Mixup/CutMix'].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <DataBox x={25 + i * 48} y={108} w={44} h={24} label={t} color={COLORS.augment} />
                </motion.g>
              ))}

              {/* 테이블 */}
              <ModuleBox x={190} y={45} w={140} h={55} label="테이블" sub="합성+노이즈" color={COLORS.result} />
              {['SMOTE', '노이즈주입', 'Mixup'].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <DataBox x={195 + i * 48} y={108} w={44} h={24} label={t} color={COLORS.result} />
                </motion.g>
              ))}

              {/* 텍스트 */}
              <ModuleBox x={360} y={45} w={140} h={55} label="텍스트" sub="의미 보존 변형" color={COLORS.domain} />
              {['동의어치환', '역번역', '문장셔플'].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
                  <DataBox x={365 + i * 48} y={108} w={44} h={24} label={t} color={COLORS.domain} />
                </motion.g>
              ))}

              {/* 핵심 원칙 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={60} y={155} width={400} height={50} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={175} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">핵심 원칙: 라벨 의미를 보존하는 변형만 허용</text>
                <text x={260} y={193} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">
                  숫자 6을 180° 회전하면 9 — 도메인 지식 없는 무작위 증강은 오히려 해가 된다
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
