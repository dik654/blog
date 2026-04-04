import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const PATH = [
  { n: '1', label: '합의', sub: 'EC · F3', color: '#6366f1' },
  { n: '2', label: '저장 증명', sub: 'PoRep · PoSt', color: '#10b981' },
  { n: '3', label: 'GPU 가속', sub: 'SNARK · GPU', color: '#f59e0b' },
  { n: '4', label: '네트워크', sub: 'IPFS · FVM', color: '#ec4899' },
  { n: '5', label: 'Lotus 내부', sub: '체인 · 마이닝', color: '#8b5cf6' },
];

const STEPS = [
  { label: '1단계: 합의', body: 'Expected Consensus — VRF 선출, Tipset, 체인 가중치\nF3 — GossiPBFT로 수 분 내 확정' },
  { label: '2단계: 저장 증명', body: 'PoRep — SDR 인코딩 → Merkle Tree → Groth16\nPoSt — WindowPoSt(24h) + WinningPoSt(블록 생성)' },
  { label: '3단계: GPU 가속', body: 'bellperson — MSM/NTT CUDA 가속\nsppark, Neptune, SupraSeal 최적화' },
  { label: '4단계: 네트워크 인프라', body: 'IPFS — CID, Bitswap, DHT\nFVM — WASM Actor, FEVM\nIPC — 서브넷 확장' },
  { label: '5단계: Lotus 코드 심층', body: 'ChainSync, 마이닝, 스토리지 딜, 메시지 풀\n→ Go 소스 코드 수준 분석' },
];

export default function LearningPathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 60" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PATH.map((p, i) => {
            const x = 10 + i * 94;
            const active = step === i;
            return (
              <motion.g key={p.label} animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
                {/* Number badge */}
                <circle cx={x + 10} cy={16} r={10} fill={active ? p.color : `${p.color}30`} />
                <text x={x + 10} y={20} textAnchor="middle" fontSize={11}
                  fontWeight={700} fill={active ? 'white' : p.color}>{p.n}</text>

                {/* Label + sub */}
                <text x={x + 26} y={14} fontSize={12} fontWeight={700} fill={p.color}>{p.label}</text>
                <text x={x + 26} y={28} fontSize={10} fill={p.color} opacity={0.6}>{p.sub}</text>

                {/* Arrow */}
                {i < 4 && (
                  <text x={x + 86} y={18} fontSize={12} fill="var(--muted-foreground)" opacity={0.3}>→</text>
                )}
              </motion.g>
            );
          })}

          <text x={240} y={52} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            번호 순서대로 읽으면 Filecoin 전체 구조 이해 가능
          </text>
        </svg>
      )}
    </StepViz>
  );
}
