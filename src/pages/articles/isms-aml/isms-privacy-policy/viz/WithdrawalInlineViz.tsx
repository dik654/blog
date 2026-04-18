import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  withdraw: '#ef4444',
  record: '#6366f1',
  rule: '#f59e0b',
  ok: '#10b981',
};

const STEPS = [
  { label: '동의 철회 원칙', body: '정보주체는 언제든 동의 철회 가능(제37조). 핵심: "수집 경로보다 쉬운 방법으로 철회 가능해야." 요청 후 10일 이내 처리 완료 의무.' },
  { label: '동의 기록 보관 4종', body: '입증 책임은 처리자에게 있다. 동의 일시(초 단위), 동의 방법, 동의 내용(처리방침 버전), 동의 버전 번호를 5년간 보관.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#wd-inline-arrow)" />;
}

export default function WithdrawalInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="wd-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.withdraw}>동의 철회 흐름 (제37조)</text>

              <ActionBox x={15} y={32} w={100} h={40} label="철회 요청" sub="정보주체 의사" color={C.withdraw} />
              <Arrow x1={115} y1={52} x2={140} y2={52} color={C.withdraw} />

              <ActionBox x={143} y={32} w={100} h={40} label="본인 확인" sub="수집 경로와 동등" color={C.record} />
              <Arrow x1={243} y1={52} x2={268} y2={52} color={C.record} />

              <ActionBox x={271} y={32} w={100} h={40} label="처리 실행" sub="10일 이내 완료" color={C.ok} />
              <Arrow x1={371} y1={52} x2={396} y2={52} color={C.ok} />

              <StatusBox x={399} y={30} w={70} h={44} label="완료 통지" sub="" color={C.ok} />

              <motion.circle r={3} fill={C.withdraw} opacity={0.4}
                initial={{ cx: 65 }} animate={{ cx: 434 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={52} />

              {/* 위반 사례 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.rule}>위반 사례: 철회가 수집보다 어려운 경우</text>

              <AlertBox x={30} y={120} w={120} h={30} label="온라인 수집" sub="" color={C.ok} />
              <text x={180} y={138} textAnchor="middle" fontSize={10} fill={C.withdraw}>→</text>
              <AlertBox x={200} y={120} w={130} h={30} label="전화·방문만 철회" sub="" color={C.withdraw} />
              <text x={370} y={138} textAnchor="middle" fontSize={10} fill={C.rule}>=</text>
              <AlertBox x={390} y={120} w={70} h={30} label="법 위반" sub="" color={C.rule} />

              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                앱에서 수집하면 앱 내에서 철회 가능해야 함
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.record}>동의 기록 보관 항목</text>

              <text x={240} y={36} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">입증 책임 = 개인정보처리자 (정보주체가 "동의한 적 없다" 주장 시 처리자가 증명)</text>

              <DataBox x={15} y={48} w={105} h={44} label="동의 일시" color={C.record} />
              <text x={67} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">연-월-일 시:분:초</text>

              <DataBox x={130} y={48} w={105} h={44} label="동의 방법" color={C.record} />
              <text x={182} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">체크박스/전자서명</text>

              <DataBox x={245} y={48} w={105} h={44} label="동의 내용" color={C.record} />
              <text x={297} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">처리방침 버전</text>

              <DataBox x={360} y={48} w={105} h={44} label="동의 버전" color={C.rule} />
              <text x={412} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">v1.0, v1.1 ...</text>

              <Arrow x1={120} y1={70} x2={128} y2={70} color={C.record} />
              <Arrow x1={235} y1={70} x2={243} y2={70} color={C.record} />
              <Arrow x1={350} y1={70} x2={358} y2={70} color={C.record} />

              {/* 보관 기간 */}
              <line x1={15} y1={120} x2={465} y2={120} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <StatusBox x={140} y={130} w={200} h={36} label="보관 기간: 5년 (버전은 영구)" sub="ISMS-P 심사 시 증적 제출 대상" color={C.ok} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
