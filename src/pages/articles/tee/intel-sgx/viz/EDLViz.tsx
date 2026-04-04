import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CT = '#10b981', CU = '#f59e0b', CA = '#6366f1';
const STEPS = [
  { label: 'EDL 파일: trusted / untrusted 영역', body: 'enclave {} 블록 안에 trusted(ECALL)와 untrusted(OCALL) 두 섹션. Edger8r가 마샬링 코드 자동 생성.' },
  { label: 'ECALL: [in] / [out] 데이터 복사 방향', body: '[in, size=len]: 호스트 → EPC 복사. [out, size=len]: 엔클레이브 → 호스트. 크기 명시로 오버플로 방지.' },
  { label: 'OCALL: 엔클레이브 → 호스트 호출', body: '[in, string]: 엔클레이브 문자열 → 호스트 복사. 호스트 반환값은 항상 검증 필요.' },
  { label: 'Edger8r 코드 생성', body: 'EDL → Enclave_t.c + Enclave_u.c. 포인터 방향·크기 검증 코드 자동 삽입.' },
];

const Box = ({ x, y, w, h, c, label }: { x: number; y: number; w: number; h: number; c: string; label: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={5} fill={`${c}10`} stroke={c} strokeWidth={1} />
    <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={c}>{label}</text>
  </g>);

const Arrow = ({ x1, y1, x2, y2, c, label }: { x1: number; y1: number; x2: number; y2: number; c: string; label: string }) => (
  <g>
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={1.2} markerEnd="url(#edlArr)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <rect x={(x1 + x2) / 2 - 30} y={(y1 + y2) / 2 - 8} width={60} height={14} rx={3} fill="var(--card)" />
    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 3} textAnchor="middle" fontSize={9} fontWeight={500} fill={c}>{label}</text>
  </g>);

export default function EDLViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs><marker id="edlArr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" /></marker></defs>
          {step === 0 && (<motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x={30} y={10} width={200} height={170} rx={6} fill={`${CT}06`} stroke={CT} strokeWidth={1} strokeDasharray="4,2" />
            <text x={130} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={CT}>trusted {'{}'}</text>
            <text x={130} y={48} textAnchor="middle" fontSize={10} fill="var(--foreground)">ECALL 함수 정의</text>
            <rect x={50} y={58} width={160} height={24} rx={4} fill={`${CT}12`} stroke={CT} strokeWidth={0.6} />
            <text x={130} y={74} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={CT}>ecall_encrypt()</text>
            <rect x={270} y={10} width={200} height={170} rx={6} fill={`${CU}06`} stroke={CU} strokeWidth={1} strokeDasharray="4,2" />
            <text x={370} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={CU}>untrusted {'{}'}</text>
            <text x={370} y={48} textAnchor="middle" fontSize={10} fill="var(--foreground)">OCALL 함수 정의</text>
            <rect x={290} y={58} width={160} height={24} rx={4} fill={`${CU}12`} stroke={CU} strokeWidth={0.6} />
            <text x={370} y={74} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={CU}>ocall_print_string()</text>
            <rect x={290} y={90} width={160} height={24} rx={4} fill={`${CU}12`} stroke={CU} strokeWidth={0.6} />
            <text x={370} y={106} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={CU}>ocall_get_time()</text>
            <text x={250} y={158} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Edger8r가 EDL → 마샬링 코드 자동 생성</text>
          </motion.g>)}
          {step === 1 && (<motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box x={20} y={20} w={140} h={70} c={CU} label="Host (비신뢰)" />
            <text x={90} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">plaintext 버퍼</text>
            <text x={90} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">ciphertext 버퍼</text>
            <Box x={320} y={20} w={150} h={70} c={CT} label="Enclave (신뢰)" />
            <text x={395} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">EPC 내부 복사본</text>
            <text x={395} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">암호화 수행</text>
            <Arrow x1={160} y1={45} x2={320} y2={45} c={CA} label="[in] 복사 →" />
            <Arrow x1={320} y1={70} x2={160} y2={70} c="#ef4444" label="← [out] 복사" />
            <rect x={100} y={120} width={280} height={50} rx={5} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
            <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={500} fill={CA}>ecall_encrypt()</text>
            <text x={240} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">[in, size=len] plaintext → [out, size=len] ciphertext</text>
          </motion.g>)}
          {step === 2 && (<motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box x={20} y={20} w={150} h={70} c={CT} label="Enclave (신뢰)" />
            <text x={95} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">로그 문자열 생성</text>
            <text x={95} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시간 값 필요</text>
            <Box x={320} y={20} w={150} h={70} c={CU} label="Host (비신뢰)" />
            <text x={395} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">printf() 실행</text>
            <text x={395} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">time() 호출</text>
            <Arrow x1={170} y1={45} x2={320} y2={45} c={CU} label="[in, string] →" />
            <Arrow x1={320} y1={70} x2={170} y2={70} c={CT} label="← [out] time_t" />
            <rect x={60} y={120} width={370} height={24} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} />
            <text x={245} y={136} textAnchor="middle" fontSize={9} fill="#ef4444">주의: 호스트 반환값은 항상 비신뢰 — 엔클레이브 내부에서 검증 필수</text>
          </motion.g>)}
          {step === 3 && (<motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box x={160} y={10} w={160} h={30} c={CA} label="Enclave.edl" />
            <line x1={240} y1={40} x2={140} y2={65} stroke="var(--border)" strokeWidth={0.6} />
            <line x1={240} y1={40} x2={340} y2={65} stroke="var(--border)" strokeWidth={0.6} />
            <Box x={40} y={65} w={190} h={50} c={CT} label="Enclave_t.c (엔클레이브 측)" />
            <text x={135} y={95} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">포인터 검증 + EPC 내 복사</text>
            <Box x={270} y={65} w={190} h={50} c={CU} label="Enclave_u.c (호스트 측)" />
            <text x={365} y={95} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">크기 검증 + 마샬링 코드</text>
            <text x={250} y={145} textAnchor="middle" fontSize={10} fill={CA}>Edger8r가 [in]/[out]/[size] 속성으로 검증 코드 자동 생성</text>
            <text x={250} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">수동 마샬링 실수 제거 — 버퍼 오버플로·방향 오류 방지</text>
          </motion.g>)}
        </svg>
      )}
    </StepViz>
  );
}
