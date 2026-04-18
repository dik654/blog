import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#6366f1', green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '내부통제 3대 축', body: '자산 보관(지갑 분리) + 접근 통제(인증/권한) + 사고 대응(탐지/복구). 세 축이 유기적으로 연결되어야 단일 장애점이 사라진다.' },
  { label: 'Hot/Cold 분리와 Multi-sig', body: '핫월렛은 즉시 출금용(소량), 콜드월렛은 오프라인 격리(대부분). Multi-sig로 단독 서명 불가 → 내부자 단독 범행 방지.' },
  { label: 'KYC → 거래 → AML 파이프라인', body: '고객확인 미완료 시 입출금 차단. FDS가 실시간 패턴 분석, 의심거래(STR) 자동 보류. Travel Rule로 VASP 간 송수신자 정보 교환.' },
  { label: '3선 방어 조직 구조', body: '1선(현업) → 2선(CISO/CCO) → 3선(내부감사). 각 라인이 독립적으로 작동해야 내부통제가 형식에 그치지 않는다.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3 pillars */}
              <ModuleBox x={30} y={30} w={120} h={55} label="자산 보관" sub="지갑 분리 운영" color={C.blue} />
              <ModuleBox x={180} y={30} w={120} h={55} label="접근 통제" sub="인증 + 최소권한" color={C.green} />
              <ModuleBox x={330} y={30} w={120} h={55} label="사고 대응" sub="탐지 + 복구" color={C.amber} />
              {/* connections */}
              <Arrow x1={150} y1={57} x2={178} y2={57} color={C.blue} />
              <Arrow x1={300} y1={57} x2={328} y2={57} color={C.green} />
              {/* bottom: single point of failure */}
              <rect x={100} y={110} width={280} height={44} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">유기적 연결 → 단일 장애점(SPOF) 제거</text>
              <text x={240} y={144} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">지갑 안전해도 접근통제 허술 → 키 탈취 / 접근통제 완벽해도 사고대응 없음 → 제로데이 무방비</text>
              <Arrow x1={90} y1={85} x2={140} y2={108} color={C.blue} />
              <Arrow x1={240} y1={85} x2={240} y2={108} color={C.green} />
              <Arrow x1={390} y1={85} x2={340} y2={108} color={C.amber} />
              {/* irreversible callout */}
              <AlertBox x={130} y={168} w={220} h={38} label="블록체인 거래는 되돌릴 수 없다" sub="개인키 = 자산 전체 통제권" color={C.red} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Hot wallet */}
              <ModuleBox x={20} y={20} w={130} h={55} label="핫월렛" sub="온라인 · 즉시 출금" color={C.amber} />
              <text x={85} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">전체 자산의 극소량</text>
              {/* Cold wallet */}
              <ModuleBox x={200} y={20} w={130} h={55} label="콜드월렛" sub="오프라인 · 물리 격리" color={C.blue} />
              <text x={265} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">전체 자산의 80%+</text>
              {/* Arrow cold→hot */}
              <Arrow x1={200} y1={47} x2={152} y2={47} color={C.blue} />
              <text x={176} y={42} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">보충</text>
              {/* Multi-sig */}
              <rect x={350} y={20} width={120} height={80} rx={8} fill={`${C.green}08`} stroke={C.green} strokeWidth={0.8} />
              <text x={410} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>Multi-sig</text>
              <text x={410} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">3-of-5 서명 필요</text>
              <text x={410} y={70} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">단독 이동 불가</text>
              <text x={410} y={84} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">공격 난이도 급증</text>
              {/* trade-off bar */}
              <rect x={60} y={120} width={280} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={80} y={140} fontSize={9} fontWeight={600} fill={C.amber}>편의성</text>
              <rect x={130} y={132} width={160} height={6} rx={3} fill="var(--border)" opacity={0.3} />
              <rect x={130} y={132} width={40} height={6} rx={3} fill={C.amber} />
              <rect x={250} y={132} width={40} height={6} rx={3} fill={C.blue} />
              <text x={315} y={140} fontSize={9} fontWeight={600} fill={C.blue}>보안</text>
              {/* Hot = risk */}
              <AlertBox x={60} y={168} w={130} h={36} label="핫월렛 침해 시" sub="피해 규모 한정" color={C.red} />
              <DataBox x={230} y={172} w={130} h={28} label="콜드월렛은 물리 접근 필수" color={C.blue} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Pipeline flow */}
              <ActionBox x={10} y={30} w={90} h={42} label="KYC 인증" sub="실명 · 신분증" color={C.blue} />
              <Arrow x1={100} y1={51} x2={118} y2={51} color={C.blue} />
              <ActionBox x={120} y={30} w={90} h={42} label="거래 요청" sub="입금 · 출금" color={C.green} />
              <Arrow x1={210} y1={51} x2={228} y2={51} color={C.green} />
              <ActionBox x={230} y={30} w={90} h={42} label="FDS 분석" sub="실시간 패턴" color={C.amber} />
              <Arrow x1={320} y1={51} x2={338} y2={51} color={C.amber} />
              <ActionBox x={340} y={30} w={110} h={42} label="AML 검증" sub="STR · Travel Rule" color={C.red} />
              {/* Blocked path */}
              <AlertBox x={10} y={100} w={180} h={36} label="KYC 미완료 → 입출금 차단" sub="시스템 레벨에서 원천 차단" color={C.red} />
              {/* FDS detail */}
              <rect x={210} y={95} width={240} height={60} rx={6} fill={`${C.amber}08`} stroke={C.amber} strokeWidth={0.6} />
              <text x={220} y={113} fontSize={9} fontWeight={600} fill={C.amber}>FDS 탐지 항목</text>
              <text x={220} y={128} fontSize={9} fill="var(--muted-foreground)">- 비정상 IP · 대량 출금 · 새벽 활동</text>
              <text x={220} y={143} fontSize={9} fill="var(--muted-foreground)">- 의심거래 → 자동 보류 → 내부 심사</text>
              {/* Travel Rule */}
              <rect x={80} y={168} width={320} height={36} rx={6} fill={`${C.blue}08`} stroke={C.blue} strokeWidth={0.6} />
              <text x={90} y={185} fontSize={9} fontWeight={600} fill={C.blue}>FATF Travel Rule</text>
              <text x={90} y={198} fontSize={9} fill="var(--muted-foreground)">일정액 이상 전송 시 송수신자 정보 교환 — 미지원 VASP이면 전송 거부</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3 lines of defense */}
              <ModuleBox x={30} y={20} w={120} h={50} label="1선: 현업" sub="일상 업무 수행" color={C.green} />
              <Arrow x1={150} y1={45} x2={178} y2={45} color={C.green} />
              <ModuleBox x={180} y={20} w={120} h={50} label="2선: CISO / CCO" sub="정책 수립 · 감시" color={C.blue} />
              <Arrow x1={300} y1={45} x2={328} y2={45} color={C.blue} />
              <ModuleBox x={330} y={20} w={120} h={50} label="3선: 내부감사" sub="독립 검증" color={C.amber} />
              {/* Arrow to board */}
              <Arrow x1={390} y1={72} x2={390} y2={98} color={C.amber} />
              <DataBox x={320} y={100} w={140} h={30} label="이사회 · 경영진 직접 보고" color={C.amber} />
              {/* CISO vs CCO */}
              <rect x={30} y={95} width={260} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={40} y={113} fontSize={10} fontWeight={600} fill={C.blue}>CISO</text>
              <text x={85} y={113} fontSize={9} fill="var(--muted-foreground)">보안 정책 · 기술 통제</text>
              <text x={40} y={133} fontSize={10} fontWeight={600} fill={C.green}>CCO</text>
              <text x={82} y={133} fontSize={9} fill="var(--muted-foreground)">법규 준수 · AML/CFT</text>
              <text x={200} y={143} fontSize={8} fill="var(--muted-foreground)">동일인 겸임 금지</text>
              {/* Warning */}
              <AlertBox x={80} y={168} w={320} h={36} label="3선 방어가 무너지면 내부통제는 형식에 그침" sub="각 라인의 독립성 확보가 최우선 전제 조건" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
