import { codeRefs } from './codeRefs';
import PrepareProposalViz from './viz/PrepareProposalViz';
import ProcessProposalViz from './viz/ProcessProposalViz';
import type { CodeRef } from '@/components/code/types';

export default function PrepareProcess({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="prepare-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PrepareProposal & ProcessProposal</h2>

      {/* ── PrepareProposal 구현 ── */}
      <h3 className="text-lg font-semibold mb-3 mt-6">PrepareProposal 코드 추적</h3>
      <div className="not-prose mb-8">
        <PrepareProposalViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proposer만 호출하는 함수
// app이 block 내용을 결정할 기회

// Request:
type RequestPrepareProposal struct {
    MaxTxBytes          int64
    Txs                 [][]byte        // mempool TX 후보
    LocalLastCommit     ExtendedCommitInfo
    Misbehavior         []Misbehavior
    Height              int64
    Time                time.Time
    NextValidatorsHash  []byte
    ProposerAddress     []byte
}

// Response:
type ResponsePrepareProposal struct {
    Txs [][]byte  // 앱이 선택한 최종 TX 목록
}

// 앱이 할 수 있는 것:
// 1. TX 제거 (mempool에서 필터링)
// 2. TX 순서 변경 (MEV-resistant ordering)
// 3. TX 추가 (oracle data, cross-chain 등)
// 4. MaxTxBytes 준수

// Cosmos SDK 기본 구현:
func (app *BaseApp) DefaultPrepareProposal(
    ctx sdk.Context,
    req *abci.RequestPrepareProposal,
) (*abci.ResponsePrepareProposal, error) {
    txs := [][]byte{}
    totalBytes := int64(0)

    // 1. mempool TX 순회
    for _, tx := range req.Txs {
        // 2. 크기 체크
        if totalBytes + int64(len(tx)) > req.MaxTxBytes {
            break
        }

        // 3. 유효성 재검증 (안전하게)
        if err := app.validateTx(ctx, tx); err != nil {
            continue  // skip invalid
        }

        txs = append(txs, tx)
        totalBytes += int64(len(tx))
    }

    return &abci.ResponsePrepareProposal{Txs: txs}, nil
}

// dYdX의 PrepareProposal:
// - orderbook 상태 포함
// - MEV 공격 방어 순서
// - oracle 가격 주입

// Skip MEV의 PrepareProposal:
// - vote extension에서 받은 ordering 적용
// - block builder와 통합`}
        </pre>
        <p className="leading-7">
          PrepareProposal이 <strong>proposer의 block 구성 권한</strong>.<br />
          TX 필터링/재정렬/추가 자유롭게 — app이 block 내용 결정.<br />
          dYdX, Skip MEV 등이 적극 활용.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 제안자만 PrepareProposal을 호출</strong> — 앱이 TX 순서 변경, 필터링, 추가 가능.<br />
          나머지 검증자는 ProcessProposal로 제안을 검증.
        </p>
      </div>

      {/* ── ProcessProposal ── */}
      <h3 className="text-lg font-semibold mb-3 mt-8">ProcessProposal 코드 추적</h3>
      <div className="not-prose mb-8">
        <ProcessProposalViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 모든 validator (proposer 포함)가 호출
// 제안된 block 검증

// Request/Response:
type RequestProcessProposal struct {
    Txs                 [][]byte
    ProposedLastCommit  CommitInfo
    Misbehavior         []Misbehavior
    Hash                []byte
    Height              int64
    Time                time.Time
    NextValidatorsHash  []byte
    ProposerAddress     []byte
}

type ResponseProcessProposal struct {
    Status ResponseProcessProposal_ProposalStatus
    // ACCEPT or REJECT
}

// Cosmos SDK 기본 구현:
func (app *BaseApp) DefaultProcessProposal(
    ctx sdk.Context,
    req *abci.RequestProcessProposal,
) (*abci.ResponseProcessProposal, error) {
    // 1. 모든 TX 재검증
    for _, tx := range req.Txs {
        if err := app.validateTx(ctx, tx); err != nil {
            return &abci.ResponseProcessProposal{
                Status: REJECT,
            }, nil
        }
    }

    return &abci.ResponseProcessProposal{Status: ACCEPT}, nil
}

// REJECT 시나리오:
// - invalid TX 포함
// - 허용되지 않은 TX 순서
// - app-specific rule 위반
// - vote extension mismatch

// 결과:
// ACCEPT → validator가 prevote(block_hash)
// REJECT → validator가 prevote(nil)
// 2/3+ REJECT → round 실패 → 다음 round

// 경제적 게임:
// - 정직한 proposer: accept 받도록 합리적 block
// - 악의 proposer: accept 못 받으면 proposal reward 없음
// - 충분한 REJECT → proposer 슬래싱 가능성 (jail)`}
        </pre>
        <p className="leading-7">
          ProcessProposal이 <strong>validator의 block 검증 권한</strong>.<br />
          ACCEPT/REJECT 선택 → prevote 결정.<br />
          2/3+ REJECT → round 실패 → 악의 proposer 처벌.
        </p>

        <p className="text-sm border-l-2 border-sky-500/50 pl-3 mt-4">
          <strong>💡 REJECT 시 nil prevote</strong> — 충분한 노드가 거부하면 해당 라운드 타임아웃, 다음 라운드로 진행.
        </p>
      </div>
    </section>
  );
}
