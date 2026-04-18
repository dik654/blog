import SimplexBFTViz from './viz/SimplexBFTViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Simplex 프로토콜 & BFT 진화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Simplex — Benjamin Chan · Rafael Pass가 TCC 2023에서 발표한 BFT 합의 프로토콜
          <br />
          PBFT(1999) → Tendermint(2014) → HotStuff(2018) → <strong>Simplex(2023)</strong>
        </p>
        <p className="leading-7">
          4가지 핵심 혁신으로 기존 프로토콜의 한계를 돌파:
          <br />
          <strong>① 즉시 View 전환</strong> — Cert(k,x) 수집 즉시 view k+1로 이동. View-change 전송 불가
          <br />
          <strong>② No-Commit 증명</strong> — n-f View-change = 해당 view에서 결정 없었음 증명
          <br />
          <strong>③ 리더 대기 제거</strong> — 기존 2Δ 대기 완전 제거
          <br />
          <strong>④ 짧은 Timeout</strong> — 6Δ → 3Δ 단축
        </p>
        <p className="leading-7">
          Commonware 구현: <code>consensus::simplex</code>(기본) + <code>consensus::threshold_simplex</code>(VRF+BLS)
        </p>
      </div>
      <div className="not-prose mb-8"><SimplexBFTViz /></div>

      {/* Paper & BFT Evolution */}
      <div className="not-prose mt-6">
        <h3 className="text-xl font-semibold mb-3">Simplex BFT 프로토콜 역사</h3>

        <div className="rounded-lg border border-border bg-card p-5 mb-4">
          <h4 className="font-semibold text-sm mb-1">논문 정보</h4>
          <p className="text-sm text-muted-foreground mb-2">
            "Simplex Consensus: A Simple and Fast Consensus Protocol" — Benjamin Y. Chan, Rafael Pass (TCC 2023, eprint.iacr.org/2023/463)
          </p>
          <p className="text-sm text-muted-foreground">
            핵심 주장: "Simpler than HotStuff" · "Faster than existing protocols" · "Linear view-change complexity 유지"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">1999: PBFT</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>첫 실용적 async BFT (Castro & Liskov)</li>
              <li>3-phase 프로토콜</li>
              <li>O(n²) view-change 복잡도</li>
              <li>f &lt; n/3 비잔틴 내성</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">2014: Tendermint</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>2-phase (prevote + precommit)</li>
              <li>Cosmos에서 프로덕션 사용</li>
              <li>O(n²) view-change</li>
              <li>Gossip 기반 메시지 전파</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">2018: HotStuff</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>3-phase + responsive leader</li>
              <li>O(n) view-change (선형화!)</li>
              <li>DiemBFT, Libra에서 사용</li>
              <li>복잡한 파이프라이닝</li>
            </ul>
          </div>
          <div className="rounded-lg border border-blue-400/40 bg-blue-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">2023: Simplex</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>2-phase + 즉시 view 전환</li>
              <li>O(n) view-change</li>
              <li>짧은 타임아웃 (3Δ vs 6Δ)</li>
              <li>단순한 증명</li>
            </ul>
          </div>
        </div>

        {/* 4 Innovations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">혁신 ①: 즉시 View 전환</h4>
            <p className="text-xs text-muted-foreground">
              <code className="text-xs">Cert(view=k, val=x)</code> 확인 즉시 view k+1로 이동. 타임아웃 대기 없음. 별도 "view-change" 메시지 단계 없음.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">혁신 ②: No-Commit 증명</h4>
            <p className="text-xs text-muted-foreground">
              n-f 개 view-change 투표 = 해당 view에서 커밋 없었음을 증명. 이 증명으로 안전성 보장.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">혁신 ③: 리더 대기 제거</h4>
            <p className="text-xs text-muted-foreground">
              HotStuff: 리더가 쿼럼 대기 2Δ. Simplex: view 진입 즉시 제안. 낙관적 응답성(Optimistic responsiveness).
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">혁신 ④: 짧은 Timeout</h4>
            <p className="text-xs text-muted-foreground">
              HotStuff: 6Δ timeout/view. Simplex: 3Δ timeout/view. 비잔틴 리더 하에서 더 빠른 view 진행.
            </p>
          </div>
        </div>

        {/* Protocol Structure & Messages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">라운드 / View 구조</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>view v: 리더 L_v가 제안</li>
              <li>검증자들이 투표 (notarize)</li>
              <li>2f+1 notarize 시 → view 전진</li>
              <li>실패 시 → timeout → nullify → 다음 view</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">메시지 타입</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">Propose(v, parent_cert, payload)</code></li>
              <li><code className="text-xs">Notarize(v, digest)</code> — 제안 투표</li>
              <li><code className="text-xs">Nullify(v)</code> — 다음 view 건너뛰기</li>
              <li><code className="text-xs">Finalize(v, digest)</code> — 블록 확정</li>
            </ul>
          </div>
        </div>

        {/* Safety & Liveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Safety</h4>
            <p className="text-xs text-muted-foreground">
              충돌하는 두 블록이 동시에 확정 불가. 쿼럼 교차(quorum intersection)로 보장. f &lt; n/3 비잔틴 내성.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Liveness</h4>
            <p className="text-xs text-muted-foreground">
              동기 조건에서 진행 보장. 정직한 리더: 3Δ 안에 view 완료. 비잔틴 리더: 3Δ에 감지. f+1 연속 정직 리더 → 확정.
            </p>
          </div>
        </div>

        {/* Implementations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">consensus::simplex</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>기본 변형 — 개별 서명</li>
              <li>O(n) 인증서 크기</li>
              <li>각 검증자의 서명을 별도 저장</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">consensus::threshold_simplex</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>BLS threshold 서명 + VRF</li>
              <li>O(1) 인증서 크기 (96 bytes)</li>
              <li>DKG 기반 그룹 키 · 라이트 클라이언트 친화</li>
            </ul>
          </div>
        </div>

        {/* Why Simplex Matters & Performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">왜 Simplex가 중요한가</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>HotStuff보다 단순한 코드베이스</li>
              <li>형식 검증(formal verification) 가능</li>
              <li>빠른 최종성 (최악 3Δ)</li>
              <li>Commonware 모듈형 설계</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">성능 기대치 (Δ = 100ms 기준)</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>블록 시간: ~Δ (네트워크 지연) ≈ 100ms</li>
              <li>최종성: 3Δ (1 라운드) ≈ 300ms</li>
              <li>View change: 3Δ (timeout + nullify + propose) ≈ 300ms</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
