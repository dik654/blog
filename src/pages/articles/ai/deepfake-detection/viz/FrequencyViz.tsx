import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './FrequencyData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function FrequencyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fq-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">FFT: 공간 → 주파수 도메인 변환</text>

              {/* 공간 도메인 이미지 */}
              <rect x={30} y={45} width={80} height={80} rx={6}
                fill="var(--muted)" opacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
              <text x={70} y={82} textAnchor="middle" fontSize={9} fill="var(--foreground)">이미지</text>
              <text x={70} y={95} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">공간 도메인</text>

              {/* FFT 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <line x1={115} y1={85} x2={155} y2={85}
                  stroke={COLORS.freq} strokeWidth={1.5} markerEnd="url(#fq-arrow)" />
                <text x={135} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.freq}>FFT</text>
              </motion.g>

              {/* 주파수 스펙트럼 */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={160} y={45} width={80} height={80} rx={6}
                  fill="#0a0a0a" stroke={COLORS.freq} strokeWidth={1} />
                {/* 동심원 패턴 (주파수 스펙트럼 시각화) */}
                {[30, 22, 15, 8].map((r, i) => (
                  <circle key={i} cx={200} cy={85} r={r}
                    fill="none" stroke={COLORS.freq} strokeWidth={0.6}
                    opacity={0.8 - i * 0.15} />
                ))}
                <circle cx={200} cy={85} r={3} fill={COLORS.freq} />
                <text x={200} y={138} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">주파수 스펙트럼</text>
              </motion.g>

              {/* 주파수 대역 설명 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={270} y={40} width={220} height={130} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

                {/* 저주파 */}
                <circle cx={290} cy={65} r={8} fill={COLORS.real} opacity={0.3} />
                <text x={290} y={69} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.real}>저</text>
                <text x={315} y={62} fontSize={8} fontWeight={600} fill={COLORS.real}>저주파</text>
                <text x={315} y={74} fontSize={7} fill="var(--muted-foreground)">배경, 피부, 부드러운 영역</text>

                {/* 중주파 */}
                <circle cx={290} cy={100} r={8} fill={COLORS.freq} opacity={0.3} />
                <text x={290} y={104} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.freq}>중</text>
                <text x={315} y={97} fontSize={8} fontWeight={600} fill={COLORS.freq}>중주파</text>
                <text x={315} y={109} fontSize={7} fill="var(--muted-foreground)">눈, 코, 입의 경계</text>

                {/* 고주파 */}
                <circle cx={290} cy={135} r={8} fill={COLORS.fake} opacity={0.3} />
                <text x={290} y={139} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.fake}>고</text>
                <text x={315} y={132} fontSize={8} fontWeight={600} fill={COLORS.fake}>고주파</text>
                <text x={315} y={144} fontSize={7} fill="var(--muted-foreground)">질감, 디테일, 아티팩트</text>
                <text x={315} y={156} fontSize={7} fontWeight={600} fill={COLORS.fake}>← 딥페이크 흔적이 남는 영역</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">실제 vs 딥페이크 주파수 스펙트럼</text>

              {/* 실제 이미지 스펙트럼 */}
              <text x={130} y={45} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.real}>실제 이미지</text>

              {/* 주파수-에너지 그래프 */}
              <line x1={30} y1={60} x2={30} y2={180} stroke="#888" strokeWidth={0.5} />
              <line x1={30} y1={180} x2={230} y2={180} stroke="#888" strokeWidth={0.5} />
              <text x={15} y={65} fontSize={7} fill="var(--muted-foreground)">E</text>
              <text x={230} y={195} fontSize={7} fill="var(--muted-foreground)">freq</text>

              {/* 1/f 자연 감쇠 곡선 */}
              <motion.path d="M40,70 Q80,90 120,130 T220,170"
                fill="none" stroke={COLORS.real} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8 }} />
              <text x={160} y={148} fontSize={7} fill={COLORS.real}>1/f 자연 감쇠</text>
              <text x={160} y={160} fontSize={7} fill="var(--muted-foreground)">자연 이미지의 보편 법칙</text>

              {/* 딥페이크 스펙트럼 */}
              <text x={390} y={45} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.fake}>딥페이크</text>

              <line x1={290} y1={60} x2={290} y2={180} stroke="#888" strokeWidth={0.5} />
              <line x1={290} y1={180} x2={490} y2={180} stroke="#888" strokeWidth={0.5} />
              <text x={275} y={65} fontSize={7} fill="var(--muted-foreground)">E</text>
              <text x={490} y={195} fontSize={7} fill="var(--muted-foreground)">freq</text>

              {/* 비정상 스펙트럼 */}
              <motion.path d="M300,72 Q340,92 380,130 Q400,105 410,115 Q430,140 450,155 T480,170"
                fill="none" stroke={COLORS.fake} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8, delay: 0.3 }} />

              {/* 피크 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <line x1={400} y1={105} x2={400} y2={90}
                  stroke={COLORS.fake} strokeWidth={0.8} strokeDasharray="2 2" />
                <text x={400} y={86} textAnchor="middle" fontSize={7} fontWeight={600}
                  fill={COLORS.fake}>피크!</text>
                <text x={420} y={148} fontSize={7} fill={COLORS.fake}>GAN 업샘플링</text>
                <text x={420} y={160} fontSize={7} fill="var(--muted-foreground)">체커보드 아티팩트</text>
              </motion.g>

              {/* 차이 강조 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <rect x={120} y={205} width={280} height={30} rx={6}
                  fill={COLORS.freq} fillOpacity={0.08} stroke={COLORS.freq} strokeWidth={1} />
                <text x={260} y={224} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.freq}>고주파 대역의 에너지 분포 차이 → 탐지의 핵심 단서</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">RGB + FFT 결합 입력</text>

              {/* RGB 브랜치 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <DataBox x={30} y={50} w={70} h={30} label="RGB" sub="3채널" color={COLORS.real} />
              </motion.g>

              {/* FFT 브랜치 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <DataBox x={30} y={100} w={70} h={30} label="FFT mag" sub="주파수 피처" color={COLORS.freq} />
              </motion.g>

              {/* 3가지 결합 방법 */}
              {[
                { y: 40, label: '채널 결합', desc: 'RGB(3) + FFT(3) = 6ch', color: '#3b82f6' },
                { y: 95, label: '듀얼 브랜치', desc: '각각 인코더 → 피처 결합', color: '#10b981' },
                { y: 150, label: '어텐션 퓨전', desc: '주파수로 공간 피처 가중', color: '#8b5cf6' },
              ].map((method, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.15 }}>
                  {/* 화살표 */}
                  <line x1={105} y1={75} x2={145} y2={method.y + 22}
                    stroke="#888" strokeWidth={0.6} markerEnd="url(#fq-arrow)" />
                  <line x1={105} y1={115} x2={145} y2={method.y + 22}
                    stroke="#888" strokeWidth={0.6} markerEnd="url(#fq-arrow)" />

                  <rect x={150} y={method.y} width={160} height={42} rx={7}
                    fill={`${method.color}08`} stroke={method.color} strokeWidth={1.2} />
                  <text x={230} y={method.y + 17} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={method.color}>{method.label}</text>
                  <text x={230} y={method.y + 32} textAnchor="middle" fontSize={7.5}
                    fill="var(--muted-foreground)">{method.desc}</text>
                </motion.g>
              ))}

              {/* 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                {[0, 1, 2].map(i => (
                  <line key={i} x1={315} y1={[61, 116, 171][i]}
                    x2={370} y2={120}
                    stroke="#888" strokeWidth={0.6} markerEnd="url(#fq-arrow)" />
                ))}
                <ModuleBox x={375} y={96} w={120} h={48} label="탐지 모델"
                  sub="XceptionNet 등" color={COLORS.combine} />
              </motion.g>

              {/* 성능 향상 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.85 }}>
                <rect x={150} y={205} width={220} height={28} rx={6}
                  fill={COLORS.combine} fillOpacity={0.1} stroke={COLORS.combine} strokeWidth={1} />
                <text x={260} y={224} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.combine}>주파수 추가 → AUC +2~5% 향상</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">주파수 분석의 한계와 보완</text>

              {/* 한계들 */}
              <text x={140} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.fake}>한계</text>

              {[
                { y: 58, label: 'JPEG 압축', desc: '고주파 정보 파괴 → 아티팩트 소실' },
                { y: 90, label: '최신 생성 모델', desc: '주파수 일관성도 학습 → 차이 축소' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.15 }}>
                  <AlertBox x={30} y={item.y} w={220} h={26} label={item.label}
                    sub={item.desc} color={COLORS.fake} />
                </motion.g>
              ))}

              {/* 보완책 */}
              <text x={140} y={138} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.real}>보완</text>

              {[
                { y: 148, label: '다중 스케일', desc: 'DCT, Wavelet — 다양한 주파수 대역', color: COLORS.freq },
                { y: 180, label: '앙상블', desc: 'RGB 모델 + 주파수 모델 결합', color: COLORS.combine },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.15 }}>
                  <rect x={30} y={item.y} width={220} height={26} rx={6}
                    fill={`${item.color}08`} stroke={item.color} strokeWidth={1} />
                  <text x={56} y={item.y + 16} fontSize={9} fontWeight={600} fill={item.color}>{item.label}</text>
                  <text x={140} y={item.y + 16} fontSize={7.5} fill="var(--muted-foreground)">{item.desc}</text>
                </motion.g>
              ))}

              {/* 전체 파이프라인 요약 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={280} y={55} width={210} height={160} rx={10}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={385} y={78} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="var(--foreground)">권장 구성</text>
                <line x1={295} y1={84} x2={475} y2={84} stroke="var(--border)" strokeWidth={0.5} />

                {[
                  { y: 98, icon: '1', text: 'RGB 이미지 → 백본 모델', color: COLORS.real },
                  { y: 118, icon: '2', text: 'FFT magnitude → 보조 입력', color: COLORS.freq },
                  { y: 138, icon: '3', text: '듀얼 브랜치 → 피처 결합', color: COLORS.combine },
                  { y: 158, icon: '4', text: 'JPEG augmentation 학습', color: COLORS.limit },
                  { y: 178, icon: '5', text: 'RGB + Freq 앙상블', color: COLORS.real },
                ].map((item, i) => (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.7 + i * 0.08 }}>
                    <circle cx={305} cy={item.y} r={8} fill={item.color} opacity={0.2}
                      stroke={item.color} strokeWidth={0.8} />
                    <text x={305} y={item.y + 4} textAnchor="middle" fontSize={8} fontWeight={700}
                      fill={item.color}>{item.icon}</text>
                    <text x={322} y={item.y + 4} fontSize={8} fill="var(--foreground)">{item.text}</text>
                  </motion.g>
                ))}

                <text x={385} y={205} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  주파수는 강력한 보조 피처 — 단독으로는 불충분
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
