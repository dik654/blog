import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  id: '#6366f1',
  verify: '#10b981',
  edd: '#f59e0b',
  block: '#ef4444',
};

const STEPS = [
  {
    label: 'CDD 3단계: 신원확인 -> 신원검증 → 실제소유자 확인',
    body: '고객이 "나는 누구다"라고 주장(수집) -> 독립 출처로 대조(검증) → 법인은 지분 25% 이상 자연인까지 추적.',
  },
  {
    label: 'eKYC 검증 흐름: 비대면 신원확인',
    body: '신분증 OCR + 안면인식(liveness check) + 계좌 1원 인증을 조합. 개인은 이 파이프라인, 법인은 등기부등본 대조.',
  },
  {
    label: 'EDD 대상과 추가 확인',
    body: 'PEP, 고위험국 거주자, 복잡한 법인 구조, 비대면 거래 — 일반 CDD로는 위험 통제 불가. 자금 출처·재산 형성 과정까지 추가 확인.',
  },
  {
    label: 'CDD 결과에 따른 고객수용/거절/종료',
    body: '실명 불일치 -> 거절. 제재 리스트 등재 -> 즉시 거절. 반복 의심 거래 → 거래 종료. 미이행 시 계정 제한(입출금·거래 정지).',
  },
  {
    label: '자산 분리: CDD와 연결되는 보호 의무',
    body: '고객별 거래 내역을 정확히 분리하려면 신원이 확인된 계정 단위 관리가 전제. 예치금·가상자산·거래내역 각각 분리.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cdd-arrow)" />;
}

export default function CddProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cdd-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: CDD 3단계 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 3단계 구성</text>

              {/* 1. 신원확인 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={15} y={35} w={130} h={48} label="1. 신원확인" sub="Identification" color={C.id} />
                <DataBox x={25} y={95} w={50} h={26} label="실명" color={C.id} />
                <DataBox x={80} y={95} w={60} h={26} label="생년월일" color={C.id} />
                <text x={80} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정보 수집만</text>
              </motion.g>

              <Arrow x1={145} y1={59} x2={170} y2={59} color={C.id} />

              {/* 2. 신원검증 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <ActionBox x={173} y={35} w={130} h={48} label="2. 신원검증" sub="Verification" color={C.verify} />
                <DataBox x={183} y={95} w={55} h={26} label="신분증" color={C.verify} />
                <DataBox x={243} y={95} w={55} h={26} label="대조" color={C.verify} />
                <text x={238} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">독립 출처로 검증</text>
              </motion.g>

              <Arrow x1={303} y1={59} x2={328} y2={59} color={C.verify} />

              {/* 3. 실제소유자 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={331} y={35} w={135} h={48} label="3. 실제소유자" sub="Beneficial Owner" color={C.edd} />
                <DataBox x={341} y={95} w={60} h={26} label="25%+" color={C.edd} />
                <DataBox x={406} y={95} w={55} h={26} label="자연인" color={C.edd} />
                <text x={398} y={135} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">법인 고객만 해당</text>
              </motion.g>

              {/* 하단 참고 */}
              <rect x={100} y={155} width={280} height={32} rx={8} fill="var(--card)" stroke={C.edd} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.edd}>다단계 지배구조: 최상위 자연인까지 추적</text>
              <text x={240} y={183} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모회사 → 자회사 → 손자회사 체인 전부</text>
            </motion.g>
          )}

          {/* Step 1: eKYC 흐름 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">eKYC 비대면 검증 파이프라인</text>

              {/* 파이프라인 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={10} y={35} w={100} h={50} label="신분증 촬영" sub="OCR 인식" color={C.id} />
              </motion.g>
              <Arrow x1={110} y1={60} x2={130} y2={60} color={C.id} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={133} y={35} w={100} h={50} label="안면인식" sub="Liveness Check" color={C.verify} />
              </motion.g>
              <Arrow x1={233} y1={60} x2={253} y2={60} color={C.verify} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={256} y={35} w={100} h={50} label="1원 인증" sub="계좌 실명 대조" color={C.verify} />
              </motion.g>
              <Arrow x1={356} y1={60} x2={376} y2={60} color={C.verify} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <StatusBox x={379} y={35} w={90} h={50} label="CDD 완료" sub="실명 확인됨" color={C.verify} progress={1} />
              </motion.g>

              {/* 법인 경로 */}
              <rect x={10} y={108} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">법인 고객은 별도 경로</text>

              <DataBox x={60} y={138} w={110} h={30} label="사업자등록증" color={C.edd} />
              <Arrow x1={170} y1={153} x2={195} y2={153} color={C.edd} />
              <DataBox x={198} y={138} w={110} h={30} label="법인등기부등본" color={C.edd} />
              <Arrow x1={308} y1={153} x2={333} y2={153} color={C.edd} />
              <ActionBox x={336} y={135} w={110} h={36} label="실제소유자 확인" sub="25% 이상 지분" color={C.edd} />
            </motion.g>
          )}

          {/* Step 2: EDD 대상 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">EDD(강화된 고객확인) 대상</text>

              {/* 4가지 EDD 대상 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <AlertBox x={10} y={35} w={105} h={48} label="PEP" sub="정치적 주요 인물" color={C.block} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <AlertBox x={130} y={35} w={105} h={48} label="고위험국" sub="이란, 북한 등" color={C.block} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <AlertBox x={250} y={35} w={105} h={48} label="복잡한 법인" sub="다단계 지배구조" color={C.block} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <AlertBox x={370} y={35} w={100} h={48} label="비대면 거래" sub="사칭 위험" color={C.block} />
              </motion.g>

              {/* 화살표: 전부 EDD로 수렴 */}
              <Arrow x1={62} y1={83} x2={180} y2={110} color={C.edd} />
              <Arrow x1={182} y1={83} x2={220} y2={110} color={C.edd} />
              <Arrow x1={302} y1={83} x2={260} y2={110} color={C.edd} />
              <Arrow x1={420} y1={83} x2={300} y2={110} color={C.edd} />

              {/* EDD 추가 확인 */}
              <ModuleBox x={155} y={113} w={170} h={50} label="EDD 추가 확인" sub="자금 출처 / 재산 형성 / 거래 목적" color={C.edd} />

              {/* 결과 */}
              <Arrow x1={240} y1={163} x2={240} y2={180} color={C.edd} />
              <DataBox x={180} y={183} w={120} h={28} label="지속 모니터링 강화" color={C.edd} />
            </motion.g>
          )}

          {/* Step 3: 고객수용/거절 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CDD 결과별 조치</text>

              {/* CDD 완료 분기점 */}
              <ActionBox x={170} y={30} w={140} h={42} label="CDD 결과 판정" sub="고객수용정책 적용" color={C.id} />

              {/* 세 갈래 */}
              <Arrow x1={170} y1={55} x2={75} y2={90} color={C.verify} />
              <Arrow x1={240} y1={72} x2={240} y2={90} color={C.edd} />
              <Arrow x1={310} y1={55} x2={405} y2={90} color={C.block} />

              {/* 수용 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <StatusBox x={15} y={93} w={120} h={50} label="수용" sub="정상 거래 허용" color={C.verify} progress={1} />
              </motion.g>

              {/* 제한 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <AlertBox x={175} y={93} w={130} h={50} label="제한 상태" sub="입출금·거래 정지" color={C.edd} />
              </motion.g>

              {/* 거절/종료 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <AlertBox x={345} y={93} w={120} h={50} label="거절 / 종료" sub="계정 해지" color={C.block} />
              </motion.g>

              {/* 거절 사유 */}
              <DataBox x={340} y={158} w={65} h={26} label="위조 ID" color={C.block} />
              <DataBox x={410} y={158} w={60} h={26} label="제재 대상" color={C.block} />

              {/* 제한 -> 재확인 */}
              <Arrow x1={240} y1={143} x2={240} y2={162} color={C.edd} />
              <DataBox x={170} y={165} w={140} h={28} label="합리적 기간 내 재확인 요구" color={C.edd} />
            </motion.g>
          )}

          {/* Step 4: 자산 분리 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">자산 분리 의무 (CDD 연계)</text>

              {/* 중앙: VASP */}
              <ModuleBox x={185} y={30} w={110} h={48} label="VASP" sub="가상자산사업자" color={C.id} />

              {/* 세 가지 분리 */}
              <Arrow x1={195} y1={78} x2={80} y2={100} color={C.verify} />
              <Arrow x1={240} y1={78} x2={240} y2={100} color={C.edd} />
              <Arrow x1={285} y1={78} x2={400} y2={100} color={C.id} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <ModuleBox x={15} y={103} w={130} h={50} label="예치금 분리" sub="은행 별도 계좌(신탁)" color={C.verify} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={175} y={103} w={130} h={50} label="가상자산 분리" sub="별도 지갑(주소) 관리" color={C.edd} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <ModuleBox x={335} y={103} w={130} h={50} label="거래내역 분리" sub="고객별 개별 추적" color={C.id} />
              </motion.g>

              {/* 하단: 보호 이유 */}
              <rect x={80} y={175} width={320} height={32} rx={8} fill="var(--card)" stroke={C.block} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={190} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.block}>VASP 파산 시 고객 자산 보호</text>
              <text x={240} y={203} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분리 → 파산 재단 불포함 → 고객 보호</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
