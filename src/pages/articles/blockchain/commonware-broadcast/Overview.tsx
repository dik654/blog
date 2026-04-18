import ArchLayerViz from './viz/ArchLayerViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기존 브로드캐스트 문제 & 설계 목표</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          기존 블록체인: 리더가 전체 블록을 모든 검증자에게 전송
          <br />
          대역폭 낭비(중복 전송) · 리더 병목(단일 노드 의존) · 리더 비응답 시 전체 지연
        </p>
        <p className="leading-7">
          Commonware의 접근: <strong>합의와 전파를 완전 분리</strong>
          <br />
          3계층 — <code>Broadcaster</code> trait(전파 추상화) → <code>ordered_broadcast</code>(인증서 체인) → <code>Zoda</code>(DA 샤딩)
        </p>
      </div>
      <div className="not-prose mb-8"><ArchLayerViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Commonware Broadcast 배경</h3>

        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">프로젝트 개요</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p className="font-semibold">commonware <span className="text-muted-foreground font-normal">(github.com/commonwarexyz)</span></p>
              <p className="text-xs text-muted-foreground mt-1">블록체인 인프라 구축용 Rust 툴킷 — 모듈 단위 프리미티브: P2P, consensus, storage, crypto</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">기존 브로드캐스트의 문제 — Leader 기반 모델</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">리더 대역폭 병목</p>
                <p className="text-[11px] text-muted-foreground">N개 검증자에 전체 블록 전송 → 총 N × 블록 크기</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">중복 전송</p>
                <p className="text-[11px] text-muted-foreground">동일 데이터 반복 전파</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">리더 장애 = 슬롯 미스</p>
                <p className="text-[11px] text-muted-foreground">단일 노드 의존</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">Straggler 효과</p>
                <p className="text-[11px] text-muted-foreground">느린 리더가 전체 지연</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">대안: Erasure-coded 방식</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p>Reed-Solomon으로 블록을 N개 샤드로 분할 → 각 검증자가 1/N만 전송 → 대역폭 분산</p>
              <p className="text-xs text-muted-foreground mt-1">단, 샤드 조립(재구성) 단계가 필요</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Commonware 철학 — "합의와 전파를 완전히 분리"</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">합의</p>
                <p className="text-xs text-muted-foreground mt-1">불투명 식별자(tip)만 순서 결정</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">전파</p>
                <p className="text-xs text-muted-foreground mt-1">데이터 전파를 독립적으로 처리</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">확장성</p>
                <p className="text-xs text-muted-foreground mt-1">각 계층이 독립적으로 확장 가능</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">영감: Narwhal/Bullshark DAG 합의 · Celestia DA · EigenDA · 가용성 증명</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">3계층 아키텍처</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-2">
          <div className="bg-background rounded-md border p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">Layer 1</span>
              <span className="font-semibold text-sm"><code>Broadcaster</code> trait (전파 추상화)</span>
            </div>
            <p className="text-xs text-muted-foreground">최소 인터페이스 · 구현 세부사항 은닉 · 플러거블 엔진</p>
          </div>
          <div className="bg-background rounded-md border p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">Layer 2</span>
              <span className="font-semibold text-sm"><code>ordered_broadcast</code> (인증서 체인)</span>
            </div>
            <p className="text-xs text-muted-foreground">시퀀서별 독립 체인 · height 인덱싱 · 쿼럼 인증서 · 인과 순서 보장</p>
          </div>
          <div className="bg-background rounded-md border p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded font-semibold">Layer 3</span>
              <span className="font-semibold text-sm"><code>Zoda</code> (DA + 이레이저 코딩)</span>
            </div>
            <p className="text-xs text-muted-foreground">Reed-Solomon 인코딩 · Merkle 커밋 샤드 · 가용성 증명 · 1-of-n 정직 홀더면 충분</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">모듈 구조</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">broadcast/src/</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-xs font-mono">lib.rs</p>
              <p className="text-[11px] text-muted-foreground mt-1"><code>Broadcaster</code> trait 정의</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-xs font-mono">buffered/engine.rs</p>
              <p className="text-[11px] text-muted-foreground mt-1">범용 버퍼 엔진</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-xs font-mono">ordered_broadcast/</p>
              <p className="text-[11px] text-muted-foreground mt-1"><code>engine.rs</code> · <code>ack_manager.rs</code> · <code>tip_manager.rs</code> · <code>types.rs</code></p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-xs font-mono">zoda/</p>
              <p className="text-[11px] text-muted-foreground mt-1"><code>scheme.rs</code> · <code>validating_scheme.rs</code> · <code>phased_scheme.rs</code></p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">설계 결정 & 비교</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">핵심 설계 결정</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">Trait 기반</p>
                <p className="text-[11px] text-muted-foreground"><code>Broadcaster</code> trait → 다중 엔진 구현 가능</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">Async-first</p>
                <p className="text-[11px] text-muted-foreground"><code>oneshot</code> 채널로 비동기 응답 전달</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">버퍼링</p>
                <p className="text-[11px] text-muted-foreground">메시지 큐잉 후 네트워크 정책에 따라 flush</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">Content-addressed</p>
                <p className="text-[11px] text-muted-foreground">인증서가 데이터를 해시로 참조</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">Epoch 기반</p>
                <p className="text-[11px] text-muted-foreground">서명은 epoch 윈도우 내에서만 유효</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">유사 시스템 비교</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Narwhal (Mysten)</p>
                <p className="text-[11px] text-muted-foreground mt-1">DAG 기반 브로드캐스트 · 멤풀 분리 · 유사 철학</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Sui Consensus</p>
                <p className="text-[11px] text-muted-foreground mt-1">Narwhal DAG 위 Bullshark · 프로덕션 DAG 합의</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Celestia DA</p>
                <p className="text-[11px] text-muted-foreground mt-1">RS 코딩 blob · 라이트 클라이언트 샘플링 · 독립 DA</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Commonware</p>
                <p className="text-[11px] text-muted-foreground mt-1">모듈 라이브러리(독립 체인 아님) · Rust-first · 성능 중심</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">활용 사례</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">커스텀 L1</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">롤업 시퀀서</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">DA 레이어</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">순서화 브로드캐스트</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
