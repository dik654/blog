import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  db: '#6366f1',
  server: '#10b981',
  log: '#f59e0b',
  recovery: '#ef4444',
};

const STEPS = [
  { label: '3대 백업 대상', body: 'DB(매일 전체백업, 30일 보관, S3), 서버 설정(분기별, 물리 금고), 로그(매일 증분, 6개월~5년). 개인정보는 AES-256 암호화 후 저장.' },
  { label: '백업 절차와 소산백업', body: 'NTP 시간 동기화 → 최초 전체백업 → 이후 cron 증분백업. 소산백업: 다른 IDC/리전에 동일 백업. 재해 대비.' },
  { label: '복구와 RTO/RPO', body: 'DB: S3 다운로드 → 스테이징 검증 → 프로덕션 적용 → 온체인 정합성 확인. 시스템: 이미지 복원+시크릿 주입. RTO 4h, RPO 1h 목표.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#br-arrow)" />;
}

export default function BackupRecoveryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">3대 백업 대상</text>

              <ModuleBox x={20} y={30} w={130} h={50} label="DB 백업" sub="매일 전체 백업" color={C.db} />
              <ModuleBox x={175} y={30} w={130} h={50} label="서버 설정 백업" sub="분기별 수동 백업" color={C.server} />
              <ModuleBox x={330} y={30} w={130} h={50} label="로그 백업" sub="매일 증분 백업" color={C.log} />

              <DataBox x={20} y={95} w={130} h={25} label="S3 저장, 30일 보관" color={C.db} />
              <DataBox x={175} y={95} w={130} h={25} label="물리 금고 보관" color={C.server} />
              <DataBox x={330} y={95} w={130} h={25} label="S3/Glacier, 6M~5Y" color={C.log} />

              <text x={85} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">PITR 가능</text>
              <text x={240} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">재해 시 서버 재구축 기준</text>
              <text x={395} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">규제 요건 따라 연장</text>

              <rect x={80} y={152} width={320} height={30} rx={6} fill={`${C.recovery}10`} stroke={C.recovery} strokeWidth={0.6} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.recovery}>개인정보 포함 부분 AES-256 암호화</text>

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">암호화 키는 백업 데이터와 물리적으로 분리 보관</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">백업 절차와 소산백업</text>

              <ActionBox x={10} y={35} w={100} h={35} label="NTP 동기화" sub="시간 불일치 방지" color={C.db} />
              <Arrow x1={110} y1={52} x2={128} y2={52} color={C.db} />

              <ActionBox x={130} y={35} w={100} h={35} label="최초 전체백업" sub="1회 Full Backup" color={C.db} />
              <Arrow x1={230} y1={52} x2={248} y2={52} color={C.server} />

              <ActionBox x={250} y={35} w={100} h={35} label="cron 증분백업" sub="변경분만 저장" color={C.server} />
              <Arrow x1={350} y1={52} x2={368} y2={52} color={C.log} />

              <ActionBox x={370} y={35} w={100} h={35} label="AES-256 암호화" sub="개인정보 보호" color={C.log} />

              {/* Off-site backup */}
              <rect x={20} y={90} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ModuleBox x={60} y={105} w={160} h={42} label="주 백업 (IDC A)" sub="메인 저장소" color={C.db} />
              <Arrow x1={220} y1={126} x2={258} y2={126} color={C.recovery} />
              <ModuleBox x={260} y={105} w={160} h={42} label="소산백업 (IDC B)" sub="다른 지역 동일 복제" color={C.recovery} />

              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">화재/지진/홍수 등 재해로 주 백업 소실 시 대비</text>
              <text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">다른 AWS 리전 또는 다른 IDC에 물리적 분리 보관</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">복구 절차와 RTO/RPO</text>

              {/* DB recovery flow */}
              <ActionBox x={10} y={32} w={90} h={32} label="S3 다운로드" sub="덤프 파일" color={C.db} />
              <Arrow x1={100} y1={48} x2={113} y2={48} color={C.db} />
              <ActionBox x={115} y={32} w={90} h={32} label="스테이징 검증" sub="무결성 확인" color={C.server} />
              <Arrow x1={205} y1={48} x2={218} y2={48} color={C.server} />
              <ActionBox x={220} y={32} w={90} h={32} label="프로덕션 적용" sub="DB 복원" color={C.log} />
              <Arrow x1={310} y1={48} x2={323} y2={48} color={C.log} />
              <ActionBox x={325} y={32} w={140} h={32} label="온체인 정합성 확인" sub="잔고 대조" color={C.recovery} />

              {/* System recovery */}
              <rect x={20} y={82} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={30} y={100} fontSize={9} fontWeight={600} fill="var(--foreground)">시스템 복구</text>
              <text x={30} y={114} fontSize={8} fill="var(--muted-foreground)">이미지 복원(Clonezilla) → 앱 배포 → Secrets Manager 시크릿 주입 → 서비스 재개</text>

              {/* RTO/RPO */}
              <rect x={20} y={130} width={440} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <DataBox x={30} y={140} w={190} h={28} label="RTO: 서비스 중단 → 복구 4h 이내" color={C.recovery} />
              <DataBox x={260} y={140} w={190} h={28} label="RPO: 데이터 손실 1h 이내" color={C.recovery} />

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">복구 후 RTO/RPO 달성 여부 검토 → 미달 시 백업 주기/인프라 보강</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
