import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  acc: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '비밀번호 정책', body: '변경주기 90일, 최소 8자, 복잡도(영+숫+특수), 5회 실패 잠금, 재사용 3~5개 금지. 모든 시스템에 적용.' },
  { label: '계정 분리 · 장기 미접속', body: '서비스/관리자/백업/비상 계정 분리 필수. host가 %인 DB 계정 = 결함. 6개월 미접속 계정 비활성화.' },
  { label: '공용 계정 · MFA', body: '공용 계정 원칙 금지, 불가피 시 사용대장 필수. 관리자 MFA 미적용 = 결함. 모든 IAM에도 MFA.' },
  { label: '접근제어 로그', body: '접근제어 솔루션(DAC) 필수. 로그 항목(ID, IP, 쿼리), 보존 1년+, 위변조 방지, 비인가 접근 탐지 체계.' },
  { label: '권한 정기 검토', body: '반기 1회 전체 시스템 접근 권한 검토. 불필요 권한 회수, 최소 권한 원칙 준수 여부를 보고서로 증빙.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#aaa-arrow)" />;
}

export default function AccountAccessAuditViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="aaa-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 비밀번호 정책 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">비밀번호 정책 점검 항목</text>

              <ActionBox x={15} y={28} w={85} h={38} label="변경 주기" sub="90일 이하" color={C.acc} />
              <ActionBox x={110} y={28} w={75} h={38} label="최소 길이" sub="8자 이상" color={C.acc} />
              <ActionBox x={195} y={28} w={85} h={38} label="복잡도" sub="영+숫+특수" color={C.acc} />
              <ActionBox x={290} y={28} w={85} h={38} label="실패 잠금" sub="5회 시 잠금" color={C.acc} />
              <ActionBox x={385} y={28} w={80} h={38} label="재사용 금지" sub="최근 3~5개" color={C.acc} />

              {/* 확인 방법 */}
              <Arrow x1={57} y1={66} x2={57} y2={85} color={C.acc} />
              <Arrow x1={147} y1={66} x2={147} y2={85} color={C.acc} />
              <Arrow x1={237} y1={66} x2={237} y2={85} color={C.acc} />
              <Arrow x1={332} y1={66} x2={332} y2={85} color={C.warn} />
              <Arrow x1={425} y1={66} x2={425} y2={85} color={C.warn} />

              <DataBox x={15} y={88} w={85} h={28} label="login.defs" color={C.acc} />
              <DataBox x={110} y={88} w={75} h={28} label="pam_pwquality" color={C.acc} />
              <DataBox x={195} y={88} w={85} h={28} label="dcredit/ucredit" color={C.acc} />
              <DataBox x={290} y={88} w={85} h={28} label="pam_faillock" color={C.warn} />
              <DataBox x={385} y={88} w={80} h={28} label="pam_pwhistory" color={C.warn} />

              {/* 결함 사례 */}
              <rect x={30} y={132} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={142} w={195} h={38} label="PASS_MAX_DAYS = 99999" sub="기본값 미변경 → 즉시 결함" color={C.fail} />
              <AlertBox x={255} y={142} w={195} h={38} label="서버 외 시스템도 점검" sub="웹 관리자, DB 콘솔, AWS IAM, VPN" color={C.warn} />

              <text x={240} y={207} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 시스템(서버, DB, 클라우드, 메일)에 동일 기준 적용</text>
            </motion.g>
          )}

          {/* Step 1: 계정 분리 · 장기 미접속 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={150} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">계정 분리 (DB 예시)</text>

              <DataBox x={15} y={28} w={100} h={30} label="서비스 계정" color={C.ok} />
              <DataBox x={125} y={28} w={100} h={30} label="관리자 계정" color={C.acc} />
              <DataBox x={15} y={66} w={100} h={30} label="백업 계정" color={C.ok} />
              <DataBox x={125} y={66} w={100} h={30} label="비상 계정" color={C.warn} />

              <text x={65} y={110} textAnchor="middle" fontSize={7.5} fill={C.ok}>SELECT/INSERT만</text>
              <text x={175} y={110} textAnchor="middle" fontSize={7.5} fill={C.acc}>DDL 권한 포함</text>

              {/* host 결함 */}
              <rect x={245} y={25} width={225} height={80} rx={6} fill={C.fail} opacity={0.04} stroke={C.fail} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={357} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fail}>host 컬럼 점검</text>

              <DataBox x={255} y={48} w={100} h={26} label="host: 10.0.1.%" color={C.ok} />
              <DataBox x={365} y={48} w={95} h={26} label="host: %" color={C.fail} />
              <text x={305} y={86} textAnchor="middle" fontSize={7.5} fill={C.ok}>양호</text>
              <text x={412} y={86} textAnchor="middle" fontSize={7.5} fill={C.fail}>전 IP 접속 = 결함</text>

              {/* 장기 미접속 */}
              <rect x={30} y={120} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={20} y={132} w={120} h={38} label="미접속 계정 조회" sub="6개월 이상 + ACTIVE" color={C.warn} />
              <Arrow x1={140} y1={151} x2={158} y2={151} color={C.warn} />
              <AlertBox x={160} y={132} w={140} h={38} label="퇴직자 계정 잔존" sub="삭제 미처리 = 결함" color={C.fail} />
              <Arrow x1={300} y1={151} x2={318} y2={151} color={C.ok} />
              <ActionBox x={320} y={132} w={140} h={38} label="분기별 점검 보고서" sub="점검일·미접속 목록·조치" color={C.ok} />

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증적: 퇴직자 삭제 대장 + 계정 생성/삭제 절차서</text>
            </motion.g>
          )}

          {/* Step 2: 공용 계정 · MFA */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 공용 계정 */}
              <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">공용 계정</text>

              <AlertBox x={15} y={25} w={100} h={42} label="공용 계정" sub="원칙: 사용 금지" color={C.fail} />
              <Arrow x1={115} y1={46} x2={133} y2={46} color={C.warn} />

              <ActionBox x={135} y={25} w={120} h={42} label="불가피한 경우" sub="레거시 시스템 등" color={C.warn} />

              <Arrow x1={135} y1={67} x2={135} y2={82} color={C.warn} />
              <DataBox x={60} y={85} w={170} h={28} label="공용계정 사용대장 필수" color={C.warn} />
              <text x={145} y={125} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">사용자명, 사용기간, 사유, 승인자</text>

              {/* MFA */}
              <rect x={275} y={10} width={195} height={130} rx={8} fill={C.acc} opacity={0.04} stroke={C.acc} strokeWidth={0.5} />
              <text x={372} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">MFA (2차인증)</text>

              <ModuleBox x={285} y={38} w={85} h={38} label="관리자 페이지" sub="" color={C.acc} />
              <ModuleBox x={380} y={38} w={80} h={38} label="클라우드" sub="" color={C.acc} />
              <ModuleBox x={285} y={84} w={85} h={38} label="VPN" sub="" color={C.acc} />
              <ModuleBox x={380} y={84} w={80} h={38} label="SSH" sub="" color={C.acc} />

              {/* MFA 확인 */}
              <AlertBox x={275} y={145} w={195} h={35} label="ID/PW만 로그인 = 결함" sub="OTP, SMS, 토큰 필수" color={C.fail} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill={C.fail}>AWS: root MFA만으로 불충분 → 모든 IAM 사용자에 MFA 필수</text>
            </motion.g>
          )}

          {/* Step 3: 접근제어 로그 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">접근제어 로그 점검</text>

              <ModuleBox x={165} y={25} w={150} h={44} label="DB 접근제어(DAC)" sub="PETRA, Chakra, QueryPie" color={C.acc} />

              {/* 로그 항목 */}
              <Arrow x1={200} y1={69} x2={80} y2={88} color={C.acc} />
              <Arrow x1={230} y1={69} x2={200} y2={88} color={C.acc} />
              <Arrow x1={260} y1={69} x2={310} y2={88} color={C.acc} />
              <Arrow x1={290} y1={69} x2={420} y2={88} color={C.acc} />

              <DataBox x={35} y={90} w={90} h={26} label="접속자 ID" color={C.acc} />
              <DataBox x={145} y={90} w={100} h={26} label="IP + 일시" color={C.acc} />
              <DataBox x={265} y={90} w={90} h={26} label="실행 쿼리" color={C.acc} />
              <DataBox x={375} y={90} w={80} h={26} label="결과" color={C.acc} />

              {/* 관리 요건 */}
              <rect x={30} y={130} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <StatusBox x={20} y={140} w={105} h={45} label="보존 기간" sub="개인정보 DB: 1년+" color={C.ok} progress={0.8} />
              <ActionBox x={140} y={145} w={105} h={38} label="위변조 방지" sub="별도 서버 전송" color={C.warn} />
              <ActionBox x={260} y={145} w={100} h={38} label="비인가 탐지" sub="알림 + 조치 기록" color={C.fail} />
              <AlertBox x={375} y={145} w={90} h={38} label="같은 서버" sub="= 결함" color={C.fail} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비인가 접근 발견 시: "인지했나요?" → "조치했나요?" → "재발 방지는?"</text>
            </motion.g>
          )}

          {/* Step 4: 권한 정기 검토 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">접근 권한 정기 검토 (반기 1회+)</text>

              {/* 검토 대상 */}
              <DataBox x={15} y={30} w={85} h={28} label="서버 계정" color={C.acc} />
              <DataBox x={110} y={30} w={75} h={28} label="DB 계정" color={C.acc} />
              <DataBox x={195} y={30} w={90} h={28} label="관리자 권한" color={C.acc} />
              <DataBox x={295} y={30} w={80} h={28} label="IAM 정책" color={C.acc} />
              <DataBox x={385} y={30} w={80} h={28} label="VPN 권한" color={C.acc} />

              {/* 검토 흐름 */}
              <Arrow x1={57} y1={58} x2={57} y2={78} color={C.warn} />
              <Arrow x1={147} y1={58} x2={147} y2={78} color={C.warn} />
              <Arrow x1={240} y1={58} x2={240} y2={78} color={C.warn} />
              <Arrow x1={335} y1={58} x2={335} y2={78} color={C.warn} />
              <Arrow x1={425} y1={58} x2={425} y2={78} color={C.warn} />

              <ActionBox x={100} y={80} w={280} h={40} label="검토: 불필요 권한 회수 + 퇴직자 삭제 + 과도한 권한 조정" sub="검토일, 검토자, 대상 시스템, 발견 사항, 조치 결과" color={C.warn} />

              <Arrow x1={240} y1={120} x2={240} y2={140} color={C.ok} />

              <StatusBox x={140} y={142} w={200} h={42} label="검토 보고서" sub="증적으로 제출" color={C.ok} progress={1} />

              {/* 최소 권한 원칙 */}
              <AlertBox x={80} y={195} w={320} h={22} label="'편의상' / '원래부터 이렇게' = 결함 사유. 업무 근거 문서화 필수" sub="" color={C.fail} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
