import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  norm: '#0ea5e9',
  shr: '#f59e0b',
  sec: '#10b981',
  reg: '#8b5cf6',
  fault: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'BL2가 boot 시 TZASC region 구성 — 1GB DRAM을 3 영역으로 분할' },
  { label: 'TZASC 레지스터 — 각 region별 NS 권한 (read/write 분리)' },
  { label: 'Secure DDR 내부 구조 — teecore + ta_ram + heap + stack' },
  { label: '런타임 검증 — Normal world의 Secure 주소 접근 시 fault' },
];

const REGIONS = [
  { name: 'Normal DDR', start: '0x00000000', end: '0x3F000000', size: '1008 MB', color: C.norm, x: 30, w: 280 },
  { name: 'Shared', start: '0x3F000000', end: '0x3F800000', size: '8 MB', color: C.shr, x: 310, w: 50 },
  { name: 'Secure DDR', start: '0x3F800000', end: '0x40000000', size: '8 MB', color: C.sec, x: 360, w: 90 },
];

const SEC_LAYOUT = [
  { k: 'teecore_code', v: 'OP-TEE kernel code + data', color: C.sec },
  { k: 'tzdram_base', v: 'Secure DRAM base', color: C.sec },
  { k: 'ta_ram_base', v: 'Trusted Apps 로드 영역', color: C.shr },
  { k: 'pool_base', v: 'malloc pool (block allocator)', color: C.shr },
  { k: 'tee_heap_base', v: 'dynamic heap', color: C.norm },
  { k: 'tee_stack_top', v: 'kernel stack (각 thread)', color: C.norm },
];

export default function TzascDramLayoutViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            TZASC DRAM Layout — 1GB 시스템 예
          </text>
          {step === 0 && (
            <g>
              {REGIONS.map((r, i) => (
                <motion.g key={r.name} initial={{ opacity: 0, scaleX: 0.5 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.15 }} style={{ transformOrigin: `${r.x}px 60px` }}>
                  <rect x={r.x} y={40} width={r.w} height={42} rx={5} fill={`${r.color}20`} stroke={`${r.color}80`} strokeWidth={1} />
                  <text x={r.x + r.w / 2} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.color}>{r.name}</text>
                  <text x={r.x + r.w / 2} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{r.size}</text>
                  {i === 0 && (
                    <text x={r.x} y={94} fontSize={7.5} fill={r.color} fontFamily="monospace" fontWeight={600}>{r.start}</text>
                  )}
                  <text x={r.x + r.w} y={94} textAnchor="end" fontSize={7.5} fill={r.color} fontFamily="monospace" fontWeight={600}>{r.end}</text>
                </motion.g>
              ))}
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.reg}>BL2 (early boot)이 TZASC 구성</text>
              <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">한 번 설정하면 런타임 변경 불가 — 부팅 전 계획 필수</text>
              <DataBox x={130} y={160} w={220} h={28} label="Linux용 / world 통신용 / OP-TEE 전용" color={C.reg} />
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.reg}>TZASC-400 Region 설정</text>
              {[
                { id: 'Region 0', range: '0x00000000 ~ 0x3EFFFFFF', perm: 'NS=1 (Normal)', color: C.norm },
                { id: 'Region 1', range: '0x3F000000 ~ 0x3F7FFFFF', perm: 'NS=1 read · NS=0 r/w', color: C.shr },
                { id: 'Region 2', range: '0x3F800000 ~ 0x3FFFFFFF', perm: 'NS=0 only (Secure)', color: C.sec },
              ].map((r, i) => (
                <motion.g key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={48 + i * 38} width={420} height={32} rx={5}
                    fill={`${r.color}12`} stroke={`${r.color}55`} strokeWidth={0.8} />
                  <rect x={30} y={48 + i * 38} width={3.5} height={32} fill={r.color} />
                  <text x={45} y={62 + i * 38} fontSize={10} fontWeight={700} fill={r.color}>{r.id}</text>
                  <text x={120} y={62 + i * 38} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">{r.range}</text>
                  <text x={45} y={74 + i * 38} fontSize={8.5} fill={r.color}>{r.perm}</text>
                </motion.g>
              ))}
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bus transaction의 NS 신호와 region 권한이 일치할 때만 통과
              </text>
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sec}>
                struct secure_ddr_layout
              </text>
              {SEC_LAYOUT.map((s, i) => (
                <motion.g key={s.k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <rect x={30} y={48 + i * 22} width={420} height={18} rx={3}
                    fill={`${s.color}10`} stroke={`${s.color}40`} strokeWidth={0.6} />
                  <text x={42} y={61 + i * 22} fontSize={9} fontWeight={700} fill={s.color} fontFamily="monospace">{s.k}</text>
                  <text x={195} y={61 + i * 22} fontSize={8.5} fill="var(--muted-foreground)">{s.v}</text>
                </motion.g>
              ))}
              <text x={240} y={195} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                전체 8 MB 안에 코드/데이터/TA/heap/stack 전부 — Secure DRAM은 비싼 자원
              </text>
            </g>
          )}
          {step === 3 && (
            <g>
              <DataBox x={30} y={36} w={170} h={36} label="Normal world (Linux)" sub="0x80000000 시도" color={C.norm} />
              <text x={210} y={58} fontSize={11} fontWeight={700} fill={C.fault}>→</text>
              <DataBox x={230} y={36} w={140} h={36} label="TZASC 검사" sub="NS=1 vs Secure region" color={C.reg} />
              <text x={380} y={58} fontSize={11} fontWeight={700} fill={C.fault}>✗</text>
              <AlertBox x={400} y={36} w={70} h={36} label="REJECT" sub="bus fault" color={C.fault} />
              <text x={240} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fault}>→ Linux에서 data abort 발생</text>
              {[
                'TZASC가 transaction을 즉시 거부 (no propagate)',
                'CPU pipeline에 sync/async abort exception',
                'Linux: __do_kernel_fault → SIGBUS / panic',
                '공격자가 secure 메모리 dump 불가능',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <rect x={30} y={114 + i * 18} width={420} height={14} rx={2} fill={`${C.fault}08`} stroke={`${C.fault}30`} strokeWidth={0.5} />
                  <text x={42} y={124 + i * 18} fontSize={8.5} fill={C.fault} fontWeight={600}>{t}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
