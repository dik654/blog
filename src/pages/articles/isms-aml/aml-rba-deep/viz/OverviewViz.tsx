import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = { rule: '#6366f1', risk: '#10b981', warn: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: 'Rule-based vs Risk-based', body: '규정 기반은 모든 고객에 동일 기준 → RBA는 위험에 비례하는 차등 적용.' },
  { label: 'RBA 자원 배분 원리', body: '고위험에 집중 투입, 저위험은 간소화 → 한정된 컴플라이언스 자원의 효율 극대화.' },
  { label: '3대 이점: 효율·유연·실효', body: '비용 절감(효율), 신규 위험 대응(유연), 선별적 보고로 FIU 역량 집중(실효).' },
  { label: 'FATF R.1 + 국내 법적 근거', body: '특금법 제5조의2(CDD 차등), 시행령 10조의5~7(분류 기준), FIU 가이드라인(실무).' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Rule-based side */}
              <ModuleBox x={20} y={15} w={180} h={44} label="규정 기반 (Rule)" sub="모든 고객 동일 기준" color={C.rule} />
              <rect x={30} y={75} width={50} height={22} rx={4} fill={`${C.rule}15`} stroke={C.rule} strokeWidth={0.7} />
              <text x={55} y={90} textAnchor="middle" fontSize={8} fill={C.rule}>고객 A</text>
              <rect x={90} y={75} width={50} height={22} rx={4} fill={`${C.rule}15`} stroke={C.rule} strokeWidth={0.7} />
              <text x={115} y={90} textAnchor="middle" fontSize={8} fill={C.rule}>고객 B</text>
              <rect x={150} y={75} width={50} height={22} rx={4} fill={`${C.rule}15`} stroke={C.rule} strokeWidth={0.7} />
              <text x={175} y={90} textAnchor="middle" fontSize={8} fill={C.rule}>고객 C</text>
              <text x={110} y={115} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">동일 CDD 수준</text>

              {/* Risk-based side */}
              <ModuleBox x={270} y={15} w={180} h={44} label="위험 기반 (RBA)" sub="위험에 비례 차등" color={C.risk} />
              <rect x={280} y={75} width={50} height={35} rx={4} fill={`${C.red}15`} stroke={C.red} strokeWidth={0.7} />
              <text x={305} y={90} textAnchor="middle" fontSize={8} fill={C.red}>고위험</text>
              <text x={305} y={102} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">EDD</text>
              <rect x={340} y={80} width={50} height={25} rx={4} fill={`${C.warn}15`} stroke={C.warn} strokeWidth={0.7} />
              <text x={365} y={96} textAnchor="middle" fontSize={8} fill={C.warn}>중위험</text>
              <rect x={400} y={85} width={50} height={18} rx={4} fill={`${C.risk}15`} stroke={C.risk} strokeWidth={0.7} />
              <text x={425} y={97} textAnchor="middle" fontSize={8} fill={C.risk}>저위험</text>
              <text x={365} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">차등 CDD 수준</text>

              {/* VS divider */}
              <text x={240} y={55} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">vs</text>

              {/* Bottom summary */}
              <rect x={100} y={145} width={280} height={30} rx={6} fill={`${C.risk}08`} stroke={C.risk} strokeWidth={0.5} />
              <text x={240} y={164} textAnchor="middle" fontSize={9} fill={C.risk}>
                FATF 2012: "위험에 상응하는 조치" → 규정 기반의 한계 해결
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Resource pool */}
              <ModuleBox x={170} y={10} w={140} h={36} label="컴플라이언스 자원" sub="인력·비용·시간" color={C.risk} />

              {/* High risk */}
              <ActionBox x={30} y={75} w={120} h={42} label="고위험 고객" sub="PEP, 제재국, 셸컴퍼니" color={C.red} />
              <Arrow x1={240} y1={46} x2={130} y2={75} color={C.red} />
              <text x={195} y={62} fontSize={8} fill={C.red} fontWeight={600}>자원 집중</text>

              {/* Medium risk */}
              <ActionBox x={180} y={75} w={120} h={42} label="중위험 고객" sub="법인, 비거주 외국인" color={C.warn} />
              <Arrow x1={240} y1={46} x2={240} y2={75} color={C.warn} />
              <text x={265} y={62} fontSize={8} fill={C.warn}>표준 CDD</text>

              {/* Low risk */}
              <ActionBox x={330} y={75} w={120} h={42} label="저위험 고객" sub="상장사, 정부기관" color={C.risk} />
              <Arrow x1={240} y1={46} x2={370} y2={75} color={C.risk} />
              <text x={330} y={62} fontSize={8} fill={C.risk}>간소화</text>

              {/* Thick bars showing resource allocation */}
              <rect x={50} y={130} width={80} height={10} rx={3} fill={C.red} opacity={0.6} />
              <rect x={200} y={130} width={50} height={10} rx={3} fill={C.warn} opacity={0.5} />
              <rect x={360} y={130} width={25} height={10} rx={3} fill={C.risk} opacity={0.4} />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                자원 배분 비율: 고위험 &gt; 중위험 &gt; 저위험
              </text>

              <rect x={80} y={175} width={320} height={28} rx={6} fill={`${C.risk}08`} stroke={C.risk} strokeWidth={0.5} />
              <text x={240} y={193} textAnchor="middle" fontSize={9} fill={C.risk}>
                "모든 고객을 같은 수준으로"가 아니라 "위험에 비례하는 수준으로"
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Three benefits */}
              <DataBox x={20} y={20} w={130} h={36} label="효율성" sub="Efficiency" color={C.risk} />
              <DataBox x={175} y={20} w={130} h={36} label="유연성" sub="Flexibility" color={C.warn} />
              <DataBox x={330} y={20} w={130} h={36} label="실효성" sub="Effectiveness" color={C.rule} />

              {/* Efficiency details */}
              <rect x={20} y={70} width={130} height={52} rx={5} fill={`${C.risk}08`} stroke={C.risk} strokeWidth={0.5} />
              <text x={85} y={86} textAnchor="middle" fontSize={8} fill={C.risk}>저위험 → 간소화 CDD</text>
              <text x={85} y={100} textAnchor="middle" fontSize={8} fill={C.risk}>고위험 → EDD 집중</text>
              <text x={85} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비용 절감</text>

              {/* Flexibility details */}
              <rect x={175} y={70} width={130} height={52} rx={5} fill={`${C.warn}08`} stroke={C.warn} strokeWidth={0.5} />
              <text x={240} y={86} textAnchor="middle" fontSize={8} fill={C.warn}>새 토큰·프로토콜 등장</text>
              <text x={240} y={100} textAnchor="middle" fontSize={8} fill={C.warn}>위험평가 주기 갱신</text>
              <text x={240} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">환경 변화 대응</text>

              {/* Effectiveness details */}
              <rect x={330} y={70} width={130} height={52} rx={5} fill={`${C.rule}08`} stroke={C.rule} strokeWidth={0.5} />
              <text x={395} y={86} textAnchor="middle" fontSize={8} fill={C.rule}>선별적 보고 유도</text>
              <text x={395} y={100} textAnchor="middle" fontSize={8} fill={C.rule}>FIU 분석 역량 집중</text>
              <text x={395} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">과잉보고 방지</text>

              {/* Bottom note */}
              <rect x={60} y={140} width={360} height={28} rx={6} fill={`${C.red}06`} stroke={C.red} strokeWidth={0.5} />
              <text x={240} y={158} textAnchor="middle" fontSize={9} fill={C.red}>
                defensive reporting(방어적 과잉 보고) 문제를 RBA로 해결
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* FATF R.1 */}
              <ModuleBox x={155} y={10} w={170} h={36} label="FATF 권고사항 R.1" sub="2012년 RBA 전면 도입" color={C.rule} />
              <Arrow x1={180} y1={46} x2={110} y2={68} color={C.rule} />
              <Arrow x1={240} y1={46} x2={240} y2={68} color={C.rule} />
              <Arrow x1={300} y1={46} x2={370} y2={68} color={C.rule} />

              {/* Three domestic laws */}
              <ActionBox x={30} y={70} w={140} h={44} label="특금법 제5조의2" sub="CDD 차등 적용 근거" color={C.risk} />
              <ActionBox x={185} y={70} w={110} h={44} label="시행령 10조의5~7" sub="고/저위험 분류 기준" color={C.warn} />
              <ActionBox x={310} y={70} w={140} h={44} label="FIU 가이드라인" sub="위험평가 실무 방법" color={C.rule} />

              {/* Flow to VASP */}
              <Arrow x1={100} y1={114} x2={200} y2={140} color={C.risk} />
              <Arrow x1={240} y1={114} x2={240} y2={140} color={C.warn} />
              <Arrow x1={380} y1={114} x2={280} y2={140} color={C.rule} />

              <ModuleBox x={160} y={140} w={160} h={40} label="VASP 위험평가 체계" sub="신고 심사 핵심 항목" color={C.red} />

              {/* Bottom insight */}
              <rect x={60} y={195} width={360} height={22} rx={4} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.5} strokeDasharray="3,3" />
              <text x={240} y={210} textAnchor="middle" fontSize={8.5} fill={C.red}>
                RBA 전제: 위험평가가 부실하면 고위험을 저위험으로 오분류 → 체계 자체가 통로
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
