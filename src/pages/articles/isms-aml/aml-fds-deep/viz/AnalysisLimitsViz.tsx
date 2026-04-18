import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  defi: '#6366f1',
  bridge: '#f59e0b',
  privacy: '#ef4444',
  l2: '#10b981',
};

const STEPS = [
  {
    label: '블록체인 분석의 5가지 한계',
    body: 'DeFi(KYC 없음), 크로스체인(연결 단절), 프라이버시 코인(암호화), L2(오프체인), P2P(거래소 미경유).',
  },
  {
    label: '한계 극복 방향',
    body: '컨트랙트 레벨 분석, 멀티체인 통합, 프라이버시 코인 입출금 차단, L2 인덱싱, P2P 규제 강화.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#anal-lim-arrow)" />;
}

export default function AnalysisLimitsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="anal-lim-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">블록체인 분석 한계 5영역</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <AlertBox x={15} y={35} w={85} h={50} label="DeFi" sub="KYC 없는 거래" color={C.defi} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <AlertBox x={115} y={35} w={85} h={50} label="크로스체인" sub="연결 단절" color={C.bridge} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <AlertBox x={215} y={35} w={85} h={50} label="프라이버시" sub="암호화 차단" color={C.privacy} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <AlertBox x={315} y={35} w={70} h={50} label="L2" sub="오프체인" color={C.l2} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <AlertBox x={400} y={35} w={70} h={50} label="P2P" sub="미경유" color={C.defi} />
              </motion.g>

              <rect x={15} y={105} width={455} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">공통 원인: 추적 단절</text>
              <text x={240} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 한계의 본질 — 주소 간 연결 고리가 끊기거나 암호화되는 것</text>
              <text x={240} y={158} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">세탁 경로가 이 한계 영역으로 우회하는 현상 증가</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">한계 극복 방향</text>

              <AlertBox x={15} y={35} w={80} h={38} label="DeFi" sub="" color={C.defi} />
              <Arrow x1={95} y1={54} x2={115} y2={54} color={C.defi} />
              <ActionBox x={118} y={36} w={140} h={36} label="컨트랙트 레벨 분석" sub="프로토콜별 디코딩" color={C.defi} />

              <AlertBox x={15} y={83} w={80} h={38} label="크로스체인" sub="" color={C.bridge} />
              <Arrow x1={95} y1={102} x2={115} y2={102} color={C.bridge} />
              <ActionBox x={118} y={84} w={140} h={36} label="멀티체인 통합 분석" sub="브릿지 모니터링" color={C.bridge} />

              <AlertBox x={280} y={35} w={80} h={38} label="프라이버시" sub="" color={C.privacy} />
              <Arrow x1={360} y1={54} x2={380} y2={54} color={C.privacy} />
              <ActionBox x={383} y={36} w={85} h={36} label="입출금 차단" sub="상장폐지" color={C.privacy} />

              <AlertBox x={280} y={83} w={80} h={38} label="L2/P2P" sub="" color={C.l2} />
              <Arrow x1={360} y1={102} x2={380} y2={102} color={C.l2} />
              <ActionBox x={383} y={84} w={85} h={36} label="전용 인덱싱" sub="규제 강화" color={C.l2} />

              <rect x={15} y={140} width={453} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <DataBox x={100} y={150} w={280} h={30} label="2개 이상 도구 병행 교차 검증 = 최선 관행" color={C.defi} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
