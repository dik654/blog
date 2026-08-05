import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Intel SGX — EPC (Enclave Page Cache), BIOS 예약 PRM, 외부 접근은 abort page' },
  { label: 'AMD SEV — per-VM AES key, C-bit로 암호화, ASID로 VM 식별' },
  { label: 'Intel TDX — MKTME, PA 상위 비트 KeyID, S-EPT 메모리 ownership' },
  { label: 'ARM CCA — GPT + RME, 4-PAS (NS/Secure/Realm/Root), MEC 옵션 암호화' },
  { label: '공통 속성 — 평문 노출 최소, 외부 관측 방어, HW 강제 (SW 우회 불가)' },
];

const MECH_DATA: { color: string; title: string; rows: { k: string; v: string }[] }[] = [
  {
    color: '#6366f1',
    title: 'Intel SGX — EPC',
    rows: [
      { k: '예약 영역', v: 'BIOS-reserved PRM (Processor Reserved Memory)' },
      { k: '접근 검사', v: 'CPU가 PRM 접근 시 HW 단계에서 검사' },
      { k: '외부 read', v: 'abort page 반환 (random bytes)' },
      { k: '크기', v: '128MB ~ 512MB (초기) / 1TB (SGX2/DCAP)' },
    ],
  },
  {
    color: '#10b981',
    title: 'AMD SEV — per-VM AES',
    rows: [
      { k: 'AES 위치', v: '메모리 컨트롤러 내장 AES 엔진' },
      { k: 'C-bit', v: '페이지 단위 암호화 여부 결정' },
      { k: 'ASID', v: 'VM 식별 → AES 키 선택' },
      { k: '사용 영역', v: '전체 DRAM 사용 가능 (격리는 키)' },
    ],
  },
  {
    color: '#f59e0b',
    title: 'Intel TDX — MKTME',
    rows: [
      { k: 'PA encoding', v: 'PA 상위 비트에 KeyID 인코딩' },
      { k: 'Per-VM key', v: 'KeyID마다 다른 AES key' },
      { k: 'S-EPT', v: 'VM 메모리 ownership 관리' },
      { k: '중재', v: 'TD Module이 모든 transition 중재' },
    ],
  },
  {
    color: '#0ea5e9',
    title: 'ARM CCA — GPT + RME',
    rows: [
      { k: 'GPT', v: 'Granule Protection Table (PAS별 소유권)' },
      { k: 'PAS', v: '4종 (NS / Secure / Realm / Root)' },
      { k: 'MEC', v: '암호화 (옵션) — Memory Encryption Contexts' },
      { k: '검증', v: 'Stage 2 MMU + GPC 통합 검사' },
    ],
  },
];

const COMMON = [
  { line: '평문 노출 최소화 (CPU 캐시만)', c: '#10b981' },
  { line: '외부 물리 관측 방어', c: '#10b981' },
  { line: '실행 시간 오버헤드 최소화', c: '#10b981' },
  { line: 'HW 기반 강제 (software 우회 불가)', c: '#10b981' },
];

export default function IsolationMechViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 4 && (() => {
            const m = MECH_DATA[step];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={m.color}>
                {m.title}
              </text>
              {m.rows.map((r, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={42 + i * 40} width={460} height={32} rx={4}
                    fill={`${m.color}10`} stroke={`${m.color}40`} strokeWidth={0.8} />
                  <text x={50} y={62 + i * 40} fontSize={10.5} fontWeight={700} fill={m.color}>{r.k}</text>
                  <text x={170} y={62 + i * 40} fontSize={10} fill="var(--foreground)">{r.v}</text>
                </motion.g>
              ))}
            </g>);
          })()}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              모든 TEE 공통 속성
            </text>
            {COMMON.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 38} width={420} height={30} rx={5}
                  fill={`${c.c}10`} stroke={`${c.c}40`} strokeWidth={0.8} />
                <text x={70} y={70 + i * 38} fontSize={11} fontWeight={600} fill={c.c}>{c.line}</text>
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              SW 우회 불가 = 권한 상승 / 커널 익스플로잇으로도 enclave 메모리 못 봄
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
