import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'WAF + VPN + NAC 3중 접근 통제',
    body: 'WAF는 "어떤 요청인가"(L7), VPN은 "어디서 접속하는가"(터널), NAC는 "이 기기는 안전한가"(단말 상태). 조합하면 "검증된 기기에서 안전한 터널로 정상 요청만" 허용.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-vn-arrow)" />;
}

export default function VpnNacInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-vn-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={170} y={5} w={140} h={26} label="외부 사용자 요청" color={C.red} />
              <Arrow x1={240} y1={33} x2={80} y2={55} color={C.red} />
              <Arrow x1={240} y1={33} x2={240} y2={55} color={C.red} />
              <Arrow x1={240} y1={33} x2={400} y2={55} color={C.red} />

              <ModuleBox x={20} y={56} w={120} h={36} label="NAC" sub="기기 안전한가?" color={C.blue} />
              <ModuleBox x={180} y={56} w={120} h={36} label="VPN" sub="어디서 접속?" color={C.green} />
              <ModuleBox x={340} y={56} w={120} h={36} label="WAF" sub="어떤 요청?" color={C.amber} />

              <text x={80} y={106} textAnchor="middle" fontSize={8} fill={C.blue}>단말 상태 검증</text>
              <text x={240} y={106} textAnchor="middle" fontSize={8} fill={C.green}>암호화 터널</text>
              <text x={400} y={106} textAnchor="middle" fontSize={8} fill={C.amber}>L7 요청 분석</text>

              <Arrow x1={80} y1={94} x2={200} y2={125} color={C.blue} />
              <Arrow x1={240} y1={94} x2={240} y2={125} color={C.green} />
              <Arrow x1={400} y1={94} x2={280} y2={125} color={C.amber} />

              <ActionBox x={120} y={125} w={240} h={32} label="다계층 접근 통제 완성" sub="검증 기기 + 안전 터널 + 정상 요청만 허용" color={C.green} />

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">세 관점을 조합해야 비로소 완전한 접근 통제</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
