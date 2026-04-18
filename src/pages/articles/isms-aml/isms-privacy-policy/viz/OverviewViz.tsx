import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  law: '#6366f1',
  doc: '#10b981',
  warn: '#f59e0b',
  pub: '#3b82f6',
};

const STEPS = [
  { label: '법적 근거: 제30조', body: '개인정보보호법 제30조 — 모든 개인정보처리자는 처리방침을 수립하고 공개해야 한다. 위반 시 1천만 원 이하 과태료.' },
  { label: 'ISMS-P 3.x 영역 연동', body: '처리방침은 ISMS-P 3.x 22개 항목의 외부 공개 요약본. 3.1 수집 ~ 3.5 위탁까지 각 항목이 처리방침의 특정 기재 사항과 직접 매핑된다.' },
  { label: '필수 기재 8개 항목', body: '처리 목적, 수집 항목, 보유기간, 제3자 제공, 위탁, 정보주체 권리, CPO 연락처, 변경이력 — 하나라도 누락되면 부적합.' },
  { label: '공개 위치와 변경 절차', body: 'Footer 1클릭 접근, 회원가입 페이지 연결, 앱 설정 메뉴 배치. 변경 시 7일(중요 30일) 전 사전 고지 후 시행.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ppo-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ppo-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 법적 근거 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={140} h={50} label="개인정보보호법" sub="제30조 제1항" color={C.law} />
              <Arrow x1={150} y1={35} x2={180} y2={35} color={C.law} />

              <ActionBox x={183} y={12} w={130} h={46} label="처리방침 수립" sub="내부 규정 확정" color={C.doc} />
              <Arrow x1={313} y1={35} x2={343} y2={35} color={C.doc} />

              <ActionBox x={346} y={12} w={120} h={46} label="외부 공개" sub="정보주체 확인 가능" color={C.pub} />

              {/* 하단: 위반 시 */}
              <rect x={10} y={80} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">위반 시 제재</text>

              <AlertBox x={50} y={110} w={160} h={42} label="과태료 1천만 원 이하" sub="제75조 근거" color={C.warn} />
              <AlertBox x={270} y={110} w={160} h={42} label="ISMS-P 부적합 판정" sub="3.1 항목 심사 불통과" color={C.warn} />

              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                VASP는 ISMS-P 인증 심사에서 처리방침 적정성을 별도 검증
              </text>
            </motion.g>
          )}

          {/* Step 1: ISMS-P 3.x 매핑 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={100} h={44} label="ISMS-P 3.x" sub="22개 항목" color={C.law} />

              {/* 5개 항목 → 처리방침 */}
              <DataBox x={140} y={8} w={90} h={26} label="3.1 수집" color={C.doc} />
              <DataBox x={140} y={40} w={90} h={26} label="3.2 이용·제공" color={C.doc} />
              <DataBox x={140} y={72} w={90} h={26} label="3.3 보관·파기" color={C.doc} />
              <DataBox x={140} y={104} w={90} h={26} label="3.4 권리보호" color={C.doc} />
              <DataBox x={140} y={136} w={90} h={26} label="3.5 위탁" color={C.doc} />

              <Arrow x1={110} y1={32} x2={138} y2={21} color={C.law} />
              <Arrow x1={110} y1={32} x2={138} y2={53} color={C.law} />
              <Arrow x1={110} y1={42} x2={138} y2={85} color={C.law} />
              <Arrow x1={110} y1={52} x2={138} y2={117} color={C.law} />
              <Arrow x1={110} y1={52} x2={138} y2={149} color={C.law} />

              {/* 화살표 → 처리방침 연동 */}
              <Arrow x1={230} y1={21} x2={280} y2={50} color={C.pub} />
              <Arrow x1={230} y1={53} x2={280} y2={65} color={C.pub} />
              <Arrow x1={230} y1={85} x2={280} y2={80} color={C.pub} />
              <Arrow x1={230} y1={117} x2={280} y2={95} color={C.pub} />
              <Arrow x1={230} y1={149} x2={280} y2={110} color={C.pub} />

              <ModuleBox x={283} y={45} w={170} h={80} label="개인정보 처리방침" sub="3.x 항목의 외부 공개 요약본" color={C.pub} />

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                처리방침 = ISMS-P 3.x 22개 항목을 정보주체에게 공개하는 창구
              </text>
            </motion.g>
          )}

          {/* Step 2: 필수 기재 8개 항목 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.law}>제30조 제1항 — 필수 기재 항목</text>

              {/* 2x4 그리드 */}
              <DataBox x={15} y={30} w={100} h={32} label="1. 처리 목적" color={C.doc} />
              <DataBox x={130} y={30} w={100} h={32} label="2. 수집 항목" color={C.doc} />
              <DataBox x={245} y={30} w={100} h={32} label="3. 보유기간" color={C.doc} />
              <DataBox x={360} y={30} w={100} h={32} label="4. 제3자 제공" color={C.doc} />

              <DataBox x={15} y={78} w={100} h={32} label="5. 위탁 현황" color={C.doc} />
              <DataBox x={130} y={78} w={100} h={32} label="6. 권리·행사" color={C.doc} />
              <DataBox x={245} y={78} w={100} h={32} label="7. CPO 연락처" color={C.doc} />
              <DataBox x={360} y={78} w={100} h={32} label="8. 변경 이력" color={C.doc} />

              {/* 하단 경고 */}
              <rect x={15} y={130} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={120} y={142} w={240} h={36} label="하나라도 누락 시 부적합 판정" sub="시행령 제31조가 세부 사항 규정" color={C.warn} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                VASP: KYC로 수집하는 신분증·계좌·지갑주소 등을 항목 2에 반드시 포함
              </text>
            </motion.g>
          )}

          {/* Step 3: 공개 위치 + 변경 절차 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 좌측: 공개 위치 */}
              <text x={105} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pub}>공개 위치</text>
              <DataBox x={20} y={28} w={170} h={26} label="홈페이지 Footer (1클릭)" color={C.pub} />
              <DataBox x={20} y={60} w={170} h={26} label="회원가입 페이지 연결" color={C.pub} />
              <DataBox x={20} y={92} w={170} h={26} label="모바일 앱 설정 메뉴" color={C.pub} />
              <DataBox x={20} y={124} w={170} h={26} label="오프라인 사업장 비치" color={C.pub} />

              {/* 구분선 */}
              <line x1={220} y1={18} x2={220} y2={170} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 우측: 변경 절차 */}
              <text x={350} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>변경 절차</text>
              <ActionBox x={248} y={28} w={210} h={26} label="1. 변경 사유 발생" sub="" color={C.warn} />
              <Arrow x1={353} y1={54} x2={353} y2={62} color={C.warn} />
              <ActionBox x={248} y={64} w={210} h={26} label="2. CPO 검토 → 법적 적합성 확인" sub="" color={C.warn} />
              <Arrow x1={353} y1={90} x2={353} y2={98} color={C.warn} />
              <ActionBox x={248} y={100} w={210} h={26} label="3. 사전 고지 (7일/30일 전)" sub="" color={C.warn} />
              <Arrow x1={353} y1={126} x2={353} y2={134} color={C.doc} />
              <ActionBox x={248} y={136} w={210} h={26} label="4. 교체 시행 + 아카이브 보관" sub="" color={C.doc} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                변경 이력 = 심사 증적: 변경일·비교표·고지 캡처·CPO 서명 세트
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
