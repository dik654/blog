import type { CodeRef } from "@/components/code/types";
import validatorsRaw from "./codebase/prysm/beacon-chain/core/helpers/validators_v7.go?raw";
import validatorProposeRaw from "./codebase/prysm/validator/client/validator_propose_v7.go?raw";
import beaconApiRaw from "./codebase/prysm/validator/client/beacon_api_v3.go?raw";
import parentRaw from "./codebase/prysm/beacon-chain/rpc/validator/beacon_parent_v7.go?raw";
import assemblyRaw from "./codebase/prysm/beacon-chain/rpc/validator/fulu_assembly_v7.go?raw";
import rootRaw from "./codebase/prysm/beacon-chain/rpc/validator/proposal_state_root_v7.go?raw";
import publishRaw from "./codebase/prysm/beacon-chain/rpc/validator/beacon_publish_v7.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "fulu-proposer-lookahead": {
    path: "beacon-chain/core/helpers/validators.go — Fulu lookahead와 proposer sampling",
    lang: "go",
    code: validatorsRaw,
    highlight: [4, 74],
    desc: "Prysm v7.3.1 · Fulu hot path의 lookahead 조회와 Electra식 16-bit precomputation",
    annotations: [
      { lines: [4, 20], color: "sky", note: "현재 epoch이면 slot modulo slots-per-epoch로 proposer lookahead를 바로 읽습니다." },
      { lines: [21, 41], color: "emerald", note: "Fulu 범위 밖에서는 seed·active indices로 proposer를 계산하는 fallback을 사용합니다." },
      { lines: [43, 74], color: "amber", note: "Electra 이후에는 16-bit random value와 fork별 최대 effective balance를 비교합니다." },
    ],
  },
  "validator-propose-request": {
    path: "validator/client/propose.go — ProposeBlock()와 signRandaoReveal()",
    lang: "go",
    code: validatorProposeRaw,
    highlight: [4, 82],
    desc: "Prysm v7.3.1 · key별 proposal lock, RANDAO 서명, candidate 요청, block 서명과 제출",
    annotations: [
      { lines: [9, 18], color: "sky", note: "같은 proposer role과 public key의 동시 실행을 한 validator process 안에서 직렬화합니다." },
      { lines: [13, 31], color: "emerald", note: "RANDAO reveal과 graffiti를 먼저 준비해 beacon node에 unsigned candidate를 요청합니다." },
      { lines: [33, 48], color: "amber", note: "돌아온 block root를 proposer domain으로 서명하고 local slashing-protection check를 실행합니다." },
      { lines: [50, 63], color: "violet", note: "Fulu block contents를 sidecar와 함께 제출 가능한 generic request로 묶습니다." },
    ],
  },
  "validator-sign-protect": {
    path: "validator/client/propose.go — sign block → SlashableProposalCheck → submit",
    lang: "go",
    code: validatorProposeRaw,
    highlight: [33, 63],
    desc: "Prysm v7.3.1 · proposer signature가 만들어진 뒤 local slashing gate를 거쳐 제출되는 순서",
    annotations: [
      { lines: [33, 44], color: "sky", note: "완성된 unsigned block을 proposer domain으로 서명합니다." },
      { lines: [46, 48], color: "rose", note: "SlashableProposalCheck가 실패하면 이미 만든 signature를 제출하지 않습니다." },
      { lines: [50, 63], color: "emerald", note: "통과한 Fulu signed block과 sidecar contents를 beacon node로 제출합니다." },
    ],
  },
  "beacon-api-v3": {
    path: "validator/client/beacon-api/get_beacon_block.go — beaconBlock()",
    lang: "go",
    code: beaconApiRaw,
    highlight: [4, 27],
    desc: "Prysm v7.3.1 · Fulu는 v3 GET, Gloas부터 v4 POST를 선택",
    annotations: [
      { lines: [11, 16], color: "sky", note: "RANDAO reveal과 32-byte graffiti를 query input으로 만듭니다." },
      { lines: [18, 20], color: "violet", note: "Gloas fork부터는 builder config body를 받는 v4 경로로 분기합니다." },
      { lines: [21, 27], color: "emerald", note: "Fulu는 /eth/v3/validator/blocks/{slot}의 SSZ 응답을 해석합니다." },
    ],
  },
  "beacon-parent": {
    path: "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — GetBeaconBlock() · getParentState()",
    lang: "go",
    code: parentRaw,
    highlight: [4, 42],
    desc: "Prysm v7.3.1 · proposer readiness, parent head/state와 proposer index 고정",
    annotations: [
      { lines: [4, 13], color: "rose", note: "Syncing 또는 execution-optimistic beacon node는 candidate를 만들지 않습니다." },
      { lines: [14, 32], color: "sky", note: "Proposer parent와 state를 구하고 slot·graffiti·RANDAO·parent를 empty block에 채웁니다." },
      { lines: [27, 32], color: "emerald", note: "Slot 353 state의 Fulu lookahead에서 proposer index를 다시 확인합니다." },
      { lines: [35, 42], color: "amber", note: "Fork choice를 갱신한 뒤 proposer head를 parent root로 사용합니다." },
    ],
  },
  "fulu-assembly": {
    path: "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — setPreGloasConsensusFields() · buildBlockFulu()",
    lang: "go",
    code: assemblyRaw,
    highlight: [4, 61],
    desc: "Prysm v7.3.1 · consensus pool 수집과 local·builder execution data 선택 뒤 root 계산",
    annotations: [
      { lines: [4, 26], color: "sky", note: "Eth1 data, attestations, deposits, slashings, exits, sync aggregate와 BLS changes를 body에 채웁니다." },
      { lines: [28, 32], color: "emerald", note: "Consensus field 수집은 execution payload 경로와 겹쳐 진행됩니다." },
      { lines: [32, 49], color: "amber", note: "Local payload를 먼저 요구하고 조건에 따라 builder bid를 조회합니다." },
      { lines: [49, 61], color: "violet", note: "Execution data를 고르고 consensus 수집과 합류한 뒤 post-state root를 채웁니다." },
    ],
  },
  "proposal-state-root": {
    path: "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — computePostBlockStateAndRoot()",
    lang: "go",
    code: rootRaw,
    highlight: [4, 64],
    desc: "Prysm v7.3.1 · parent state에서 candidate transition을 실행해 state_root 계산",
    annotations: [
      { lines: [4, 14], color: "emerald", note: "계산한 full post-state의 hash-tree-root를 block에 넣을 byte로 반환합니다." },
      { lines: [16, 30], color: "sky", note: "Parent root로 pre-state를 가져와 같은 block processing transition을 실행합니다." },
      { lines: [32, 38], color: "violet", note: "재시도 횟수는 context에 기록하며 최대 3회로 제한합니다." },
      { lines: [39, 64], color: "amber", note: "일부 pool operation 오류만 해당 목록을 비운 뒤 candidate 계산을 다시 시도합니다." },
    ],
  },
  "beacon-publish": {
    path: "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — ProposeBeaconBlock()",
    lang: "go",
    code: publishRaw,
    highlight: [4, 39],
    desc: "Prysm v7.3.1 · signed block identity 계산, local receive·gossip과 Fulu sidecar 전파",
    annotations: [
      { lines: [4, 15], color: "sky", note: "Signed block을 해석하고 제출 receipt에 사용할 block root를 계산합니다." },
      { lines: [17, 25], color: "emerald", note: "Fulu full block의 blob·data-column sidecar를 제출 request에서 복원합니다." },
      { lines: [27, 35], color: "violet", note: "Block은 local receive와 gossip 경로로, sidecar는 별도 broadcast/receive 경로로 보냅니다." },
      { lines: [37, 39], color: "amber", note: "반환 root는 제출 identity이며 head나 finality 결과가 아닙니다." },
    ],
  },
};
