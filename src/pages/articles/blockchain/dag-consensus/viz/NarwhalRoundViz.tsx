import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const VALS = ['V1', 'V2', 'V3', 'V4'];
const VX = [55, 125, 195, 265];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
const TXY = 22, VERTY = 48, CERTY = 78;

const STEPS = [
  { label: 'Round r: 트랜잭션 브로드캐스트', body: '각 검증자가 자신의 트랜잭션 배치를 다른 모든 검증자에게 전파합니다.' },
  { label: 'Vertex 생성', body: '수신한 트랜잭션 + 이전 라운드 인증서를 포함하여 vertex를 구성합니다.' },
  { label: '2f+1 서명 수집 → Certificate', body: '다른 검증자로부터 2f+1개의 서명을 받아 데이터 가용성 인증서를 생성.' },
  { label: '다음 라운드 진행', body: '인증서를 다음 라운드의 부모로 사용. Workers가 데이터를 전파합니다.' },
];

function Row({ x, y, c, label, vis, glow }: { x: number; y: number; c: string; label: string; vis: boolean; glow: boolean }) {
  return (
    <>
      <motion.rect x={x - 20} y={y - 6} width={40} height={14} rx={3}
        animate={{ fill: vis ? `${c}18` : `${c}04`, stroke: c, strokeWidth: glow ? 2 : 0.8, opacity: vis ? 1 : 0.15 }} transition={sp} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={10} fill={c} opacity={vis ? 0.8 : 0.15}>{label}</text>
    </>
  );
}

export default function NarwhalRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={12} y={TXY + 4} fontSize={10} fill="var(--muted-foreground)">Tx</text>
          <text x={12} y={VERTY + 4} fontSize={10} fill="var(--muted-foreground)">Vertex</text>
          <text x={12} y={CERTY + 4} fontSize={10} fill="var(--muted-foreground)">Cert</text>
          {VALS.map((v, i) => {
            const c = COLORS[i];
            return (
              <g key={v}>
                <text x={VX[i]} y={10} textAnchor="middle" fontSize={10} fontWeight={600} fill={c}>{v}</text>
                <Row x={VX[i]} y={TXY} c={c} label="txBatch" vis={step >= 0} glow={step === 0} />
                {step === 0 && i < 3 && (
                  <motion.line x1={VX[i] + 22} y1={TXY} x2={VX[i + 1] - 22} y2={TXY}
                    stroke={c} strokeWidth={0.8} strokeDasharray="2 2" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
                )}
                <Row x={VX[i]} y={VERTY} c={c} label="vertex" vis={step >= 1} glow={step === 1} />
                {step >= 1 && <motion.line x1={VX[i]} y1={TXY + 8} x2={VX[i]} y2={VERTY - 7}
                  stroke="var(--border)" strokeWidth={0.7} initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={sp} />}
                <Row x={VX[i]} y={CERTY} c={c} label="cert" vis={step >= 2} glow={step >= 2} />
                {step >= 2 && <motion.line x1={VX[i]} y1={VERTY + 8} x2={VX[i]} y2={CERTY - 7}
                  stroke="var(--border)" strokeWidth={0.7} initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={sp} />}
                {step === 2 && <motion.text x={VX[i]} y={CERTY + 16} textAnchor="middle" fontSize={10}
                  fill={c} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>2f+1 sigs</motion.text>}
                {step === 3 && (
                  <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                    <circle cx={VX[i]} cy={CERTY + 16} r={4} fill={`${c}30`} stroke={c} strokeWidth={1} />
                    <text x={VX[i]} y={CERTY + 18} textAnchor="middle" fontSize={10} fill={c} fontWeight={600}>r+1</text>
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
