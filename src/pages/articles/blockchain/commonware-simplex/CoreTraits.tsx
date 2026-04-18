import StateRoundViz from './viz/StateRoundViz';
import MessageTypesViz from './viz/MessageTypesViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CoreTraits({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="core-traits" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Core Types: State · Round · Proposal</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Simplex의 상태 관리는 2단계 — State(에폭) → Round(뷰)
          <br />
          각 뷰의 투표·인증서·타임아웃을 Round가 독립 추적
        </p>
      </div>
      <div className="not-prose mb-8">
        <StateRoundViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">프로토콜 메시지 & Trait 분리</h3>
        <p className="leading-7">
          투표(개별 서명) → 인증서(2f+1 집합) 2단계 + Automaton·Relay·Reporter 분리
        </p>
      </div>
      <div className="not-prose">
        <MessageTypesViz onOpenCode={open} />
      </div>

      {/* Core Types & Traits structured cards */}
      <div className="not-prose mt-6">
        <h3 className="text-xl font-semibold mb-3">State, Round 및 Trait 구조</h3>

        {/* State hierarchy */}
        <div className="rounded-lg border border-border bg-card p-5 mb-4">
          <h4 className="font-semibold text-sm mb-2">상태 계층</h4>
          <p className="text-xs text-muted-foreground">
            <strong>Epoch</strong> — 설정 기간 (검증자 집합, 파라미터) · <strong>View (Round)</strong> — 단일 합의 시도 · <strong>Height</strong> — 블록체인 위치
          </p>
        </div>

        {/* State & Round structs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">State&lt;D: Digest&gt;</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">epoch: Epoch</code> — 현재 에폭</li>
              <li><code className="text-xs">current_view: View</code> — 현재 뷰</li>
              <li><code className="text-xs">rounds: BTreeMap&lt;View, Round&lt;D&gt;&gt;</code> — 뷰별 라운드</li>
              <li><code className="text-xs">finalized: Option&lt;(View, D)&gt;</code> — 확정 상태</li>
              <li><code className="text-xs">participants: Vec&lt;PublicKey&gt;</code> — 검증자 집합</li>
              <li><code className="text-xs">thresholds: Thresholds</code> — 비잔틴 임계값</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              에폭당: 고정 검증자 집합, 알려진 공개키, 고정 비잔틴 임계값(f). 뷰당: 별도 Round 구조체, 독립 투표 추적, 확정 후 정리(prune).
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">Round&lt;D: Digest&gt;</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">view: View</code> · <code className="text-xs">leader: PublicKey</code></li>
              <li><code className="text-xs">proposal: Option&lt;Proposal&lt;D&gt;&gt;</code></li>
              <li><code className="text-xs">notarizes: AttributableMap&lt;Notarize&lt;D&gt;&gt;</code></li>
              <li><code className="text-xs">nullifies: AttributableMap&lt;Nullify&gt;</code></li>
              <li><code className="text-xs">finalizes: AttributableMap&lt;Finalize&lt;D&gt;&gt;</code></li>
              <li><code className="text-xs">notarization / nullification / finalization</code> — 집계 인증서</li>
              <li><code className="text-xs">timeout: Option&lt;Instant&gt;</code></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              추적 대상: 개별 투표(각 검증자 서명), 집계 인증서(2f+1 서명), 타임아웃(진행 없을 시 view 전환).
            </p>
          </div>
        </div>

        {/* AttributableMap */}
        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2"><code className="text-sm">AttributableMap&lt;V&gt;</code></h4>
          <p className="text-xs text-muted-foreground">
            <code className="text-xs">by_signer: BTreeMap&lt;ValidatorIndex, V&gt;</code> — 검증자당 1표 보장 · 이중 투표(double-voting) 시 슬래싱 가능 · 쿼럼 도달 시 집계
          </p>
        </div>

        {/* Message types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">Message&lt;D&gt;</code> 열거형</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">Propose(Propose&lt;D&gt;)</code></li>
              <li><code className="text-xs">Notarize(Notarize&lt;D&gt;)</code></li>
              <li><code className="text-xs">Nullify(Nullify)</code></li>
              <li><code className="text-xs">Finalize(Finalize&lt;D&gt;)</code></li>
              <li><code className="text-xs">Certificate(Certificate&lt;D&gt;)</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">주요 메시지 구조체</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">Propose</code> — <code className="text-xs">view</code>, <code className="text-xs">parent: Option&lt;Certificate&gt;</code>, <code className="text-xs">payload: Bytes</code>, <code className="text-xs">proposer_sig</code></li>
              <li><code className="text-xs">Notarize</code> — <code className="text-xs">view</code>, <code className="text-xs">digest: D</code>, <code className="text-xs">signer: ValidatorIndex</code>, <code className="text-xs">signature</code></li>
            </ul>
          </div>
        </div>

        {/* Trait separation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">Automaton&lt;D&gt;</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">fn propose(view) → Bytes</code></li>
              <li><code className="text-xs">fn verify(view, payload) → bool</code></li>
              <li><code className="text-xs">fn genesis() → D</code></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-1">앱 로직 (블록 검증, VM, 정렬 등)</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">Relay</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">fn broadcast(message: Message)</code></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-1">네트워크 전송 추상화</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-sm">Reporter</code></h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><code className="text-xs">fn finalized(view, payload)</code></li>
              <li><code className="text-xs">fn notarized(view, payload)</code></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-1">관측 훅 (메트릭, 스토리지, 인덱싱)</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Trait 분리의 이점</h4>
          <p className="text-xs text-muted-foreground">
            합의 엔진이 제네릭 유지 · 서로 다른 앱이 동일 엔진 사용 · 테스트 용이 (mock traits) · 관심사 분리(SoC)
          </p>
        </div>

        {/* Certificate types */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Notarization</h4>
            <p className="text-xs text-muted-foreground">
              2f+1 Notarize 투표. 증명: 이 블록이 제안·수락됨. view 전진 가능.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Nullification</h4>
            <p className="text-xs text-muted-foreground">
              2f+1 Nullify 투표. 증명: 이 view에서 진행 실패. 블록 없이 view 전진.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Finalization</h4>
            <p className="text-xs text-muted-foreground">
              2f+1 Finalize 투표. 증명: 이 블록이 커밋됨. 상태 최종성(irreversible).
            </p>
          </div>
        </div>

        {/* Two-phase commit & Epoch rotation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">2-Phase Commit 패턴</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><strong>Phase 1 (Notarize):</strong> "view V에서 유효한 블록 X를 봤다" 서명 → 2f+1 → Notarization (아직 커밋 아님)</li>
              <li><strong>Phase 2 (Finalize):</strong> "view V의 블록 X를 커밋한다" 서명 → 2f+1 → Finalization (비가역)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Epoch 로테이션</h4>
            <p className="text-xs text-muted-foreground">
              설정 업데이트 (검증자 집합, 임계값) · 알려진 경계(N블록마다)에서 발생 · 새 Epoch으로 상태 전환 · 이전 에폭은 라이트 클라이언트 검증용으로 보관
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
