import type { CodeRef } from "@/components/code/types";
import modRs from "./codebase/helios-real/ethereum/src/config/mod.rs?raw";
import networksRs from "./codebase/helios-real/ethereum/src/config/networks.rs?raw";
import builderRs from "./codebase/helios-real/ethereum/src/builder.rs?raw";
import databaseRs from "./codebase/helios-real/ethereum/src/database.rs?raw";

export const codeRefsReal: Record<string, CodeRef> = {
  "helios-config-merge": {
    path: "helios/ethereum/src/config/mod.rs",
    code: modRs,
    lang: "rust",
    highlight: [30, 70],
    desc: "문제: \"Pinned source의 BaseConfig → TOML → CLI merge 순서\"가 실제로 어느 코드에서 확인되는지 봐야 합니다.\n\n해결: Config::from_file이 Figment로 base_provider(network default) → toml_provider → cli_provider 순서로 merge하며, 뒤에 merge된 값이 앞선 값을 덮어씁니다.",
    annotations: [
      { lines: [33, 41], color: "sky", note: "article의 BaseConfig·TOML·CLI 세 provider 준비" },
      { lines: [43, 52], color: "emerald", note: "article의 merge 순서 — rpc_port 8,545→9,545→10,545 최종값이 CLI로 결정되는 실제 지점" },
    ],
  },
  "helios-network": {
    path: "helios/ethereum/src/config/networks.rs",
    code: networksRs,
    lang: "rust",
    highlight: [11, 52],
    desc: "문제: \"Network는 Mainnet·Sepolia·Holesky·Hoodi 네 profile을 제공하고, chain ID·genesis·fork·checkpoint·age policy를 한 묶음으로 만든다\"는 claim이 실제로 어떤 구조인지 확인해야 합니다.\n\n해결: Network enum이 네 profile을 정의하고, mainnet()이 정확히 그 필드들을 채운 BaseConfig를 반환합니다.",
    annotations: [
      { lines: [11, 16], color: "sky", note: "article의 네 network profile" },
      { lines: [24, 24], color: "emerald", note: "article의 network default 8,545" },
      { lines: [28, 32], color: "amber", note: "article의 chain ID, genesis time/root" },
      { lines: [35, 43], color: "violet", note: "article의 consensus fork epoch/version — fork마다 activation epoch와 version bytes" },
      { lines: [46, 47], color: "rose", note: "article의 checkpoint age policy — 14일" },
    ],
  },
  "helios-builder": {
    path: "helios/ethereum/src/builder.rs",
    code: builderRs,
    lang: "rust",
    highlight: [11, 59],
    desc: "문제: \"EthereumClientBuilder::build()는 network 또는 custom config에서 base fields를 정하고, explicit builder 값이 있으면 endpoint·checkpoint·data directory·bind address를 덮어쓴다\"는 claim이 실제로 어떤 코드 패턴인지 확인해야 합니다.\n\n해결: build()가 각 필드마다 self(explicit builder 값)를 우선하고 없으면 config로 fallback하는 동일한 패턴을 반복합니다.",
    annotations: [
      { lines: [13, 18], color: "sky", note: "article의 base fields — network 또는 custom config에서 시작" },
      { lines: [23, 25], color: "emerald", note: "article의 endpoint 덮어쓰기 — explicit 값 우선, 없으면 config fallback" },
      { lines: [31, 39], color: "amber", note: "article의 checkpoint 덮어쓰기" },
      { lines: [51, 59], color: "violet", note: "article의 bind address 덮어쓰기" },
    ],
  },
  "helios-filedb": {
    path: "helios/ethereum/src/database.rs",
    code: databaseRs,
    lang: "rust",
    highlight: [29, 83],
    desc: "문제: FileDB가 \"32-byte root 하나를 저장하고, 정확히 32 bytes이면 사용하며 그렇지 않으면 network default checkpoint로 돌아간다\"는 claim과, \"truncate한 뒤 바로 써서 crash-safe atomicity가 없다\"는 claim을 확인해야 합니다.\n\n해결: save_checkpoint가 truncate(true)로 열어 바로 쓰고(temp file·fsync·atomic rename 없음), load_checkpoint가 buf.len()==32 조건으로 fallback을 결정합니다.",
    annotations: [
      { lines: [49, 64], color: "rose", note: "article의 'truncate한 뒤 바로 쓴다' — fsync·atomic rename·directory sync 없음" },
      { lines: [66, 82], color: "emerald", note: "article의 32-byte 검사와 default checkpoint fallback" },
    ],
  },
};
