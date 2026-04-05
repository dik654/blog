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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EIP-152: BLAKE2 F precompile (Istanbul, 2019)

pub fn blake2f_call(input: &[u8], gas_limit: u64) -> PrecompileResult {
    // 입력: 213 bytes 고정
    if input.len() != 213 {
        return Err(Blake2WrongLength);
    }

    // 파싱:
    // rounds (4 bytes): iteration 횟수
    // h (64 bytes): state vector (8 × u64)
    // m (128 bytes): message block
    // t (16 bytes): offset counter (2 × u64)
    // f (1 byte): final block flag
    let rounds = u32::from_be_bytes(input[0..4].try_into().unwrap());
    let mut h = parse_h(&input[4..68]);
    let m = parse_m(&input[68..196]);
    let t = parse_t(&input[196..212]);
    let f = match input[212] {
        0 => false,
        1 => true,
        _ => return Err(Blake2WrongFinalIndicatorFlag),
    };

    // Gas: rounds × 1 gas
    let cost = rounds as u64;
    if gas_limit < cost { return Err(OutOfGas); }

    // BLAKE2b F 압축 함수 실행
    blake2b_compress(&mut h, &m, &t, f, rounds);

    // 출력: 64 bytes (새 state vector)
    Ok(PrecompileOutput { gas_used: cost, bytes: h.to_vec().into() })
}

// 사용 사례:
// - ZEC ↔ ETH Atomic Swap (ZEC는 BLAKE2b 기반)
// - BLAKE2 기반 zero-knowledge proof 검증
// - Zcash-Ethereum 상호운용성

// 특성:
// - 비대칭 gas: rounds 파라미터로 비용 조절
// - compress function만 노출 → flexible 사용 가능
// - 고정 입력 크기로 validation 단순`}
        </pre>
        <p className="leading-7">
          blake2f는 <strong>Zcash 호환성</strong>을 위해 추가.<br />
          BLAKE2b의 F 압축 함수만 노출 → 호출자가 flexible 사용 가능.<br />
          rounds 파라미터로 gas 비례 — 동적 비용 모델.
        </p>

        {/* ── point_evaluation (EIP-4844) ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">point_evaluation (0x0a) — KZG proof 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EIP-4844 point evaluation precompile (Cancun, 2024)

pub fn point_evaluation_call(input: &[u8], gas_limit: u64) -> PrecompileResult {
    const POINT_EVAL_COST: u64 = 50_000;

    if gas_limit < POINT_EVAL_COST {
        return Err(OutOfGas);
    }
    if input.len() != 192 {
        return Err(BlobInvalidInputLength);
    }

    // 입력 파싱 (192 bytes):
    // versioned_hash (32 bytes)
    // z (32 bytes) - evaluation point
    // y (32 bytes) - claimed evaluation result
    // commitment (48 bytes) - KZG commitment
    // proof (48 bytes) - KZG proof
    let versioned_hash = B256::from_slice(&input[0..32]);
    let z = &input[32..64];
    let y = &input[64..96];
    let commitment = &input[96..144];
    let proof = &input[144..192];

    // 1. versioned_hash 검증
    // commitment → KZG → SHA-256 → 0x01 prefix
    let expected_hash = kzg_to_versioned_hash(commitment);
    if expected_hash != versioned_hash {
        return Err(BlobMismatchedVersion);
    }

    // 2. KZG proof 검증
    let valid = verify_kzg_proof(commitment, z, y, proof, &KZG_SETTINGS)?;
    if !valid {
        return Err(BlobVerifyKzgProofFailed);
    }

    // 3. 성공 시 고정 반환값
    // FIELD_ELEMENTS_PER_BLOB (4096), BLS_MODULUS
    let output = [
        &4096u64.to_be_bytes()[..],
        BLS_MODULUS,
    ].concat();

    Ok(PrecompileOutput {
        gas_used: POINT_EVAL_COST,
        bytes: output.into(),
    })
}

// 사용 사례: L2 fraud proof
// Optimism, Arbitrum 등이 blob 데이터의 특정 지점 검증 필요 시 호출
// - "블록 N의 blob[i]의 position z의 값이 y다"를 증명
// - Rollup fraud proof 체계의 핵심 primitive`}
        </pre>
        <p className="leading-7">
          <code>point_evaluation</code>이 <strong>L2 fraud proof의 암호학적 토대</strong>.<br />
          Blob의 특정 위치 값을 trustless하게 증명 가능 → Rollup 안전성 보장.<br />
          50K gas 고정 — 복잡한 BLS12-381 pairing 연산이지만 효율적.
        </p>

        {/* ── 향후 EIP-2537 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-2537 — BLS12-381 Precompiles (Prague 예정)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prague (2025 예정) 추가 precompiles
// BLS12-381: 암호학 표준 곡선 (Ethereum 2.0, Filecoin, Zcash Sapling)

// 0x0b: BLS12_G1_ADD - G1 덧셈 (600 gas)
// 0x0c: BLS12_G1_MSM - G1 multi-scalar multiplication (dynamic)
// 0x0d: BLS12_G2_ADD - G2 덧셈 (4_500 gas)
// 0x0e: BLS12_G2_MSM - G2 multi-scalar multiplication (dynamic)
// 0x0f: BLS12_PAIRING_CHECK - pairing check (43_000 + 65_000 × k)
// 0x10: BLS12_MAP_FP_TO_G1 - hash to G1 (5_500 gas)
// 0x11: BLS12_MAP_FP2_TO_G2 - hash to G2 (23_800 gas)

// 사용 사례:
// 1. BLS 서명 검증
//    - Ethereum 2.0 attestation 서명
//    - validator 공개키 집계 (signature aggregation)
//    - 수천 attestation을 1개 pairing check로 검증

// 2. BLS 기반 zkSNARK
//    - Plonk, Halo2 등 최신 proof system
//    - bn128보다 더 안전한 128-bit 보안

// 3. Liquid Staking 검증
//    - validator 공개키 확인
//    - staking 수익 분배 증명

// bn128과 차이:
// - bn128: 128-bit 보안 (lower curve complexity)
// - BLS12-381: 128-bit 보안 (more optimal for pairings)
// - BLS12-381이 더 빠른 pairing + 더 안전
// - Ethereum 2.0이 BLS12-381 채택 → EL에도 필요

// 구현 라이브러리:
// - blst (supranational): C++ 기반, 가장 빠름
// - arkworks: pure Rust, zkSNARK 생태계
// - Reth: blst FFI 또는 arkworks 선택 가능`}
        </pre>
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
