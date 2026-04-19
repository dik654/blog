import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  ring0: '#ef4444',
  ring3: '#10b981',
  init: '#6366f1',
  page: '#f59e0b',
  exec: '#8b5cf6',
  attest: '#0ea5e9',
  sgx2: '#ec4899',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Privileged 명령어 12개 (Ring 0)',
    body: 'OS/VMM이 호출. ECREATE/EADD/EEXTEND/EINIT(라이프사이클), EWBLOCK/ELDU/EBLOCK(페이징), ETRACK(TLB), EPA(VA page), EPAGE/EREMOVE/EDBGWR/RD.',
  },
  {
    label: 'Unprivileged 명령어 8개 (Ring 3)',
    body: 'Enclave 내부 호출. EENTER/ERESUME/EEXIT(흐름), EGETKEY/EREPORT(보안), EACCEPT/EACCEPTCOPY/EMODPE(SGX2 동적).',
  },
  {
    label: 'SGX1 vs SGX2 차이',
    body: 'SGX1: 정적 enclave(초기화 후 변경 불가). SGX2: 동적 메모리 성장, runtime 권한 변경, thread 관리. 클라우드 워크로드 적합.',
  },
  {
    label: '커널 지원 현황',
    body: 'Linux: in-tree since 5.11 (2021). Windows: Win10 SDK 이후. Kubernetes: Confidential Containers (Intel SGX device plugin).',
  },
];

interface Inst { name: string; desc: string; group: string; color: string; }

const PRIV: Inst[] = [
  { name: 'ECREATE', desc: 'Enclave 생성 (SECS 초기화)', group: 'init', color: C.init },
  { name: 'EADD', desc: 'EPC 페이지 추가', group: 'init', color: C.init },
  { name: 'EEXTEND', desc: 'Measurement 업데이트', group: 'init', color: C.init },
  { name: 'EINIT', desc: 'Enclave 초기화 완료', group: 'init', color: C.init },
  { name: 'EREMOVE', desc: 'EPC 페이지 삭제', group: 'page', color: C.page },
  { name: 'EWBLOCK', desc: '페이지 퇴거 준비', group: 'page', color: C.page },
  { name: 'EPAGE', desc: '페이지 상태 수정', group: 'page', color: C.page },
  { name: 'ELDU/ELDB', desc: 'EPC 페이지 복원', group: 'page', color: C.page },
  { name: 'ETRACK', desc: 'TLB tracking', group: 'page', color: C.page },
  { name: 'EBLOCK', desc: 'Block EPC page', group: 'page', color: C.page },
  { name: 'EPA', desc: 'Version Array 페이지 생성', group: 'page', color: C.page },
  { name: 'EDBGWR/RD', desc: 'Debug I/O (debug only)', group: 'debug', color: C.muted },
];

const UNPRIV: Inst[] = [
  { name: 'EENTER', desc: 'Enclave 진입', group: 'exec', color: C.exec },
  { name: 'ERESUME', desc: 'AEX 후 재진입', group: 'exec', color: C.exec },
  { name: 'EEXIT', desc: 'Enclave 종료', group: 'exec', color: C.exec },
  { name: 'EGETKEY', desc: '하드웨어 키 파생', group: 'attest', color: C.attest },
  { name: 'EREPORT', desc: 'Local attestation report', group: 'attest', color: C.attest },
  { name: 'EACCEPT', desc: '페이지 허용 (SGX2)', group: 'sgx2', color: C.sgx2 },
  { name: 'EACCEPTCOPY', desc: '페이지 복사 (SGX2)', group: 'sgx2', color: C.sgx2 },
  { name: 'EMODPE', desc: '권한 확장 (SGX2)', group: 'sgx2', color: C.sgx2 },
];

function InstGrid({ insts, title, color, ring }: { insts: Inst[]; title: string; color: string; ring: string }) {
  const cols = 3;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {title} <tspan fill={C.muted} fontWeight={400}>· {ring}</tspan>
      </text>
      {insts.map((it, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 16 + col * 152;
        const y = 24 + row * 26;
        return (
          <motion.g key={it.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}>
            <rect x={x} y={y} width={144} height={22} rx={3}
              fill={`${it.color}10`} stroke={it.color} strokeWidth={0.6} />
            <text x={x + 6} y={y + 11} fontSize={8.5} fontFamily="monospace" fontWeight={700} fill={it.color}>
              {it.name}
            </text>
            <text x={x + 6} y={y + 19} fontSize={7} fill={C.muted}>{it.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

function Sgx1Vs2() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        SGX1 vs SGX2 — 정적 vs 동적
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={28} width={210} height={90} rx={6}
          fill={`${C.init}10`} stroke={C.init} strokeWidth={1} />
        <text x={125} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.init}>SGX1 — 정적</text>
        <text x={125} y={66} textAnchor="middle" fontSize={9} fill={C.muted}>EINIT 후 변경 불가</text>
        <text x={125} y={82} textAnchor="middle" fontSize={9} fill={C.muted}>고정 페이지 수</text>
        <text x={125} y={98} textAnchor="middle" fontSize={9} fill={C.muted}>고정 권한</text>
        <text x={125} y={112} textAnchor="middle" fontSize={8.5} fill={C.init}>예측 가능, 단순</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={250} y={28} width={210} height={90} rx={6}
          fill={`${C.sgx2}10`} stroke={C.sgx2} strokeWidth={1} />
        <text x={355} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sgx2}>SGX2 — 동적</text>
        <text x={355} y={66} textAnchor="middle" fontSize={9} fill={C.muted}>Dynamic memory growth</text>
        <text x={355} y={82} textAnchor="middle" fontSize={9} fill={C.muted}>Runtime 권한 변경</text>
        <text x={355} y={98} textAnchor="middle" fontSize={9} fill={C.muted}>Thread 관리</text>
        <text x={355} y={112} textAnchor="middle" fontSize={8.5} fill={C.sgx2}>클라우드 워크로드 적합</text>
      </motion.g>
    </g>
  );
}

const KERNELS = [
  { name: 'Linux', detail: 'in-tree since 5.11 (2021)', color: '#0ea5e9' },
  { name: 'Windows', detail: 'Win10 SDK 이후', color: '#06b6d4' },
  { name: 'Kubernetes', detail: 'Confidential Containers + SGX device plugin', color: '#22c55e' },
];

function KernelSupport() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        커널 / 오케스트레이션 지원
      </text>
      {KERNELS.map((k, i) => (
        <motion.g key={k.name} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={20} y={30 + i * 32} width={440} height={26} rx={5}
            fill={`${k.color}10`} stroke={k.color} strokeWidth={0.8} />
          <text x={32} y={48 + i * 32} fontSize={11} fontWeight={700} fill={k.color}>{k.name}</text>
          <text x={130} y={48 + i * 32} fontSize={9.5} fill={C.muted}>{k.detail}</text>
        </motion.g>
      ))}
    </g>
  );
}

export default function SgxInstructionsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <InstGrid insts={PRIV} title="Privileged" color={C.ring0} ring="ring 0 (OS/VMM)" />}
          {step === 1 && <InstGrid insts={UNPRIV} title="Unprivileged" color={C.ring3} ring="ring 3 (enclave 내부)" />}
          {step === 2 && <Sgx1Vs2 />}
          {step === 3 && <KernelSupport />}
        </svg>
      )}
    </StepViz>
  );
}
