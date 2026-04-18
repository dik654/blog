import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  law: '#6366f1',
  item: '#10b981',
  warn: '#f59e0b',
  vasp: '#3b82f6',
};

const STEPS = [
  { label: '목적 + 항목 + 보유기간', body: '처리 목적은 구체적이어야 한다 ("서비스 개선"은 부적합). 항목은 필수/선택 구분. 보유기간은 법적 근거와 함께 명시.' },
  { label: '제공 + 위탁 + 권리', body: '제3자 제공: 누구에게, 왜, 무엇을. 위탁: 수탁자명과 업무. 정보주체 권리: 열람·정정·삭제·정지 행사 경로.' },
  { label: 'CPO 연락처 + 변경이력', body: 'CPO(개인정보보호책임자)의 성명·직위·부서·연락처 기재. 변경이력: 변경 일자와 내용을 기록하여 이전 버전과 비교 가능하게.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ri-inline-arrow)" />;
}

export default function RequiredItemsInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ri-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.law}>제30조 제1항 각호 1~3</text>

              <DataBox x={15} y={30} w={140} h={44} label="1. 처리 목적" color={C.item} />
              <text x={85} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"회원관리", "KYC", "AML"</text>
              <text x={85} y={100} textAnchor="middle" fontSize={8} fill={C.warn}>포괄적 표현 부적합</text>

              <DataBox x={170} y={30} w={140} h={44} label="2. 수집 항목" color={C.item} />
              <text x={240} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">필수 vs 선택 구분 필수</text>
              <text x={240} y={100} textAnchor="middle" fontSize={8} fill={C.vasp}>VASP: 신분증, 계좌, 지갑</text>

              <DataBox x={325} y={30} w={140} h={44} label="3. 보유기간" color={C.item} />
              <text x={395} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">법적 근거 + 기간 명시</text>
              <text x={395} y={100} textAnchor="middle" fontSize={8} fill={C.vasp}>특금법 5년, 전상법 5년</text>

              <Arrow x1={155} y1={52} x2={168} y2={52} color={C.item} />
              <Arrow x1={310} y1={52} x2={323} y2={52} color={C.item} />

              <motion.circle r={3} fill={C.item} opacity={0.4}
                initial={{ cx: 85 }} animate={{ cx: 395 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} cy={52} />

              <AlertBox x={120} y={115} w={240} h={34} label="하나라도 누락 시 ISMS-P 부적합" sub="시행령 제31조 세부 사항 규정" color={C.warn} />

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                목적은 구체적으로 — 항목은 분류하여 — 기간은 근거와 함께
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.law}>제30조 제1항 각호 4~6</text>

              <ModuleBox x={15} y={30} w={140} h={48} label="4. 제3자 제공" sub="누구에게, 왜, 무엇을" color={C.vasp} />
              <Arrow x1={155} y1={54} x2={170} y2={54} color={C.vasp} />

              <ModuleBox x={170} y={30} w={140} h={48} label="5. 위탁 현황" sub="수탁자명, 위탁 업무" color={C.vasp} />
              <Arrow x1={310} y1={54} x2={325} y2={54} color={C.vasp} />

              <ModuleBox x={325} y={30} w={140} h={48} label="6. 권리·행사" sub="열람·정정·삭제·정지" color={C.vasp} />

              {/* 하단: 구체적 예시 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={15} y={105} w={140} h={30} label="Travel Rule 상대 VASP" color={C.item} />
              <DataBox x={170} y={105} w={140} h={30} label="KYC 인증 업체" color={C.item} />
              <DataBox x={325} y={105} w={140} h={30} label="웹/이메일/서면 경로" color={C.item} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                제공과 위탁은 법적 성격이 다름 — 제공은 별도 동의, 위탁은 계약+공개
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.law}>제30조 제1항 각호 7~8</text>

              {/* CPO */}
              <ModuleBox x={30} y={30} w={180} h={55} label="7. CPO 연락처" sub="개인정보보호책임자" color={C.item} />
              <DataBox x={40} y={96} w={70} h={24} label="성명·직위" color={C.item} />
              <DataBox x={120} y={96} w={80} h={24} label="부서·연락처" color={C.item} />

              <line x1={225} y1={30} x2={225} y2={140} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 변경이력 */}
              <ModuleBox x={250} y={30} w={200} h={55} label="8. 변경 이력" sub="버전별 비교 가능" color={C.warn} />
              <DataBox x={260} y={96} w={80} h={24} label="변경 일자" color={C.warn} />
              <DataBox x={350} y={96} w={90} h={24} label="변경 내용" color={C.warn} />

              <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vasp}>
                CPO = 정보주체 민원 접수·처리 창구 (제31조)
              </text>
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                변경이력은 시행일 명시 필수 — 정보주체가 이전 버전 비교 가능
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
