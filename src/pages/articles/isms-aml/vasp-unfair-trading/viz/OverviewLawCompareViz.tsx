import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  stock: '#6366f1',
  crypto: '#f59e0b',
  diff: '#ef4444',
};

const STEPS = [
  { label: '규제 대상 비교', body: '자본시장법은 상장 증권, 가상자산이용자보호법은 가상자산을 대상으로 한다. 규제 체계는 유사하나 적용 영역이 다르다.' },
  { label: '거래 환경 차이', body: '주식은 정규장 6시간+상하한가 30%. 가상자산은 24/365+변동 폭 무제한. 이 차이가 감시 체계 설계에 직접 영향을 준다.' },
  { label: '감시 기관과 추가 규제', body: '주식은 거래소 시장감시위+금감원. 가상자산은 금융위+금감원. 가상자산만의 추가 규제: 자기발행 가상자산 거래 제한.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#olc-arrow)" />;
}

export default function OverviewLawCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="olc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={40} y={20} w={170} h={50} label="자본시장법" sub="상장 증권 규제" color={C.stock} />
              <ModuleBox x={270} y={20} w={170} h={50} label="가상자산이용자보호법" sub="가상자산 규제" color={C.crypto} />
              <Arrow x1={210} y1={45} x2={268} y2={45} color="var(--muted-foreground)" />
              <text x={240} y={42} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">체계 차용</text>

              <Arrow x1={125} y1={70} x2={125} y2={100} color={C.stock} />
              <Arrow x1={355} y1={70} x2={355} y2={100} color={C.crypto} />

              <DataBox x={55} y={105} w={140} h={30} label="주식 / 채권 / 파생상품" color={C.stock} />
              <DataBox x={285} y={105} w={140} h={30} label="BTC / ETH / 토큰 전반" color={C.crypto} />

              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">동일한 3대 금지 유형: 미공개정보 이용 / 시세조종 / 부정거래</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">거래 환경 비교</text>

              <ActionBox x={30} y={35} w={190} h={40} label="주식: 정규장 6시간" sub="상하한가 30% 제한" color={C.stock} />
              <ActionBox x={260} y={35} w={190} h={40} label="가상자산: 24시간 365일" sub="변동 폭 무제한" color={C.crypto} />

              <Arrow x1={125} y1={75} x2={125} y2={100} color={C.stock} />
              <Arrow x1={355} y1={75} x2={355} y2={100} color={C.diff} />

              <DataBox x={45} y={105} w={160} h={28} label="감시 인력 집중 가능" color={C.stock} />
              <DataBox x={275} y={105} w={160} h={28} label="자동화 감시 필수" color={C.diff} />

              <text x={240} y={165} textAnchor="middle" fontSize={9} fill={C.diff}>상하한가 없음 → 수시간 만에 10배 폭등 후 폭락 가능</text>
              <text x={240} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">시세조종 효과가 주식보다 극단적</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">감시 체계와 추가 규제</text>

              <ModuleBox x={30} y={35} w={190} h={45} label="주식 감시" sub="거래소 시장감시위 + 금감원" color={C.stock} />
              <ModuleBox x={260} y={35} w={190} h={45} label="가상자산 감시" sub="금융위 + 금감원" color={C.crypto} />

              <Arrow x1={355} y1={80} x2={355} y2={105} color={C.diff} />

              <rect x={250} y={108} width={210} height={40} rx={6} fill={`${C.diff}10`} stroke={C.diff} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={265} y={125} fontSize={9} fontWeight={600} fill={C.diff}>추가 규제</text>
              <text x={265} y={140} fontSize={8} fill="var(--muted-foreground)">자기발행 가상자산 매매 중개 금지</text>

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">가상자산의 이해상충 위험(발행+거래 동시 운영)을 차단</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
