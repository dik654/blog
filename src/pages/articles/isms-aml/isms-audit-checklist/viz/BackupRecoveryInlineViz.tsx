import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, StatusBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  backup: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '백업 검증 포인트', body: '연속성(빠진 날짜), 크기 일관성, 실패 알림, 암호화, 소산 백업 — 5가지를 확인.' },
  { label: '복구 테스트 + NTP', body: '연 1회 이상 복구 테스트 보고서 필수. NTP 동기화가 안 되면 로그 시간 정합성 붕괴.' },
  { label: '변경관리 기록', body: '시스템 변경 시 요청서·이력대장·긴급변경 사후보고서. 변경 건 있는데 이력 없으면 결함.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#bri-arrow)" />;
}

export default function BackupRecoveryInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bri-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">백업 정상 수행 5대 확인</text>

              <DataBox x={15} y={28} w={85} h={38} label="연속성" color={C.backup} />
              <text x={57} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">빠진 날짜 없는지</text>

              <DataBox x={110} y={28} w={85} h={38} label="크기 일관" color={C.backup} />
              <text x={152} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">갑자기 0 = 비정상</text>

              <DataBox x={205} y={28} w={80} h={38} label="실패 알림" color={C.warn} />
              <text x={245} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">Slack/Email/SMS</text>

              <DataBox x={295} y={28} w={80} h={38} label="암호화" color={C.fail} />
              <text x={335} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">AES-256 필수</text>

              <DataBox x={385} y={28} w={80} h={38} label="소산 백업" color={C.fail} />
              <text x={425} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">물리적 분리 보관</text>

              <rect x={30} y={95} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={108} w={190} h={38} label="crontab -l" sub="백업 스케줄 + 로그 경로 확인" color={C.backup} />
              <ActionBox x={240} y={108} w={210} h={38} label="ls -lh /backup/daily/" sub="최근 파일 타임스탬프 + 크기 확인" color={C.ok} />

              <AlertBox x={60} y={162} w={360} h={30} label="개인정보 포함 백업 파일 평문 저장 = 결함" sub="" color={C.fail} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">복구 테스트 + NTP 동기화</text>

              {/* 복구 테스트 */}
              <ActionBox x={15} y={28} w={100} h={40} label="백업 파일" sub="테스트 환경 복원" color={C.backup} />
              <Arrow x1={115} y1={48} x2={133} y2={48} color={C.backup} />
              <ActionBox x={135} y={28} w={100} h={40} label="데이터 검증" sub="레코드 수 비교" color={C.ok} />
              <Arrow x1={235} y1={48} x2={253} y2={48} color={C.ok} />
              <StatusBox x={255} y={28} w={100} h={40} label="RPO 달성" sub="목표 시점 복구" color={C.ok} progress={0.8} />
              <Arrow x1={355} y1={48} x2={373} y2={48} color={C.ok} />
              <ModuleBox x={375} y={28} w={90} h={40} label="보고서 작성" sub="연 1회 필수" color={C.warn} />

              <rect x={30} y={85} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* NTP */}
              <ModuleBox x={30} y={98} w={130} h={40} label="timedatectl" sub="NTP 동기화 상태" color={C.backup} />
              <Arrow x1={160} y1={118} x2={178} y2={108} color={C.ok} />
              <Arrow x1={160} y1={118} x2={178} y2={128} color={C.fail} />

              <DataBox x={180} y={95} w={135} h={28} label="synchronized: yes" color={C.ok} />
              <AlertBox x={180} y={128} w={135} h={28} label="synchronized: no" sub="" color={C.fail} />

              <Arrow x1={315} y1={109} x2={348} y2={118} color={C.warn} />
              <Arrow x1={315} y1={142} x2={348} y2={133} color={C.warn} />
              <ModuleBox x={350} y={100} w={115} h={42} label="시간 오차 확인" sub="수 초 이상 = 불량" color={C.warn} />

              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">NTP 미동기화 → 서버 간 로그 시간 정합성 붕괴 → 사고 분석 불가</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">변경관리 기록 체계</text>

              <ActionBox x={15} y={30} w={100} h={42} label="변경 요청서" sub="내용·영향·롤백" color={C.backup} />
              <Arrow x1={115} y1={51} x2={133} y2={51} color={C.backup} />

              <ActionBox x={135} y={30} w={100} h={42} label="승인" sub="요청자·승인자" color={C.ok} />
              <Arrow x1={235} y1={51} x2={253} y2={51} color={C.ok} />

              <ActionBox x={255} y={30} w={100} h={42} label="변경 실행" sub="대상·수행자·결과" color={C.warn} />
              <Arrow x1={355} y1={51} x2={373} y2={51} color={C.warn} />

              <ActionBox x={375} y={30} w={90} h={42} label="이력 기록" sub="변경 이력 대장" color={C.ok} />

              <rect x={30} y={90} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={102} w={200} h={38} label="변경 건 있으나 이력 없음" sub="변경관리 절차 미준수 결함" color={C.fail} />
              <AlertBox x={250} y={102} w={200} h={38} label="긴급 변경 사후보고 없음" sub="사전 승인 없이 변경 + 미보고" color={C.fail} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">심사원이 서버 audit.log와 변경 이력 대장을 대조하여 검증 가능</text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">변경 없었다고 답변해도 실제 로그와 비교</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
