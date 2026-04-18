import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import AppLifecycleViz from './viz/AppLifecycleViz';
import { LIFECYCLE_CODE, LIFECYCLE_ANNOTATIONS, LEGACY_VS_ABCIPP, LEGACY_ANNOTATIONS } from './AppLifecycleData';
import type { CodeRef } from '@/components/code/types';

export default function AppLifecycle({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="app-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">애플리케이션 생명주기</h2>
      <div className="not-prose mb-8"><AppLifecycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ABCI++ (v0.38+)에서 블록 생명주기는 4단계로 구성됩니다.
          <br />
          <strong>PrepareProposal → ProcessProposal → FinalizeBlock → Commit</strong> 순서로 실행됩니다.
          <br />
          레거시 ABCI의 BeginBlock/DeliverTx/EndBlock을 FinalizeBlock 하나로 통합했습니다.
          <br />
          앱이 블록 구성과 투표 확장(Vote Extension)을 직접 제어할 수 있습니다.
        </p>
        <CitationBlock source="CometBFT ABCI++ Spec" citeKey={7} type="paper" href="https://docs.cometbft.com/v0.38/spec/abci/">
          <p className="italic">"ABCI++ gives the application more control over block construction and vote extensions"</p>
          <p className="mt-2 text-xs">ABCI++의 핵심 변화: 앱이 블록 내용을 결정하고, 투표에 임의 데이터를 첨부할 수 있습니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 생명주기 상세</h3>
        <CodePanel title="ABCI++ 블록 실행 6단계" code={LIFECYCLE_CODE} annotations={LIFECYCLE_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">레거시 vs ABCI++ 비교</h3>
        <CodePanel title="ABCI 진화: 개별 호출 → 통합" code={LEGACY_VS_ABCIPP} annotations={LEGACY_ANNOTATIONS} />

        {/* ── Vote Extension ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Vote Extension — ABCI++ 핵심 기능</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">Vote Extension 용도</p>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Oracle data</strong> — validator가 외부 가격 서명</p>
              <p><strong className="text-foreground">MEV-resistant ordering</strong> — TX 순서 제안</p>
              <p><strong className="text-foreground">Cross-chain data</strong> — 다른 체인 상태 증명</p>
              <p><strong className="text-foreground">Threshold encryption</strong> — 암호화된 TX 복호화 share</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">Vote Extension 흐름</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">1.</strong> <code>ExtendVote(height)</code> → app이 extension 생성</p>
              <p><strong className="text-foreground">2.</strong> <code>VerifyVoteExtension(ext)</code> → 다른 validator의 ext 검증</p>
              <p><strong className="text-foreground">3.</strong> <code>Vote</code>에 extension 포함 → BLS 서명</p>
              <p><strong className="text-foreground">4.</strong> 다음 블록의 <code>PrepareProposal</code>에서 사용 가능</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3"><code>Vote.Extension []byte</code> — app-specific data / <code>Vote.ExtensionSignature []byte</code> — 별도 서명</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>ExtendVote</code> 예시</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>외부 oracle에서 BTC 가격 가져오기</p>
                <p><code>app.oracle.GetBTCPrice()</code> → encode → <code>ResponseExtendVote&#123;VoteExtension: data&#125;</code></p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>VerifyVoteExtension</code> 예시</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>sanity check: <code>btcPrice &lt; 10000 || &gt; 200000</code> → REJECT</p>
                <p>통과 → <code>ACCEPT</code></p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">실전 활용 — dYdX v4</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>orderbook 상태를 validator가 투표에 포함</li>
              <li>MEV 공격 방어 (cross-validator ordering)</li>
              <li>다음 블록 <code>PrepareProposal</code>에서 통합</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <strong>Vote Extension</strong>이 ABCI++의 핵심 기능.<br />
          Oracle, MEV 방어, cross-chain 데이터 등 validator 협력 가능.<br />
          dYdX v4, Skip MEV 등에서 실전 활용.
        </p>
      </div>
    </section>
  );
}
