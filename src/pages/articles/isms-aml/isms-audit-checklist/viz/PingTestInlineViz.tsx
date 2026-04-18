import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  dmz: '#f59e0b',
  fw: '#6366f1',
  internal: '#10b981',
  fail: '#ef4444',
};

const STEPS = [
  { label: 'DMZ → 내부망', body: 'DMZ 웹서버에서 내부 DB로 ping. 100% packet loss가 정상 — ICMP 차단이 망분리의 기본.' },
  { label: '증적 준비', body: '방화벽 ICMP 차단 규칙 스크린샷 + ping 실패 화면 캡처. 예외 허용 시 승인서 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#pti-arrow)" />;
}

export default function PingTestInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pti-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">망분리 ping 테스트</text>

              {/* 구간 배경 */}
              <rect x={15} y={25} width={130} height={20} rx={4} fill={C.dmz} opacity={0.12} />
              <text x={80} y={39} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dmz}>DMZ 구간</text>
              <rect x={195} y={25} width={90} height={20} rx={4} fill={C.fw} opacity={0.12} />
              <text x={240} y={39} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.fw}>방화벽</text>
              <rect x={335} y={25} width={130} height={20} rx={4} fill={C.internal} opacity={0.12} />
              <text x={400} y={39} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.internal}>내부망</text>

              <ModuleBox x={25} y={52} w={110} h={42} label="웹서버" sub="외부 접근 가능" color={C.dmz} />
              <ModuleBox x={345} y={52} w={110} h={42} label="DB서버" sub="내부망 전용" color={C.internal} />

              {/* ping 시도 */}
              <motion.line x1={135} y1={73} x2={240} y2={73}
                stroke={C.fail} strokeWidth={1.5} strokeDasharray="5 3"
                initial={{ x2: 135 }} animate={{ x2: 240 }} transition={{ duration: 0.5 }} />
              <text x={188} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.fail}>ping →</text>

              {/* 차단 X 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <line x1={235} y1={64} x2={250} y2={82} stroke={C.fail} strokeWidth={2.5} />
                <line x1={250} y1={64} x2={235} y2={82} stroke={C.fail} strokeWidth={2.5} />
              </motion.g>

              <DataBox x={60} y={110} w={160} h={28} label="100% packet loss = 정상" color={C.internal} />
              <AlertBox x={260} y={107} w={180} h={34} label="ping 통과 = 즉시 결함" sub="망분리 미흡 판정" color={C.fail} />

              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">내부 서버 → 외부 인터넷 ping도 차단 또는 프록시 경유만 허용</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">증적 준비 항목</text>

              <DataBox x={30} y={30} w={130} h={36} label="ICMP 차단 규칙" color={C.fw} />
              <Arrow x1={160} y1={48} x2={175} y2={48} color={C.fw} />
              <DataBox x={178} y={30} w={130} h={36} label="ping 실패 캡처" color={C.internal} />
              <Arrow x1={308} y1={48} x2={323} y2={48} color={C.internal} />
              <DataBox x={326} y={30} w={130} h={36} label="방화벽 규칙 스샷" color={C.dmz} />

              <rect x={30} y={85} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={80} y={98} w={320} h={42} label="예외 허용 시 반드시 승인서 첨부" sub="승인 일자 · 승인자 · 허용 사유 · 만료일을 기재한 예외 승인서" color={C.fail} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모니터링 서버 ICMP 허용 등 예외는 정책 문서화 필수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
