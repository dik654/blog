import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Confidential 상태 변수', body: 'mapping(address => uint256) private bids — 자동 암호화.\nprivate 키워드만 추가, 별도 SDK 불필요.' },
  { label: 'bid() — msg.sender 보호', body: 'msg.sender / msg.value 가 SGX 안에서만 평문.\nbids[msg.sender] = msg.value.' },
  { label: 'getMyBid() — 호출자만 자기 데이터', body: 'view 호출 시 signed query 필요.\n컨트랙트가 msg.sender 검증 후 자기 입찰만 반환.' },
  { label: 'getWinner() — owner 만 (auction 종료 후)', body: 'onlyOwner 체크 + 종료 시점 체크.\n외부 입력 노출 없이 winner 결정.' },
  { label: 'randomPrize() — Sapphire.randomBytes', body: 'precompile 0x01...01 호출.\nSGX CSPRNG → off-chain 예측 불가.' },
];

const ROWS = [
  { name: 'mapping bids',     y: 80,  color: '#10b981' },
  { name: 'highestBidder',    y: 110, color: '#10b981' },
  { name: 'highestBid',       y: 140, color: '#10b981' },
  { name: 'function bid()',   y: 170, color: '#3b82f6' },
  { name: 'getMyBid()',       y: 200, color: '#a855f7' },
];

const HIGHLIGHT = [
  [0, 1, 2],  // step 0
  [0, 3],     // step 1
  [0, 4],     // step 2
  [1],        // step 3
  [],         // step 4
];

export default function SoliditySampleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={20} w={250} h={40}
            label="contract ConfidentialAuction" color="#6366f1" />

          {ROWS.map((r, i) => {
            const lit = HIGHLIGHT[step].includes(i);
            return (
              <motion.g key={r.name} animate={{ opacity: lit ? 1 : 0.35 }}>
                <DataBox x={35} y={r.y} w={220} h={22}
                  label={`private ${r.name}`} color={r.color} outlined={lit} />
              </motion.g>
            );
          })}

          {/* Per-step right side */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={375} y={80} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                state 자동 암호화
              </text>
              <DataBox x={300} y={100} w={160} h={28}
                label="storage slot encryption" color="#10b981" outlined />
              <text x={375} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                slot 별 독립 키
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={300} y={70} w={160} h={50}
                label="msg.sender" sub="SGX 내부에서만" color="#3b82f6" />
              <ActionBox x={300} y={130} w={160} h={36}
                label="bids[sender] = value" color="#3b82f6" />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={300} y={70} w={160} h={50}
                label="signed query" sub="msg.sender 인증" color="#a855f7" />
              <ActionBox x={300} y={130} w={160} h={36}
                label="return bids[sender]" color="#a855f7" />
              <text x={375} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                자기 데이터만 조회
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={300} y={80} w={160} h={36}
                label="onlyOwner check" color="#f59e0b" />
              <ActionBox x={300} y={125} w={160} h={36}
                label="return highestBidder" color="#f59e0b" />
              <text x={375} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                auction 종료 후 owner 만
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20}  y={80} w={140} h={36}
                label="Sapphire.randomBytes(32)" color="#ec4899" />
              <ModuleBox x={180} y={75} w={130} h={42}
                label="precompile" sub="0x01...01" color="#ec4899" />
              <DataBox x={325} y={85} w={130} h={28}
                label="32B CSPRNG (SGX)" color="#ec4899" outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#ec4899" fontWeight={600}>
                off-chain 예측 불가 — VRF 불필요
              </text>
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            @oasisprotocol/sapphire-contracts/contracts/Sapphire.sol
          </text>
        </svg>
      )}
    </StepViz>
  );
}
