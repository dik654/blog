import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  fds: '#6366f1',
  alert: '#f59e0b',
  str: '#ef4444',
  done: '#10b981',
};

const STEPS = [
  {
    label: 'FDS 이중 탐지: 규칙 기반 + 이상 탐지',
    body: '규칙 기반은 미리 정의한 조건(고빈도, 고액, 믹서 연계 등) 매칭. 이상 탐지는 고객의 과거 패턴 대비 통계적 이탈을 감지.',
  },
  {
    label: '탐지 패턴 6가지: 세탁 수법별 감시',
    body: '구조화(소액 분할), 깡통 계좌(신규 고액), 믹서 연계, 즉시 전액 출금, 다수 주소 분산, 제재 주소 연계.',
  },
  {
    label: '경보 -> 분석 -> 조치 → 보고 흐름',
    body: 'FDS 자동 경보 -> AML 담당자 1차 분석(24h) -> 계정 정지 -> 심층 조사(72h) → 준법감시인 STR 결정(3영업일).',
  },
  {
    label: 'STR/SAR 보고: FIU에 의심거래 보고',
    body: '거래 시점, 계정 정보, 자산 종류, 외부 지갑, 조치 내역을 포함. Tipping-off(보고 사실 고객 통보) 금지 — 형사처벌 대상.',
  },
  {
    label: '체계 고도화: AI FDS + 블랙리스트 갱신',
    body: '규칙 기반 한계를 ML로 보완. OFAC/FATF 리스트 실시간 갱신. 딥페이크 대응 eKYC 강화. 기술 + 인적 역량 균형이 핵심.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#fds-arrow)" />;
}

export default function FdsAndStrViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fds-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: FDS 이중 탐지 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">FDS 이중 탐지 구조</text>

              {/* 거래 입력 */}
              <DataBox x={15} y={55} w={80} h={34} label="거래 데이터" color={C.fds} />
              <Arrow x1={95} y1={62} x2={120} y2={50} color={C.fds} />
              <Arrow x1={95} y1={82} x2={120} y2={100} color={C.fds} />

              {/* 규칙 기반 */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <ModuleBox x={123} y={25} w={155} h={48} label="규칙 기반 (Rule-based)" sub="미리 정의한 조건 매칭" color={C.fds} />
              </motion.g>

              {/* 이상 탐지 */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={123} y={82} w={155} h={48} label="이상 탐지 (Anomaly)" sub="과거 패턴 대비 이탈" color={C.alert} />
              </motion.g>

              {/* 결합 */}
              <Arrow x1={278} y1={49} x2={310} y2={72} color={C.fds} />
              <Arrow x1={278} y1={106} x2={310} y2={82} color={C.alert} />

              <AlertBox x={313} y={53} w={100} h={48} label="경보 발생" sub="Alert 생성" color={C.str} />
              <Arrow x1={413} y1={77} x2={428} y2={77} color={C.str} />
              <ActionBox x={431} y={58} w={40} h={38} label="분석" color={C.str} />

              {/* 하단 설명 */}
              <rect x={15} y={150} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={200} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fds}>규칙 기반: 알려진 수법 탐지</text>
              <text x={200} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">장점: 빠름 / 단점: 새 수법 놓침</text>
              <text x={400} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.alert}>이상 탐지: 미지 패턴 감지</text>
              <text x={400} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">장점: 유연 / 단점: 오탐 많음</text>
            </motion.g>
          )}

          {/* Step 1: 탐지 패턴 6가지 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">FDS 탐지 패턴 6가지</text>

              {/* 2행 3열 배치 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <ActionBox x={15} y={32} w={135} h={42} label="고빈도 반복 거래" sub="구조화(Structuring)" color={C.alert} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                <ActionBox x={170} y={32} w={140} h={42} label="신규 계정 고액 거래" sub="깡통 계좌 의심" color={C.alert} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
                <ActionBox x={330} y={32} w={135} h={42} label="믹서/프라이버시 코인" sub="추적 차단 의도" color={C.str} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                <ActionBox x={15} y={90} w={135} h={42} label="즉시 전액 출금" sub="계층화(Layering)" color={C.alert} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={170} y={90} w={140} h={42} label="다수 주소 분산" sub="자금 흐름 복잡화" color={C.alert} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
                <AlertBox x={330} y={88} w={135} h={46} label="제재 주소 연계" sub="OFAC SDN 리스트" color={C.str} />
              </motion.g>

              {/* 공통 목표 */}
              <rect x={80} y={155} width={320} height={38} rx={8} fill="var(--card)" stroke={C.fds} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fds}>모든 패턴의 목적: 자금 출처 은닉</text>
              <text x={240} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개별 기준 이하여도 누적 패턴으로 탐지</text>
            </motion.g>
          )}

          {/* Step 2: 처리 프로세스 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">이상거래 감지 후 처리 흐름</text>

              {/* 6단계 파이프라인 — 2행 배치 */}
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={10} y={30} w={100} h={45} label="1. 초기 감지" sub="FDS 자동" color={C.fds} />
              </motion.g>
              <Arrow x1={110} y1={52} x2={125} y2={52} color={C.fds} />

              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={128} y={30} w={100} h={45} label="2. 1차 분석" sub="AML 담당 (24h)" color={C.alert} />
              </motion.g>
              <Arrow x1={228} y1={52} x2={243} y2={52} color={C.alert} />

              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={246} y={32} w={100} h={42} label="3. 계정 정지" sub="출금 차단" color={C.str} />
              </motion.g>
              <Arrow x1={346} y1={52} x2={361} y2={52} color={C.str} />

              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={364} y={30} w={105} h={45} label="4. 심층 조사" sub="온체인 분석 (72h)" color={C.fds} />
              </motion.g>

              {/* 2행 */}
              <Arrow x1={416} y1={75} x2={416} y2={100} color={C.fds} />

              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={340} y={103} w={130} h={42} label="5. 보고 결정" sub="준법감시인 (3영업일)" color={C.str} />
              </motion.g>
              <Arrow x1={340} y1={124} x2={320} y2={124} color={C.str} />

              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <StatusBox x={185} y={100} w={132} h={48} label="6. STR 제출 + 후속" sub="FIU 보고 → 수사 협조" color={C.done} progress={1} />
              </motion.g>

              {/* 타임라인 */}
              <rect x={20} y={172} width={440} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={20} y={172} width={440} height={8} rx={4} fill={C.fds}
                initial={{ width: 0 }} animate={{ width: 440 }} transition={{ duration: 1 }} />

              <text x={60} y={195} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">실시간</text>
              <text x={170} y={195} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">24h</text>
              <text x={290} y={195} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">72h</text>
              <text x={420} y={195} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">3영업일</text>
            </motion.g>
          )}

          {/* Step 3: STR/SAR 보고 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">STR/SAR 보고 구성</text>

              {/* VASP -> FIU */}
              <ModuleBox x={15} y={30} w={110} h={48} label="VASP" sub="의심 거래 인지" color={C.fds} />
              <Arrow x1={125} y1={54} x2={155} y2={54} color={C.str} />
              <ModuleBox x={158} y={30} w={110} h={48} label="SAR 작성" sub="5개 필수 항목" color={C.str} />
              <Arrow x1={268} y1={54} x2={298} y2={54} color={C.str} />
              <ModuleBox x={301} y={30} w={80} h={48} label="FIU" sub="분석·전달" color={C.done} />
              <Arrow x1={381} y1={54} x2={395} y2={54} color={C.done} />
              <ActionBox x={398} y={33} w={72} h={42} label="수사기관" sub="조사 착수" color={C.done} />

              {/* SAR 5개 항목 */}
              <rect x={15} y={95} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">SAR 필수 기재 항목</text>

              <DataBox x={10} y={125} w={80} h={28} label="거래 시점" color={C.fds} />
              <DataBox x={100} y={125} w={80} h={28} label="계정 정보" color={C.fds} />
              <DataBox x={190} y={125} w={80} h={28} label="자산 종류" color={C.fds} />
              <DataBox x={280} y={125} w={95} h={28} label="외부 지갑 주소" color={C.fds} />
              <DataBox x={385} y={125} w={80} h={28} label="조치 내역" color={C.fds} />

              {/* Tipping-off 경고 */}
              <AlertBox x={120} y={172} w={240} h={38} label="Tipping-off 금지" sub="보고 사실 고객 통보 시 형사처벌" color={C.str} />
            </motion.g>
          )}

          {/* Step 4: 체계 고도화 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">재발 방지 — 체계 고도화</text>

              {/* 4가지 고도화 영역 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={15} y={35} w={105} h={50} label="AI 기반 FDS" sub="ML 패턴 학습" color={C.fds} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={135} y={35} w={105} h={50} label="블랙리스트 갱신" sub="OFAC/FATF 실시간" color={C.str} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={255} y={35} w={105} h={50} label="eKYC 강화" sub="딥페이크 대응" color={C.alert} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={375} y={35} w={95} h={50} label="교육·훈련" sub="연 1회+ 전직원" color={C.done} />
              </motion.g>

              {/* 각각의 핵심 포인트 */}
              <Arrow x1={67} y1={85} x2={67} y2={105} color={C.fds} />
              <Arrow x1={187} y1={85} x2={187} y2={105} color={C.str} />
              <Arrow x1={307} y1={85} x2={307} y2={105} color={C.alert} />
              <Arrow x1={422} y1={85} x2={422} y2={105} color={C.done} />

              <DataBox x={22} y={108} w={95} h={28} label="XAI 설명력" color={C.fds} />
              <DataBox x={140} y={108} w={100} h={28} label="갱신 주기 최소화" color={C.str} />
              <DataBox x={260} y={108} w={100} h={28} label="NFC + 생체 다중" color={C.alert} />
              <DataBox x={378} y={108} w={90} h={28} label="모의 시나리오" color={C.done} />

              {/* 균형 메시지 */}
              <rect x={80} y={158} width={320} height={40} rx={8} fill="var(--card)" stroke={C.fds} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fds}>기술(FDS/AI) + 인적 역량(교육/조직)</text>
              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">둘의 균형이 AML 체계 성숙도를 결정</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
