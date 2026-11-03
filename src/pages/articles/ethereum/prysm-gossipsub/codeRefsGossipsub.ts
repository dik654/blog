import type { CodeRef } from "@/components/code/types";
import encoderRaw from "./codebase/prysm/excerpts/decode_gossip_v7.go?raw";
import decodeRaw from "./codebase/prysm/excerpts/decode_pubsub_v7.go?raw";
import subscriberRaw from "./codebase/prysm/excerpts/subscribe_v7.go?raw";
import validateRaw from "./codebase/prysm/excerpts/validate_block_outcome_v7.go?raw";
import wrapperRaw from "./codebase/prysm/excerpts/validation_wrapper_v7.go?raw";

export const gossipsubCodeRefs: Record<string, CodeRef> = {
  "subscribe-topic": {
    path: "beacon-chain/sync/subscriber.go — subscribe() · Prysm v7.3.1",
    lang: "go",
    code: subscriberRaw,
    highlight: [1, 76],
    desc: "Fork digest와 encoding suffix를 붙여 validator·subscriber를 등록합니다.",
    annotations: [
      {
        lines: [1, 15],
        color: "sky",
        note: "Fork schedule에서 아직 유효한 요청인지 확인하고 full topic을 만듭니다.",
      },
      {
        lines: [18, 38],
        color: "emerald",
        note: "Topic validator를 먼저 등록한 뒤 실제 PubSub topic을 구독합니다.",
      },
      {
        lines: [43, 75],
        color: "amber",
        note: "Accept된 ValidatorData만 timeout이 있는 subscriber pipeline에 넘깁니다.",
      },
    ],
  },
  "decode-pubsub": {
    path: "beacon-chain/sync/decode_pubsub.go — decodePubsubMessage() · Prysm v7.3.1",
    lang: "go",
    code: decodeRaw,
    highlight: [1, 49],
    desc: "Topic의 fork digest와 message kind로 정확한 SSZ type을 고릅니다.",
    annotations: [
      {
        lines: [1, 14],
        color: "sky",
        note: "빈 topic을 거절하고 digest·encoding suffix를 분리합니다.",
      },
      {
        lines: [15, 35],
        color: "emerald",
        note: "Subnet topic을 canonical message type에 대응시키고 base schema를 찾습니다.",
      },
      {
        lines: [36, 49],
        color: "violet",
        note: "Fork digest에 맞는 data type을 고른 뒤 bounded DecodeGossip을 호출합니다.",
      },
    ],
  },
  "decode-gossip": {
    path: "beacon-chain/p2p/encoder/ssz.go — DecodeGossip() · Prysm v7.3.1",
    lang: "go",
    code: encoderRaw,
    highlight: [1, 38],
    desc: "Compressed 상한과 decoded 10 MiB 상한을 차례로 적용합니다.",
    annotations: [
      {
        lines: [1, 10],
        color: "sky",
        note: "Compressed input을 MaxCompressedLen으로 먼저 제한하고 SSZ decode로 넘깁니다.",
      },
      {
        lines: [13, 25],
        color: "rose",
        note: "DecodedLen을 allocation 전에 읽어 raw payload가 10 MiB를 넘으면 거절합니다.",
      },
      {
        lines: [27, 38],
        color: "amber",
        note: "32+n+n/6이라는 Snappy 최악의 compressed 길이를 구현합니다.",
      },
    ],
  },
  "validate-block-pubsub": {
    path: "beacon-chain/sync/validate_beacon_blocks.go — validateBeaconBlockPubSub() · Prysm v7.3.1",
    lang: "go",
    code: validateRaw,
    highlight: [1, 103],
    desc: "Beacon block 한 개를 Accept·Reject·Ignore 중 하나로 판정합니다.",
    annotations: [
      {
        lines: [1, 22],
        color: "sky",
        note: "Parent를 모르면 서명을 확인하고 pending queue·parent request 뒤 Ignore합니다.",
      },
      {
        lines: [23, 44],
        color: "emerald",
        note: "Parent payload가 아직 없거나 execution bid가 invalid일 때 다른 판정을 남깁니다.",
      },
      {
        lines: [47, 60],
        color: "amber",
        note: "Invalid signature·proposer는 Reject, 지금 판정할 수 없는 오류는 Ignore합니다.",
      },
      {
        lines: [63, 103],
        color: "violet",
        note: "합의 검사를 통과한 typed block만 ValidatorData에 넣고 Accept합니다.",
      },
    ],
  },
  "validation-wrapper": {
    path: "beacon-chain/sync/subscriber.go — wrapAndReportValidation() · Prysm v7.3.1",
    lang: "go",
    code: wrapperRaw,
    highlight: [1, 67],
    desc: "Topic·fork·timeout 경계와 Reject·Ignore 관측을 한곳에서 감쌉니다.",
    annotations: [
      {
        lines: [1, 27],
        color: "sky",
        note: "Validation timeout을 만들고 빈 topic·chain start·digest를 먼저 확인합니다.",
      },
      {
        lines: [28, 47],
        color: "emerald",
        note: "현재 fork와 맞춘 뒤 validator를 호출하며 local timeout의 Reject는 Ignore로 낮춥니다.",
      },
      {
        lines: [48, 67],
        color: "rose",
        note: "Reject와 Ignore를 다른 metric·log로 기록해 peer 책임을 구분합니다.",
      },
    ],
  },
};
