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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>Sign(sk, msg)</code> &mdash; BLS 서명 생성</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
              <div><strong>Input</strong>: <code>sk</code> (32B, scalar in Fr), <code>msg</code> (signing_root)</div>
              <div><strong>Output</strong>: <code>sig</code> (96B, G2 point)</div>
            </div>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><code>hash_to_curve</code>: msg &rarr; G2 point (SSWU mapping with DST)</li>
              <li>비밀키 스칼라 곱셈: <code>sig = sk x H(msg)</code> (G2 scalar multiplication)</li>
              <li>G2 point &rarr; 96-byte serialization (compressed)</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2"><code>hash_to_curve</code> 내부 단계</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><strong>XMD</strong> &mdash; SHA-256(msg || DST || len(DST)) &rarr; uniform bytes</li>
              <li><strong>hash_to_field</strong> &mdash; u, v = uniform bytes mod p (2 field elements for G2)</li>
              <li><strong>SSWU mapping</strong> &mdash; P1, P2 = map_to_curve(u), map_to_curve(v)</li>
              <li><strong>cofactor clearing</strong> &mdash; H = cofactor x (P1 + P2)</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">성능</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">hash_to_curve</p><p className="font-mono">~0.3ms</p></div>
              <div><p className="text-muted-foreground">scalar mul</p><p className="font-mono">~0.7ms</p></div>
              <div><p className="text-muted-foreground font-semibold">총 Sign</p><p className="font-mono font-semibold">~1ms</p></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          BLS 서명 = <strong>msg를 G2 point로 해시 + sk 스칼라 곱셈</strong>.<br />
          hash_to_curve가 메시지를 균일 분포 G2 point로 매핑 (SSWU mapping).<br />
          결과 96 bytes (compressed serialization).
        </p>

        {/* ── Verify ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Verify(pk, msg, sig) — 단일 서명 검증</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>Verify(pk, msg, sig)</code> &mdash; pairing equation</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
              <div><code>pk</code>: 48B, G1</div>
              <div><code>msg</code>: bytes</div>
              <div><code>sig</code>: 96B, G2</div>
            </div>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>sig, pk deserialize + subgroup 유효성 검증</li>
              <li>메시지 재해시: <code>H = hash_to_curve_G2(msg, DST)</code></li>
              <li>Pairing equation: <code>e(G1_gen, sig) == e(pk, H(msg))</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">수학적 증명 (bilinear pairing 성질)</p>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p><code>sig = sk x H(msg)</code>, <code>pk = sk x G1_gen</code></p>
              <p><code>e(G1_gen, sk x H(msg)) = e(G1_gen, H(msg))^sk</code></p>
              <p><code>e(sk x G1_gen, H(msg)) = e(G1_gen, H(msg))^sk</code> (bilinear)</p>
              <p>&rarr; 양변이 같음</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">성능</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Deserialize + validation: ~0.1ms</li>
                <li>hash_to_curve: ~0.3ms</li>
                <li>2 pairings + equality: ~1.6ms</li>
                <li><strong>총 Verify: ~2ms</strong></li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">주의사항</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>subgroup check 필수 &mdash; 다른 subgroup point 공격 방어</li>
                <li>infinity point 거부 (<code>pk = 0</code>)</li>
              </ul>
            </div>
          </div>
        </div>
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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>Aggregate(sigs)</code> &mdash; N개 서명을 1개로</p>
            <p className="text-sm text-muted-foreground">모든 서명 G2 point를 더함: <code>sig_agg = sig_1 + sig_2 + ... + sig_n</code></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">수학적 의미 (동일 메시지 서명)</p>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p><code>sig_i = sk_i x H(msg)</code> &rarr; <code>sig_agg = (sum sk_i) x H(msg) = sk_agg x H(msg)</code></p>
              <p><code>pk_agg = sum pk_i = sk_agg x G1_gen</code></p>
              <p>검증: <code>e(G1_gen, sig_agg) == e(pk_agg, H(msg))</code></p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">이더리움 활용</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>서브넷 attestation 집계 (aggregator 역할)</li>
                <li>Sync committee 집계 (512 &rarr; 1 sig)</li>
                <li>블록 포함 시 집계 형태로만 저장</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">비용</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>100 서명 집계: <strong>~5ms</strong></li>
                <li>1000 서명 집계: <strong>~50ms</strong></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Aggregate</strong>가 BLS의 킬러 기능 — N개 서명을 점 덧셈으로 1개로 압축.<br />
          이더리움 attestation이 슬롯당 ~30,000개 → 서브넷 집계 → 블록 포함.<br />
          집계 후에도 pairing 1회로 전체 검증 가능.
        </p>

        {/* ── FastAggregateVerify ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FastAggregateVerify — 동일 메시지 최적화</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>FastAggregateVerify(pks, msg, sig_agg)</code></p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>공개키 집계 (G1 덧셈): <code>pk_agg = pk_1 + pk_2 + ... + pk_n</code></li>
              <li>pairing 검증 (2회만): <code>e(pk_agg, H(msg)) == e(G1_gen, sig_agg)</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">가속 효과</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-xs text-red-400 mb-1">개별 Verify (100명)</p>
                <p className="font-mono">100 x 2ms = <strong>200ms</strong></p>
              </div>
              <div>
                <p className="font-semibold text-xs text-green-400 mb-1">FastAggregateVerify (100명)</p>
                <p className="font-mono">100 x 0.05ms + 1.6ms = <strong>~6.6ms</strong> (30배)</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Sync committee 512명: 개별 ~1초 vs FAV <strong>~30ms</strong></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">필요 조건</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>모든 서명자가 <strong>완전 동일 메시지</strong>에 서명</li>
                <li>Proof-of-Possession (PoP) 등록된 키만 사용</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">Rogue key attack 방어</p>
              <p className="text-sm text-muted-foreground">공격자가 <code>pk_attacker = pk_sum^(-1) x G_malicious</code> 생성 &rarr; 정상 키 상쇄</p>
              <p className="text-sm text-muted-foreground mt-1">PoP 요구로 방어: 각 validator가 자기 키 소유 증명 제출</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>FastAggregateVerify 핵심</strong> — 동일 메시지에 대한 다수 서명자 검증 최적화.<br />
          pk를 모두 합산한 뒤 패어링 1회만 수행.<br />
          O(n) 포인트 덧셈 + O(1) 패어링 = 수천 서명을 밀리초 단위로 검증.
        </p>
      </div>
    </section>
  );
}
