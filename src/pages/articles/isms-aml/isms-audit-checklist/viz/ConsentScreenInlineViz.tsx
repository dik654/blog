import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  privacy: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '처리방침 확인 흐름', body: '심사원이 메인 하단 스크롤 → 링크 클릭 → 법정 8개 항목 체크. 링크 없거나 깨지면 즉시 결함.' },
  { label: '동의 화면 6대 확인', body: '필수/선택 분리, 사전 체크 금지, 미동의 차단, 수집 항목·목적·보유기간 명시.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#csi-arrow)" />;
}

export default function ConsentScreenInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="csi-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">처리방침 확인 흐름</text>

              <ActionBox x={15} y={28} w={100} h={40} label="메인 페이지" sub="Footer 스크롤" color={C.privacy} />
              <Arrow x1={115} y1={48} x2={133} y2={48} color={C.privacy} />

              <ModuleBox x={135} y={28} w={120} h={40} label="처리방침 링크" sub="한글 링크 확인" color={C.ok} />
              <Arrow x1={255} y1={48} x2={273} y2={48} color={C.ok} />

              <ActionBox x={275} y={28} w={100} h={40} label="내용 읽기" sub="8개 항목 체크" color={C.warn} />
              <Arrow x1={375} y1={48} x2={393} y2={48} color={C.warn} />

              <ModuleBox x={395} y={28} w={70} h={40} label="변경 이력" sub="시행일 확인" color={C.ok} />

              <rect x={30} y={85} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">법정 8개 필수 항목</text>

              <DataBox x={15} y={110} w={105} h={28} label="1. 처리 목적" color={C.privacy} />
              <DataBox x={130} y={110} w={105} h={28} label="2. 수집 항목" color={C.privacy} />
              <DataBox x={245} y={110} w={105} h={28} label="3. 보유 기간" color={C.privacy} />
              <DataBox x={360} y={110} w={105} h={28} label="4. 제3자 제공" color={C.warn} />

              <DataBox x={15} y={145} w={105} h={28} label="5. 파기 절차" color={C.warn} />
              <DataBox x={130} y={145} w={105} h={28} label="6. 권리 행사" color={C.privacy} />
              <DataBox x={245} y={145} w={105} h={28} label="7. 안전성 확보" color={C.ok} />
              <DataBox x={360} y={145} w={105} h={28} label="8. 보호책임자" color={C.ok} />

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1년 이상 미변경 + 서비스 업데이트 있었으면 "현황 불일치" 지적</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">동의 화면 6대 확인 항목</text>

              <DataBox x={15} y={30} w={140} h={32} label="필수/선택 분리" color={C.ok} />
              <DataBox x={170} y={30} w={140} h={32} label="사전 체크 금지" color={C.fail} />
              <DataBox x={325} y={30} w={140} h={32} label="미동의 시 차단" color={C.warn} />

              <DataBox x={15} y={72} w={140} h={32} label="수집 항목 명시" color={C.privacy} />
              <DataBox x={170} y={72} w={140} h={32} label="수집 목적 명시" color={C.privacy} />
              <DataBox x={325} y={72} w={140} h={32} label="보유 기간 명시" color={C.privacy} />

              <rect x={30} y={120} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={132} w={195} h={38} label="체크박스 하나로 전체 동의" sub="포괄 동의 = 결함 (분리 필수)" color={C.fail} />
              <AlertBox x={255} y={132} w={195} h={38} label="체크박스 미리 체크 상태" sub="사용자 직접 체크해야 유효" color={C.fail} />

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증적: 회원가입 전체 캡처 + 필수/선택 분리 화면 + 거부 시 차단 화면</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
