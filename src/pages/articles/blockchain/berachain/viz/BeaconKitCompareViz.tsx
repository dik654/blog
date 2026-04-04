import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const L_ETH = [
  { label: 'Beacon Chain', sub: 'Lighthouse/Prysm', color: '#6366f1' },
  { label: 'Casper FFG', sub: '확률적 최종성', color: '#6366f1' },
  { label: 'LMD-GHOST', sub: '포크 선택', color: '#6366f1' },
  { label: 'libp2p', sub: 'P2P 네트워킹', color: '#6366f1' },
];
const L_BERA = [
  { label: 'BeaconKit', sub: 'Cosmos SDK 모듈', color: '#10b981' },
  { label: 'CometBFT', sub: '즉시 최종성', color: '#10b981' },
  { label: 'No Fork', sub: 'BFT 포크 없음', color: '#10b981' },
  { label: 'MConnection', sub: 'Tendermint P2P', color: '#10b981' },
];
const LY = [14, 38, 62, 86], LH = 18, LW = 72;

const STEPS = [
  { label: '전체 아키텍처 비교', body: '왼쪽 이더리움 Beacon Chain vs 오른쪽 Berachain BeaconKit. 레이어별 차이를 비교합니다.' },
  { label: '합의 레이어: Casper FFG → CometBFT', body: 'Casper FFG의 확률적 최종성 대신 CometBFT 즉시 최종성으로 교체. 1블록 최종성 달성.' },
  { label: '포크 선택: LMD-GHOST → 불필요', body: 'BFT 합의는 포크가 발생하지 않으므로 포크 선택 규칙이 필요 없습니다.' },
  { label: '네트워킹: libp2p → MConnection', body: 'Tendermint의 MConnection 멀티플렉싱 P2P로 교체. 기존 Cosmos 생태계와 호환.' },
];

export default function BeaconKitCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* column headers */}
          <text x={82} y={10} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">Ethereum</text>
          <text x={268} y={10} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">BeaconKit</text>
          {/* center divider */}
          <line x1={175} y1={12} x2={175} y2={106} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3 3" />
          {/* layers */}
          {LY.map((y, i) => {
            const highlight = step === i + 1 || step === 0;
            const active = step === i + 1;
            const eth = L_ETH[i], bera = L_BERA[i];
            return (
              <g key={i}>
                {/* ETH side */}
                <motion.rect x={82 - LW / 2} y={y} width={LW} height={LH} rx={4}
                  animate={{ fill: `${eth.color}${active ? '22' : '0c'}`, stroke: eth.color,
                    strokeWidth: active ? 2 : 0.8, opacity: highlight ? 1 : 0.2 }} transition={sp} />
                <text x={82} y={y + 8} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={eth.color} opacity={highlight ? 1 : 0.2}>{eth.label}</text>
                <text x={82} y={y + 15} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)" opacity={highlight ? 0.6 : 0.1}>{eth.sub}</text>
                {/* BERA side */}
                <motion.rect x={268 - LW / 2} y={y} width={LW} height={LH} rx={4}
                  animate={{ fill: `${bera.color}${active ? '22' : '0c'}`, stroke: bera.color,
                    strokeWidth: active ? 2 : 0.8, opacity: highlight ? 1 : 0.2 }} transition={sp} />
                <text x={268} y={y + 8} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={bera.color} opacity={highlight ? 1 : 0.2}>{bera.label}</text>
                <text x={268} y={y + 15} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)" opacity={highlight ? 0.6 : 0.1}>{bera.sub}</text>
                {/* arrow between */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                    <line x1={118} y1={y + LH / 2} x2={228} y2={y + LH / 2}
                      stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arw)" />
                    <text x={175} y={y + LH / 2 - 4} textAnchor="middle" fontSize={9}
                      fill="#f59e0b" fontWeight={600}>변경</text>
                  </motion.g>
                )}
              </g>
            );
          })}
          <defs>
            <marker id="arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
