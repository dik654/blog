import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  consent: '#6366f1',
  required: '#10b981',
  optional: '#f59e0b',
  withdraw: '#ef4444',
};

const STEPS = [
  { label: '동의의 법적 근거', body: '제15조(수집·이용) + 제17조(제3자 제공) — 두 동의는 반드시 분리. 하나의 체크박스로 묶으면 무효 처리.' },
  { label: '필수항목 vs 선택항목', body: '제16조 — 선택항목 미동의를 이유로 서비스 거부하면 법 위반. 필수만으로 가입이 완료되어야 한다.' },
  { label: '적극적 동의 4대 조건', body: '명확한 고지, 적극적 의사 표시(사전 체크 금지), 개별 동의(필수/선택/제3자/마케팅 분리), 중요사항 강조.' },
  { label: '마케팅 동의 + 철회', body: '마케팅은 별도 동의 + 2년 주기 재동의. 철회는 수집 경로보다 쉬운 방법으로, 10일 이내 처리 완료.' },
  { label: '동의 기록 보관', body: '동의 일시·방법·내용·버전을 5년 보관. 입증 책임은 처리자에게 — "동의한 적 없다"에 대비.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cm-arrow)" />;
}

export default function ConsentManagementViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cm-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 법적 근거 — 수집 동의 vs 제3자 제공 동의 분리 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={150} y={5} w={180} h={40} label="정보주체 (이용자)" sub="동의 주체" color={C.consent} />

              <Arrow x1={200} y1={45} x2={120} y2={70} color={C.consent} />
              <Arrow x1={290} y1={45} x2={370} y2={70} color={C.consent} />

              <ActionBox x={30} y={72} w={180} h={44} label="수집·이용 동의" sub="제15조 — 왜·무엇을·얼마나" color={C.required} />
              <ActionBox x={270} y={72} w={180} h={44} label="제3자 제공 동의" sub="제17조 — 누구에게·왜·무엇을" color={C.optional} />

              {/* 분리 필수 강조 */}
              <rect x={30} y={135} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={100} y={145} w={280} h={38} label="반드시 별도 체크박스로 분리" sub="하나로 묶으면 제22조 위반 → 과태료" color={C.withdraw} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                VASP: KYC 항목 범위가 넓어 대부분 동의 기반 수집
              </text>
            </motion.g>
          )}

          {/* Step 1: 필수 vs 선택 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.consent}>제16조 — 최소 수집 원칙</text>

              {/* 필수항목 */}
              <ModuleBox x={20} y={30} w={200} h={55} label="필수항목" sub="서비스 제공에 반드시 필요" color={C.required} />
              <DataBox x={30} y={95} w={80} h={24} label="성명" color={C.required} />
              <DataBox x={120} y={95} w={80} h={24} label="생년월일" color={C.required} />
              <DataBox x={30} y={125} w={80} h={24} label="연락처" color={C.required} />
              <DataBox x={120} y={125} w={80} h={24} label="신분증 사본" color={C.required} />

              {/* 선택항목 */}
              <ModuleBox x={260} y={30} w={200} h={55} label="선택항목" sub="부가 목적 (거부 가능)" color={C.optional} />
              <DataBox x={270} y={95} w={85} h={24} label="마케팅 수신" color={C.optional} />
              <DataBox x={365} y={95} w={85} h={24} label="투자 성향" color={C.optional} />

              {/* 핵심 원칙 */}
              <rect x={20} y={165} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={80} y={173} w={320} h={32} label="선택 미동의 → 서비스 거부 = 법 위반" sub="필수항목만으로 가입 완료 가능해야 함" color={C.withdraw} />
            </motion.g>
          )}

          {/* Step 2: 적극적 동의 4대 조건 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.consent}>유효한 동의의 4대 조건</text>

              <ActionBox x={15} y={30} w={210} h={38} label="1. 명확한 고지" sub="목적·항목·보유기간·거부 불이익" color={C.consent} />
              <ActionBox x={255} y={30} w={210} h={38} label="2. 적극적 의사 표시" sub="기본값 미선택 체크박스" color={C.consent} />
              <ActionBox x={15} y={85} w={210} h={38} label="3. 개별 동의" sub="필수/선택/제3자/마케팅 분리" color={C.consent} />
              <ActionBox x={255} y={85} w={210} h={38} label="4. 중요사항 강조" sub="민감정보·보유기간 굵은 글씨" color={C.consent} />

              {/* 무효 사례 */}
              <rect x={15} y={140} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.withdraw}>무효 동의 사례</text>

              <AlertBox x={30} y={165} w={190} h={30} label="사전 체크된 체크박스" sub="" color={C.withdraw} />
              <AlertBox x={260} y={165} w={190} h={30} label="포괄 동의 1개 체크박스" sub="" color={C.withdraw} />
            </motion.g>
          )}

          {/* Step 3: 마케팅 동의 + 철회 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 좌: 마케팅 동의 */}
              <text x={110} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.optional}>마케팅 동의</text>
              <ActionBox x={15} y={28} w={190} h={30} label="별도 동의 필수" sub="서비스 동의와 분리" color={C.optional} />
              <Arrow x1={110} y1={58} x2={110} y2={68} color={C.optional} />
              <ActionBox x={15} y={70} w={190} h={30} label="2년 주기 재동의" sub="미갱신 시 효력 상실" color={C.optional} />
              <Arrow x1={110} y1={100} x2={110} y2={110} color={C.optional} />
              <DataBox x={25} y={112} w={170} h={26} label="야간 광고 제한 (21~08시)" color={C.optional} />
              <DataBox x={25} y={144} w={170} h={26} label="수신 거부 안내 필수" color={C.optional} />

              {/* 구분선 */}
              <line x1={230} y1={18} x2={230} y2={185} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 우: 동의 철회 */}
              <text x={365} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.withdraw}>동의 철회 (제37조)</text>
              <ActionBox x={258} y={28} w={200} h={36} label="원칙: 수집보다 쉬운 방법" sub="온라인 수집 → 온라인 철회" color={C.withdraw} />
              <Arrow x1={358} y1={64} x2={358} y2={74} color={C.withdraw} />
              <StatusBox x={268} y={76} w={180} h={44} label="10일 이내 처리" sub="철회 요청 접수 → 완료" color={C.withdraw} progress={0.6} />

              <AlertBox x={258} y={135} w={200} h={38} label="전화·방문만 = 법 위반" sub="수집 경로보다 어려운 방법" color={C.withdraw} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                철회 시에도 법정 보존 의무(특금법 5년)는 별도 적용
              </text>
            </motion.g>
          )}

          {/* Step 4: 동의 기록 보관 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.consent}>동의 기록 — 입증 책임은 처리자</text>

              <ModuleBox x={155} y={28} w={170} h={40} label="정보주체" sub="&quot;동의한 적 없다&quot; 주장" color={C.withdraw} />
              <Arrow x1={240} y1={68} x2={240} y2={85} color={C.withdraw} />

              <ActionBox x={130} y={88} w={220} h={30} label="처리자가 동의 사실 증명" sub="" color={C.consent} />
              <Arrow x1={240} y1={118} x2={240} y2={130} color={C.consent} />

              {/* 보관 항목 4개 */}
              <DataBox x={15} y={135} w={100} h={32} label="동의 일시" color={C.required} />
              <DataBox x={130} y={135} w={100} h={32} label="동의 방법" color={C.required} />
              <DataBox x={245} y={135} w={100} h={32} label="동의 내용" color={C.required} />
              <DataBox x={360} y={135} w={100} h={32} label="동의 버전" color={C.required} />

              <text x={65} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">5년 보관</text>
              <text x={180} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">5년 보관</text>
              <text x={295} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">5년 보관</text>
              <text x={410} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">영구 보관</text>

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                VASP KYC: 항목별 목적 분리 고지 — 신분증(본인확인), 계좌(입출금), 셀카(신원검증)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
