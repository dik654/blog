import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'keygen', label: 'KeyGen', sub: 'A = a·B', color: '#6366f1', x: 30, y: 40 },
  { id: 'commit', label: 'Commit', sub: 'R = r·B', color: '#10b981', x: 100, y: 40 },
  { id: 'challenge', label: 'Challenge', sub: 'H = SHA512(R‖A‖m)', color: '#f59e0b', x: 170, y: 40 },
  { id: 'response', label: 'Response', sub: 'S = r + H·a', color: '#8b5cf6', x: 240, y: 40 },
  { id: 'verify', label: 'Verify', sub: 'S·B == R + H·A', color: '#ec4899', x: 310, y: 40 },
];

const STEPS = [
  { label: 'KeyGen', body: 'sk = 랜덤 스칼라, A = a·B (a = prune(SHA512(sk)[:32])). 개인키에서 스칼라를 파생합니다.' },
  { label: 'Commit (R 생성)', body: 'r = SHA512(SHA512(sk)[32:] || m). 메시지 의존적 결정론적 nonce. R = r·B.' },
  { label: 'Challenge (Fiat-Shamir)', body: 'H = SHA512(R || A || m). 서명자와 검증자 모두 동일하게 계산합니다.' },
  { label: 'Response 계산', body: 'S = (r + H·a) mod L. 개인키를 직접 노출하지 않고 이산로그 지식을 증명합니다.' },
  { label: 'Verify', body: 'S·B == R + H·A. 전개: (r+Ha)·B = r·B + Ha·B = R + H·A.' },
];

export default function EdDSAViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = i <= step;
            const highlighted = i === step;
            return (
              <g key={n.id}>
                {/* connector */}
                {i > 0 && (
                  <motion.line
                    x1={NODES[i - 1].x + 24} y1={n.y} x2={n.x - 24} y2={n.y}
                    stroke={NODES[i - 1].color} strokeWidth={0.8}
                    animate={{ opacity: i <= step ? 0.5 : 0.1 }} transition={sp}
                  />
                )}
                <motion.rect
                  x={n.x - 24} y={n.y - 16} width={48} height={32} rx={4}
                  animate={{
                    fill: highlighted ? `${n.color}25` : active ? `${n.color}10` : `${n.color}04`,
                    stroke: n.color, strokeWidth: highlighted ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }}
                  transition={sp}
                />
                <motion.text
                  x={n.x} y={n.y - 2} textAnchor="middle" fontSize={9} fontWeight={600}
                  animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}
                >{n.label}</motion.text>
                <motion.text
                  x={n.x} y={n.y + 8} textAnchor="middle" fontSize={9}
                  animate={{ fill: n.color, opacity: active ? 0.6 : 0.15 }} transition={sp}
                >{n.sub}</motion.text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
