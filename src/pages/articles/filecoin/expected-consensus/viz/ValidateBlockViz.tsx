import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const CHECKS = [
  { label: '높이 / 타임스탬프', color: '#6366f1' },
  { label: 'Miner 자격', color: '#10b981' },
  { label: 'VRF 검증', color: '#f59e0b' },
  { label: '블록 서명', color: '#8b5cf6' },
  { label: 'Beacon 값', color: '#ec4899' },
  { label: 'WinPoSt 증명', color: '#ef4444' },
];

const STEPS = [
  { label: '기본 검증 (동기)', body: '부모 TipSet 로드 → Lookback TipSet 조회\n높이 연속성, 타임스탬프 범위, 미래 블록(MaxHeightDrift=5) 거부' },
  { label: '비동기 병렬 검증 (async.Err)', body: '6개 검증을 goroutine으로 동시 실행\n하나라도 실패 시 블록 즉시 거부\n→ 검증 지연을 에폭(30초) 내로 유지' },
  { label: 'Miner 자격 확인', body: 'MinerEligibleToMine() — 최소 파워 요구사항 확인\nSlash 여부 확인 → 슬래시된 마이너의 블록 거부' },
  { label: 'VRF + WinCount 검증', body: 'Beacon → DrawRandomness(DomainSeparationTag_ElectionProof)\n→ VerifyElectionPoStVRF(workerAddr, vrfBase, proof)\n→ ComputeWinCount(minerPower, totalPower)와 대조' },
  { label: 'WinningPoSt 증명', body: 'GetSectorsForWinningPoSt() → 섹터 선택\nBeacon 랜덤시드로 챌린지 생성 → 증명 검증' },
];

const BW = 130, BH = 36, GX = 20;

export default function ValidateBlockViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Sync check box */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }} transition={sp}>
            <rect x={GX} y={10} width={420} height={36} rx={6}
              fill={step === 0 ? '#6366f115' : '#6366f108'} stroke="#6366f1" strokeWidth={step === 0 ? 2 : 0.8} />
            <text x={230} y={32} textAnchor="middle" fontSize={12} fontWeight={600} fill="#6366f1">
              동기 검증: 높이 · 타임스탬프 · 부모 가중치
            </text>
          </motion.g>

          <text x={230} y={60} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)" opacity={0.4}>↓</text>

          {/* Async parallel checks */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
            <rect x={GX} y={68} width={420} height={85} rx={8}
              fill="none" stroke="var(--muted-foreground)" strokeWidth={0.6} strokeDasharray="4 2" />
            <text x={GX + 8} y={82} fontSize={10} fill="var(--muted-foreground)">async.Err (병렬)</text>

            {CHECKS.map((c, i) => {
              const row = i < 3 ? 0 : 1;
              const col = i < 3 ? i : i - 3;
              const x = GX + 10 + col * 138;
              const y = 90 + row * 30;
              const active = (step === 2 && i === 1) || (step === 3 && (i === 2 || i === 3)) || (step === 4 && i === 5);
              return (
                <motion.g key={c.label} animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
                  <rect x={x} y={y} width={BW} height={24} rx={4}
                    fill={active ? `${c.color}20` : 'var(--card)'}
                    stroke={c.color} strokeWidth={active ? 2 : 0.8} />
                  <text x={x + BW / 2} y={y + 16} textAnchor="middle" fontSize={11}
                    fontWeight={active ? 700 : 400} fill={c.color}>{c.label}</text>
                </motion.g>
              );
            })}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
