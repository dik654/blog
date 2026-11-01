import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { IpcFinalityViz } from "./IpcFinalityViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { ipcTree } from "./fileTrees";

const PARENT_CHILD =
  "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/docs-gitbook/concepts/subnets/parent-child-interactions.md";
const MEMBERSHIP =
  "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/specs/subnet-validator-membership.md";
const CHECKPOINT =
  "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/contracts/contracts/gateway/router/CheckpointingFacet.sol";
const FINALITY =
  "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/contracts/contracts/gateway/router/TopDownFinalityFacet.sol";
const FINALITY_PROVIDER =
  "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/fendermint/vm/topdown/src/finality/null.rs";
const IPC_REPO =
  "https://github.com/consensus-shipyard/ipc/tree/bcd7c0d10a93a95b6d28954d482169da4b12479d";
const STUCK_PARENT_FINALITY =
  "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/scripts/fix-parent-finality-stuck.md";

export default function ModernFilecoinIpc() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <article className="space-y-14">
        <section id="overview" className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              부모 체인 P 아래 자식 서브넷 C에서 Alice가 Bob에게 보내는 체인
              간 메시지 하나
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              자식 체인에서 성공해도 부모 체인의 처리는 아직 끝나지 않았습니다
            </h2>
          </header>
          <IpcFinalityViz />
          <p className="text-lg leading-8 text-foreground/90">
            IPC의 서브넷은 자체 검증자와 상태를 가진 별도 체인입니다. Alice가
            자식 체인에서 부모 체인의 Bob에게 토큰을 돌려보내면 자식 체인 실행,
            체크포인트 정족수 확보, 릴레이어 제출, 부모 체인 포함과 Bob의 잔액
            반영이 서로 다른 시점에 일어납니다.
          </p>
          <p>
            위에서 아래로 가는 top-down 경로도 이 과정을 거꾸로 재생한 것이
            아닙니다. 자식 체인의 검증자들이 어느 부모 블록을 믿을지 먼저 합의한
            뒤 그 구간의 메시지와 검증자 변경을 실행합니다. 부모 체인이 있다는
            사실만으로 자식 체인의 안전성과 가용성이 저절로 보장되지는 않습니다.
          </p>
          <aside className="border-l-4 border-destructive bg-destructive/5 p-4 text-sm leading-6">
            <strong>현재 프로젝트 경계:</strong> IPC 공식 저장소는 모든 module이
            충분한 감사와 심층 검증을 거치지 않았고 장애 복구 기능도 부족하므로
            메인넷이나 실제 가치가 있는 토큰에 사용하지 말라고 경고합니다. 이
            글은 구조를 설명할 뿐 운영 환경의 안전성을 주장하지 않습니다.{" "}
            <a
              className="font-semibold text-primary hover:underline"
              href={IPC_REPO}
            >
              pinned official README
            </a>
          </aside>
          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="실제 CheckpointingFacet 발췌"
              onClick={() => sidebar.open("ipc-subnet", codeRefs["ipc-subnet"])}
            />
          </div>
          <ContentBoundary article="filecoin-ipc" />
          <div id="paper-ipc-parent-child">
            <CitationBlock
              type="code"
              citeKey={1}
              source="IPC parent–child interactions · commit bcd7c0d"
              href={PARENT_CHILD}
            >
              <p>
                <strong>문제:</strong> Parent와 child가 validator changes,
                cross-network messages와 state checkpoints를 양방향으로 전달해야
                합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Pinned IPC documentation은
                checkpointing, parent finality, top-down queue와 bottom-up
                propagation의 역할을 구분합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> commit bcd7c0d의 docs와 matching
                contracts/Fendermint deployment configuration을 함께 고정합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 해당 IPC repository snapshot의
                parent–child architecture 설명에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Architecture가 모든 subnet의
                경제적 안전성, parent failure 내성 또는 고정 cross-network
                latency를 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="subnet-artifact" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · Subnet artifact
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              같은 subnet을 다시 띄우려면 무엇을 고정해야 할까요?
            </h2>
          </header>
          <p>
            Subnet을 “새 RPC URL”로만 다루면 어느 parent 아래 어떤 validator
            set이 합의하는지 알 수 없습니다. Parent subnet ID, route, chain ID,
            genesis state와 app hash, permission mode를 먼저 기록합니다.
          </p>
          <p>
            이어 validator 순서와 power, gateway·subnet actor 주소, contract
            commit과 node binary·config digest를 묶습니다. Genesis 전 변경과
            실행 후 top-down·bottom-up으로 반영된 power change도 구분합니다.
          </p>
          <ExplainedFormula
            question="한 validator update가 child quorum에 들어갔는지 어떻게 확인할까?"
            idea={
              <>
                서명자 수가 아니라 현재 admitted validator set의 voting power
                합을 threshold 함수와 비교합니다.
              </>
            }
            formula={String.raw`W_{sig}=\sum_{v\in V_{valid}}w_v,\qquad accept\iff W_{sig}\ge Q(P)`}
            annotatedFormula={String.raw`\underbrace{W_{sig}}_{\text{서명된 power}}=\sum_{v\in V_{valid}}\underbrace{w_v}_{\text{admitted power}},\qquad accept\iff W_{sig}\ge \underbrace{Q(P)}_{\text{배포된 quorum 함수}}`}
            operations={[
              {
                expression: String.raw`\sum_{v\in V_{valid}}w_v`,
                annotation: [
                  "서명자 수가 아니라 power를 더함",
                  "중복 signer는 한 번만, 같은 revision",
                  "3명이 80·10·10이면 두 명 수로 판단 불가",
                ],
              },
              {
                expression: String.raw`W_{sig}\ge Q(P)`,
                annotation: [
                  "배포된 IPC profile의 threshold와 비교",
                  "2/3 고정이 아니라 revision에서 읽음",
                ],
              },
            ]}
            terms={[
              {
                symbol: "W_{sig}",
                name: "Signed power",
                description:
                  "유효한 서로 다른 validator signatures의 voting power 합입니다.",
              },
              {
                symbol: "V_{valid}",
                name: "Valid signers",
                description:
                  "해당 height·membership revision에 속하고 signature 검증을 통과한 validators입니다.",
              },
              {
                symbol: "w_v",
                name: "Validator power",
                description: "Validator v의 admitted voting power입니다.",
              },
              {
                symbol: "P",
                name: "Total power",
                description:
                  "같은 membership revision에서 active validators의 전체 power입니다.",
              },
              {
                symbol: "Q(P)",
                name: "Quorum function",
                description:
                  "Deployed IPC contract·consensus profile이 정한 required power입니다.",
              },
              {
                symbol: "accept",
                name: "Quorum acceptance",
                description: "Exact threshold를 만족할 때만 1입니다.",
              },
            ]}
            assumptions={[
              "Duplicate signer를 한 번만 세고 membership revision과 checkpoint height를 고정합니다.",
              "Q(P)의 구체적 반올림·strictness는 deployed revision에서 읽으며 여기서 임의로 2/3으로 고정하지 않습니다.",
            ]}
            interpretation="Validator가 3명이어도 power가 80·10·10이면 두 명이라는 수만으로 quorum을 판단할 수 없습니다. Exact admitted power와 profile을 기록합니다."
          />
          <div id="paper-ipc-membership">
            <CitationBlock
              type="code"
              citeKey={2}
              source="IPC validator membership specification · commit bcd7c0d"
              href={MEMBERSHIP}
            >
              <p>
                <strong>문제:</strong> Parent에서 시작한 validator power
                changes를 child 기존 validator quorum이 확인하고 다시 parent에
                확정해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Pinned specification은 staged
                genesis, top-down capture, child acknowledgement와 bottom-up
                checkpoint round trip을 설명합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> Exact permission mode, active
                validator limit, deployed gateway/subnet actor revision과
                consensus membership을 사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> commit bcd7c0d의 validator
                membership design snapshot에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 문서의 design이 모든 배포의
                liveness, permissionless security 또는 고정 validator count를
                보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="topdown" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · Parent finality and top-down receipt
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Parent의 어느 block을 child가 믿어야 할까요?
            </h2>
          </header>
          <p>
            Parent finality proposal을 관찰했다는 사실과 child consensus가 이를
            block execution에 반영했다는 사실은 다릅니다. 먼저 이전·새 parent
            height와 block hash, 둘 사이의 연결을 확인합니다.
          </p>
          <p>
            이어 어느 top-down queue 범위를 가져왔는지, validator changes와
            child consensus block, 적용 결과를 남깁니다. 이미 commit한 height,
            parent cache가 아직 보지 못한 height와 같은 height의 다른 hash는
            거절합니다.
          </p>
          <aside className="border-l-4 border-primary bg-primary/5 p-4 text-sm leading-6">
            <strong>코드가 직접 소유하는 범위:</strong>{" "}
            <code>TopDownFinalityFacet</code>과 <code>LibGateway</code>는
            이전보다 높은 height만 저장하고 이전 finality를 호출자에게
            돌려줍니다. 두 hash의 일치와 parent view의 정당성은 facet 하나가
            아니라 child consensus와 finality provider가 확인해야 합니다. 아래
            식은 고정한 Fendermint provider의 proposal 검사와 storage
            transition을 함께 읽은 조건입니다.
          </aside>
          <ExplainedFormula
            question="Child validator는 parent finality proposal을 무엇과 비교할까?"
            idea={
              <>
                마지막 commit보다 높은 height인지, 그 height를 cache가 실제로
                보았는지, 제안 hash가 cache와 같은지 검사합니다.
              </>
            }
            formula={String.raw`Accept(F)\iff h_{old}<h\le h_{cache}\land H=CacheHash(h)`}
            annotatedFormula={String.raw`\underbrace{Accept(F)}_{\text{proposal 승인}}\iff \underbrace{h_{old}<h}_{\text{미commit height}}\land \underbrace{h\le h_{cache}}_{\text{cache가 본 범위}}\land \underbrace{H=CacheHash(h)}_{\text{같은 block hash}}`}
            operations={[
              {
                expression: String.raw`h_{old}<h\le h_{cache}`,
                annotation: [
                  "저장한 120보다 높고",
                  "trusted parent cache가 본 높이 이하여야 함",
                ],
              },
              {
                expression: String.raw`H=CacheHash(h)`,
                annotation: [
                  "제안된 121 hash를",
                  "cache의 121 hash와 직접 비교",
                ],
              },
            ]}
            terms={[
              {
                symbol: "F=(h,H)",
                name: "Proposed parent finality",
                description: "Child block이 제안한 parent height와 hash입니다.",
              },
              {
                symbol: "h_{old}",
                name: "Last committed height",
                description:
                  "Child가 이미 commit한 가장 최근 parent height입니다.",
              },
              {
                symbol: "h_{cache}",
                name: "Latest cached height",
                description:
                  "Configured parent source에서 cache가 확인한 최신 height입니다.",
              },
              {
                symbol: "H",
                name: "Proposed block hash",
                description: "Height h에 대해 제안된 parent block hash입니다.",
              },
              {
                symbol: "CacheHash(h)",
                name: "Observed block hash",
                description:
                  "같은 height에서 local parent cache가 보관한 hash입니다.",
              },
            ]}
            assumptions={[
              "Parent finality source, chain-head delay와 cache 범위는 configuration에 따라 달라집니다.",
              "해시 일치는 설정된 부모 체인 조회 결과와의 일치만 뜻하며, 부모 체인 전체의 경제적 최종성을 별도로 증명하지는 않습니다.",
            ]}
            interpretation="마지막 commit이 120이고 cache가 125까지 보았다면 121은 후보가 될 수 있습니다. 그러나 제안 hash가 cache의 121 hash와 다르면 validator는 proposal을 거절합니다."
          />
          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="Fendermint proposal 검사"
              onClick={() =>
                sidebar.open(
                  "ipc-finality-provider",
                  codeRefs["ipc-finality-provider"],
                )
              }
            />
            <CodeViewButton
              label="TopDownFinalityFacet 호출 경계"
              onClick={() =>
                sidebar.open("ipc-finality", codeRefs["ipc-finality"])
              }
            />
            <CodeViewButton
              label="LibGateway height guard"
              onClick={() =>
                sidebar.open(
                  "ipc-finality-storage",
                  codeRefs["ipc-finality-storage"],
                )
              }
            />
          </div>
          <div id="paper-ipc-finality-provider">
            <CitationBlock
              type="code"
              citeKey={3}
              source="Fendermint FinalityWithNull proposal check · commit bcd7c0d"
              href={FINALITY_PROVIDER}
            >
              <p>
                <strong>직접 확인한 검사:</strong> 마지막 commit보다 높은
                height, cache가 본 범위와 같은 height의 block hash를 차례로
                확인합니다.
              </p>
              <p>
                <strong>경계:</strong> 이 검사는 설정된 부모 체인 조회 결과와
                제안이 일치하는지만 보여 줍니다. 부모 체인 자체의 모든 최종성
                가정을 대신하지는 않습니다.
              </p>
            </CitationBlock>
          </div>
          <div id="paper-ipc-topdown">
            <CitationBlock
              type="code"
              citeKey={4}
              source="IPC TopDownFinalityFacet · commit bcd7c0d"
              href={FINALITY}
            >
              <p>
                <strong>문제:</strong> Parent finality와 그에 연결된 validator
                changes를 child gateway state에 순서 있게 적용해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Pinned contract source는 parent
                finality commit과 queued power changes 적용의 system-actor
                boundary를 구현합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> Matching diamond facets, LibGateway
                storage layout, system actor caller와 current membership state를
                사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 해당 Solidity snapshot의 gateway
                state transition에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Contract call 성공이 parent RPC
                truth, child consensus finality 또는 destination application
                success를 혼자 증명하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="bottomup" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · Bottom-up checkpoint receipt
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Child에서 확정된 message는 언제 parent에 도착할까요?
            </h2>
          </header>
          <p>
            Bottom-up checkpoint는 child의 state commitment, message batch와
            activity를 한 묶음으로 운반합니다. Signer와 power 검증 결과는 같은
            checkpoint identity와 membership revision에 결속해야 합니다.
          </p>
          <p>
            릴레이어는 이미 형성된 증거를 부모 체인으로 운반할 뿐 정족수를 만들지
            않습니다. 고정한 <code>CheckpointingFacet</code>도 암호학적 검증을
            통과한 체크포인트가 system actor 경계를 넘었다고 가정한 뒤 상태
            약속, 메시지 묶음과 활동 이벤트를 기록합니다. 실제 메시지는 별도의
            <code>execBottomUpMsgBatch</code> 경로에서 실행되므로 체크포인트 기록과
            Bob의 잔액 변화를 같은 완료 상태로 보면 안 됩니다.
          </p>
          <ExplainedFormula
            question="Cross-network message의 완료 시간은 왜 한 숫자로 단정할 수 없을까?"
            idea={
              <>
                각 독립 단계의 대기·처리 시간을 더하고 어느 단계까지를 완료로
                부르는지 receipt에 명시합니다.
              </>
            }
            formula={String.raw`T_{xnet}=T_{local}+T_{quorum}+T_{relay}+T_{parent}+T_{dest}`}
            annotatedFormula={String.raw`T_{xnet}=\underbrace{T_{local}}_{\text{source 포함}}+\underbrace{T_{quorum}}_{\text{checkpoint 서명}}+\underbrace{T_{relay}}_{\text{relayer 대기}}+\underbrace{T_{parent}}_{\text{parent 확정}}+\underbrace{T_{dest}}_{\text{목적지 실행}}`}
            operations={[
              {
                expression: String.raw`T_{local}+T_{quorum}`,
                annotation: [
                  "source 실행과 checkpoint quorum 수집",
                  "child quorum까지 8초 예시",
                ],
              },
              {
                expression: String.raw`T_{relay}+T_{parent}+T_{dest}`,
                annotation: [
                  "relayer 제출, parent 포함, 목적지 effect",
                  "relayer가 40초 대기하면 최소 48초",
                  "어느 단계를 완료로 볼지 receipt에 명시",
                ],
              },
            ]}
            terms={[
              {
                symbol: "T_{xnet}",
                name: "End-to-end time",
                description:
                  "Local submission부터 chosen destination effect까지의 wall time입니다.",
              },
              {
                symbol: "T_{local}",
                name: "Local inclusion",
                description:
                  "Source subnet에서 message가 실행·queue되는 시간입니다.",
              },
              {
                symbol: "T_{quorum}",
                name: "Checkpoint quorum",
                description:
                  "Checkpoint가 만들어지고 required validator power를 모으는 시간입니다.",
              },
              {
                symbol: "T_{relay}",
                name: "Relay delay",
                description:
                  "Eligible relayer가 parent transaction을 제출할 때까지의 시간입니다.",
              },
              {
                symbol: "T_{parent}",
                name: "Parent inclusion",
                description:
                  "Parent gateway가 checkpoint를 포함·확정하는 시간입니다.",
              },
              {
                symbol: "T_{dest}",
                name: "Destination execution",
                description:
                  "다음 subnet에서 message를 받아 최종 effect를 만드는 시간입니다.",
              },
            ]}
            assumptions={[
              "각 time은 같은 message ID와 monotonic timestamps로 측정합니다.",
              "Checkpoint period, load, fees, reorg와 relayer availability가 바뀌면 값도 바뀝니다.",
            ]}
            interpretation="Child quorum까지 8초여도 relayer가 40초 대기하면 parent receipt는 최소 48초 이후입니다. Source success를 destination success로 표시하면 안 됩니다."
          />
          <div id="paper-ipc-checkpoint">
            <CitationBlock
              type="code"
              citeKey={5}
              source="IPC CheckpointingFacet · commit bcd7c0d"
              href={CHECKPOINT}
            >
              <p>
                <strong>문제:</strong> Cryptographically verified child
                checkpoint를 parent gateway state와 message/activity batches에
                반영해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Pinned facet은 system-actor-only
                checkpoint commit, duplicate/height guards와
                state/message/activity events를 구현합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> Signature/quorum validation은 caller
                path에서 이미 수행되고 matching gateway storage layout과
                contract facets를 사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Parent gateway의 commitCheckpoint
                side-effect snapshot에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Facet 하나가 child quorum
                correctness, relayer liveness, parent finality 또는 destination
                execution을 모두 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="completion-boundary" className="space-y-6">
          <span id="release-gate" className="sr-only" aria-hidden="true" />
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 완료 상태의 경계
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              한 단계의 성공을 전체 완료로 올려 쓰면 안 됩니다
            </h2>
          </header>
          <p>
            같은 message에도 local 실행, checkpoint quorum, relayer 제출,
            parent의 canonical 포함과 destination effect라는 서로 다른 상태가
            생깁니다. 각 상태는 앞 단계를 전제로 하지만 뒤 단계까지 자동으로
            증명하지는 않습니다.
          </p>
          <p>
            예를 들어 quorum receipt가 있어도 relayer가 멈추면 parent receipt는
            생기지 않습니다. Parent transaction이 포함돼도 message batch 실행이
            실패하면 Bob의 effect는 아직 없습니다. 반대로 destination이 이미
            같은 nonce를 실행했다면 재전달은 중복 effect를 만들지 않아야 합니다.
          </p>
          <ExplainedFormula
            question="한 message가 최종 완료됐다고 말할 조건은 무엇일까?"
            idea={
              <>
                서로 다른 receipt 다섯 개를 같은 message identity로 연결하고,
                모두 성립할 때만 완료라고 부릅니다.
              </>
            }
            formula={String.raw`Complete(m)\iff L_m\land Q_m\land R_m\land P_m\land D_m`}
            annotatedFormula={String.raw`\underbrace{Complete(m)}_{\text{message }m\text{의 완료}}\iff \underbrace{L_m}_{\text{local}}\land \underbrace{Q_m}_{\text{quorum}}\land \underbrace{R_m}_{\text{relay}}\land \underbrace{P_m}_{\text{parent}}\land \underbrace{D_m}_{\text{destination}}`}
            operations={[
              {
                expression: String.raw`L_m\land Q_m\land R_m\land P_m\land D_m`,
                annotation: [
                  "같은 message ID의 receipt 다섯 개가",
                  "모두 참일 때만 완료",
                  "Q=1이어도 relay가 멈추면 P=0",
                ],
              },
            ]}
            terms={[
              {
                symbol: "Complete(m)",
                name: "Message completion",
                description:
                  "같은 message m의 destination effect까지 확인했을 때 참입니다.",
              },
              {
                symbol: "L_m",
                name: "Local receipt",
                description:
                  "Source subnet inclusion·execution과 queue message ID가 유효하면 1입니다.",
              },
              {
                symbol: "Q_m",
                name: "Quorum receipt",
                description:
                  "Exact membership에서 checkpoint power quorum이 유효하면 1입니다.",
              },
              {
                symbol: "R_m",
                name: "Relay receipt",
                description:
                  "Parent transaction이 expected checkpoint를 운반하면 1입니다.",
              },
              {
                symbol: "P_m",
                name: "Parent receipt",
                description:
                  "Gateway commit이 required confidence까지 canonical이면 1입니다.",
              },
              {
                symbol: "D_m",
                name: "Destination receipt",
                description:
                  "Destination이 같은 message를 한 번 실행하고 effect를 기록하면 1입니다.",
              },
            ]}
            assumptions={[
              "모든 receipt가 같은 canonical subnet route와 message nonce/hash를 사용합니다.",
              "각 boolean은 단순 로그 존재가 아니라 해당 단계의 정당성 검사를 통과했다는 뜻입니다.",
            ]}
            interpretation="Q=1이어도 relayer가 멈추거나 parent transaction이 canonical하지 않으면 P=0이므로 완료가 아닙니다. 이 식은 어떤 상태가 아직 남았는지 보여 주는 논리식이지, 자동 복구 절차를 정의하지 않습니다."
          />
          <div className="grid gap-px bg-border p-px md:grid-cols-2">
            <article className="bg-background p-5">
              <p className="text-xs font-black text-primary">Q=1, P=0</p>
              <h3 className="mt-2 text-base font-bold">
                Child 증거는 있지만 parent에는 없습니다
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Checkpoint quorum 뒤 relayer가 멈추거나 fee가 부족한 경우입니다.
                Child의 합의 결과는 남지만 parent inclusion과 Bob의 effect는
                아직 없습니다.
              </p>
            </article>
            <article className="bg-background p-5">
              <p className="text-xs font-black text-primary">P=1, D=0</p>
              <h3 className="mt-2 text-base font-bold">
                Parent 기록은 있지만 effect는 없습니다
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Checkpoint가 기록됐지만 message batch 실행이 실패한 경우입니다.
                Commit event와 destination state change는 서로 다른
                관측값입니다.
              </p>
            </article>
          </div>
          <div id="paper-ipc-parent-finality-stuck">
            <CitationBlock
              type="code"
              citeKey={6}
              source="IPC parent finality stuck 진단 · commit bcd7c0d"
              href={STUCK_PARENT_FINALITY}
            >
              <p>
                <strong>구체적인 실패:</strong> 공식 저장소의 진단 문서는
                child가 오래 멈춘 사이 public parent RPC의 lookback 범위를
                벗어나 parent finality가 전진하지 못한 사례를 설명합니다.
              </p>
              <p>
                <strong>보이는 결과:</strong> Parent finality와 cross-network
                fund flow는 멈출 수 있지만, 이것만으로 child local execution
                전체가 같은 방식으로 실패했다고 결론낼 수는 없습니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 고정 커밋에 포함된 운영 진단 문서의
                한 failure mode이며 모든 IPC 배포의 복구 절차를 뜻하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>
      </article>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ ipc: ipcTree }}
        projectMetas={{
          ipc: {
            id: "ipc",
            label: "IPC · Solidity",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
