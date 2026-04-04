import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'struct', label: '데이터 구조' },
  { id: 'flow', label: '커밋 흐름' },
  { id: 'verify', label: '검증' },
] as const;

const structs = [
  { label: 'Blob', desc: '128KB 데이터 (4096 필드 원소)', color: 'bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800' },
  { label: 'KzgCommitment', desc: '48B BLS12-381 G1 포인트', color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' },
  { label: 'KzgProof', desc: '48B 평가 증명', color: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' },
  { label: 'TrustedSetup', desc: 'G1/G2 SRS 포인트 로딩', color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800' },
];

const flowSteps = [
  { step: 'Blob 생성', desc: 'L2 트랜잭션 데이터를 4096 필드 원소로 인코딩' },
  { step: 'KZG 커밋', desc: 'blob_to_kzg_commitment()으로 G1 포인트 생성' },
  { step: '증명 생성', desc: 'compute_blob_kzg_proof()로 평가 증명 계산' },
  { step: '블록 포함', desc: 'BlobSidecar에 blob + commitment + proof 첨부' },
];

const verifySteps = [
  { step: 'verify_blob_kzg_proof', desc: '단일 blob의 커밋먼트-증명 쌍 검증' },
  { step: 'verify_blob_kzg_proof_batch', desc: '여러 blob을 배치 검증 (random linear combination)' },
  { step: 'PeerDAS Cell 증명', desc: 'compute_cells_and_kzg_proofs로 DAS 샘플링 지원' },
];

export default function KZGBlobViz() {
  const [tab, setTab] = useState<string>('struct');

  return (
    <div className="not-prose rounded-xl border bg-card p-5">
      <p className="text-sm font-semibold mb-3 text-foreground/80">KZG 커밋먼트 & Blob 파이프라인</p>
      <div className="flex gap-1 mb-4 p-1 rounded-lg border border-border w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer font-medium
              ${tab === t.id ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'struct' && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {structs.map(s => (
                <div key={s.label} className={`rounded-lg border p-2.5 ${s.color}`}>
                  <p className="text-[11px] font-medium">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'flow' && (
            <div className="flex flex-col gap-1.5">
              {flowSteps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] text-muted-foreground w-4 pt-0.5 shrink-0">{i + 1}</span>
                  <div className="rounded border px-3 py-1.5 flex-1">
                    <p className="text-[11px] font-mono font-medium">{s.step}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'verify' && (
            <div className="flex flex-col gap-1.5">
              {verifySteps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] text-muted-foreground w-4 pt-0.5 shrink-0">{i + 1}</span>
                  <div className="rounded border px-3 py-1.5 flex-1">
                    <p className="text-[11px] font-mono font-medium">{s.step}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
