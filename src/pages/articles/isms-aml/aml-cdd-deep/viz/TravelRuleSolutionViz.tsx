import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  send: '#6366f1',
  recv: '#10b981',
  proto: '#f59e0b',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: 'Travel Rule 정보 교환 흐름',
    body: '송신 VASP → off-chain 메시징(CODE/TRISA) → 수신 VASP. 블록체인 TX에는 실명 불포함 → 별도 채널 필요.',
  },
  {
    label: '미신고 VASP·개인 지갑 대응',
    body: '미신고 VASP: 출금 차단 또는 추가 확인. 개인 지갑: 소유권 증명(마이크로 트랜잭션·서명 검증) 후 허용.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tr-sol-arrow)" />;
}

export default function TravelRuleSolutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tr-sol-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Travel Rule 정보 교환 구조</text>

              <ModuleBox x={20} y={35} w={120} h={50} label="송신 VASP" sub="송신인 정보 보유" color={C.send} />
              <ModuleBox x={340} y={35} w={120} h={50} label="수신 VASP" sub="수신인 정보 보유" color={C.recv} />

              {/* 상단: 블록체인 TX */}
              <Arrow x1={140} y1={50} x2={340} y2={50} color="var(--muted-foreground)" />
              <text x={240} y={45} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">블록체인 TX (주소만, 실명 없음)</text>

              {/* 하단: Off-chain 메시징 */}
              <Arrow x1={140} y1={72} x2={340} y2={72} color={C.proto} />
              <rect x={160} y={63} width={160} height={18} rx={4} fill="var(--card)" stroke={C.proto} strokeWidth={0.8} />
              <text x={240} y={75} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.proto}>Off-chain: CODE / TRISA</text>

              {/* 전송 정보 */}
              <rect x={40} y={105} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={40} y={115} w={90} h={28} label="송신인 성명" color={C.send} />
              <DataBox x={145} y={115} w={90} h={28} label="지갑 주소" color={C.send} />
              <DataBox x={250} y={115} w={90} h={28} label="수신인 성명" color={C.recv} />
              <DataBox x={355} y={115} w={90} h={28} label="지갑 주소" color={C.recv} />

              <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">100만 원 이상 이전 시 적용 (한국 기준)</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Travel Rule 적용 불가 대상 대응</text>

              {/* 미신고 VASP */}
              <AlertBox x={20} y={35} w={200} h={45} label="미신고 VASP" sub="정보 수신 주체 미확인" color={C.warn} />
              <Arrow x1={220} y1={57} x2={250} y2={57} color={C.warn} />
              <ActionBox x={253} y={38} w={200} h={40} label="출금 차단 또는 추가 확인" sub="출금목적 소명·수신자 확인" color={C.warn} />

              {/* 개인 지갑 */}
              <AlertBox x={20} y={100} w={200} h={45} label="개인 지갑 (Unhosted)" sub="사업자가 존재하지 않음" color={C.proto} />
              <Arrow x1={220} y1={122} x2={250} y2={122} color={C.proto} />
              <ActionBox x={253} y={103} w={200} h={40} label="소유권 증명 후 허용" sub="마이크로 TX · 서명 검증" color={C.recv} />

              <rect x={20} y={163} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={183} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">DeFi 프로토콜: "정보 수신 사업자" 부재 → 구조적 적용 한계</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
