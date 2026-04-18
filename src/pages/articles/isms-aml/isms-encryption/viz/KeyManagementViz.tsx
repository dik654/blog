import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  danger: '#ef4444',
  action: '#6366f1',
  safe: '#10b981',
  warn: '#f59e0b',
};

const STEPS = [
  {
    label: '하드코딩의 위험 — 소스코드에 키가 남으면 영구 유출',
    body: '코드에 키를 직접 작성하면 Git 이력에 영구 잔존. 커밋 삭제 후에도 reflog/백업에 흔적. 오픈소스 저장소는 수 분 내 자동 스캐너가 수집. git-secrets / pre-commit hook이 1차 방어선.',
  },
  {
    label: '환경변수 → 시크릿 매니저로 진화',
    body: '.env 파일(권한 600) + .gitignore가 기본이지만, 다중 서버에서는 관리 한계. Secrets Manager는 IAM 정책 기반 접근 통제 + 접근 로그 + 재배포 없이 변경 가능. Vault는 Shamir 분할로 봉인/개봉하고, 동적 시크릿으로 TTL 후 자동 폐기.',
  },
  {
    label: '키 회전 — DEK/KEK 봉투 암호화로 비용 최소화',
    body: '새 키 생성 → 활성 지정 → 기존 키 비활성 → 신규 데이터는 새 키로 암호화 → 배경 작업으로 재암호화 → 이전 키 폐기. DEK(90일~1년)가 데이터를 암호화하고, KEK(1~3년)가 DEK를 래핑하는 봉투 암호화 구조.',
  },
  {
    label: '백업 암호화 + 인증서 관리',
    body: 'AES-256으로 백업 암호화, 키와 백업은 별도 보관. 소산백업은 TLS 전송 + 암호화 유지. certbot이 90일 인증서를 자동 갱신하고 만료 14/7/1일 전 알림 발송. 개인키는 HSM에 보관.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#km-arrow)"
      strokeDasharray={dashed ? '3 2' : undefined} />
  );
}

export default function KeyManagementViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="km-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 하드코딩 위험 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 소스코드 → Git 커밋 → 이력 잔존 → 스캐너 수집 흐름 */}
              <ModuleBox x={10} y={12} w={95} h={48} label="소스코드" sub="API_KEY=sk-..." color={C.danger} />
              <Arrow x1={105} y1={36} x2={128} y2={36} color={C.danger} />

              <ActionBox x={130} y={14} w={85} h={44} label="Git 커밋" sub="push to remote" color={C.danger} />
              <Arrow x1={215} y1={36} x2={238} y2={36} color={C.danger} />

              <AlertBox x={240} y={10} w={100} h={52} label="이력에 영구 잔존" sub="reflog + 백업" color={C.danger} />
              <Arrow x1={340} y1={36} x2={363} y2={36} color={C.danger} />

              <AlertBox x={365} y={10} w={105} h={52} label="자동 스캐너 수집" sub="수 분 내 탈취" color={C.danger} />

              {/* 위험 강조 — 흐르는 키 아이콘 */}
              <motion.circle r={4} fill={C.danger}
                initial={{ cx: 105, cy: 36 }}
                animate={{ cx: 363, cy: 36 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                opacity={0.6} />

              {/* 구분선 */}
              <line x1={15} y1={78} x2={465} y2={78} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 방어선: git-secrets */}
              <text x={240} y={95} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>1차 방어선</text>

              <ModuleBox x={70} y={105} w={110} h={48} label="git-secrets" sub="커밋 전 패턴 감지" color={C.safe} />
              <Arrow x1={180} y1={129} x2={218} y2={129} color={C.safe} />

              <ActionBox x={220} y={107} w={110} h={44} label="pre-commit hook" sub="키 패턴 차단" color={C.safe} />
              <Arrow x1={330} y1={129} x2={348} y2={129} color={C.safe} />

              <StatusBox x={350} y={104} w={110} h={50} label="커밋 차단" sub="유출 사전 방지" color={C.safe} progress={1} />

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">이미 유출된 키는 즉시 revoke + 새 키 발급 필수</text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>비공개 저장소도 내부 직원 전원 접근 가능 — 최소 권한 위배</text>
            </motion.g>
          )}

          {/* ── Step 1: 환경변수 → 시크릿 매니저 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 왼쪽: .env 방식 */}
              <text x={115} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>.env 파일 방식</text>

              <DataBox x={15} y={22} w={80} h={30} label=".env 파일" color={C.warn} />
              <text x={55} y={65} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">권한 600</text>

              <Arrow x1={95} y1={37} x2={115} y2={37} color={C.warn} />

              <ActionBox x={117} y={20} w={95} h={34} label=".gitignore 추가" sub="저장소 제외" color={C.warn} />

              {/* 한계 */}
              <AlertBox x={40} y={78} w={150} h={36} label="다중 서버 시 관리 한계" sub="평문 전송 위험" color={C.danger} />

              {/* 오른쪽: Secrets Manager */}
              <text x={370} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>Secrets Manager</text>

              <ModuleBox x={265} y={22} w={95} h={45} label="Secrets Manager" sub="중앙 저장소" color={C.safe} />

              <Arrow x1={360} y1={44} x2={380} y2={44} color={C.safe} />

              <DataBox x={382} y={28} w={88} h={32} label="IAM 정책" sub="세밀한 접근 통제" color={C.action} />

              <DataBox x={270} y={80} w={85} h={28} label="접근 로그" color={C.safe} />
              <DataBox x={375} y={80} w={95} h={28} label="재배포 불필요" color={C.safe} />

              {/* 구분선 */}
              <line x1={15} y1={122} x2={465} y2={122} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* Vault */}
              <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.action}>HashiCorp Vault</text>

              <ModuleBox x={15} y={148} w={95} h={48} label="Vault 봉인" sub="마스터 키 암호화" color={C.action} />
              <Arrow x1={110} y1={172} x2={133} y2={172} color={C.action} />

              <ActionBox x={135} y={150} w={105} h={44} label="Shamir 분할" sub="N조각 중 K개로 개봉" color={C.action} />
              <Arrow x1={240} y1={172} x2={263} y2={172} color={C.action} />

              <ActionBox x={265} y={150} w={95} h={44} label="개봉(unseal)" sub="단일 관리자 불가" color={C.safe} />
              <Arrow x1={360} y1={172} x2={373} y2={172} color={C.safe} />

              <DataBox x={375} y={156} w={95} h={32} label="동적 시크릿" sub="TTL 후 자동 폐기" color={C.safe} />
            </motion.g>
          )}

          {/* ── Step 2: 키 회전 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 회전 흐름 — 6단계 */}
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.action}>자동 키 회전 절차</text>

              {/* Step chain */}
              <ActionBox x={10} y={24} w={75} h={38} label="새 키 생성" color={C.action} />
              <Arrow x1={85} y1={43} x2={95} y2={43} color={C.action} />

              <ActionBox x={97} y={24} w={72} h={38} label="활성 지정" color={C.action} />
              <Arrow x1={169} y1={43} x2={179} y2={43} color={C.warn} />

              <ActionBox x={181} y={24} w={80} h={38} label="기존 키 비활성" color={C.warn} />
              <Arrow x1={261} y1={43} x2={271} y2={43} color={C.safe} />

              <ActionBox x={273} y={24} w={75} h={38} label="새 키 암호화" sub="신규 데이터" color={C.safe} />
              <Arrow x1={348} y1={43} x2={358} y2={43} color={C.safe} />

              <ActionBox x={360} y={24} w={55} h={38} label="재암호화" sub="배경 작업" color={C.safe} />
              <Arrow x1={415} y1={43} x2={425} y2={43} color={C.danger} />

              <AlertBox x={427} y={22} w={48} h={42} label="폐기" color={C.danger} />

              {/* 진행 표시 볼 */}
              <motion.circle r={3.5} fill={C.action}
                initial={{ cx: 48, cy: 20 }}
                animate={{ cx: 451, cy: 20 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                opacity={0.5} />

              {/* 구분선 */}
              <line x1={15} y1={78} x2={465} y2={78} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 봉투 암호화 다이어그램 */}
              <text x={240} y={96} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>봉투 암호화 (Envelope Encryption)</text>

              {/* KEK */}
              <ModuleBox x={30} y={108} w={110} h={48} label="KEK" sub="키 암호화 키 (1~3년)" color={C.action} />

              {/* KEK → DEK 래핑 화살표 */}
              <Arrow x1={140} y1={132} x2={175} y2={132} color={C.action} />
              <text x={158} y={126} textAnchor="middle" fontSize={8} fill={C.action}>래핑</text>

              {/* DEK */}
              <ModuleBox x={177} y={108} w={120} h={48} label="DEK" sub="데이터 암호화 키 (90일~1년)" color={C.safe} />

              {/* DEK → 데이터 암호화 */}
              <Arrow x1={297} y1={132} x2={330} y2={132} color={C.safe} />
              <text x={314} y={126} textAnchor="middle" fontSize={8} fill={C.safe}>암호화</text>

              <DataBox x={332} y={116} w={130} h={32} label="암호화된 데이터" color={C.safe} />

              {/* 이점 설명 */}
              <rect x={30} y={172} width={420} height={36} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                DEK 교체 시 데이터 전체 재암호화 불필요 — DEK만 새 KEK로 다시 래핑
              </text>
              <text x={240} y={201} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>
                대규모 데이터에서도 회전 비용 최소화
              </text>
            </motion.g>
          )}

          {/* ── Step 3: 백업 암호화 + 인증서 관리 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 백업 암호화 */}
              <text x={140} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.action}>백업 암호화</text>

              <ModuleBox x={10} y={22} w={80} h={44} label="운영 DB" sub="원본 데이터" color={C.action} />
              <Arrow x1={90} y1={44} x2={108} y2={44} color={C.action} />

              <ActionBox x={110} y={24} w={80} h={40} label="AES-256" sub="백업 암호화" color={C.safe} />
              <Arrow x1={190} y1={44} x2={208} y2={44} color={C.safe} />

              <DataBox x={210} y={28} w={85} h={32} label="암호화 백업" color={C.safe} />

              {/* 별도 보관 강조 */}
              <Arrow x1={252} y1={60} x2={252} y2={78} color={C.warn} />
              <AlertBox x={195} y={80} w={115} h={32} label="키와 별도 보관 필수" color={C.danger} />

              {/* 소산백업 */}
              <DataBox x={10} y={80} w={80} h={28} label="소산백업" color={C.warn} />
              <Arrow x1={90} y1={94} x2={108} y2={94} color={C.warn} />
              <DataBox x={110} y={80} w={72} h={28} label="TLS 전송" color={C.safe} />

              {/* 구분선 */}
              <line x1={15} y1={126} x2={465} y2={126} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 인증서 관리 */}
              <text x={370} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>인증서 관리</text>

              {/* certbot 자동갱신 흐름 */}
              <ModuleBox x={320} y={22} w={75} h={44} label="certbot" sub="자동 갱신" color={C.safe} />
              <Arrow x1={395} y1={44} x2={413} y2={44} color={C.safe} />

              <DataBox x={415} y={28} w={55} h={32} label="90일" sub="유효기간" color={C.safe} />

              {/* 만료 알림 타임라인 */}
              <text x={370} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>만료 알림 단계</text>

              {/* 타임라인 바 */}
              <rect x={315} y={104} width={150} height={5} rx={2.5} fill="var(--border)" opacity={0.3} />

              {/* 14일 전 */}
              <circle cx={330} cy={106.5} r={4} fill={C.safe} />
              <text x={330} y={120} textAnchor="middle" fontSize={8} fill={C.safe}>14일</text>

              {/* 7일 전 */}
              <circle cx={390} cy={106.5} r={4} fill={C.warn} />
              <text x={390} y={120} textAnchor="middle" fontSize={8} fill={C.warn}>7일</text>

              {/* 1일 전 */}
              <circle cx={450} cy={106.5} r={4} fill={C.danger} />
              <text x={450} y={120} textAnchor="middle" fontSize={8} fill={C.danger}>1일</text>

              {/* HSM 보관 */}
              <text x={240} y={146} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.action}>키 보관 전략</text>

              <ModuleBox x={30} y={155} w={110} h={48} label="개인키" sub="인증서 개인키" color={C.danger} />
              <Arrow x1={140} y1={179} x2={168} y2={179} color={C.action} />

              <ModuleBox x={170} y={155} w={80} h={48} label="HSM" sub="하드웨어 보안" color={C.action} />
              <Arrow x1={250} y1={179} x2={268} y2={179} color={C.safe} />

              <StatusBox x={270} y={154} w={100} h={50} label="디스크 평문 없음" sub="MITM 방지" color={C.safe} progress={1} />

              <DataBox x={390} y={160} w={80} h={32} label="CT 로그 감시" sub="사칭 탐지" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
