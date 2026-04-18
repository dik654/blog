import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
};

const STEPS = [
  {
    label: '외부 수탁 3대 조건',
    body: '사고예방 체계 + 이해상충 방지 + 재위탁 금지. 특히 재위탁 금지가 핵심 — 수탁 체인이 길어지면 보안·책임 추적 불가.',
  },
  {
    label: '수탁기관 선정 5대 기준',
    body: 'ISMS/SOC 2 보안인증, 배상보험 가입, 업무지침 공시, 재무건전성, FIU 신고 수리. SOC 2 Type II는 기간 검증이라 더 신뢰.',
  },
  {
    label: '분기별 위탁관리 점검 항목',
    body: '잔고 3자 대조(온체인+수탁장부+VASP장부) + 접근 로그 검토 + 인증 갱신 확인 + SLA 이행 여부.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 4, ay = y2 - uy * 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`} fill={color} />
    </g>
  );
}

export default function CustodyConditionsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>외부 수탁 3대 조건</text>

              {/* VASP */}
              <ModuleBox x={10} y={40} w={90} h={44} label="VASP" sub="위탁 의뢰" color={C.blue} />
              <Arrow x1={100} y1={62} x2={140} y2={62} color={C.blue} />

              {/* 3대 조건 게이트 */}
              <rect x={145} y={28} width={190} height={110} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={240} y={46} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>필수 조건 충족</text>

              <ActionBox x={155} y={52} w={170} h={24} label="1. 사고예방 체계" sub="" color={C.green} />
              <ActionBox x={155} y={80} w={170} h={24} label="2. 이해상충 방지" sub="" color={C.green} />
              <ActionBox x={155} y={108} w={170} h={24} label="3. 재위탁 금지" sub="" color={C.red} />

              {/* 수탁기관 */}
              <Arrow x1={335} y1={62} x2={370} y2={62} color={C.green} />
              <ModuleBox x={375} y={40} w={95} h={44} label="수탁기관" sub="보관 전담" color={C.green} />

              {/* 재위탁 금지 강조 */}
              <AlertBox x={100} y={155} w={280} h={40} label="재위탁 금지가 핵심" sub="A사 → B사 → C사 체인이면 보안·책임 추적 불가" color={C.red} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>수탁기관 선정 5대 기준</text>

              {/* 5개 기준 — 2열 배치 */}
              <ActionBox x={20} y={35} w={140} h={36} label="보안 인증" sub="ISMS, SOC 2, ISO 27001" color={C.green} />
              <ActionBox x={175} y={35} w={140} h={36} label="배상보험 가입" sub="해킹·내부범죄 보상" color={C.amber} />
              <ActionBox x={330} y={35} w={140} h={36} label="업무지침 공시" sub="키관리·접근통제·대응계획" color={C.blue} />

              <ActionBox x={80} y={85} w={140} h={36} label="재무 건전성" sub="자본금·감사보고서" color={C.slate} />
              <ActionBox x={260} y={85} w={140} h={36} label="FIU 신고 수리" sub="금융정보분석원 확인" color={C.blue} />

              {/* SOC 2 설명 */}
              <rect x={40} y={140} width={400} height={55} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={240} y={158} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>SOC 2 Type I vs Type II</text>
              <text x={240} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Type I: 특정 시점 설계 적정성만 평가</text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill={C.green}>Type II: 6~12개월 실제 통제 실효성 검증 → 더 신뢰</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>분기별 위탁관리 점검</text>

              {/* VASP 점검 주체 */}
              <ModuleBox x={180} y={30} w={120} h={40} label="VASP" sub="분기 점검 주체" color={C.blue} />

              {/* 4개 점검 항목 */}
              <Arrow x1={200} y1={70} x2={70} y2={95} color={C.green} />
              <Arrow x1={220} y1={70} x2={190} y2={95} color={C.amber} />
              <Arrow x1={260} y1={70} x2={310} y2={95} color={C.blue} />
              <Arrow x1={280} y1={70} x2={420} y2={95} color={C.slate} />

              <ActionBox x={10} y={100} w={120} h={44} label="잔고 3자 대조" sub="온체인+수탁+VASP" color={C.green} />
              <ActionBox x={140} y={100} w={110} h={44} label="접근 로그" sub="비인가 접근 탐지" color={C.amber} />
              <ActionBox x={260} y={100} w={110} h={44} label="인증 갱신" sub="ISMS/SOC 만료?" color={C.blue} />
              <ActionBox x={380} y={100} w={90} h={44} label="SLA 이행" sub="가용성·응답시간" color={C.slate} />

              {/* 이상 시 조치 */}
              <Arrow x1={70} y1={144} x2={240} y2={170} color={C.red} />
              <Arrow x1={195} y1={144} x2={240} y2={170} color={C.red} />
              <Arrow x1={315} y1={144} x2={240} y2={170} color={C.red} />
              <Arrow x1={425} y1={144} x2={240} y2={170} color={C.red} />

              <AlertBox x={120} y={170} w={240} h={30} label="이상 발견 시" sub="즉시 원인 조사 + 계약 재검토 또는 대체 기관 준비" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
