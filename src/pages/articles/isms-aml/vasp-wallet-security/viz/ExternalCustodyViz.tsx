import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  vasp: '#6366f1',
  custody: '#10b981',
  check: '#f59e0b',
  risk: '#ef4444',
};

const STEPS = [
  { label: 'HSM과 에어갭 서명 절차', body: 'HSM: 내부에서 키 생성+서명 → 키가 장치 밖으로 나오지 않음. 에어갭: USB/QR로 서명 요청 전달, 서명만 반출. 네트워크 카드 물리 제거.' },
  { label: '외부 수탁 평가와 재위탁 금지', body: '수탁업체 사전 평가(보관비율/Multi-sig/대응절차). 이해상충 방지 계약. 재위탁 원칙 금지. 매년 보안감사+사고이력+재무건전성 재평가.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ecv-arrow)" />;
}

export default function ExternalCustodyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ecv-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">콜드월렛 서명 방식: HSM vs 에어갭</text>

              {/* HSM */}
              <ModuleBox x={20} y={30} w={200} h={50} label="HSM (하드웨어 보안 모듈)" sub="FIPS 140-2 Level 3+" color={C.vasp} />
              <DataBox x={25} y={92} w={190} h={25} label="키 생성+서명 = 장치 내부에서 완결" color={C.vasp} />
              <text x={120} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">탐침(tamper) 시 키 자동 삭제</text>
              <text x={120} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">장치 분해해도 복원 불가</text>

              {/* Air-gap */}
              <ModuleBox x={260} y={30} w={200} h={50} label="에어갭 컴퓨터" sub="네트워크 카드 물리 제거" color={C.custody} />

              <ActionBox x={268} y={92} w={85} h={28} label="USB/QR" sub="서명 요청 전달" color={C.custody} />
              <Arrow x1={353} y1={106} x2={373} y2={106} color={C.custody} />
              <ActionBox x={375} y={92} w={78} h={28} label="서명 결과" sub="반출" color={C.custody} />

              <text x={360} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">원격 공격 경로 원천 차단</text>

              <rect x={20} y={155} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">두 방식 모두 "키가 장치 밖으로 나오지 않는다"가 핵심 원칙</text>
              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">물리적 안전장소(금고, 내화금고) + CCTV + 출입 로그 이중 관리</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">외부 수탁 통제 체계</text>

              <ModuleBox x={30} y={30} w={100} h={40} label="VASP" sub="위탁자" color={C.vasp} />
              <Arrow x1={130} y1={50} x2={178} y2={50} color={C.vasp} />
              <ModuleBox x={180} y={30} w={120} h={40} label="수탁업체" sub="자산 보관 대행" color={C.custody} />

              <AlertBox x={330} y={27} w={130} h={46} label="재위탁 금지" sub="통제 체인 길어짐 방지" color={C.risk} />

              {/* Evaluation items */}
              <Arrow x1={240} y1={70} x2={240} y2={88} color={C.check} />

              <rect x={40} y={90} width={400} height={52} rx={6} fill={`${C.check}08`} stroke={C.check} strokeWidth={0.6} />
              <text x={50} y={108} fontSize={9} fontWeight={600} fill={C.check}>사전 평가 항목</text>
              <text x={50} y={122} fontSize={8} fill="var(--muted-foreground)">콜드 보관 비율 / Multi-sig 적용 / 침해사고 대응 절차</text>
              <text x={50} y={134} fontSize={8} fill="var(--muted-foreground)">이해상충 방지(수탁 자산 자기거래/담보 제공 금지)</text>

              <DataBox x={40} y={155} w={190} h={28} label="매년 재평가: 보안감사+사고이력" color={C.check} />
              <DataBox x={250} y={155} w={190} h={28} label="기준 미달 시 수탁 계약 해지" color={C.risk} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
