import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'DB 복구: 다운로드 → 복호화 → Import → 검증',
    body: 'S3에서 덤프 다운로드 → KMS 복호화 → 동일 버전 DB에 Import → 테이블·레코드 수 대조 → 앱 연결 테스트 → RTO 준수 확인.',
  },
  {
    label: '시스템 복구: 디스크 이미지 → 부팅 → 설정 확인',
    body: 'Clonezilla 이미지로 복원 → 부팅 확인(부트로더·드라이버 점검) → 네트워크·방화벽·크론 설정 검토 → 서비스 순차 기동.',
  },
  {
    label: '복구 테스트 + 시나리오별 절차서',
    body: '백업 직후 테스트 수행(월별 샘플링 + 분기별 전체 복원). DB장애·서버장애·랜섬웨어·자연재해 시나리오별 절차서 사전 작성.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#br-rp-arrow)" />;
}

export default function RecoveryProcedureInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-rp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={5} y={15} w={80} h={28} label="S3 다운로드" sub="덤프 파일" color={C.blue} />
              <Arrow x1={87} y1={29} x2={103} y2={29} color={C.blue} />
              <ActionBox x={105} y={15} w={80} h={28} label="KMS 복호화" sub="AES-256" color={C.amber} />
              <Arrow x1={187} y1={29} x2={203} y2={29} color={C.amber} />
              <ActionBox x={205} y={15} w={80} h={28} label="DB Import" sub="동일 버전" color={C.green} />
              <Arrow x1={287} y1={29} x2={303} y2={29} color={C.green} />
              <ActionBox x={305} y={15} w={80} h={28} label="데이터 대조" sub="테이블·레코드" color={C.red} />
              <Arrow x1={387} y1={29} x2={403} y2={29} color={C.red} />
              <ActionBox x={405} y={15} w={65} h={28} label="앱 테스트" sub="읽기/쓰기" color={C.green} />

              <Arrow x1={245} y1={45} x2={245} y2={65} color={C.green} />
              <AlertBox x={120} y={67} w={240} h={30} label="DB 버전 불일치 시 호환성 문제" sub="백업 시 버전 함께 기록" color={C.red} />

              <Arrow x1={437} y1={45} x2={350} y2={115} color={C.green} />
              <StatusBox x={200} y={112} w={200} h={30} label="복구 소요 시간 기록" sub="RTO 준수 여부 확인" color={C.blue} progress={0.7} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">이상 없으면 복구 완료 판정</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={15} w={100} h={30} label="디스크 이미지" sub="Clonezilla" color={C.blue} />
              <Arrow x1={112} y1={30} x2={138} y2={30} color={C.blue} />
              <ActionBox x={140} y={15} w={80} h={30} label="부팅 확인" sub="부트로더" color={C.amber} />
              <Arrow x1={222} y1={30} x2={248} y2={30} color={C.amber} />
              <ActionBox x={250} y={15} w={90} h={30} label="설정 검토" sub="네트워크·방화벽" color={C.green} />
              <Arrow x1={342} y1={30} x2={368} y2={30} color={C.green} />
              <ActionBox x={370} y={15} w={100} h={30} label="서비스 순차 기동" sub="nginx·mysql·app" color={C.green} />

              <Arrow x1={180} y1={47} x2={180} y2={68} color={C.amber} />
              <rect x={80} y={70} width={200} height={36} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={180} y={86} textAnchor="middle" fontSize={9} fill="var(--foreground)">부팅 실패 흔한 원인</text>
              <text x={180} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">부트로더 손상 / 드라이버 불일치 / UUID 변경</text>

              <Arrow x1={310} y1={47} x2={310} y2={68} color={C.green} />
              <rect x={290} y={70} width={180} height={36} rx={5} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={380} y={86} textAnchor="middle" fontSize={9} fill="var(--foreground)">IP·게이트웨이·DNS</text>
              <text x={380} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">방화벽 룰 + 크론 스케줄</text>

              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">서비스를 하나씩 기동하며 각각 정상 동작 확인</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={210} h={30} label="복구 테스트" sub="백업 직후 수행이 가장 효과적" color={C.blue} />
              <ModuleBox x={260} y={10} w={210} h={30} label="시나리오별 절차서" sub="담당자·시간·도구·연락처 포함" color={C.amber} />

              <Arrow x1={115} y1={42} x2={70} y2={58} color={C.blue} />
              <Arrow x1={115} y1={42} x2={160} y2={58} color={C.blue} />

              <DataBox x={10} y={60} w={120} h={28} label="월별 샘플링" sub="주요 DB 5~10개" color={C.green} />
              <DataBox x={140} y={60} w={120} h={28} label="분기별 전체" sub="시스템 전체 복원" color={C.blue} />

              <Arrow x1={365} y1={42} x2={310} y2={58} color={C.amber} />
              <Arrow x1={365} y1={42} x2={420} y2={58} color={C.amber} />

              <DataBox x={260} y={60} w={100} h={28} label="DB 장애" sub="binlog 재생" color={C.red} />
              <DataBox x={370} y={60} w={100} h={28} label="랜섬웨어" sub="클린 재설치" color={C.red} />

              <rect x={260} y={96} width={210} height={28} rx={5} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={365} y={114} textAnchor="middle" fontSize={9} fill="var(--foreground)">서버 장애 / 자연재해(DR 사이트)</text>

              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">테스트 없이 "백업 있으니 안전"은 위험한 착각</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
