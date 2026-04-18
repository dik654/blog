import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'DB 복구 절차',
    body: 'S3 다운로드 → KMS 복호화 → 동일 버전 DB 설치 → dump import → 테이블/레코드 대조 → 앱 연동 테스트 → RTO 측정.',
  },
  {
    label: '시스템 복구 절차',
    body: 'Clonezilla 이미지에서 디스크 복원 → 부팅 확인(부트로더·드라이버·UUID) → 네트워크/방화벽/cron 점검 → 서비스 순차 시작.',
  },
  {
    label: '복구 테스트 — 백업의 실효성 검증',
    body: '월별 샘플 DB 복원(5-10 테이블) + 분기별 전체 시스템 복원. 테스트 환경은 프로덕션과 분리된 별도 VM.',
  },
  {
    label: '보존 기간 — 법적 요구에 따른 차등',
    body: '일반 운영: 6개월. 전자금융거래: 5년. 개인정보: 목적 달성 후 파기(법령 예외). CCTV: 30일~1년 + 전용 NAS.',
  },
  {
    label: '시나리오별 절차서 + 정기 훈련',
    body: 'DB 장애 / 서버 장애 / 랜섬웨어 / 자연재해 각각 절차서. 연 1회 모의훈련 → 실제 RTO/RPO 측정 → AAR 보고서.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#br-rt-arrow)" />;
}

export default function RecoveryTestingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-rt-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* DB recovery pipeline */}
              <ModuleBox x={10} y={15} w={75} h={36} label="S3 버킷" sub="백업 다운로드" color={C.blue} />
              <Arrow x1={87} y1={33} x2={103} y2={33} color={C.blue} />
              <ActionBox x={105} y={15} w={70} h={36} label="KMS" sub="복호화" color={C.amber} />
              <Arrow x1={177} y1={33} x2={193} y2={33} color={C.amber} />
              <ActionBox x={195} y={15} w={80} h={36} label="DB 설치" sub="동일 버전!" color={C.green} />
              <Arrow x1={277} y1={33} x2={293} y2={33} color={C.green} />
              <ActionBox x={295} y={15} w={80} h={36} label="dump import" sub="데이터 복원" color={C.blue} />
              <Arrow x1={377} y1={33} x2={393} y2={33} color={C.blue} />
              <ActionBox x={395} y={15} w={75} h={36} label="대조 검증" sub="테이블·레코드" color={C.red} />

              {/* Verification row */}
              <Arrow x1={432} y1={53} x2={370} y2={75} color={C.red} />
              <StatusBox x={220} y={72} w={240} h={42} label="앱 연동 테스트" sub="읽기/쓰기 쿼리 + API 응답 검증" color={C.green} progress={0.85} />

              {/* Version warning */}
              <AlertBox x={20} y={72} w={170} h={42} label="버전 불일치 → 호환성 오류" sub="백업 시 DB 버전 함께 기록" color={C.red} />

              {/* RTO check */}
              <Arrow x1={340} y1={116} x2={340} y2={135} color={C.green} />
              <DataBox x={240} y={135} w={200} h={28} label="복구 소요 시간 기록 → RTO 준수 확인" color={C.green} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* System recovery flow */}
              <ModuleBox x={10} y={15} w={100} h={38} label="디스크 이미지" sub="Clonezilla" color={C.blue} />
              <Arrow x1={112} y1={34} x2={128} y2={34} color={C.blue} />
              <ActionBox x={130} y={15} w={90} h={38} label="디스크 복원" sub="HDD/NAS" color={C.green} />
              <Arrow x1={222} y1={34} x2={238} y2={34} color={C.green} />
              <ActionBox x={240} y={15} w={90} h={38} label="부팅 확인" sub="" color={C.amber} />
              <Arrow x1={332} y1={34} x2={348} y2={34} color={C.amber} />
              <ActionBox x={350} y={15} w={110} h={38} label="설정 점검" sub="네트워크·방화벽" color={C.blue} />

              {/* Boot failure reasons */}
              <Arrow x1={285} y1={55} x2={200} y2={75} color={C.red} />
              <AlertBox x={20} y={72} w={100} h={32} label="부트로더 손상" sub="" color={C.red} />
              <AlertBox x={130} y={72} w={100} h={32} label="드라이버 불일치" sub="" color={C.red} />
              <AlertBox x={240} y={72} w={100} h={32} label="디스크 UUID" sub="" color={C.red} />

              {/* Fix path */}
              <Arrow x1={180} y1={106} x2={180} y2={120} color={C.amber} />
              <DataBox x={100} y={120} w={160} h={26} label="recovery mode → 재설치" color={C.amber} />

              {/* Service start */}
              <Arrow x1={405} y1={55} x2={405} y2={115} color={C.green} />
              <ActionBox x={340} y={115} w={130} h={36} label="서비스 순차 시작" sub="nginx → mysql → app" color={C.green} />

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">부팅 → 설정 → 서비스 순서대로 하나씩 검증</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">복구 테스트</text>

              {/* Warning */}
              <AlertBox x={100} y={28} w={280} h={32} label="백업 있으니 안전? 테스트 전까지 확신 불가" sub="" color={C.red} />

              {/* Test types */}
              <Arrow x1={200} y1={62} x2={100} y2={82} color={C.amber} />
              <Arrow x1={280} y1={62} x2={360} y2={82} color={C.blue} />

              <ModuleBox x={20} y={82} w={170} h={44} label="월별 샘플 DB 복원" sub="주요 테이블 5-10개" color={C.amber} />
              <ModuleBox x={280} y={82} w={180} h={44} label="분기별 전체 시스템 복원" sub="OS + 설정 + 서비스" color={C.blue} />

              {/* Test env */}
              <Arrow x1={240} y1={128} x2={240} y2={145} color={C.green} />
              <DataBox x={100} y={145} w={280} h={28} label="테스트 환경: 프로덕션 분리 VM" sub="실 서비스 영향 없음" color={C.green} />

              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">손상·누락·절차 불일치 → 테스트로만 발견 가능</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">보존 기간 차등 설정</text>

              {/* Timeline bar */}
              <line x1={40} y1={55} x2={440} y2={55} stroke="var(--border)" strokeWidth={1} />
              <text x={40} y={48} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">0</text>
              <text x={120} y={48} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">6개월</text>
              <text x={240} y={48} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1년</text>
              <text x={360} y={48} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3년</text>
              <text x={440} y={48} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">5년</text>

              {/* Bars */}
              <rect x={40} y={65} width={80} height={18} rx={3} fill={C.green} opacity={0.3} stroke={C.green} strokeWidth={1} />
              <text x={80} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>일반 운영</text>

              <rect x={40} y={90} width={400} height={18} rx={3} fill={C.red} opacity={0.2} stroke={C.red} strokeWidth={1} />
              <text x={240} y={103} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>전자금융거래 (5년)</text>

              <rect x={40} y={115} width={320} height={18} rx={3} fill={C.amber} opacity={0.2} stroke={C.amber} strokeWidth={1} />
              <text x={200} y={128} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>개인정보 (법령 예외 3~5년)</text>

              <rect x={40} y={140} width={60} height={18} rx={3} fill={C.blue} opacity={0.2} stroke={C.blue} strokeWidth={1} />
              <text x={70} y={153} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.blue}>CCTV</text>
              <text x={135} y={153} textAnchor="start" fontSize={8} fill="var(--muted-foreground)">30일~1년 (전용 NAS)</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">법적 요구 + 업무 필요에 따라 차등 적용</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Scenario playbooks */}
              <text x={140} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>시나리오별 절차서</text>
              <DataBox x={15} y={28} w={75} h={26} label="DB 장애" color={C.blue} />
              <DataBox x={95} y={28} w={75} h={26} label="서버 장애" color={C.green} />
              <DataBox x={15} y={60} w={75} h={26} label="랜섬웨어" color={C.red} />
              <DataBox x={95} y={60} w={75} h={26} label="자연재해" color={C.amber} />

              <text x={120} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">담당자·소요 시간·도구·연락처 포함</text>

              {/* divider */}
              <line x1={240} y1={18} x2={240} y2={175} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />

              {/* Drill */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>정기 훈련 (연 1회+)</text>
              <ActionBox x={265} y={28} w={100} h={32} label="시나리오 설정" sub="가상 장애" color={C.amber} />
              <Arrow x1={367} y1={44} x2={383} y2={44} color={C.amber} />
              <ActionBox x={385} y={28} w={80} h={32} label="실제 복원" sub="테스트 환경" color={C.green} />

              {/* Metrics */}
              <Arrow x1={370} y1={62} x2={370} y2={78} color={C.green} />
              <StatusBox x={265} y={78} w={100} h={40} label="실제 RTO" sub="vs 목표 RTO" color={C.green} progress={0.7} />
              <StatusBox x={380} y={78} w={80} h={40} label="실제 RPO" sub="vs 목표 RPO" color={C.amber} progress={0.6} />

              {/* Report */}
              <Arrow x1={370} y1={120} x2={370} y2={135} color={C.blue} />
              <ModuleBox x={280} y={135} w={180} h={36} label="결과 보고서 → 경영진" sub="예산·인력 확보 근거" color={C.blue} />

              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">훈련 미실시 = ISMS 인증 결함 판정</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
