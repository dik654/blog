import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'DB 백업 — 매일 자동 + S3 + 암호화',
    body: 'mysqldump/pg_dump → cron 새벽 실행 → S3 버전관리 + lifecycle → AES-256 암호화 + KMS 키 분리 관리.',
  },
  {
    label: '서버 설정 + 로그 백업',
    body: '서버 설정: /etc, /opt, /home 분기 1회 + 변경 시 즉시. 물리 금고 + 클라우드 이중. 로그: 매일 증분 + SHA-256 해시.',
  },
  {
    label: '백업 절차 — NTP → Full → 자동 Inc → 암호화',
    body: 'NTP 동기화(시간 어긋남 → 증분 오류) → 최초 전체백업 → cron 자동 증분 → 개인정보 파일 AES-256 자동 암호화.',
  },
  {
    label: '소산백업 + 실패 알림',
    body: '오프사이트: 서울↔도쿄 리전 / 물리 금고. 실패 알림: exit code 검사 → Slack/이메일 즉시. 주간 현황 리포트.',
  },
  {
    label: '접근통제 — IAM + 물리 금고 이중 통제',
    body: '쓰기: 백업 전용 서비스 계정. 읽기: 복구 담당자 한정. Block Public Access 필수. 물리 매체: 2인 승인 이중 통제.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#br-bp-arrow)" />;
}

export default function BackupPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-bp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* DB backup pipeline */}
              <ModuleBox x={15} y={20} w={90} h={40} label="DB 서버" sub="MySQL/PG" color={C.blue} />
              <Arrow x1={107} y1={40} x2={128} y2={40} color={C.blue} />
              <ActionBox x={130} y={22} w={90} h={36} label="mysqldump" sub="논리 백업" color={C.green} />
              <Arrow x1={222} y1={40} x2={243} y2={40} color={C.green} />
              <ActionBox x={245} y={22} w={80} h={36} label="AES-256" sub="암호화" color={C.amber} />
              <Arrow x1={327} y1={40} x2={348} y2={40} color={C.amber} />
              <ModuleBox x={350} y={20} w={110} h={40} label="S3 버킷" sub="versioning ON" color={C.blue} />

              {/* cron */}
              <DataBox x={130} y={72} w={90} h={26} label="cron 새벽" sub="매일 자동" color={C.green} />

              {/* Lifecycle */}
              <Arrow x1={405} y1={62} x2={405} y2={108} color={C.blue} />
              <ActionBox x={330} y={108} w={140} h={36} label="Lifecycle 규칙" sub="30일 → Glacier / 삭제" color={C.amber} />

              {/* KMS */}
              <DataBox x={245} y={108} w={80} h={26} label="KMS" sub="키 분리 관리" color={C.red} />
              <Arrow x1={285} y1={72} x2={285} y2={106} color={C.red} />

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">개인정보 포함 DB 덤프 → 반드시 암호화 후 업로드</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Server config */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>서버 설정 백업</text>
              <ModuleBox x={15} y={28} w={80} h={34} label="/etc" sub="시스템 설정" color={C.green} />
              <ModuleBox x={100} y={28} w={65} h={34} label="/opt" sub="앱" color={C.green} />
              <ModuleBox x={170} y={28} w={65} h={34} label="/home" sub="사용자" color={C.green} />

              <Arrow x1={120} y1={64} x2={50} y2={80} color={C.green} />
              <Arrow x1={120} y1={64} x2={170} y2={80} color={C.green} />
              <DataBox x={10} y={80} w={90} h={26} label="물리 금고" sub="외장 HDD" color={C.amber} />
              <DataBox x={130} y={80} w={90} h={26} label="클라우드" sub="이중 보관" color={C.blue} />

              <text x={120} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분기 1회 + 중요 변경 시 즉시</text>

              {/* divider */}
              <line x1={248} y1={18} x2={248} y2={165} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />

              {/* App logs */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>로그 백업</text>
              <ModuleBox x={290} y={28} w={160} h={34} label="/var/log" sub="접근·에러·보안·쿼리" color={C.amber} />

              <Arrow x1={370} y1={64} x2={320} y2={80} color={C.amber} />
              <Arrow x1={370} y1={64} x2={420} y2={80} color={C.amber} />
              <DataBox x={280} y={80} w={80} h={26} label="S3" sub="기본 6개월" color={C.blue} />
              <DataBox x={385} y={80} w={80} h={26} label="Glacier" sub="장기 보관" color={C.amber} />

              <ActionBox x={300} y={120} w={140} h={30} label="SHA-256 해시 기록" sub="변조 여부 확인" color={C.red} />
              <text x={370} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">매일 증분백업 · 해시로 무결성 보증</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Backup procedure flow */}
              <StatusBox x={15} y={20} w={100} h={44} label="1. NTP 동기화" sub="시간 일치 필수" color={C.blue} progress={0.25} />
              <Arrow x1={117} y1={42} x2={133} y2={42} color={C.blue} />
              <StatusBox x={135} y={20} w={100} h={44} label="2. 최초 Full" sub="전체백업" color={C.green} progress={0.5} />
              <Arrow x1={237} y1={42} x2={253} y2={42} color={C.green} />
              <StatusBox x={255} y={20} w={100} h={44} label="3. 자동 Inc" sub="cron 증분" color={C.amber} progress={0.75} />
              <Arrow x1={357} y1={42} x2={373} y2={42} color={C.amber} />
              <StatusBox x={375} y={20} w={90} h={44} label="4. 암호화" sub="AES-256" color={C.red} progress={1} />

              {/* NTP warning */}
              <AlertBox x={15} y={85} w={210} h={34} label="시간 어긋남 → 증분 누락/중복" sub="변경 파일 기준 시점 오류" color={C.red} />

              {/* Auto encryption note */}
              <DataBox x={255} y={85} w={210} h={34} label="스크립트 내 자동 암호화" sub="사람 실수로 누락 방지" color={C.green} />

              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">NTP → Full → Inc(자동) → 암호화(자동) 순서 엄수</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Offsite backup */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>소산백업</text>

              <ModuleBox x={20} y={28} w={80} h={38} label="주 백업" sub="서울 리전" color={C.blue} />
              <Arrow x1={102} y1={47} x2={148} y2={47} color={C.blue} />
              <text x={125} y={40} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">복제</text>
              <ModuleBox x={150} y={28} w={80} h={38} label="소산백업" sub="도쿄 리전" color={C.amber} />

              <DataBox x={20} y={80} w={210} h={28} label="물리 매체 → 전용 금고 / 전문 보관 업체" sub="" color={C.green} />

              {/* divider */}
              <line x1={248} y1={18} x2={248} y2={170} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />

              {/* Failure alert */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>실패 알림</text>
              <ActionBox x={270} y={28} w={100} h={34} label="백업 스크립트" sub="exit code 검사" color={C.red} />
              <Arrow x1={372} y1={45} x2={388} y2={45} color={C.red} />
              <AlertBox x={390} y={28} w={75} h={34} label="실패!" sub="" color={C.red} />

              <Arrow x1={427} y1={64} x2={370} y2={80} color={C.red} />
              <ActionBox x={270} y={78} w={100} h={30} label="Slack/이메일" sub="즉시 알림" color={C.amber} />
              <ActionBox x={385} y={78} w={80} h={30} label="주간 리포트" sub="전체 현황" color={C.blue} />

              <DataBox x={270} y={120} w={195} h={28} label="대상·시각·에러 메시지 포함" sub="" color={C.red} />

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자동화 백업 실패 미인지 → 며칠간 백업 공백 위험</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">백업 접근통제</text>

              {/* Cloud access */}
              <text x={120} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>클라우드 (S3)</text>
              <ModuleBox x={20} y={48} w={80} h={38} label="IAM 쓰기" sub="전용 서비스 계정" color={C.blue} />
              <ModuleBox x={115} y={48} w={80} h={38} label="IAM 읽기" sub="복구 담당자" color={C.green} />
              <AlertBox x={20} y={98} w={175} h={30} label="Block Public Access 필수" sub="" color={C.red} />

              {/* divider */}
              <line x1={240} y1={35} x2={240} y2={170} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />

              {/* Physical access */}
              <text x={370} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>물리 매체</text>
              <ModuleBox x={270} y={48} w={90} h={38} label="시건 금고" sub="출입 기록 관리" color={C.amber} />
              <ModuleBox x={375} y={48} w={90} h={38} label="반출/반입" sub="대장 기록" color={C.amber} />
              <AlertBox x={270} y={98} w={195} h={30} label="2인 승인 이중 통제 (Dual Control)" sub="" color={C.red} />

              {/* Common bottom */}
              <DataBox x={90} y={145} w={300} h={30} label="백업 접근 = 원본 동일 수준 보안" sub="백업이 유출 경로가 되지 않도록" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
