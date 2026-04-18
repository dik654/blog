import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = { rule: '#6366f1', risk: '#10b981', warn: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: 'Rule-based 한계', body: '2012년 이전: 모든 고객에 동일 CDD → 진짜 위험 간과 + 저위험에 자원 낭비.' },
  { label: 'FATF R.1 전환', body: 'FATF 2012 권고 R.1: "위험에 상응하는 조치" → 규정 기반 위에 RBA 레이어 추가.' },
  { label: 'RBA 자원 재배분', body: '고위험 집중, 저위험 간소화 → CTR(규정 의무)는 유지하되 STR은 위험 판단 기반.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rvr-arrow)" />;
}

export default function RuleVsRiskViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rvr-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={10} w={200} h={36} label="규정 기반 (Pre-2012)" sub="모든 고객 동일 수준 적용" color={C.rule} />
              {/* Equal boxes */}
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <rect x={40 + i * 85} y={65} width={70} height={24} rx={4} fill={`${C.rule}12`} stroke={C.rule} strokeWidth={0.6} />
                  <text x={75 + i * 85} y={81} textAnchor="middle" fontSize={8} fill={C.rule}>동일 CDD</text>
                </g>
              ))}
              <Arrow x1={240} y1={46} x2={240} y2={63} color={C.rule} />
              {/* Problems */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <rect x={30} y={108} width={195} height={30} rx={5} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.5} />
                <text x={127} y={127} textAnchor="middle" fontSize={8} fill={C.red}>고위험 거래 놓침 (미탐)</text>
                <rect x={255} y={108} width={195} height={30} rx={5} fill={`${C.warn}08`} stroke={C.warn} strokeWidth={0.5} />
                <text x={352} y={127} textAnchor="middle" fontSize={8} fill={C.warn}>저위험에 자원 낭비 (과잉)</text>
              </motion.g>
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">임계값(1천만 원) 기계적 보고 → 진짜 위험은 다른 곳</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={8} w={200} h={36} label="FATF 권고 R.1 (2012)" sub="위험기반 접근법 의무화" color={C.risk} />
              <Arrow x1={200} y1={44} x2={120} y2={65} color={C.rule} />
              <Arrow x1={280} y1={44} x2={360} y2={65} color={C.risk} />
              {/* Rule base remains */}
              <DataBox x={30} y={68} w={180} h={32} label="규정 기반 유지 (CTR 등)" color={C.rule} />
              <text x={120} y={116} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">기계적 의무 보고는 그대로</text>
              {/* RBA added on top */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={270} y={68} w={180} h={32} label="+ RBA 레이어 추가" sub="위험 판단 기반 차등" color={C.risk} />
                <text x={360} y={116} textAnchor="middle" fontSize={8} fill={C.risk}>위험에 비례하는 CDD</text>
              </motion.g>
              {/* Combined */}
              <rect x={100} y={140} width={280} height={30} rx={6} fill={`${C.risk}08`} stroke={C.risk} strokeWidth={0.5} />
              <text x={240} y={159} textAnchor="middle" fontSize={9} fill={C.risk}>RBA = 규정 기반의 "위"에 더해지는 추가 레이어</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">RBA 자원 배분 원리</text>
              {/* Three tiers */}
              <ActionBox x={20} y={35} w={130} h={44} label="고위험" sub="EDD + 경영진 승인" color={C.red} />
              <ActionBox x={175} y={35} w={130} h={44} label="중위험" sub="표준 CDD" color={C.warn} />
              <ActionBox x={330} y={35} w={130} h={44} label="저위험" sub="간소화 CDD" color={C.risk} />
              {/* Resource bars */}
              <rect x={30} y={95} width={110} height={12} rx={4} fill={C.red} opacity={0.6} />
              <rect x={195} y={95} width={70} height={12} rx={4} fill={C.warn} opacity={0.5} />
              <rect x={360} y={95} width={35} height={12} rx={4} fill={C.risk} opacity={0.4} />
              <text x={85} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">자원 집중</text>
              <text x={230} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">표준 배분</text>
              <text x={378} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">절감</text>
              {/* Bottom */}
              <rect x={60} y={140} width={360} height={28} rx={6} fill={`${C.risk}08`} stroke={C.risk} strokeWidth={0.5} />
              <text x={240} y={158} textAnchor="middle" fontSize={9} fill={C.risk}>
                CTR(금액 기준)은 기계적 유지 + STR(의심 기준)은 위험 판단
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
