import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6' };

const STEPS = [
  {
    label: 'DB 백업: 덤프 → 암호화 → S3 업로드',
    body: 'mysqldump/pg_dump로 매일 자동 백업 → AES-256 암호화 → S3 버전 관리 + 수명주기 규칙(30일 이후 Glacier). 암호화 키는 KMS에서 별도 관리.',
  },
  {
    label: '백업 절차: NTP 동기화 → 전체백업 → 자동 증분',
    body: 'NTP로 시간 맞춤(증분 기준시점 정확성 확보) → 최초 전체백업 → 크론 스케줄러로 자동 증분. 개인정보 포함 파일은 암호화 자동 적용.',
  },
  {
    label: '소산백업 + 실패 알림 + 접근통제',
    body: '서울/도쿄 리전 분산으로 물리 재해 대비. 실패 시 Slack/이메일 즉시 알림. 백업 접근은 IAM 역할 기반 + 물리 금고 이중 통제.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#br-bp-arrow)" />;
}

export default function BackupProcedureInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-bp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={15} w={90} h={30} label="mysqldump" sub="매일 자동" color={C.green} />
              <Arrow x1={102} y1={30} x2={118} y2={30} color={C.green} />
              <ActionBox x={120} y={15} w={90} h={30} label="AES-256" sub="암호화" color={C.amber} />
              <Arrow x1={212} y1={30} x2={228} y2={30} color={C.amber} />
              <ModuleBox x={230} y={15} w={90} h={30} label="S3 업로드" sub="버전 관리" color={C.blue} />
              <Arrow x1={322} y1={30} x2={338} y2={30} color={C.blue} />
              <DataBox x={340} y={15} w={120} h={30} label="30일 후 Glacier" sub="수명주기 규칙" color={C.purple} />

              <Arrow x1={165} y1={47} x2={165} y2={70} color={C.amber} />
              <rect x={100} y={72} width={140} height={28} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={170} y={89} textAnchor="middle" fontSize={9} fill="var(--foreground)">키는 KMS에서 별도 관리</text>

              <Arrow x1={275} y1={47} x2={275} y2={70} color={C.blue} />
              <rect x={260} y={72} width={200} height={28} rx={5} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={360} y={89} textAnchor="middle" fontSize={9} fill="var(--foreground)">실수 덮어쓰기/삭제 방지</text>

              <text x={240} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">개인정보 포함 DB 덤프는 반드시 암호화 후 업로드</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={30} y={15} w={100} h={32} label="NTP 동기화" sub="시간 일치" color={C.blue} />
              <Arrow x1={132} y1={31} x2={158} y2={31} color={C.blue} />
              <ActionBox x={160} y={15} w={100} h={32} label="최초 전체백업" sub="Full Backup" color={C.green} />
              <Arrow x1={262} y1={31} x2={288} y2={31} color={C.green} />
              <ActionBox x={290} y={15} w={160} h={32} label="크론 자동 증분" sub="설정 주기에 따라 실행" color={C.amber} />

              <Arrow x1={80} y1={49} x2={80} y2={72} color={C.blue} />
              <rect x={20} y={74} width={160} height={36} rx={5} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={100} y={89} textAnchor="middle" fontSize={9} fill="var(--foreground)">시간 어긋남 시</text>
              <text x={100} y={103} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">변경 파일 누락/중복 오류</text>

              <Arrow x1={370} y1={49} x2={370} y2={72} color={C.amber} />
              <rect x={260} y={74} width={200} height={36} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={360} y={89} textAnchor="middle" fontSize={9} fill="var(--foreground)">암호화 자동 적용</text>
              <text x={360} y={103} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사람 실수로 누락 방지</text>

              <text x={240} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">NTP가 선행되어야 증분백업 기준시점이 정확</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={140} h={34} label="소산백업" sub="서울 리전 + 도쿄 리전" color={C.green} />
              <ModuleBox x={170} y={10} w={140} h={34} label="실패 알림" sub="Slack + 이메일 즉시" color={C.red} />
              <ModuleBox x={330} y={10} w={140} h={34} label="접근통제" sub="IAM 역할 + 물리 금고" color={C.amber} />

              <Arrow x1={80} y1={46} x2={80} y2={65} color={C.green} />
              <Arrow x1={240} y1={46} x2={240} y2={65} color={C.red} />
              <Arrow x1={400} y1={46} x2={400} y2={65} color={C.amber} />

              <rect x={10} y={67} width={140} height={36} rx={5} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={80} y={82} textAnchor="middle" fontSize={9} fill="var(--foreground)">물리 재해 대비</text>
              <text x={80} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">한반도 전체 재해에도 복구</text>

              <rect x={170} y={67} width={140} height={36} rx={5} fill="var(--card)" stroke={C.red} strokeWidth={0.6} />
              <text x={240} y={82} textAnchor="middle" fontSize={9} fill="var(--foreground)">백업 공백 방지</text>
              <text x={240} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">에러 메시지 + 대상 + 시각</text>

              <rect x={330} y={67} width={140} height={36} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={400} y={82} textAnchor="middle" fontSize={9} fill="var(--foreground)">원본 수준 보안</text>
              <text x={400} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2인 승인 이중 통제</text>

              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">백업이 유출 경로가 되지 않도록 접근통제 필수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
