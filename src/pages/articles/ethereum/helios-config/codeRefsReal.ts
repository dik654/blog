import type { CodeRef } from "@/components/code/types";
import configModRs from "./codebase/helios-0120/config-mod.rs?raw";
import networksMainnetRs from "./codebase/helios-0120/networks-mainnet.rs?raw";
import builderStartupRs from "./codebase/helios-0120/builder-startup.rs?raw";
import databaseRs from "./codebase/helios-0120/database.rs?raw";
import consensusStartupRs from "./codebase/helios-0120/consensus-startup.rs?raw";
import checkpointAgeRs from "./codebase/helios-0120/checkpoint-age.rs?raw";
import checkpointPluralityRs from "./codebase/helios-0120/checkpoint-plurality.rs?raw";
import clientNewRs from "./codebase/helios-0120/client-new.rs?raw";
import nodeReadinessRs from "./codebase/helios-0120/node-readiness.rs?raw";

const PINNED = "a16z/helios v0.12.0 · commit 2af9b418";

export const codeRefsReal: Record<string, CodeRef> = {
  "helios-config-merge": {
    path: "helios@v0.12.0/ethereum/src/config/mod.rs",
    code: configModRs,
    lang: "rust",
    highlight: [48, 63],
    desc: `질문: base network, TOML, CLI 값이 충돌하면 무엇이 최종 설정이 됩니까?\n\n근거: ${PINNED}의 Config::from_file은 base → TOML → CLI 순서로 Figment provider를 merge합니다. 뒤의 provider가 같은 key를 덮어씁니다. 이 함수는 최종값을 만들지만 값의 출처를 별도 receipt로 보존하지는 않습니다.`,
    annotations: [
      { lines: [49, 56], color: "sky", note: "세 입력을 서로 다른 provider로 준비합니다." },
      { lines: [58, 63], color: "emerald", note: "base → TOML → CLI 순서가 실제 우선순위입니다." },
    ],
  },
  "helios-network": {
    path: "helios@v0.12.0/ethereum/src/config/networks.rs",
    code: networksMainnetRs,
    lang: "rust",
    highlight: [20, 129],
    desc: `질문: network 이름 하나가 어떤 consensus·execution 조건을 함께 고릅니까?\n\n근거: ${PINNED}는 Mainnet·Sepolia·Hoodi·Plataberget profile을 제공하고, mainnet profile에 chain identity, genesis, fork schedule, default checkpoint, 최대 checkpoint 나이를 함께 둡니다. endpoint의 실제 chain identity를 여기서 probe하지는 않습니다.`,
    annotations: [
      { lines: [20, 28], color: "sky", note: "0.12.0에 들어 있는 네 network profile입니다." },
      { lines: [78, 89], color: "emerald", note: "Mainnet의 checkpoint·RPC·chain identity입니다." },
      { lines: [90, 123], color: "violet", note: "Consensus fork activation epoch와 version을 한 profile로 묶습니다." },
      { lines: [124, 128], color: "amber", note: "Execution fork schedule과 14일 checkpoint age 기준도 같은 profile에서 옵니다." },
    ],
  },
  "helios-builder": {
    path: "helios@v0.12.0/ethereum/src/builder.rs",
    code: builderStartupRs,
    lang: "rust",
    highlight: [1, 114],
    desc: `질문: 정규화된 설정이 실제 client 구성요소로 어떻게 전달됩니까?\n\n근거: ${PINNED}의 builder는 explicit 값 → Config 값 → base network 값의 fallback을 field별로 적용한 뒤 ConsensusClient를 만듭니다. endpoint health·chain identity·capability를 이 함수가 사전 검증한다는 근거는 없습니다.`,
    annotations: [
      { lines: [1, 16], color: "sky", note: "Network 또는 custom config에서 base를 만들고 consensus endpoint를 결정합니다." },
      { lines: [18, 39], color: "emerald", note: "Execution endpoint와 checkpoint의 field별 fallback입니다." },
      { lines: [41, 80], color: "amber", note: "Data directory, RPC address, fallback, strict age flag를 조립합니다." },
      { lines: [88, 114], color: "violet", note: "최종 Config를 만들고 ConsensusClient를 시작합니다." },
    ],
  },
  "helios-filedb": {
    path: "helios@v0.12.0/ethereum/src/database.rs",
    code: databaseRs,
    lang: "rust",
    highlight: [29, 69],
    desc: `질문: 로컬 checkpoint file은 무엇을 보장하고, 어디에서 실패할 수 있습니까?\n\n근거: ${PINNED}의 FileDB는 파일을 truncate한 뒤 32 bytes를 바로 쓰고, 읽을 때 정확히 32 bytes인지 확인합니다. temp file·fsync·atomic rename·directory sync는 이 구현에 없습니다.`,
    annotations: [
      { lines: [42, 53], color: "rose", note: "기존 파일을 truncate한 뒤 바로 씁니다. crash-safe atomic replace가 아닙니다." },
      { lines: [56, 68], color: "emerald", note: "읽기 성공과 길이 32를 모두 만족하지 않으면 network default로 돌아갑니다." },
    ],
  },
  "helios-checkpoint-select": {
    path: "helios@v0.12.0/ethereum/src/consensus.rs",
    code: consensusStartupRs,
    lang: "rust",
    highlight: [1, 62],
    desc: `질문: 프로세스 시작 때 어떤 checkpoint를 쓰며, initial sync 실패 뒤 상태는 어떻게 바뀝니까?\n\n근거: ${PINNED}는 explicit checkpoint를 먼저 쓰고, 없으면 DB 값, 마지막으로 network default를 씁니다. initial sync가 실패하면 설정된 fallback 경로를 시도하며, 성공 후 initial blocks를 보낸 뒤에야 consensus status를 Synced로 바꿉니다.`,
    annotations: [
      { lines: [13, 15], color: "emerald", note: "explicit → DB → default의 checkpoint 선택 순서입니다." },
      { lines: [34, 54], color: "rose", note: "첫 sync 실패 뒤 external 또는 configured fallback을 고릅니다." },
      { lines: [57, 62], color: "sky", note: "Initial blocks 전송이 끝난 뒤 consensus status가 Synced가 됩니다." },
    ],
  },
  "helios-checkpoint-age": {
    path: "helios@v0.12.0/ethereum/src/consensus.rs",
    code: checkpointAgeRs,
    lang: "rust",
    highlight: [1, 42],
    desc: `질문: checkpoint가 최대 나이보다 오래되면 항상 시작이 중단됩니까?\n\n근거: ${PINNED}는 current slot과 bootstrap header slot을 같은 genesis 기준 timestamp로 바꾸어 차이를 계산합니다. strict_checkpoint_age가 true일 때만 CheckpointTooOld error를 반환하고, false이면 warning 뒤 bootstrap proof 검증을 계속합니다.`,
    annotations: [
      { lines: [8, 16], color: "rose", note: "나이 초과 시 strict=true는 error, false는 warning입니다." },
      { lines: [18, 19], color: "emerald", note: "Age gate 뒤에도 bootstrap Merkle 검증은 별도로 수행합니다." },
      { lines: [29, 42], color: "sky", note: "Slot×12초+genesis로 두 timestamp를 만들고 차이를 max age와 비교합니다." },
    ],
  },
  "helios-checkpoint-fallback": {
    path: "helios@v0.12.0/ethereum/src/config/checkpoints.rs",
    code: checkpointPluralityRs,
    lang: "rust",
    highlight: [17, 80],
    desc: `질문: 외부 fallback 여러 곳이 서로 다른 root를 돌려주면 무엇을 고릅니까?\n\n근거: ${PINNED}는 응답을 동시에 모으고, 가장 큰 epoch만 남긴 뒤 가장 자주 나온 block root를 고릅니다. 이는 가용성 선택 규칙이지, 응답 집합 자체가 신뢰할 수 있음을 증명하는 protocol consensus는 아닙니다.`,
    annotations: [
      { lines: [21, 54], color: "sky", note: "여러 fallback service를 질의하고 유효한 block root 응답만 모읍니다." },
      { lines: [56, 66], color: "amber", note: "가장 최신 epoch의 응답만 남깁니다." },
      { lines: [68, 80], color: "rose", note: "그 epoch에서 가장 자주 나온 root를 고릅니다. 신뢰 anchor 증명은 아닙니다." },
    ],
  },
  "helios-client-new": {
    path: "helios@v0.12.0/core/src/client/mod.rs",
    code: clientNewRs,
    lang: "rust",
    highlight: [24, 43],
    desc: `질문: JSON-RPC socket은 consensus sync가 끝난 뒤에만 열립니까?\n\n근거: ${PINNED}의 HeliosClient::new는 rpc_address가 있으면 jsonrpc::start task를 즉시 spawn합니다. 따라서 socket listening은 sync 완료나 서비스 readiness의 증거가 아닙니다.`,
    annotations: [
      { lines: [25, 31], color: "sky", note: "Node를 만든 직후의 상태입니다." },
      { lines: [33, 40], color: "rose", note: "별도 readiness gate 없이 JSON-RPC task를 시작합니다." },
    ],
  },
  "helios-wait-synced": {
    path: "helios@v0.12.0/core/src/client/node.rs",
    code: nodeReadinessRs,
    lang: "rust",
    highlight: [14, 29],
    desc: `질문: Helios 내부에서 '동기화됨'을 기다리는 최소 조건은 무엇입니까?\n\n근거: ${PINNED}의 wait_synced는 consensus status를 기다린 뒤 initial latest block과, 존재한다면 finalized block까지 기다립니다. 이 함수와 운영 플랫폼의 Service readiness·traffic admission은 서로 다른 책임입니다.`,
    annotations: [
      { lines: [14, 18], color: "sky", note: "먼저 consensus client의 Synced 상태를 기다립니다." },
      { lines: [19, 28], color: "emerald", note: "그다음 initial latest·finalized block cache가 채워질 때까지 기다립니다." },
    ],
  },
};
