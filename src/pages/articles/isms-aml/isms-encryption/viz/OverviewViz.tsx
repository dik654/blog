import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  sym: '#6366f1',
  asym: '#0ea5e9',
  hash: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '암호화 3영역 — 저장·전송·비밀번호',
    body: '저장 시(data at rest): AES-256 컬럼/FDE. 전송 시(data in transit): TLS 1.2+, HSTS. 비밀번호: 단방향 해시(bcrypt/Argon2). 각 영역의 위협 모델이 다르므로 알고리즘과 키 관리 방식도 다름.',
  },
  {
    label: '저장 시 — 컬럼 암호화 + FDE 병행',
    body: '컬럼 암호화: 특정 필드만 암호화, 앱이 복호화 처리, DBA가 평문 못 봄. FDE: OS 레벨 전체 디스크 암호화, 앱 변경 없음, 부팅 시 마운트 후 평문 접근. 두 방식 병행이 실무 표준.',
  },
  {
    label: '전송 시 — TLS 핸드셰이크로 세션 키 교환',
    body: 'TLS 핸드셰이크: 서버 인증서 검증 → 비대칭키로 세션 키 교환 → 대칭키로 데이터 암호화. TLS 1.3: 1-RTT, 취약 스위트 제거. 내부 서버 간에도 TLS 필수. VPN은 원격 접속 전 구간 암호화.',
  },
  {
    label: '대칭키 + 비대칭키 = 하이브리드 암호 체계',
    body: '대칭키(AES): 빠름, 대량 데이터, 키 배포 문제. 비대칭키(RSA/ECDSA): 느림, 키 교환·서명, 수십~수백 배 비용. TLS에서 비대칭키로 세션 키 교환 → 대칭키로 전송. 디지털 서명: 개인키 서명 + 공개키 검증.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#enc-ov-arrow)" />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="enc-ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 3영역 개요 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">ISMS 2.7 암호화 3영역</text>

              <ModuleBox x={15} y={30} w={140} h={55} label="저장 시 암호화" sub="Data at Rest" color={C.sym} />
              <DataBox x={25} y={95} w={60} h={22} label="AES-256" color={C.sym} />
              <DataBox x={90} y={95} w={55} h={22} label="FDE" color={C.sym} />
              <text x={85} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">DB 유출·백업 탈취 방어</text>

              <ModuleBox x={170} y={30} w={140} h={55} label="전송 시 암호화" sub="Data in Transit" color={C.asym} />
              <DataBox x={180} y={95} w={60} h={22} label="TLS 1.2+" color={C.asym} />
              <DataBox x={245} y={95} w={55} h={22} label="HSTS" color={C.asym} />
              <text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">네트워크 도청·변조 방어</text>

              <ModuleBox x={325} y={30} w={140} h={55} label="비밀번호 저장" sub="단방향 해시" color={C.hash} />
              <DataBox x={335} y={95} w={60} h={22} label="bcrypt" color={C.hash} />
              <DataBox x={400} y={95} w={55} h={22} label="Argon2" color={C.hash} />
              <text x={395} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">복호화 불가 → 키 유출 무관</text>

              {/* 공통 원칙 */}
              <line x1={15} y1={145} x2={465} y2={145} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <rect x={80} y={155} width={320} height={30} rx={6} fill="#6366f112" stroke={C.sym} strokeWidth={1} />
              <text x={240} y={174} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sym}>각 영역의 위협 모델이 다르므로 알고리즘·키 관리 방식도 다름</text>

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">국내 법령: 주민번호·여권번호·바이오 → AES-128 이상 의무</text>
            </motion.g>
          )}

          {/* Step 1: 저장 시 암호화 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">저장 시 암호화: 컬럼 vs FDE</text>

              {/* 컬럼 암호화 */}
              <ModuleBox x={15} y={28} w={210} h={48} label="컬럼 단위 암호화" sub="특정 필드만 암호화" color={C.sym} />

              <ActionBox x={25} y={86} w={90} h={32} label="앱이 복호화" sub="성능 영향 큼" color={C.sym} />
              <StatusBox x={125} y={86} w={90} h={32} label="DBA 차단" sub="평문 접근 불가" color={C.hash} />

              {/* FDE */}
              <ModuleBox x={255} y={28} w={210} h={48} label="FDE (전체 디스크)" sub="OS 레벨 암호화" color={C.asym} />

              <ActionBox x={265} y={86} w={90} h={32} label="앱 변경 없음" sub="투명 암호화" color={C.asym} />
              <AlertBox x={365} y={86} w={90} h={32} label="마운트 후" sub="평문 접근 가능" color={C.danger} />

              {/* 병행 */}
              <line x1={15} y1={132} x2={465} y2={132} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.hash}>실무: 두 방식 병행</text>

              <rect x={40} y={158} width={180} height={28} rx={6} fill="#6366f112" stroke={C.sym} strokeWidth={1} />
              <text x={130} y={176} textAnchor="middle" fontSize={9} fill={C.sym}>FDE → 물리적 탈취 방어</text>

              <rect x={260} y={158} width={180} height={28} rx={6} fill="#0ea5e912" stroke={C.asym} strokeWidth={1} />
              <text x={350} y={176} textAnchor="middle" fontSize={9} fill={C.asym}>컬럼 → 논리적 접근 통제</text>

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">AES-256 대칭키 — 무차별 대입 물리적 불가능</text>
            </motion.g>
          )}

          {/* Step 2: TLS 핸드셰이크 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">TLS 핸드셰이크 → 세션 키 교환</text>

              {/* 클라이언트 */}
              <ModuleBox x={15} y={30} w={90} h={42} label="클라이언트" sub="브라우저" color={C.asym} />

              {/* 서버 */}
              <ModuleBox x={375} y={30} w={90} h={42} label="서버" sub="인증서 보유" color={C.hash} />

              {/* 핸드셰이크 흐름 */}
              <Arrow x1={105} y1={42} x2={373} y2={42} color={C.asym} />
              <text x={240} y={38} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.asym}>1. 인증서 검증</text>

              <Arrow x1={373} y1={56} x2={105} y2={56} color={C.hash} />
              <text x={240} y={66} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.hash}>2. 비대칭키로 세션 키 교환</text>

              {/* 세션 키 확보 후 */}
              <line x1={15} y1={82} x2={465} y2={82} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sym}>3. 대칭키(세션 키)로 데이터 암호화</text>

              {/* 암호화 데이터 흐름 */}
              <rect x={60} y={105} width={360} height={25} rx={12} fill="#6366f108" stroke={C.sym} strokeWidth={1} />
              <motion.circle r={4} fill={C.sym} opacity={0.5}
                initial={{ cx: 80 }} animate={{ cx: 400 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} cy={117} />
              <text x={240} y={121} textAnchor="middle" fontSize={8} fill={C.sym}>암호화 통신 터널</text>

              {/* TLS 버전 비교 */}
              <line x1={15} y1={142} x2={465} y2={142} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={20} y={150} w={130} h={34} label="TLS 1.0/1.1" sub="POODLE·BEAST 취약" color={C.danger} />
              <text x={85} y={195} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.danger}>비활성화</text>

              <StatusBox x={175} y={150} w={130} h={34} label="TLS 1.2" sub="필수 최소 버전" color={C.hash} />

              <StatusBox x={330} y={150} w={130} h={34} label="TLS 1.3" sub="1-RTT, 취약 스위트 제거" color={C.hash} />
              <text x={395} y={195} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.hash}>권장</text>
            </motion.g>
          )}

          {/* Step 3: 하이브리드 암호 체계 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">하이브리드 암호 체계</text>

              {/* 대칭키 */}
              <ModuleBox x={15} y={30} w={200} h={48} label="대칭키 (AES)" sub="암호화 = 복호화 동일 키" color={C.sym} />
              <DataBox x={25} y={88} w={80} h={24} label="빠른 속도" color={C.sym} />
              <DataBox x={115} y={88} w={90} h={24} label="대량 데이터" color={C.sym} />
              <AlertBox x={55} y={118} w={130} h={28} label="키 배포 문제" sub="같은 키를 어떻게 공유?" color={C.danger} />

              {/* 비대칭키 */}
              <ModuleBox x={265} y={30} w={200} h={48} label="비대칭키 (RSA/ECDSA)" sub="공개키 ↔ 개인키 쌍" color={C.asym} />
              <DataBox x={275} y={88} w={80} h={24} label="키 교환" color={C.asym} />
              <DataBox x={365} y={88} w={90} h={24} label="디지털 서명" color={C.asym} />
              <AlertBox x={305} y={118} w={130} h={28} label="수십~수백배 느림" sub="대량 데이터에 부적합" color={C.danger} />

              {/* 결합 */}
              <line x1={15} y1={158} x2={465} y2={158} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.hash}>결합: 비대칭키로 세션 키 교환 → 대칭키로 데이터 전송</text>

              <rect x={60} y={182} width={360} height={28} rx={6} fill="#10b98112" stroke={C.hash} strokeWidth={1} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.hash}>키 교환 안전성 + 데이터 암호화 속도 = 하이브리드 표준</text>

              {/* 연결 화살표 */}
              <Arrow x1={185} y1={146} x2={220} y2={165} color={C.sym} />
              <Arrow x1={295} y1={146} x2={260} y2={165} color={C.asym} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
