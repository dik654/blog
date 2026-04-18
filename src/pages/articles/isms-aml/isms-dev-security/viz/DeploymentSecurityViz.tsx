import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  git: '#6366f1',
  review: '#0ea5e9',
  deploy: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '브랜치 전략 — feature → dev → staging → production',
    body: 'feature: 개별 기능. dev: 통합 테스트. staging: 운영 동일 환경에서 최종 검증(보안 스캔+성능). production: 승인 후만 병합. 보호 브랜치 규칙으로 직접 커밋 금지 → PR 필수.',
  },
  {
    label: 'PR 기반 보안 코드 리뷰 — 최소 1명 승인 필수',
    body: '리뷰 체크: 입력값 검증, Prepared Statement, 인증/인가, 시크릿 노출, 에러 정보 노출. 보안 민감 변경은 CODEOWNERS로 보안 담당 추가 리뷰. 자체 승인 금지. force merge 금지.',
  },
  {
    label: 'CI/CD + 스마트 계약 배포 추가 절차',
    body: 'CI/CD: SAST(정적)+의존성 검사+DAST(동적). Critical → 즉시 차단. 시크릿은 마스킹+로그 노출 방지. 스마트 계약: 수정 불가 → 테스트넷 필수, 외부 감사, 버그 바운티, Multi-sig+타임락.',
  },
  {
    label: '롤백 + 변경관리 5단계',
    body: '블루-그린: 환경 2벌, 트래픽 전환, 수 초 롤백. 카나리: 5%부터 점진 확대. DB 스키마: forward-compatible 원칙. 변경관리: RFC → 영향분석 → 승인(CAB) → 배포 → 검증. 긴급 변경은 48시간 내 소급 검토.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#dep-arrow)" />
  );
}

export default function DeploymentSecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dep-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 브랜치 전략 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">브랜치 승격(Promotion) 구조</text>

              <ModuleBox x={15} y={30} w={95} h={48} label="feature" sub="개별 기능 개발" color={C.git} />
              <Arrow x1={110} y1={54} x2={128} y2={54} color={C.git} />

              <ModuleBox x={130} y={30} w={95} h={48} label="dev" sub="통합 테스트" color={C.review} />
              <Arrow x1={225} y1={54} x2={243} y2={54} color={C.review} />

              <ModuleBox x={245} y={30} w={95} h={48} label="staging" sub="최종 검증" color={C.deploy} />
              <Arrow x1={340} y1={54} x2={358} y2={54} color={C.deploy} />

              <ModuleBox x={360} y={30} w={105} h={48} label="production" sub="승인 후만 병합" color={C.deploy} />

              {/* 승격 흐름 애니메이션 */}
              <motion.circle r={3} fill={C.git} opacity={0.5}
                initial={{ cx: 62 }} animate={{ cx: 412 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} cy={54} />

              <line x1={15} y1={92} x2={465} y2={92} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 보호 규칙 */}
              <text x={240} y={110} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>보호 브랜치 규칙</text>

              <AlertBox x={30} y={118} w={190} h={34} label="production: 직접 커밋 금지" sub="PR 통해서만 병합 가능" color={C.danger} />
              <AlertBox x={260} y={118} w={190} h={34} label="staging: 직접 커밋 금지" sub="dev에서 승격만 허용" color={C.danger} />

              {/* 커밋 추적 */}
              <StatusBox x={100} y={165} w={280} h={34} label="GPG 서명 커밋 → 작성자 위조 방지" sub="누가·언제·무엇을·왜 변경했는가 완벽 기록" color={C.git} />

              <text x={240} y={212} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">운영 서버 직접 SSH 코드 수정 — 절대 금지 (변경 추적 불가)</text>
            </motion.g>
          )}

          {/* Step 1: PR 코드 리뷰 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">PR 기반 보안 코드 리뷰</text>

              {/* PR 흐름 */}
              <ActionBox x={15} y={28} w={90} h={38} label="코드 변경" sub="feature 브랜치" color={C.git} />
              <Arrow x1={105} y1={47} x2={123} y2={47} color={C.git} />

              <ActionBox x={125} y={28} w={90} h={38} label="PR 생성" sub="변경 내용 제출" color={C.review} />
              <Arrow x1={215} y1={47} x2={233} y2={47} color={C.review} />

              <ActionBox x={235} y={28} w={100} h={38} label="리뷰어 검토" sub="1명+ 승인 필수" color={C.review} />
              <Arrow x1={335} y1={47} x2={353} y2={47} color={C.deploy} />

              <StatusBox x={355} y={28} w={110} h={38} label="병합 승인" sub="보안 통과 시" color={C.deploy} />

              <line x1={15} y1={80} x2={465} y2={80} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 보안 체크리스트 */}
              <text x={240} y={96} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">보안 리뷰 체크리스트</text>

              <DataBox x={15} y={104} w={85} h={26} label="입력값 검증" color={C.review} />
              <DataBox x={110} y={104} w={100} h={26} label="PreparedStmt" color={C.review} />
              <DataBox x={220} y={104} w={75} h={26} label="인증/인가" color={C.review} />
              <DataBox x={305} y={104} w={80} h={26} label="시크릿 확인" color={C.review} />
              <DataBox x={395} y={104} w={75} h={26} label="에러 정보" color={C.review} />

              {/* 금지 사항 */}
              <line x1={15} y1={145} x2={465} y2={145} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={15} y={152} w={140} h={34} label="자체 승인 금지" sub="작성자 ≠ 리뷰어" color={C.danger} />
              <AlertBox x={170} y={152} w={140} h={34} label="force merge 금지" sub="승인 없이 병합 불가" color={C.danger} />
              <StatusBox x={325} y={152} w={140} h={34} label="CODEOWNERS" sub="보안 민감 → 추가 리뷰" color={C.deploy} />
            </motion.g>
          )}

          {/* Step 2: CI/CD + 스마트 계약 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">CI/CD 보안 + 스마트 계약 추가 절차</text>

              {/* CI/CD 파이프라인 */}
              <ActionBox x={15} y={28} w={90} h={36} label="SAST" sub="정적 분석" color={C.git} />
              <Arrow x1={105} y1={46} x2={118} y2={46} color={C.git} />
              <ActionBox x={120} y={28} w={90} h={36} label="의존성 검사" sub="CVE 확인" color={C.review} />
              <Arrow x1={210} y1={46} x2={223} y2={46} color={C.review} />
              <ActionBox x={225} y={28} w={90} h={36} label="DAST" sub="동적 분석" color={C.review} />
              <Arrow x1={315} y1={46} x2={328} y2={46} color={C.deploy} />
              <StatusBox x={330} y={28} w={60} h={36} label="통과" color={C.deploy} />

              <AlertBox x={400} y={28} w={70} h={36} label="실패" sub="즉시 차단" color={C.danger} />
              <Arrow x1={360} y1={36} x2={398} y2={36} color={C.danger} />

              <line x1={15} y1={78} x2={465} y2={78} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 스마트 계약 */}
              <text x={240} y={94} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>스마트 계약: 배포 후 수정 불가 → 사전 검증 필수</text>

              <ActionBox x={15} y={102} w={100} h={38} label="테스트넷 배포" sub="메인넷 시뮬레이션" color={C.git} />
              <Arrow x1={115} y1={121} x2={133} y2={121} color={C.git} />

              <ActionBox x={135} y={102} w={100} h={38} label="외부 감사" sub="제3자 정밀 분석" color={C.review} />
              <Arrow x1={235} y1={121} x2={253} y2={121} color={C.review} />

              <ActionBox x={255} y={102} w={100} h={38} label="버그 바운티" sub="지속 취약점 수집" color={C.review} />
              <Arrow x1={355} y1={121} x2={373} y2={121} color={C.deploy} />

              <StatusBox x={375} y={102} w={95} h={38} label="메인넷 배포" sub="승인 후" color={C.deploy} />

              {/* 업그레이드 통제 */}
              <line x1={15} y1={155} x2={465} y2={155} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <StatusBox x={80} y={162} w={160} h={34} label="프록시 패턴 업그레이드" sub="구조적 수정 가능성 확보" color={C.git} />
              <AlertBox x={260} y={162} w={160} h={34} label="Multi-sig + Timelock" sub="단일 관리자 임의 변경 방지" color={C.danger} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">시크릿: 마스킹 저장 + 로그 노출 방지</text>
            </motion.g>
          )}

          {/* Step 3: 롤백 + 변경관리 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">롤백 전략 + 변경관리 5단계</text>

              {/* 블루-그린 */}
              <ModuleBox x={15} y={28} w={130} h={42} label="블루-그린" sub="환경 2벌 유지" color={C.review} />
              <text x={80} y={82} textAnchor="middle" fontSize={8} fill={C.review}>장애 시 트래픽 전환</text>
              <text x={80} y={93} textAnchor="middle" fontSize={8} fill={C.deploy} fontWeight={600}>수 초 롤백</text>

              {/* 카나리 */}
              <ModuleBox x={170} y={28} w={130} h={42} label="카나리" sub="5%부터 점진 확대" color={C.review} />
              <text x={235} y={82} textAnchor="middle" fontSize={8} fill={C.review}>이상 시 0%로 회복</text>
              <text x={235} y={93} textAnchor="middle" fontSize={8} fill={C.deploy} fontWeight={600}>피해 최소화</text>

              {/* DB 스키마 */}
              <AlertBox x={325} y={28} w={140} h={42} label="DB 스키마 변경" sub="forward-compatible 원칙" color={C.danger} />
              <text x={395} y={82} textAnchor="middle" fontSize={8} fill={C.danger}>컬럼 삭제/이름변경</text>
              <text x={395} y={93} textAnchor="middle" fontSize={8} fill={C.danger}>→ 별도 단계 분리</text>

              <line x1={15} y1={102} x2={465} y2={102} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 변경관리 5단계 */}
              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">변경관리 5단계 (Change Management)</text>

              <ActionBox x={10} y={126} w={80} h={36} label="RFC" sub="변경 요청" color={C.git} />
              <Arrow x1={90} y1={144} x2={103} y2={144} color={C.git} />

              <ActionBox x={105} y={126} w={80} h={36} label="영향 분석" sub="범위·롤백 평가" color={C.review} />
              <Arrow x1={185} y1={144} x2={198} y2={144} color={C.review} />

              <ActionBox x={200} y={126} w={80} h={36} label="승인" sub="CAB 검토" color={C.review} />
              <Arrow x1={280} y1={144} x2={293} y2={144} color={C.deploy} />

              <ActionBox x={295} y={126} w={80} h={36} label="배포" sub="CI/CD 실행" color={C.deploy} />
              <Arrow x1={375} y1={144} x2={388} y2={144} color={C.deploy} />

              <StatusBox x={390} y={126} w={80} h={36} label="검증" sub="정상 확인" color={C.deploy} />

              <motion.circle r={3} fill={C.git} opacity={0.5}
                initial={{ cx: 50 }} animate={{ cx: 430 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={144} />

              {/* 긴급 변경 */}
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill={C.danger} fontWeight={600}>긴급 변경: 사후 승인 가능, 48시간 내 소급 검토 완료</text>
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 변경 이력: 언제·누가·무엇을·누가 승인·결과 추적 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
