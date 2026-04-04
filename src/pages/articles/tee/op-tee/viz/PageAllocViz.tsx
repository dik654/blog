import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  '가상 메모리 풀: core_virt_mem_pool + core_virt_shm_pool',
  '페이지 테이블 캐시: mutex 보호, TLB 미스 감소',
  'ASLR: 주소 공간 랜덤화로 예측 방지',
  'NX + 카나리: 데이터 영역 실행 금지 + 스택 보호',
];

const C = { pool: '#6366f1', cache: '#10b981', prot: '#f59e0b' };

export default function PageAllocViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Memory pools */}
          <motion.rect x={20} y={10} width={240} height={80} rx={7}
            fill={step === 0 ? `${C.pool}10` : `${C.pool}04`}
            stroke={step === 0 ? C.pool : `${C.pool}30`} strokeWidth={step === 0 ? 1.5 : 1}
            animate={{ opacity: step === 0 ? 1 : 0.3 }} />
          <text x={35} y={28} fontSize={10} fontWeight={700} fill={C.pool}>가상 메모리 풀</text>
          <rect x={30} y={36} width={220} height={18} rx={3}
            fill={step === 0 ? `${C.pool}08` : 'var(--card)'}
            stroke={step === 0 ? `${C.pool}40` : 'var(--border)'} strokeWidth={0.5} />
          <text x={40} y={49} fontSize={10} fill={step === 0 ? C.pool : 'var(--muted-foreground)'}>
            core_virt_mem_pool (코어 매핑)
          </text>
          <rect x={30} y={58} width={220} height={18} rx={3}
            fill={step === 0 ? `${C.pool}08` : 'var(--card)'}
            stroke={step === 0 ? `${C.pool}40` : 'var(--border)'} strokeWidth={0.5} />
          <text x={40} y={71} fontSize={10} fill={step === 0 ? C.pool : 'var(--muted-foreground)'}>
            core_virt_shm_pool (32MB 공유)
          </text>

          {/* Page table cache */}
          <motion.rect x={280} y={10} width={240} height={80} rx={7}
            fill={step === 1 ? `${C.cache}10` : `${C.cache}04`}
            stroke={step === 1 ? C.cache : `${C.cache}30`} strokeWidth={step === 1 ? 1.5 : 1}
            animate={{ opacity: step === 1 ? 1 : 0.3 }} />
          <text x={295} y={28} fontSize={10} fontWeight={700} fill={C.cache}>pgt_cache</text>
          {['mutex — 동시 접근 보호', 'entries — 캐시 엔트리', 'max_entries — 최대 크기'].map((t, i) => (
            <text key={i} x={295} y={46 + i * 15} fontSize={10}
              fill={step === 1 ? C.cache : 'var(--muted-foreground)'}>{t}</text>
          ))}

          {/* Security features */}
          {[
            { label: 'ASLR', desc: '주소 공간 랜덤화', s: 2, c: C.prot },
            { label: 'NX bit', desc: '데이터→코드 실행 금지', s: 3, c: C.prot },
            { label: 'Stack canary', desc: '스택 오버플로 탐지', s: 3, c: C.prot },
          ].map((f, i) => {
            const active = step === f.s;
            const x = 20 + i * 176;
            return (
              <g key={f.label}>
                <motion.rect x={x} y={105} width={166} height={40} rx={6}
                  fill={active ? `${f.c}14` : `${f.c}05`}
                  stroke={active ? f.c : `${f.c}30`} strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : 0.2 }} />
                <text x={x + 12} y={122} fontSize={10} fontWeight={600} fill={f.c}>{f.label}</text>
                <text x={x + 12} y={137} fontSize={10} fill="var(--muted-foreground)">{f.desc}</text>
              </g>
            );
          })}

          <text x={270} y={165} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            페이지 테이블 자체를 Secure 메모리에 저장
          </text>
        </svg>
      )}
    </StepViz>
  );
}
