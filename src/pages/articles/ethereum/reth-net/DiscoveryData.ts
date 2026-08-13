export interface LookupStep {
  step: number;
  title: string;
  desc: string;
  color: string;
}

export const LOOKUP_STEPS: readonly LookupStep[] = [
  {
    step: 1,
    title: "local 후보 선택",
    desc: "routing table에서 target과 가까우며 아직 질의하지 않은 node records를 선택한다. 동시 질의 수는 구현 설정이다.",
    color: "#6366f1",
  },
  {
    step: 2,
    title: "이웃 질의",
    desc: "선택한 후보에게 target 주변의 records를 요청한다. timeout과 invalid response는 후보 품질 신호가 된다.",
    color: "#0ea5e9",
  },
  {
    step: 3,
    title: "검증·병합",
    desc: "응답 record의 identity, freshness와 endpoint를 확인하고 중복을 제거해 local table에 반영한다.",
    color: "#10b981",
  },
  {
    step: 4,
    title: "수렴 또는 refresh",
    desc: "더 가까운 미조회 후보가 없으면 lookup을 끝낸다. 주기적 refresh는 table이 오래된 endpoint에 고착되지 않게 한다.",
    color: "#f59e0b",
  },
] as const;

export interface DiscMessage {
  name: string;
  purpose: string;
}

export const DISC_MESSAGES: readonly DiscMessage[] = [
  {
    name: "PING / PONG",
    purpose:
      "endpoint proof와 liveness 확인. 단순 응답만으로 상위 protocol 신뢰가 생기지는 않는다.",
  },
  {
    name: "FINDNODE",
    purpose:
      "target distance 주변에 대해 상대가 알고 있는 node endpoints를 요청한다.",
  },
  {
    name: "NEIGHBORS",
    purpose: "FINDNODE 응답을 packet 크기에 맞게 나누어 전달한다.",
  },
  {
    name: "ENRREQUEST / ENRRESPONSE",
    purpose: "discv4 extension으로 상대의 최신 signed ENR를 요청·검증한다.",
  },
] as const;
