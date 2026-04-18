import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  fatf: '#6366f1',
  law: '#10b981',
  vasp: '#f59e0b',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: 'FATF R.10 → 특금법 제5조의2',
    body: 'FATF 권고사항 R.10이 CDD 국제 기준을 제시. 한국 특금법 제5조의2가 이를 국내법으로 구현.',
  },
  {
    label: 'VASP CDD가 국가 리스크로 확대',
    body: 'VASP 차원의 CDD 부실이 FATF 상호평가에서 국가 불이행 판정으로 이어질 수 있다.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cdd-legal-arrow)" />;
}

export default function CddLegalFrameworkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cdd-legal-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 법적 체계: 국제 → 국내</text>

              <ModuleBox x={30} y={35} w={130} h={50} label="FATF R.10" sub="CDD 국제 기준" color={C.fatf} />
              <Arrow x1={160} y1={60} x2={190} y2={60} color={C.fatf} />

              <ActionBox x={193} y={38} w={130} h={45} label="특금법 제5조의2" sub="국내법 구현" color={C.law} />
              <Arrow x1={323} y1={60} x2={353} y2={60} color={C.law} />

              <ModuleBox x={356} y={35} w={100} h={50} label="VASP 적용" sub="2021.03 시행" color={C.vasp} />

              {/* 하단: 확장 적용 */}
              <rect x={30} y={105} width={426} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={40} y={115} w={140} h={28} label="은행 + 증권사" color={C.law} />
              <text x={200} y={132} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">+</text>
              <DataBox x={220} y={115} w={140} h={28} label="가상자산사업자" color={C.vasp} />
              <text x={380} y={132} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">(2021~)</text>

              <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">VASP도 금융회사와 동일한 수준의 고객확인의무 이행</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 부실의 파급 경로</text>

              <ActionBox x={170} y={35} w={140} h={38} label="VASP CDD 부실" sub="미이행·형식적 수행" color={C.warn} />
              <Arrow x1={240} y1={73} x2={240} y2={90} color={C.warn} />

              <AlertBox x={155} y={93} w={170} h={35} label="FIU 검사 시 적발" sub="과태료·영업정지·신고취소" color={C.warn} />
              <Arrow x1={240} y1={128} x2={240} y2={143} color={C.warn} />

              <AlertBox x={120} y={146} w={240} h={40} label="FATF 상호평가 불이행 판정" sub="국가 전체의 국제 금융거래 제약" color={C.warn} />

              <text x={70} y={110} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">VASP 단위</text>
              <text x={70} y={163} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">국가 단위</text>

              <Arrow x1={80} y1={115} x2={80} y2={155} color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
