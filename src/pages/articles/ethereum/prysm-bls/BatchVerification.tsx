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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>AggregateVerify(pks, msgs, sig_agg)</code></p>
            <p className="text-sm text-muted-foreground mb-2">각 서명자가 <strong>서로 다른 메시지</strong>에 서명한 경우 집계 검증</p>
            <p className="text-sm text-muted-foreground">Pairing product: <code>e(G1, sig_agg) == product e(pk_i, H(msg_i))</code></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">수학적 증명</p>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p><code>sig_agg = sum sk_i x H(msg_i)</code></p>
              <p><code>e(G1, sig_agg) = product e(G1, sk_i x H(msg_i)) = product e(pk_i, H(msg_i))</code></p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">비용</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>N+1</strong> pairings (FAV는 2)</li>
                <li><strong>N</strong> hash_to_curve 호출</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">사용처</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Attestation indices (각자 다른 att_data)</li>
                <li>Block execution batch</li>
                <li>Cross-fork signature verification</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>AggregateVerify</code>는 <strong>다른 메시지</strong>에 서명한 N명 검증.<br />
          N+1 pairing + N hash_to_curve 필요 — FAV보다 느림.<br />
          Attestation처럼 각자 다른 메시지 서명하는 경우 사용.
        </p>

        {/* ── Prysm의 Batch verification ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm의 배치 검증 전략</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>SignatureBatch</code> &mdash; 동적 배치 수집</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>Signatures []Signature</code> &mdash; 수집된 서명</li>
              <li><code>PubKeys []PublicKey</code> &mdash; 대응 공개키</li>
              <li><code>Messages [][]byte</code> &mdash; 각 메시지</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              <code>Verify()</code>: 모든 메시지 동일 &rarr; <code>FastAggregateVerify</code>, 아니면 <code>AggregateVerify</code>
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2"><code>processBlock</code> 활용 흐름</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>각 operation마다 서명 수집 (즉시 검증 안 함): RandaoReveal, ProposerSig, Attestations, Slashings</li>
              <li>블록 처리 끝에서 <code>batch.Verify()</code> 한 번에 검증</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">효과 (150 attestation 블록)</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2"><p className="text-muted-foreground">순차 검증</p><p className="font-mono">150 x 2ms = <strong>300ms</strong></p></div>
              <div className="bg-green-500/10 rounded p-2"><p className="text-muted-foreground">배치 검증</p><p className="font-mono"><strong>~15ms</strong> (20배 가속)</p></div>
            </div>
          </div>
        </div>
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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Pairing = Miller loop + Final exponentiation</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div className="bg-muted/50 rounded p-2"><p className="text-muted-foreground">Miller loop</p><p className="font-mono">~60% 비용</p></div>
              <div className="bg-muted/50 rounded p-2"><p className="text-muted-foreground">Final exp</p><p className="font-mono">~40% 비용</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">배치 최적화 원리</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-xs text-red-400 mb-1">순진한 방법</p>
                <p>N x (miller + final_exp)</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-green-400 mb-1">배치 최적화</p>
                <p>N x miller_loop &rarr; 1 x final_exp (40% 절약)</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">blst MultiPairing API</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code>Pairing.Add(pk, sig)</code> &mdash; miller_loop 단계만 누적 (<code>blst_pairing_aggregate_pk_in_g1</code>)</li>
              <li><code>Pairing.FinalExp()</code> &mdash; 모든 누적 후 1번의 final exponentiation</li>
            </ol>
            <div className="grid grid-cols-2 gap-3 text-sm text-center mt-3">
              <div><p className="text-muted-foreground">N=100</p><p className="font-mono">200ms &rarr; <strong>120ms</strong></p></div>
              <div><p className="text-muted-foreground">N=1000</p><p className="font-mono">2000ms &rarr; <strong>1200ms</strong></p></div>
            </div>
          </div>
        </div>
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
