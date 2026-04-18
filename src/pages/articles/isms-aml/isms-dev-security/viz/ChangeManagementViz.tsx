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
    label: '변경관리 5단계 절차',
    body: 'RFC(변경 요청) → 영향 분석 → CAB 승인 → 파이프라인 배포 → 배포 후 검증.\n긴급 변경은 사후 승인 가능하지만 48시간 이내 소급 검토 필수.',
  },
  {
    label: '브랜치 전략 + PR 기반 코드 리뷰',
    body: 'feature → dev → staging → production 순서의 승격 구조.\nprotected branch: 직접 커밋 금지, PR 통해서만 병합. 최소 1명 리뷰어 승인 필수.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#chg-mgmt-arr)" />;
}

export default function ChangeManagementViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="chg-mgmt-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>변경관리 5단계 절차</text>

              {/* 5단계 */}
              <DataBox x={5} y={32} w={72} h={28} label="RFC" color={C.primary} />
              <text x={41} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">변경 요청서</text>
              <Arrow x1={77} y1={46} x2={93} y2={46} color={C.action} />

              <ActionBox x={95} y={30} w={78} h={32} label="영향 분석" sub="범위·롤백·자원" color={C.action} />
              <Arrow x1={173} y1={46} x2={189} y2={46} color={C.action} />

              <ActionBox x={191} y={30} w={72} h={32} label="CAB 승인" sub="검토·승인" color={C.action} />
              <Arrow x1={263} y1={46} x2={279} y2={46} color={C.safe} />

              <ActionBox x={281} y={30} w={78} h={32} label="배포" sub="CI/CD 실행" color={C.safe} />
              <Arrow x1={359} y1={46} x2={375} y2={46} color={C.safe} />

              <StatusBox x={377} y={30} w={95} h={32} label="검증" sub="서비스 정상 확인" color={C.safe} progress={1} />

              {/* 긴급 변경 */}
              <rect x={10} y={85} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>긴급 변경(Emergency Change)</text>

              <DataBox x={40} y={112} w={80} h={26} label="긴급 장애" color={C.danger} />
              <Arrow x1={120} y1={125} x2={148} y2={125} color={C.danger} />
              <ActionBox x={150} y={110} w={80} h={30} label="즉시 배포" sub="사전 승인 생략" color={C.danger} />
              <Arrow x1={230} y1={125} x2={258} y2={125} color={C.action} />
              <ActionBox x={260} y={110} w={100} h={30} label="48시간 내" sub="소급 검토 완료" color={C.action} />
              <Arrow x1={360} y1={125} x2={388} y2={125} color={C.safe} />
              <StatusBox x={390} y={110} w={80} h={30} label="승인 기록" sub="" color={C.safe} progress={1} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"언제, 누가, 무엇을 변경, 누가 승인, 결과" 추적 가능 = 변경관리의 최종 목표</text>
              <text x={240} y={182} textAnchor="middle" fontSize={7.5} fill={C.primary}>ISMS: 무계획적 변경은 장애의 가장 흔한 원인</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>브랜치 전략: 4단계 승격</text>

              {/* 브랜치 승격 */}
              <DataBox x={5} y={35} w={78} h={26} label="feature" color={C.primary} />
              <Arrow x1={83} y1={48} x2={101} y2={48} color={C.primary} />

              <DataBox x={103} y={35} w={68} h={26} label="dev" color={C.primary} />
              <Arrow x1={171} y1={48} x2={189} y2={48} color={C.action} />
              <text x={180} y={40} fontSize={7} fill={C.action}>통합 테스트</text>

              <DataBox x={191} y={35} w={78} h={26} label="staging" color={C.action} />
              <Arrow x1={269} y1={48} x2={287} y2={48} color={C.safe} />
              <text x={278} y={40} fontSize={7} fill={C.safe}>보안 스캔</text>

              <DataBox x={289} y={35} w={88} h={26} label="production" color={C.safe} />
              <text x={333} y={72} textAnchor="middle" fontSize={7.5} fill={C.danger}>승인권자 명시적 승인 필요</text>

              {/* 보호 브랜치 */}
              <rect x={385} y={30} width={90} height={40} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={430} y={47} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>Protected</text>
              <text x={430} y={61} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">직접 커밋 금지</text>

              <rect x={10} y={85} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* PR 기반 코드 리뷰 */}
              <text x={240} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.action}>PR 기반 보안 리뷰 체크리스트</text>

              <ActionBox x={10} y={112} w={105} h={35} label="입력값 검증" sub="서버 측 수행?" color={C.action} />
              <ActionBox x={125} y={112} w={105} h={35} label="SQL 안전성" sub="Prepared Stmt?" color={C.action} />
              <ActionBox x={240} y={112} w={105} h={35} label="인증/인가" sub="타인 리소스 차단?" color={C.primary} />
              <ActionBox x={355} y={112} w={115} h={35} label="민감정보 미노출" sub="키·토큰·PW 없는가?" color={C.danger} />

              <rect x={40} y={160} width={400} height={34} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={174} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>필수 규칙</text>
              <text x={240} y={188} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">최소 1명 리뷰어 승인. 자체 코드 자체 승인 금지. 보안 변경은 CODEOWNERS 추가 리뷰.</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
