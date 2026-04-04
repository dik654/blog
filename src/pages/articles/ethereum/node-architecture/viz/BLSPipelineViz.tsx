import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'arch', label: '아키텍처' },
  { id: 'sign', label: '서명 흐름' },
  { id: 'agg', label: '집계 검증' },
] as const;

const archItems = [
  { label: 'GenericSecretKey', desc: '비밀키 (point: Sec)', color: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' },
  { label: 'GenericPublicKey', desc: '공개키 (point: Pub)', color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' },
  { label: 'GenericSignature', desc: '서명 (point, is_infinity)', color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' },
  { label: 'GenericAggregateSignature', desc: '집계 서명 (여러 서명 합산)', color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800' },
];

const signSteps = [
  { step: 'SecretKey::random()', desc: '안전한 엔트로피에서 비밀키 생성' },
  { step: 'sk.public_key()', desc: 'Sec::public_key()로 공개키 도출' },
  { step: 'sk.sign(msg)', desc: 'Hash256 메시지에 BLS 서명 생성' },
  { step: 'sig.verify(pk, msg)', desc: 'e(H(m), pk) == e(sig, G) 확인' },
];

const aggSteps = [
  { step: '개별 서명 수집', desc: '검증자별 BLS 서명 수집' },
  { step: 'AggSig::aggregate(sigs)', desc: '서명들의 곡선 점 합산' },
  { step: 'agg.fast_aggregate_verify', desc: '공개키 합산 후 단일 pairing 검증' },
];

export default function BLSPipelineViz() {
  const [tab, setTab] = useState<string>('arch');

  return (
    <div className="not-prose rounded-xl border bg-card p-5">
      <p className="text-sm font-semibold mb-3 text-foreground/80">BLS 암호학 파이프라인</p>
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
          {tab === 'arch' && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {archItems.map(a => (
                <div key={a.label} className={`rounded-lg border p-2.5 ${a.color}`}>
                  <p className="text-[11px] font-medium">{a.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'sign' && (
            <div className="flex flex-col gap-1.5">
              {signSteps.map((s, i) => (
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
          {tab === 'agg' && (
            <div className="flex flex-col gap-1.5">
              {aggSteps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] text-muted-foreground w-4 pt-0.5 shrink-0">{i + 1}</span>
                  <div className="rounded border px-3 py-1.5 flex-1">
                    <p className="text-[11px] font-mono font-medium">{s.step}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground mt-2">
                백엔드: supranational(BLST) — 프로덕션 | fake_crypto — 테스트
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
