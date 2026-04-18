import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  danger: '#ef4444',
  safe: '#10b981',
  warn: '#f59e0b',
  action: '#6366f1',
};

const STEPS = [
  {
    label: '.env 방식 — 코드에서 키를 분리, 실행 시점에 환경변수로 주입',
    body: '.env 파일에 키를 저장하고 .gitignore에 추가. 파일 권한 600(소유자만 읽기/쓰기). 한계: 서버 수십 대면 각각 배포 필요, 평문 전송 위험, 메모리에 평문 상주.',
  },
  {
    label: 'K8s Secret — etcd에 Base64 저장 = 사실상 평문',
    body: 'Kubernetes Secret은 etcd에 Base64 인코딩으로 저장. Base64는 인코딩이지 암호화가 아님. etcd encryption at rest를 활성화해야 실질적 보호. /proc 파일시스템·코어 덤프에서 추출 위험 상존.',
  },
  {
    label: 'Secrets Manager — 암호화 저장 + IAM + 접근 로그',
    body: '시크릿을 암호화하여 중앙 저장. IAM 정책으로 세밀한 접근 통제. API 호출마다 접근 로그 기록. 시크릿 변경 시 재배포 없이 즉시 반영 — 키 교체(rotation) 용이.',
  },
  {
    label: 'Vault — Shamir 분할 봉인 + 동적 시크릿',
    body: '자체 호스팅 시크릿 관리. 봉인(seal)/개봉(unseal) 구조: Shamir 분할 키 조각 중 일정 수를 모아야 개봉. 단일 관리자 접근 불가. 동적 시크릿: 요청마다 일회용 DB 자격증명 생성, TTL 후 자동 폐기.',
  },
];

function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#es-arrow)"
      strokeDasharray={dashed ? '3 2' : undefined} />
  );
}

export default function EnvSecretViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="es-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: .env 방식 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>.env 파일 방식 — 코드에서 키 분리</text>

              {/* 코드 → 환경변수 읽기 */}
              <ModuleBox x={15} y={24} w={100} h={48} label="애플리케이션" sub="process.env.KEY" color={C.action} />
              <Arrow x1={115} y1={48} x2={140} y2={48} color={C.warn} />

              <DataBox x={142} y={32} w={80} h={32} label=".env 파일" sub="권한 600" color={C.warn} />
              <Arrow x1={222} y1={48} x2={247} y2={48} color={C.safe} />

              <ActionBox x={249} y={26} w={95} h={44} label=".gitignore" sub="저장소에 포함 안 됨" color={C.safe} />

              {/* 실행 시점 주입 강조 */}
              <DataBox x={365} y={32} w={100} h={32} label="실행 시점 주입" sub="코드에 키 없음" color={C.safe} />

              {/* 구분선 — 한계 */}
              <line x1={15} y1={90} x2={465} y2={90} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={108} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>한계</text>

              {/* 한계 3가지 */}
              <AlertBox x={15} y={116} w={140} h={42} label="서버 수십대 → 배포 어려움" sub="각 서버에 파일 복사" color={C.danger} />
              <AlertBox x={170} y={116} w={140} h={42} label="평문 전송 위험" sub="복사 과정에서 노출" color={C.danger} />
              <AlertBox x={325} y={116} w={140} h={42} label="메모리에 평문 상주" sub="/proc · 코어덤프 추출" color={C.danger} />

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">단일 서버에서는 간단하지만, 규모 확장 시 한계 — 시크릿 매니저 도입 필요</text>
            </motion.g>
          )}

          {/* ── Step 1: K8s Secret ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>Kubernetes Secret — Base64 ≠ 암호화</text>

              {/* Pod → K8s Secret → etcd */}
              <ModuleBox x={15} y={28} w={90} h={48} label="Pod" sub="컨테이너" color={C.action} />
              <Arrow x1={105} y1={52} x2={133} y2={52} color={C.action} />

              <DataBox x={135} y={36} w={100} h={32} label="K8s Secret" sub="환경변수 마운트" color={C.warn} />
              <Arrow x1={235} y1={52} x2={263} y2={52} color={C.warn} />

              <ModuleBox x={265} y={28} w={90} h={48} label="etcd" sub="클러스터 저장소" color={C.warn} />

              {/* Base64 = 평문 경고 */}
              <Arrow x1={355} y1={52} x2={378} y2={52} color={C.danger} />
              <AlertBox x={380} y={26} w={90} h={52} label="Base64 저장" sub="디코딩 = 평문" color={C.danger} />

              {/* 구분선 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={114} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>필수 조치</text>

              {/* encryption at rest */}
              <ActionBox x={30} y={124} w={170} h={38} label="etcd encryption at rest 활성화" sub="저장 시점 암호화" color={C.safe} />
              <Arrow x1={200} y1={143} x2={228} y2={143} color={C.safe} />
              <StatusBox x={230} y={118} w={110} h={50} label="실질적 보호" sub="저장소 암호화 완료" color={C.safe} progress={1} />

              {/* 추출 위험 */}
              <AlertBox x={360} y={122} w={108} h={42} label="/proc · 코어 덤프" sub="메모리 추출 위험" color={C.danger} />

              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Base64는 인코딩(변환)일 뿐 암호화(보호)가 아님 — 반드시 encryption at rest 필요</text>
            </motion.g>
          )}

          {/* ── Step 2: Secrets Manager ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>Secrets Manager — 중앙 집중 관리</text>

              {/* 중앙 저장소 */}
              <ModuleBox x={170} y={24} w={140} h={52} label="Secrets Manager" sub="암호화 저장 + 중앙 관리" color={C.safe} />

              {/* IAM 정책 */}
              <Arrow x1={240} y1={76} x2={80} y2={100} color={C.action} />
              <DataBox x={20} y={100} w={120} h={34} label="IAM 정책" sub="세밀한 접근 통제" color={C.action} />

              {/* 접근 로그 */}
              <Arrow x1={240} y1={76} x2={240} y2={100} color={C.warn} />
              <DataBox x={180} y={100} w={120} h={34} label="접근 로그" sub="누가·언제·무엇을 조회" color={C.warn} />

              {/* 재배포 불필요 */}
              <Arrow x1={240} y1={76} x2={400} y2={100} color={C.safe} />
              <DataBox x={340} y={100} w={120} h={34} label="재배포 불필요" sub="값 변경 즉시 반영" color={C.safe} />

              {/* 앱에서 API 호출 */}
              <ModuleBox x={15} y={24} w={100} h={52} label="애플리케이션" sub="API 호출로 조회" color={C.action} />
              <Arrow x1={115} y1={50} x2={168} y2={50} color={C.action} />

              {/* 흐르는 시크릿 */}
              <motion.circle r={3.5} fill={C.safe} opacity={0.5}
                initial={{ cx: 115, cy: 50 }}
                animate={{ cx: 168, cy: 50 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />

              {/* 이점 요약 */}
              <rect x={40} y={155} width={400} height={36} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={171} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">암호화 저장 + 접근 통제 + 감사 로그 + 무중단 교체</text>
              <text x={240} y={184} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>.env 방식의 모든 한계를 해결</text>
            </motion.g>
          )}

          {/* ── Step 3: Vault ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.action}>HashiCorp Vault — 자체 호스팅 시크릿 관리</text>

              {/* 봉인/개봉 흐름 */}
              <ModuleBox x={10} y={28} w={95} h={48} label="Vault 봉인" sub="재시작 시 잠금" color={C.action} />
              <Arrow x1={105} y1={52} x2={128} y2={52} color={C.action} />

              {/* Shamir 분할 */}
              <ActionBox x={130} y={30} w={105} h={44} label="Shamir 분할" sub="N조각 중 K개로 개봉" color={C.action} />

              {/* 키 조각 시각화 */}
              <motion.rect x={148} y={22} width={12} height={8} rx={2} fill={C.action} opacity={0.6}
                initial={{ y: 22 }}
                animate={{ y: 28 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }} />
              <motion.rect x={164} y={22} width={12} height={8} rx={2} fill={C.action} opacity={0.6}
                initial={{ y: 28 }}
                animate={{ y: 22 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }} />
              <motion.rect x={180} y={22} width={12} height={8} rx={2} fill={C.action} opacity={0.6}
                initial={{ y: 22 }}
                animate={{ y: 28 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }} />

              <Arrow x1={235} y1={52} x2={258} y2={52} color={C.safe} />

              <ActionBox x={260} y={30} w={90} h={44} label="개봉(unseal)" sub="단일 관리자 불가" color={C.safe} />
              <Arrow x1={350} y1={52} x2={373} y2={52} color={C.safe} />

              <StatusBox x={375} y={26} w={95} h={50} label="사용 가능" sub="시크릿 접근 허용" color={C.safe} progress={1} />

              {/* 구분선 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={114} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>동적 시크릿 (Dynamic Secrets)</text>

              {/* 요청 → 일회용 자격증명 → TTL 후 폐기 */}
              <ModuleBox x={15} y={124} w={95} h={48} label="앱 요청" sub="DB 접근 필요" color={C.action} />
              <Arrow x1={110} y1={148} x2={133} y2={148} color={C.action} />

              <ActionBox x={135} y={126} w={105} h={44} label="일회용 자격증명" sub="DB user/pass 생성" color={C.warn} />
              <Arrow x1={240} y1={148} x2={263} y2={148} color={C.warn} />

              <DataBox x={265} y={132} w={80} h={32} label="TTL 설정" sub="예: 1시간" color={C.warn} />
              <Arrow x1={345} y1={148} x2={368} y2={148} color={C.danger} />

              <AlertBox x={370} y={124} w={100} h={48} label="자동 폐기" sub="TTL 만료 → 삭제" color={C.danger} />

              {/* 흐르는 타이머 */}
              <motion.circle r={3.5} fill={C.warn} opacity={0.5}
                initial={{ cx: 265, cy: 170 }}
                animate={{ cx: 370, cy: 170 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />

              <text x={240} y={198} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자격증명 탈취해도 TTL 만료 후 무효 — 피해 최소화</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
