import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BatchVerification({ onCodeRef }: Props) {
  return (
    <section id="batch-verification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">배치 검증 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <strong>AggregateVerify</strong> — 서로 다른 (pk, msg) 쌍의 집계 서명을 한 번에 검증한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('bls-batch', codeRefs['bls-batch'])} />
          <span className="text-[10px] text-muted-foreground self-center">AggregateVerify()</span>
        </div>

        {/* ── AggregateVerify vs FastAggregateVerify ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">AggregateVerify — 서로 다른 메시지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AggregateVerify: 각 서명자가 서로 다른 메시지에 서명한 경우
func AggregateVerify(
    pks []PublicKey,   // N개 공개키
    msgs [][]byte,     // N개 메시지 (서로 다름)
    sig_agg Signature, // 집계된 서명
) bool {
    if len(pks) != len(msgs) { return false }

    // Pairing product 검증:
    // e(G1, sig_agg) == Π e(pk_i, H(msg_i))
    //
    // 수학적 증명:
    // sig_agg = Σ sk_i × H(msg_i)
    // e(G1, sig_agg) = e(G1, Σ sk_i × H(msg_i))
    //                = Π e(G1, sk_i × H(msg_i))         (bilinear)
    //                = Π e(sk_i × G1, H(msg_i))         (bilinear)
    //                = Π e(pk_i, H(msg_i))

    left := pairing(G1_GENERATOR, sig_agg.Point())
    right := GT.Identity()
    for i := 0; i < len(pks); i++ {
        H := hash_to_curve_G2(msgs[i], DST)
        right = right * pairing(pks[i], H)  // GT multiplication
    }

    return left == right
}

// 비용:
// - N+1 pairings (FastAggregateVerify는 2)
// - N hash_to_curve 호출

// 사용처:
// - Attestation indices (각 validator가 자기 attestation_data 서명)
// - Block execution batch (서로 다른 payload에 서명)
// - Cross-fork signature verification

// 메시지가 같으면 FastAggregateVerify가 N배 빠름
// 메시지가 다르면 AggregateVerify가 N× Verify보다 빠름`}
        </pre>
        <p className="leading-7">
          <code>AggregateVerify</code>는 <strong>다른 메시지</strong>에 서명한 N명 검증.<br />
          N+1 pairing + N hash_to_curve 필요 — FAV보다 느림.<br />
          Attestation처럼 각자 다른 메시지 서명하는 경우 사용.
        </p>

        {/* ── Prysm의 Batch verification ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm의 배치 검증 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm: 동적 배치 검증 — 블록 처리 중 서명 수집
// 즉시 검증하지 않고 배치 모아서 한 번에

type SignatureBatch struct {
    Signatures []Signature   // 수집된 서명
    PubKeys    []PublicKey   // 대응 공개키
    Messages   [][]byte      // 각 메시지
    Description string       // 디버깅용
}

func (b *SignatureBatch) Verify() error {
    // 1. 모든 메시지가 동일한지 체크
    allSame := checkAllMessagesSame(b.Messages)

    if allSame {
        // FastAggregateVerify 경로 (빠름)
        agg := AggregateSignatures(b.Signatures)
        return FastAggregateVerify(b.PubKeys, b.Messages[0], agg)
    } else {
        // AggregateVerify 경로 (일반)
        agg := AggregateSignatures(b.Signatures)
        return AggregateVerify(b.PubKeys, b.Messages, agg)
    }
}

// ProcessBlock에서 활용:
func processBlock(state, block) {
    batch := &SignatureBatch{}

    // 각 operation마다 서명 수집 (실제 검증 안 함)
    batch.Add(block.RandaoReveal, ...)
    batch.Add(block.ProposerSignature, ...)
    for _, att := range block.Attestations {
        batch.Add(att.Signature, ...)
    }
    for _, slashing := range block.ProposerSlashings {
        batch.Add(slashing.Signature, ...)
    }
    // ... 등

    // 블록 처리 끝에서 한 번에 검증
    if err := batch.Verify(); err != nil {
        return err
    }
}

// 효과:
// 일반 블록 (150 attestation):
// - 순차 검증: 150 × 2ms = 300ms
// - 배치 검증: ~15ms (20배 가속)
//
// 크리티컬 path에서 사용 시 validator 성능 직결`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>동적 배치 검증</strong>으로 블록 처리 가속.<br />
          개별 서명 검증 대신 batch 수집 → 한 번에 pairing 계산.<br />
          150 attestation 처리 시 300ms → 15ms (20배 가속).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">배치 vs 개별 성능</h3>
        <ul>
          <li><strong>개별 Verify</strong> — 패어링 2회/건. 1000건 = 2000 패어링</li>
          <li><strong>FastAggregateVerify</strong> — 패어링 2회 + 포인트 덧셈 999회</li>
          <li><strong>AggregateVerify</strong> — n+1 패어링 (밀러 루프 배치 최적화)</li>
        </ul>

        {/* ── Miller Loop 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Miller Loop 배치 — 내부 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Pairing 계산 = Miller loop + Final exponentiation
// e(P, Q) = final_exp(miller_loop(P, Q))

// 1개 pairing:
// - Miller loop: ~60% 비용
// - Final exp: ~40% 비용

// N개 pairing 검증: e(P1,Q1) × e(P2,Q2) × ... × e(Pn,Qn)
//
// 순진한 방법:
// - N번 pairing 계산 → N × (miller + final_exp)
//
// 배치 최적화:
// - N번 miller_loop → 1번 final_exp
// - Σ miller(P_i, Q_i) → final_exp(Σ)
// - final_exp가 40% 절약

// blst의 MultiPairing API:
type Pairing struct {
    ctx C.PAIRING_t
}

func (p *Pairing) Add(pk *G1, sig *G2) {
    // miller_loop 단계만 누적
    C.blst_pairing_aggregate_pk_in_g1(&p.ctx, pk, sig, nil, 0)
}

func (p *Pairing) FinalExp() bool {
    // 모든 누적 후 1번의 final exponentiation
    return C.blst_pairing_finalverify(&p.ctx, nil)
}

// 사용:
p := NewPairing(true)  // use_hash_mode=true
for i := 0; i < n; i++ {
    p.Add(pks[i], sigs[i])  // Miller loop만
}
valid := p.FinalExp()  // Final exp 1번만

// 가속 효과:
// N=100: 순진한 방법 200ms → 배치 120ms (40% 단축)
// N=1000: 2000ms → 1200ms (40% 단축)`}
        </pre>
        <p className="leading-7">
          blst가 <strong>Miller loop 배치화</strong>로 추가 40% 가속.<br />
          N번 pairing 대신 N miller_loop + 1 final_exp 구조.<br />
          메인넷 attestation 검증에서 중요한 최적화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 전략 선택</strong> — Prysm은 블록 내 어테스테이션 검증 시 FastAggregateVerify 우선.<br />
          서로 다른 메시지가 섞이면 AggregateVerify로 폴백.<br />
          Rogue-Key 방어: Proof of Possession — 검증자 등록 시 pk 소유 증명 제출.
        </p>
      </div>
    </section>
  );
}
