import { codeRefs } from './codeRefs';
import FinalizeBlockViz from './viz/FinalizeBlockViz';
import CommitViz from './viz/CommitViz';
import type { CodeRef } from '@/components/code/types';

export default function FinalizeCommit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="finalize-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FinalizeBlock & Commit</h2>

      <h3 className="text-lg font-semibold mb-3">FinalizeBlock — 블록 실행</h3>
      <div className="not-prose mb-6"><FinalizeBlockViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── FinalizeBlock 구조 ── */}
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// FinalizeBlock: 모든 TX를 한 번에 실행

// Request:
type RequestFinalizeBlock struct {
    Txs                [][]byte
    DecidedLastCommit  CommitInfo
    Misbehavior        []Misbehavior
    Hash               []byte
    Height             int64
    Time               time.Time
    NextValidatorsHash []byte
    ProposerAddress    []byte
}

// Response:
type ResponseFinalizeBlock struct {
    Events            []Event       // module events
    TxResults         []*ExecTxResult
    ValidatorUpdates  []ValidatorUpdate  // validator 변경
    ConsensusParamUpdates *ConsensusParams
    AppHash           []byte        // new state root
}

// Cosmos SDK의 FinalizeBlock 구현:
func (app *BaseApp) FinalizeBlock(
    req *abci.RequestFinalizeBlock,
) (*abci.ResponseFinalizeBlock, error) {
    // 1. BeginBlock (module hooks)
    res := app.BeginBlock(req)

    // 2. 각 TX 실행
    txResults := []*ExecTxResult{}
    for _, tx := range req.Txs {
        result := app.DeliverTx(tx)
        txResults = append(txResults, result)
    }

    // 3. EndBlock (module hooks + validator updates)
    res = app.EndBlock(req)

    // 4. State root 계산
    appHash := app.ComputeAppHash()

    return &abci.ResponseFinalizeBlock{
        Events: res.Events,
        TxResults: txResults,
        ValidatorUpdates: res.ValidatorUpdates,
        ConsensusParamUpdates: res.ConsensusParamUpdates,
        AppHash: appHash,
    }, nil
}

// ABCI 1.0 대비 차이:
// 이전: BeginBlock + N × DeliverTx + EndBlock (N+2 호출)
// ABCI 2.0: FinalizeBlock 1회 (더 효율적)
//
// 이유:
// - consensus overhead 감소
// - app이 전체 block 한꺼번에 처리
// - parallel TX execution 가능성`}
        </pre>
        <p className="leading-7">
          FinalizeBlock이 <strong>ABCI 2.0의 핵심 통합 메서드</strong>.<br />
          모든 TX를 한 번에 처리 → overhead 감소 + 병렬화 여지.<br />
          ValidatorUpdates 반환 → 다음 validator set 결정.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4 mb-8">
          <strong>💡 ABCI v2 핵심 변경</strong> — BeginBlock/DeliverTx/EndBlock을 FinalizeBlock 하나로 통합.<br />
          앱은 모든 TX를 한 번에 받아 처리, TxResults + ValidatorUpdates + AppHash 반환.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">Commit — 상태 영구 저장</h3>
      <div className="not-prose mb-6"><CommitViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Commit: app state를 디스크에 영구 저장

// Request: empty
// Response:
type ResponseCommit struct {
    RetainHeight int64  // 이 높이 이하 pruning 가능
}

// Cosmos SDK 구현:
func (app *BaseApp) Commit() (*abci.ResponseCommit, error) {
    // 1. IAVL tree write (pending changes → disk)
    header := app.cms.Commit()

    // 2. State version tracking
    // app.lastCommitID = header

    // 3. Pruning hint
    retainHeight := app.calculateRetainHeight(header.Height)

    // 4. Event 발행 (subscribers)
    app.eventBus.Publish(CommittedBlockEvent{
        Height: header.Height,
        Hash: header.Hash,
    })

    return &abci.ResponseCommit{
        RetainHeight: retainHeight,
    }, nil
}

// 순서 중요성:
// 1. App.Commit() 먼저 (disk write)
// 2. CometBFT state.Save() 나중
//
// 역순이면:
// - CometBFT가 "block N 저장됨" 믿음
// - App crash → state 미저장
// - 재시작 시 CometBFT는 다음 block 요청
// - App은 prev state 모름 → inconsistency!

// 정순이면:
// - App이 disk에 저장 완료
// - CometBFT가 그 다음 저장
// - 어느 시점에 crash해도 복구 가능
// - App 저장 직후 crash → CometBFT replay → 중복 저장 (idempotent)

// Pruning:
// RetainHeight 이하 block은 cometbft가 prune 가능
// app이 "이 높이까지 필요" 알림
// archive node: retain_height = 0 (전체 유지)`}
        </pre>
        <p className="leading-7">
          Commit이 <strong>app state를 disk에 영구 저장</strong>.<br />
          App.Commit → CometBFT.Save 순서 중요 (crash safety).<br />
          RetainHeight로 cometbft pruning 힌트 제공.
        </p>

        <p className="text-sm border-l-2 border-sky-500/50 pl-3 mt-4">
          <strong>💡 Commit 순서</strong> — 앱 Commit() 후에 CometBFT state.Save() 호출.<br />
          역순이면 크래시 복구 시 앱/CometBFT 상태 불일치 발생.
        </p>
      </div>
    </section>
  );
}
