import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  fatf: '#6366f1',
  kr: '#10b981',
  future: '#f59e0b',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: 'Travel Rule 시행 연혁',
    body: '2019 FATF R.16 적용 → 2021 특금법 개정 → 2022 한국 시행(100만 원+) → 2026 확대 추진.',
  },
  {
    label: '스테이블코인과 DeFi 규제 확대',
    body: '불법 거래의 84%가 스테이블코인 경유. DeFi는 "정보 수신 사업자" 부재로 구조적 한계 — 중앙화 요소 기준 적용 시도.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tr-timeline-arrow)" />;
}

export default function TravelRuleTimelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tr-timeline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Travel Rule 시행 타임라인</text>

              <line x1={30} y1={60} x2={450} y2={60} stroke="var(--border)" strokeWidth={1.5} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <circle cx={70} cy={60} r={5} fill={C.fatf} />
                <text x={70} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.fatf}>2019.06</text>
                <text x={70} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">FATF R.16</text>
                <text x={70} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">VA 적용</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <circle cx={160} cy={60} r={5} fill={C.kr} />
                <text x={160} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.kr}>2021.03</text>
                <text x={160} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">특금법 개정</text>
                <text x={160} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">VASP 포함</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <circle cx={250} cy={60} r={5} fill={C.kr} />
                <text x={250} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.kr}>2022.03</text>
                <text x={250} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">한국 시행</text>
                <text x={250} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">100만 원+</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <circle cx={340} cy={60} r={5} fill={C.future} />
                <text x={340} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.future}>2025.12</text>
                <text x={340} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">100만 원 이하</text>
                <text x={340} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">확대 추진</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <circle cx={430} cy={60} r={5} fill={C.warn} />
                <text x={430} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>2026.H1</text>
                <text x={430} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">2단계 법안</text>
                <text x={430} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">제재 강화</text>
              </motion.g>

              <DataBox x={120} y={110} w={240} h={28} label="85/117국 입법 완료·진행 (FATF 6차)" color={C.fatf} />
              <text x={240} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">100만 원 기준은 구조화(structuring)로 우회 가능 → 기준 하향 추진</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">규제 확대 두 축: 스테이블코인 + DeFi</text>

              <AlertBox x={30} y={40} w={190} h={50} label="스테이블코인" sub="불법 거래의 84% 경유" color={C.warn} />
              <Arrow x1={220} y1={65} x2={250} y2={65} color={C.warn} />
              <ActionBox x={253} y={43} w={200} h={45} label="2단계 법안에 동일 규제 포함" sub="시장 3,000억$+ 규모" color={C.future} />

              <rect x={30} y={110} width={423} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={120} w={190} h={50} label="DeFi 프로토콜" sub="정보 수신 사업자 부재" color={C.fatf} />
              <Arrow x1={220} y1={145} x2={250} y2={145} color={C.fatf} />
              <ActionBox x={253} y={123} w={200} h={45} label="중앙화 요소 시 VASP 기준 적용" sub="완전 탈중앙화는 합의 미달" color={C.fatf} />

              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">프라이버시 vs 자금세탁 방지 — 균형이 향후 입법의 핵심 쟁점</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
