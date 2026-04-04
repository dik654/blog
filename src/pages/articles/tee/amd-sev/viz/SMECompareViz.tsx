import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const MODES = [
  {
    name: 'SME', color: C.indigo,
    rows: ['페이지별 선택적 암호화', 'C-bit로 제어', 'OS 수정 필요', '서로 다른 키 가능', '필요한 페이지만 암호화'],
  },
  {
    name: 'TME', color: C.green,
    rows: ['전체 DRAM 암호화', '단일 키', 'OS 수정 불필요 (BIOS)', '부팅 시 랜덤 키 생성', '콜드 부트 공격 방어'],
  },
  {
    name: 'SEV', color: C.amber,
    rows: ['SME 기반 + VM별 키', 'ASID마다 고유 AES-128', 'PSP가 키 생성·관리', 'VM 간 완전 격리', '~2% 오버헤드'],
  },
];

const STEPS = [
  { label: 'SME — 선택적 페이지 암호화', body: '페이지 테이블 C-bit로 개별 페이지의 암호화 여부 제어. OS 수정 필요' },
  { label: 'TME — 전체 메모리 투명 암호화', body: '전체 DRAM을 단일 키로 투명 암호화. BIOS에서 활성화, OS 수정 불필요' },
  { label: 'SEV — SME + VM별 키 분리', body: 'SME 엔진 위에 VM별 고유 AES-128 키. PSP가 키 전체 생명주기 관리' },
];

export default function SMECompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {MODES.map((m, mi) => {
            const x = 10 + mi * 178;
            const active = step === mi;
            return (
              <motion.g key={m.name} animate={{ opacity: active ? 1 : 0.2 }}>
                <rect x={x} y={10} width={170} height={160} rx={8}
                  fill={active ? `${m.color}08` : 'var(--card)'}
                  stroke={m.color} strokeWidth={active ? 1.5 : 0.6} />
                <rect x={x} y={10} width={170} height={28} rx={8}
                  fill={`${m.color}15`} />
                <rect x={x} y={30} width={170} height={10}
                  fill={`${m.color}15`} />
                <text x={x + 85} y={29} textAnchor="middle" fontSize={12} fontWeight={700} fill={m.color}>{m.name}</text>
                {m.rows.map((r, ri) => (
                  <g key={ri}>
                    <text x={x + 14} y={56 + ri * 24} fontSize={10} fill="var(--foreground)">
                      <tspan fill={m.color} fontWeight={600}>·</tspan> {r}
                    </text>
                  </g>
                ))}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
