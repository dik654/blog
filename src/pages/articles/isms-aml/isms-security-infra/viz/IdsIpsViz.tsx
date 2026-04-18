import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  ids: '#f59e0b',    // IDS — 탐지 노랑
  ips: '#3b82f6',    // IPS — 차단 파랑
  atk: '#ef4444',    // 공격 — 빨강
  ok: '#22c55e',     // 정상/안전 — 초록
};

const STEPS = [
  {
    label: 'IDS vs IPS — 탐지 vs 차단',
    body: 'IDS: 트래픽 복사본을 분석하여 공격을 탐지하고 관리자에게 알림. 차단 불가.\nIPS: 트래픽 경로에 직접 배치(인라인). 공격 트래픽을 밀리초 단위로 자동 차단.',
  },
  {
    label: '탐지 방식 3가지',
    body: '시그니처 기반: 알려진 공격 패턴 DB와 매칭. 정확하지만 제로데이 탐지 불가.\n이상행위 기반: 정상 기준선에서 벗어나면 탐지. 제로데이 가능하지만 오탐 많음.\n프로토콜 분석: RFC 표준 위반 탐지.',
  },
  {
    label: '인라인 vs 미러링 배치',
    body: '인라인: 모든 트래픽이 장비 통과 → 실시간 차단. 장비 장애 시 네트워크 단절 위험.\n미러링: SPAN 포트에서 복사본 분석 → 서비스 영향 없음. 차단 불가, 포렌식용.',
  },
  {
    label: '오탐 관리와 튜닝',
    body: '오탐(False Positive): 정상을 공격으로 판단 → IPS에서는 곧 서비스 차단.\n초기 2~4주는 IDS 모드로 학습 → 오탐 감소 후 IPS 모드로 전환. 시그니처 민감도 조정 필수.',
  },
  {
    label: 'VASP 특화 탐지 규칙',
    body: '비정상 출금 API 대량 호출, 크리덴셜 스터핑, 내부 측면 이동, DNS 터널링 등.\n일반 시그니처만으로는 커버 불가 — VASP 고유 공격 벡터에 맞춘 커스텀 규칙 필수.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#iip-arrow)" />
  );
}

export default function IdsIpsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="iip-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: IDS vs IPS */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* IDS 영역 (상단) */}
              <rect x={5} y={8} width={470} height={96} rx={8} fill={`${C.ids}06`} stroke={C.ids} strokeWidth={0.6} />
              <text x={240} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ids}>IDS — 침입탐지 (미러링 배치)</text>

              {/* 트래픽 흐름 (IDS 우회) */}
              <DataBox x={15} y={32} w={70} h={26} label="트래픽" color={C.atk} />
              <Arrow x1={85} y1={45} x2={300} y2={45} color="var(--muted-foreground)" />
              <ModuleBox x={302} y={30} w={80} h={30} label="서버" sub="정상 도달" color={C.ok} />

              {/* 미러링 복사 → IDS */}
              <line x1={180} y1={45} x2={180} y2={68} stroke={C.ids} strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={193} y={62} fontSize={7} fill={C.ids}>복사</text>
              <ActionBox x={120} y={68} w={80} h={28} label="IDS 분석" sub="탐지만" color={C.ids} />
              <Arrow x1={200} y1={82} x2={390} y2={82} color={C.ids} />
              <DataBox x={392} y={68} w={72} h={28} label="Alert 알림" color={C.ids} />
              <text x={428} y={56} textAnchor="middle" fontSize={7} fill={C.ids}>관리자 확인</text>

              {/* IPS 영역 (하단) */}
              <rect x={5} y={112} width={470} height={100} rx={8} fill={`${C.ips}06`} stroke={C.ips} strokeWidth={0.6} />
              <text x={240} y={126} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ips}>IPS — 침입방지 (인라인 배치)</text>

              {/* 트래픽 → IPS → 서버 */}
              <DataBox x={15} y={136} w={70} h={26} label="트래픽" color={C.atk} />
              <Arrow x1={85} y1={149} x2={140} y2={149} color={C.atk} />
              <ActionBox x={142} y={136} w={80} h={30} label="IPS 검사" sub="인라인" color={C.ips} />

              {/* 정상 → 통과 */}
              <Arrow x1={222} y1={142} x2={300} y2={142} color={C.ok} />
              <ModuleBox x={302} y={134} w={80} h={30} label="서버" sub="정상만 도달" color={C.ok} />
              <text x={262} y={138} textAnchor="middle" fontSize={7} fill={C.ok}>통과</text>

              {/* 공격 → 차단 */}
              <Arrow x1={222} y1={160} x2={300} y2={175} color={C.atk} />
              <AlertBox x={302} y={166} w={72} h={28} label="차단 DROP" sub="자동 즉각" color={C.atk} />
              <text x={262} y={173} textAnchor="middle" fontSize={7} fill={C.atk}>공격</text>
            </motion.g>
          )}

          {/* Step 1: 탐지 방식 3가지 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ips}>탐지 방식 3가지</text>

              {/* 시그니처 기반 */}
              <ModuleBox x={15} y={30} w={140} h={42} label="시그니처 기반" sub="Signature-based" color={C.ips} />
              <DataBox x={20} y={80} w={55} h={24} label="패킷" color={C.atk} />
              <Arrow x1={75} y1={92} x2={92} y2={92} color={C.atk} />
              <ActionBox x={94} y={80} w={55} h={24} label="DB 매칭" sub="" color={C.ips} />
              <text x={85} y={118} textAnchor="middle" fontSize={7} fill={C.ok}>알려진 공격 정확 탐지</text>
              <text x={85} y={130} textAnchor="middle" fontSize={7} fill={C.atk}>제로데이 탐지 불가</text>

              {/* 이상행위 기반 */}
              <ModuleBox x={170} y={30} w={140} h={42} label="이상행위 기반" sub="Anomaly-based" color={C.ids} />
              <rect x={175} y={80} width={60} height={24} rx={4} fill="var(--card)" stroke={C.ok} strokeWidth={0.5} />
              <text x={205} y={95} textAnchor="middle" fontSize={8} fill={C.ok}>Baseline</text>
              <Arrow x1={235} y1={92} x2={250} y2={92} color={C.ids} />
              <rect x={252} y={80} width={52} height={24} rx={4} fill="var(--card)" stroke={C.atk} strokeWidth={0.5} />
              <text x={278} y={95} textAnchor="middle" fontSize={8} fill={C.atk}>500Mbps</text>
              <text x={240} y={118} textAnchor="middle" fontSize={7} fill={C.ok}>제로데이 탐지 가능</text>
              <text x={240} y={130} textAnchor="middle" fontSize={7} fill={C.atk}>오탐 발생 빈번</text>

              {/* 프로토콜 분석 */}
              <ModuleBox x={325} y={30} w={140} h={42} label="프로토콜 분석" sub="Protocol Analysis" color={C.ok} />
              <DataBox x={330} y={80} w={55} h={24} label="DNS 쿼리" color={C.ips} />
              <Arrow x1={385} y1={92} x2={400} y2={92} color={C.ips} />
              <AlertBox x={402} y={80} w={58} h={24} label="RFC 위반" sub="" color={C.atk} />
              <text x={395} y={118} textAnchor="middle" fontSize={7} fill={C.ok}>표준 위반 체계적 탐지</text>
              <text x={395} y={130} textAnchor="middle" fontSize={7} fill={C.atk}>HTTPS 분석 불가</text>

              {/* 하단 비교 */}
              <rect x={15} y={145} width={450} height={62} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={162} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">실무 조합</text>
              <text x={30} y={178} fontSize={7.5} fill="var(--muted-foreground)">시그니처 기반이 메인(높은 정확도) + 이상행위 기반으로 제로데이 보완 + 프로토콜 분석으로 터널링 탐지</text>
              <text x={30} y={195} fontSize={7.5} fill={C.ips}>시그니처 DB는 반드시 최신 유지 — 업데이트 지연 = 탐지 공백</text>
            </motion.g>
          )}

          {/* Step 2: 인라인 vs 미러링 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 인라인 (상단) */}
              <rect x={5} y={8} width={470} height={96} rx={8} fill={`${C.ips}06`} stroke={C.ips} strokeWidth={0.6} />
              <text x={240} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ips}>인라인 (Inline) — IPS</text>

              <DataBox x={15} y={34} w={60} h={24} label="트래픽" color="var(--muted-foreground)" />
              <Arrow x1={75} y1={46} x2={108} y2={46} color="var(--muted-foreground)" />

              {/* IPS 장비 (트래픽 경로 중간) */}
              <rect x={110} y={30} width={80} height={34} rx={6} fill={C.ips} opacity={0.15} stroke={C.ips} strokeWidth={1} />
              <text x={150} y={51} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ips}>IPS</text>

              <Arrow x1={190} y1={46} x2={230} y2={40} color={C.ok} />
              <ModuleBox x={232} y={28} w={70} h={28} label="정상 통과" sub="" color={C.ok} />

              <Arrow x1={190} y1={55} x2={230} y2={62} color={C.atk} />
              <AlertBox x={232} y={56} w={70} h={28} label="차단" sub="DROP" color={C.atk} />

              {/* 장점/단점 */}
              <text x={340} y={38} fontSize={8} fill={C.ok}>실시간 차단</text>
              <text x={340} y={52} fontSize={8} fill={C.ok}>공격 즉각 중지</text>
              <text x={340} y={70} fontSize={8} fill={C.atk}>장비 장애 → 네트워크 단절</text>
              <text x={340} y={84} fontSize={8} fill={C.atk}>오탐 = 서비스 장애</text>

              {/* 미러링 (하단) */}
              <rect x={5} y={112} width={470} height={100} rx={8} fill={`${C.ids}06`} stroke={C.ids} strokeWidth={0.6} />
              <text x={240} y={126} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ids}>미러링 (Mirroring) — IDS</text>

              <DataBox x={15} y={138} w={60} h={24} label="트래픽" color="var(--muted-foreground)" />
              <Arrow x1={75} y1={150} x2={230} y2={150} color="var(--muted-foreground)" />
              <ModuleBox x={232} y={138} w={70} h={28} label="서버" sub="그대로 도달" color={C.ok} />

              {/* SPAN 포트 복사 */}
              <line x1={140} y1={150} x2={140} y2={174} stroke={C.ids} strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={155} y={168} fontSize={7} fill={C.ids}>SPAN 복사</text>

              <ActionBox x={100} y={176} w={80} h={24} label="IDS 분석" sub="" color={C.ids} />

              <text x={340} y={142} fontSize={8} fill={C.ok}>서비스 영향 없음</text>
              <text x={340} y={156} fontSize={8} fill={C.ok}>포렌식 데이터 수집</text>
              <text x={340} y={174} fontSize={8} fill={C.atk}>차단 불가</text>
              <text x={340} y={188} fontSize={8} fill={C.atk}>별도 장비에 차단 요청 필요</text>
            </motion.g>
          )}

          {/* Step 3: 오탐 관리 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ips}>오탐(False Positive) 관리</text>

              {/* 오탐 → 미탐 스펙트럼 */}
              <rect x={30} y={30} width={420} height={36} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={120} y={46} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.atk}>오탐 (False Positive)</text>
              <text x={120} y={58} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">정상을 공격으로 판단 → 서비스 차단</text>
              <text x={360} y={46} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ids}>미탐 (False Negative)</text>
              <text x={360} y={58} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">실제 공격을 놓침 → 보안 사고</text>

              {/* 민감도 바 */}
              <rect x={200} y={38} width={80} height={20} rx={4} fill={C.ips} opacity={0.15} />
              <text x={240} y={52} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.ips}>민감도 조정</text>

              {/* 4단계 프로세스 */}
              <StatusBox x={15} y={78} w={105} h={50} label="1. 초기 학습" sub="2~4주 IDS 모드" color={C.ids} progress={0.25} />
              <Arrow x1={120} y1={103} x2={133} y2={103} color="var(--muted-foreground)" />
              <StatusBox x={135} y={78} w={105} h={50} label="2. 화이트리스트" sub="반복 오탐 예외 등록" color={C.ids} progress={0.5} />
              <Arrow x1={240} y1={103} x2={253} y2={103} color="var(--muted-foreground)" />
              <StatusBox x={255} y={78} w={105} h={50} label="3. 시그니처 튜닝" sub="민감도 환경 맞춤" color={C.ips} progress={0.75} />
              <Arrow x1={360} y1={103} x2={373} y2={103} color="var(--muted-foreground)" />
              <StatusBox x={375} y={78} w={95} h={50} label="4. IPS 전환" sub="인라인 차단 가동" color={C.ok} progress={1} />

              {/* 주의사항 */}
              <AlertBox x={15} y={142} w={225} h={30} label="예외 과다 등록 → 보안 구멍" sub="주기적 재검토 필수" color={C.atk} />

              <rect x={255} y={142} width={215} height={30} rx={6} fill="var(--card)" stroke={C.ok} strokeWidth={0.5} />
              <text x={362} y={160} textAnchor="middle" fontSize={8} fill={C.ok}>바이패스 설정: 장비 장애 시 트래픽 통과</text>

              {/* 커스텀 시그니처 */}
              <ActionBox x={15} y={182} w={455} h={28} label="커스텀 시그니처: 자사 서비스 특화 규칙 직접 작성 — 범용 시그니처만으로는 커버 불가" sub="" color={C.ips} />
            </motion.g>
          )}

          {/* Step 4: VASP 특화 규칙 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.atk}>VASP 특화 탐지 규칙</text>

              {/* 4가지 탐지 대상 */}
              <ModuleBox x={15} y={30} w={215} h={42} label="비정상 출금 API 호출" sub="동일 IP에서 출금 API N회/분 초과" color={C.atk} />
              <ModuleBox x={250} y={30} w={215} h={42} label="크리덴셜 스터핑" sub="다수 계정 순차적 로그인 실패" color={C.atk} />

              <ModuleBox x={15} y={82} w={215} h={42} label="내부 측면 이동" sub="내부 서버 간 비표준 포트 스캔, SSH 브루트포스" color={C.ids} />
              <ModuleBox x={250} y={82} w={215} h={42} label="DNS 터널링" sub="비정상 도메인 길이, TXT 레코드 과다" color={C.ids} />

              {/* 대응 경로 */}
              <Arrow x1={122} y1={72} x2={122} y2={135} color={C.ips} />
              <Arrow x1={357} y1={72} x2={357} y2={135} color={C.ips} />
              <Arrow x1={122} y1={124} x2={122} y2={135} color={C.ips} />
              <Arrow x1={357} y1={124} x2={357} y2={135} color={C.ips} />

              {/* IPS 차단 + SIEM 연동 */}
              <rect x={50} y={138} width={380} height={34} rx={8} fill={`${C.ips}10`} stroke={C.ips} strokeWidth={0.8} />
              <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ips}>IPS 즉시 차단 + SIEM 상관분석 연동</text>

              {/* 최종 대응 */}
              <Arrow x1={240} y1={172} x2={240} y2={182} color={C.ips} />
              <ActionBox x={80} y={184} w={145} h={28} label="경계 IPS — 인라인 차단" sub="알려진 공격 즉시 차단" color={C.ips} />
              <ActionBox x={250} y={184} w={145} h={28} label="내부 IDS — 미러링 감시" sub="내부 트래픽 가시성 확보" color={C.ids} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
