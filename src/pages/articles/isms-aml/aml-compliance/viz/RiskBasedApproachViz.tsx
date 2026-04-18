import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  risk: '#6366f1',
  ctrl: '#10b981',
  warn: '#f59e0b',
  high: '#ef4444',
};

const STEPS = [
  {
    label: 'RBA 핵심 원칙: 위험에 비례하는 자원 집중',
    body: '모든 고객에게 동일 수준 확인 -> 비용 폭증. 최소 확인만 → 고위험 누출. RBA는 두 극단 사이의 효율적 균형.',
  },
  {
    label: '위험평가 4단계: 식별 -> 분석 -> 평가 → 지속',
    body: '1. 위험 발생원 4차원 식별 -> 2. 가능성x영향도 = 등급 -> 3. 통제 반영해 잔여위험 산출 → 4. 연 1회+ 재평가.',
  },
  {
    label: '고유위험 - 통제 효과 = 잔여위험',
    body: '고유위험이 높아도 강력한 통제(EDD, FDS 자동 차단)가 있으면 잔여위험은 낮아질 수 있다. 잔여위험 0은 불가 — 수용 가능 수준까지 낮추는 것이 목표.',
  },
  {
    label: '3선 방어 모델: 독립적 거버넌스',
    body: '1선(현업: CDD 실행) -> 2선(준법감시: 정책 설계·감독) → 3선(감사: 독립 검증). 감사팀은 이사회에 직접 보고.',
  },
  {
    label: '고객 위험평가: 정량 스코어링 + 정성 조정',
    body: '국적(0~30) + 직업(0~20) + 거래패턴(0~30) + 자금출처(0~20) = 100점 만점. 60+ 고위험, 30~59 중위험, ~29 저위험. 정성 override 시 사유 기록 필수.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rba-arrow)" />;
}

export default function RiskBasedApproachViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rba-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: RBA 원칙 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">RBA: 위험 비례 자원 배분</text>

              {/* 스펙트럼 바 */}
              <rect x={40} y={40} width={400} height={24} rx={12} fill="var(--border)" opacity={0.2} />
              <rect x={40} y={40} width={133} height={24} rx={12} fill={C.ctrl} opacity={0.15} />
              <rect x={173} y={40} width={134} height={24} rx={0} fill={C.warn} opacity={0.15} />
              <rect x={307} y={40} width={133} height={24} rx={12} fill={C.high} opacity={0.15} />

              <text x={106} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ctrl}>저위험</text>
              <text x={240} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>중위험</text>
              <text x={373} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.high}>고위험</text>

              {/* 각 위험 수준별 대응 */}
              <Arrow x1={106} y1={64} x2={106} y2={85} color={C.ctrl} />
              <Arrow x1={240} y1={64} x2={240} y2={85} color={C.warn} />
              <Arrow x1={373} y1={64} x2={373} y2={85} color={C.high} />

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <ActionBox x={55} y={88} w={105} h={42} label="간소화 CDD" sub="최소 신원확인" color={C.ctrl} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={188} y={88} w={105} h={42} label="일반 CDD" sub="표준 확인 절차" color={C.warn} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <ActionBox x={325} y={88} w={100} h={42} label="EDD" sub="강화된 확인" color={C.high} />
              </motion.g>

              {/* 하단 메시지 */}
              <rect x={80} y={155} width={320} height={40} rx={8} fill="var(--card)" stroke={C.risk} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.risk}>핵심: 고위험에 자원 집중, 저위험은 간소화</text>
              <text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비용 효율 + 고객 경험 + 위험 통제의 균형</text>
            </motion.g>
          )}

          {/* Step 1: 4단계 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">위험평가 4단계</text>

              {/* 4단계 파이프라인 */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={10} y={28} w={100} h={48} label="1. 식별" sub="Identification" color={C.risk} />
              </motion.g>
              <Arrow x1={110} y1={52} x2={125} y2={52} color={C.risk} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={128} y={28} w={100} h={48} label="2. 분석" sub="Analysis" color={C.warn} />
              </motion.g>
              <Arrow x1={228} y1={52} x2={243} y2={52} color={C.warn} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={246} y={28} w={100} h={48} label="3. 평가" sub="Evaluation" color={C.high} />
              </motion.g>
              <Arrow x1={346} y1={52} x2={361} y2={52} color={C.high} />

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={364} y={28} w={105} h={48} label="4. 지속" sub="Ongoing" color={C.ctrl} />
              </motion.g>

              {/* 식별의 4차원 */}
              <rect x={10} y={95} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">1단계 식별: 위험의 4가지 차원</text>

              <DataBox x={15} y={125} w={100} h={28} label="고객 위험" color={C.risk} />
              <DataBox x={130} y={125} w={105} h={28} label="상품/서비스" color={C.risk} />
              <DataBox x={250} y={125} w={100} h={28} label="지역 위험" color={C.risk} />
              <DataBox x={365} y={125} w={100} h={28} label="거래 채널" color={C.risk} />

              {/* 순환 표시 */}
              <motion.path d="M 448 52 Q 468 52 468 100 Q 468 200 240 200 Q 10 200 10 100 Q 10 77 10 76"
                fill="none" stroke={C.ctrl} strokeWidth={0.8} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />
              <text x={468} y={140} fontSize={7} fill={C.ctrl} transform="rotate(90, 468, 140)">순환 반복</text>
            </motion.g>
          )}

          {/* Step 2: 잔여위험 공식 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">잔여위험 산출</text>

              {/* 공식 시각화 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <StatusBox x={30} y={35} w={120} h={55} label="고유위험" sub="통제 전 위험 수준" color={C.high} progress={0.85} />
              </motion.g>

              <text x={170} y={65} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--muted-foreground)">-</text>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <StatusBox x={190} y={35} w={120} h={55} label="통제 효과" sub="FDS, EDD, 교육 등" color={C.ctrl} progress={0.6} />
              </motion.g>

              <text x={330} y={65} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--muted-foreground)">=</text>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <StatusBox x={345} y={35} w={120} h={55} label="잔여위험" sub="수용 가능 수준 목표" color={C.warn} progress={0.3} />
              </motion.g>

              {/* 예시 */}
              <rect x={15} y={110} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">예시 비교</text>

              <ActionBox x={20} y={140} w={200} h={36} label="프라이버시 코인 취급" sub="고유위험 높 + 통제 강 = 잔여 중" color={C.warn} />
              <ActionBox x={255} y={140} w={210} h={36} label="KRW 소액 입금" sub="고유위험 낮 + 통제 보통 = 잔여 저" color={C.ctrl} />

              {/* 주의 */}
              <AlertBox x={140} y={186} w={200} h={28} label="잔여위험 0은 불가능" sub="" color={C.high} />
            </motion.g>
          )}

          {/* Step 3: 3선 방어 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">3선 방어 모델 (Three Lines of Defence)</text>

              {/* 3선 수직 배치 */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={30} y={30} w={120} h={50} label="1선: 현업" sub="운영팀, CS팀" color={C.ctrl} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={180} y={30} w={120} h={50} label="2선: 준법감시" sub="AML팀, 준법감시팀" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={330} y={30} w={120} h={50} label="3선: 내부감사" sub="감사팀, 외부감사" color={C.high} />
              </motion.g>

              {/* 역할 */}
              <Arrow x1={90} y1={80} x2={90} y2={100} color={C.ctrl} />
              <Arrow x1={240} y1={80} x2={240} y2={100} color={C.warn} />
              <Arrow x1={390} y1={80} x2={390} y2={100} color={C.high} />

              <DataBox x={40} y={103} w={105} h={28} label="CDD 실행" color={C.ctrl} />
              <DataBox x={185} y={103} w={115} h={28} label="FDS 규칙, STR 결정" color={C.warn} />
              <DataBox x={340} y={103} w={105} h={28} label="체계 적정성 평가" color={C.high} />

              {/* 감독 방향 */}
              <Arrow x1={180} y1={45} x2={155} y2={45} color={C.warn} />
              <text x={165} y={40} textAnchor="middle" fontSize={7} fill={C.warn}>감독</text>
              <Arrow x1={330} y1={45} x2={305} y2={45} color={C.high} />
              <text x={315} y={40} textAnchor="middle" fontSize={7} fill={C.high}>감사</text>

              {/* 이사회 */}
              <rect x={140} y={155} width={200} height={40} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={173} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">이사회 / 감사위원회</text>
              <text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3선은 직접 보고 (독립성)</text>
              <Arrow x1={390} y1={131} x2={330} y2={155} color={C.high} />
            </motion.g>
          )}

          {/* Step 4: 고객 위험평가 스코어링 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">고객 위험평가 스코어링 모델</text>

              {/* 4개 항목 점수 바 */}
              <text x={15} y={42} fontSize={9} fontWeight={600} fill="var(--foreground)">국적 위험</text>
              <rect x={90} y={33} width={180} height={12} rx={6} fill="var(--border)" opacity={0.2} />
              <motion.rect x={90} y={33} width={140} height={12} rx={6} fill={C.high}
                initial={{ width: 0 }} animate={{ width: 140 }} transition={{ duration: 0.5, delay: 0.1 }} />
              <text x={275} y={43} fontSize={8} fill="var(--muted-foreground)">0~30점</text>

              <text x={15} y={62} fontSize={9} fontWeight={600} fill="var(--foreground)">직업 위험</text>
              <rect x={90} y={53} width={180} height={12} rx={6} fill="var(--border)" opacity={0.2} />
              <motion.rect x={90} y={53} width={80} height={12} rx={6} fill={C.warn}
                initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.5, delay: 0.2 }} />
              <text x={275} y={63} fontSize={8} fill="var(--muted-foreground)">0~20점</text>

              <text x={15} y={82} fontSize={9} fontWeight={600} fill="var(--foreground)">거래 패턴</text>
              <rect x={90} y={73} width={180} height={12} rx={6} fill="var(--border)" opacity={0.2} />
              <motion.rect x={90} y={73} width={160} height={12} rx={6} fill={C.high}
                initial={{ width: 0 }} animate={{ width: 160 }} transition={{ duration: 0.5, delay: 0.3 }} />
              <text x={275} y={83} fontSize={8} fill="var(--muted-foreground)">0~30점</text>

              <text x={15} y={102} fontSize={9} fontWeight={600} fill="var(--foreground)">자금 출처</text>
              <rect x={90} y={93} width={180} height={12} rx={6} fill="var(--border)" opacity={0.2} />
              <motion.rect x={90} y={93} width={60} height={12} rx={6} fill={C.ctrl}
                initial={{ width: 0 }} animate={{ width: 60 }} transition={{ duration: 0.5, delay: 0.4 }} />
              <text x={275} y={103} fontSize={8} fill="var(--muted-foreground)">0~20점</text>

              {/* 등급 판정 */}
              <rect x={310} y={28} width={160} height={85} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={390} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">등급 판정</text>

              <rect x={320} y={55} width={140} height={16} rx={4} fill={C.high} opacity={0.15} />
              <text x={390} y={67} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.high}>60+ 고위험 → EDD</text>

              <rect x={320} y={74} width={140} height={16} rx={4} fill={C.warn} opacity={0.15} />
              <text x={390} y={86} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>30~59 중위험 → CDD</text>

              <rect x={320} y={93} width={140} height={16} rx={4} fill={C.ctrl} opacity={0.15} />
              <text x={390} y={105} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ctrl}>~29 저위험 → 간소화</text>

              {/* 정성 조정 */}
              <rect x={40} y={130} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={50} y={145} w={160} h={38} label="정량 모델 → 초기 등급" sub="일관성 있는 점수 산출" color={C.risk} />
              <Arrow x1={210} y1={164} x2={240} y2={164} color={C.risk} />
              <ActionBox x={243} y={145} w={180} h={38} label="정성 평가 → Override 조정" sub="사유 기록 + 상위자 승인 필수" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
