import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'ISMS 보호대책 연계: 접근통제 + 개발보안 + 사고관리',
    body: '2.6 접근통제(방화벽·VPN), 2.10 시스템 개발 보안(WAF·시큐어 코딩), 2.11 침해사고 관리(IDS/IPS → SIEM → CSIRT). 장비별 ISMS 항목이 다르다.',
  },
  {
    label: '보안 장비 종류: OSI 계층별 역할',
    body: '방화벽(L3-4), UTM(L3-7 통합), IDS/IPS(L3-7 탐지/차단), WAF(L7 웹 공격), VPN(L3-4 터널), NAC(L2-3 단말 검증), SIEM(전 계층 로그).',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-il-arrow)" />;
}

export default function IsmsLinkInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-il-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={140} h={34} label="2.6 접근통제" sub="비인가 트래픽 차단" color={C.blue} />
              <ModuleBox x={170} y={10} w={140} h={34} label="2.10 개발 보안" sub="앱 계층 보호" color={C.amber} />
              <ModuleBox x={330} y={10} w={140} h={34} label="2.11 침해사고" sub="탐지 → 대응" color={C.red} />

              <Arrow x1={80} y1={46} x2={80} y2={65} color={C.blue} />
              <Arrow x1={240} y1={46} x2={240} y2={65} color={C.amber} />
              <Arrow x1={400} y1={46} x2={400} y2={65} color={C.red} />

              <DataBox x={10} y={67} w={140} h={30} label="방화벽·세그멘테이션·VPN" color={C.blue} />
              <DataBox x={170} y={67} w={140} h={30} label="WAF + 시큐어 코딩" color={C.amber} />
              <DataBox x={330} y={67} w={140} h={30} label="IDS/IPS → SIEM → CSIRT" color={C.red} />

              <Arrow x1={80} y1={99} x2={240} y2={120} color={C.blue} />
              <Arrow x1={240} y1={99} x2={240} y2={120} color={C.amber} />
              <Arrow x1={400} y1={99} x2={240} y2={120} color={C.red} />

              <ActionBox x={140} y={120} w={200} h={30} label="보안 인프라 통합 운영" sub="장비별 ISMS 항목 매핑" color={C.green} />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">개발 단계 취약점을 WAF가 런타임에서 보완</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* OSI layers left */}
              <text x={25} y={20} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">OSI</text>
              <rect x={5} y={28} width={40} height={18} rx={2} fill={C.blue} opacity={0.15} stroke={C.blue} strokeWidth={0.5} />
              <text x={25} y={41} textAnchor="middle" fontSize={8} fill={C.blue}>L2-3</text>
              <rect x={5} y={50} width={40} height={18} rx={2} fill={C.amber} opacity={0.15} stroke={C.amber} strokeWidth={0.5} />
              <text x={25} y={63} textAnchor="middle" fontSize={8} fill={C.amber}>L3-4</text>
              <rect x={5} y={72} width={40} height={18} rx={2} fill={C.green} opacity={0.15} stroke={C.green} strokeWidth={0.5} />
              <text x={25} y={85} textAnchor="middle" fontSize={8} fill={C.green}>L3-7</text>
              <rect x={5} y={94} width={40} height={18} rx={2} fill={C.red} opacity={0.15} stroke={C.red} strokeWidth={0.5} />
              <text x={25} y={107} textAnchor="middle" fontSize={8} fill={C.red}>L7</text>

              {/* devices */}
              <ModuleBox x={60} y={26} w={80} h={22} label="NAC" sub="단말 검증" color={C.blue} />
              <ModuleBox x={160} y={26} w={80} h={22} label="방화벽" sub="IP/포트" color={C.amber} />
              <ModuleBox x={260} y={26} w={80} h={22} label="VPN" sub="암호화 터널" color={C.amber} />

              <ModuleBox x={60} y={70} w={80} h={22} label="IDS/IPS" sub="탐지/차단" color={C.green} />
              <ModuleBox x={160} y={70} w={80} h={22} label="UTM" sub="통합위협" color={C.green} />

              <ModuleBox x={60} y={92} w={80} h={22} label="WAF" sub="웹 공격" color={C.red} />

              <ModuleBox x={360} y={55} w={100} h={30} label="SIEM" sub="전 계층 로그" color={C.blue} />
              <Arrow x1={142} y1={81} x2={358} y2={70} color={C.green} />
              <Arrow x1={142} y1={103} x2={358} y2={70} color={C.red} />
              <Arrow x1={242} y1={37} x2={358} y2={70} color={C.amber} />

              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">각 장비가 서로 다른 계층을 담당 → 단일 장비에 의존하면 안 된다</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
