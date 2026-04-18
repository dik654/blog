import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  access: '#6366f1',
  auth: '#10b981',
  least: '#f59e0b',
  danger: '#ef4444',
};

const STEPS = [
  { label: 'VPN + MFA + 최소권한 체계', body: 'VPN 연결 → MFA 통과 → 최소권한 적용. 세 겹의 인증 벽. 퇴직자 즉시 비활성화, 부서 이동 시 권한 재검토.' },
  { label: '3선 방어 조직 구조', body: '1선(현업 업무 수행) → 2선(CISO 보안/CCO 준법) → 3선(내부감사 독립 검증). CISO와 CCO 겸임 금지.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#oka-arrow)" />;
}

export default function OverviewKycAmlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="oka-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">시스템 접근 3중 인증</text>

              <ActionBox x={20} y={35} w={120} h={40} label="1. VPN 접속" sub="암호화 터널 연결" color={C.access} />
              <Arrow x1={140} y1={55} x2={163} y2={55} color={C.access} />

              <ActionBox x={165} y={35} w={130} h={40} label="2. MFA 인증" sub="비밀번호+OTP/생체" color={C.auth} />
              <Arrow x1={295} y1={55} x2={318} y2={55} color={C.auth} />

              <ActionBox x={320} y={35} w={140} h={40} label="3. 최소권한 적용" sub="업무 필수 권한만" color={C.least} />

              {/* Details */}
              <rect x={20} y={95} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={20} y={108} w={130} h={28} label="도청/중간자 공격 차단" color={C.access} />
              <DataBox x={175} y={108} w={130} h={28} label="지식+소유+존재 결합" color={C.auth} />
              <DataBox x={330} y={108} w={130} h={28} label="침해 시 피해 반경 제한" color={C.least} />

              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">권한 재인증: 분기 1회 이상 · 부서 이동/직급 변경 시 즉시 재검토</text>
              <text x={240} y={178} textAnchor="middle" fontSize={8} fill={C.danger}>퇴직자 계정 즉시 비활성화 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">3선 방어 조직 구조</text>

              <ModuleBox x={20} y={35} w={130} h={45} label="1선: 현업" sub="일상 업무 수행" color={C.auth} />
              <Arrow x1={150} y1={57} x2={173} y2={57} color={C.auth} />

              <ModuleBox x={175} y={35} w={130} h={45} label="2선: CISO / CCO" sub="정책·감시" color={C.access} />
              <Arrow x1={305} y1={57} x2={328} y2={57} color={C.access} />

              <ModuleBox x={330} y={35} w={130} h={45} label="3선: 내부감사" sub="독립 검증" color={C.least} />

              {/* CISO vs CCO */}
              <rect x={175} y={95} width={130} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={185} y={112} fontSize={9} fontWeight={600} fill={C.access}>CISO</text>
              <text x={220} y={112} fontSize={8} fill="var(--muted-foreground)">보안 정책·기술 통제</text>
              <text x={185} y={130} fontSize={9} fontWeight={600} fill={C.auth}>CCO</text>
              <text x={218} y={130} fontSize={8} fill="var(--muted-foreground)">법규 준수·AML/CFT</text>

              <Arrow x1={390} y1={80} x2={390} y2={100} color={C.least} />
              <DataBox x={330} y={102} w={130} h={28} label="이사회 직접 보고" color={C.least} />

              <AlertBox x={80} y={158} w={320} h={32} label="3선 무너지면 내부통제 형식에 그침" sub="CISO/CCO 동일인 겸임 금지" color={C.danger} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
