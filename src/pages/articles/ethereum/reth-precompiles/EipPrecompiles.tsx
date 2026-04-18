import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import { EIP_ITEMS, REGISTRY_DESIGN } from './EipPrecompilesData';
import type { CodeRef } from '@/components/code/types';

export default function EipPrecompiles({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEip, setActiveEip] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="eip-precompiles" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">blake2f, KZG Point Evaluation</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Istanbul(2019)과 Cancun(2024)에서 각각 하나씩 프리컴파일이 추가되었다.<br />
          blake2f(0x09)는 Zcash 생태계와의 호환을 위한 것이고, KZG Point Evaluation(0x0a)은 EIP-4844 Blob 트랜잭션의 데이터 무결성 검증을 위한 것이다.
        </p>
        <p className="leading-7">
          두 프리컴파일 모두 revm의 <code>Precompile::Standard</code> 변형으로 등록된다.<br />
          블록 환경(timestamp 등)을 참조할 필요가 없는 순수 함수이기 때문이다.<br />
          레지스트리 관리는 <code>PrecompileSpecId</code> enum과 <code>OnceLock</code> 조합으로 이루어진다.
        </p>

        {/* ── blake2f (EIP-152) ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">blake2f (0x09) — BLAKE2b 압축 함수</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">blake2f_call(<code>input: &amp;[u8]</code>, <code>gas_limit: u64</code>) — EIP-152 (Istanbul, 2019)</p>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">입력: 213 bytes 고정</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-foreground/50">
              <span>rounds (4B) iteration</span>
              <span>h (64B) state vector</span>
              <span>m (128B) message</span>
              <span>t (16B) offset</span>
              <span>f (1B) final flag</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-amber-400 mb-1">Gas: <code>rounds * 1</code></p>
              <p className="text-xs text-foreground/60">rounds 파라미터로 비용 비례 (동적 비용 모델)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">출력: 64 bytes</p>
              <p className="text-xs text-foreground/60">새 state vector. <code>blake2b_compress</code> 실행 결과</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-foreground/50">
            <p>ZEC-ETH Atomic Swap</p>
            <p>BLAKE2 기반 zk proof</p>
            <p>Zcash 상호운용성</p>
          </div>
        </div>
        <p className="leading-7">
          blake2f는 <strong>Zcash 호환성</strong>을 위해 추가.<br />
          BLAKE2b의 F 압축 함수만 노출 → 호출자가 flexible 사용 가능.<br />
          rounds 파라미터로 gas 비례 — 동적 비용 모델.
        </p>

        {/* ── point_evaluation (EIP-4844) ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">point_evaluation (0x0a) — KZG proof 검증</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">point_evaluation_call — EIP-4844 (Cancun, 2024)</p>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-amber-400 mb-1">Gas: <code>50,000</code> (고정)</p>
            <p className="text-xs font-semibold text-foreground/70 mt-2 mb-1">입력: 192 bytes</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-foreground/50">
              <span>versioned_hash (32B)</span>
              <span>z (32B) eval point</span>
              <span>y (32B) claimed result</span>
              <span>commitment (48B)</span>
              <span>proof (48B)</span>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-indigo-400 font-bold">1</span>
              <div>
                <p className="text-xs text-foreground/70">versioned_hash 검증</p>
                <p className="text-xs text-foreground/50">commitment &#8594; KZG &#8594; SHA-256 &#8594; 0x01 prefix와 비교</p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-amber-400 font-bold">2</span>
              <div>
                <p className="text-xs text-foreground/70">KZG proof 검증</p>
                <p className="text-xs text-foreground/50"><code>verify_kzg_proof(commitment, z, y, proof, KZG_SETTINGS)</code></p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-emerald-400 font-bold">3</span>
              <div>
                <p className="text-xs text-foreground/70">성공 시 고정 반환</p>
                <p className="text-xs text-foreground/50">FIELD_ELEMENTS_PER_BLOB (4096) + BLS_MODULUS</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground/50">용도: L2 fraud proof (Optimism, Arbitrum). blob 특정 위치 값 trustless 증명 &#8594; Rollup 안전성 핵심</p>
        </div>
        <p className="leading-7">
          <code>point_evaluation</code>이 <strong>L2 fraud proof의 암호학적 토대</strong>.<br />
          Blob의 특정 위치 값을 trustless하게 증명 가능 → Rollup 안전성 보장.<br />
          50K gas 고정 — 복잡한 BLS12-381 pairing 연산이지만 효율적.
        </p>

        {/* ── 향후 EIP-2537 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-2537 — BLS12-381 Precompiles (Prague 예정)</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="text-xs text-foreground/50 mb-3">BLS12-381: 암호학 표준 곡선 (Ethereum 2.0, Filecoin, Zcash Sapling)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-[11px] text-red-400">0x0b G1_ADD</p>
              <p className="text-[11px] text-foreground/50">600 gas</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-[11px] text-red-400">0x0c G1_MSM</p>
              <p className="text-[11px] text-foreground/50">dynamic</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-[11px] text-red-400">0x0d G2_ADD</p>
              <p className="text-[11px] text-foreground/50">4,500 gas</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-[11px] text-red-400">0x0e G2_MSM</p>
              <p className="text-[11px] text-foreground/50">dynamic</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-[11px] text-red-400">0x0f PAIRING</p>
              <p className="text-[11px] text-foreground/50">43K+65K*k</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-[11px] text-red-400">0x10 fp&#8594;G1</p>
              <p className="text-[11px] text-foreground/50">5,500 gas</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-[11px] text-red-400">0x11 fp2&#8594;G2</p>
              <p className="text-[11px] text-foreground/50">23,800 gas</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70 mb-1">BLS 서명 검증</p>
              <p className="text-xs text-foreground/60">Ethereum 2.0 attestation, validator 공개키 집계, 수천 attestation 1회 pairing check</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70 mb-1">BLS 기반 zkSNARK</p>
              <p className="text-xs text-foreground/60">Plonk, Halo2 등 최신 proof system. bn128보다 더 안전한 128-bit 보안</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70 mb-1">Liquid Staking</p>
              <p className="text-xs text-foreground/60">validator 공개키 확인, staking 수익 분배 증명</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">bn128 vs BLS12-381</p>
            <p className="text-xs text-foreground/60">BLS12-381이 더 빠른 pairing + 더 안전. Ethereum 2.0이 채택 &#8594; EL에도 필요</p>
            <p className="text-xs text-foreground/50 mt-1">구현: blst (C++, 최고 속도) / arkworks (pure Rust, zk 생태계) / Reth: 선택 가능</p>
          </div>
        </div>
        <p className="leading-7">
          EIP-2537은 <strong>BLS12-381 곡선 온체인 지원</strong>.<br />
          Ethereum 2.0 consensus의 BLS 서명을 EL에서 검증 가능.<br />
          Prague 활성화 시 EL ↔ CL 상호운용성 극대화.
        </p>
      </div>

      {/* EIP별 카드 */}
      <h3 className="text-lg font-semibold mb-3">하드포크 추가 프리컴파일</h3>
      <div className="space-y-2 mb-6">
        {EIP_ITEMS.map((e, i) => (
          <motion.div key={i} onClick={() => setActiveEip(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeEip ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeEip ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ backgroundColor: i === activeEip ? e.color : 'var(--muted)', color: i === activeEip ? '#fff' : 'var(--muted-foreground)' }}>
                {e.eip}
              </span>
              <span className="font-semibold text-sm">{e.name}</span>
              <span className="text-xs text-foreground/50 ml-auto">{e.fork} / {e.gas}</span>
            </div>
            <AnimatePresence>
              {i === activeEip && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-xs text-foreground/50 mt-2 ml-1">용도: {e.purpose}</p>
                  <p className="text-sm text-foreground/70 mt-1 ml-1">{e.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 레지스트리 설계 Q&A */}
      <h3 className="text-lg font-semibold mb-3">레지스트리 설계 판단</h3>
      <div className="space-y-2 mb-6">
        {REGISTRY_DESIGN.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('precompile-enum', codeRefs['precompile-enum'])} />
        <span className="text-[10px] text-muted-foreground self-center">Precompile enum</span>
        <CodeViewButton onClick={() => onCodeRef('cancun-registry', codeRefs['cancun-registry'])} />
        <span className="text-[10px] text-muted-foreground self-center">Cancun 레지스트리</span>
      </div>
    </section>
  );
}
