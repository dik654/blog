import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'AA 활용 사례', body: '소셜 로그인, 세션 키, 배치 TX, 가스 대납 — 스마트 컨트랙트 계정으로 모두 구현 가능.' },
  { label: '소셜 로그인 (Passkey)', body: '생체 인증 → P-256 서명 → validateUserOp(). 시드 구문 없이 지갑 생성/사용.' },
  { label: '세션 키', body: '임시 키 발급, 유효 기간/함수/한도 제한. 게임, DeFi 자동화에 적합.' },
  { label: '배치 TX + Paymaster', body: 'approve+swap을 1 UserOp로 묶기. Paymaster가 가스 대납. Web2 수준 UX.' },
];

const CASES = [
  { label: 'Passkey', sub: 'Face ID / 지문', x: 40, color: C1 },
  { label: '세션 키', sub: '임시 권한 위임', x: 155, color: C2 },
  { label: '배치 TX', sub: 'approve+swap', x: 270, color: C3 },
  { label: 'Paymaster', sub: '가스 대납', x: 380, color: C2 },
];

export default function UseCaseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Smart Account center */}
          <rect x={150} y={10} width={120} height={24} rx={5} fill={`${C1}10`} stroke={C1} strokeWidth={0.8} />
          <text x={210} y={26} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>Smart Account</text>
          {/* Use case cards */}
          {CASES.map((c, i) => {
            const active = (step === 1 && i === 0) || (step === 2 && i === 1) ||
              (step === 3 && i >= 2) || step === 0;
            return (
              <motion.g key={c.label} animate={{ opacity: active ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}>
                {/* Connection line */}
                <line x1={210} y1={34} x2={c.x} y2={50} stroke={c.color} strokeWidth={0.5}
                  opacity={active ? 0.5 : 0.15} />
                <rect x={c.x - 40} y={50} width={80} height={45} rx={5}
                  fill={`${c.color}${active ? '10' : '05'}`}
                  stroke={c.color} strokeWidth={active ? 1.2 : 0.5} />
                <text x={c.x} y={68} textAnchor="middle" fontSize={10} fontWeight={500} fill={c.color}>
                  {c.label}
                </text>
                <text x={c.x} y={83} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                  {c.sub}
                </text>
              </motion.g>
            );
          })}
          {/* Detail for active step */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={60} y={105} width={300} height={18} rx={4} fill={`${step === 1 ? C1 : step === 2 ? C2 : C3}08`}
                stroke={step === 1 ? C1 : step === 2 ? C2 : C3} strokeWidth={0.6} />
              <text x={210} y={117} textAnchor="middle" fontSize={10} fill={step === 1 ? C1 : step === 2 ? C2 : C3}>
                {step === 1 ? 'WebAuthn P-256 서명 → validateUserOp()' :
                  step === 2 ? '유효 기간 + 함수 화이트리스트 + 지출 한도' :
                    'executeBatch([approve, swap]) + Paymaster 가스 대납'}
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
