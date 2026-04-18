import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  consent: '#10b981',
  warn: '#f59e0b',
  law: '#6366f1',
  sep: '#3b82f6',
};

const STEPS = [
  { label: '적극적 동의 4요건', body: '명확한 고지 → 적극적 의사표시(사전 체크 금지) → 개별 동의(필수/선택/제3자/마케팅 분리) → 중요사항 강조(민감정보 표시).' },
  { label: '포괄 동의의 위험', body: '"모두 동의합니다" 단일 체크박스는 제22조 위반, 과태료 대상. 필수/선택/제3자/마케팅을 각각 별도 체크박스로 분리해야 유효.' },
  { label: '마케팅 동의 특칙', body: '서비스 동의와 별도 분리. 2년마다 재동의 필요. 야간(21시~08시) 별도 동의. 모든 광고에 무료 수신 거부 안내.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ac-inline-arrow)" />;
}

export default function ActiveConsentInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ac-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.law}>적극적 동의 4요건 (시행령 제17조)</text>

              <ActionBox x={15} y={30} w={100} h={44} label="1. 명확한 고지" sub="목적·항목·기간" color={C.consent} />
              <Arrow x1={115} y1={52} x2={133} y2={52} color={C.consent} />

              <ActionBox x={135} y={30} w={100} h={44} label="2. 적극적 행위" sub="미선택 체크박스" color={C.consent} />
              <Arrow x1={235} y1={52} x2={253} y2={52} color={C.consent} />

              <ActionBox x={255} y={30} w={100} h={44} label="3. 개별 동의" sub="항목별 분리" color={C.sep} />
              <Arrow x1={355} y1={52} x2={373} y2={52} color={C.sep} />

              <ActionBox x={375} y={30} w={90} h={44} label="4. 중요 강조" sub="민감정보 표시" color={C.warn} />

              <motion.circle r={3} fill={C.consent} opacity={0.4}
                initial={{ cx: 65 }} animate={{ cx: 420 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={52} />

              {/* 부적합 사례 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>부적합 사례</text>

              <AlertBox x={30} y={120} w={190} h={30} label="사전 체크된 체크박스" sub="" color={C.warn} />
              <AlertBox x={250} y={120} w={200} h={30} label="필수+선택 하나의 체크박스" sub="" color={C.warn} />

              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                4요건 중 하나라도 미충족 시 동의 무효 판정 가능
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>포괄 동의 vs 개별 동의</text>

              {/* 포괄 동의 (위반) */}
              <text x={120} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>포괄 동의 (위반)</text>
              <AlertBox x={30} y={45} w={180} h={60} label="모두 동의합니다" sub="필수+선택+제3자+마케팅 묶음" color={C.warn} />
              <text x={120} y={120} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>제22조 위반 → 과태료</text>

              {/* 구분선 */}
              <line x1={230} y1={35} x2={230} y2={150} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 개별 동의 (적합) */}
              <text x={360} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.consent}>개별 동의 (적합)</text>
              <DataBox x={260} y={48} w={190} h={22} label="[필수] 서비스 이용 동의" color={C.consent} />
              <DataBox x={260} y={74} w={190} h={22} label="[선택] 마케팅 수신 동의" color={C.sep} />
              <DataBox x={260} y={100} w={190} h={22} label="[별도] 제3자 제공 동의" color={C.sep} />
              <text x={360} y={138} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.consent}>각각 분리 → 유효한 동의</text>

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                ISMS-P 심사: 실제 가입 화면에서 선택항목 미동의 가입 가능 여부 확인
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.sep}>마케팅 동의 특칙 (정보통신망법 제50조)</text>

              <ModuleBox x={140} y={28} w={200} h={36} label="마케팅 동의" sub="서비스 동의와 별도 분리" color={C.sep} />

              <Arrow x1={170} y1={64} x2={100} y2={80} color={C.sep} />
              <Arrow x1={240} y1={64} x2={240} y2={80} color={C.warn} />
              <Arrow x1={310} y1={64} x2={380} y2={80} color={C.consent} />

              <DataBox x={25} y={82} w={150} h={36} label="2년 주기 재동의" color={C.sep} />
              <text x={100} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">재동의 미이행 시 효력 상실</text>

              <DataBox x={165} y={82} w={150} h={36} label="야간 광고 별도 동의" color={C.warn} />
              <text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">21시~08시 추가 동의 필요</text>

              <DataBox x={325} y={82} w={130} h={36} label="수신 거부 안내" color={C.consent} />
              <text x={390} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 광고에 무료 거부 경로</text>

              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                마케팅 미동의 시에도 핵심 서비스 이용 가능해야 함
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
