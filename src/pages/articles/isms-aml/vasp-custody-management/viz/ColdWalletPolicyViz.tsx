import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
};

const STEPS = [
  {
    label: '콜드월렛 80% 규정 — 경제적 가치 기준',
    body: '이용자 자산의 경제적 가치 총합 중 80% 이상을 콜드월렛에 보관. "수량"이 아니라 "가치" 기준이므로 고가 자산 위주로 콜드에 넣어야 한다.',
  },
  {
    label: '월초 재산정 절차 — 4단계 프로세스',
    body: '매월 초 5영업일 이내에 수량 집계 → 가치 산정 → 비율 계산 → 미달 시 조치. 재산정 기록은 감독 기관 검사 시 제출 대상.',
  },
  {
    label: '다중서명 + 물리적 보안 — 콜드월렛 이동 통제',
    body: '콜드월렛 자산 이동에는 2인 이상 서명 필수. 키 보유자는 서로 다른 부서·장소에 분산 배치하여 단독 접근을 원천 차단.',
  },
  {
    label: '콜드 → 핫 전송 절차 — 사전 승인 기반',
    body: '운영팀 요청 → 책임자 승인 → 다중서명 → 온체인 검증. 전송 후 80% 미달 여부 즉시 재확인, 기록은 5년간 보관.',
  },
  {
    label: '핫월렛 운영 원칙 — 최소 잔고 + Kill Switch',
    body: '핫월렛은 최대 20%. 일일 출금 한도, 긴급 차단(Kill Switch), 잔고 최소화(매 4시간 sweep)로 공격 표면을 최소화.',
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
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
}

export default function ColdWalletPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>이용자 자산 배분 구조</text>

              {/* 전체 자산 */}
              <ModuleBox x={170} y={30} w={140} h={44} label="이용자 자산 총액" sub="경제적 가치 기준" color={C.blue} />

              {/* 콜드 80% */}
              <StatusBox x={40} y={100} w={180} h={50} label="콜드월렛" sub="80% 이상 (오프라인)" color={C.green} progress={0.8} />
              <Arrow x1={200} y1={74} x2={130} y2={100} color={C.green} />

              {/* 핫 20% */}
              <StatusBox x={260} y={100} w={180} h={50} label="핫월렛" sub="최대 20% (온라인)" color={C.amber} progress={0.2} />
              <Arrow x1={280} y1={74} x2={350} y2={100} color={C.amber} />

              {/* 가치 산정 공식 */}
              <rect x={70} y={170} width={340} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={189} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                경제적 가치 = 종류별 (수량 x 최근 1년 일평균 원화환산액)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>월초 재산정 절차</text>

              {/* 4단계 가로 흐름 */}
              <ActionBox x={10} y={35} w={100} h={40} label="1. 수량 집계" sub="전월 말 기준" color={C.blue} />
              <Arrow x1={110} y1={55} x2={128} y2={55} color={C.blue} />

              <ActionBox x={132} y={35} w={100} h={40} label="2. 가치 산정" sub="1년 일평균" color={C.blue} />
              <Arrow x1={232} y1={55} x2={250} y2={55} color={C.blue} />

              <ActionBox x={254} y={35} w={100} h={40} label="3. 비율 계산" sub="콜드/전체" color={C.amber} />
              <Arrow x1={354} y1={55} x2={372} y2={55} color={C.amber} />

              <ActionBox x={376} y={35} w={95} h={40} label="4. 보완 조치" sub="5영업일 이내" color={C.green} />

              {/* 분기: 80% 이상 vs 미만 */}
              <Arrow x1={304} y1={75} x2={200} y2={105} color={C.green} />
              <Arrow x1={304} y1={75} x2={380} y2={105} color={C.red} />

              <DataBox x={120} y={100} w={160} h={32} label="80% 이상 — 유지" color={C.green} />
              <AlertBox x={310} y={100} w={160} h={40} label="80% 미만" sub="핫→콜드 즉시 이동" color={C.red} />

              {/* 기한 */}
              <rect x={140} y={155} width={200} height={28} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={173} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">매월 초 5영업일 이내 완료 / 기록 보관 필수</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.purple}>다중서명(Multi-sig) 구조</text>

              {/* 콜드월렛 */}
              <ModuleBox x={180} y={28} w={120} h={44} label="콜드월렛" sub="자산 이동 대기" color={C.purple} />

              {/* 5명 키 보유자 중 3명 서명 */}
              {[0, 1, 2, 3, 4].map((i) => {
                const x = 30 + i * 90;
                const signed = i < 3;
                return (
                  <g key={i}>
                    {signed
                      ? <StatusBox x={x} y={95} w={78} h={40} label={`서명자 ${i + 1}`} sub="서명 완료" color={C.green} progress={1} />
                      : <AlertBox x={x} y={95} w={78} h={40} label={`서명자 ${i + 1}`} sub="미서명" color={C.amber} />
                    }
                    <Arrow x1={x + 39} y1={95} x2={240} y2={72} color={signed ? C.green : C.amber} />
                  </g>
                );
              })}

              {/* 결과 */}
              <DataBox x={150} y={155} w={180} h={34} label="3-of-5 충족 → 전송 실행" color={C.green} />

              {/* 분산 배치 안내 */}
              <rect x={100} y={195} width={280} height={20} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={209} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                키 보유자: 서로 다른 부서 / 물리적 다른 장소에 분산 배치
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>{'콜드 → 핫 전송 절차'}</text>

              {/* 4단계 세로 흐름 */}
              <ActionBox x={20} y={30} w={120} h={36} label="1. 전송 요청" sub="운영팀 — 잔고 부족" color={C.blue} />
              <Arrow x1={140} y1={48} x2={165} y2={48} color={C.blue} />

              <ActionBox x={170} y={30} w={120} h={36} label="2. 승인" sub="CISO 확인" color={C.amber} />
              <Arrow x1={290} y1={48} x2={315} y2={48} color={C.amber} />

              <ActionBox x={320} y={30} w={140} h={36} label="3. 다중서명" sub="키 보유자 2인+" color={C.purple} />

              <Arrow x1={390} y1={66} x2={390} y2={90} color={C.purple} />

              <ModuleBox x={300} y={90} w={160} h={44} label="4. 전송 + 검증" sub="온체인 컨펌 확인" color={C.green} />

              {/* 콜드 → 핫 */}
              <DataBox x={20} y={100} w={100} h={32} label="콜드월렛" color={C.green} />
              <Arrow x1={120} y1={116} x2={300} y2={112} color={C.green} />
              <DataBox x={200} y={145} w={100} h={32} label="핫월렛" color={C.amber} />
              <Arrow x1={380} y1={134} x2={300} y2={152} color={C.amber} />

              {/* 비율 재확인 */}
              <AlertBox x={20} y={155} w={160} h={40} label="비율 재확인" sub="80% 미달 시 추가 전송 중지" color={C.red} />
              <Arrow x1={120} y1={145} x2={120} y2={155} color={C.red} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>핫월렛 운영 원칙</text>

              {/* 핫월렛 중앙 */}
              <ModuleBox x={180} y={28} w={120} h={44} label="핫월렛" sub="최대 20% (온라인)" color={C.amber} />

              {/* 3가지 원칙 */}
              <ActionBox x={10} y={100} w={130} h={44} label="일일 출금 한도" sub="비정상 대량 출금 차단" color={C.blue} />
              <Arrow x1={75} y1={100} x2={210} y2={72} color={C.blue} />

              <ActionBox x={175} y={100} w={130} h={44} label="Kill Switch" sub="이상 징후 시 즉시 중지" color={C.red} />
              <Arrow x1={240} y1={100} x2={240} y2={72} color={C.red} />

              <ActionBox x={340} y={100} w={130} h={44} label="잔고 최소화" sub="매 4시간 sweep" color={C.green} />
              <Arrow x1={405} y1={100} x2={270} y2={72} color={C.green} />

              {/* sweep 흐름 */}
              <Arrow x1={405} y1={144} x2={405} y2={165} color={C.green} />
              <DataBox x={340} y={165} w={130} h={32} label="콜드월렛 회수" sub="남는 금액 이동" color={C.green} />

              {/* 보험 연계 */}
              <rect x={20} y={170} width={280} height={30} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={160} y={189} textAnchor="middle" fontSize={9} fill={C.amber}>핫 비율 높을수록 보험료 증가 — 콜드 비율 높이면 비용 절감</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
