import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  old: '#ef4444',
  action: '#6366f1',
  safe: '#10b981',
  warn: '#f59e0b',
};

const STEPS = [
  {
    label: '점진 전환 — 로그인 시 MD5 검증 후 bcrypt로 재해싱',
    body: '이용자가 로그인하면 기존 MD5 해시로 먼저 검증. 성공 시 입력된 평문 비밀번호를 bcrypt로 해싱하여 DB 교체. 다음 로그인부터 bcrypt로 검증. 원본 복호 불가하므로 로그인 시점만 가능.',
  },
  {
    label: '이중 해시 — bcrypt(MD5(password))로 일괄 전환',
    body: '기존 MD5 해시값을 입력으로 bcrypt를 적용하면 모든 계정을 한 번에 전환 가능. 단, MD5 출력이 128비트로 고정되어 입력 엔트로피 제한. 장기적으로는 점진 전환으로 순수 bcrypt 교체가 바람직.',
  },
  {
    label: '다층 방어 — 실패 제한 + CAPTCHA + Rate Limiting',
    body: '3회 실패 → CAPTCHA 노출. 5회 실패 → 계정 잠금(30분 자동 또는 본인확인 후 해제). API Rate Limiting으로 동일 IP 과다 요청 차단. 느린 해시 + 온라인 방어 = 완전한 방어층.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#mig-inline-arrow)" />
  );
}

export default function MigrationInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="mig-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 점진 전환 흐름 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">점진적 MD5 → bcrypt 전환</text>

              {/* 로그인 흐름 */}
              <ActionBox x={10} y={28} w={70} h={38} label="로그인" sub="평문 입력" color={C.action} />
              <Arrow x1={80} y1={47} x2={95} y2={47} color={C.action} />

              <ActionBox x={97} y={28} w={82} h={38} label="MD5 해시" sub="기존 방식 검증" color={C.old} />
              <Arrow x1={179} y1={47} x2={194} y2={47} color={C.safe} />

              <StatusBox x={196} y={24} w={60} h={46} label="일치?" sub="인증 성공" color={C.safe} />
              <Arrow x1={256} y1={47} x2={271} y2={47} color={C.action} />

              <ActionBox x={273} y={28} w={85} h={38} label="bcrypt 해싱" sub="평문 → bcrypt" color={C.action} />
              <Arrow x1={358} y1={47} x2={373} y2={47} color={C.safe} />

              <StatusBox x={375} y={24} w={90} h={46} label="DB 교체" sub="MD5 → bcrypt" color={C.safe} />

              {/* 흐르는 점 */}
              <motion.circle r={3} fill={C.action} opacity={0.5}
                initial={{ cx: 45 }} animate={{ cx: 420 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} cy={47} />

              {/* 구분선 */}
              <line x1={15} y1={84} x2={465} y2={84} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 다음 로그인 */}
              <text x={240} y={104} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>다음 로그인부터</text>

              <ActionBox x={60} y={112} w={80} h={34} label="로그인" sub="평문 입력" color={C.action} />
              <Arrow x1={140} y1={129} x2={163} y2={129} color={C.safe} />
              <ActionBox x={165} y={112} w={100} h={34} label="bcrypt 검증" sub="새 해시와 비교" color={C.safe} />
              <Arrow x1={265} y1={129} x2={288} y2={129} color={C.safe} />
              <StatusBox x={290} y={108} w={80} h={42} label="인증 성공" sub="bcrypt 완료" color={C.safe} />

              {/* 미로그인 계정 */}
              <line x1={15} y1={162} x2={465} y2={162} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={100} y={170} w={280} h={30} label="장기 미로그인 계정 → 비밀번호 재설정 강제로 전환 완료" color={C.warn} />
            </motion.g>
          )}

          {/* Step 1: 이중 해시 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">이중 해시: bcrypt(MD5(password))</text>

              {/* 일괄 전환 흐름 */}
              <text x={240} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>일괄 전환 (로그인 불필요)</text>

              <DataBox x={15} y={44} w={100} h={28} label="MD5 해시값" sub="기존 DB 데이터" color={C.old} />
              <Arrow x1={115} y1={58} x2={138} y2={58} color={C.action} />

              <ActionBox x={140} y={42} w={120} h={32} label="bcrypt(MD5해시)" sub="해시를 입력으로 사용" color={C.action} />
              <Arrow x1={260} y1={58} x2={283} y2={58} color={C.safe} />

              <DataBox x={285} y={44} w={110} h={28} label="bcrypt 해시값" sub="새 DB 데이터" color={C.safe} />

              <Arrow x1={395} y1={58} x2={418} y2={58} color={C.safe} />
              <StatusBox x={420} y={38} w={50} h={40} label="완료" color={C.safe} />

              {/* 흐르는 점 */}
              <motion.circle r={3} fill={C.action} opacity={0.5}
                initial={{ cx: 65 }} animate={{ cx: 445 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={58} />

              {/* 구분선 */}
              <line x1={15} y1={90} x2={465} y2={90} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 장단점 */}
              <StatusBox x={20} y={100} w={200} h={44} label="장점: 즉시 전환" sub="모든 계정 일괄 처리" color={C.safe} />

              <AlertBox x={260} y={102} w={200} h={40} label="단점: 엔트로피 제한" sub="MD5 출력 128비트로 고정" color={C.warn} />

              {/* 엔트로피 비교 */}
              <line x1={15} y1={158} x2={465} y2={158} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={100} y={176} textAnchor="middle" fontSize={8} fill={C.warn}>bcrypt(MD5(pw))</text>
              <rect x={160} y={170} width={128} height={8} rx={4} fill={C.warn} opacity={0.4} />
              <text x={300} y={176} fontSize={8} fill={C.warn}>128비트 입력</text>

              <text x={100} y={194} textAnchor="middle" fontSize={8} fill={C.safe}>bcrypt(pw) 직접</text>
              <rect x={160} y={188} width={256} height={8} rx={4} fill={C.safe} opacity={0.4} />
              <text x={424} y={194} fontSize={8} fill={C.safe}>전체 엔트로피</text>
            </motion.g>
          )}

          {/* Step 2: 다층 방어 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">다층 방어: 온라인 공격 차단</text>

              {/* 공격자 */}
              <AlertBox x={15} y={30} w={80} h={40} label="공격자" sub="봇넷/자동화" color={C.old} />
              <Arrow x1={95} y1={50} x2={118} y2={50} color={C.old} />

              {/* 방어층 1: Rate Limiting */}
              <ActionBox x={120} y={30} w={90} h={40} label="Rate Limiting" sub="IP 속도 제한" color={C.action} />
              <Arrow x1={210} y1={50} x2={228} y2={50} color={C.action} />

              {/* 방어층 2: CAPTCHA */}
              <ActionBox x={230} y={30} w={80} h={40} label="CAPTCHA" sub="3회 실패 후" color={C.warn} />
              <Arrow x1={310} y1={50} x2={328} y2={50} color={C.warn} />

              {/* 방어층 3: 계정 잠금 */}
              <ActionBox x={330} y={30} w={80} h={40} label="계정 잠금" sub="5회 실패" color={C.old} />
              <Arrow x1={410} y1={50} x2={428} y2={50} color={C.safe} />

              {/* 서버 */}
              <StatusBox x={430} y={26} w={42} h={48} label="서버" color={C.safe} />

              {/* 구분선 */}
              <line x1={15} y1={84} x2={465} y2={84} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 잠금 해제 방식 */}
              <text x={240} y={104} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">계정 잠금 해제 방식</text>

              <ActionBox x={40} y={112} w={150} h={36} label="자동 해제 (30분)" sub="공격자도 30분 후 재시도 가능" color={C.warn} />
              <ActionBox x={220} y={112} w={170} h={36} label="본인확인 후 해제" sub="이메일·휴대폰 인증 필수" color={C.safe} />

              <text x={440} y={128} fontSize={8} fontWeight={600} fill={C.safe}>병행</text>

              {/* 결합 효과 */}
              <line x1={15} y1={162} x2={465} y2={162} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <rect x={40} y={172} width={400} height={28} rx={6} fill="#10b98112" stroke={C.safe} strokeWidth={1} />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>느린 해시(오프라인 방어) + 실패 제한(온라인 방어)</text>
              <text x={240} y={198} textAnchor="middle" fontSize={8} fill={C.safe}>= 온라인·오프라인 공격 모두 차단하는 완전한 방어 체계</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
