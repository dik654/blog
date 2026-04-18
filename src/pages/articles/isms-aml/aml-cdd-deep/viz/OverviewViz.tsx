import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  law: '#6366f1',    // 법적 근거
  cdd: '#10b981',    // CDD 프로세스
  risk: '#f59e0b',   // 위험/제재
  block: '#ef4444',  // 차단/제재
};

const STEPS = [
  {
    label: '특금법 제5조의2 — CDD 법적 근거',
    body: 'FATF 권고사항 R.10이 국제 기준을 제시하고, 한국 특금법 제5조의2가 이를 국내법으로 구현. 2021년 3월부터 VASP도 금융회사와 동일한 의무 적용.',
  },
  {
    label: 'CDD 이행 시점 4가지',
    body: '계좌 신규 개설, 일회성 고액 거래, 자금세탁 의심, 기존 정보 의심 — 이 4가지 시점에 CDD를 수행해야 한다.',
  },
  {
    label: 'CDD 3요소: 신원확인 → 검증 → 거래목적',
    body: '정보 수집(Identification) → 독립 출처로 검증(Verification) → 거래 목적 확인(Purpose). 3요소가 모두 충족되어야 적법한 CDD.',
  },
  {
    label: '미이행 시 다단계 제재',
    body: '과태료 3천만 원 → 영업정지 6개월 → 신고 취소(폐업) → 형사처벌(5년/5천만 원). VASP 부실이 국가 리스크로 확대될 수 있다.',
  },
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
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 법적 근거 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 국제 기준 */}
              <ModuleBox x={15} y={15} w={130} h={50} label="FATF R.10" sub="국제 CDD 기준" color={C.law} />
              <Arrow x1={145} y1={40} x2={175} y2={40} color={C.law} />

              {/* 국내법 */}
              <ModuleBox x={178} y={15} w={140} h={50} label="특금법 제5조의2" sub="국내 고객확인의무" color={C.law} />
              <Arrow x1={318} y1={40} x2={348} y2={40} color={C.cdd} />

              {/* 적용 대상 */}
              <ModuleBox x={351} y={15} w={115} h={50} label="적용 대상" sub="금융회사 + VASP" color={C.cdd} />

              {/* 2021 개정 */}
              <rect x={15} y={85} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={103} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">2021.03 특금법 개정 — VASP 명시 포함</text>

              <DataBox x={40} y={115} w={120} h={32} label="은행·증권사" color={C.law} />
              <DataBox x={180} y={115} w={120} h={32} label="VASP (거래소)" color={C.cdd} />
              <DataBox x={320} y={115} w={120} h={32} label="동일 수준 의무" color={C.risk} />

              <Arrow x1={160} y1={131} x2={178} y2={131} color={C.law} />
              <Arrow x1={300} y1={131} x2={318} y2={131} color={C.cdd} />

              {/* 핵심 본질 */}
              <text x={240} y={175} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                "이 돈이 어디서 왔고, 누구에게 가는가"
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                자금세탁(ML) + 테러자금조달(TF) 사전 차단이 CDD의 본질
              </text>
            </motion.g>
          )}

          {/* Step 1: 이행 시점 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.law}>CDD 수행 필수 시점</text>

              <ActionBox x={15} y={35} w={105} h={42} label="1. 계좌 신규 개설" sub="회원가입, 법인 계정" color={C.cdd} />
              <ActionBox x={130} y={35} w={105} h={42} label="2. 일회성 고액" sub="대통령령 금액 이상" color={C.cdd} />
              <ActionBox x={245} y={35} w={105} h={42} label="3. 세탁 의심" sub="차명·대포 계좌 징후" color={C.risk} />
              <ActionBox x={360} y={35} w={105} h={42} label="4. 정보 의심" sub="주소 불일치·위변조" color={C.risk} />

              {/* 화살표 아래로 */}
              <Arrow x1={67} y1={77} x2={67} y2={100} color={C.cdd} />
              <Arrow x1={182} y1={77} x2={182} y2={100} color={C.cdd} />
              <Arrow x1={297} y1={77} x2={297} y2={100} color={C.risk} />
              <Arrow x1={412} y1={77} x2={412} y2={100} color={C.risk} />

              {/* 공통 결과 */}
              <rect x={40} y={103} width={400} height={36} rx={8} fill="var(--card)" stroke={C.cdd} strokeWidth={1} />
              <text x={240} y={125} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cdd}>CDD 절차 수행 (3요소 충족 필수)</text>

              {/* 부연 */}
              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                어느 한 시점이라도 해당하면 CDD를 수행해야 하며
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                기존 고객도 3·4번 조건에 해당하면 재수행 대상
              </text>
            </motion.g>
          )}

          {/* Step 2: CDD 3요소 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3단계 흐름 */}
              <ModuleBox x={15} y={20} w={130} h={55} label="신원확인" sub="Identification" color={C.cdd} />
              <Arrow x1={145} y1={47} x2={175} y2={47} color={C.cdd} />

              <ModuleBox x={178} y={20} w={130} h={55} label="신원검증" sub="Verification" color={C.law} />
              <Arrow x1={308} y1={47} x2={338} y2={47} color={C.law} />

              <ModuleBox x={341} y={20} w={125} h={55} label="거래목적 확인" sub="Purpose of TX" color={C.risk} />

              {/* 각 단계 세부 */}
              <Arrow x1={80} y1={75} x2={80} y2={98} color={C.cdd} />
              <Arrow x1={243} y1={75} x2={243} y2={98} color={C.law} />
              <Arrow x1={403} y1={75} x2={403} y2={98} color={C.risk} />

              <DataBox x={20} y={100} w={120} h={30} label="성명·주민번호" color={C.cdd} />
              <DataBox x={180} y={100} w={125} h={30} label="신분증·정부DB" color={C.law} />
              <DataBox x={345} y={100} w={120} h={30} label="투자·송금·결제" color={C.risk} />

              {/* 불완전 CDD 경고 */}
              <rect x={40} y={150} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={120} y={160} w={240} h={40} label="3요소 중 하나라도 누락 = CDD 미이행" sub="수집만 하고 검증 안 하면 인정 안 됨" color={C.block} />
            </motion.g>
          )}

          {/* Step 3: 제재 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.block}>CDD 미이행 시 다단계 제재</text>

              {/* 단계별 제재 (좌→우 심각도 증가) */}
              <StatusBox x={10} y={30} w={105} h={52} label="과태료" sub="최대 3천만 원 (건별)" color={C.risk} progress={0.25} />
              <Arrow x1={115} y1={56} x2={128} y2={56} color={C.risk} />

              <StatusBox x={131} y={30} w={105} h={52} label="영업정지" sub="6개월 이내" color={C.risk} progress={0.5} />
              <Arrow x1={236} y1={56} x2={249} y2={56} color={C.block} />

              <StatusBox x={252} y={30} w={105} h={52} label="신고 취소" sub="사실상 폐업" color={C.block} progress={0.75} />
              <Arrow x1={357} y1={56} x2={370} y2={56} color={C.block} />

              <StatusBox x={373} y={30} w={95} h={52} label="형사처벌" sub="5년/5천만 원" color={C.block} progress={1} />

              {/* 확대 리스크 */}
              <rect x={30} y={105} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={40} y={115} w={180} h={40} label="가상자산이용자보호법 제재" sub="시세조종 연루 시 양쪽 법률 동시 적용" color={C.risk} />
              <Arrow x1={220} y1={135} x2={255} y2={135} color={C.block} />
              <AlertBox x={258} y={112} w={185} h={46} label="VASP 부실 → 국가 리스크" sub="FATF 상호평가 불이행 → 국제 금융 제약" color={C.block} />

              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                규제 당국의 감독 강도는 계속 높아지고 있다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
