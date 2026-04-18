import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '탐지 계층 — IDS/IPS, WAF, SIEM, FDS',
    body: '시그니처 기반(알려진 공격) + 이상 탐지(미지 공격). WAF는 L7 요청 분석, SIEM은 다중 로그 상관분석.',
  },
  {
    label: '로그 중앙 수집과 시간 동기화',
    body: 'NTP로 전 시스템 시간 동기화 → 시스템/네트워크/애플리케이션 로그를 SIEM에 집중. WORM 스토리지로 원본 보전.',
  },
  {
    label: '초동 대응 — 격리 + 포렌식 + 영향 파악',
    body: '감염 시스템 네트워크 격리 → 메모리 덤프·디스크 이미지·패킷 캡처 → 접근 범위·유출 데이터 추적.',
  },
  {
    label: '봉쇄 — 공격 경로 차단',
    body: '취약점 임시 패치, 서비스 중단, 계정 잠금·비밀번호 강제 초기화. 백도어(webshell, SSH 키, 스케줄러) 전수 점검.',
  },
  {
    label: 'VASP 내부/외부 사고 대응',
    body: '내부: 지갑 출금 정지 → 계정 동결 → 온체인 추적. 외부: FDS 자동 보류 → 계정 정지 → 본인 확인 → 고객 통지.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-dc-arrow)" />;
}

export default function DetectionContainmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-dc-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Traffic source */}
              <DataBox x={10} y={30} w={80} h={30} label="트래픽" sub="외부 요청" color={C.red} />
              <Arrow x1={92} y1={45} x2={118} y2={45} color={C.red} />
              {/* Layer defenses */}
              <ModuleBox x={120} y={20} w={80} h={50} label="IDS/IPS" sub="시그니처+이상탐지" color={C.blue} />
              <Arrow x1={202} y1={45} x2={228} y2={45} color={C.blue} />
              <ModuleBox x={230} y={20} w={80} h={50} label="WAF" sub="L7 요청 분석" color={C.amber} />
              <Arrow x1={312} y1={45} x2={338} y2={45} color={C.amber} />
              <ModuleBox x={340} y={20} w={80} h={50} label="서비스" sub="웹/API/DB" color={C.green} />

              {/* All feed into SIEM */}
              <Arrow x1={160} y1={72} x2={200} y2={110} color={C.blue} />
              <Arrow x1={270} y1={72} x2={240} y2={110} color={C.amber} />
              <Arrow x1={380} y1={72} x2={280} y2={110} color={C.green} />

              <ModuleBox x={170} y={110} w={140} h={46} label="SIEM" sub="상관분석 (Correlation)" color={C.red} />
              <Arrow x1={312} y1={133} x2={348} y2={133} color={C.red} />
              <ModuleBox x={350} y={115} w={80} h={36} label="FDS" sub="이상거래 탐지" color={C.amber} />

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">개별 이벤트 → 상관분석으로 공격 패턴 식별</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* NTP center */}
              <DataBox x={190} y={10} w={100} h={30} label="NTP 서버" sub="시간 동기화" color={C.blue} />
              {/* 3 log sources */}
              <Arrow x1={210} y1={42} x2={70} y2={72} color={C.blue} />
              <Arrow x1={240} y1={42} x2={240} y2={72} color={C.blue} />
              <Arrow x1={270} y1={42} x2={410} y2={72} color={C.blue} />

              <ModuleBox x={20} y={72} w={100} h={40} label="시스템 로그" sub="OS 이벤트" color={C.green} />
              <ModuleBox x={185} y={72} w={110} h={40} label="네트워크 로그" sub="방화벽·라우터" color={C.amber} />
              <ModuleBox x={360} y={72} w={100} h={40} label="앱 로그" sub="웹·API·DB" color={C.red} />

              {/* All to SIEM */}
              <Arrow x1={70} y1={114} x2={190} y2={140} color={C.green} />
              <Arrow x1={240} y1={114} x2={240} y2={140} color={C.amber} />
              <Arrow x1={410} y1={114} x2={290} y2={140} color={C.red} />
              <ModuleBox x={170} y={140} w={140} h={40} label="SIEM 중앙 집중" sub="6개월+ 보관" color={C.blue} />

              <DataBox x={350} y={145} w={110} h={28} label="WORM 무결성" sub="해시 체인 보전" color={C.green} />

              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시간 어긋남 → 타임라인 재구성 불가</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3-phase initial response */}
              <AlertBox x={180} y={5} w={120} h={32} label="사고 확인!" sub="" color={C.red} />
              <Arrow x1={240} y1={39} x2={80} y2={60} color={C.red} />
              <Arrow x1={240} y1={39} x2={240} y2={60} color={C.amber} />
              <Arrow x1={240} y1={39} x2={400} y2={60} color={C.blue} />

              {/* Phase 1: Isolation */}
              <ActionBox x={20} y={62} w={120} h={50} label="1. 격리" sub="네트워크 차단" color={C.red} />
              <text x={80} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">케이블 분리</text>
              <text x={80} y={137} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">스위치 포트 OFF</text>
              <text x={80} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">방화벽 IP 차단</text>

              {/* Phase 2: Forensics */}
              <ActionBox x={175} y={62} w={130} h={50} label="2. 포렌식" sub="증거 보전" color={C.amber} />
              <text x={240} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">메모리 덤프</text>
              <text x={240} y={137} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">디스크 이미지 (write blocker)</text>
              <text x={240} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">SHA-256 무결성 + CoC 기록</text>

              {/* Phase 3: Scope */}
              <ActionBox x={340} y={62} w={120} h={50} label="3. 영향 범위" sub="로그 추적" color={C.blue} />
              <text x={400} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">접근 서버 목록</text>
              <text x={400} y={137} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">유출 데이터 종류</text>
              <text x={400} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">보고 의무 판단</text>

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">격리 → 증거 보전 → 범위 파악 (병행 수행)</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Containment actions */}
              <ModuleBox x={160} y={8} w={160} h={36} label="봉쇄 (Containment)" sub="공격 경로 완전 차단" color={C.red} />
              <Arrow x1={200} y1={46} x2={80} y2={68} color={C.red} />
              <Arrow x1={240} y1={46} x2={240} y2={68} color={C.red} />
              <Arrow x1={280} y1={46} x2={400} y2={68} color={C.red} />

              <ActionBox x={20} y={68} w={120} h={38} label="취약점 패치" sub="hotfix / 서비스 중단" color={C.amber} />
              <ActionBox x={175} y={68} w={130} h={38} label="계정 잠금" sub="비밀번호 강제 초기화" color={C.blue} />
              <ActionBox x={340} y={68} w={120} h={38} label="백도어 점검" sub="전체 시스템 스캔" color={C.red} />

              {/* Backdoor types */}
              <Arrow x1={400} y1={108} x2={340} y2={130} color={C.red} />
              <Arrow x1={400} y1={108} x2={400} y2={130} color={C.red} />
              <Arrow x1={400} y1={108} x2={460} y2={130} color={C.red} />
              <AlertBox x={305} y={130} w={70} h={30} label="웹셸" sub="" color={C.red} />
              <AlertBox x={380} y={130} w={50} h={30} label="SSH 키" sub="" color={C.red} />
              <AlertBox x={435} y={130} w={40} h={30} label="cron" sub="" color={C.red} />

              <StatusBox x={20} y={130} w={180} h={42} label="봉쇄 완료 체크리스트" sub="패치 + 잠금 + 백도어 = 0" color={C.green} progress={1} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">하나라도 누락 시 재침입 위험</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Internal incident */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>내부 사고</text>
              <ActionBox x={20} y={26} w={90} h={32} label="비정상 출금" sub="감지" color={C.red} />
              <Arrow x1={112} y1={42} x2={128} y2={42} color={C.red} />
              <ActionBox x={130} y={26} w={80} h={32} label="출금 정지" sub="지갑 동결" color={C.amber} />
              <Arrow x1={70} y1={60} x2={70} y2={78} color={C.red} />
              <ActionBox x={20} y={78} w={200} h={32} label="온체인 분석 — 자금 이동 경로 추적" sub="" color={C.blue} />

              {/* divider */}
              <line x1={240} y1={22} x2={240} y2={145} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />

              {/* External incident */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>외부 사고</text>
              <ActionBox x={280} y={26} w={80} h={32} label="FDS 보류" sub="이상 거래" color={C.amber} />
              <Arrow x1={362} y1={42} x2={378} y2={42} color={C.amber} />
              <ActionBox x={380} y={26} w={80} h={32} label="계정 정지" sub="본인 확인" color={C.red} />
              <Arrow x1={380} y1={60} x2={380} y2={78} color={C.red} />
              <ActionBox x={280} y={78} w={180} h={32} label="고객 통지 → MFA 재설정 → 유관기관 신고" sub="" color={C.green} />

              {/* common bottom */}
              <DataBox x={140} y={130} w={200} h={30} label="피해 규모 산정 → 유관기관 보고" sub="" color={C.blue} />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">VASP 환경: 자산 유출 = 즉시 출금 정지 원칙</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
