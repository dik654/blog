import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const N = 4, CX = 160, CY = 48, R = 34;
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

function pos(i: number) {
  const a = (i * 2 * Math.PI) / N - Math.PI / 2;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

const STEPS = [
  { label: '1라운드: 공개키 교환', body: '각 참가자가 Paillier 공개키 후보 Ni = pi x qi 를 생성해 브로드캐스트.' },
  { label: '2라운드: 검증 & 합성', body: '각 Ni 의 ZKP 검증 후 글로벌 모듈러스 N = prod(Ni) 합성.' },
  { label: '3라운드: 개인키 분산', body: 'Shamir 비밀 분산으로 개인키 공유 배포. sij를 안전하게 전달.' },
  { label: '4라운드: 분산 복호화', body: 't+1명 이상이 부분 복호화 di를 합산하여 최종 평문 복원.' },
];

export default function DKGRoundsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 320 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {Array.from({ length: N }, (_, i) => {
            const p = pos(i);
            const c = COLORS[i];
            return (
              <g key={i}>
                <motion.circle cx={p.x} cy={p.y} r={12}
                  animate={{ fill: `${c}18`, stroke: c, strokeWidth: 1.5 }} transition={sp} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={9} fontWeight={600} fill={c}>
                  P{i + 1}
                </text>
                {/* broadcast arrows step 0 */}
                {step === 0 && i < N - 1 && (
                  <motion.line x1={pos(i).x + 10} y1={pos(i).y}
                    x2={pos(i + 1).x - 10} y2={pos(i + 1).y}
                    stroke={c} strokeWidth={0.8} strokeDasharray="2 2"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
                )}
              </g>
            );
          })}
          {/* center key */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <circle cx={CX} cy={CY} r={10} fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
              <text x={CX} y={CY + 3.5} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
                {step === 1 ? 'N' : step === 2 ? 'sij' : 'di'}
              </text>
            </motion.g>
          )}
          {/* shares flying out step 2 */}
          {step === 2 && Array.from({ length: N }, (_, i) => {
            const p = pos(i);
            return (
              <motion.line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y}
                stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="2 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ ...sp, delay: i * 0.1 }} />
            );
          })}
          {/* partial decrypt step 3 */}
          {step === 3 && Array.from({ length: N }, (_, i) => {
            const p = pos(i);
            return (
              <motion.line key={i} x1={p.x} y1={p.y} x2={CX} y2={CY}
                stroke="#8b5cf6" strokeWidth={1} markerEnd="url(#dk)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ ...sp, delay: i * 0.1 }} />
            );
          })}
          <defs>
            <marker id="dk" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="#8b5cf6" opacity={0.5} />
            </marker>
          </defs>
          {/* round label */}
          <motion.text x={280} y={20} fontSize={9} fontWeight={600} fill={COLORS[step]}
            animate={{ opacity: 0.8 }} transition={sp}>R{step + 1}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
