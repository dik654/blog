import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  id: '#6366f1',     // 신원확인
  verify: '#10b981', // 검증
  bank: '#3b82f6',   // 은행/계좌
  warn: '#ef4444',   // 경고
};

const STEPS = [
  {
    label: '개인 고객 — 5가지 필수 확인 항목',
    body: '실명, 주민등록번호, 주소, 연락처, 직업. 직업은 PEP 판단과 거래 규모 합리성 검토의 1차 필터.',
  },
  {
    label: '법인 고객 — 실제소유자(BO) 확인',
    body: '법인 자체 정보 + 25% 이상 지분 보유자 또는 실질적 지배자까지 확인. 페이퍼컴퍼니를 통한 세탁 방지의 핵심 장치.',
  },
  {
    label: '신원검증(Verification) 3가지 방법',
    body: '대면(신분증 원본) → 비대면 eKYC(OCR+안면인식+활성도검사) → 영상통화. VASP는 비대면이 주류.',
  },
  {
    label: '실명확인 입출금 계정 구조',
    body: '은행 실명 계좌 ↔ VASP 가상계좌 1:1 연동. 은행 KYC가 추가 레이어로 결합되어 이중 보호 효과.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#iv-arrow)" />;
}

export default function IdentityVerificationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="iv-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 개인 고객 확인 항목 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.id}>개인 고객 필수 확인 정보</text>

              {/* 5가지 항목 */}
              <DataBox x={15} y={30} w={80} h={38} label="실명" sub="제재리스트 대조" color={C.id} />
              <DataBox x={108} y={30} w={80} h={38} label="주민번호" sub="중복계정 방지" color={C.id} />
              <DataBox x={201} y={30} w={80} h={38} label="주소" sub="고위험지역 판단" color={C.id} />
              <DataBox x={294} y={30} w={80} h={38} label="연락처" sub="본인확인 채널" color={C.id} />
              <DataBox x={387} y={30} w={80} h={38} label="직업" sub="PEP 필터" color={C.verify} />

              {/* 화살표: 모든 항목 → 검증 */}
              <Arrow x1={55} y1={68} x2={55} y2={95} color={C.id} />
              <Arrow x1={148} y1={68} x2={148} y2={95} color={C.id} />
              <Arrow x1={241} y1={68} x2={241} y2={95} color={C.id} />
              <Arrow x1={334} y1={68} x2={334} y2={95} color={C.id} />
              <Arrow x1={427} y1={68} x2={427} y2={95} color={C.verify} />

              {/* 수집 → 검증 흐름 */}
              <rect x={30} y={98} width={420} height={36} rx={8} fill="var(--card)" stroke={C.verify} strokeWidth={1} />
              <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.verify}>수집(Identification) 완료 → 검증(Verification) 단계로</text>
              <text x={240} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">수집만 하고 검증 안 하면 CDD 미이행</text>

              {/* 합리성 검토 예시 */}
              <AlertBox x={100} y={155} w={280} h={44} label="직업: 합리성 판단의 기준" sub="월 소득 300만 원 고객이 매월 5억 입금 → 의심거래" color={C.warn} />
            </motion.g>
          )}

          {/* Step 1: 법인 + 실제소유자 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 법인 정보 */}
              <ModuleBox x={15} y={10} w={130} h={50} label="법인 정보" sub="법인명·사업자번호·소재지" color={C.id} />
              <Arrow x1={145} y1={35} x2={175} y2={35} color={C.id} />
              <ModuleBox x={178} y={10} w={130} h={50} label="대표자 정보" sub="성명·주민번호" color={C.id} />
              <Arrow x1={308} y1={35} x2={338} y2={35} color={C.verify} />
              <ModuleBox x={341} y={10} w={125} h={50} label="실제소유자(BO)" sub="25%+ 지분 보유자" color={C.verify} />

              {/* BO 판단 기준 */}
              <rect x={30} y={78} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">실제소유자 판단 순위</text>

              <ActionBox x={20} y={105} w={135} h={38} label="1순위: 25%+ 지분" sub="직접 또는 간접 보유" color={C.verify} />
              <Arrow x1={155} y1={124} x2={175} y2={124} color={C.verify} />
              <ActionBox x={178} y={105} w={135} h={38} label="2순위: 실질 지배자" sub="1순위 없을 때" color={C.id} />
              <Arrow x1={313} y1={124} x2={333} y2={124} color={C.id} />
              <ActionBox x={336} y={105} w={125} h={38} label="3순위: 대표이사" sub="1·2순위 모두 없을 때" color={C.bank} />

              {/* 다단계 구조 예시 */}
              <DataBox x={30} y={163} w={70} h={28} label="A법인" color={C.id} />
              <Arrow x1={100} y1={177} x2={130} y2={177} color={C.id} />
              <text x={142} y={174} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">100%</text>
              <DataBox x={155} y={163} w={70} h={28} label="B법인" color={C.id} />
              <Arrow x1={225} y1={177} x2={255} y2={177} color={C.verify} />
              <text x={267} y={174} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">30%</text>
              <DataBox x={280} y={163} w={70} h={28} label="C법인" color={C.verify} />
              <text x={400} y={181} fontSize={8} fill={C.warn}>→ 간접 30% 지분</text>
            </motion.g>
          )}

          {/* Step 2: 검증 방법 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.verify}>신원검증(Verification) 방법</text>

              {/* 3가지 방법 */}
              <ModuleBox x={15} y={30} w={140} h={52} label="대면 검증" sub="창구 방문 + 신분증 원본" color={C.bank} />
              <ModuleBox x={170} y={30} w={140} h={52} label="비대면 eKYC" sub="자동화 온라인 검증" color={C.verify} />
              <ModuleBox x={325} y={30} w={140} h={52} label="영상통화 검증" sub="실시간 화면 확인" color={C.id} />

              {/* eKYC 상세 흐름 (주류) */}
              <rect x={30} y={100} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.verify}>eKYC 흐름 (VASP 주류)</text>

              <ActionBox x={10} y={128} w={100} h={36} label="신분증 촬영" sub="OCR 정보 추출" color={C.verify} />
              <Arrow x1={110} y1={146} x2={125} y2={146} color={C.verify} />

              <ActionBox x={128} y={128} w={100} h={36} label="안면인식" sub="사진 vs 셀피" color={C.verify} />
              <Arrow x1={228} y1={146} x2={243} y2={146} color={C.verify} />

              <ActionBox x={246} y={128} w={100} h={36} label="활성도 검사" sub="딥페이크 차단" color={C.id} />
              <Arrow x1={346} y1={146} x2={361} y2={146} color={C.verify} />

              <DataBox x={364} y={132} w={100} h={28} label="검증 완료" color={C.verify} />

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                활성도 검사: 고개 돌리기, 눈 깜빡이기 등 실제 사람 여부 확인
              </text>
            </motion.g>
          )}

          {/* Step 3: 실명 계좌 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bank}>실명확인 입출금 계정 구조</text>

              {/* 고객 */}
              <DataBox x={180} y={30} w={120} h={32} label="고객 (본인 명의)" color={C.id} />

              {/* 양쪽 연결 */}
              <Arrow x1={200} y1={62} x2={100} y2={85} color={C.bank} />
              <Arrow x1={280} y1={62} x2={380} y2={85} color={C.verify} />

              {/* 은행 측 */}
              <ModuleBox x={20} y={88} w={160} h={52} label="은행 실명 계좌" sub="1차 KYC 수행 (실명 확인)" color={C.bank} />

              {/* VASP 측 */}
              <ModuleBox x={300} y={88} w={160} h={52} label="VASP 가상계좌" sub="2차 CDD 수행 (거래 목적)" color={C.verify} />

              {/* 1:1 연동 */}
              <Arrow x1={180} y1={114} x2={298} y2={114} color={C.bank} />
              <rect x={200} y={106} width={80} height={16} rx={4} fill="var(--card)" stroke={C.bank} strokeWidth={0.8} />
              <text x={240} y={117} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.bank}>1:1 연동</text>

              {/* 이중 보호 */}
              <rect x={30} y={158} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={30} y={168} w={130} h={30} label="자금세탁 방지" color={C.bank} />
              <DataBox x={175} y={168} w={130} h={30} label="고유재산 분리 보관" color={C.verify} />
              <DataBox x={320} y={168} w={135} h={30} label="은행 제휴 = 영업 전제" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
