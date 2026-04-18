import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'ISMS 2.11 — 사고 대응 생명주기',
    body: '사전 예방 → 탐지 → 대응 → 복구 → 사후관리. 어느 단계가 빠져도 "관리체계"가 아니다.',
  },
  {
    label: '침해사고 유형 분류',
    body: '기밀성·무결성·가용성 중 하나 이상을 침해하는 사건. 외부 공격(해킹, 랜섬웨어, DDoS, 피싱)과 내부 위협(내부자 유출)으로 구분한다.',
  },
  {
    label: 'NIST 기반 대응 5단계',
    body: '준비(Preparation) → 탐지/분석(Detection) → 봉쇄(Containment) → 근절/복구(Eradication & Recovery) → 사후활동(Post-Incident).',
  },
  {
    label: 'CERT 조직 구성',
    body: '총괄 책임자(CISO)·기술 분석관·시스템 운영자·커뮤니케이션 담당. 역할이 명확해야 현장 혼선이 없다.',
  },
  {
    label: '비상연락망 체계',
    body: '사고 인지 1시간 이내 CISO 보고 → 개인정보 유출 시 24시간 이내 KISA 신고 → 금융 사고 시 금감원 병행 보고.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-ov-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 5-phase lifecycle */}
              <ActionBox x={10} y={30} w={80} h={36} label="예방" sub="Prevention" color={C.blue} />
              <Arrow x1={92} y1={48} x2={108} y2={48} color={C.blue} />
              <ActionBox x={110} y={30} w={80} h={36} label="탐지" sub="Detection" color={C.amber} />
              <Arrow x1={192} y1={48} x2={208} y2={48} color={C.amber} />
              <ActionBox x={210} y={30} w={80} h={36} label="대응" sub="Response" color={C.red} />
              <Arrow x1={292} y1={48} x2={308} y2={48} color={C.red} />
              <ActionBox x={310} y={30} w={80} h={36} label="복구" sub="Recovery" color={C.green} />
              <Arrow x1={392} y1={48} x2={408} y2={48} color={C.green} />
              <ActionBox x={410} y={30} w={65} h={36} label="사후관리" sub="Post" color={C.blue} />
              {/* cyclic arrow */}
              <path d="M 442 68 C 442 160, 240 180, 50 160 L 50 68" fill="none" stroke={C.blue} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#ir-ov-arrow)" />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">전체 생명주기를 순환</text>
              <StatusBox x={160} y={100} w={160} h={45} label="ISMS-P 2.11" sub="문서화 + 훈련 + 보고" color={C.blue} progress={1} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* CIA triad */}
              <DataBox x={180} y={8} w={120} h={30} label="CIA 침해" sub="기밀·무결·가용" color={C.red} />
              <Arrow x1={200} y1={40} x2={80} y2={65} color={C.red} />
              <Arrow x1={280} y1={40} x2={400} y2={65} color={C.red} />
              {/* external */}
              <text x={140} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>외부 공격</text>
              <AlertBox x={15} y={68} w={80} h={36} label="해킹" sub="SQLi, XSS" color={C.red} />
              <AlertBox x={105} y={68} w={80} h={36} label="랜섬웨어" sub="파일 암호화" color={C.red} />
              <AlertBox x={15} y={115} w={80} h={36} label="DDoS" sub="서비스 마비" color={C.amber} />
              <AlertBox x={105} y={115} w={80} h={36} label="피싱" sub="계정 탈취" color={C.amber} />
              {/* internal */}
              <text x={380} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>내부 위협</text>
              <AlertBox x={330} y={68} w={120} h={36} label="내부자 유출" sub="행위 분석 필수" color={C.red} />
              {/* detection difference */}
              <rect x={330} y={115} width={120} height={36} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={390} y={130} textAnchor="middle" fontSize={9} fill="var(--foreground)">기술 탐지 한계</text>
              <text x={390} y={143} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">UBA 행위 분석 필요</text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">유형마다 탐지 방법·대응 절차가 다르다</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 5 phases stacked vertically with arrows */}
              <StatusBox x={20} y={15} w={120} h={42} label="1. 준비" sub="절차서·도구·교육" color={C.blue} progress={0.2} />
              <Arrow x1={142} y1={36} x2={158} y2={36} color={C.blue} />
              <StatusBox x={160} y={15} w={120} h={42} label="2. 탐지/분석" sub="오탐 제거·심각도 평가" color={C.amber} progress={0.4} />
              <Arrow x1={282} y1={36} x2={298} y2={36} color={C.amber} />
              <StatusBox x={300} y={15} w={120} h={42} label="3. 봉쇄" sub="격리·차단·잠금" color={C.red} progress={0.6} />
              {/* second row */}
              <StatusBox x={100} y={80} w={140} h={42} label="4. 근절/복구" sub="악성코드 제거·패치·백업 복원" color={C.green} progress={0.8} />
              <Arrow x1={300} y1={59} x2={240} y2={78} color={C.red} />
              <Arrow x1={242} y1={124} x2={340} y2={143} color={C.green} />
              <StatusBox x={260} y={140} w={140} h={42} label="5. 사후활동" sub="보고서·정책 개선·추가 훈련" color={C.blue} progress={1} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">NIST SP 800-61 기반 5단계 프레임워크</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* CERT org chart */}
              <ModuleBox x={180} y={10} w={120} h={40} label="CERT" sub="침해사고대응팀" color={C.blue} />
              <Arrow x1={210} y1={52} x2={70} y2={80} color={C.blue} />
              <Arrow x1={240} y1={52} x2={200} y2={80} color={C.blue} />
              <Arrow x1={240} y1={52} x2={300} y2={80} color={C.blue} />
              <Arrow x1={270} y1={52} x2={410} y2={80} color={C.blue} />
              <ModuleBox x={20} y={82} w={100} h={44} label="총괄 책임자" sub="CISO / 임원" color={C.red} />
              <ModuleBox x={145} y={82} w={110} h={44} label="기술 분석관" sub="로그·포렌식·분석" color={C.amber} />
              <ModuleBox x={280} y={82} w={100} h={44} label="시스템 운영" sub="격리·패치·복구" color={C.green} />
              <ModuleBox x={405} y={82} w={65} h={44} label="커뮤니케이션" sub="" color={C.blue} />
              {/* annotation */}
              <ActionBox x={20} y={148} w={100} h={30} label="의사결정·외부보고" color={C.red} />
              <ActionBox x={145} y={148} w={110} h={30} label="증거 수집·악성코드" color={C.amber} />
              <ActionBox x={280} y={148} w={100} h={30} label="네트워크·서비스" color={C.green} />
              <ActionBox x={395} y={148} w={75} h={30} label="공지·신고" color={C.blue} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">역할 사전 지정 + 정기 갱신 필수</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* escalation flow */}
              <ActionBox x={20} y={20} w={90} h={36} label="사고 인지" sub="탐지 시점" color={C.red} />
              <Arrow x1={112} y1={38} x2={148} y2={38} color={C.red} />
              <text x={130} y={30} textAnchor="middle" fontSize={8} fill={C.red}>1시간</text>
              <ModuleBox x={150} y={20} w={80} h={36} label="CISO" sub="심각도 판단" color={C.amber} />
              <Arrow x1={232} y1={38} x2={268} y2={38} color={C.amber} />
              <ModuleBox x={270} y={20} w={80} h={36} label="경영진" sub="에스컬레이션" color={C.blue} />

              {/* external reports */}
              <Arrow x1={190} y1={58} x2={100} y2={90} color={C.red} />
              <text x={125} y={78} textAnchor="middle" fontSize={8} fill={C.red}>24시간</text>
              <AlertBox x={40} y={90} w={110} h={36} label="KISA 신고" sub="개인정보 유출" color={C.red} />
              <Arrow x1={190} y1={58} x2={240} y2={90} color={C.amber} />
              <AlertBox x={180} y={90} w={110} h={36} label="금감원 보고" sub="금융 사고" color={C.amber} />
              <Arrow x1={190} y1={58} x2={380} y2={90} color={C.blue} />
              <AlertBox x={320} y={90} w={130} h={36} label="경찰 사이버수사대" sub="범죄 의심" color={C.blue} />

              {/* bottom note */}
              <DataBox x={120} y={150} w={240} h={30} label="연락망 분기 1회 갱신 + 대리인 지정" color={C.green} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">보고 지연 = 피해 확대의 가장 흔한 원인</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
