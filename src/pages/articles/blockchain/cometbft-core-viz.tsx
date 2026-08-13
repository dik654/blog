import {
  DistributedFrame,
  Flow,
  Ledger,
} from "./distributed-systems/viz/DistributedVizPrimitives";

const FLOWS = {
  types: {
    eyebrow: "WIRE EVIDENCE",
    title: "합의 객체는 bytes가 아니라 검증 가능한 증거 사슬입니다",
    description:
      "Block header의 commitment와 validator의 canonical signature가 commit certificate를 만들고, 검증된 misbehavior만 evidence pipeline으로 들어갑니다.",
    note: "필드 이름보다 chain ID·height·round·type·BlockID가 어느 서명과 commitment에 묶이는지 먼저 확인합니다.",
    steps: [
      { label: "01 INPUT", title: "Block candidate", body: "Header가 data·evidence·이전 commit·application result의 digest를 묶습니다." },
      { label: "02 SIGN", title: "Canonical vote", body: "Validator가 chain·height·round·phase·BlockID를 고정한 sign bytes에 서명합니다." },
      { label: "03 QUORUM", title: "Commit certificate", body: "현재 validator set에서 같은 BlockID의 precommit voting power를 집계합니다." },
      { label: "04 VERIFY", title: "Next-height evidence", body: "Commit과 header commitment가 다음 block 검증과 light verification의 입력이 됩니다." },
    ],
  },
  block: {
    eyebrow: "COMMITMENT PIPELINE",
    title: "Header는 큰 payload를 다음 높이의 짧은 검증 입력으로 바꿉니다",
    description:
      "현재 block의 data와 evidence, 이전 높이의 commit·application result를 canonical encoding과 digest로 연결합니다.",
    note: "AppHash와 LastResultsHash는 현재 transaction을 실행하기 전 header에 이미 들어갈 수 없으므로 한 높이 늦게 연결됩니다.",
    steps: [
      { label: "01 ENCODE", title: "Canonical fields", body: "Version·chain·height와 각 하위 객체를 정해진 schema로 encoding합니다." },
      { label: "02 COMMIT", title: "Merkle commitments", body: "Data·evidence·validator set·last commit의 digest를 계산합니다." },
      { label: "03 BIND", title: "Header hash", body: "필드 순서와 encoding까지 포함한 하나의 block identity를 만듭니다." },
      { label: "04 CHECK", title: "State validation", body: "이전 state와 last block을 이용해 height·hash·validator·time을 검증합니다." },
    ],
  },
  votes: {
    eyebrow: "SIGNED QUORUM",
    title: "VoteSet은 서명 개수가 아니라 voting power와 충돌 여부를 집계합니다",
    description:
      "서명을 먼저 검증하고 validator index로 중복을 막은 뒤 BlockID별 power를 더해야 certificate를 안전하게 해석할 수 있습니다.",
    note: "Absent·nil·commit은 서로 다른 상태이며, vote extension도 기본 vote와 별도의 canonical bytes와 검증 계약을 가집니다.",
    steps: [
      { label: "01 PARSE", title: "Vote coordinates", body: "Type·height·round·BlockID·validator identity를 현재 state와 대조합니다." },
      { label: "02 VERIFY", title: "Signature", body: "Chain ID가 포함된 canonical sign bytes와 validator public key를 검증합니다." },
      { label: "03 DEDUPE", title: "One slot per validator", body: "같은 좌표의 두 BlockID는 정상 집계가 아니라 equivocation 후보로 분리합니다." },
      { label: "04 SUM", title: "> 2/3 power", body: "같은 block에 threshold를 넘긴 precommit만 commit certificate가 됩니다." },
    ],
  },
  validators: {
    eyebrow: "WEIGHTED SCHEDULING",
    title: "Validator set은 quorum weight와 proposer rotation을 함께 운반합니다",
    description:
      "Voting power는 certificate threshold에 쓰이고 proposer priority는 여러 round에 걸친 제안 기회를 공정하게 배분하는 scheduler state입니다.",
    note: "Proposer priority는 합의 증거 자체가 아니며 set update와 overflow rescaling은 선택한 release source에서 확인합니다.",
    steps: [
      { label: "01 LOAD", title: "Validator snapshot", body: "Height에 대응하는 address·public key·voting power를 불러옵니다." },
      { label: "02 ADD", title: "Accumulate power", body: "각 priority에 자신의 voting power를 더해 제안 기회를 누적합니다." },
      { label: "03 PICK", title: "Highest priority", body: "가장 높은 validator를 proposer로 선택하고 tie-break rule을 적용합니다." },
      { label: "04 SUBTRACT", title: "Pay total power", body: "선택된 priority에서 total power를 빼 다음 round의 균형을 만듭니다." },
    ],
  },
  consensus: {
    eyebrow: "CONSENSUS STATE MACHINE",
    title: "한 height는 여러 round를 거치되 commit은 하나의 block으로 수렴합니다",
    description:
      "Event loop가 proposal·vote·timeout을 직렬화하고, validator는 lock evidence를 보존하면서 Propose→Prevote→Precommit을 반복합니다.",
    note: "Timeout은 결정을 증명하지 않습니다. 더 높은 round로 이동할 기회를 만들 뿐이며 safety는 signed quorum과 lock rule에서 나옵니다.",
    steps: [
      { label: "01 PROPOSE", title: "Proposal + valid round", body: "지정 proposer가 block과 알고 있는 proof-of-lock round를 보냅니다." },
      { label: "02 PREVOTE", title: "Validate or nil", body: "Lock과 proposal validity를 확인해 block 또는 nil에 prevote합니다." },
      { label: "03 PRECOMMIT", title: "Lock or nil", body: "+2/3 prevote evidence가 있으면 lock을 갱신하고 precommit합니다." },
      { label: "04 COMMIT", title: "+2/3 precommit", body: "같은 block의 precommit certificate를 확인한 뒤 결정하고 다음 height로 갑니다." },
    ],
  },
  queues: {
    eyebrow: "EVENT SERIALIZATION",
    title: "Network 수신과 consensus state 변경 사이에는 검증된 event queue가 있습니다",
    description:
      "Peer message·내부 message·timeout을 곧바로 state에 쓰지 않고 현재 H/R/S와 signature·shape를 검사한 event로 직렬화합니다.",
    note: "Queue arrival은 acceptance나 state transition의 증거가 아닙니다. Stale timeout과 future message에는 별도 정책이 필요합니다.",
    steps: [
      { label: "01 RECEIVE", title: "Peer / internal / timer", body: "서로 다른 producer가 proposal·block part·vote·timeout을 보냅니다." },
      { label: "02 ADMIT", title: "Cheap validation", body: "Size·type·peer quota와 기본 signature·coordinate를 확인합니다." },
      { label: "03 SERIALIZE", title: "Consensus loop", body: "한 owner가 event를 읽고 H/R/S transition을 순서대로 적용합니다." },
      { label: "04 EMIT", title: "Vote / step / metric", body: "새 message와 durable WAL·관측 event를 state transition에 연결합니다." },
    ],
  },
  timeout: {
    eyebrow: "LIVENESS CONTROL",
    title: "Round timeout은 느린 정상 message를 기다릴 예산을 점차 늘립니다",
    description:
      "Propose·prevote·precommit timer를 round와 step에 묶고, 만료 event가 현재 state와 정확히 일치할 때만 다음 step으로 이동합니다.",
    note: "Network가 계속 비동기면 timeout을 늘려도 termination은 보장되지 않습니다. GST 이후 bounded delay라는 전제가 필요합니다.",
    steps: [
      { label: "01 SCHEDULE", title: "Bind H/R/S", body: "Timer에 height·round·step과 deadline을 함께 기록합니다." },
      { label: "02 WAIT", title: "Votes may arrive", body: "Threshold evidence가 먼저 오면 다음 transition으로 진행합니다." },
      { label: "03 EXPIRE", title: "Recheck coordinates", body: "이미 높은 state라면 늦게 도착한 timeout을 무시합니다." },
      { label: "04 ADVANCE", title: "Increase waiting budget", body: "증거를 버리지 않고 다음 round의 timer를 다시 예약합니다." },
    ],
  },
  abci: {
    eyebrow: "APPLICATION HANDOFF",
    title: "ABCI++는 후보 상태와 확정 상태를 분리하는 request·response 계약입니다",
    description:
      "Proposal hook은 후보를 만들고 검사하며, 합의된 block만 FinalizeBlock과 Commit을 거쳐 application의 durable state가 됩니다.",
    note: "CheckTx PASS·PrepareProposal output·ProcessProposal ACCEPT는 모두 application commit receipt가 아닙니다.",
    steps: [
      { label: "01 CANDIDATE", title: "PrepareProposal", body: "Proposer application이 byte limit 안에서 candidate transaction list를 구성합니다." },
      { label: "02 CHECK", title: "ProcessProposal", body: "모든 validator application이 같은 proposal을 deterministic하게 ACCEPT/REJECT합니다." },
      { label: "03 EXECUTE", title: "FinalizeBlock", body: "Decided block을 prior committed state에 적용해 results·updates·AppHash를 계산합니다." },
      { label: "04 PERSIST", title: "Commit", body: "Application이 state를 durable하게 저장하고 restart recovery의 기준 height를 남깁니다." },
    ],
  },
  connections: {
    eyebrow: "LOGICAL CONNECTIONS",
    title: "ABCI transport보다 중요한 것은 연결별 state와 ordering입니다",
    description:
      "Consensus·mempool·query·snapshot 요청은 목적과 동시성 규칙이 다르므로 한 application process 안에서도 상태 owner를 구분합니다.",
    note: "Local·socket·gRPC 같은 transport 선택이 deterministic execution이나 crash atomicity를 자동 보장하지 않습니다.",
    steps: [
      { label: "01 CONSENSUS", title: "Candidate / decided state", body: "Proposal hook과 FinalizeBlock·Commit ordering을 유지합니다." },
      { label: "02 MEMPOOL", title: "CheckTx view", body: "Committed state가 바뀌면 pending transaction을 다시 검사할 수 있습니다." },
      { label: "03 QUERY", title: "Committed reads", body: "합의 중인 candidate가 아니라 명시한 committed height를 읽습니다." },
      { label: "04 SNAPSHOT", title: "Restore boundary", body: "Chunk 자체보다 trusted AppHash와 restored height의 일치를 검증합니다." },
    ],
  },
  recovery: {
    eyebrow: "CRASH RECOVERY",
    title: "FinalizeBlock 결과와 Commit receipt를 분리해야 재시작 위치를 정할 수 있습니다",
    description:
      "CometBFT block·state persistence와 application durable state가 중간에 갈라질 수 있으므로 저장된 artifact를 대조해 replay합니다.",
    note: "External side effect는 이 복구 계약 밖에 있으므로 outbox와 idempotency key가 별도로 필요합니다.",
    steps: [
      { label: "01 DECIDE", title: "Persist block", body: "Consensus가 결정한 block과 commit evidence를 저장합니다." },
      { label: "02 FINALIZE", title: "Persist results", body: "Application response와 AppHash를 CometBFT state에 연결합니다." },
      { label: "03 COMMIT", title: "Persist app state", body: "Application이 같은 height의 state를 durable하게 저장합니다." },
      { label: "04 RESTART", title: "Compare and replay", body: "Block·state·app height를 비교해 필요한 FinalizeBlock/Commit만 재실행합니다." },
    ],
  },
} as const;

export type CometBFTVizMode = keyof typeof FLOWS;

export default function CometBFTCoreViz({ mode }: { mode: CometBFTVizMode }) {
  const item = FLOWS[mode];
  return (
    <DistributedFrame eyebrow={item.eyebrow} title={item.title} description={item.description} note={item.note}>
      <Flow steps={item.steps} />
    </DistributedFrame>
  );
}

export function EvidenceLedgerViz() {
  return (
    <DistributedFrame
      eyebrow="ACCOUNTABILITY"
      title="탐지·검증·전파·포함·처벌은 서로 다른 단계입니다"
      description="두 conflicting signed votes는 객관적 입력이지만, 유효 기간·validator snapshot·중복 여부를 확인한 뒤에야 chain evidence가 됩니다."
      note="CometBFT는 evidence를 application에 전달합니다. 경제적 처벌 규칙은 application이 소유합니다."
    >
      <Ledger
        columns={4}
        items={[
          { label: "DETECT", title: "Conflicting objects", body: "같은 validator·height·round·type인데 BlockID가 다른 signed vote 두 개", example: "vote A ≠ vote B" },
          { label: "VERIFY", title: "Historical context", body: "당시 validator set·power·chain ID·signature·age를 검증", example: "snapshot @ height H" },
          { label: "COMMIT", title: "Evidence in block", body: "Gossip 후 아직 포함되지 않은 유효 evidence를 byte limit 안에서 block에 포함", example: "evidence hash → header" },
          { label: "APPLY", title: "Application policy", body: "FinalizeBlock misbehavior 입력을 보고 penalty·jailing 정책을 결정", example: "policy ≠ detection" },
        ]}
      />
    </DistributedFrame>
  );
}
