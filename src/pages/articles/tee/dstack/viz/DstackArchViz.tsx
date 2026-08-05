import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const C = {
  vmm: '#6366f1',
  host: '#0ea5e9',
  agent: '#10b981',
  app: '#f59e0b',
  kms: '#8b5cf6',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'Host 측 (Privileged) — dstack-vmm + Host Kernel (KVM-TDX)' },
  { label: 'Guest 측 (TD VM) — dstack-guest-agent + Docker Compose' },
  { label: 'KMS 컴포넌트 — dstack-kms (외부 또는 내부 TEE)' },
  { label: '컴포넌트 간 데이터 흐름 — Manifest, Quote, Secrets' },
];

interface Box {
  id: string; layer: 'host' | 'guest' | 'kms';
  x: number; y: number; w: number; h: number;
  title: string; sub: string;
  bullets: string[]; color: string;
}

const BOXES: Box[] = [
  {
    id: 'vmm', layer: 'host', x: 30, y: 36, w: 200, h: 56,
    title: 'dstack-vmm', sub: 'VM lifecycle 관리', color: C.vmm,
    bullets: ['QEMU + KVM-TDX 조작', 'Manifest 처리', 'Port forwarding'],
  },
  {
    id: 'host', layer: 'host', x: 250, y: 36, w: 200, h: 56,
    title: 'Host Kernel (KVM-TDX)', sub: 'TD 생성·실행', color: C.host,
    bullets: ['TDX Module 호출', 'TDX_TD_INIT', 'EPT/EPC 관리'],
  },
  {
    id: 'agent', layer: 'guest', x: 30, y: 36, w: 200, h: 56,
    title: 'dstack-guest-agent', sub: 'Attestation 수행', color: C.agent,
    bullets: ['TDX quote 요청', 'KMS 호출', 'Secrets injection'],
  },
  {
    id: 'app', layer: 'guest', x: 250, y: 36, w: 200, h: 56,
    title: 'Docker Compose', sub: '사용자 컨테이너', color: C.app,
    bullets: ['secrets → env/volume', '평문 docker-compose', '앱 코드'],
  },
  {
    id: 'kms', layer: 'kms', x: 140, y: 36, w: 200, h: 56,
    title: 'dstack-kms', sub: 'Attestation + 키 발급', color: C.kms,
    bullets: ['Quote 검증', '정책 매치', '암호키 발급'],
  },
];

const FLOW_EDGES = [
  { from: { x: 90, y: 32, lbl: 'Manifest' }, to: { x: 240, y: 80 }, color: C.vmm },
  { from: { x: 240, y: 80, lbl: 'Quote' }, to: { x: 380, y: 32 }, color: C.agent },
  { from: { x: 380, y: 32, lbl: 'Secrets' }, to: { x: 90, y: 100 }, color: C.kms },
];

export default function DstackArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            dstack 주요 컴포넌트
          </text>
          {step < 3 && (
            <g>
              <text x={240} y={28} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="var(--muted-foreground)">
                {step === 0 && 'Host 측 (Privileged, BIOS/HW와 직접 통신)'}
                {step === 1 && 'Guest 측 (TD VM 안, 격리된 환경)'}
                {step === 2 && 'KMS — 별도 TEE 또는 분산 ledger 백엔드'}
              </text>
              {BOXES.filter(b => {
                if (step === 0) return b.layer === 'host';
                if (step === 1) return b.layer === 'guest';
                return b.layer === 'kms';
              }).map((b, i) => (
                <motion.g key={b.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, ...sp }}>
                  <ModuleBox x={b.x} y={b.y + 4} w={b.w} h={b.h} label={b.title} sub={b.sub} color={b.color} />
                  {b.bullets.map((bl, j) => (
                    <motion.text key={j} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.3 + j * 0.08 }}
                      x={b.x + 12} y={b.y + b.h + 22 + j * 16} fontSize={8.5} fill={b.color} fontWeight={600}>
                      • {bl}
                    </motion.text>
                  ))}
                </motion.g>
              ))}
            </g>
          )}
          {step === 3 && (
            <g>
              <ModuleBox x={20} y={44} w={130} h={40} label="dstack-vmm" sub="Host" color={C.vmm} />
              <ModuleBox x={170} y={44} w={130} h={40} label="guest-agent" sub="TD VM" color={C.agent} />
              <ModuleBox x={320} y={44} w={130} h={40} label="dstack-kms" sub="External" color={C.kms} />
              <ModuleBox x={170} y={120} w={130} h={40} label="Docker Compose" sub="User app" color={C.app} />
              {FLOW_EDGES.map((e, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.2 }}>
                  <line x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke={e.color} strokeWidth={1.2} markerEnd="url(#arr-arch)" />
                  <rect x={(e.from.x + e.to.x) / 2 - 28} y={(e.from.y + e.to.y) / 2 - 8} width={56} height={12} rx={2} fill="var(--card)" />
                  <text x={(e.from.x + e.to.x) / 2} y={(e.from.y + e.to.y) / 2 + 1} textAnchor="middle" fontSize={8} fontWeight={600} fill={e.color}>{e.from.lbl}</text>
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.9 }}>
                <line x1={235} y1={84} x2={235} y2={120} stroke={C.app} strokeWidth={1.2} markerEnd="url(#arr-arch)" />
                <text x={245} y={108} fontSize={8} fontWeight={600} fill={C.app}>secrets inject</text>
              </motion.g>
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                vmm → agent (Manifest, network) · agent → kms (Quote) · kms → agent (Secrets) · agent → app (env/volume)
              </text>
            </g>
          )}
          <defs>
            <marker id="arr-arch" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={C.kms} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
