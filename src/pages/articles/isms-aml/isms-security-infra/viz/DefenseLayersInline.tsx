import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6' };

const STEPS = [
  {
    label: '다계층 방어: 외부 → 경계 → DMZ → 내부망',
    body: '공격자가 한 계층을 뚫어도 다음 계층에서 차단. 외부 방화벽 → IPS/WAF → DMZ 완충지대 → 내부 방화벽 → 엔드포인트 보호.',
  },
  {
    label: 'DMZ 역할과 VASP 격리 구간',
    body: 'DMZ에 웹서버만 배치, 핵심 자산(DB)은 내부망. VASP는 별도 Wallet Zone에 핫월렛·서명 서버 격리. 점프 서버 + MFA로만 접근.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-dl-arrow)" />;
}

export default function DefenseLayersInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-dl-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={10} y={15} w={70} h={30} label="인터넷" sub="외부" color={C.red} />
              <Arrow x1={82} y1={30} x2={98} y2={30} color={C.red} />
              <ModuleBox x={100} y={15} w={80} h={30} label="외부 방화벽" sub="L3-4" color={C.amber} />
              <Arrow x1={182} y1={30} x2={198} y2={30} color={C.amber} />
              <ModuleBox x={200} y={15} w={70} h={30} label="IPS/WAF" sub="L3-7" color={C.blue} />
              <Arrow x1={272} y1={30} x2={288} y2={30} color={C.blue} />
              <DataBox x={290} y={15} w={60} h={30} label="DMZ" sub="완충" color={C.green} />
              <Arrow x1={352} y1={30} x2={368} y2={30} color={C.green} />
              <ModuleBox x={370} y={15} w={80} h={30} label="내부 방화벽" sub="2차 방어" color={C.purple} />

              <Arrow x1={410} y1={47} x2={410} y2={65} color={C.purple} />
              <DataBox x={340} y={67} w={140} h={30} label="내부망" sub="DB·업무시스템" color={C.purple} />

              {/* layer labels */}
              <rect x={100} y={110} width={80} height={22} rx={3} fill={C.amber} opacity={0.15} stroke={C.amber} strokeWidth={0.5} />
              <text x={140} y={125} textAnchor="middle" fontSize={8} fill={C.amber}>경계 방어</text>
              <rect x={200} y={110} width={70} height={22} rx={3} fill={C.blue} opacity={0.15} stroke={C.blue} strokeWidth={0.5} />
              <text x={235} y={125} textAnchor="middle" fontSize={8} fill={C.blue}>탐지/차단</text>
              <rect x={290} y={110} width={60} height={22} rx={3} fill={C.green} opacity={0.15} stroke={C.green} strokeWidth={0.5} />
              <text x={320} y={125} textAnchor="middle" fontSize={8} fill={C.green}>완충</text>
              <rect x={370} y={110} width={80} height={22} rx={3} fill={C.purple} opacity={0.15} stroke={C.purple} strokeWidth={0.5} />
              <text x={410} y={125} textAnchor="middle" fontSize={8} fill={C.purple}>내부 격리</text>

              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">한 계층이 뚫려도 다음 계층에서 차단 (Defense in Depth)</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* DMZ section */}
              <rect x={20} y={10} width={200} height={80} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={1} strokeDasharray="4 2" />
              <text x={120} y={25} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>DMZ</text>
              <ModuleBox x={35} y={32} w={80} h={28} label="웹서버" sub="외부 노출" color={C.green} />
              <ModuleBox x={125} y={32} w={80} h={28} label="VPN GW" sub="원격 접속" color={C.green} />
              <text x={120} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">외부 접근 필요한 서버만</text>

              {/* Internal + Wallet Zone */}
              <rect x={260} y={10} width={210} height={80} rx={6} fill="var(--card)" stroke={C.purple} strokeWidth={1} />
              <text x={365} y={25} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.purple}>내부망</text>
              <DataBox x={270} y={32} w={80} h={28} label="DB 서버" sub="핵심 자산" color={C.blue} />

              <rect x={360} y={28} width={100} height={56} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={1} strokeDasharray="3 2" />
              <text x={410} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.red}>Wallet Zone</text>
              <text x={410} y={56} textAnchor="middle" fontSize={8} fill="var(--foreground)">핫월렛</text>
              <text x={410} y={68} textAnchor="middle" fontSize={8} fill="var(--foreground)">서명 서버</text>
              <text x={410} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">극도 제한</text>

              <Arrow x1={222} y1={50} x2={258} y2={50} color={C.green} />
              <text x={240} y={43} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">내부 FW</text>

              {/* Jump server path */}
              <Arrow x1={120} y1={92} x2={120} y2={115} color={C.amber} />
              <ActionBox x={60} y={117} w={120} h={28} label="점프 서버 + MFA" sub="유일한 접근 경로" color={C.amber} />
              <Arrow x1={182} y1={131} x2={358} y2={60} color={C.amber} />

              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">업무망 → Wallet Zone 직접 접근 전면 차단</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
