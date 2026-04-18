import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
  purple: '#a855f7',
};

const STEPS = [
  {
    label: '머클 트리 구성 — 리프에서 루트까지',
    body: '각 이용자의 (ID 해시 + 잔고)가 리프 노드. 인접 노드를 쌍으로 해시하여 상위 노드 생성, 루트까지 반복.',
  },
  {
    label: '개별 검증 — 머클 경로로 포함 증명',
    body: '이용자는 자신의 리프 + 형제 노드(머클 경로)로 루트를 재계산. 공개 루트와 일치하면 "내 잔고가 총합에 포함".',
  },
  {
    label: '온체인 대조 — 실제 보유 확인',
    body: '거래소 공개 지갑 주소의 온체인 잔고 >= 머클 트리 총 잔고인지 확인. 외부 감사인이 통제권도 검증.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 4, ay = y2 - uy * 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`} fill={color} />
    </g>
  );
}

export default function MerkleTreePoRViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>머클 트리 구성</text>

              {/* 루트 */}
              <ModuleBox x={190} y={22} w={100} h={36} label="Root Hash" sub="총 잔고 합계" color={C.purple} />

              {/* 중간 노드 */}
              <Arrow x1={220} y1={58} x2={140} y2={75} color={C.blue} />
              <Arrow x1={260} y1={58} x2={340} y2={75} color={C.blue} />

              <DataBox x={80} y={78} w={120} h={28} label="Hash(L1+L2)" color={C.blue} />
              <DataBox x={280} y={78} w={120} h={28} label="Hash(L3+L4)" color={C.blue} />

              {/* 리프 노드 */}
              <Arrow x1={110} y1={106} x2={60} y2={125} color={C.green} />
              <Arrow x1={170} y1={106} x2={220} y2={125} color={C.green} />
              <Arrow x1={310} y1={106} x2={280} y2={125} color={C.green} />
              <Arrow x1={370} y1={106} x2={420} y2={125} color={C.green} />

              <rect x={10} y={128} width={100} height={36} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={60} y={143} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>User A</text>
              <text x={60} y={156} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">ID해시 + 2.5 BTC</text>

              <rect x={170} y={128} width={100} height={36} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={220} y={143} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>User B</text>
              <text x={220} y={156} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">ID해시 + 1.0 BTC</text>

              <rect x={250} y={128} width={100} height={36} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={300} y={143} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>User C</text>
              <text x={300} y={156} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">ID해시 + 3.2 BTC</text>

              <rect x={380} y={128} width={90} height={36} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={425} y={143} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>User D</text>
              <text x={425} y={156} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">ID해시 + 0.8 BTC</text>

              {/* 설명 */}
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">인접 노드를 쌍으로 해시 → 상위 노드 생성 → 루트까지 반복</text>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.purple}>총 잔고: 2.5 + 1.0 + 3.2 + 0.8 = 7.5 BTC</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>개별 검증: 머클 경로</text>

              {/* 루트 */}
              <ModuleBox x={190} y={22} w={100} h={36} label="Root Hash" sub="공개된 루트" color={C.purple} />

              {/* 중간 노드 */}
              <Arrow x1={220} y1={58} x2={140} y2={75} color={C.amber} />
              <Arrow x1={260} y1={58} x2={340} y2={75} color={C.slate} />

              {/* 경로에 포함된 노드 (색상 강조) */}
              <DataBox x={80} y={78} w={120} h={28} label="Hash(L1+L2)" color={C.amber} />
              {/* 형제 노드 (검증용 제공) */}
              <DataBox x={280} y={78} w={120} h={28} label="형제 노드" sub="거래소 제공" color={C.slate} />

              {/* 리프 */}
              <Arrow x1={110} y1={106} x2={60} y2={125} color={C.green} />
              <Arrow x1={170} y1={106} x2={220} y2={125} color={C.slate} />

              {/* 내 리프 (강조) */}
              <rect x={10} y={128} width={100} height={36} rx={6} fill={C.green} fillOpacity={0.1} stroke={C.green} strokeWidth={2} />
              <text x={60} y={143} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.green}>내 계정 (A)</text>
              <text x={60} y={156} textAnchor="middle" fontSize={7} fill={C.green}>내 잔고 2.5 BTC</text>

              {/* 형제 리프 */}
              <rect x={170} y={128} width={100} height={36} rx={6} fill="var(--card)" stroke={C.slate} strokeWidth={0.5} />
              <text x={220} y={143} textAnchor="middle" fontSize={8} fill={C.slate}>형제 리프</text>
              <text x={220} y={156} textAnchor="middle" fontSize={7} fill={C.slate}>거래소 제공</text>

              {/* 검증 과정 */}
              <rect x={100} y={178} width={280} height={34} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={240} y={192} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>내 리프 + 형제들 → 루트 재계산 → 공개 루트와 비교</text>
              <text x={240} y={206} textAnchor="middle" fontSize={8} fill={C.green}>일치 = "내 잔고가 총합에 포함됨" 수학적 증명</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>온체인 대조 + 외부 감사</text>

              {/* 머클 트리 결과 */}
              <ModuleBox x={20} y={35} w={130} h={44} label="머클 트리" sub="총 잔고: 7.5 BTC" color={C.purple} />

              {/* 비교 */}
              <text x={195} y={62} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.amber}>vs</text>

              {/* 온체인 잔고 */}
              <ModuleBox x={240} y={35} w={130} h={44} label="온체인 지갑" sub="실제 잔고: 8.1 BTC" color={C.green} />

              {/* 결과 */}
              <Arrow x1={305} y1={79} x2={410} y2={50} color={C.green} />
              <StatusBox x={395} y={35} w={75} h={44} label="충분" sub="8.1 >= 7.5" color={C.green} progress={1} />

              {/* 외부 감사 */}
              <rect x={20} y={100} width={440} height={55} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>외부 감사 검증</text>
              <text x={240} y={134} textAnchor="middle" fontSize={9} fill="var(--foreground)">감사인이 지갑 통제권 확인 → 소액 테스트 전송 요청</text>
              <text x={240} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">지갑 잔고 + 장부 + 머클 트리 3자 교차 검증</text>

              {/* 주소 공개 트레이드오프 */}
              <ActionBox x={20} y={170} w={200} h={38} label="주소 공개 → 투명성" sub="누구나 탐색기로 실시간 확인" color={C.green} />
              <ActionBox x={260} y={170} w={200} h={38} label="주소 공개 → 위험" sub="타깃 공격 표면 증가" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
