// src/pages/core/codebase/go-ethereum 실제 파일을 화면 소스 보기용으로 연결한다.
// 코드 본문은 Vite의 ?raw import로 읽고, 화면에 표시할 때 주석만 한글 설명문으로 바꾼다.

import { gethCommentTranslations } from './geth-comment-translations';
import src01 from './codebase/go-ethereum/accounts/abi/abi.go?raw';
import src02 from './codebase/go-ethereum/accounts/abi/bind/v2/base.go?raw';
import src03 from './codebase/go-ethereum/accounts/abi/bind/v2/lib.go?raw';
import src04 from './codebase/go-ethereum/accounts/accounts.go?raw';
import src05 from './codebase/go-ethereum/accounts/keystore/keystore.go?raw';
import src06 from './codebase/go-ethereum/beacon/engine/types.go?raw';
import src07 from './codebase/go-ethereum/beacon/light/head_tracker.go?raw';
import src08 from './codebase/go-ethereum/beacon/light/sync/head_sync.go?raw';
import src09 from './codebase/go-ethereum/cmd/abigen/main.go?raw';
import src10 from './codebase/go-ethereum/cmd/devp2p/main.go?raw';
import src11 from './codebase/go-ethereum/cmd/evm/internal/t8ntool/transition.go?raw';
import src12 from './codebase/go-ethereum/cmd/geth/main.go?raw';
import src13 from './codebase/go-ethereum/common/bitutil/bitutil.go?raw';
import src14 from './codebase/go-ethereum/common/hexutil/json.go?raw';
import src15 from './codebase/go-ethereum/common/lru/basiclru.go?raw';
import src16 from './codebase/go-ethereum/common/mclock/mclock.go?raw';
import src17 from './codebase/go-ethereum/common/types.go?raw';
import src18 from './codebase/go-ethereum/core/blockchain.go?raw';
import src19 from './codebase/go-ethereum/core/blockchain_sethead_test.go?raw';
import src20 from './codebase/go-ethereum/core/blockchain_snapshot_test.go?raw';
import src21 from './codebase/go-ethereum/core/blockchain_test.go?raw';
import src22 from './codebase/go-ethereum/core/rawdb/accessors_chain.go?raw';
import src23 from './codebase/go-ethereum/core/state_transition_test.go?raw';
import src24 from './codebase/go-ethereum/core/stateless/witness.go?raw';
import src25 from './codebase/go-ethereum/core/tracing/hooks.go?raw';
import src26 from './codebase/go-ethereum/core/txindexer.go?raw';
import src27 from './codebase/go-ethereum/core/txpool/blobpool/blobpool.go?raw';
import src28 from './codebase/go-ethereum/core/types/block.go?raw';
import src29 from './codebase/go-ethereum/core/types/gen_header_rlp.go?raw';
import src30 from './codebase/go-ethereum/core/types/tx_blob.go?raw';
import src31 from './codebase/go-ethereum/core/vm/interpreter.go?raw';
import src32 from './codebase/go-ethereum/crypto/crypto.go?raw';
import src33 from './codebase/go-ethereum/crypto/signature_nocgo.go?raw';
import src34 from './codebase/go-ethereum/eth/catalyst/api.go?raw';
import src35 from './codebase/go-ethereum/eth/catalyst/api_test.go?raw';
import src36 from './codebase/go-ethereum/eth/downloader/downloader.go?raw';
import src37 from './codebase/go-ethereum/eth/fetcher/tx_fetcher_test.go?raw';
import src38 from './codebase/go-ethereum/eth/protocols/eth/handler_test.go?raw';
import src39 from './codebase/go-ethereum/eth/protocols/snap/sync.go?raw';
import src40 from './codebase/go-ethereum/eth/protocols/snap/sync_test.go?raw';
import src41 from './codebase/go-ethereum/graphql/graphql.go?raw';
import src42 from './codebase/go-ethereum/graphql/graphql_test.go?raw';
import src43 from './codebase/go-ethereum/internal/ethapi/api.go?raw';
import src44 from './codebase/go-ethereum/internal/ethapi/api_test.go?raw';
import src45 from './codebase/go-ethereum/internal/ethapi/transaction_args.go?raw';
import src46 from './codebase/go-ethereum/internal/ethapi/transaction_args_test.go?raw';
import src47 from './codebase/go-ethereum/metrics/registry.go?raw';
import src48 from './codebase/go-ethereum/miner/payload_building.go?raw';
import src49 from './codebase/go-ethereum/node/node.go?raw';
import src50 from './codebase/go-ethereum/p2p/discover/v4_udp.go?raw';
import src51 from './codebase/go-ethereum/p2p/enode/node.go?raw';
import src52 from './codebase/go-ethereum/p2p/server.go?raw';
import src53 from './codebase/go-ethereum/rlp/decode.go?raw';
import src54 from './codebase/go-ethereum/rpc/server.go?raw';
import src55 from './codebase/go-ethereum/rpc/tracing_test.go?raw';
import src56 from './codebase/go-ethereum/rpc/types.go?raw';
import src57 from './codebase/go-ethereum/signer/core/signed_data.go?raw';
import src58 from './codebase/go-ethereum/tests/block_test.go?raw';
import src59 from './codebase/go-ethereum/tests/fuzzers/bls12381/bls12381_fuzz.go?raw';
import src60 from './codebase/go-ethereum/tests/fuzzers/bn256/bn256_fuzz.go?raw';
import src61 from './codebase/go-ethereum/tests/fuzzers/secp256k1/secp_test.go?raw';
import src62 from './codebase/go-ethereum/tests/rlp_test.go?raw';
import src63 from './codebase/go-ethereum/tests/state_test.go?raw';
import src64 from './codebase/go-ethereum/tests/transaction_test.go?raw';
import src65 from './codebase/go-ethereum/trie/bintrie/trie.go?raw';
import src66 from './codebase/go-ethereum/trie/proof_test.go?raw';
import src67 from './codebase/go-ethereum/trie/sync_test.go?raw';
import src68 from './codebase/go-ethereum/trie/trie.go?raw';
import src69 from './codebase/go-ethereum/triedb/database.go?raw';
import src70 from './codebase/go-ethereum/triedb/pathdb/database.go?raw';
import src71 from './codebase/go-ethereum/triedb/preimages_test.go?raw';

export type GethSourceSnippet = { sourcePath: string; code: string; lineStart: number };

type GethSourceRange = { sourcePath: string; lineStart: number; lineEnd: number };

const fileSources: Record<string, string> = {
  "accounts/abi/abi.go": src01,
  "accounts/abi/bind/v2/base.go": src02,
  "accounts/abi/bind/v2/lib.go": src03,
  "accounts/accounts.go": src04,
  "accounts/keystore/keystore.go": src05,
  "beacon/engine/types.go": src06,
  "beacon/light/head_tracker.go": src07,
  "beacon/light/sync/head_sync.go": src08,
  "cmd/abigen/main.go": src09,
  "cmd/devp2p/main.go": src10,
  "cmd/evm/internal/t8ntool/transition.go": src11,
  "cmd/geth/main.go": src12,
  "common/bitutil/bitutil.go": src13,
  "common/hexutil/json.go": src14,
  "common/lru/basiclru.go": src15,
  "common/mclock/mclock.go": src16,
  "common/types.go": src17,
  "core/blockchain.go": src18,
  "core/blockchain_sethead_test.go": src19,
  "core/blockchain_snapshot_test.go": src20,
  "core/blockchain_test.go": src21,
  "core/rawdb/accessors_chain.go": src22,
  "core/state_transition_test.go": src23,
  "core/stateless/witness.go": src24,
  "core/tracing/hooks.go": src25,
  "core/txindexer.go": src26,
  "core/txpool/blobpool/blobpool.go": src27,
  "core/types/block.go": src28,
  "core/types/gen_header_rlp.go": src29,
  "core/types/tx_blob.go": src30,
  "core/vm/interpreter.go": src31,
  "crypto/crypto.go": src32,
  "crypto/signature_nocgo.go": src33,
  "eth/catalyst/api.go": src34,
  "eth/catalyst/api_test.go": src35,
  "eth/downloader/downloader.go": src36,
  "eth/fetcher/tx_fetcher_test.go": src37,
  "eth/protocols/eth/handler_test.go": src38,
  "eth/protocols/snap/sync.go": src39,
  "eth/protocols/snap/sync_test.go": src40,
  "graphql/graphql.go": src41,
  "graphql/graphql_test.go": src42,
  "internal/ethapi/api.go": src43,
  "internal/ethapi/api_test.go": src44,
  "internal/ethapi/transaction_args.go": src45,
  "internal/ethapi/transaction_args_test.go": src46,
  "metrics/registry.go": src47,
  "miner/payload_building.go": src48,
  "node/node.go": src49,
  "p2p/discover/v4_udp.go": src50,
  "p2p/enode/node.go": src51,
  "p2p/server.go": src52,
  "rlp/decode.go": src53,
  "rpc/server.go": src54,
  "rpc/tracing_test.go": src55,
  "rpc/types.go": src56,
  "signer/core/signed_data.go": src57,
  "tests/block_test.go": src58,
  "tests/fuzzers/bls12381/bls12381_fuzz.go": src59,
  "tests/fuzzers/bn256/bn256_fuzz.go": src60,
  "tests/fuzzers/secp256k1/secp_test.go": src61,
  "tests/rlp_test.go": src62,
  "tests/state_test.go": src63,
  "tests/transaction_test.go": src64,
  "trie/bintrie/trie.go": src65,
  "trie/proof_test.go": src66,
  "trie/sync_test.go": src67,
  "trie/trie.go": src68,
  "triedb/database.go": src69,
  "triedb/pathdb/database.go": src70,
  "triedb/preimages_test.go": src71,
};

const snippetRanges: Record<string, GethSourceRange> = {
  "core/types/header.go": { sourcePath: "core/types/block.go", lineStart: 60, lineEnd: 149 },
  "core/types/gen_header_rlp.go": { sourcePath: "core/types/gen_header_rlp.go", lineStart: 2, lineEnd: 91 },
  "eth/protocols/eth/handler_test.go": { sourcePath: "eth/protocols/eth/handler_test.go", lineStart: 46, lineEnd: 135 },
  "eth/catalyst/api.go": { sourcePath: "eth/catalyst/api.go", lineStart: 45, lineEnd: 134 },
  "eth/catalyst/api_test.go": { sourcePath: "eth/catalyst/api_test.go", lineStart: 51, lineEnd: 140 },
  "beacon/engine/types.go": { sourcePath: "beacon/engine/types.go", lineStart: 28, lineEnd: 117 },
  "graphql/graphql.go": { sourcePath: "graphql/graphql.go", lineStart: 36, lineEnd: 125 },
  "graphql/graphql_test.go": { sourcePath: "graphql/graphql_test.go", lineStart: 41, lineEnd: 130 },
  "internal/ethapi/transaction_args.go": { sourcePath: "internal/ethapi/transaction_args.go", lineStart: 36, lineEnd: 125 },
  "internal/ethapi/transaction_args_test.go": { sourcePath: "internal/ethapi/transaction_args_test.go", lineStart: 38, lineEnd: 127 },
  "eth/catalyst": { sourcePath: "eth/catalyst/api.go", lineStart: 45, lineEnd: 134 },
  "miner": { sourcePath: "miner/payload_building.go", lineStart: 36, lineEnd: 125 },
  "core/stateless": { sourcePath: "core/stateless/witness.go", lineStart: 25, lineEnd: 114 },
  "cmd/evm/internal/t8ntool": { sourcePath: "cmd/evm/internal/t8ntool/transition.go", lineStart: 46, lineEnd: 135 },
  "core/blockchain.go": { sourcePath: "core/blockchain.go", lineStart: 56, lineEnd: 145 },
  "core/blockchain_test.go": { sourcePath: "core/blockchain_test.go", lineStart: 49, lineEnd: 138 },
  "core/blockchain_snapshot_test.go": { sourcePath: "core/blockchain_snapshot_test.go", lineStart: 36, lineEnd: 125 },
  "core/rawdb": { sourcePath: "core/rawdb/accessors_chain.go", lineStart: 32, lineEnd: 121 },
  "core/txindexer": { sourcePath: "core/txindexer.go", lineStart: 24, lineEnd: 113 },
  "core/txpool/blobpool": { sourcePath: "core/txpool/blobpool/blobpool.go", lineStart: 46, lineEnd: 135 },
  "core/types/tx_blob.go": { sourcePath: "core/types/tx_blob.go", lineStart: 28, lineEnd: 117 },
  "p2p": { sourcePath: "p2p/server.go", lineStart: 39, lineEnd: 128 },
  "p2p/discover": { sourcePath: "p2p/discover/v4_udp.go", lineStart: 34, lineEnd: 123 },
  "p2p/enode": { sourcePath: "p2p/enode/node.go", lineStart: 29, lineEnd: 118 },
  "eth/downloader": { sourcePath: "eth/downloader/downloader.go", lineStart: 37, lineEnd: 126 },
  "eth/protocols/snap": { sourcePath: "eth/protocols/snap/sync.go", lineStart: 41, lineEnd: 130 },
  "rpc": { sourcePath: "rpc/server.go", lineStart: 25, lineEnd: 114 },
  "node": { sourcePath: "node/node.go", lineStart: 39, lineEnd: 128 },
  "cmd/geth": { sourcePath: "cmd/geth/main.go", lineStart: 38, lineEnd: 127 },
  "cmd/devp2p": { sourcePath: "cmd/devp2p/main.go", lineStart: 23, lineEnd: 102 },
  "accounts": { sourcePath: "accounts/accounts.go", lineStart: 27, lineEnd: 116 },
  "accounts/abi": { sourcePath: "accounts/abi/abi.go", lineStart: 28, lineEnd: 117 },
  "accounts/keystore": { sourcePath: "accounts/keystore/keystore.go", lineStart: 36, lineEnd: 125 },
  "signer/core": { sourcePath: "signer/core/signed_data.go", lineStart: 35, lineEnd: 124 },
  "core/vm": { sourcePath: "core/vm/interpreter.go", lineStart: 23, lineEnd: 112 },
  "core/state_transition_test.go": { sourcePath: "core/state_transition_test.go", lineStart: 23, lineEnd: 112 },
  "internal/ethapi/api_test.go": { sourcePath: "internal/ethapi/api_test.go", lineStart: 57, lineEnd: 146 },
  "tests/state_test.go": { sourcePath: "tests/state_test.go", lineStart: 34, lineEnd: 123 },
  "core/blockchain_sethead_test.go": { sourcePath: "core/blockchain_sethead_test.go", lineStart: 36, lineEnd: 125 },
  "internal/ethapi": { sourcePath: "internal/ethapi/api.go", lineStart: 48, lineEnd: 137 },
  "internal/ethapi/testdata": { sourcePath: "internal/ethapi/api_test.go", lineStart: 57, lineEnd: 146 },
  "rpc marshal tests": { sourcePath: "rpc/types.go", lineStart: 26, lineEnd: 115 },
  "beacon/light": { sourcePath: "beacon/light/head_tracker.go", lineStart: 27, lineEnd: 116 },
  "beacon/light/sync": { sourcePath: "beacon/light/sync/head_sync.go", lineStart: 19, lineEnd: 108 },
  "eth/catalyst engine tests": { sourcePath: "eth/catalyst/api_test.go", lineStart: 51, lineEnd: 140 },
  "eth/fetcher/tx_fetcher_test.go": { sourcePath: "eth/fetcher/tx_fetcher_test.go", lineStart: 32, lineEnd: 121 },
  "eth/protocols/snap/sync_test.go": { sourcePath: "eth/protocols/snap/sync_test.go", lineStart: 42, lineEnd: 131 },
  "eth/protocols/snap/*_test.go": { sourcePath: "eth/protocols/snap/sync_test.go", lineStart: 42, lineEnd: 131 },
  "trie": { sourcePath: "trie/trie.go", lineStart: 35, lineEnd: 124 },
  "trie/bintrie": { sourcePath: "trie/bintrie/trie.go", lineStart: 29, lineEnd: 118 },
  "trie/sync_test.go": { sourcePath: "trie/sync_test.go", lineStart: 30, lineEnd: 119 },
  "trie/proof_test.go": { sourcePath: "trie/proof_test.go", lineStart: 30, lineEnd: 119 },
  "triedb": { sourcePath: "triedb/database.go", lineStart: 27, lineEnd: 116 },
  "triedb/pathdb": { sourcePath: "triedb/pathdb/database.go", lineStart: 34, lineEnd: 123 },
  "triedb/preimages_test.go": { sourcePath: "triedb/preimages_test.go", lineStart: 23, lineEnd: 79 },
  "rlp": { sourcePath: "rlp/decode.go", lineStart: 33, lineEnd: 122 },
  "common": { sourcePath: "common/types.go", lineStart: 31, lineEnd: 120 },
  "common/hexutil": { sourcePath: "common/hexutil/json.go", lineStart: 24, lineEnd: 113 },
  "common/bitutil": { sourcePath: "common/bitutil/bitutil.go", lineStart: 10, lineEnd: 99 },
  "common/lru": { sourcePath: "common/lru/basiclru.go", lineStart: 18, lineEnd: 107 },
  "common/mclock": { sourcePath: "common/mclock/mclock.go", lineStart: 22, lineEnd: 111 },
  "crypto": { sourcePath: "crypto/signature_nocgo.go", lineStart: 27, lineEnd: 116 },
  "crypto/keccak": { sourcePath: "crypto/crypto.go", lineStart: 32, lineEnd: 121 },
  "tests/fuzzers/secp256k1": { sourcePath: "tests/fuzzers/secp256k1/secp_test.go", lineStart: 21, lineEnd: 54 },
  "tests/fuzzers/bn256": { sourcePath: "tests/fuzzers/bn256/bn256_fuzz.go", lineStart: 24, lineEnd: 113 },
  "tests/fuzzers/bls12381": { sourcePath: "tests/fuzzers/bls12381/bls12381_fuzz.go", lineStart: 31, lineEnd: 120 },
  "tests": { sourcePath: "tests/state_test.go", lineStart: 34, lineEnd: 123 },
  "tests/block_test.go": { sourcePath: "tests/block_test.go", lineStart: 21, lineEnd: 110 },
  "tests/transaction_test.go": { sourcePath: "tests/transaction_test.go", lineStart: 19, lineEnd: 81 },
  "tests/rlp_test.go": { sourcePath: "tests/rlp_test.go", lineStart: 17, lineEnd: 32 },
  "cmd/evm/testdata": { sourcePath: "cmd/evm/internal/t8ntool/transition.go", lineStart: 46, lineEnd: 135 },
  "accounts/abi/bind": { sourcePath: "accounts/abi/bind/v2/base.go", lineStart: 29, lineEnd: 118 },
  "accounts/abi/bind/v2": { sourcePath: "accounts/abi/bind/v2/lib.go", lineStart: 36, lineEnd: 125 },
  "cmd/abigen": { sourcePath: "cmd/abigen/main.go", lineStart: 30, lineEnd: 119 },
  "metrics": { sourcePath: "metrics/registry.go", lineStart: 8, lineEnd: 97 },
  "rpc/tracing_test.go": { sourcePath: "rpc/tracing_test.go", lineStart: 27, lineEnd: 116 },
  "core/tracing": { sourcePath: "core/tracing/hooks.go", lineStart: 33, lineEnd: 122 },
  "eth/catalyst tracing paths": { sourcePath: "eth/catalyst/api.go", lineStart: 45, lineEnd: 134 },
};

const findLineCommentIndex = (line: string) => {
  let quote: '"' | "'" | '`' | null = null;
  let escaped = false;
  for (let index = 0; index < line.length - 1; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (quote) {
      if (quote !== '`' && char === '\\' && !escaped) {
        escaped = true;
        continue;
      }
      if (char === quote && !escaped) quote = null;
      escaped = false;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '/' && next === '/') return index;
  }
  return -1;
};

const cleanCommentText = (text: string) =>
  text
    .replace(/^\s*\/\/\s?/, '')
    .replace(/^\s*\/\*\s?/, '')
    .replace(/\s?\*\/\s*$/, '')
    .replace(/^\s*\*\s?/, '')
    .trim();

const translateCommentText = (text: string) => {
  const key = cleanCommentText(text);
  if (!key) return '';
  return gethCommentTranslations[key] ?? '번역표에 아직 연결되지 않은 주석입니다.';
};

const localizeCommentLine = (line: string) => {
  const trimmed = line.trimStart();
  const indent = line.slice(0, line.length - trimmed.length);
  if (trimmed === '//') return `${indent}//`;
  if (trimmed === '*/') return `${indent}*/`;
  if (trimmed.startsWith('//')) return `${indent}// ${translateCommentText(trimmed)}`;
  if (trimmed.startsWith('/*')) return `${indent}/* ${translateCommentText(trimmed)}${trimmed.endsWith('*/') ? ' */' : ''}`;
  if (trimmed.startsWith('*')) return `${indent} * ${translateCommentText(trimmed)}`;

  const inlineCommentIndex = findLineCommentIndex(line);
  if (inlineCommentIndex >= 0) {
    return `${line.slice(0, inlineCommentIndex)}// ${translateCommentText(line.slice(inlineCommentIndex))}`;
  }
  return line;
};

const localizeComments = (code: string) =>
  code
    .split('\n')
    .map((line) => localizeCommentLine(line))
    .join('\n');

const sliceLines = (source: string, lineStart: number, lineEnd: number) =>
  localizeComments(source.split('\n').slice(lineStart - 1, lineEnd).join('\n'));

export const gethSourceSnippets: Record<string, GethSourceSnippet> = Object.fromEntries(
  Object.entries(snippetRanges).map(([key, range]) => [
    key,
    {
      sourcePath: range.sourcePath,
      code: sliceLines(fileSources[range.sourcePath], range.lineStart, range.lineEnd),
      lineStart: range.lineStart,
    },
  ]),
);

export const getGethSourceSnippet = (key: string) => gethSourceSnippets[key];
