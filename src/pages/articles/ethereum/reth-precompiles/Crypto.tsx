import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import CryptoDetailViz from './viz/CryptoDetailViz';
import { CRYPTO_ITEMS, IMPL_COMPARISONS } from './CryptoData';
import type { CodeRef } from '@/components/code/types';

export default function Crypto({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('ecRecover');

  return (
    <section id="crypto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ecRecover, SHA256, bn128</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Frontier(제네시스)부터 존재하는 4개 프리컴파일과 Byzantium에서 추가된 bn128 연산이 핵심이다.<br />
          ecRecover(0x01)는 TX 서명 검증, ERC-2612 permit 등에 사용된다.<br />
          bn128 시리즈(0x06~0x08)는 zkSNARK 온체인 검증의 기반이다.
        </p>
        <p className="leading-7">
          모든 프리컴파일은 동일한 패턴을 따른다.<br />
          먼저 입력 크기로 필요 가스를 계산하고, <code>gas_limit</code>과 비교한다.<br />
          가스가 부족하면 실행 전에 OOG(Out of Gas)를 반환한다.<br />
          가스가 충분하면 네이티브 함수를 실행하고, 고정 크기 바이트 배열을 반환한다.
        </p>

        {/* ── ecRecover 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ecRecover (0x01) — 서명 복구</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">ec_recover_call(<code>input: &amp;[u8]</code>, <code>gas_limit: u64</code>) &#8594; <code>PrecompileResult</code></p>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">Gas: <code className="text-amber-400">3,000</code> (고정)</p>
          </div>
          <div className="space-y-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-indigo-400 font-bold">1</span>
              <p className="text-xs text-foreground/60">Gas check: <code>gas_limit &lt; 3000</code> &#8594; OutOfGas</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-indigo-400 font-bold">2</span>
              <div>
                <p className="text-xs text-foreground/60">Input 파싱 (128 bytes, 부족 시 zero-pad)</p>
                <div className="grid grid-cols-4 gap-1 mt-1 text-[11px] text-foreground/50">
                  <span>[0..32] msg_hash</span>
                  <span>[32..64] v (27/28)</span>
                  <span>[64..96] r</span>
                  <span>[96..128] s</span>
                </div>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-amber-400 font-bold">3</span>
              <p className="text-xs text-foreground/60">v 검증: 27 또는 28만 허용. 아니면 빈 bytes 반환</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-amber-400 font-bold">4</span>
              <p className="text-xs text-foreground/60">secp256k1 서명 복구: <code>Signature::from_scalars</code> &#8594; <code>recover_from_prehash</code></p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3 grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <span className="text-xs font-mono text-emerald-400 font-bold">5</span>
              <p className="text-xs text-foreground/60">pubkey &#8594; keccak256 &#8594; 하위 20 bytes = address. 32 bytes로 zero-pad 반환</p>
            </div>
          </div>
          <p className="text-xs text-foreground/50">실패 시 빈 bytes 반환 (revert 아님). 용도: TX 서명 검증, ERC-2612 permit, EIP-712</p>
        </div>
        <p className="leading-7">
          <code>ecRecover</code>가 <strong>가장 많이 사용되는 프리컴파일</strong>.<br />
          모든 TX의 sender 복구, ERC-2612 permit, EIP-712 서명에 사용.<br />
          실패 시 revert 아닌 빈 값 반환 → 컨트랙트 레벨에서 처리.
        </p>

        {/* ── SHA256/RIPEMD ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SHA256/RIPEMD/Identity — 범용 해시</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="font-mono text-xs text-indigo-400 mb-1">0x02: SHA-256</p>
              <p className="text-xs text-foreground/60">Gas: <code>60 + 12 * ceil(len/32)</code></p>
              <p className="text-xs text-foreground/50 mt-1"><code>sha2::Sha256::digest(input)</code> &#8594; 32 bytes</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
              <p className="font-mono text-xs text-amber-400 mb-1">0x03: RIPEMD-160</p>
              <p className="text-xs text-foreground/60">Gas: <code>600 + 120 * ceil(len/32)</code></p>
              <p className="text-xs text-foreground/50 mt-1">20 bytes hash &#8594; 32 bytes zero-pad</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#22c55e' }}>
              <p className="font-mono text-xs text-emerald-400 mb-1">0x04: Identity</p>
              <p className="text-xs text-foreground/60">Gas: <code>15 + 3 * ceil(len/32)</code></p>
              <p className="text-xs text-foreground/50 mt-1">입력 그대로 반환 (데이터 복사)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">Identity 용도</p>
              <p className="text-xs text-foreground/60">datacopy opcode 대체. calldata &#8594; memory 빠른 복사. gas 효율적 이동</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">SHA-256 vs Keccak-256</p>
              <p className="text-xs text-foreground/60">keccak256: 이더리움 표준 (SHA3 opcode). sha256: Bitcoin/외부 시스템 연동용</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          3개 해시 함수가 <strong>외부 시스템 연동</strong> 지원.<br />
          SHA-256은 Bitcoin SPV proof, RIPEMD는 Bitcoin address 변환에 사용.<br />
          Identity는 gas 효율적인 memory copy 수단.
        </p>

        {/* ── bn128 시리즈 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">bn128 (0x06-0x08) — zkSNARK 검증</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="text-xs text-foreground/50 mb-3">alt_bn128: Barreto-Naehrig 곡선, zkSNARK 온체인 검증 표준</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#6366f1' }}>
              <p className="font-mono text-xs text-indigo-400 mb-1">0x06: bn128Add</p>
              <p className="text-xs text-foreground/60">G1 point 덧셈. 입력: (x1,y1,x2,y2) 128B</p>
              <p className="text-xs text-foreground/50">Gas: <strong>150</strong> / ~1 us</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
              <p className="font-mono text-xs text-amber-400 mb-1">0x07: bn128Mul</p>
              <p className="text-xs text-foreground/60">G1 scalar multiplication. 입력: (x,y,k) 96B</p>
              <p className="text-xs text-foreground/50">Gas: <strong>6,000</strong> / ~100 us</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3" style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <p className="font-mono text-xs text-red-400 mb-1">0x08: bn128Pairing</p>
              <p className="text-xs text-foreground/60">Pairing check. 입력: k * (G1,G2) 192B*k</p>
              <p className="text-xs text-foreground/50">Gas: <strong>45K + 34K*k</strong> / ~2 ms/pair</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">Groth16 zkSNARK 검증</p>
            <p className="text-xs text-foreground/60">e(A,B) == e(alpha,beta) * e(L,gamma) * e(C,delta) &#8594; bn128Pairing 1회로 검증 완료</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-[11px] text-foreground/70">Tornado Cash</p>
              <p className="text-[11px] text-foreground/50">anonymous transfer</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-[11px] text-foreground/70">zkSync / Scroll</p>
              <p className="text-[11px] text-foreground/50">zkRollup</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-[11px] text-foreground/70">Semaphore</p>
              <p className="text-[11px] text-foreground/50">anonymous signaling</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="text-[11px] text-foreground/70">Groth16 verify</p>
              <p className="text-[11px] text-foreground/50">3 pairings ~6 ms</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>bn128</code> 시리즈가 <strong>온체인 zkSNARK 검증 기반</strong>.<br />
          Pairing check 1회로 Groth16 proof 검증 완료 → 가스 효율적.<br />
          Tornado Cash, zkSync, Scroll 등 주요 zk 프로젝트가 이 프리컴파일 의존.
        </p>
      </div>

      <div className="not-prose mb-6"><CryptoDetailViz /></div>

      {/* 프리컴파일별 상세 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">프리컴파일별 상세</h3>
      <div className="not-prose space-y-2 mb-6">
        {CRYPTO_ITEMS.map(c => {
          const isOpen = expanded === c.name;
          return (
            <div key={c.name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : c.name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-mono font-semibold text-sm" style={{ color: c.color }}>{c.name} ({c.addr})</p>
                  <p className="text-xs text-foreground/60 mt-0.5">가스: {c.gasFormula}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3 space-y-1">
                      <p className="text-xs text-foreground/50">입력: {c.inputFormat}</p>
                      <p className="text-xs text-foreground/50">출력: {c.outputFormat}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed mt-2">{c.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Geth vs Reth 비교 테이블 */}
      <h3 className="text-lg font-semibold mb-3">Geth CGo vs Reth 순수 Rust</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">항목</th>
              <th className="text-left p-3 font-semibold">Geth</th>
              <th className="text-left p-3 font-semibold">Reth</th>
            </tr>
          </thead>
          <tbody>
            {IMPL_COMPARISONS.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.aspect}</td>
                <td className="p-3 text-red-400">{r.geth}</td>
                <td className="p-3 text-emerald-400">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('precompile-dispatch', codeRefs['precompile-dispatch'])} />
        <span className="text-[10px] text-muted-foreground self-center">call() 디스패치</span>
        <CodeViewButton onClick={() => onCodeRef('bn128-add', codeRefs['bn128-add'])} />
        <span className="text-[10px] text-muted-foreground self-center">bn128_add</span>
        <CodeViewButton onClick={() => onCodeRef('bn128-pairing', codeRefs['bn128-pairing'])} />
        <span className="text-[10px] text-muted-foreground self-center">bn128_pairing</span>
      </div>
    </section>
  );
}
