import type { CodeRef } from "@/components/code/types";
import composeYaml from "./codebase/giwa-node/docker-compose.yaml?raw";

export const codeRefs: Record<string, CodeRef> = {
  "giwa-node-compose": {
    path: "docker-compose.yaml · GIWA node v0.6.1",
    code: composeYaml,
    lang: "yaml",
    highlight: [4, 61],
    desc: "GIWA node v0.6.1의 실제 Compose 정의입니다. JWT 생성기, op-reth v2.3.3 실행 계층과 op-node v1.19.5 rollup 계층이 어떤 순서와 공유 secret으로 연결되는지 확인합니다.",
    annotations: [
      {
        lines: [4, 13],
        color: "amber",
        note: "비어 있거나 없는 JWT secret만 새로 만들고 두 서비스가 같은 volume에서 읽습니다.",
      },
      {
        lines: [14, 38],
        color: "emerald",
        note: "execution 서비스는 op-reth v2.3.3을 빌드하고 JSON-RPC, Engine API, P2P와 metrics를 노출합니다.",
      },
      {
        lines: [39, 61],
        color: "sky",
        note: "consensus 서비스는 op-node v1.19.5를 빌드하며 execution 시작 뒤 같은 env와 JWT volume을 사용합니다.",
      },
    ],
  },
};
