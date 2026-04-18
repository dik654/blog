import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './EdaFlowData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.2} markerEnd="url(#arrow)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ ...sp, delay }} />
  );
}

export default function EdaFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
            fill="var(--foreground)">EDA 워크플로우 6단계</text>

          {/* 6개 단계 박스 — 항상 표시 */}
          <ModuleBox x={10} y={38} w={72} h={40} label="구조 파악" sub="shape·dtype" color={COLORS.structure} />
          <ModuleBox x={96} y={38} w={72} h={40} label="타겟 분석" sub="분포·치우침" color={COLORS.target} />
          <ModuleBox x={182} y={38} w={72} h={40} label="피처 분포" sub="히스토그램" color={COLORS.feature} />
          <ModuleBox x={268} y={38} w={72} h={40} label="관계 탐색" sub="상관·산점도" color={COLORS.relation} />
          <ModuleBox x={354} y={38} w={72} h={40} label="품질 진단" sub="결측·이상치" color={COLORS.quality} />
          <ModuleBox x={440} y={38} w={72} h={40} label="가설 수립" sub="피처 아이디어" color={COLORS.hypothesis} />

          {/* 화살표 */}
          <Arrow x1={82} y1={58} x2={96} y2={58} color="#888" />
          <Arrow x1={168} y1={58} x2={182} y2={58} color="#888" delay={0.05} />
          <Arrow x1={254} y1={58} x2={268} y2={58} color="#888" delay={0.1} />
          <Arrow x1={340} y1={58} x2={354} y2={58} color="#888" delay={0.15} />
          <Arrow x1={426} y1={58} x2={440} y2={58} color="#888" delay={0.2} />

          {/* 현재 스텝 하이라이트 */}
          <motion.rect
            x={10 + step * 86} y={36} width={72} height={44} rx={10}
            fill="transparent" stroke={Object.values(COLORS)[step]} strokeWidth={2}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />

          {/* 스텝별 상세 내용 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <ActionBox x={30} y={100} w={130} h={34} label="df.shape" sub="(300000, 90)" color={COLORS.structure} />
              <ActionBox x={180} y={100} w={130} h={34} label="df.dtypes" sub="float64: 52, object: 28, int: 10" color={COLORS.structure} />
              <ActionBox x={330} y={100} w={150} h={34} label="df.memory_usage()" sub="205.6 MB" color={COLORS.structure} />
              <DataBox x={80} y={150} w={140} h={28} label="수치형 52개" sub="연속 변수" color={COLORS.feature} />
              <DataBox x={240} y={150} w={100} h={28} label="범주형 28개" sub="이산 변수" color={COLORS.quality} />
              <DataBox x={360} y={150} w={100} h={28} label="정수형 10개" sub="카운트/ID" color={COLORS.relation} />
              <text x={260} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                전체 규모를 먼저 잡아야 처리 전략(메모리, 샘플링)을 결정할 수 있다
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* 히스토그램 시뮬레이션 — 오른쪽 치우친 분포 */}
              <text x={130} y={108} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.target}>타겟: avg_delay_minutes</text>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                const heights = [15, 45, 70, 55, 35, 20, 12, 8, 5, 3];
                return (
                  <motion.rect key={i} x={40 + i * 20} y={180 - heights[i]} width={16} height={heights[i]}
                    rx={2} fill={COLORS.target} opacity={0.7}
                    initial={{ height: 0, y: 180 }} animate={{ height: heights[i], y: 180 - heights[i] }}
                    transition={{ ...sp, delay: i * 0.04 }} />
                );
              })}
              <text x={130} y={196} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                오른쪽 치우침(skewness=1.8) → 로그 변환 후보
              </text>
              {/* 분류 케이스 */}
              <text x={390} y={108} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.target}>분류 타겟 예시</text>
              <motion.rect x={340} y={125} width={60} height={50} rx={4} fill={COLORS.relation} opacity={0.7}
                initial={{ height: 0, y: 175 }} animate={{ height: 50, y: 125 }} transition={sp} />
              <motion.rect x={410} y={155} width={60} height={20} rx={4} fill={COLORS.quality} opacity={0.7}
                initial={{ height: 0, y: 175 }} animate={{ height: 20, y: 155 }} transition={sp} />
              <text x={370} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정상 85%</text>
              <text x={440} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이상 15%</text>
              <text x={390} y={210} textAnchor="middle" fontSize={9} fill={COLORS.quality}>불균형 → 리샘플링/가중치 필요</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={140} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.feature}>
                수치형 피처 분포 패턴</text>
              {/* 정규 분포 */}
              {[0, 1, 2, 3, 4, 5, 6].map(i => {
                const h = [8, 25, 50, 60, 50, 25, 8];
                return <motion.rect key={`n${i}`} x={20 + i * 16} y={175 - h[i]} width={12} height={h[i]}
                  rx={2} fill={COLORS.feature} opacity={0.6}
                  initial={{ height: 0, y: 175 }} animate={{ height: h[i], y: 175 - h[i] }}
                  transition={{ ...sp, delay: i * 0.04 }} />;
              })}
              <text x={72} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정규</text>
              {/* 균등 분포 */}
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <motion.rect key={`u${i}`} x={160 + i * 16} y={145} width={12} height={30}
                  rx={2} fill={COLORS.relation} opacity={0.6}
                  initial={{ height: 0, y: 175 }} animate={{ height: 30, y: 145 }}
                  transition={{ ...sp, delay: i * 0.04 }} />
              ))}
              <text x={212} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">균등</text>

              <text x={400} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.feature}>
                범주형 피처 분포</text>
              {['A', 'B', 'C', 'D', 'E'].map((c, i) => {
                const w = [90, 60, 40, 25, 15];
                return (
                  <motion.g key={c} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.08 }}>
                    <text x={325} y={125 + i * 18} fontSize={9} fill="var(--foreground)">{c}</text>
                    <motion.rect x={340} y={116 + i * 18} width={w[i]} height={12} rx={3}
                      fill={COLORS.hypothesis} opacity={0.6}
                      initial={{ width: 0 }} animate={{ width: w[i] }} transition={{ ...sp, delay: i * 0.08 }} />
                    <text x={345 + w[i]} y={126 + i * 18} fontSize={7} fill="var(--muted-foreground)">{w[i] * 10}</text>
                  </motion.g>
                );
              })}
              <text x={260} y={225} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                카디널리티 높은 범주형 → 타겟 인코딩 / 빈도 인코딩 후보
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.relation}>
                상관 행렬 (핵심 피처 6개 추출)</text>
              {/* 간이 히트맵 6x6 */}
              {[0, 1, 2, 3, 4, 5].map(r =>
                [0, 1, 2, 3, 4, 5].map(c => {
                  const vals = [
                    [1, .8, .3, -.2, .1, .7],
                    [.8, 1, .2, -.1, .05, .6],
                    [.3, .2, 1, .4, .6, .3],
                    [-.2, -.1, .4, 1, .5, -.3],
                    [.1, .05, .6, .5, 1, .1],
                    [.7, .6, .3, -.3, .1, 1],
                  ];
                  const v = vals[r][c];
                  const red = v > 0 ? Math.round(v * 200) : 0;
                  const blue = v < 0 ? Math.round(-v * 200) : 0;
                  return (
                    <motion.rect key={`${r}-${c}`} x={140 + c * 28} y={115 + r * 22} width={26} height={20} rx={3}
                      fill={`rgb(${red}, ${Math.max(50, 120 - red - blue)}, ${blue})`} opacity={0.7}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ ...sp, delay: (r * 6 + c) * 0.01 }} />
                  );
                })
              )}
              {['주문량', '로봇수', '혼잡도', '배터리', '대기열', '타겟'].map((l, i) => (
                <text key={l} x={135} y={128 + i * 22} textAnchor="end" fontSize={8} fill="var(--foreground)">{l}</text>
              ))}
              <text x={260} y={235} textAnchor="middle" fontSize={9} fill={COLORS.quality}>
                주문량-타겟 0.7, 주문량-로봇수 0.8 → 다중공선성 주의
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.quality}>
                결측률 상위 10개 피처</text>
              {['sensor_7', 'temp_ext', 'humidity', 'battery_3', 'queue_b',
                'robot_4', 'weight', 'speed_2', 'slot_f', 'order_type'].map((f, i) => {
                const pct = [52, 35, 28, 18, 12, 8, 5, 3, 2, 1];
                const w = pct[i] * 2.8;
                const col = pct[i] > 30 ? COLORS.target : pct[i] > 10 ? COLORS.quality : COLORS.relation;
                return (
                  <motion.g key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: i * 0.05 }}>
                    <text x={120} y={122 + i * 12} textAnchor="end" fontSize={8} fill="var(--foreground)">{f}</text>
                    <rect x={125} y={114 + i * 12} width={150} height={9} rx={2} fill="var(--border)" opacity={0.2} />
                    <motion.rect x={125} y={114 + i * 12} width={w} height={9} rx={2} fill={col} opacity={0.7}
                      initial={{ width: 0 }} animate={{ width: w }} transition={{ ...sp, delay: i * 0.05 }} />
                    <text x={130 + w} y={122 + i * 12} fontSize={7} fill="var(--muted-foreground)">{pct[i]}%</text>
                  </motion.g>
                );
              })}
              <text x={400} y={135} fontSize={9} fontWeight={600} fill={COLORS.target}>제거 후보</text>
              <text x={400} y={150} fontSize={8} fill="var(--muted-foreground)">50%+ 결측</text>
              <text x={400} y={175} fontSize={9} fontWeight={600} fill={COLORS.quality}>대체 필요</text>
              <text x={400} y={190} fontSize={8} fill="var(--muted-foreground)">10~50% 결측</text>
              <text x={400} y={215} fontSize={9} fontWeight={600} fill={COLORS.relation}>무시 가능</text>
              <text x={400} y={230} fontSize={8} fill="var(--muted-foreground)">{'<'}10% 결측</text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.hypothesis}>
                EDA 발견 → 피처 아이디어</text>
              {[
                { finding: '주문량↔지연 상관 0.7', idea: '주문량 래그(t-1, t-2) 피처', y: 125 },
                { finding: '15분 간격 주기성 발견', idea: 'sin/cos 시간 인코딩', y: 155 },
                { finding: '로봇수 < 5일 때 지연 급증', idea: '로봇수 구간 이진 피처', y: 185 },
                { finding: '배터리-혼잡도 비선형 관계', idea: '배터리×혼잡도 인터랙션', y: 215 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <DataBox x={30} y={item.y - 12} w={190} h={26} label={item.finding} color={COLORS.relation} />
                  <line x1={225} y1={item.y + 1} x2={270} y2={item.y + 1} stroke={COLORS.hypothesis}
                    strokeWidth={1} markerEnd="url(#arrow)" opacity={0.5} />
                  <ActionBox x={275} y={item.y - 12} w={210} h={26} label={item.idea} color={COLORS.hypothesis} />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
