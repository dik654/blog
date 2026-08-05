import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  sgx: '#10b981',
  sev: '#ec4899',
  tdx: '#0ea5e9',
  snp: '#8b5cf6',
  good: '#10b981',
  warn: '#f59e0b',
  bad: '#ef4444',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Intel SGX 명령어 7개',
    body: 'EADD/EEXTEND/EINIT/EENTER/EEXIT/EWBLOCK/ELDU. Enclave 라이프사이클 — page 단위 fine-grained.',
  },
  {
    label: 'AMD SEV 명령어 9개',
    body: 'LAUNCH_START → LAUNCH_UPDATE_DATA → LAUNCH_UPDATE_VMSA(ES) → LAUNCH_MEASURE → LAUNCH_SECRET → LAUNCH_FINISH. SNP 변형 별도.',
  },
  {
    label: 'Intel TDX SEAMCALL 9개',
    body: 'TDH.MNG.* (관리), TDH.MEM.PAGE.* (페이지), TDH.MR.* (measurement), TDH.VP.* (VCPU). VMM이 SEAM에 위임.',
  },
  {
    label: '보안 강도 비교',
    body: 'SGX: EPC만 보호(128MB 한계). SEV: VM 전체, 무결성 약함. SEV-SNP: VM + 무결성(RMP). TDX: TD + 무결성(SEAM).',
  },
  {
    label: '개발 난이도 vs 성능 vs 생태계',
    body: 'SGX: 코드 분리 필요 / EPC 병목 / Open Enclave·Gramine·SCONE. SEV·TDX: 기존 VM 그대로 / VM 수준 격리 / virtee·TDX kernel.',
  },
];

interface Inst { name: string; desc: string; color: string; }

const SGX_INSTS: Inst[] = [
  { name: 'EADD', desc: 'EPC 페이지 추가 (enclave 구성)', color: C.sgx },
  { name: 'EEXTEND', desc: 'Measurement 업데이트 (256B 단위)', color: C.sgx },
  { name: 'EINIT', desc: 'Enclave 완성, SIGSTRUCT 검증', color: C.sgx },
  { name: 'EENTER', desc: 'Enclave 진입', color: C.sgx },
  { name: 'EEXIT', desc: 'Enclave 종료', color: C.sgx },
  { name: 'EWBLOCK', desc: '페이지 퇴거 준비', color: C.warn },
  { name: 'ELDU', desc: '페이지 복원', color: C.warn },
];

const SEV_INSTS: Inst[] = [
  { name: 'LAUNCH_START', desc: 'Guest 컨텍스트 초기화', color: C.sev },
  { name: 'LAUNCH_UPDATE_DATA', desc: '초기 메모리 암호화', color: C.sev },
  { name: 'LAUNCH_UPDATE_VMSA', desc: 'VCPU 상태 암호화 (ES)', color: C.sev },
  { name: 'LAUNCH_MEASURE', desc: 'Launch digest 생성', color: C.sev },
  { name: 'LAUNCH_SECRET', desc: 'Secret injection', color: C.sev },
  { name: 'LAUNCH_FINISH', desc: 'Guest 실행 시작', color: C.sev },
  { name: 'SNP_LAUNCH_START', desc: 'SNP 초기화', color: C.snp },
  { name: 'SNP_LAUNCH_UPDATE', desc: 'SNP 메모리 + RMP', color: C.snp },
  { name: 'SNP_LAUNCH_FINISH', desc: 'SNP 실행 시작', color: C.snp },
];

const TDX_INSTS: Inst[] = [
  { name: 'TDH.MNG.CREATE', desc: 'TD 생성', color: C.tdx },
  { name: 'TDH.MNG.ADDCX', desc: 'Control page 추가', color: C.tdx },
  { name: 'TDH.MEM.PAGE.ADD', desc: '메모리 추가 + 암호화', color: C.tdx },
  { name: 'TDH.MEM.PAGE.AUG', desc: '추가 페이지 동적 할당', color: C.tdx },
  { name: 'TDH.MR.EXTEND', desc: 'Measurement 확장', color: C.tdx },
  { name: 'TDH.MR.FINALIZE', desc: 'MRTD 확정', color: C.tdx },
  { name: 'TDH.VP.CREATE', desc: 'VCPU 생성', color: C.tdx },
  { name: 'TDH.VP.ENTER', desc: 'TD 진입', color: C.tdx },
  { name: 'TDH.VP.RD/WR', desc: 'VCPU state 읽기/쓰기', color: C.tdx },
];

function InstList({ insts, title, color }: { insts: Inst[]; title: string; color: string }) {
  const cols = 2;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>
      {insts.map((it, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 18 + col * 224;
        const y = 24 + row * 18;
        return (
          <motion.g key={it.name} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}>
            <rect x={x} y={y} width={216} height={16} rx={2}
              fill={`${it.color}10`} stroke={`${it.color}40`} strokeWidth={0.5} />
            <text x={x + 6} y={y + 11} fontSize={8.5} fontFamily="monospace" fontWeight={700} fill={it.color}>
              {it.name}
            </text>
            <text x={x + 110} y={y + 11} fontSize={7.5} fill={C.muted}>{it.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

interface Sec { tee: string; protect: string; integ: string; color: string; level: number; }

const SECS: Sec[] = [
  { tee: 'SGX', protect: 'EPC만 (128MB)', integ: 'MAC per line', color: C.sgx, level: 2 },
  { tee: 'SEV', protect: 'VM 전체', integ: '약함 (XEX only)', color: C.sev, level: 3 },
  { tee: 'SEV-SNP', protect: 'VM + 무결성', integ: 'RMP', color: C.snp, level: 4 },
  { tee: 'TDX', protect: 'TD + 무결성', integ: 'SEAM 강제', color: C.tdx, level: 4 },
];

function SecurityCompare() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        보안 강도 비교 (보호 범위 + 무결성)
      </text>
      {SECS.map((s, i) => {
        const y = 28 + i * 22;
        return (
          <motion.g key={s.tee} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={20} y={y} width={440} height={18} rx={3}
              fill={`${s.color}10`} stroke={`${s.color}50`} strokeWidth={0.6} />
            <text x={28} y={y + 12} fontSize={10} fontWeight={700} fill={s.color}>{s.tee}</text>
            <text x={110} y={y + 12} fontSize={9} fill="var(--foreground)">{s.protect}</text>
            <text x={250} y={y + 12} fontSize={9} fill={C.muted}>{s.integ}</text>
            {Array.from({ length: 5 }).map((_, k) => (
              <circle key={k} cx={400 + k * 12} cy={y + 9} r={4}
                fill={k < s.level ? s.color : 'var(--border)'}
                opacity={k < s.level ? 0.85 : 0.4} />
            ))}
          </motion.g>
        );
      })}
    </g>
  );
}

interface TradeOff { axis: string; sgx: string; sev: string; tdx: string; }

const TRADES: TradeOff[] = [
  { axis: '개발 난이도', sgx: '높음 (코드 분리)', sev: '낮음 (lift & shift)', tdx: '낮음' },
  { axis: '성능', sgx: 'EPC paging 병목', sev: 'VM 수준 격리', tdx: 'VM 수준 격리' },
  { axis: '생태계', sgx: 'Open Enclave·Gramine·SCONE', sev: 'AMD PSP·virtee', tdx: 'Intel TDX kernel' },
];

function TradeoffMatrix() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Dev · 성능 · 생태계 트레이드오프
      </text>
      <text x={140} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sgx}>SGX</text>
      <text x={260} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sev}>SEV</text>
      <text x={380} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.tdx}>TDX</text>
      {TRADES.map((t, i) => {
        const y = 42 + i * 28;
        return (
          <motion.g key={t.axis} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}>
            <text x={20} y={y + 12} fontSize={9.5} fontWeight={700} fill="var(--foreground)">{t.axis}</text>
            <rect x={80} y={y + 2} width={120} height={20} rx={3} fill={`${C.sgx}12`} stroke={`${C.sgx}40`} strokeWidth={0.5} />
            <text x={140} y={y + 14} textAnchor="middle" fontSize={7.5} fill={C.sgx}>{t.sgx}</text>
            <rect x={200} y={y + 2} width={120} height={20} rx={3} fill={`${C.sev}12`} stroke={`${C.sev}40`} strokeWidth={0.5} />
            <text x={260} y={y + 14} textAnchor="middle" fontSize={7.5} fill={C.sev}>{t.sev}</text>
            <rect x={320} y={y + 2} width={120} height={20} rx={3} fill={`${C.tdx}12`} stroke={`${C.tdx}40`} strokeWidth={0.5} />
            <text x={380} y={y + 14} textAnchor="middle" fontSize={7.5} fill={C.tdx}>{t.tdx}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function MemInstructionsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <InstList insts={SGX_INSTS} title="Intel SGX — 7개 명령어" color={C.sgx} />}
          {step === 1 && <InstList insts={SEV_INSTS} title="AMD SEV / SEV-SNP — 9개 명령어" color={C.sev} />}
          {step === 2 && <InstList insts={TDX_INSTS} title="Intel TDX — SEAMCALL 9개" color={C.tdx} />}
          {step === 3 && <SecurityCompare />}
          {step === 4 && <TradeoffMatrix />}
        </svg>
      )}
    </StepViz>
  );
}
