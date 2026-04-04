import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const EPOCHS = [
  { t: 'T1', challenge: 'C1', status: 'pass' },
  { t: 'T2', challenge: 'C2', status: 'pass' },
  { t: 'T3', challenge: 'C3', status: 'fail' },
  { t: 'T4', challenge: 'C4', status: 'pass' },
];
const STEPS = [
  { label: 'PoSt: 주기적 챌린지 구조', body: 'PoSt는 시간 축을 따라 주기적으로 저장을 증명하는 프로토콜입니다.' },
  { label: 'T1: 첫 번째 챌린지 통과', body: '에폭 T1에서 랜덤 챌린지 C1에 정상 응답. 저장 지속 확인.' },
  { label: 'T2: 연속 저장 증명', body: 'T2에서도 새로운 챌린지에 응답. 연속성 증명.' },
  { label: 'T3: 실패 → 슬래싱', body: 'T3에서 응답 실패 시 Fault가 기록되고 담보가 슬래싱됩니다.' },
  { label: 'T4: 복구 후 재증명', body: 'T4에서 복구 후 다시 정상 응답. 페널티 기간 종료.' },
];
const BW = 80, BH = 36, GAP = 105;

export default function PoStFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* timeline */}
          <line x1={30} y1={60} x2={460} y2={60}
            stroke="var(--border)" strokeWidth={1} />
          {EPOCHS.map((e, i) => {
            const x = 55 + i * GAP;
            const active = i + 1 === step;
            const visible = i < step;
            const isFail = e.status === 'fail';
            const color = isFail ? '#ef4444' : C[1];
            return (
              <motion.g key={e.t} animate={{ opacity: step === 0 || visible || active ? 1 : 0.15 }}>
                {/* epoch marker */}
                <circle cx={x + BW / 2} cy={60} r={4}
                  fill={active ? color : 'none'}
                  stroke={color} strokeWidth={active ? 2 : 1} />
                {/* box */}
                <rect x={x} y={70} width={BW} height={BH} rx={5}
                  fill={active ? `${color}20` : `${color}08`}
                  stroke={color} strokeWidth={active ? 2 : 1} />
                <text x={x + BW / 2} y={87} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={color}>
                  {e.t}: {isFail ? 'FAIL' : 'PASS'}
                </text>
                <text x={x + BW / 2} y={98} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{e.challenge}</text>
                {/* time label */}
                <text x={x + BW / 2} y={52} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{e.t}</text>
                {/* slash indicator */}
                {isFail && visible && (
                  <motion.text x={x + BW / 2} y={118} textAnchor="middle"
                    fontSize={9} fill="#ef4444" fontWeight={600}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Slashing!
                  </motion.text>
                )}
              </motion.g>
            );
          })}
          <text x={240} y={20} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">시간축 (Epoch)</text>
        </svg>
      )}
    </StepViz>
  );
}
