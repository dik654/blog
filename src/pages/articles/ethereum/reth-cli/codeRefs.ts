import type { CodeRef } from "@/components/code/types";
import mainSrc from "./codebase/reth/main.rs?raw";
import builderSrc from "./codebase/reth/builder.rs?raw";
import statesSrc from "./codebase/reth/states.rs?raw";
import componentsSrc from "./codebase/reth/components.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "cli-main": {
    path: "bin/reth/src/main.rs + crates/cli/commands/src/node.rs",
    lang: "rust",
    highlight: [7, 37],
    desc: "v2.8.1 진입 경로 — CLI 해석 → NodeConfig·DB → NodeBuilder → launcher",
    annotations: [
      { lines: [7, 8], color: "sky", note: "clap이 CLI를 해석" },
      { lines: [11, 15], color: "emerald", note: "Ethereum 부품과 backfill 연결" },
      {
        lines: [29, 30],
        color: "amber",
        note: "정리한 설정으로 DB 열기",
      },
      { lines: [33, 37], color: "violet", note: "빌더를 launcher에 전달" },
    ],
    code: mainSrc,
  },
  "builder-struct": {
    path: "crates/node/builder/src/builder/mod.rs",
    lang: "rust",
    highlight: [4, 15],
    desc: "v2.8.1 NodeBuilder — 설정·DB·ChainSpec을 형식으로 추적",
    annotations: [
      { lines: [5, 8], color: "sky", note: "설정·DB·선택 RocksDB provider" },
      { lines: [11, 14], color: "emerald", note: "설정만 있는 첫 상태" },
    ],
    code: builderSrc,
  },
  "builder-node": {
    path: "crates/node/builder/src/builder/mod.rs",
    lang: "rust",
    highlight: [22, 43],
    desc: "node() — 형식 → 핵심 부품 → 부가 기능 순으로 전이",
    annotations: [
      {
        lines: [23, 27],
        color: "emerald",
        note: "노드 형식을 먼저 확정",
      },
      { lines: [31, 38], color: "amber", note: "반환 형식에 부품·부가 기능 포함" },
      { lines: [40, 42], color: "violet", note: "세 단계 조립 순서" },
    ],
    code: builderSrc,
  },
  "builder-states": {
    path: "crates/node/builder/src/builder/states.rs",
    lang: "rust",
    highlight: [4, 31],
    desc: "NodeBuilderWithTypes → with_components → NodeBuilderWithComponents",
    annotations: [
      { lines: [5, 8], color: "sky", note: "노드 형식 확정, 부품 미설정" },
      {
        lines: [13, 18],
        color: "emerald",
        note: "호환되는 부품 빌더만 허용",
      },
      { lines: [20, 30], color: "amber", note: "다음 상태와 기본 훅 생성" },
    ],
    code: statesSrc,
  },
  "builder-final": {
    path: "crates/node/builder/src/builder/states.rs",
    lang: "rust",
    highlight: [34, 59],
    desc: "NodeBuilderWithComponents — 부품·부가 기능·수명주기 훅 상태",
    annotations: [
      {
        lines: [35, 45],
        color: "amber",
        note: "형식 조건을 만족한 핵심 부품과 부가 기능",
      },
      { lines: [50, 59], color: "violet", note: "서로 다른 시점의 수명주기 훅" },
    ],
    code: statesSrc,
  },
  "node-components": {
    path: "crates/node/builder/src/components/mod.rs",
    lang: "rust",
    highlight: [4, 28],
    desc: "v2.8.1 NodeComponents — Pool·EVM·Consensus·Network의 형식 계약",
    annotations: [
      { lines: [8, 11], color: "sky", note: "Pool 거래 형식 제약" },
      { lines: [13, 16], color: "emerald", note: "EVM·합의 primitive 제약" },
      { lines: [17, 19], color: "amber", note: "Network primitive 제약" },
      { lines: [21, 27], color: "violet", note: "실행 부품과 payload handle 접근" },
    ],
    code: componentsSrc,
  },
  "components-struct": {
    path: "crates/node/builder/src/components/mod.rs",
    lang: "rust",
    highlight: [30, 41],
    desc: "Components — 실행 부품과 payload handle을 묶는 컨테이너",
    annotations: [
      {
        lines: [35, 40],
        color: "rose",
        note: "구성된 핵심 부품과 payload handle",
      },
    ],
    code: componentsSrc,
  },
};
