import type { CodeRef } from "@/components/code/types";
import batcherQuorumRaw from "./codebase/commonware/batcher_quorum.rs?raw";
import certificateAssemblyRaw from "./codebase/commonware/certificate_assembly.rs?raw";
import certificationRequestRaw from "./codebase/commonware/certification_request.rs?raw";
import certificationErrorRaw from "./codebase/commonware/certification_error.rs?raw";
import finalizeGateRaw from "./codebase/commonware/finalize_gate.rs?raw";
import durableBroadcastRaw from "./codebase/commonware/durable_broadcast.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "batcher-quorum": {
    path: "consensus/src/simplex/actors/batcher/round.rs · Round::new excerpt",
    lang: "rust",
    code: batcherQuorumRaw,
    highlight: [1, 21],
    desc: "참여자 집합에서 N3f1 quorum을 계산하고, 같은 수를 vote verifier에 넘깁니다.",
    annotations: [
      { lines: [7, 9], color: "sky", note: "n=4, f=1인 설명 예에서는 quorum이 3입니다." },
      { lines: [11, 15], color: "emerald", note: "Verifier와 VoteTracker가 certificate 후보와 중복 signer를 관리합니다." },
    ],
  },
  "certificate-assembly": {
    path: "consensus/src/simplex/actors/batcher/verifier.rs · try_construct_certificate excerpt",
    lang: "rust",
    code: certificateAssemblyRaw,
    highlight: [1, 61],
    desc: "검증된 vote가 quorum에 도달하면 message kind별로 notarization·nullification·finalization을 조립합니다.",
    annotations: [
      { lines: [5, 21], color: "sky", note: "Notarize quorum은 notarization을 만듭니다." },
      { lines: [24, 40], color: "amber", note: "Nullify quorum은 같은 view를 건너뛸 nullification을 만듭니다." },
      { lines: [43, 59], color: "violet", note: "Finalize quorum만 finalization을 만듭니다." },
    ],
  },
  "certification-request": {
    path: "consensus/src/simplex/actors/voter/actor.rs · certification dispatch excerpt",
    lang: "rust",
    code: certificationRequestRaw,
    highlight: [1, 21],
    desc: "Notarization이 있는 proposal을 각 validator의 automaton에 certify 요청으로 보냅니다.",
    annotations: [
      { lines: [1, 5], color: "amber", note: "Notarization이 빠졌다면 Resolver가 먼저 가져옵니다." },
      { lines: [6, 21], color: "emerald", note: "각 validator가 자신의 Application automaton에서 같은 round와 payload를 판정합니다." },
    ],
  },
  "certification-error": {
    path: "consensus/src/simplex/actors/voter/actor.rs · process_certified excerpt",
    lang: "rust",
    code: certificationErrorRaw,
    highlight: [1, 16],
    desc: "Application의 false와 certification channel 오류를 다른 상태로 처리합니다.",
    annotations: [
      { lines: [1, 7], color: "rose", note: "채널 오류는 false로 바꾸지 않습니다. 결과가 없으면 restart 뒤 다시 요청합니다." },
      { lines: [8, 16], color: "amber", note: "실제로 받은 false만 failed certification 경로로 기록합니다." },
    ],
  },
  "finalize-gate": {
    path: "consensus/src/simplex/actors/voter/round.rs · construct_finalize excerpt",
    lang: "rust",
    code: finalizeGateRaw,
    highlight: [1, 31],
    desc: "같은 validator가 finalize vote를 만들기 전에 확인하는 세 조건입니다.",
    annotations: [
      { lines: [2, 7], color: "rose", note: "이미 finalize 또는 nullify를 보냈다면 다시 만들지 않습니다." },
      { lines: [13, 27], color: "sky", note: "Equivocation이 없는 proposal, notarization, successful certification이 모두 필요합니다." },
      { lines: [29, 31], color: "violet", note: "조건을 통과한 뒤에만 finalize broadcast 상태가 됩니다." },
    ],
  },
  "durable-broadcast": {
    path: "consensus/src/simplex/actors/voter/actor.rs · journal sync before notify excerpt",
    lang: "rust",
    code: durableBroadcastRaw,
    highlight: [1, 16],
    desc: "이번 iteration에서 만든 vote와 certification result를 journal에 sync한 뒤 외부로 알립니다.",
    annotations: [
      { lines: [1, 7], color: "emerald", note: "Certification result도 broadcast가 없어도 iteration 끝까지 durable하게 만듭니다." },
      { lines: [9, 16], color: "violet", note: "Journal sync가 끝난 뒤 vote·certificate·Application report를 전파합니다." },
    ],
  },
};
