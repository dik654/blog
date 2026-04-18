import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  pia: '#6366f1',
  isms: '#10b981',
  both: '#3b82f6',
  highlight: '#f59e0b',
};

const STEPS = [
  { label: 'PIA vs ISMS-P 심사: 5가지 차이', body: '시점(사전 vs 사후), 범위(특정 시스템 vs 조직 전체), 목적(위험 분석 vs 적합성 검증), 수행 주체(내부/외부 vs 인증기관), 결과(영향평가서 vs 적합/부적합).' },
  { label: '상호보완 관계와 VASP 권장 사항', body: 'PIA는 새 시스템 도입 시 위험 사전 제거, ISMS-P는 운영 중 관리체계 지속 검증. 양쪽 모두 수행하여 개인정보 보호 전체 생명주기를 관리하는 것이 이상적.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#pc-inline-arrow)" />;
}

export default function PIAComparisonInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pc-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">PIA vs ISMS-P 심사</text>

              {/* 헤더 */}
              <text x={160} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pia}>PIA (영향평가)</text>
              <text x={370} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.isms}>ISMS-P 심사</text>

              {/* 5행 비교 */}
              <text x={15} y={58} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">시점</text>
              <DataBox x={60} y={44} w={200} h={22} label="시스템 구축·변경 전" color={C.pia} />
              <DataBox x={270} y={44} w={200} h={22} label="운영 중 (연 1회 사후)" color={C.isms} />

              <text x={15} y={80} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">범위</text>
              <DataBox x={60} y={70} w={200} h={22} label="특정 시스템 또는 사업" color={C.pia} />
              <DataBox x={270} y={70} w={200} h={22} label="조직 전체 (인증 범위)" color={C.isms} />

              <text x={15} y={106} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">목적</text>
              <DataBox x={60} y={96} w={200} h={22} label="침해 위험 사전 분석" color={C.pia} />
              <DataBox x={270} y={96} w={200} h={22} label="관리체계 적합성 검증" color={C.isms} />

              <text x={15} y={132} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">주체</text>
              <DataBox x={60} y={122} w={200} h={22} label="내부 또는 외부 평가기관" color={C.pia} />
              <DataBox x={270} y={122} w={200} h={22} label="KISA/인증기관 심사원" color={C.isms} />

              <text x={15} y={158} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">결과</text>
              <DataBox x={60} y={148} w={200} h={22} label="영향평가서, 개선 계획" color={C.pia} />
              <DataBox x={270} y={148} w={200} h={22} label="적합/부적합, 결함 보고서" color={C.isms} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                PIA = 사전 위험 분석, ISMS-P = 사후 관리체계 검증
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.both}>PIA + ISMS-P = 전체 생명주기 관리</text>

              {/* 타임라인 */}
              <line x1={30} y1={55} x2={450} y2={55} stroke="var(--border)" strokeWidth={1.5} />

              {/* PIA 영역 */}
              <rect x={40} y={35} width={160} height={40} rx={4} fill={C.pia} opacity={0.1} stroke={C.pia} strokeWidth={1} />
              <text x={120} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pia}>PIA</text>
              <text x={120} y={62} textAnchor="middle" fontSize={7} fill={C.pia}>시스템 구축 단계</text>

              {/* ISMS-P 영역 */}
              <rect x={240} y={35} width={200} height={40} rx={4} fill={C.isms} opacity={0.1} stroke={C.isms} strokeWidth={1} />
              <text x={340} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.isms}>ISMS-P 심사</text>
              <text x={340} y={62} textAnchor="middle" fontSize={7} fill={C.isms}>운영 중 (연 1회+)</text>

              {/* 시점 마커 */}
              <circle cx={120} cy={55} r={4} fill={C.pia} />
              <circle cx={280} cy={55} r={4} fill={C.isms} />
              <circle cx={380} cy={55} r={4} fill={C.isms} />

              <Arrow x1={200} y1={55} x2={238} y2={55} color={C.both} />

              {/* 상호보완 */}
              <line x1={15} y1={90} x2={465} y2={90} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <StatusBox x={30} y={98} w={190} h={40} label="PIA: 사전 위험 제거" sub="새 시스템 도입 시" color={C.pia} />
              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.both}>+</text>
              <StatusBox x={260} y={98} w={190} h={40} label="ISMS-P: 지속 적합성" sub="운영 중 관리체계 검증" color={C.isms} />

              <text x={240} y={160} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.highlight}>
                양쪽 모두 수행 → 개인정보 보호 전체 생명주기 관리
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                민간 VASP: PIA 법적 의무 아니지만, ISMS-P 3.x 적합 판정에 유리
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
