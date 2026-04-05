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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Vote Extension: validator가 Precommit에 임의 데이터 첨부
// ABCI++ (v0.38+)의 가장 큰 변화

// Extension 용도:
// 1. Oracle data: validator가 외부 가격 서명
// 2. MEV-resistant ordering: TX 순서 제안
// 3. Cross-chain data: 다른 체인 상태 증명
// 4. Threshold encryption: 암호화된 TX 복호화 share

// Flow:
// 1. ExtendVote(height) → app이 extension 생성
// 2. VerifyVoteExtension(ext) → 다른 validator의 ext 검증
// 3. Vote에 extension 포함 → BLS 서명
// 4. 다음 블록의 PrepareProposal에서 사용 가능

// 구조:
type Vote struct {
    // ... 기존 필드 ...
    Extension          []byte  // app-specific data
    ExtensionSignature []byte  // 별도 서명
}

// ExtendVote (app 구현):
func (app *MyApp) ExtendVote(
    req abci.RequestExtendVote,
) abci.ResponseExtendVote {
    // 예: 외부 oracle에서 BTC 가격 가져오기
    btcPrice := app.oracle.GetBTCPrice()
    data := encode(btcPrice)

    return abci.ResponseExtendVote{
        VoteExtension: data,
    }
}

// VerifyVoteExtension:
func (app *MyApp) VerifyVoteExtension(
    req abci.RequestVerifyVoteExtension,
) abci.ResponseVerifyVoteExtension {
    btcPrice := decode(req.VoteExtension)

    // sanity check
    if btcPrice < 10000 || btcPrice > 200000 {
        return abci.ResponseVerifyVoteExtension{
            Status: abci.ResponseVerifyVoteExtension_REJECT,
        }
    }
    return abci.ResponseVerifyVoteExtension{
        Status: abci.ResponseVerifyVoteExtension_ACCEPT,
    }
}

// Real-world 사용 (dYdX v4):
// - orderbook 상태 validator가 투표에 포함
// - MEV 공격 방어 (cross-validator ordering)
// - 다음 블록 PrepareProposal에서 통합`}
        </pre>
        <p className="leading-7">
          <strong>Vote Extension</strong>이 ABCI++의 핵심 기능.<br />
          Oracle, MEV 방어, cross-chain 데이터 등 validator 협력 가능.<br />
          dYdX v4, Skip MEV 등에서 실전 활용.
        </p>
      </div>
    </section>
  );
}
