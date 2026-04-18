import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import LazyVerifyViz from './viz/LazyVerifyViz';

export default function LazyVerify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (k: string) => onCodeRef(k, codeRefs[k]);
  return (
    <section id="lazy-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lazy Verification & Batcher</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          기존 합의 — 모든 수신 메시지를 즉시 서명 검증. 메시지 N개 x 검증 비용 = 높은 CPU 부하
          <br />
          Simplex Batcher의 Lazy Verification — <strong>쿼럼 도달 시에만 배치 검증</strong>
        </p>
        <p className="leading-7">
          <code>VoteTracker</code> — notarizes/nullifies/finalizes 3종 <code>AttributableMap</code>으로 투표 수집
          <br />
          검증자당 1표만 허용 (signer 인덱스 키). 쿼럼 도달 전까지는 저장만 수행
          <br />
          <code>Scheme::is_batchable()</code>이 true인 서명 스킴(ed25519 등)에서만 활성화
        </p>
        <p className="leading-7">
          <strong>구현 인사이트:</strong> Batcher가 별도 actor — 투표 수집·검증을 Voter에서 분리
          <br />
          Voter는 검증된 인증서만 수신 → 합의 로직이 서명 검증 복잡도에서 완전 격리
          <br />
          3개 네트워크 채널(vote/certificate/resolver) 분리로 인증서가 투표보다 먼저 도착하면 short-circuit
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('vote-tracker')} />
        <span className="text-[10px] text-muted-foreground self-center">VoteTracker</span>
        <CodeViewButton onClick={() => open('notarization-type')} />
        <span className="text-[10px] text-muted-foreground self-center">Notarization (N3f1)</span>
      </div>
      <div className="not-prose mb-8">
        <LazyVerifyViz onOpenCode={open} />
      </div>

      {/* Lazy Verification structured cards */}
      <div className="not-prose mt-6">
        <h3 className="text-xl font-semibold mb-3">Lazy Verification 최적화</h3>

        {/* Motivation */}
        <div className="rounded-lg border border-border bg-card p-5 mb-4">
          <h4 className="font-semibold text-sm mb-2">동기</h4>
          <p className="text-xs text-muted-foreground mb-2">
            합의에 대량의 서명 메시지: 투표, 인증서, 제안. N 검증자 x M view x K 메시지/view → 에폭당 10^4 ~ 10^6 서명.
          </p>
          <p className="text-xs text-muted-foreground">
            서명 검증 비용: Ed25519 ~70 us · BLS ~2 ms · 10^4 서명 시: ~0.7초(ed25519) / 20초(BLS)
          </p>
        </div>

        {/* Eager vs Lazy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Eager 검증</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>수신 즉시 모든 메시지 검증</li>
              <li>높은 CPU 비용</li>
              <li>쿼럼 미도달 시 검증 낭비</li>
            </ul>
          </div>
          <div className="rounded-lg border border-blue-400/40 bg-blue-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">Lazy 검증</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>검증 없이 메시지 수집</li>
              <li>쿼럼 잠재 도달 시에만 검증</li>
              <li>지원 시 배치 검증</li>
            </ul>
          </div>
        </div>

        {/* Batching optimization */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">배치 최적화 (Ed25519)</h4>
          <p className="text-xs text-muted-foreground mb-2">
            단일 검증: 70 us · 배치 100개 검증: 1.5 ms (amortized 15 us) · 속도 향상: ~4-5x
          </p>
          <p className="text-xs text-muted-foreground">
            원리: 중간 계산 공유 · 단일 지수 연산으로 N개 서명 확인. 수학적 기반: 서명의 랜덤 선형 결합 — <code className="text-xs">e(sum(s_i), G) == e(hash, sum(pk_i * r_i))</code>
          </p>
        </div>

        {/* VoteTracker */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2"><code className="text-sm">VoteTracker&lt;D&gt;</code></h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li><code className="text-xs">notarizes: AttributableMap&lt;Notarize&lt;D&gt;&gt;</code></li>
            <li><code className="text-xs">nullifies: AttributableMap&lt;Nullify&gt;</code></li>
            <li><code className="text-xs">finalizes: AttributableMap&lt;Finalize&lt;D&gt;&gt;</code></li>
            <li><code className="text-xs">verified: bool</code> — 초기 false, 배치 검증 통과 후 true</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            <code className="text-xs">AttributableMap</code>: 검증자당 1표 (인덱스 키) · 쿼럼 감지 용이 (엔트리 수 카운트)
          </p>
        </div>

        {/* Batcher processing loop */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Batcher 처리 루프</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>1.</strong> 네트워크에서 투표 수신 (<code className="text-xs">inbox.recv()</code>)</li>
                <li><strong>2.</strong> 미검증 풀에 추가 (<code className="text-xs">tracker.add</code>)</li>
                <li><strong>3.</strong> 쿼럼 도달 가능 여부 확인 (<code className="text-xs">count &gt;= threshold</code>)</li>
              </ul>
            </div>
            <div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>4.</strong> 배치 검증 시도 (<code className="text-xs">batch_verify</code>)</li>
                <li><strong>성공:</strong> <code className="text-xs">verified = true</code> → 인증서 집계·전송</li>
                <li><strong>실패:</strong> 잘못된 서명자 제거 → 계속 수집</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Batch verify implementation */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">배치 검증 구현 (<code className="text-sm">batch_verify_ed25519</code>)</h4>
          <p className="text-xs text-muted-foreground">
            입력: <code className="text-xs">&amp;[(Message, Signature, PublicKey)]</code> · 랜덤 스칼라 <code className="text-xs">r_i</code> 선택 · 결합 방정식 검증: <code className="text-xs">sum(r_i * s_i) * G == sum(r_i * R_i) + sum(r_i * c_i * A_i)</code> (c_i = H(R_i, A_i, m_i)). 배치 실패 시 개별 검증으로 폴백하여 잘못된 서명 식별.
          </p>
        </div>

        {/* Short-circuit */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Short-circuit 최적화</h4>
          <p className="text-xs text-muted-foreground mb-2">
            인증서가 개별 투표보다 먼저 도착하는 경우 (피어가 이미 집계 완료):
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li><code className="text-xs">Message::Certificate(cert)</code> → 개별 투표 수집 건너뛰기 → 집계 서명만 검증 → 즉시 채택</li>
            <li><code className="text-xs">Message::Notarize(vote)</code> → 일반 lazy 경로 → tracker에 추가 → 쿼럼 시 배치 검증</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-1">결과: 인증서 준비 시 빠른 전진, 개별 투표는 필요 시에만 처리</p>
        </div>

        {/* Network channels */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">네트워크 채널 분리</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-xs text-muted-foreground"><strong>Vote 채널:</strong> 빈번, 작은 메시지</div>
            <div className="text-xs text-muted-foreground"><strong>Certificate 채널:</strong> 드물지만 큰 메시지</div>
            <div className="text-xs text-muted-foreground"><strong>Resolver 채널:</strong> 동기화 요청</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            우선순위: 인증서 먼저 (빠른 최종성) → 투표 (batcher 공급) → Resolver (백그라운드 동기화)
          </p>
        </div>

        {/* Security */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">DoS 방어</h4>
            <p className="text-xs text-muted-foreground">view당 투표 풀 크기 제한. 오버플로 시 오래된 투표 삭제.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">잘못된 서명 공격</h4>
            <p className="text-xs text-muted-foreground">배치 실패 → 잘못된 서명자 식별. 악의적 검증자 슬래싱 가능.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">리플레이 공격</h4>
            <p className="text-xs text-muted-foreground">투표에 view 번호 포함. 동일 투표 다른 view = 다른 서명.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">이중 투표(Equivocation)</h4>
            <p className="text-xs text-muted-foreground"><code className="text-xs">AttributableMap</code>이 복수 투표 감지. 슬래싱 경로 트리거.</p>
          </div>
        </div>

        {/* Performance */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-sm mb-2">성능 영향 (100 검증자, Ed25519)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>Eager:</strong> view당 100회 검증 = 7ms</li>
                <li><strong>Lazy (배치 67):</strong> 1회 배치 검증 = 1.5ms</li>
                <li>view당 절감: ~5x CPU</li>
              </ul>
            </div>
            <div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>10,000 view:</strong> Eager 70초 vs Lazy 15초</li>
                <li>합의 참여자당 55초 CPU 절감</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
