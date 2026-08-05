import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'CPU → DRAM 쓰기 — Cache (평문) → MC → 키 선택 → tweak → AES → DRAM 암호문' },
  { label: 'DRAM → CPU 읽기 — DRAM 암호문 → MC → 복호화 → Cache 평문 → CPU' },
  { label: 'Key 위치 — CPU 내부 레지스터에만 존재, DRAM에 절대 없음' },
  { label: 'Cache 평문 = 성능 — 캐시 평문 없으면 성능 90%+ 하락' },
];

const WRITE_FLOW = [
  { name: 'CPU Core', sub: 'cache write 평문', color: '#6b7280', x: 20 },
  { name: 'L1/L2/L3 Cache', sub: '평문', color: '#6366f1', x: 130 },
  { name: 'Memory Controller', sub: 'AES + tweak', color: '#10b981', x: 270 },
  { name: 'DRAM', sub: '암호문', color: '#f59e0b', x: 410 },
];

const READ_FLOW = [
  { name: 'DRAM', sub: '암호문', color: '#f59e0b', x: 20 },
  { name: 'Memory Controller', sub: 'AES decrypt', color: '#10b981', x: 130 },
  { name: 'L1/L2/L3 Cache', sub: '평문', color: '#6366f1', x: 280 },
  { name: 'CPU Core', sub: '평문 사용', color: '#6b7280', x: 410 },
];

const KEY_FACTS = [
  { line: 'Key는 CPU 내부 레지스터에만 존재', c: '#10b981' },
  { line: 'DRAM에는 absolutely never', c: '#ef4444' },
  { line: 'CPU 전원 OFF → key 사라짐 (cold boot 방어)', c: '#6366f1' },
];

const PERF_FACTS = [
  { line: 'Cache 라인은 평문 유지', c: '#6366f1' },
  { line: '캐시 hit 시 복호화 생략 → 빠름', c: '#10b981' },
  { line: '캐시 평문 없으면 성능 90%+ 하락', c: '#f59e0b' },
];

export default function MemEncPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              CPU → DRAM 쓰기 파이프라인
            </text>
            {WRITE_FLOW.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}>
                <ModuleBox x={f.x} y={70} w={92} h={56}
                  label={f.name} sub={f.sub} color={f.color} />
                {i < WRITE_FLOW.length - 1 && (
                  <text x={f.x + 96} y={102} fontSize={14} fill="var(--muted-foreground)">→</text>
                )}
              </motion.g>
            ))}
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              MC 내부: KeyID/ASID/C-bit로 key 선택 → tweak 계산 → AES-XTS
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              DRAM → CPU 읽기 파이프라인 (역순)
            </text>
            {READ_FLOW.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}>
                <ModuleBox x={f.x} y={70} w={92} h={56}
                  label={f.name} sub={f.sub} color={f.color} />
                {i < READ_FLOW.length - 1 && (
                  <text x={f.x + 96} y={102} fontSize={14} fill="var(--muted-foreground)">→</text>
                )}
              </motion.g>
            ))}
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              매 cache miss마다 복호화 발생 → 캐시 hit률이 성능 결정
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              Key 저장 위치 — CPU 내부에만
            </text>
            {KEY_FACTS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={f.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={f.c}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Cache 평문 = 성능 트레이드오프
            </text>
            {PERF_FACTS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={f.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={f.c}>{f.line}</text>
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Cache 평문 노출 → side channel 공격 발생 (별도 대응 필요)
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
