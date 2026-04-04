import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Reth: StateProvider → MDBX 직접 읽기', body: 'db.get(keccak(addr)) → Account 즉시 반환' },
  { label: 'Helios: ProofDB 생성 (RPC + block)', body: 'ProofDB::new(&rpc, block_tag)로 가상 DB 초기화' },
  { label: 'ProofDB: get_proof() → MPT 검증', body: 'Database trait의 basic() 호출 시 증명 요청 + 검증' },
  { label: 'revm이 ProofDB를 일반 DB처럼 사용', body: 'Evm::builder().with_db(proof_db) — 인터페이스 동일' },
];

const C = { reth: '#f59e0b', helios: '#6366f1', proof: '#10b981' };

export default function ProofDbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={50} y={45} width={160} height={40} rx={8} fill={C.reth + '15'} stroke={C.reth} strokeWidth={1.5} />
              <text x={130} y={70} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.reth}>StateProvider</text>
              <motion.line x1={210} y1={65} x2={260} y2={65} stroke={C.reth} strokeWidth={1.5} strokeOpacity={0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <rect x={260} y={45} width={160} height={40} rx={8} fill={C.reth + '15'} stroke={C.reth} strokeWidth={1.5} />
              <text x={340} y={70} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.reth}>MDBX (disk)</text>
              <text x={240} y={120} textAnchor="middle" fontSize={10} fill={C.reth} fillOpacity={0.5}>풀노드 전용 — 로컬 디스크 필수</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={120} y={40} width={240} height={44} rx={8} fill={C.helios + '15'} stroke={C.helios} strokeWidth={1.5} />
              <text x={240} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.helios}>ProofDB::new(&rpc, block)</text>
              <text x={240} y={74} textAnchor="middle" fontSize={10} fill={C.helios} fillOpacity={0.6}>RPC 클라이언트 + 블록 태그 저장</text>
              <text x={240} y={120} textAnchor="middle" fontSize={10} fill={C.helios} fillOpacity={0.5}>디스크 없이 메모리에서 동작</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['basic() 호출', 'get_proof()', 'verify_proof()'].map((t, i) => {
                const c = [C.helios, C.proof, C.proof][i];
                return (
                  <g key={t}>
                    <rect x={30 + i * 150} y={50} width={120} height={36} rx={8} fill={c + '15'} stroke={c} strokeWidth={1.5} />
                    <text x={90 + i * 150} y={73} textAnchor="middle" fontSize={10} fontWeight={600} fill={c}>{t}</text>
                    {i < 2 && <line x1={150 + i * 150} y1={68} x2={180 + i * 150} y2={68} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />}
                  </g>
                );
              })}
              <text x={240} y={115} textAnchor="middle" fontSize={10} fill={C.proof} fillOpacity={0.5}>매 접근마다 증명 검증 — 거짓 응답 차단</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={60} y={35} width={360} height={50} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} />
              <text x={240} y={28} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>revm::Evm</text>
              <rect x={80} y={42} width={140} height={36} rx={6} fill={C.helios + '15'} stroke={C.helios} strokeWidth={1.5} />
              <text x={150} y={65} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.helios}>ProofDB</text>
              <rect x={260} y={42} width={140} height={36} rx={6} fill={C.reth + '15'} stroke={C.reth} strokeWidth={1.5} />
              <text x={330} y={65} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.reth}>TxEnv</text>
              <text x={240} y={115} textAnchor="middle" fontSize={10} fill={C.helios} fillOpacity={0.5}>Database trait 구현 → revm과 동일 인터페이스</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
