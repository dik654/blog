import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  controller: '#6366f1',
  processor: '#f59e0b',
  audit: '#10b981',
  warn: '#ef4444',
};

const STEPS = [
  { label: '위탁 시 4가지 필수 조치', body: '위탁 계약서 체결(업무 내용·처리 제한·보호조치·재위탁 제한) → 수탁자 공개(처리방침 게시) → 관리 감독(연 1회 점검·교육) → 재위탁 제한(서면 동의).' },
  { label: '국외 이전 6가지 고지 사항', body: '이전받는 자, 이전 국가, 이전 일시·방법, 이전 항목, 이용 목적, 보호조치. 해외 클라우드도 글로벌 관리 인력 접근 시 국외 이전에 해당할 수 있다.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#pm-inline-arrow)" />;
}

export default function ProcessorManagementInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pm-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.controller}>업무 위탁 필수 조치 (제26조)</text>

              {/* 위탁자 → 수탁자 */}
              <ModuleBox x={15} y={30} w={100} h={40} label="위탁자" sub="VASP" color={C.controller} />
              <Arrow x1={115} y1={50} x2={160} y2={50} color={C.controller} />
              <ModuleBox x={163} y={30} w={100} h={40} label="수탁자" sub="대행 업체" color={C.processor} />

              {/* 4가지 필수 조치 */}
              <ActionBox x={290} y={26} w={175} h={24} label="1. 위탁 계약서 체결" sub="" color={C.audit} />
              <ActionBox x={290} y={55} w={175} h={24} label="2. 수탁자 공개 (처리방침)" sub="" color={C.audit} />
              <ActionBox x={290} y={84} w={175} h={24} label="3. 관리·감독 (연 1회+)" sub="" color={C.audit} />
              <ActionBox x={290} y={113} w={175} h={24} label="4. 재위탁 제한 (서면 동의)" sub="" color={C.warn} />

              <Arrow x1={263} y1={50} x2={288} y2={38} color={C.audit} />
              <Arrow x1={263} y1={50} x2={288} y2={67} color={C.audit} />
              <Arrow x1={263} y1={50} x2={288} y2={96} color={C.audit} />
              <Arrow x1={263} y1={50} x2={288} y2={125} color={C.warn} />

              <line x1={15} y1={150} x2={465} y2={150} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                수탁자는 위탁자 지시 범위 내에서만 처리 — 자체 목적 이용 불가
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                수탁자 과실로 손해 발생 시 위탁자도 공동 배상 책임
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.controller}>국외 이전 고지 사항 (제28조의8)</text>

              {/* 국내 → 해외 */}
              <ModuleBox x={10} y={30} w={80} h={38} label="국내 VASP" sub="" color={C.controller} />
              <Arrow x1={90} y1={49} x2={115} y2={49} color={C.controller} />

              {/* 국경선 */}
              <line x1={110} y1={25} x2={110} y2={155} stroke={C.warn} strokeWidth={1} strokeDasharray="6 3" />
              <text x={112} y={162} fontSize={7} fill={C.warn}>국경</text>

              <ModuleBox x={120} y={30} w={80} h={38} label="해외 법인" sub="" color={C.processor} />

              {/* 6가지 고지 */}
              <DataBox x={220} y={25} w={120} h={24} label="1. 이전받는 자" color={C.processor} />
              <DataBox x={350} y={25} w={120} h={24} label="2. 이전 국가" color={C.processor} />
              <DataBox x={220} y={55} w={120} h={24} label="3. 일시·방법" color={C.processor} />
              <DataBox x={350} y={55} w={120} h={24} label="4. 이전 항목" color={C.processor} />
              <DataBox x={220} y={85} w={120} h={24} label="5. 이용 목적" color={C.processor} />
              <DataBox x={350} y={85} w={120} h={24} label="6. 보호조치" color={C.audit} />

              <line x1={15} y1={125} x2={465} y2={125} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={70} y={132} w={340} h={36} label="해외 클라우드 한국 리전도 국외 이전 가능성" sub="글로벌 관리 인력 접근 시 국외 이전 해당" color={C.warn} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                한국 리전 내 접근 제한 계약 또는 처리방침에 국외 이전 고지
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
