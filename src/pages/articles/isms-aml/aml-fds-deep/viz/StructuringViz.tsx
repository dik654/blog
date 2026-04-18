import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  normal: '#10b981',
  split: '#f59e0b',
  detect: '#ef4444',
};

const STEPS = [
  {
    label: '구조화(Structuring) 수법',
    body: '보고 기준(1천만 원) 바로 아래로 분할 입금. 개별 거래는 기준 이하지만 FDS가 누적 패턴으로 탐지.',
  },
  {
    label: '빠른 이동(Rapid Movement)',
    body: '입금 후 수분 내 전액 외부 출금. 거래소를 단순 경유지로 활용 — 정상 투자자와 보유 시간이 극단적으로 다름.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#struct-viz-arrow)" />;
}

export default function StructuringViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="struct-viz-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">구조화(Structuring) 탐지</text>

              {/* 기준선 */}
              <line x1={30} y1={55} x2={450} y2={55} stroke={C.detect} strokeWidth={0.8} strokeDasharray="6 3" />
              <text x={460} y={59} fontSize={7} fill={C.detect}>1천만 원</text>

              {/* 정상 거래 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <rect x={40} y={30} width={30} height={25} rx={3} fill={C.normal} opacity={0.3} />
                <text x={55} y={47} textAnchor="middle" fontSize={7} fill={C.normal}>1.5천만</text>
              </motion.g>

              {/* 분할 거래 (기준 바로 아래) */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <rect x={100} y={57} width={25} height={20} rx={3} fill={C.split} opacity={0.4} />
                <text x={112} y={72} textAnchor="middle" fontSize={7} fill={C.split}>980만</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <rect x={140} y={57} width={25} height={20} rx={3} fill={C.split} opacity={0.4} />
                <text x={152} y={72} textAnchor="middle" fontSize={7} fill={C.split}>970만</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <rect x={180} y={57} width={25} height={20} rx={3} fill={C.split} opacity={0.4} />
                <text x={192} y={72} textAnchor="middle" fontSize={7} fill={C.split}>990만</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <rect x={220} y={57} width={25} height={20} rx={3} fill={C.split} opacity={0.4} />
                <text x={232} y={72} textAnchor="middle" fontSize={7} fill={C.split}>960만</text>
              </motion.g>

              <text x={170} y={95} textAnchor="middle" fontSize={8} fill={C.split}>기준 80~99% 범위에서 반복</text>

              {/* FDS 누적 탐지 */}
              <Arrow x1={250} y1={67} x2={290} y2={67} color={C.detect} />
              <AlertBox x={293} y={50} w={160} h={40} label="FDS 누적 패턴 탐지" sub="24시간 내 3회 이상 → 경보" color={C.detect} />

              <DataBox x={120} y={120} w={240} h={30} label="개별은 기준 이하, 누적은 기준 초과" color={C.detect} />
              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">스머핑(Smurfing): 여러 사람이 소액씩 나눠 입금하는 변형도 탐지</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">빠른 이동(Rapid Movement) 패턴</text>

              <ActionBox x={20} y={40} w={100} h={40} label="원화 입금" sub="은행 계좌" color={C.normal} />
              <Arrow x1={120} y1={60} x2={145} y2={60} color={C.normal} />

              <ActionBox x={148} y={40} w={80} h={40} label="가상자산 매수" sub="즉시 매수" color={C.split} />
              <Arrow x1={228} y1={60} x2={253} y2={60} color={C.split} />

              <AlertBox x={256} y={38} w={100} h={44} label="전액 출금" sub="수분 이내" color={C.detect} />
              <Arrow x1={356} y1={60} x2={381} y2={60} color={C.detect} />

              <ActionBox x={384} y={40} w={80} h={40} label="외부 지갑" sub="추적 이탈" color={C.detect} />

              {/* 시간 바 */}
              <rect x={20} y={100} width={444} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={50} y={110} w={160} h={28} label="보유 시간: 수분 이내" color={C.detect} />
              <DataBox x={270} y={110} w={160} h={28} label="정상 투자: 수일~수개월" color={C.normal} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FDS 조건: 입금 후 30분 이내 전액(90%+) 외부 출금 시 경보</text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거래소를 "경유지"로 활용 — 전형적 계층화(Layering) 수법</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
