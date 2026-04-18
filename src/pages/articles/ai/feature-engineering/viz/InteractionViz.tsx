import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './InteractionVizData';

export default function InteractionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Feature Cross (A × B) */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={22} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">곱셈 교차: 두 피처의 시너지</text>
              <DataBox x={60} y={45} w={90} h={32} label="가로 = 5m" sub="피처 A" color={COLORS.cross} />
              <DataBox x={60} y={100} w={90} h={32} label="세로 = 8m" sub="피처 B" color={COLORS.cross} />
              <ActionBox x={210} y={70} w={80} h={38} label="A × B" sub="곱셈 교차" color={COLORS.cross} />
              <line x1={155} y1={61} x2={210} y2={82} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={155} y1={116} x2={210} y2={96} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={295} y1={89} x2={340} y2={89} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowI)" />
              <DataBox x={345} y={73} w={120} h={32} label="면적 = 40m²" sub="파생 피처" color={COLORS.cross} outlined />
              {/* Visual: rectangle */}
              <motion.rect x={370} y={130} width={70} height={50} rx={2}
                fill={`${COLORS.cross}15`} stroke={COLORS.cross} strokeWidth={1}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.3 }}
                style={{ transformOrigin: '405px 155px' }} />
              <text x={405} y={160} textAnchor="middle" fontSize={9} fill={COLORS.cross}>40m²</text>
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.cross} fontWeight={600}>
                개별 피처로 알 수 없는 결합 효과를 포착
              </text>
            </motion.g>
          )}

          {/* Step 1: Ratio (A / B) */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={22} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">비율: 상대적 크기 비교</text>
              <DataBox x={50} y={50} w={100} h={32} label="부채 = 3억" sub="피처 A" color={COLORS.ratio} />
              <DataBox x={50} y={110} w={100} h={32} label="자산 = 10억" sub="피처 B" color={COLORS.ratio} />
              <ActionBox x={210} y={75} w={80} h={38} label="A / B" sub="비율 계산" color={COLORS.ratio} />
              <line x1={155} y1={66} x2={210} y2={88} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={155} y1={126} x2={210} y2={100} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={295} y1={94} x2={340} y2={94} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowI)" />
              <DataBox x={345} y={78} w={130} h={32} label="부채비율 = 30%" sub="파생 피처 (더 강한 신호)" color={COLORS.ratio} outlined />
              {/* Gauge visualization */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={355} y={135} width={110} height={10} rx={5} fill="var(--border)" opacity={0.3} />
                <motion.rect x={355} y={135} width={0} height={10} rx={5} fill={COLORS.ratio}
                  animate={{ width: 33 }} transition={{ ...sp, duration: 0.8 }} />
                <text x={410} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">0%                    100%</text>
              </motion.g>
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.ratio} fontWeight={600}>
                절대값 3억보다 비율 30%가 더 정보가 풍부
              </text>
            </motion.g>
          )}

          {/* Step 2: Difference (A - B) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={22} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">차이: 변화량 직접 표현</text>
              <DataBox x={50} y={50} w={110} h={32} label="현재가 = 52,000" sub="오늘 종가" color={COLORS.diff} />
              <DataBox x={50} y={110} w={110} h={32} label="전일가 = 50,000" sub="어제 종가" color={COLORS.diff} />
              <ActionBox x={220} y={75} w={80} h={38} label="A - B" sub="차이 계산" color={COLORS.diff} />
              <line x1={165} y1={66} x2={220} y2={88} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={165} y1={126} x2={220} y2={100} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={305} y1={94} x2={345} y2={94} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowI)" />
              <DataBox x={350} y={78} w={120} h={32} label="변동 +2,000" sub="상승 시그널" color={COLORS.diff} outlined />
              {/* Trend arrow */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
                <line x1={400} y1={145} x2={420} y2={125} stroke={COLORS.diff} strokeWidth={2} markerEnd="url(#arrowUp)" />
                <text x={435} y={138} fontSize={10} fill={COLORS.diff} fontWeight={700}>+4%</text>
              </motion.g>
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.diff} fontWeight={600}>
                트렌드 방향과 변화 속도를 명시적으로 전달
              </text>
            </motion.g>
          )}

          {/* Step 3: Domain-driven */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={22} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">도메인 지식 기반 설계</text>
              {[
                { a: '체중(kg)', b: '신장²(m²)', op: '/', result: 'BMI', x: 40, y: 45 },
                { a: '총매출', b: '방문수', op: '/', result: '객단가', x: 40, y: 95 },
                { a: '클릭수', b: '노출수', op: '/', result: 'CTR', x: 40, y: 145 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <DataBox x={item.x} y={item.y} w={85} h={28} label={item.a} color={COLORS.domain} />
                  <text x={145} y={item.y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--muted-foreground)">{item.op}</text>
                  <DataBox x={165} y={item.y} w={85} h={28} label={item.b} color={COLORS.domain} />
                  <line x1={255} y1={item.y + 14} x2={300} y2={item.y + 14} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowI)" />
                  <DataBox x={310} y={item.y} w={90} h={28} label={item.result} color={COLORS.domain} outlined />
                </motion.g>
              ))}
              <AlertBox x={420} y={80} w={90} h={48} label="핵심" sub="도메인 전문가와 협업" color={COLORS.domain} />
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.domain} fontWeight={600}>
                의미 있는 조합은 도메인 지식에서 나온다
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrowI" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
            <marker id="arrowUp" markerWidth={6} markerHeight={6} refX={3} refY={5} orient="auto">
              <path d="M0,6 L3,0 L6,6" fill={COLORS.diff} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
