import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Receipt 생성', sub: 'zkVM (Rust)', color: '#6366f1' },
  { label: 'ImageID', sub: 'Build 시스템', color: '#10b981' },
  { label: '온체인 검증', sub: 'Solidity', color: '#f59e0b' },
  { label: '앱 로직', sub: 'DApp 상태', color: '#8b5cf6' },
];

const BW = 88, BH = 44, GAP = 14, OY = 30;
const bx = (i: number) => 12 + i * (BW + GAP);

const STEPS = [
  { label: 'Receipt 생성: Groth16 모드 증명', body: 'prover.prove_with_opts(env, ELF, groth16) → Receipt { journal, seal }. seal은 BN254 Groth16 260 bytes.' },
  { label: 'ImageID 계산: ELF SHA-256 해시', body: '빌드 시 자동 생성. risc0_build::embed_methods!()로 [u32;8] 이미지 ID를 추출합니다.' },
  { label: '온체인 검증: Groth16Verifier 호출', body: 'verifier.verify(seal, imageId, journalHash). 실패 시 revert. ~250k gas 소비.' },
  { label: '앱 로직: journal 디코딩 후 상태 업데이트', body: 'abi.decode(journal)로 결과를 읽어 컨트랙트 상태를 업데이트합니다.' },
];

export default function R0EthereumViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 430 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="r0e-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* Layer labels */}
          <text x={6} y={16} fontSize={9} fill="var(--muted-foreground)">오프체인</text>
          <line x1={0} y1={OY + BH + 8} x2={430} y2={OY + BH + 8}
            stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
          <text x={6} y={OY + BH + 20} fontSize={9} fill="var(--muted-foreground)">온체인</text>
          {NODES.map((n, i) => {
            const y = i < 2 ? OY : OY + 12;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: i <= step ? 1 : 0.15, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}>
                <rect x={bx(i)} y={y} width={BW} height={BH} rx={7}
                  fill={n.color + '18'} stroke={n.color}
                  strokeWidth={i === step ? 2.5 : 1} />
                <text x={bx(i) + BW / 2} y={y + 18} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
                <text x={bx(i) + BW / 2} y={y + 32} textAnchor="middle"
                  fontSize={6.5} fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
          {/* Arrows */}
          {[0, 1, 2].map(i => step > i && (
            <motion.line key={`e${i}`}
              x1={bx(i) + BW} y1={OY + BH / 2 + (i >= 1 ? 6 : 0)}
              x2={bx(i + 1)} y2={OY + BH / 2 + (i >= 1 ? 6 : 0)}
              stroke="var(--muted-foreground)" strokeWidth={1}
              markerEnd="url(#r0e-a)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
          ))}
          {/* Data labels on arrows */}
          {step >= 1 && (
            <motion.text x={bx(0) + BW + GAP / 2} y={OY + 12} textAnchor="middle"
              fontSize={9} fill={NODES[0].color} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              seal + journal
            </motion.text>
          )}
          {step >= 3 && (
            <motion.text x={bx(2) + BW + GAP / 2} y={OY + 22} textAnchor="middle"
              fontSize={9} fill={NODES[3].color} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              journal 디코딩
            </motion.text>
          )}
          {/* Gas badge */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={bx(2) + 14} y={OY + BH + 20} width={60} height={14} rx={7}
                fill={NODES[2].color + '20'} stroke={NODES[2].color} strokeWidth={1} />
              <text x={bx(2) + 44} y={OY + BH + 30} textAnchor="middle"
                fontSize={6.5} fontWeight={600} fill={NODES[2].color}>~250k gas</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
