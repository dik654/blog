import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  place: '#6366f1',
  layer: '#f59e0b',
  integrate: '#10b981',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '자금세탁 3단계: 가상자산 경로',
    body: '배치(범죄수익→가상자산 매수) → 계층화(믹서·크로스체인·DEX) → 통합(거래소에서 원화 환전).',
  },
  {
    label: '패턴 조합의 위험도 산정',
    body: '단일 패턴은 오탐이 많다. 복수 패턴 동시 매칭으로 위험도 상승 — 이 조합 로직이 FDS의 핵심 경쟁력.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#launder-path-arrow)" />;
}

export default function LaunderingPathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="launder-path-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">가상자산 자금세탁 3단계</text>

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={15} y={35} w={130} h={55} label="1. 배치(Placement)" sub="범죄수익 → 가상자산 매수" color={C.place} />
              </motion.g>
              <Arrow x1={145} y1={62} x2={170} y2={62} color={C.place} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <ActionBox x={173} y={35} w={140} h={55} label="2. 계층화(Layering)" sub="믹서·브릿지·DEX 경유" color={C.layer} />
              </motion.g>
              <Arrow x1={313} y1={62} x2={338} y2={62} color={C.layer} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={341} y={35} w={125} h={55} label="3. 통합(Integration)" sub="원화/스테이블코인 환전" color={C.integrate} />
              </motion.g>

              {/* 가상자산 특유 도구들 */}
              <rect x={173} y={100} width={140} height={1} stroke={C.layer} strokeWidth={0.5} strokeDasharray="3 2" />
              <DataBox x={173} y={108} w={65} h={25} label="Tornado" color={C.layer} />
              <DataBox x={248} y={108} w={65} h={25} label="크로스체인" color={C.layer} />
              <DataBox x={173} y={140} w={65} h={25} label="프라이버시" color={C.layer} />
              <DataBox x={248} y={140} w={65} h={25} label="P2P/OTC" color={C.layer} />

              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">약 80%가 중개 지갑·여러 홉 경유 → 그래프 분석 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">패턴 조합 위험도 산정</text>

              {/* 단일 패턴들 */}
              <DataBox x={30} y={40} w={100} h={28} label="신규 고액(P8)" color={C.place} />
              <DataBox x={150} y={40} w={100} h={28} label="빠른 이동(P2)" color={C.layer} />
              <DataBox x={270} y={40} w={120} h={28} label="믹서 경유(P5)" color={C.warn} />

              {/* 단일 → 오탐 */}
              <Arrow x1={80} y1={68} x2={80} y2={85} color={C.place} />
              <text x={80} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">단독: 오탐 가능</text>

              {/* 조합 → 고위험 */}
              <Arrow x1={80} y1={108} x2={180} y2={125} color={C.warn} />
              <Arrow x1={200} y1={68} x2={220} y2={125} color={C.warn} />
              <Arrow x1={330} y1={68} x2={260} y2={125} color={C.warn} />

              <AlertBox x={140} y={128} w={200} h={42} label="3패턴 동시 매칭" sub="최고 등급 경보 발생" color={C.warn} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">조합 로직 = FDS 핵심 경쟁력. AI 모델이 자동 학습하는 영역</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
