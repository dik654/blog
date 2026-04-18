import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '서면심사: 문서 논리 검증',
    body: '정책서가 실제 환경을 반영하는지(템플릿 복사 판별), 자산 목록 완전성, 위험평가와 보호대책의 추적성, 문서 간 버전/날짜 일관성을 확인.',
  },
  {
    label: '현장심사: 문서 vs 현실',
    body: '3~5일, 심사원 2~4명이 영역별 분담. 출입통제 직접 시도, DB 로그 추출 검증, 임의 직원 MFA 확인, 퇴사자 계정 조회 등 랜덤 샘플링 방식.',
  },
  {
    label: '결함 도출: 중결함 vs 경결함',
    body: '중결함 = 기준을 전혀 이행하지 않음 → 보완 미완료 시 인증 불가. 경결함 = 부분 이행이나 일부 미흡 → 보완 후 인증 가능. 결함 번호는 인증 기준 번호 체계를 따름.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#as-arrow)" />;
}

export default function AuditStagesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="as-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={5} w={160} h={38} label="서면심사" sub="제출 문서 검토" color={C.blue} />

              {/* 4 check points */}
              <Arrow x1={200} y1={43} x2={80} y2={65} />
              <Arrow x1={220} y1={43} x2={195} y2={65} />
              <Arrow x1={270} y1={43} x2={310} y2={65} />
              <Arrow x1={290} y1={43} x2={415} y2={65} />

              <motion.g initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <ActionBox x={20} y={68} w={120} h={38} label="정책서 검증" sub="템플릿 복사 판별" color={C.blue} />
                <ActionBox x={155} y={68} w={110} h={38} label="자산 목록" sub="범위 내 전수 포함" color={C.blue} />
                <ActionBox x={280} y={68} w={100} h={38} label="추적성" sub="위험→보호대책" color={C.green} />
                <ActionBox x={395} y={68} w={75} h={38} label="일관성" sub="버전/날짜" color={C.green} />
              </motion.g>

              {/* Example of inconsistency */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <AlertBox x={80} y={125} w={320} h={36} label="결함 예시: 정책 승인일이 이행 완료일보다 뒤" sub="정책 승인 2024-03 → 이행 완료 2024-01 = 논리 모순" color={C.red} />
              </motion.g>

              <text x={240} y={182} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">중대한 누락 발견 시 현장심사 전에 보완 요청 가능</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">현장심사: 랜덤 샘플링 검증</text>

              {/* Auditor team */}
              <ModuleBox x={10} y={30} w={120} h={42} label="심사원 팀" sub="2~4명, 3~5일" color={C.green} />

              {/* Random sampling */}
              <Arrow x1={130} y1={51} x2={155} y2={51} />

              {/* Audit targets */}
              <rect x={160} y={25} width={310} height={110} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={315} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>검증 대상 (랜덤 선정)</text>

              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <DataBox x={170} y={50} w={140} h={20} label="서버실 출입통제 직접 시도" color={C.green} />
                <DataBox x={320} y={50} w={140} h={20} label="DB 접근 로그 추출" color={C.green} />
                <DataBox x={170} y={78} w={140} h={20} label="임의 직원 MFA 확인" color={C.green} />
                <DataBox x={320} y={78} w={140} h={20} label="퇴사자 계정 조회" color={C.green} />
                <DataBox x={170} y={106} w={140} h={20} label="백업 복구 보고서 확인" color={C.green} />
                <DataBox x={320} y={106} w={140} h={20} label="교육 수료 증적 확인" color={C.green} />
              </motion.g>

              {/* Warning */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <AlertBox x={60} y={150} w={360} h={32} label="전수 검사 아닌 랜덤 샘플링" sub="직원 200명 중 10명 선정, 서버 20대 중 3대 선정 → '일부만 준비' 전략은 위험" color={C.amber} />
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">결함 분류 체계</text>

              {/* Two types */}
              <rect x={30} y={30} width={190} height={55} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1.2} />
              <text x={125} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>중결함</text>
              <text x={125} y={64} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">기준을 전혀 이행하지 않음</text>
              <text x={125} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>보완 미완료 → 인증 불가</text>

              <rect x={260} y={30} width={190} height={55} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={355} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>경결함</text>
              <text x={355} y={64} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">부분 이행, 일부 미흡</text>
              <text x={355} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>보완조치 후 인증 가능</text>

              {/* Defect number example */}
              <Arrow x1={240} y1={88} x2={240} y2={105} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={80} y={108} width={320} height={40} rx={8} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
                <text x={240} y={125} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">결함 번호 체계 = 인증 기준 번호</text>
                <text x={240} y={141} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">결함 2.5.6 = 보호대책(2) → 인증/권한(5) → 6번 항목</text>
              </motion.g>

              {/* Defect report contents */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <text x={240} y={168} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">결함 보고서 구성</text>
                <DataBox x={30} y={175} w={100} h={20} label="결함 번호" color={C.blue} />
                <DataBox x={140} y={175} w={90} h={20} label="유형 (중/경)" color={C.blue} />
                <DataBox x={240} y={175} w={100} h={20} label="심사 소견" color={C.blue} />
                <DataBox x={350} y={175} w={100} h={20} label="관련 증거" color={C.blue} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
