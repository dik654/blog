import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
};

const STEPS = [
  {
    label: '예치금(원화) 분리 — 은행 예치/신탁',
    body: '이용자의 원화는 은행 등 공신력 기관에 별도 예치 또는 신탁. "이용자 재산"임을 명시해야 하며, 상계·압류 불가.',
  },
  {
    label: '가상자산 분리 — 별도 지갑 관리',
    body: 'VASP 자기 코인과 이용자 코인을 혼합 보관하면 장부 조작·횡령·지급불능 시 피해 직결. 반드시 별도 지갑으로 분리.',
  },
  {
    label: '파산 격리 효과 — 이용자 자산 보호',
    body: 'VASP 파산 시에도 분리 보관된 이용자 자산은 채무에 영향받지 않는다. 이것이 분리 보관의 핵심 법적 효과.',
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

export default function OverviewSeparationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 이용자 원화 */}
              <ModuleBox x={10} y={10} w={100} h={44} label="이용자" sub="원화 입금" color={C.blue} />
              <Arrow x1={110} y1={32} x2={155} y2={32} color={C.blue} />

              {/* VASP 경유 */}
              <ActionBox x={160} y={10} w={100} h={44} label="VASP" sub="수령 후 즉시 분리" color={C.amber} />
              <Arrow x1={260} y1={32} x2={305} y2={32} color={C.green} />

              {/* 은행 예치 */}
              <ModuleBox x={310} y={10} w={150} h={44} label="은행 예치/신탁" sub="공신력 기관" color={C.green} />

              {/* 법적 효과 */}
              <rect x={160} y={75} width={300} height={50} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={310} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>법적 보호 효과</text>
              <text x={310} y={113} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">상계 금지 + 압류(가압류) 금지 + "이용자 재산" 명시</text>

              {/* 법 근거 */}
              <DataBox x={10} y={80} w={120} h={34} label="법 제6조" color={C.slate} />

              {/* 하단 강조 */}
              <AlertBox x={100} y={150} w={280} h={40} label="예치금 미분리 시" sub="VASP 파산 → 이용자 원화 전액 손실 위험" color={C.red} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>가상자산 지갑 분리</text>

              {/* 왼쪽: VASP 자기 자산 */}
              <ModuleBox x={30} y={40} w={130} h={50} label="VASP 자기 지갑" sub="고유재산 보관" color={C.amber} />
              <rect x={40} y={100} width={110} height={22} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.5} />
              <text x={95} y={115} textAnchor="middle" fontSize={9} fill={C.amber}>BTC 50개 (자기분)</text>

              {/* 가운데 분리선 */}
              <line x1={200} y1={35} x2={200} y2={170} stroke={C.red} strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={200} y={185} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.red}>혼합 금지</text>

              {/* 오른쪽: 이용자 자산 */}
              <ModuleBox x={250} y={40} w={130} h={50} label="이용자 지갑" sub="위탁 자산 보관" color={C.green} />
              <rect x={260} y={100} width={110} height={22} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={315} y={115} textAnchor="middle" fontSize={9} fill={C.green}>BTC 300개 (이용자분)</text>

              {/* 우측 법 근거 */}
              <DataBox x={400} y={55} w={70} h={30} label="법 제7조" color={C.slate} />

              {/* 하단 위험 */}
              <AlertBox x={30} y={140} w={130} h={40} label="혼합 시 위험" sub="장부 조작·횡령" color={C.red} />
              <ActionBox x={250} y={140} w={130} h={40} label="분리 시 효과" sub="자산 추적 가능" color={C.green} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>파산 격리 효과</text>

              {/* VASP 파산 */}
              <AlertBox x={150} y={35} w={180} h={40} label="VASP 파산 선고" sub="채무 초과 상태" color={C.red} />

              {/* 분기 화살표 */}
              <Arrow x1={190} y1={75} x2={100} y2={100} color={C.red} />
              <Arrow x1={290} y1={75} x2={380} y2={100} color={C.green} />

              {/* 왼쪽: VASP 채권자 */}
              <ModuleBox x={20} y={105} w={160} h={44} label="VASP 채권자" sub="파산재단에서 변제" color={C.red} />
              <text x={100} y={165} textAnchor="middle" fontSize={9} fill={C.red}>VASP 고유재산만 대상</text>

              {/* 오른쪽: 이용자 자산 */}
              <ModuleBox x={300} y={105} w={160} h={44} label="이용자 위탁 자산" sub="파산재단 편입 불가" color={C.green} />
              <text x={380} y={165} textAnchor="middle" fontSize={9} fill={C.green}>분리 보관 덕분에 보호</text>

              {/* 결론 */}
              <rect x={100} y={180} width={280} height={24} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
              <text x={240} y={196} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.blue}>분리 보관 = 이용자 자산의 법적 방화벽</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
