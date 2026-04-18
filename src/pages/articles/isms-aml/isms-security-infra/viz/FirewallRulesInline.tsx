import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '인바운드: 기본 거부 → 필요한 것만 허용',
    body: 'Deny All 기본 → 웹(80/443) Allow → SSH(22) 관리자 IP만 → VPN(443/4500) Allow. 규칙 순서 중요: 구체적 허용 먼저, 포괄 차단 마지막.',
  },
  {
    label: '아웃바운드 + DMZ 규칙 + 관리 원칙',
    body: '아웃바운드도 Deny All 기본(C&C 통신·유출 차단). DMZ→내부망은 특정 포트만 허용. 규칙 변경 시 승인자·사유·일시 기록, 분기별 리뷰.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-fr-arrow)" />;
}

export default function FirewallRulesInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-fr-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={10} y={8} w={60} h={24} label="외부" sub="Any" color={C.red} />
              <Arrow x1={72} y1={20} x2={98} y2={20} color={C.red} />
              <ModuleBox x={100} y={8} w={80} h={24} label="방화벽" sub="규칙 매칭" color={C.amber} />

              {/* rules list */}
              <rect x={200} y={5} width={270} height={110} rx={5} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={335} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">인바운드 규칙 (위→아래 순서)</text>

              <rect x={210} y={26} width={250} height={18} rx={2} fill={C.green} opacity={0.12} />
              <text x={215} y={38} fontSize={8} fill={C.green}>1. Any → 웹서버 80/443 Allow</text>
              <rect x={210} y={47} width={250} height={18} rx={2} fill={C.green} opacity={0.12} />
              <text x={215} y={59} fontSize={8} fill={C.green}>2. 관리자IP → DMZ 22 Allow (SSH)</text>
              <rect x={210} y={68} width={250} height={18} rx={2} fill={C.green} opacity={0.12} />
              <text x={215} y={80} fontSize={8} fill={C.green}>3. Any → VPN GW 443/4500 Allow</text>
              <rect x={210} y={89} width={250} height={18} rx={2} fill={C.red} opacity={0.15} />
              <text x={215} y={101} fontSize={8} fill={C.red}>999. Any → Any Deny (기본 거부)</text>

              <Arrow x1={182} y1={20} x2={198} y2={20} color={C.amber} />

              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">첫 번째 매칭 규칙이 적용 → 구체적 허용 먼저, 포괄 차단 마지막</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Outbound */}
              <DataBox x={10} y={5} w={140} h={28} label="아웃바운드" sub="내부→외부" color={C.blue} />
              <rect x={10} y={38} width={140} height={42} rx={4} fill="var(--card)" stroke={C.blue} strokeWidth={0.5} />
              <text x={80} y={52} textAnchor="middle" fontSize={8} fill="var(--foreground)">DNS(53), NTP(123)</text>
              <text x={80} y={64} textAnchor="middle" fontSize={8} fill="var(--foreground)">업데이트(443) Allow</text>
              <text x={80} y={75} textAnchor="middle" fontSize={8} fill={C.red}>나머지 Deny All</text>

              {/* DMZ rules */}
              <DataBox x={170} y={5} w={140} h={28} label="DMZ ↔ 내부망" sub="가장 엄격" color={C.green} />
              <rect x={170} y={38} width={140} height={42} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={240} y={52} textAnchor="middle" fontSize={8} fill="var(--foreground)">DMZ→내부: DB포트만</text>
              <text x={240} y={64} textAnchor="middle" fontSize={8} fill="var(--foreground)">내부→DMZ: SSH만</text>
              <text x={240} y={75} textAnchor="middle" fontSize={8} fill={C.red}>나머지 전면 차단</text>

              {/* Management */}
              <DataBox x={330} y={5} w={140} h={28} label="규칙 관리 원칙" sub="ISMS 심사 대비" color={C.amber} />
              <rect x={330} y={38} width={140} height={52} rx={4} fill="var(--card)" stroke={C.amber} strokeWidth={0.5} />
              <text x={400} y={52} textAnchor="middle" fontSize={8} fill="var(--foreground)">최소 권한 원칙</text>
              <text x={400} y={64} textAnchor="middle" fontSize={8} fill="var(--foreground)">분기별 리뷰</text>
              <text x={400} y={76} textAnchor="middle" fontSize={8} fill="var(--foreground)">변경 로그 필수</text>
              <text x={400} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">승인자·사유·일시</text>

              <text x={240} y={115} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">아웃바운드 미통제 시 C&C 통신·데이터 유출 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
