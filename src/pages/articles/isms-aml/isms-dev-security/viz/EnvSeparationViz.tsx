import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  dev: '#6366f1',
  staging: '#f59e0b',
  prod: '#ef4444',
  safe: '#10b981',
};

const STEPS = [
  {
    label: '3환경 분리: 개발 → 테스트 → 운영',
    body: '개발(전체 권한, 테스트 데이터) → 테스트(보안 검수, 가명 데이터) → 운영(최소 권한, 실 데이터).\n환경 간 코드 이동은 파이프라인 전용. 개발자가 운영 서버에 직접 SSH 접속 절대 금지.',
  },
  {
    label: '보안 검수: SAST + DAST 이중 분석',
    body: 'SAST(정적 분석): 소스코드를 실행 없이 파싱하여 취약 패턴 탐지. 개발 초기에.\nDAST(동적 분석): 실행 중인 앱에 모의 공격 수행. 테스트 배포 후. CI/CD에 통합.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#env-sep-arr)" />;
}

export default function EnvSeparationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="env-sep-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.staging}>3환경 분리와 코드 이동 경로</text>

              {/* 3개 환경 */}
              <rect x={10} y={28} width={140} height={75} rx={8} fill={`${C.dev}08`} stroke={C.dev} strokeWidth={0.7} />
              <text x={80} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dev}>개발 (Development)</text>
              <text x={80} y={58} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">전체 권한</text>
              <text x={80} y={70} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">테스트 데이터만</text>
              <text x={80} y={82} textAnchor="middle" fontSize={7.5} fill={C.dev}>실제 데이터 금지</text>

              <Arrow x1={150} y1={65} x2={168} y2={65} color={C.staging} />

              <rect x={170} y={28} width={140} height={75} rx={8} fill={`${C.staging}08`} stroke={C.staging} strokeWidth={0.7} />
              <text x={240} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.staging}>테스트 (Staging)</text>
              <text x={240} y={58} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">보안 검수 + 성능 테스트</text>
              <text x={240} y={70} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">가명처리 데이터</text>
              <text x={240} y={82} textAnchor="middle" fontSize={7.5} fill={C.staging}>운영과 동일 환경</text>

              <Arrow x1={310} y1={65} x2={328} y2={65} color={C.prod} />
              <text x={318} y={58} fontSize={7} fill={C.prod}>승인 후</text>

              <rect x={330} y={28} width={140} height={75} rx={8} fill={`${C.prod}08`} stroke={C.prod} strokeWidth={0.7} />
              <text x={400} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.prod}>운영 (Production)</text>
              <text x={400} y={58} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">최소 권한</text>
              <text x={400} y={70} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">실제 이용자 데이터</text>
              <text x={400} y={82} textAnchor="middle" fontSize={7.5} fill={C.prod}>개발자 접근 제한</text>

              <rect x={10} y={115} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 금지 패턴 */}
              <AlertBox x={30} y={125} w={190} h={35} label="금지: 운영 서버 직접 SSH" sub="변경 추적 불가, 롤백 불가" color={C.prod} />
              <rect x={250} y={125} width={200} height={35} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={350} y={140} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>올바른 경로</text>
              <text x={350} y={154} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">파이프라인을 통해서만 코드 이동</text>

              <text x={240} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">운영 DB에는 고객 자산 잔고 + 개인정보 → 개발 환경에서 접근 시 정보유출 사고</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>보안 검수: SAST + DAST 이중 분석</text>

              {/* SAST 흐름 */}
              <rect x={10} y={28} width={220} height={72} rx={8} fill="var(--card)" stroke={C.dev} strokeWidth={0.5} />
              <text x={120} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dev}>SAST (정적 분석)</text>
              <text x={120} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">소스코드 파싱 → 취약 패턴 탐지</text>
              <text x={120} y={72} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">SQL Injection, 하드코딩 시크릿</text>
              <DataBox x={60} y={82} w={120} h={14} label="개발 초기 적용" color={C.dev} />

              {/* DAST 흐름 */}
              <rect x={250} y={28} width={220} height={72} rx={8} fill="var(--card)" stroke={C.staging} strokeWidth={0.5} />
              <text x={360} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.staging}>DAST (동적 분석)</text>
              <text x={360} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실행 중 앱에 모의 공격 수행</text>
              <text x={360} y={72} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">인젝션, 인증 우회, 정보 노출</text>
              <DataBox x={300} y={82} w={120} h={14} label="테스트 배포 후" color={C.staging} />

              <rect x={10} y={110} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* CI/CD 통합 */}
              <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>CI/CD 파이프라인 통합</text>

              <DataBox x={10} y={138} w={65} h={24} label="커밋" color={C.dev} />
              <Arrow x1={75} y1={150} x2={93} y2={150} color={C.dev} />
              <ActionBox x={95} y={136} w={70} h={28} label="SAST" sub="정적 분석" color={C.dev} />
              <Arrow x1={165} y1={150} x2={183} y2={150} color={C.staging} />
              <ActionBox x={185} y={136} w={70} h={28} label="빌드" sub="" color={C.staging} />
              <Arrow x1={255} y1={150} x2={273} y2={150} color={C.staging} />
              <ActionBox x={275} y={136} w={70} h={28} label="DAST" sub="동적 분석" color={C.staging} />
              <Arrow x1={345} y1={150} x2={363} y2={150} color={C.safe} />
              <ModuleBox x={365} y={134} w={105} h={32} label="배포 승인" sub="보안 검사 통과" color={C.safe} />

              <text x={240} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Critical/High → 즉시 차단, Medium → 기간 내 수정, Low → 로그 기록</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
