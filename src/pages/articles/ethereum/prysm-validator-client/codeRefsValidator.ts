import type { CodeRef } from "@/components/code/types";
import runnerSlotRaw from "./codebase/prysm/excerpts/runner_slot.go?raw";
import rolesAtRaw from "./codebase/prysm/excerpts/roles_at.go?raw";
import attestationWaitRaw from "./codebase/prysm/excerpts/attestation_wait.go?raw";
import attestationPipelineRaw from "./codebase/prysm/excerpts/attestation_pipeline.go?raw";
import signAttestationRaw from "./codebase/prysm/excerpts/sign_attestation.go?raw";
import keymanagerContractRaw from "./codebase/prysm/excerpts/keymanager_contract.go?raw";
import localSignRaw from "./codebase/prysm/excerpts/local_sign.go?raw";
import remoteSignRaw from "./codebase/prysm/excerpts/remote_sign.go?raw";
import slashableAttestationRaw from "./codebase/prysm/excerpts/slashable_attestation.go?raw";

export const validatorCodeRefs: Record<string, CodeRef> = {
  "slot-runner": {
    path: "validator/client/runner.go:90 — slot loop",
    lang: "go",
    code: runnerSlotRaw,
    highlight: [1, 76],
    desc: "Prysm v7.3.1 · slot tick을 next-slot deadline과 역할 실행으로 바꾸는 runner 원문",
    annotations: [
      { lines: [7, 17], color: "violet", note: "새 slot과 next-slot deadline으로 slot context를 만듭니다." },
      { lines: [26, 39], color: "emerald", note: "Epoch 경계에서는 저장할 duty를 다시 받습니다." },
      { lines: [65, 75], color: "sky", note: "RolesAt 결과만 같은 deadline 안에서 실행합니다." },
    ],
  },
  "roles-at": {
    path: "validator/client/validator.go:470 — RolesAt()",
    lang: "go",
    code: rolesAtRaw,
    highlight: [1, 91],
    desc: "Prysm v7.3.1 · duty snapshot에서 현재 slot의 proposer·attester·sync 역할을 꺼내는 원문",
    annotations: [
      { lines: [8, 18], color: "violet", note: "초기화된 duty snapshot을 한 번 읽습니다." },
      { lines: [28, 48], color: "emerald", note: "현재 slot과 일치할 때만 proposer·attester·aggregator 역할이 붙습니다." },
      { lines: [50, 78], color: "sky", note: "Sync committee·PTC와 no-role 결과도 같은 map에 정리합니다." },
    ],
  },
  "attestation-wait": {
    path: "validator/client/attest.go:262 — waitUntilAttestationDueOrValidBlock()",
    lang: "go",
    code: attestationWaitRaw,
    highlight: [1, 48],
    desc: "Prysm v7.3.1 · valid current-slot block 또는 configured due time 중 먼저 온 사건을 기다리는 원문",
    annotations: [
      { lines: [9, 14], color: "violet", note: "이미 current-slot valid block을 보았다면 기다리지 않습니다." },
      { lines: [19, 28], color: "emerald", note: "Due timer와 valid-block feed를 함께 준비합니다." },
      { lines: [30, 47], color: "sky", note: "Valid block, cancellation, subscription error, timer 중 하나가 대기를 끝냅니다." },
    ],
  },
  "attestation-pipeline": {
    path: "validator/client/attest.go:33 — SubmitAttestation()",
    lang: "go",
    code: attestationPipelineRaw,
    highlight: [1, 127],
    desc: "Prysm v7.3.1 · wait → per-role/key lock → data → sign → local DB gate → submit의 실제 순서",
    annotations: [
      { lines: [6, 22], color: "violet", note: "관찰 timing을 기다린 뒤 이 process 안의 role·key 작업을 직렬화합니다." },
      { lines: [42, 60], color: "amber", note: "Attestation data를 받은 뒤 keymanager signature가 먼저 생깁니다." },
      { lines: [77, 95], color: "rose", note: "그 다음 signing root를 다시 구해 local slashing DB를 통과합니다." },
      { lines: [100, 119], color: "emerald", note: "DB 성공 뒤에야 Electra 또는 이전 형식으로 beacon node에 제출합니다." },
    ],
  },
  "sign-attestation": {
    path: "validator/client/attest.go:204 — signAtt()",
    lang: "go",
    code: signAttestationRaw,
    highlight: [1, 34],
    desc: "Prysm v7.3.1 · attester domain과 data를 signing root로 묶어 keymanager에 넘기는 원문",
    annotations: [
      { lines: [6, 16], color: "violet", note: "Public key·root·domain·원래 object·slot이 SignRequest에 함께 들어갑니다." },
      { lines: [24, 34], color: "emerald", note: "Target epoch의 attester domain으로 실제 signing root를 계산합니다." },
    ],
  },
  "keymanager-contract": {
    path: "validator/keymanager/types.go:14 — IKeymanager and Signer",
    lang: "go",
    code: keymanagerContractRaw,
    highlight: [1, 25],
    desc: "Prysm v7.3.1 · public-key discovery와 Sign을 묶는 공통 keymanager 계약",
    annotations: [
      { lines: [1, 9], color: "violet", note: "IKeymanager가 여러 wallet backend를 같은 interface로 노출합니다." },
      { lines: [17, 25], color: "emerald", note: "공통 서명 계약은 SignRequest를 받아 BLS signature를 돌려주는 것입니다." },
    ],
  },
  "local-sign": {
    path: "validator/keymanager/local/keymanager.go:178 — Sign()",
    lang: "go",
    code: localSignRaw,
    highlight: [1, 14],
    desc: "Prysm v7.3.1 · local keymanager가 cached secret key로 request root를 서명하는 원문",
    annotations: [
      { lines: [3, 11], color: "violet", note: "Public key가 cache에 존재하는지 확인합니다." },
      { lines: [13, 13], color: "rose", note: "Duty나 slashing predicate를 다시 검사하지 않고 req.SigningRoot에 서명합니다." },
    ],
  },
  "remote-sign": {
    path: "validator/keymanager/remote-web3signer/keymanager.go:207 — Sign()",
    lang: "go",
    code: remoteSignRaw,
    highlight: [1, 15],
    desc: "Prysm v7.3.1 · SignRequest를 Web3Signer JSON으로 바꾸고 remote signature를 받는 원문",
    annotations: [
      { lines: [3, 6], color: "violet", note: "Prysm request와 genesis root를 structured Web3Signer request로 바꿉니다." },
      { lines: [7, 15], color: "emerald", note: "Remote endpoint가 돌려준 signature 또는 오류를 caller에 전달합니다." },
    ],
  },
  "slashable-attestation": {
    path: "validator/db/kv/attester_protection.go:149 — SlashableAttestationCheck()",
    lang: "go",
    code: slashableAttestationRaw,
    highlight: [1, 72],
    desc: "Prysm v7.3.1 · complete BoltDB가 낮은 epoch·double·surround를 확인하고 history를 저장하는 원문",
    annotations: [
      { lines: [17, 34], color: "violet", note: "최저 source epoch와 target epoch의 기존 signing root를 읽습니다." },
      { lines: [36, 49], color: "amber", note: "다른 root의 과거·동일 target 경계를 먼저 거절합니다." },
      { lines: [50, 65], color: "rose", note: "Double·surround·surrounded vote를 분류해 오류를 돌려줍니다." },
      { lines: [67, 71], color: "emerald", note: "안전 판정 뒤에 새 attestation history를 저장합니다." },
    ],
  },
};
