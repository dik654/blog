import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
};

const STEPS = [
  {
    label: '다중서명(Multi-sig) 구조 — 3-of-5 예시',
    body: '5명의 키 보유자 중 3명 이상이 서명해야 전송 실행. 1명 매수/분실에도 자산 안전. 키 보유자는 서로 다른 부서·장소에 분산.',
  },
  {
    label: '콜드 → 핫 전송 4단계 절차',
    body: '운영팀 요청 → CISO 승인 → 키 보유자 다중서명 → 온체인 컨펌 + 로그 기록. 모든 기록은 5년간 보관.',
  },
  {
    label: '핫월렛 운영 3원칙',
    body: '일일 출금 한도 설정 + Kill Switch(긴급 차단) + 잔고 최소화(매 4시간 sweep). 공격 표면을 최소화하는 전략.',
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

export default function ColdToHotTransferViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>다중서명 3-of-5 구조</text>

              {/* 5명의 키 보유자 — 원형 배치 */}
              {[0, 1, 2, 3, 4].map((i) => {
                const cx = 80 + i * 80;
                const signed = i < 3;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={60} r={20} fill="var(--card)" stroke={signed ? C.green : C.slate} strokeWidth={signed ? 1.5 : 0.5} />
                    <text x={cx} y={56} textAnchor="middle" fontSize={8} fontWeight={600} fill={signed ? C.green : C.slate}>
                      {`키 ${i + 1}`}
                    </text>
                    <text x={cx} y={68} textAnchor="middle" fontSize={7} fill={signed ? C.green : C.slate}>
                      {signed ? '서명 완료' : '미서명'}
                    </text>
                    {signed && <Arrow x1={cx} y1={80} x2={240} y2={110} color={C.green} />}
                  </g>
                );
              })}

              {/* 트랜잭션 */}
              <ModuleBox x={180} y={115} w={120} h={40} label="전송 실행" sub="3/5 충족 → 유효" color={C.green} />

              {/* 안전 설명 */}
              <rect x={60} y={170} width={360} height={30} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.5} />
              <text x={240} y={189} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1명 매수·분실에도 안전 | 키 보유자는 서로 다른 부서·장소에 분산 배치</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>{'콜드 → 핫 전송 절차'}</text>

              {/* 콜드월렛 */}
              <ModuleBox x={10} y={35} w={80} h={40} label="콜드월렛" sub="자산 보관" color={C.green} />

              {/* 단계 1: 요청 */}
              <Arrow x1={90} y1={55} x2={110} y2={55} color={C.blue} />
              <ActionBox x={115} y={35} w={75} h={40} label="1. 요청" sub="운영팀" color={C.blue} />

              {/* 단계 2: 승인 */}
              <Arrow x1={190} y1={55} x2={210} y2={55} color={C.amber} />
              <ActionBox x={215} y={35} w={75} h={40} label="2. 승인" sub="CISO" color={C.amber} />

              {/* 단계 3: 다중서명 */}
              <Arrow x1={290} y1={55} x2={310} y2={55} color={C.green} />
              <ActionBox x={315} y={35} w={75} h={40} label="3. 서명" sub="2인+ 키보유자" color={C.green} />

              {/* 단계 4: 전송 */}
              <Arrow x1={390} y1={55} x2={410} y2={55} color={C.blue} />
              <StatusBox x={415} y={35} w={55} h={40} label="4.전송" sub="컨펌" color={C.blue} progress={1} />

              {/* 핫월렛 */}
              <Arrow x1={442} y1={75} x2={442} y2={95} color={C.amber} />
              <ModuleBox x={380} y={100} w={90} h={40} label="핫월렛" sub="출금 처리" color={C.amber} />

              {/* 전송 후 체크 */}
              <Arrow x1={380} y1={120} x2={320} y2={120} color={C.red} />
              <AlertBox x={130} y={105} w={190} h={34} label="전송 후 비율 재확인" sub="80% 미달 시 추가 전송 중지" color={C.red} />

              {/* 기록 보관 */}
              <rect x={60} y={158} width={360} height={40} rx={6} fill="var(--card)" stroke={C.slate} strokeWidth={0.5} />
              <text x={240} y={176} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.slate}>기록 보관 5년</text>
              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">요청서 + 승인 이력 + 트랜잭션 해시 → 감사 추적 가능</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>핫월렛 운영 3원칙</text>

              {/* 원칙 1: 일일 한도 */}
              <ActionBox x={20} y={40} w={130} h={50} label="일일 출금 한도" sub="최대 금액 설정" color={C.amber} />
              <text x={85} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비정상 대량 출금</text>
              <text x={85} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">한도에서 차단</text>

              {/* 원칙 2: Kill Switch */}
              <ActionBox x={175} y={40} w={130} h={50} label="Kill Switch" sub="긴급 전송 중지" color={C.red} />
              <text x={240} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이상 징후 시</text>
              <text x={240} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">즉시 발동</text>

              {/* 원칙 3: 잔고 최소화 */}
              <ActionBox x={330} y={40} w={130} h={50} label="잔고 최소화" sub="예상 출금 1.5~2배만" color={C.green} />
              <text x={395} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">매 4시간 sweep</text>
              <text x={395} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">콜드로 회수</text>

              {/* 공통 목표 */}
              <Arrow x1={85} y1={122} x2={240} y2={145} color={C.amber} />
              <Arrow x1={240} y1={122} x2={240} y2={145} color={C.red} />
              <Arrow x1={395} y1={122} x2={240} y2={145} color={C.green} />

              <ModuleBox x={150} y={150} w={180} h={44} label="공격 표면 최소화" sub="핫월렛은 상시 온라인 → 위험 최소로" color={C.blue} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
