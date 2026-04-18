import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { cust: '#ef4444', prod: '#f59e0b', geo: '#6366f1', chan: '#3b82f6', ok: '#10b981' };

const STEPS = [
  { label: '4가지 위험 범주', body: '고객·상품·지역·채널 — 위험 식별의 4축. 각 축에서 고위험 요소를 찾아낸다.' },
  { label: '고객 + 상품 위험', body: 'PEP·셸컴퍼니·제재국 국적자(고객), 프라이버시 코인·OTC·브릿지(상품).' },
  { label: '지역 + 채널 위험', body: 'FATF 고위험 관할권(지역), 비대면 서비스 구조적 위험(채널). VASP는 채널 위험이 높다.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rc-arrow)" />;
}

export default function RiskCategoriesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">위험 식별 4축</text>
              <ModuleBox x={170} y={28} w={140} h={34} label="위험 식별" sub="Risk Identification" color={C.cust} />
              <Arrow x1={200} y1={62} x2={85} y2={85} color={C.cust} />
              <Arrow x1={220} y1={62} x2={195} y2={85} color={C.prod} />
              <Arrow x1={260} y1={62} x2={300} y2={85} color={C.geo} />
              <Arrow x1={280} y1={62} x2={405} y2={85} color={C.chan} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={20} y={88} w={130} h={40} label="고객 위험" sub="Customer Risk" color={C.cust} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={160} y={88} w={130} h={40} label="상품 위험" sub="Product Risk" color={C.prod} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={245} y={88} w={130} h={40} label="지역 위험" sub="Geographic Risk" color={C.geo} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={330} y={88} w={130} h={40} label="채널 위험" sub="Channel Risk" color={C.chan} />
              </motion.g>
              <rect x={60} y={148} width={360} height={26} rx={5} fill={`${C.cust}06`} stroke={C.cust} strokeWidth={0.5} />
              <text x={240} y={165} textAnchor="middle" fontSize={9} fill={C.cust}>4축 종합 → 위험 매트릭스 구성의 기반</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Customer risk */}
              <ModuleBox x={20} y={10} w={210} h={36} label="고객 위험 (Customer)" sub="유형별 위험 수준" color={C.cust} />
              <DataBox x={25} y={58} w={95} h={28} label="PEP (정치인)" color={C.cust} />
              <DataBox x={125} y={58} w={100} h={28} label="셸컴퍼니" color={C.cust} />
              <text x={120} y={102} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                실제소유자 파악 난이도 = 위험의 핵심
              </text>

              {/* Product risk */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={250} y={10} w={210} h={36} label="상품 위험 (Product)" sub="익명성·추적 난이도" color={C.prod} />
                <DataBox x={255} y={58} w={95} h={28} label="프라이버시 코인" color={C.prod} />
                <DataBox x={355} y={58} w={100} h={28} label="OTC / 브릿지" color={C.prod} />
                <text x={355} y={102} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  신규 상품 = 초기 고위험 분류 원칙
                </text>
              </motion.g>

              <AlertBox x={80} y={118} w={320} h={40} label="고위험 조합 예시" sub="PEP + 프라이버시 코인 + OTC = 위험 극대화 → EDD + 경영진 승인 필수" color={C.cust} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Geographic */}
              <ModuleBox x={20} y={10} w={210} h={36} label="지역 위험 (Geographic)" sub="FATF 관할권 목록 기반" color={C.geo} />
              <rect x={25} y={58} width={60} height={24} rx={4} fill={`${C.cust}15`} stroke={C.cust} strokeWidth={0.6} />
              <text x={55} y={74} textAnchor="middle" fontSize={7.5} fill={C.cust}>이란·북한</text>
              <rect x={90} y={58} width={65} height={24} rx={4} fill={`${C.prod}15`} stroke={C.prod} strokeWidth={0.6} />
              <text x={122} y={74} textAnchor="middle" fontSize={7.5} fill={C.prod}>회색목록</text>
              <rect x={160} y={58} width={65} height={24} rx={4} fill={`${C.ok}15`} stroke={C.ok} strokeWidth={0.6} />
              <text x={192} y={74} textAnchor="middle" fontSize={7.5} fill={C.ok}>FATF 회원</text>
              <text x={120} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">counter-measures 촉구 국가가 최고 위험</text>

              {/* Channel */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={250} y={10} w={210} h={36} label="채널 위험 (Channel)" sub="접촉 방식별 위험" color={C.chan} />
                <rect x={260} y={58} width={90} height={24} rx={4} fill={`${C.cust}15`} stroke={C.cust} strokeWidth={0.6} />
                <text x={305} y={74} textAnchor="middle" fontSize={7.5} fill={C.cust}>비대면 (높음)</text>
                <rect x={360} y={58} width={90} height={24} rx={4} fill={`${C.ok}15`} stroke={C.ok} strokeWidth={0.6} />
                <text x={405} y={74} textAnchor="middle" fontSize={7.5} fill={C.ok}>대면 (낮음)</text>
                <text x={355} y={98} textAnchor="middle" fontSize={8} fill={C.chan}>VASP = 구조적으로 비대면</text>
              </motion.g>

              <rect x={60} y={118} width={360} height={30} rx={5} fill={`${C.chan}08`} stroke={C.chan} strokeWidth={0.5} />
              <text x={240} y={131} textAnchor="middle" fontSize={8.5} fill={C.chan}>VASP 채널 위험 보완: eKYC + 안면인식 + 실명 계좌 연동</text>
              <text x={240} y={144} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">보완 통제로 채널 위험을 낮출 수 있다</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
