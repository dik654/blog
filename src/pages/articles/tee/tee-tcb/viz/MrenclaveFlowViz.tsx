import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  ecreate: '#6366f1',
  eadd: '#10b981',
  eextend: '#f59e0b',
  einit: '#ec4899',
  attest: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'ECREATE: 해시 컨텍스트 초기화',
    body: 'SECS(SGX Enclave Control Structure) 정보를 SHA-256 컨텍스트에 첫 입력. ssa_frame_size, size, reserved 필드 포함.',
  },
  {
    label: 'EADD: 페이지별 메타데이터 누적',
    body: '각 EPC 페이지마다 type(REG/TCS), offset, secinfo.flags(권한)을 해시. 페이지 종류와 권한이 measurement에 반영됩니다.',
  },
  {
    label: 'EEXTEND: 4KB 페이지 → 256B × 16',
    body: '한 페이지를 256바이트 청크 16개로 나눠 각각 EEXTEND. fine-grained → 1바이트 변경도 정확히 반영. SEV/TDX보다 세밀.',
  },
  {
    label: 'EINIT: MRENCLAVE 확정',
    body: 'H.finalize() → 256-bit MRENCLAVE. 이후 freeze. SIGSTRUCT의 MRSIGNER(서명자 키 SHA-256)와 함께 enclave identity 형성.',
  },
  {
    label: 'Attestation 시 검증 항목',
    body: '1) MRENCLAVE 2) MRSIGNER 3) ISVSVN(최소 버전) 4) Debug flag 5) Quoting Enclave 서명 6) IAS/DCAP report 서명 — 6단계 모두 통과해야 신뢰.',
  },
];

interface CodeLine { l: string; c: string; }

const ECREATE_LINES: CodeLine[] = [
  { l: '// SHA-256 컨텍스트 초기화', c: 'comment' },
  { l: 'H = SHA256.init()', c: 'init' },
  { l: '// SECS 메타데이터 입력', c: 'comment' },
  { l: 'H.update("ECREATE\\0\\0\\0\\0\\0\\0\\0\\0")', c: 'data' },
  { l: 'H.update(ssa_frame_size /* 4B */)', c: 'data' },
  { l: 'H.update(size /* 8B */ + reserved /* 44B */)', c: 'data' },
];

const EADD_LINES: CodeLine[] = [
  { l: '// 페이지마다 EADD 호출', c: 'comment' },
  { l: 'H.update("EADD\\0\\0\\0\\0")', c: 'data' },
  { l: 'H.update(offset /* 8B */)', c: 'data' },
  { l: 'H.update(secinfo.flags /* 8B, RWX */)', c: 'data' },
  { l: 'H.update(reserved /* 40B */)', c: 'data' },
  { l: 'H.update(page_info.type)  // REG=1, TCS=2', c: 'data' },
];

const EEXTEND_LINES: CodeLine[] = [
  { l: '// 4KB 페이지를 256B × 16회로 분할', c: 'comment' },
  { l: 'for i in range(16):', c: 'loop' },
  { l: '    H.update("EEXTEND\\0")', c: 'data' },
  { l: '    H.update(offset + i*256 /* 8B */)', c: 'data' },
  { l: '    H.update(reserved /* 48B */)', c: 'data' },
  { l: '    H.update(source_page[i*256 : (i+1)*256])', c: 'data' },
];

const COLOR_MAP = {
  comment: C.muted,
  init: C.ecreate,
  data: C.eadd,
  loop: C.eextend,
};

function CodeBlock({ title, color, lines }: { title: string; color: string; lines: CodeLine[] }) {
  return (
    <g>
      <text x={20} y={14} fontSize={11} fontWeight={700} fill={color}>{title}</text>
      {lines.map((ln, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}>
          <rect x={20} y={22 + i * 17} width={440} height={15} rx={2}
            fill={`${COLOR_MAP[ln.c as keyof typeof COLOR_MAP]}10`}
            stroke={`${COLOR_MAP[ln.c as keyof typeof COLOR_MAP]}30`} strokeWidth={0.4} />
          <text x={28} y={33 + i * 17} fontSize={8.5} fontFamily="monospace"
            fontWeight={500} fill={COLOR_MAP[ln.c as keyof typeof COLOR_MAP]}>
            {ln.l}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function EinitFinal() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.einit}>
        EINIT — MRENCLAVE 확정
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={60} y={26} width={360} height={26} rx={4}
          fill={`${C.einit}12`} stroke={C.einit} strokeWidth={1} />
        <text x={240} y={43} textAnchor="middle" fontSize={10} fontFamily="monospace"
          fontWeight={700} fill={C.einit}>
          MRENCLAVE = H.finalize()  // SHA-256 256-bit
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={64} width={210} height={56} rx={5}
          fill={`${C.einit}10`} stroke={C.einit} strokeWidth={0.8} />
        <text x={125} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.einit}>MRENCLAVE</text>
        <text x={125} y={94} textAnchor="middle" fontSize={8.5} fill={C.muted}>코드+데이터 SHA-256 지문</text>
        <text x={125} y={108} textAnchor="middle" fontSize={8.5} fill={C.muted}>정확한 enclave version</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={250} y={64} width={210} height={56} rx={5}
          fill={`${C.attest}10`} stroke={C.attest} strokeWidth={0.8} />
        <text x={355} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.attest}>MRSIGNER</text>
        <text x={355} y={94} textAnchor="middle" fontSize={8.5} fill={C.muted}>SIGSTRUCT 서명자 pubkey SHA-256</text>
        <text x={355} y={108} textAnchor="middle" fontSize={8.5} fill={C.muted}>버전 업그레이드 가능</text>
      </motion.g>
    </g>
  );
}

function AttestChecks() {
  const checks = [
    { n: '1', label: 'MRENCLAVE', desc: '코드 정확성', c: C.ecreate },
    { n: '2', label: 'MRSIGNER', desc: 'author identity', c: C.eadd },
    { n: '3', label: 'ISVSVN', desc: '최소 보안 버전', c: C.eextend },
    { n: '4', label: 'Debug flag', desc: 'production?', c: C.einit },
    { n: '5', label: 'QE signature', desc: 'Quoting Enclave', c: C.attest },
    { n: '6', label: 'Report signature', desc: 'IAS / DCAP', c: '#14b8a6' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Attestation 검증 6단계 — 모두 통과해야 신뢰</text>
      {checks.map((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 150;
        const y = 26 + row * 42;
        return (
          <motion.g key={c.n} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={y} width={140} height={36} rx={5}
              fill={`${c.c}10`} stroke={c.c} strokeWidth={0.8} />
            <circle cx={x + 14} cy={y + 18} r={9} fill={c.c} />
            <text x={x + 14} y={y + 22} textAnchor="middle" fontSize={10}
              fontWeight={700} fill="#fff">{c.n}</text>
            <text x={x + 30} y={y + 16} fontSize={9} fontWeight={700} fill={c.c}>{c.label}</text>
            <text x={x + 30} y={y + 28} fontSize={7.5} fill={C.muted}>{c.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function MrenclaveFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <CodeBlock title="ECREATE — SHA-256 init" color={C.ecreate} lines={ECREATE_LINES} />}
          {step === 1 && <CodeBlock title="EADD — 페이지 메타데이터" color={C.eadd} lines={EADD_LINES} />}
          {step === 2 && <CodeBlock title="EEXTEND — 256B 청크 ×16" color={C.eextend} lines={EEXTEND_LINES} />}
          {step === 3 && <EinitFinal />}
          {step === 4 && <AttestChecks />}
        </svg>
      )}
    </StepViz>
  );
}
