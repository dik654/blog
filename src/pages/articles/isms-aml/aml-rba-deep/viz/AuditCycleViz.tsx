import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { qtr: '#3b82f6', audit: '#6366f1', fix: '#10b981', red: '#ef4444', warn: '#f59e0b' };

const STEPS = [
  { label: '분기별 자체 점검 (2선)', body: 'CCO가 분기마다 CDD 이행률, STR 적시성, FDS 오탐률, 교육 이수율 점검.' },
  { label: '연 1회 외부 감사 (3선)', body: '독립적 외부 전문가가 CDD·STR·FDS·위험평가·교육·기록보관을 객관 평가.' },
  { label: '지적사항 사후관리', body: '지적 등급별 개선 기한(30/60/90일). 미이행 시 자동 에스컬레이션. 2회 반복 시 근본원인 분석.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ac-arrow)" />;
}

export default function AuditCycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ac-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.qtr}>분기별 의무이행 점검 (2선)</text>
              <ModuleBox x={150} y={25} w={180} h={36} label="CCO / 보고책임자" sub="분기 1회 자체 점검" color={C.qtr} />
              {/* KPIs */}
              {[
                { label: 'CDD 이행률', sub: '100% 목표', x: 10 },
                { label: 'EDD 적시성', sub: '기한 내 완료', x: 105 },
                { label: 'STR 3영업일', sub: '법정 기한', x: 200 },
                { label: 'FDS 오탐률', sub: '추이 개선', x: 295 },
                { label: '교육 이수율', sub: '100% 이수', x: 390 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + 0.1 * i }}>
                  <Arrow x1={240} y1={61} x2={item.x + 40} y2={80} color={C.qtr} />
                  <DataBox x={item.x} y={82} w={82} h={36} label={item.label} sub={item.sub} color={C.qtr} />
                </motion.g>
              ))}
              <StatusBox x={130} y={138} w={220} h={34} label="분기 점검 완료" sub="미흡 사항 시정 조치 요구" color={C.qtr} progress={1} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.audit}>연 1회 외부 감사</text>
              <ModuleBox x={140} y={25} w={200} h={36} label="외부 감사인" sub="독립성 + 전문성 + 자격" color={C.audit} />
              {/* Audit areas */}
              {[
                { label: 'CDD 이행', x: 10 },
                { label: 'STR 보고', x: 90 },
                { label: 'FDS 운영', x: 170 },
                { label: '위험평가', x: 250 },
                { label: '교육', x: 330 },
                { label: '기록보관', x: 410 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                  <Arrow x1={240} y1={61} x2={item.x + 30} y2={78} color={C.audit} />
                  <ActionBox x={item.x} y={80} w={68} h={30} label={item.label} sub="" color={C.audit} />
                </motion.g>
              ))}
              {/* Method */}
              <text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                방법: 무작위 샘플링(30건+) + 고위험 전수 검사 + FIU 접수 확인서 대조
              </text>
              {/* Criteria */}
              <rect x={40} y={140} width={400} height={30} rx={5} fill={`${C.audit}08`} stroke={C.audit} strokeWidth={0.5} />
              <text x={240} y={153} textAnchor="middle" fontSize={8} fill={C.audit}>감사인 선정: 이해관계 없음 + AML 경험 + CAMS 인증 + 동일인 3년 시 교체</text>
              <text x={240} y={166} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">설계 적정성 + 운영 효과성 = 두 가지 평가 축</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">지적사항 에스컬레이션</text>
              {/* Three tiers */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <rect x={20} y={30} width={130} height={42} rx={5} fill={`${C.red}12`} stroke={C.red} strokeWidth={0.7} />
                <text x={85} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>중대 (Critical)</text>
                <text x={85} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">30일 이내</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <rect x={170} y={30} width={130} height={42} rx={5} fill={`${C.warn}12`} stroke={C.warn} strokeWidth={0.7} />
                <text x={235} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>주요 (Major)</text>
                <text x={235} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">60일 이내</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <rect x={320} y={30} width={130} height={42} rx={5} fill={`${C.fix}12`} stroke={C.fix} strokeWidth={0.7} />
                <text x={385} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fix}>경미 (Minor)</text>
                <text x={385} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">90일 이내</text>
              </motion.g>
              {/* Escalation */}
              <Arrow x1={85} y1={72} x2={85} y2={95} color={C.red} />
              <Arrow x1={235} y1={72} x2={235} y2={95} color={C.warn} />
              <Arrow x1={385} y1={72} x2={385} y2={95} color={C.fix} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <DataBox x={20} y={98} w={130} h={26} label="이사회 긴급 보고" color={C.red} />
                <DataBox x={170} y={98} w={130} h={26} label="위원회 보고" color={C.warn} />
                <DataBox x={320} y={98} w={130} h={26} label="CCO 보고" color={C.fix} />
              </motion.g>
              {/* Repeat warning */}
              <AlertBox x={60} y={140} w={360} h={38} label="동일 지적 2회 반복 = 체계적 미흡" sub="근본원인 분석(Root Cause Analysis) → 단순 보완이 아닌 프로세스 재설계" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
