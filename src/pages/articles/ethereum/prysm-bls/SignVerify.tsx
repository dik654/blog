import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SignVerify({ onCodeRef }: Props) {
  return (
    <section id="sign-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서명 &middot; 검증 &middot; 집계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Sign ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">Sign(sk, msg) — 서명 생성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BLS 서명 생성 알고리즘 (Ethereum 2.0 변형)
//
// Input:
//   sk: SecretKey (32 bytes, scalar in Fr)
//   msg: []byte (서명할 메시지, 보통 signing_root)
//
// Output:
//   sig: Signature (96 bytes, G2 point)

func Sign(sk SecretKey, msg []byte) Signature {
    // 1. hash_to_curve: 메시지 → G2 point
    //    H(msg) = SSWU mapping with DST
    H := hash_to_curve_G2(msg, DST)

    // 2. 비밀키 스칼라와 곱셈
    //    sig = sk × H(msg)  (G2 scalar multiplication)
    sig := sk.Scalar() * H

    // 3. G2 point → 96 byte serialization (compressed)
    return sig.Serialize()
}

// hash_to_curve 내부:
// 1. XMD (Expand Message XOF via Hash)
//    uniform bytes ← SHA-256(msg || DST || len(DST))
//
// 2. hash_to_field (2 field elements for G2)
//    u, v ← uniform bytes mod p
//
// 3. SSWU mapping (Shallue-van de Woestijne-Ulas)
//    P1, P2 ← map_to_curve(u), map_to_curve(v)
//
// 4. Point addition + cofactor clearing
//    H ← cofactor * (P1 + P2)
//
// 결과: G2 위의 uniform random point

// 성능:
// - hash_to_curve: ~0.3ms
// - scalar multiplication: ~0.7ms
// - 총 Sign 비용: ~1ms`}
        </pre>
        <p className="leading-7">
          BLS 서명 = <strong>msg를 G2 point로 해시 + sk 스칼라 곱셈</strong>.<br />
          hash_to_curve가 메시지를 균일 분포 G2 point로 매핑 (SSWU mapping).<br />
          결과 96 bytes (compressed serialization).
        </p>

        {/* ── Verify ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Verify(pk, msg, sig) — 단일 서명 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BLS 서명 검증 (pairing equation)
//
// Input:
//   pk: PublicKey (48 bytes, G1 point)
//   msg: []byte
//   sig: Signature (96 bytes, G2 point)

func Verify(pk PublicKey, msg []byte, sig Signature) bool {
    // 1. sig, pk deserialize + 유효성 검증
    sig_point := sig.Deserialize()      // G2
    pk_point := pk.Deserialize()        // G1

    // 2. 메시지 재해시
    H := hash_to_curve_G2(msg, DST)

    // 3. Pairing equation:
    //    e(G1_gen, sig) == e(pk, H(msg))
    //
    //    수학적 증명:
    //    sig = sk × H(msg)
    //    pk = sk × G1_gen
    //
    //    e(G1_gen, sk × H(msg)) = e(G1_gen, H(msg))^sk
    //    e(sk × G1_gen, H(msg)) = e(G1_gen, H(msg))^sk  (bilinear)
    //    → 두 값이 같음 ✓

    left := pairing(G1_GENERATOR, sig_point)
    right := pairing(pk_point, H)

    return left == right  // GT equality check
}

// 성능:
// - Deserialize + validation: ~0.1ms
// - hash_to_curve: ~0.3ms
// - 2 pairings + equality: ~1.6ms
// - 총 Verify 비용: ~2ms

// 주의사항:
// - subgroup check 필수 (sig, pk가 G2/G1 subgroup 멤버인가)
//   → 공격: 다른 subgroup point를 서명으로 제출
// - infinity point 거부 (pk = 0)`}
        </pre>
        <p className="leading-7">
          Verify는 <strong>pairing equation</strong> <code>e(G, sig) == e(pk, H(m))</code> 검증.<br />
          bilinear pairing 성질로 양변이 수학적으로 같음 증명.<br />
          2 pairing 연산이 핵심 비용 (~1.6ms).
        </p>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('bls-verify', codeRefs['bls-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">Verify()</span>
          <CodeViewButton onClick={() => onCodeRef('bls-fast-agg-verify', codeRefs['bls-fast-agg-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">FastAggregateVerify()</span>
        </div>

        {/* ── Aggregate ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Aggregate — 서명 집계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// N개 서명을 1개로 집계

func Aggregate(sigs []Signature) Signature {
    // 모든 서명 G2 point를 더함
    // sig_agg = sig_1 + sig_2 + ... + sig_n
    result := G2.Identity()
    for _, sig := range sigs {
        p := sig.Deserialize()
        result = result + p  // G2 point addition
    }
    return result.Serialize()
}

// 수학적 의미:
// 모든 서명자가 같은 메시지 msg에 서명:
//   sig_1 = sk_1 × H(msg)
//   sig_2 = sk_2 × H(msg)
//   ...
//   sig_n = sk_n × H(msg)
//
// 집계:
//   sig_agg = Σ sig_i = (Σ sk_i) × H(msg)
//           = sk_agg × H(msg)
//
// 이 집계 서명은 public key 집계에 대응:
//   pk_agg = Σ pk_i = (Σ sk_i) × G1_gen = sk_agg × G1_gen

// 따라서 Aggregate 서명 검증:
//   e(G1_gen, sig_agg) == e(pk_agg, H(msg))

// 이더리움 활용:
// - 서브넷 attestation 집계 (aggregator validator 역할)
// - Sync committee 서명 집계 (512 validator → 1 sig)
// - 블록 포함 시 집계된 형태로만 저장

// 비용:
// - 100 서명 집계: ~5ms (point addition)
// - 1000 서명 집계: ~50ms`}
        </pre>
        <p className="leading-7">
          <strong>Aggregate</strong>가 BLS의 킬러 기능 — N개 서명을 점 덧셈으로 1개로 압축.<br />
          이더리움 attestation이 슬롯당 ~30,000개 → 서브넷 집계 → 블록 포함.<br />
          집계 후에도 pairing 1회로 전체 검증 가능.
        </p>

        {/* ── FastAggregateVerify ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FastAggregateVerify — 동일 메시지 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 동일 메시지에 대한 N명의 서명 검증 (가장 빠름)

func FastAggregateVerify(
    pks []PublicKey,        // N명의 공개키
    msg []byte,             // 동일 메시지
    sig_agg Signature,      // 집계된 서명
) bool {
    // 1. 공개키 집계 (G1 덧셈)
    //    pk_agg = pk_1 + pk_2 + ... + pk_n
    pk_agg := G1.Identity()
    for _, pk := range pks {
        pk_agg = pk_agg + pk.Point()
    }

    // 2. pairing 검증 (1회만)
    //    e(pk_agg, H(msg)) == e(G1_gen, sig_agg)
    H := hash_to_curve_G2(msg, DST)
    left := pairing(pk_agg, H)
    right := pairing(G1_GENERATOR, sig_agg.Point())

    return left == right
}

// 일반 Verify 대비 가속:
// N명의 서명을 개별 검증: N × 2ms = 2N ms
// FastAggregateVerify: N point addition + 2 pairings = (N×0.05 + 1.6) ms
//
// 예: 100명 검증
// - 개별: 200ms
// - FAV: ~6.6ms (30배 가속)

// 사용처 (이더리움):
// - Sync committee 512명 → 동일 블록 root 서명
//   * 개별 검증: ~1초
//   * FastAggregateVerify: ~30ms
// - Attestation aggregate (같은 attestation_data 서명자들)
// - Committee aggregate

// 필요 조건:
// 1. 모든 서명자가 완전히 동일 메시지에 서명
// 2. Proof-of-Possession (PoP) 등록된 키만 사용
//    → rogue key attack 방어

// rogue key attack:
// 공격자가 pk_attacker = pk_normal_sum^(-1) × G_malicious 생성
// 집계 시 정상 키 상쇄 + 공격자 키만 남음
// → PoP 요구로 방어 (각 validator가 자기 키 소유 증명)`}
        </pre>
        <p className="leading-7">
          <strong>FastAggregateVerify 핵심</strong> — 동일 메시지에 대한 다수 서명자 검증 최적화.<br />
          pk를 모두 합산한 뒤 패어링 1회만 수행.<br />
          O(n) 포인트 덧셈 + O(1) 패어링 = 수천 서명을 밀리초 단위로 검증.
        </p>
      </div>
    </section>
  );
}
