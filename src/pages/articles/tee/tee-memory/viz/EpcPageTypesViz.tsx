import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  secs: '#6366f1',
  reg: '#10b981',
  tcs: '#f59e0b',
  va: '#8b5cf6',
  sgx2: '#ec4899',
  epcm: '#14b8a6',
  inst: '#06b6d4',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'EPC 페이지 7가지 타입 (PT 필드)',
    body: 'PT_SECS(메타) · PT_REG(코드/데이터) · PT_TCS(스레드 진입점) · PT_VA(페이징 nonce) · PT_TRIM/PT_SS_*(SGX2 동적).',
  },
  {
    label: 'EPCM 엔트리 8 bytes 필드',
    body: 'VALID, R/W/X 권한, PT(타입), ENCLAVE_SECS(소유자 PA), ADDRESS(가상 주소), BLOCKED, PENDING(SGX2). EPC 페이지마다 1개.',
  },
  {
    label: 'SGX 명령어 11개 — Enclave 라이프사이클',
    body: 'ECREATE → EADD → EEXTEND → EINIT → EENTER → EEXIT. 페이징은 EWBLOCK ↔ ELDU. SGX2는 EMODPR/EMODT로 동적 변경.',
  },
];

interface PageType {
  pt: string;
  code: number;
  name: string;
  desc: string;
  count: string;
  color: string;
  sgx2?: boolean;
}

const PAGE_TYPES: PageType[] = [
  { pt: 'PT_SECS', code: 0, name: 'SGX Enclave Control Structure', desc: 'MRENCLAVE, MRSIGNER, ATTRS, ISVPRODID, ISVSVN', count: 'enclave당 1개', color: C.secs },
  { pt: 'PT_REG', code: 1, name: 'Regular Page', desc: '일반 코드/데이터, RWX 권한 설정', count: '대부분의 메모리', color: C.reg },
  { pt: 'PT_TCS', code: 2, name: 'Thread Control Structure', desc: 'EENTER 진입점, 스레드 컨텍스트', count: '스레드별 1개', color: C.tcs },
  { pt: 'PT_VA', code: 3, name: 'Version Array', desc: '페이징 시 nonce 저장, anti-replay', count: '페이징 그룹별', color: C.va },
  { pt: 'PT_TRIM', code: 4, name: 'Trimmed (SGX2)', desc: '트림된 페이지', count: 'dynamic', color: C.sgx2, sgx2: true },
  { pt: 'PT_SS_FIRST', code: 5, name: 'State save area first (SGX2)', desc: '상태 저장 영역 시작', count: 'AEX 시', color: C.sgx2, sgx2: true },
  { pt: 'PT_SS_REST', code: 6, name: 'State save area rest (SGX2)', desc: '상태 저장 영역 나머지', count: 'AEX 시', color: C.sgx2, sgx2: true },
];

function PageTypeGrid() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">EPC Page Types — EPCM의 PT 필드</text>
      {PAGE_TYPES.map((p, i) => {
        const y = 24 + i * 16;
        return (
          <motion.g key={p.pt} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}>
            <rect x={20} y={y} width={440} height={14} rx={2}
              fill={`${p.color}10`} stroke={`${p.color}50`} strokeWidth={0.5} />
            <text x={28} y={y + 10} fontSize={9} fontFamily="monospace" fontWeight={700} fill={p.color}>
              {p.pt} ({p.code})
            </text>
            <text x={130} y={y + 10} fontSize={8.5} fontWeight={600} fill="var(--foreground)">{p.name}</text>
            <text x={310} y={y + 10} fontSize={7.5} fill={C.muted}>{p.desc}</text>
            {p.sgx2 && (
              <rect x={444} y={y + 2} width={12} height={10} rx={2} fill={`${C.sgx2}40`} />
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

interface EpcmField { name: string; desc: string; bits: number; color: string; }

const EPCM_FIELDS: EpcmField[] = [
  { name: 'VALID', desc: '유효 비트', bits: 1, color: C.epcm },
  { name: 'R/W/X', desc: '권한 비트', bits: 3, color: C.reg },
  { name: 'PT', desc: '페이지 타입 (4-bit)', bits: 4, color: C.secs },
  { name: 'ENCLAVE_SECS', desc: '소유 enclave PA', bits: 40, color: C.tcs },
  { name: 'ADDRESS', desc: '가상 주소 매핑', bits: 8, color: C.va },
  { name: 'BLOCKED', desc: '퇴거 준비 중', bits: 1, color: '#ef4444' },
  { name: 'PENDING', desc: 'SGX2 동적 페이지', bits: 1, color: C.sgx2 },
];

function EpcmStruct() {
  const total = EPCM_FIELDS.reduce((s, f) => s + f.bits, 0);
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.epcm}>
        EPCM Entry — 8 bytes per EPC page
      </text>
      {/* Bit layout */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {(() => {
          let off = 0;
          return EPCM_FIELDS.map((f, i) => {
            const w = (f.bits / total) * 440;
            const x = 20 + off;
            off += w;
            return (
              <g key={f.name}>
                <rect x={x} y={26} width={w - 1} height={20} rx={2}
                  fill={f.color} opacity={0.85} />
                <text x={x + w / 2} y={40} textAnchor="middle" fontSize={7.5}
                  fontWeight={700} fill="#fff">{f.bits}</text>
                <line x1={x + w / 2} y1={48} x2={x + w / 2} y2={56 + (i % 2) * 8}
                  stroke={f.color} strokeWidth={0.5} />
                <text x={x + w / 2} y={66 + (i % 2) * 8} textAnchor="middle"
                  fontSize={7.5} fontWeight={700} fill={f.color}>{f.name}</text>
              </g>
            );
          });
        })()}
      </motion.g>
      {/* Field descriptions */}
      {EPCM_FIELDS.map((f, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 20 + col * 220;
        const y = 88 + row * 14;
        return (
          <motion.g key={`d-${f.name}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}>
            <circle cx={x + 4} cy={y + 5} r={3} fill={f.color} />
            <text x={x + 12} y={y + 8} fontSize={7.5} fontWeight={600} fill={f.color}>{f.name}:</text>
            <text x={x + 76} y={y + 8} fontSize={7.5} fill={C.muted}>{f.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

interface Inst { name: string; desc: string; group: string; color: string; }

const INSTS: Inst[] = [
  { name: 'ECREATE', desc: 'SECS 생성', group: 'init', color: C.secs },
  { name: 'EADD', desc: 'REG/TCS 페이지 추가', group: 'init', color: C.reg },
  { name: 'EEXTEND', desc: 'measurement 업데이트', group: 'init', color: C.tcs },
  { name: 'EINIT', desc: 'enclave 완성', group: 'init', color: C.va },
  { name: 'EENTER', desc: 'enclave 진입 (TCS)', group: 'exec', color: C.epcm },
  { name: 'EEXIT', desc: 'enclave 종료', group: 'exec', color: C.epcm },
  { name: 'EWBLOCK', desc: '페이지 퇴거 준비', group: 'page', color: '#ef4444' },
  { name: 'ELDU', desc: '페이지 복원', group: 'page', color: C.reg },
  { name: 'ERDINFO', desc: '페이지 정보 조회', group: 'page', color: C.muted },
  { name: 'EMODPR', desc: '권한 수정 (SGX2)', group: 'sgx2', color: C.sgx2 },
  { name: 'EMODT', desc: '타입 변경 (SGX2)', group: 'sgx2', color: C.sgx2 },
];

function InstructionList() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">SGX Instructions — Enclave 라이프사이클</text>
      {INSTS.map((inst, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 18 + col * 116;
        const y = 24 + row * 30;
        return (
          <motion.g key={inst.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}>
            <rect x={x} y={y} width={108} height={24} rx={4}
              fill={`${inst.color}12`} stroke={inst.color} strokeWidth={0.7} />
            <text x={x + 54} y={y + 11} textAnchor="middle" fontSize={9}
              fontFamily="monospace" fontWeight={700} fill={inst.color}>{inst.name}</text>
            <text x={x + 54} y={y + 20} textAnchor="middle" fontSize={7} fill={C.muted}>{inst.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function EpcPageTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <PageTypeGrid />}
          {step === 1 && <EpcmStruct />}
          {step === 2 && <InstructionList />}
        </svg>
      )}
    </StepViz>
  );
}
