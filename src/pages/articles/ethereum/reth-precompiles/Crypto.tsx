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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub fn ec_recover_call(input: &[u8], gas_limit: u64) -> PrecompileResult {
    const ECRECOVER_COST: u64 = 3_000;

    // 1. Gas check
    if gas_limit < ECRECOVER_COST {
        return Err(OutOfGas);
    }

    // 2. Input 파싱 (128 bytes 고정)
    // input[0..32]: msg_hash
    // input[32..64]: v (27 or 28, 또는 EIP-155)
    // input[64..96]: r
    // input[96..128]: s
    if input.len() < 128 {
        let mut padded = [0u8; 128];
        padded[..input.len()].copy_from_slice(input);
        // padding 후 처리
    }

    let msg_hash = B256::from_slice(&input[0..32]);
    let v = input[63];
    let r = U256::from_be_slice(&input[64..96]);
    let s = U256::from_be_slice(&input[96..128]);

    // 3. v 검증 (27 or 28만 허용)
    if v != 27 && v != 28 {
        return Ok(PrecompileOutput { gas_used: ECRECOVER_COST, bytes: Bytes::default() });
    }

    // 4. Signature 복구 (secp256k1)
    let signature = Signature::from_scalars(r, s, v - 27)?;
    let public_key = signature.recover_from_prehash(msg_hash)?;

    // 5. Address 유도 (pubkey → keccak256 → 하위 20 bytes)
    let addr = public_key_to_address(&public_key);

    // 6. 32 bytes로 패딩 (address는 20 bytes)
    let mut output = [0u8; 32];
    output[12..32].copy_from_slice(addr.as_slice());

    Ok(PrecompileOutput {
        gas_used: ECRECOVER_COST,
        bytes: Bytes::from(output.to_vec()),
    })
}

// 실패 시 빈 bytes 반환 (revert 아님, 0x00으로 간주)
// 사용 예: TX 서명 검증, ERC-2612 permit`}
        </pre>
        <p className="leading-7">
          <code>ecRecover</code>가 <strong>가장 많이 사용되는 프리컴파일</strong>.<br />
          모든 TX의 sender 복구, ERC-2612 permit, EIP-712 서명에 사용.<br />
          실패 시 revert 아닌 빈 값 반환 → 컨트랙트 레벨에서 처리.
        </p>

        {/* ── SHA256/RIPEMD ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SHA256/RIPEMD/Identity — 범용 해시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 0x02: SHA-256
pub fn sha256_call(input: &[u8], gas_limit: u64) -> PrecompileResult {
    // Gas: 60 + 12 × ceil(len / 32)
    let cost = 60 + 12 * ((input.len() + 31) / 32) as u64;
    if gas_limit < cost { return Err(OutOfGas); }

    let hash = sha2::Sha256::digest(input);
    Ok(PrecompileOutput { gas_used: cost, bytes: hash.to_vec().into() })
}

// 0x03: RIPEMD-160
pub fn ripemd160_call(input: &[u8], gas_limit: u64) -> PrecompileResult {
    // Gas: 600 + 120 × ceil(len / 32)
    let cost = 600 + 120 * ((input.len() + 31) / 32) as u64;
    if gas_limit < cost { return Err(OutOfGas); }

    let hash = ripemd::Ripemd160::digest(input);
    let mut output = [0u8; 32];
    output[12..32].copy_from_slice(&hash);  // 20 bytes → 32 bytes
    Ok(PrecompileOutput { gas_used: cost, bytes: output.to_vec().into() })
}

// 0x04: Identity (데이터 복사)
pub fn identity_call(input: &[u8], gas_limit: u64) -> PrecompileResult {
    // Gas: 15 + 3 × ceil(len / 32)
    let cost = 15 + 3 * ((input.len() + 31) / 32) as u64;
    if gas_limit < cost { return Err(OutOfGas); }

    Ok(PrecompileOutput { gas_used: cost, bytes: input.to_vec().into() })
}

// Identity 용도:
// - 기존 datacopy opcode 대체
// - calldata를 memory로 빠르게 복사
// - gas 효율적인 데이터 이동

// SHA-256 vs Keccak-256:
// - keccak256: 이더리움 표준 (opcode SHA3)
// - sha256: 비트코인/외부 시스템 연동용 (Bitcoin SPV 등)`}
        </pre>
        <p className="leading-7">
          3개 해시 함수가 <strong>외부 시스템 연동</strong> 지원.<br />
          SHA-256은 Bitcoin SPV proof, RIPEMD는 Bitcoin address 변환에 사용.<br />
          Identity는 gas 효율적인 memory copy 수단.
        </p>

        {/* ── bn128 시리즈 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">bn128 (0x06-0x08) — zkSNARK 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// bn128 (alt_bn128): Barreto-Naehrig 곡선, zkSNARK 표준

// 0x06: bn128Add - G1 point 덧셈
// 입력: (x1, y1, x2, y2) 각 32 bytes
// 출력: (x3, y3) 64 bytes
// Gas: 150 (Byzantium) → 150 (Istanbul)

// 0x07: bn128Mul - G1 scalar multiplication
// 입력: (x, y, k) 96 bytes
// 출력: (x', y') 64 bytes
// Gas: 6_000 (Byzantium) → 6_000 (Istanbul)

// 0x08: bn128Pairing - pairing check
// 입력: k개 (G1, G2) 쌍 (192 bytes × k)
// 출력: 0x01 (pairing 성공) or 0x00 (실패)
// Gas: 45_000 + 34_000 × k (Istanbul 기준)

// Pairing check:
// e(P_1, Q_1) × e(P_2, Q_2) × ... × e(P_k, Q_k) == 1
//
// Groth16 zkSNARK 검증:
// verify(proof, public_inputs, vk) {
//     e(A, B) == e(alpha, beta) ×
//                e(L, gamma) ×
//                e(C, delta)
// }
// → bn128Pairing call 1회로 증명 검증

// 사용 사례:
// - Tornado Cash (anonymous transfer)
// - zkSync, Scroll, Loopring (zkRollup)
// - Semaphore (익명 signaling)
// - ENS zk-voting

// 성능 (Rust arkworks):
// - G1 add: ~1 μs
// - G1 mul: ~100 μs
// - Pairing: ~2 ms per pair
// - Groth16 verify (3 pairings): ~6 ms`}
        </pre>
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
