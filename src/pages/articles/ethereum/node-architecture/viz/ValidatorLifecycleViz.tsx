import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: '32 ETH 예치 → Deposit Contract에 전송합니다', body: '사용자가 Deposit Contract(0x0000...05Fa)에 32 ETH + BLS-12-381 공개키 + withdrawal credential을 전송합니다. 이 예치가 검증자의 "담보"입니다 — 이후 위반 시 이 스테이크가 삭감됩니다.' },
  { label: '6.8시간 대기 (ETH1_FOLLOW_DISTANCE = 2048 블록) — EL 재편성 방지', body: 'EL의 Deposit Contract 이벤트를 CL이 즉시 인식하지 않습니다. 2048블록 지연 후에야 BeaconChain에 pending_validator로 등록됩니다. EL 체인이 재편성될 경우 없는 예치를 근거로 검증자가 활성화되는 것을 방지합니다.' },
  { label: '활성화 큐 대기 (Churn Limit = max(8, count/65536) / 에폭)', body: '에폭마다 활성화되는 검증자 수는 제한됩니다. 대규모 스테이크가 갑자기 진입하면 위원회 구성이 급격히 바뀌어 포크 초이스 가중치가 불안정해집니다. churn limit이 그 완충 역할을 합니다.' },
  { label: 'Active — 매 에폭 어테스테이션 의무, 확률적 블록 제안', body: '활성 검증자에게는 두 역할이 있습니다. 첫째, 매 에폭 랜덤 배정된 위원회에서 어테스테이션 제출(보상/처벌). 둘째, RANDAO로 선정될 경우 블록 제안(32 ETH 기준 평균 ~43일에 한 번).' },
  { label: '자발적 탈퇴 — 256에폭(≈27시간) 감금 대기 후 완전 탈퇴', body: 'VoluntaryExit 메시지에 서명하면 즉시 탈퇴되지 않습니다. MIN_VALIDATOR_WITHDRAWABILITY_DELAY(256 에폭 ≈ 27시간) 동안 감금 상태로 어테스테이션 의무가 유지됩니다.' },
  { label: '슬래싱 — 이중 서명 적발 시 1/32 삭감 + 36일 강제 감금', body: '위반(이중 블록 제안, 이중 투표, surround vote)이 적발되면 즉시 1/32 stake가 삭감되고 36일 강제 감금됩니다. 동시에 많은 검증자가 슬래싱될수록 Correlation Penalty로 최대 전액이 몰수됩니다.' },
];

// State circles on a horizontal rail at cy=100
// Slashed drops below to cy=185
const STATES = [
  { label: 'Deposited', sub: '32 ETH', cx: 50,  cy: 100, color: '#eab308' },
  { label: 'Pending',   sub: '6.8h',   cx: 140, cy: 100, color: '#3b82f6' },
  { label: 'Active',    sub: '의무',   cx: 230, cy: 100, color: '#22c55e' },
  { label: 'Exiting',   sub: '27h',    cx: 320, cy: 100, color: '#f97316' },
  { label: 'Withdrawn', sub: '완료',   cx: 400, cy: 100, color: '#94a3b8' },
  { label: 'Slashed',   sub: '36d',    cx: 230, cy: 185, color: '#ef4444' },
];

// V dot travels on a rail ABOVE the state circles at cy=46
const RAIL_Y = 46;
const DOT_POS = STATES.map(s => ({ x: s.cx, y: RAIL_Y }));
// For Slashed, the dot drops down to between rail and circle
DOT_POS[5] = { x: 230, y: 185 };

export default function ValidatorLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const dot = DOT_POS[step];
        return (
          <svg viewBox="0 0 450 230" className="w-full max-w-[450px]" style={{ height: 'auto' }}>
            {/* Rail line along the top */}
            <line x1={50} y1={RAIL_Y} x2={400} y2={RAIL_Y} stroke="hsl(var(--border))" strokeWidth={1.5} />
            {/* Connector lines from rail to each state circle */}
            {STATES.slice(0, 5).map((s) => (
              <line key={s.label} x1={s.cx} y1={RAIL_Y + 8} x2={s.cx} y2={s.cy - 22} stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="3 2" />
            ))}
            {/* Slash branch: from Active circle down */}
            <line x1={230} y1={122} x2={230} y2={163} stroke="hsl(var(--border))" strokeWidth={1.5} strokeDasharray="5 3" />
            <text x={243} y={145} fontSize={8} fill="hsl(var(--muted-foreground))">slashed</text>

            {/* Main path arrows between state circles */}
            <line x1={72} y1={100} x2={118} y2={100} stroke="hsl(var(--border))" strokeWidth={1.5} />
            <line x1={162} y1={100} x2={208} y2={100} stroke="hsl(var(--border))" strokeWidth={1.5} />
            <line x1={252} y1={100} x2={298} y2={100} stroke="hsl(var(--border))" strokeWidth={1.5} />
            <line x1={342} y1={100} x2={378} y2={100} stroke="hsl(var(--border))" strokeWidth={1.5} />

            {/* State nodes */}
            {STATES.map((s, i) => {
              const active = step === i;
              const passed = step > i && i < 5;
              return (
                <g key={s.label}>
                  <motion.circle cx={s.cx} cy={s.cy} r={20}
                    animate={{
                      fill: active ? `${s.color}30` : passed ? `${s.color}15` : 'hsl(var(--muted)/0.4)',
                      stroke: active || passed ? s.color : 'hsl(var(--border))',
                      strokeWidth: active ? 2.5 : 1.5
                    }}
                    transition={{ duration: 0.3 }} />
                  <text x={s.cx} y={s.cy - 5} textAnchor="middle" fontSize={8} fontWeight="700"
                    style={{ fill: active ? s.color : 'hsl(var(--foreground))' }}>
                    {s.label}
                  </text>
                  <text x={s.cx} y={s.cy + 7} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">{s.sub}</text>
                </g>
              );
            })}

            {/* V dot travels along the top rail, drops to Slashed position */}
            <motion.g
              animate={{ x: dot.x - DOT_POS[0].x, y: dot.y - DOT_POS[0].y }}
              transition={{ duration: 0.55, type: 'spring', bounce: 0.25 }}>
              <circle cx={DOT_POS[0].x} cy={DOT_POS[0].y} r={13}
                fill={STATES[step].color}
                style={{ filter: `drop-shadow(0 0 5px ${STATES[step].color}99)` }} />
              <text x={DOT_POS[0].x} y={DOT_POS[0].y + 4} textAnchor="middle" fontSize={8} fontWeight="800" fill="white">V</text>
            </motion.g>

            {/* Time indicator */}
            {(step === 1 || step === 4) && (
              <motion.text
                x={dot.x} y={dot.y + 28}
                textAnchor="middle" fontSize={8} fontWeight="600"
                fill={STATES[step].color}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {step === 1 ? '⏳ 6.8h' : '⏳ 27h'}
              </motion.text>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
