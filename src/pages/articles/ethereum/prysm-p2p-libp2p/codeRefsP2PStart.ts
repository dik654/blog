import type { CodeRef } from "@/components/code/types";
import discoveryFilterRaw from "./codebase/prysm/excerpts/filter_peer_v7.go?raw";
import connectPeerRaw from "./codebase/prysm/excerpts/connect_peer_v7.go?raw";
import connectionHandlerRaw from "./codebase/prysm/excerpts/connection_handler_v7.go?raw";
import statusValidationRaw from "./codebase/prysm/excerpts/status_validation_v7.go?raw";
import scoreWeightsRaw from "./codebase/prysm/excerpts/score_weights_v7.go?raw";
import scoreAggregateRaw from "./codebase/prysm/excerpts/score_aggregate_v7.go?raw";
import scorerDecayRaw from "./codebase/prysm/excerpts/scorer_decay_v7.go?raw";

export const p2pStartCodeRefs: Record<string, CodeRef> = {
  "discovery-filter": {
    path: "beacon-chain/p2p/discovery.go — filterPeer() · v7.3.1",
    lang: "go",
    code: discoveryFilterRaw,
    highlight: [1, 68],
    desc: "발견된 ENR를 dial 가능한 후보로 올리기 전에 실제로 확인하는 다섯 조건",
    annotations: [
      {
        lines: [15, 26],
        color: "sky",
        note: "IP와 TCP/QUIC multiaddr 변환 가능 여부",
      },
      {
        lines: [28, 47],
        color: "rose",
        note: "bad·active·connected·backoff 후보 제거",
      },
      { lines: [49, 57], color: "amber", note: "local ENR와 fork digest 비교" },
      {
        lines: [59, 66],
        color: "emerald",
        note: "연결이 아니라 peer store candidate 추가",
      },
    ],
  },
  "connect-peer": {
    path: "beacon-chain/p2p/service.go — connectWithPeer() · v7.3.1",
    lang: "go",
    code: connectPeerRaw,
    highlight: [1, 21],
    desc: "자기 자신·bad peer를 제외하고 timeout 안에서 libp2p host.Connect를 호출",
    annotations: [
      { lines: [5, 11], color: "rose", note: "self와 이미 bad인 PeerId 제외" },
      {
        lines: [13, 19],
        color: "sky",
        note: "dial timeout과 connection failure downscore",
      },
    ],
  },
  "connection-handler": {
    path: "beacon-chain/p2p/handshake.go — AddConnectionHandler() 발췌 · v7.3.1",
    lang: "go",
    code: connectionHandlerRaw,
    highlight: [1, 36],
    desc: "libp2p 연결 뒤 outbound는 Status를 요청하고 inbound는 Status 도착을 기다리는 경계",
    annotations: [
      {
        lines: [2, 6],
        color: "rose",
        note: "연결 직후에도 bad peer를 한 번 더 방어적으로 확인",
      },
      {
        lines: [8, 17],
        color: "emerald",
        note: "Outbound: Connecting → Status request → Connected",
      },
      {
        lines: [19, 36],
        color: "amber",
        note: "Inbound: 10초 안에 상대가 Status를 보내지 않으면 종료",
      },
    ],
  },
  "status-validation": {
    path: "beacon-chain/sync/rpc_status.go — validateStatusMessage() 발췌 · v7.3.1",
    lang: "go",
    code: statusValidationRaw,
    highlight: [1, 46],
    desc: "Status의 head·fork·finalized checkpoint를 local chain과 대조하는 실제 순서",
    annotations: [
      {
        lines: [7, 14],
        color: "rose",
        note: "지나치게 미래인 head와 wrong fork 즉시 거절",
      },
      {
        lines: [15, 28],
        color: "amber",
        note: "가능한 finalized epoch 범위 확인",
      },
      {
        lines: [39, 46],
        color: "emerald",
        note: "보유한 local finalized root와 일치 여부 확인",
      },
    ],
  },
  "score-weights": {
    path: "beacon-chain/p2p/peers/scorers/service.go — NewService() · v7.3.1",
    lang: "go",
    code: scoreWeightsRaw,
    highlight: [7, 16],
    desc: "네 하위 scorer와 기본 가중치 0.3·0.0·0.3·0.4",
    annotations: [
      { lines: [8, 9], color: "rose", note: "Bad response 30%" },
      {
        lines: [10, 11],
        color: "sky",
        note: "Block provider aggregate 가중치 0%",
      },
      {
        lines: [12, 15],
        color: "emerald",
        note: "Peer status 30%, GossipSub 40%",
      },
    ],
  },
  "peer-score": {
    path: "beacon-chain/p2p/peers/scorers/service.go — ScoreNoLock() · v7.3.1",
    lang: "go",
    code: scoreAggregateRaw,
    highlight: [2, 12],
    desc: "네 하위 점수의 가중합을 소수 넷째 자리로 반올림",
    annotations: [
      { lines: [7, 10], color: "sky", note: "하위 점수 × 정규화된 가중치" },
      {
        lines: [11, 11],
        color: "violet",
        note: "ScoreRoundingFactor=10000으로 반올림",
      },
    ],
  },
  "score-decay": {
    path: "beacon-chain/p2p/peers/scorers/bad_responses.go — Decay() · v7.3.1",
    lang: "go",
    code: scorerDecayRaw,
    highlight: [4, 13],
    desc: "공통 λ 감쇠가 아니라 bad response count를 주기마다 1씩 줄이는 실제 구현",
    annotations: [
      {
        lines: [8, 11],
        color: "violet",
        note: "0보다 큰 각 peer count를 정확히 1 감소",
      },
    ],
  },
};
