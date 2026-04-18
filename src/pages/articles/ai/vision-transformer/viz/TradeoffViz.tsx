import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C, PERF_DATA } from './TradeoffVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function TradeoffViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 데이터량별 성능 교차 차트 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 축 */}
              <line x1={60} y1={180} x2={440} y2={180} stroke="var(--border)" strokeWidth={1} />
              <line x1={60} y1={180} x2={60} y2={20} stroke="var(--border)" strokeWidth={1} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">데이터량</text>
              <text x={25} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                transform="rotate(-90,25,100)">정확도 (%)</text>
              {/* Y축 눈금 */}
              {[40, 60, 80, 100].map(v => (
                <g key={v}>
                  <text x={55} y={180 - (v - 30) * 2.2 + 3} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">{v}</text>
                  <line x1={58} y1={180 - (v - 30) * 2.2} x2={440} y2={180 - (v - 30) * 2.2}
                    stroke="var(--border)" strokeWidth={0.3} strokeDasharray="3 3" />
                </g>
              ))}
              {/* 데이터 포인트 */}
              {PERF_DATA.map((d, i) => {
                const x = 80 + i * 70;
                const yCnn = 180 - (d.cnn - 30) * 2.2;
                const yVit = 180 - (d.vit - 30) * 2.2;
                return (
                  <motion.g key={d.data} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    {/* X축 라벨 */}
                    <text x={x} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.data}</text>
                    {/* CNN 점 */}
                    <circle cx={x} cy={yCnn} r={4} fill={C.cnn} />
                    <text x={x - 8} y={yCnn - 7} textAnchor="middle" fontSize={7} fill={C.cnn}>{d.cnn}</text>
                    {/* ViT 점 */}
                    <circle cx={x} cy={yVit} r={4} fill={C.vit} />
                    <text x={x + 8} y={yVit - 7} textAnchor="middle" fontSize={7} fill={C.vit}>{d.vit}</text>
                    {/* 연결선 (이전 포인트와) */}
                    {i > 0 && (
                      <>
                        <motion.line x1={80 + (i - 1) * 70} y1={180 - (PERF_DATA[i - 1].cnn - 30) * 2.2}
                          x2={x} y2={yCnn} stroke={C.cnn} strokeWidth={1.5}
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.08 }} />
                        <motion.line x1={80 + (i - 1) * 70} y1={180 - (PERF_DATA[i - 1].vit - 30) * 2.2}
                          x2={x} y2={yVit} stroke={C.vit} strokeWidth={1.5}
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.08 }} />
                      </>
                    )}
                  </motion.g>
                );
              })}
              {/* 교차점 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <circle cx={220} cy={180 - (81.5 - 30) * 2.2} r={8} fill="transparent" stroke={C.cross} strokeWidth={1.5} strokeDasharray="3 2" />
                <text x={220} y={180 - (81.5 - 30) * 2.2 - 14} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.cross}>교차점</text>
                <text x={220} y={180 - (81.5 - 30) * 2.2 - 4} textAnchor="middle" fontSize={7} fill={C.cross}>~100K</text>
              </motion.g>
              {/* 범례 */}
              <rect x={350} y={15} width={12} height={12} rx={2} fill={C.cnn} />
              <text x={367} y={25} fontSize={9} fill={C.cnn}>CNN</text>
              <rect x={400} y={15} width={12} height={12} rx={2} fill={C.vit} />
              <text x={417} y={25} fontSize={9} fill={C.vit}>ViT</text>
            </motion.g>
          )}

          {/* Step 1: 귀납 편향의 양면성 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* CNN 편향 */}
              <rect x={20} y={20} width={210} height={180} rx={10} fill={C.cnn + '06'} stroke={C.cnn} strokeWidth={0.6} />
              <text x={125} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cnn}>CNN 귀납 편향</text>
              {/* 지역성 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={55} width={60} height={50} rx={4} fill={C.cnn + '10'} stroke={C.cnn} strokeWidth={0.8} />
                <rect x={42} y={65} width={20} height={20} rx={2} fill={C.cnn + '30'} stroke={C.cnn} strokeWidth={1} />
                <text x={60} y={115} textAnchor="middle" fontSize={8} fill={C.cnn} fontWeight={600}>지역성</text>
              </motion.g>
              {/* 이동 등변성 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={110} y={55} width={110} height={50} rx={4} fill={C.cnn + '10'} stroke={C.cnn} strokeWidth={0.8} />
                <rect x={120} y={65} width={15} height={15} rx={2} fill={C.cnn + '30'} />
                <text x={142} y={76} fontSize={9} fill={C.cnn}>→</text>
                <rect x={155} y={70} width={15} height={15} rx={2} fill={C.cnn + '30'} />
                <text x={165} y={115} textAnchor="middle" fontSize={8} fill={C.cnn} fontWeight={600}>이동 등변성</text>
              </motion.g>
              <text x={125} y={145} textAnchor="middle" fontSize={9} fill={C.ok} fontWeight={600}>적은 데이터 → 빠른 수렴</text>
              <text x={125} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">구조가 사전 지식 역할</text>

              {/* ViT 무편향 */}
              <rect x={250} y={20} width={210} height={180} rx={10} fill={C.vit + '06'} stroke={C.vit} strokeWidth={0.6} />
              <text x={355} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vit}>ViT 무편향</text>
              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {/* 전체 연결 */}
                <rect x={270} y={55} width={170} height={50} rx={4} fill={C.vit + '10'} stroke={C.vit} strokeWidth={0.8} />
                {[0, 1, 2, 3].map(i => (
                  <g key={i}>
                    <circle cx={290 + i * 38} cy={80} r={6} fill={C.vit + '25'} stroke={C.vit} strokeWidth={0.6} />
                    {[0, 1, 2, 3].filter(j => j !== i).map(j => (
                      <line key={j} x1={290 + i * 38} y1={80} x2={290 + j * 38} y2={80}
                        stroke={C.vit} strokeWidth={0.3} opacity={0.4} />
                    ))}
                  </g>
                ))}
                <text x={355} y={115} textAnchor="middle" fontSize={8} fill={C.vit} fontWeight={600}>글로벌 어텐션</text>
              </motion.g>
              <text x={355} y={145} textAnchor="middle" fontSize={9} fill={C.ok} fontWeight={600}>충분한 데이터 → 더 일반적 학습</text>
              <text x={355} y={162} textAnchor="middle" fontSize={8} fill={C.cross}>부족하면 과적합 위험</text>
            </motion.g>
          )}

          {/* Step 2: 해상도와 연산량 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                해상도 증가 시 연산량 비교
              </text>
              {/* 테이블 */}
              {/* 헤더 */}
              {['', 'CNN', 'ViT', 'Swin'].map((h, i) => (
                <rect key={`th-${i}`} x={50 + i * 110} y={35} width={105} height={28} rx={0}
                  fill={i === 0 ? 'transparent' : [C.cnn, C.vit, '#10b981'][i - 1] + '12'}
                  stroke="var(--border)" strokeWidth={0.5} />
              ))}
              {['', 'CNN', 'ViT', 'Swin'].map((h, i) => (
                <text key={`tht-${i}`} x={102 + i * 110} y={53} textAnchor="middle" fontSize={10}
                  fontWeight={700} fill={i === 0 ? 'var(--foreground)' : [C.cnn, C.vit, '#10b981'][i - 1]}>{h}</text>
              ))}
              {/* 행 */}
              {[
                { label: '복잡도', vals: ['O(HW)', 'O(n²)', 'O(n)'] },
                { label: '224→448', vals: ['~4x', '~16x', '~4x'] },
                { label: '메모리', vals: ['중간', '높음', '낮음'] },
                { label: '고해상도', vals: ['자연스럽', '비용 폭발', '효율적'] },
              ].map((row, ri) => (
                <motion.g key={row.label} initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + ri * 0.08 }}>
                  {[row.label, ...row.vals].map((cell, ci) => (
                    <g key={`c-${ri}-${ci}`}>
                      <rect x={50 + ci * 110} y={63 + ri * 32} width={105} height={32} rx={0}
                        fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                      <text x={102 + ci * 110} y={83 + ri * 32} textAnchor="middle" fontSize={9}
                        fill={ci === 0 ? 'var(--foreground)' : [C.cnn, C.vit, '#10b981'][ci - 1]}
                        fontWeight={ci === 0 ? 600 : 400}>
                        {cell}
                      </text>
                    </g>
                  ))}
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 3: 학습 시간과 메모리 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* ViT-Base */}
              <rect x={20} y={20} width={210} height={90} rx={8} fill={C.vit + '06'} stroke={C.vit} strokeWidth={0.6} />
              <text x={125} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vit}>ViT-Base</text>
              <text x={125} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">학습: 2.5일 (8xA100)</text>
              <text x={125} y={73} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">메모리: ~24GB</text>
              {/* 메모리 바 */}
              <rect x={40} y={82} width={170} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={40} y={82} width={170} height={8} rx={4} fill={C.vit}
                initial={{ width: 0 }} animate={{ width: 170 }} transition={{ delay: 0.2, duration: 0.5 }} />
              <text x={215} y={90} fontSize={7} fill={C.vit}>100%</text>

              {/* ResNet-50 */}
              <rect x={250} y={20} width={210} height={90} rx={8} fill={C.cnn + '06'} stroke={C.cnn} strokeWidth={0.6} />
              <text x={355} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cnn}>ResNet-50</text>
              <text x={355} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">학습: 1일 (8xA100)</text>
              <text x={355} y={73} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">메모리: ~8GB</text>
              <rect x={270} y={82} width={170} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={270} y={82} width={57} height={8} rx={4} fill={C.cnn}
                initial={{ width: 0 }} animate={{ width: 57 }} transition={{ delay: 0.2, duration: 0.5 }} />
              <text x={332} y={90} fontSize={7} fill={C.cnn}>33%</text>

              {/* DeiT 전략 */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={80} y={130} width={320} height={70} rx={10} fill="var(--card)" stroke={C.ok} strokeWidth={0.8} />
                <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ok}>DeiT 효율화 전략</text>
                <text x={240} y={168} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  작은 모델 + 지식 증류 → 학습 효율 3배 향상
                </text>
                <text x={240} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  224 해상도 유지 + 강력한 데이터 증강으로 성능 보전
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
