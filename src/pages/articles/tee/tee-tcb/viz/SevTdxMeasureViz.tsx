import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  sev: '#ef4444',
  tdx: '#3b82f6',
  sgx: '#10b981',
  hash: '#f59e0b',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'AMD SEV: HMAC 기반 launch measurement',
    body: 'PSP가 VEK로 HMAC. 입력은 0x04 || api 버전 || policy || guest 페이지 SHA-256 || mnonce. mnonce가 replay 방어.',
  },
  {
    label: 'Intel TDX: SHA-384 chain (MRTD)',
    body: '메모리 chunk마다 MRTD = SHA-384(MRTD || metadata || data). TDH.MR.FINALIZE로 freeze. Runtime 측정은 RTMR[0-3]에 별도 누적.',
  },
  {
    label: '공통점: HW 계산 + replay 방어',
    body: '모두 SHA-256/384 해시 체인, 하드웨어가 직접 계산(SW 개입 불가), nonce/random 으로 replay 방어, attestation report에 포함.',
  },
  {
    label: 'Granularity 비교: SGX > TDX > SEV',
    body: 'SGX는 256B 청크(fine), TDX는 page+metadata(mid), SEV는 전체 guest memory(coarse). Granularity가 작을수록 변조 검출 정밀.',
  },
];

function SevFlow() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sev}>
        AMD SEV LAUNCH_MEASURE
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={26} width={440} height={26} rx={4}
          fill={`${C.sev}10`} stroke={C.sev} strokeWidth={1} />
        <text x={240} y={43} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fontWeight={700} fill={C.sev}>
          MEASURE = HMAC(VEK, ...)
        </text>
      </motion.g>
      {[
        { l: '0x04 || api_major || api_minor || build', y: 64 },
        { l: '|| policy', y: 80 },
        { l: '|| digest = SHA-256(LAUNCH_UPDATE_DATA pages)', y: 96 },
        { l: '|| mnonce  /* replay 방어 */', y: 112 },
      ].map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}>
          <text x={50} y={r.y} fontSize={9} fontFamily="monospace" fill={C.sev}>{r.l}</text>
        </motion.g>
      ))}
    </g>
  );
}

function TdxFlow() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tdx}>
        Intel TDX MRTD (Measurement of TD)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={26} width={440} height={26} rx={4}
          fill={`${C.tdx}10`} stroke={C.tdx} strokeWidth={1} />
        <text x={240} y={43} textAnchor="middle" fontSize={9} fontFamily="monospace" fontWeight={600} fill={C.tdx}>
          MRTD ← SHA-384(MRTD || chunk_metadata || chunk_data)  /* per chunk */
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={60} width={210} height={50} rx={5}
          fill={`${C.tdx}10`} stroke={C.tdx} strokeWidth={0.8} />
        <text x={125} y={76} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.tdx}>
          TDH.MR.FINALIZE
        </text>
        <text x={125} y={90} textAnchor="middle" fontSize={8} fill={C.muted}>MRTD frozen</text>
        <text x={125} y={102} textAnchor="middle" fontSize={8} fill={C.muted}>이후 attestation 가능</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={250} y={60} width={210} height={50} rx={5}
          fill={`${C.hash}10`} stroke={C.hash} strokeWidth={0.8} />
        <text x={355} y={76} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.hash}>
          RTMR[0-3]
        </text>
        <text x={355} y={90} textAnchor="middle" fontSize={8} fill={C.muted}>Runtime measurements</text>
        <text x={355} y={102} textAnchor="middle" fontSize={8} fill={C.muted}>TPM PCR과 유사 — 동적 누적</text>
      </motion.g>
    </g>
  );
}

const COMMON = [
  { label: 'SHA-256 / SHA-384 해시 체인', color: C.hash },
  { label: '하드웨어가 직접 계산 (SW 개입 불가)', color: C.tdx },
  { label: 'nonce / random → replay 방어', color: C.sev },
  { label: 'Attestation report 에 포함', color: C.sgx },
];

function CommonProps() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        SGX · SEV · TDX 공통 원칙
      </text>
      {COMMON.map((it, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20} y={28 + i * 24} width={440} height={20} rx={4}
            fill={`${it.color}12`} stroke={it.color} strokeWidth={0.8} />
          <circle cx={32} cy={38 + i * 24} r={4} fill={it.color} />
          <text x={45} y={42 + i * 24} fontSize={10} fontWeight={600} fill={it.color}>{it.label}</text>
        </motion.g>
      ))}
    </g>
  );
}

const GRANS = [
  { name: 'SGX', desc: '256B chunk × 16 per page', size: 256, color: C.sgx, level: 'fine' },
  { name: 'TDX', desc: 'page (4KB) + metadata', size: 4096, color: C.tdx, level: 'mid' },
  { name: 'SEV', desc: '전체 guest memory', size: 65536, color: C.sev, level: 'coarse' },
];

function GranularityCompare() {
  const maxLog = Math.log2(65536);
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Measurement Granularity 비교
      </text>
      {GRANS.map((g, i) => {
        const y = 30 + i * 30;
        const w = 60 + (Math.log2(g.size) / maxLog) * 280;
        return (
          <motion.g key={g.name} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <text x={50} y={y + 12} textAnchor="end" fontSize={11} fontWeight={700} fill={g.color}>
              {g.name}
            </text>
            <motion.rect x={60} y={y + 2} height={20} rx={4}
              fill={g.color} opacity={0.85}
              initial={{ width: 0 }} animate={{ width: w }}
              transition={{ delay: 0.05 + i * 0.12, duration: 0.4 }} />
            <text x={70} y={y + 16} fontSize={9} fontWeight={600} fill="#fff">{g.level}</text>
            <text x={70 + w + 8} y={y + 16} fontSize={8.5} fill={C.muted}>{g.desc}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={120} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        granularity 작음 ↔ 변조 검출 정밀
      </motion.text>
    </g>
  );
}

export default function SevTdxMeasureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SevFlow />}
          {step === 1 && <TdxFlow />}
          {step === 2 && <CommonProps />}
          {step === 3 && <GranularityCompare />}
        </svg>
      )}
    </StepViz>
  );
}
