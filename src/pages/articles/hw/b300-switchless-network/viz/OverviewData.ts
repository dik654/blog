import { defineArticleFlow } from "@/components/viz/article-flow";

export const STEPS = defineArticleFlow([
  {
    id: "eight-osfp",
    stage: "background",
    label: "DGX B300은 8개의 800G ConnectX-8 OSFP port를 제공한다",
    body: "Ethernet split mode에서는 각 physical port가 두 400GbE/RDMA interface가 됩니다.",
  },
  {
    id: "no-fabric",
    stage: "problem",
    label: "switch를 빼면 routing·subnet·failure domain도 사라진다",
    body: "각 노드 쌍은 독립 point-to-point link이고 일반 NCCL의 local-only GID 선택이 맞지 않을 수 있습니다.",
  },
  {
    id: "link-contract",
    stage: "idea",
    label: "cable·/30·GID를 하나의 peer-link contract로 고정한다",
    body: "물리 port에서 remote peer까지 양끝 mapping을 생성하고 같은 정보로 host와 NCCL을 구성합니다.",
  },
  {
    id: "layered-verify",
    stage: "implementation",
    label: "link → IP → RDMA → collective 순서로 검증한다",
    body: "성능 숫자 전에 firmware·cable·MTU·GID·HCA allowlist를 재현 가능한 ledger에 남깁니다.",
  },
]);
