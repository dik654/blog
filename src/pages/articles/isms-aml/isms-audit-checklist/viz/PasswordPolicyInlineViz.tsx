import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  policy: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '비밀번호 정책 5대 항목', body: '변경주기(90일), 최소길이(8자), 복잡도(3종 조합), 잠금(5회), 재사용 금지(3~5개).' },
  { label: '전 시스템 동일 적용', body: 'Linux 서버뿐 아니라 웹 관리자, DB, AWS IAM, VPN, 메일 시스템까지 전부 확인.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ppi-arrow)" />;
}

export default function PasswordPolicyInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ppi-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">비밀번호 정책 5대 확인 항목</text>

              <DataBox x={15} y={28} w={85} h={38} label="변경주기" color={C.policy} />
              <text x={57} y={80} textAnchor="middle" fontSize={7.5} fill={C.ok}>90일 이하</text>

              <DataBox x={110} y={28} w={75} h={38} label="최소길이" color={C.policy} />
              <text x={147} y={80} textAnchor="middle" fontSize={7.5} fill={C.ok}>8자 이상</text>

              <DataBox x={195} y={28} w={80} h={38} label="복잡도" color={C.policy} />
              <text x={235} y={80} textAnchor="middle" fontSize={7.5} fill={C.ok}>영+숫+특수</text>

              <DataBox x={285} y={28} w={80} h={38} label="잠금" color={C.warn} />
              <text x={325} y={80} textAnchor="middle" fontSize={7.5} fill={C.ok}>5회 실패</text>

              <DataBox x={375} y={28} w={90} h={38} label="재사용 금지" color={C.warn} />
              <text x={420} y={80} textAnchor="middle" fontSize={7.5} fill={C.ok}>최근 3~5개</text>

              <rect x={30} y={95} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={108} w={200} h={38} label="PASS_MAX_DAYS: 99999" sub="비밀번호 만료 미설정 = 즉시 결함" color={C.fail} />
              <AlertBox x={250} y={108} w={200} h={38} label="pam_pwquality 미설정" sub="복잡도 강제 없음 = 결함" color={C.fail} />

              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">login.defs + PAM + pam_faillock 세 곳 모두 확인</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">전 시스템 비밀번호 정책 적용 범위</text>

              <ModuleBox x={160} y={25} w={160} h={38} label="비밀번호 정책" sub="동일 기준 전체 적용" color={C.policy} />

              <Arrow x1={200} y1={63} x2={60} y2={85} color={C.policy} />
              <Arrow x1={220} y1={63} x2={160} y2={85} color={C.policy} />
              <Arrow x1={260} y1={63} x2={260} y2={85} color={C.policy} />
              <Arrow x1={300} y1={63} x2={360} y2={85} color={C.policy} />
              <Arrow x1={320} y1={63} x2={440} y2={85} color={C.policy} />

              <ActionBox x={15} y={88} w={90} h={36} label="Linux 서버" sub="login.defs" color={C.ok} />
              <ActionBox x={115} y={88} w={90} h={36} label="웹 관리자" sub="앱 설정" color={C.ok} />
              <ActionBox x={215} y={88} w={90} h={36} label="DB 콘솔" sub="MySQL/PG" color={C.warn} />
              <ActionBox x={315} y={88} w={90} h={36} label="AWS IAM" sub="클라우드" color={C.warn} />
              <ActionBox x={415} y={88} w={55} h={36} label="VPN" sub="" color={C.ok} />

              <rect x={30} y={142} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={60} y={152} w={360} h={32} label="한 시스템이라도 정책 미적용이면 결함" sub="서버는 OK인데 DB 콘솔 비밀번호 정책 없음 → 결함" color={C.fail} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
