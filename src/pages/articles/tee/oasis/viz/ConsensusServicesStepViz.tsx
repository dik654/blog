import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'CometBFT 합의 — Propose → Prevote → Precommit → Commit (2/3+ 서명)' },
  { label: '비콘 + 스테이킹 — VRF(sk, epoch) = 랜덤성, 최소 100 ROSE 보증금' },
  { label: '레지스트리 + 스케줄러 — RegisterNode(entity_id, role, TEE_hw) → 위원회 선출' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function ConsensusServicesStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            {[
              { line: '// CometBFT 합의 라운드', c: '#6366f1', y: 22 },
              { line: 'Propose(block, round)  // 리더가 블록 제안', c: '#6366f1', y: 44 },
              { line: 'Prevote(block_hash)    // 2/3+ 검증자 투표', c: '#10b981', y: 66 },
              { line: 'Precommit(block_hash)  // 2/3+ 사전 커밋', c: '#10b981', y: 88 },
              { line: 'Commit()  // 블록 확정, 즉시 완결성', c: '#f59e0b', y: 110 },
              { line: '// 1/3 미만 비잔틴 허용', c: '#f59e0b', y: 132 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 12} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            {[
              { line: '// 비콘: VRF 기반 랜덤성', c: '#10b981', y: 22 },
              { line: 'entropy = VRF_Prove(validator_sk, epoch)', c: '#10b981', y: 44 },
              { line: 'random  = SHA-256(entropy[0] || ... || entropy[n])', c: '#10b981', y: 66 },
              { line: '// 스테이킹: PoS 보상 & 슬래싱', c: '#f59e0b', y: 90 },
              { line: 'Escrow(account, amount >= 100_ROSE)', c: '#f59e0b', y: 112 },
              { line: 'if double_sign → Slash(escrow, penalty)', c: '#ef4444', y: 134 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 12} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            {[
              { line: '// 레지스트리: 노드 & 런타임 등록', c: '#f59e0b', y: 22 },
              { line: 'RegisterNode(entity_id, role, tee_hw)', c: '#f59e0b', y: 44 },
              { line: 'RegisterRuntime(runtime_id, kind, tee_hw)', c: '#f59e0b', y: 66 },
              { line: '// 스케줄러: 위원회 구성', c: '#6366f1', y: 90 },
              { line: 'committee = elect(eligible_nodes, random, epoch)', c: '#6366f1', y: 112 },
              { line: '// 루트해시: ParaTime 상태 커밋', c: '#6366f1', y: 134 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 12} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
