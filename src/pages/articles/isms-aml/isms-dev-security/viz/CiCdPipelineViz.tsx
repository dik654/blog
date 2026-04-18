import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  primary: '#6366f1',
  action: '#f59e0b',
  safe: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: 'CI/CD 파이프라인 보안 단계',
    body: '커밋 → SAST(정적) → 빌드 → 의존성 검사 → DAST(동적) → 배포 승인.\nCritical/High 발견 시 파이프라인 중단 → 취약한 코드가 운영에 도달하지 않도록.',
  },
  {
    label: '스마트 계약 + 롤백 절차',
    body: '스마트 계약: 배포 후 수정 불가 → 테스트넷 필수 + 외부 감사 + 버그 바운티.\n롤백: 블루-그린(트래픽 전환) / 카나리(5% 먼저 적용) — 수 초 내 복원 가능.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cicd-pl-arr)" />;
}

export default function CiCdPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cicd-pl-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>CI/CD 보안 파이프라인</text>

              {/* 파이프라인 단계 */}
              <DataBox x={5} y={30} w={55} h={24} label="커밋" color={C.primary} />
              <Arrow x1={60} y1={42} x2={73} y2={42} color={C.primary} />

              <ActionBox x={75} y={28} w={60} h={28} label="SAST" sub="정적 분석" color={C.primary} />
              <Arrow x1={135} y1={42} x2={148} y2={42} color={C.action} />

              <ActionBox x={150} y={28} w={55} h={28} label="빌드" sub="" color={C.action} />
              <Arrow x1={205} y1={42} x2={218} y2={42} color={C.action} />

              <ActionBox x={220} y={28} w={72} h={28} label="의존성 검사" sub="CVE 확인" color={C.action} />
              <Arrow x1={292} y1={42} x2={305} y2={42} color={C.danger} />

              <ActionBox x={307} y={28} w={60} h={28} label="DAST" sub="동적 분석" color={C.danger} />
              <Arrow x1={367} y1={42} x2={380} y2={42} color={C.safe} />

              <StatusBox x={382} y={28} w={90} h={28} label="배포 승인" sub="" color={C.safe} progress={1} />

              {/* 실패 시 */}
              <Arrow x1={337} y1={56} x2={337} y2={72} color={C.danger} />
              <AlertBox x={285} y={72} w={105} h={26} label="Critical → 중단" sub="" color={C.danger} />

              <rect x={10} y={108} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 심각도별 정책 */}
              <text x={240} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>심각도별 대응 정책</text>

              <rect x={20} y={134} width={130} height={36} rx={4} fill="var(--card)" stroke={C.danger} strokeWidth={0.8} />
              <text x={85} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>Critical / High</text>
              <text x={85} y={163} textAnchor="middle" fontSize={7.5} fill={C.danger}>파이프라인 즉시 차단</text>

              <rect x={170} y={134} width={130} height={36} rx={4} fill="var(--card)" stroke={C.action} strokeWidth={0.8} />
              <text x={235} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.action}>Medium</text>
              <text x={235} y={163} textAnchor="middle" fontSize={7.5} fill={C.action}>경고 + 기간 내 수정</text>

              <rect x={320} y={134} width={130} height={36} rx={4} fill="var(--card)" stroke={C.safe} strokeWidth={0.8} />
              <text x={385} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>Low</text>
              <text x={385} y={163} textAnchor="middle" fontSize={7.5} fill={C.safe}>로그 기록만</text>

              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">파이프라인 자체 보안도 중요 — 배포 키/시크릿 마스킹, 로그 미노출</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.action}>롤백 전략: 블루-그린 vs 카나리</text>

              {/* 블루-그린 */}
              <rect x={10} y={28} width={220} height={80} rx={8} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={120} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>블루-그린 배포</text>

              <rect x={20} y={52} width={80} height={24} rx={4} fill={`${C.primary}15`} stroke={C.primary} strokeWidth={0.5} />
              <text x={60} y={68} textAnchor="middle" fontSize={8} fill={C.primary}>Blue (현재)</text>

              <rect x={110} y={52} width={80} height={24} rx={4} fill={`${C.safe}15`} stroke={C.safe} strokeWidth={0.5} />
              <text x={150} y={68} textAnchor="middle" fontSize={8} fill={C.safe}>Green (신규)</text>

              <text x={120} y={90} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">트래픽 전환으로 수 초 내 롤백</text>
              <text x={120} y={102} textAnchor="middle" fontSize={7.5} fill={C.primary}>장애 시 Blue로 즉시 복귀</text>

              {/* 카나리 */}
              <rect x={250} y={28} width={220} height={80} rx={8} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={360} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>카나리 배포</text>

              {/* 카나리 비율 바 */}
              <rect x={260} y={55} width={200} height={12} rx={6} fill={C.primary} opacity={0.3} />
              <rect x={260} y={55} width={20} height={12} rx={6} fill={C.action} />
              <text x={360} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">5% 먼저 적용 → 안정 확인 → 점진 확대</text>
              <text x={360} y={92} textAnchor="middle" fontSize={7.5} fill={C.action}>이상 시 카나리 비율 0%로 즉시 복귀</text>
              <text x={360} y={102} textAnchor="middle" fontSize={7.5} fill={C.safe}>피해 범위 최소화</text>

              <rect x={10} y={120} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 스마트 계약 특수 */}
              <text x={240} y={138} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>스마트 계약: 배포 후 수정 불가</text>

              <ActionBox x={15} y={146} w={105} h={28} label="테스트넷 배포" sub="시뮬레이션 필수" color={C.action} />
              <Arrow x1={120} y1={160} x2={133} y2={160} color={C.action} />

              <ActionBox x={135} y={146} w={95} h={28} label="외부 감사" sub="제3자 코드 분석" color={C.primary} />
              <Arrow x1={230} y1={160} x2={243} y2={160} color={C.primary} />

              <ActionBox x={245} y={146} w={95} h={28} label="버그 바운티" sub="지속적 수집" color={C.safe} />
              <Arrow x1={340} y1={160} x2={353} y2={160} color={C.safe} />

              <ActionBox x={355} y={146} w={115} h={28} label="프록시 업그레이드" sub="Multi-sig + Timelock" color={C.danger} />

              <text x={240} y={196} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">일반 서비스의 "배포 후 패치" 전략이 통하지 않으므로 사전 검증이 훨씬 엄격</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
