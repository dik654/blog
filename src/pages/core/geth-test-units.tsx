import { Link } from 'react-router-dom';
import {
  CapabilityCheck,
  ConceptPrimer,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { coreItemPath } from '@/lib/paths';

type Unit = {
  id: string;
  area: string;
  unit: string;
  evidence: string;
  guideHref: string;
  guideLabel: string;
  command: string;
};

type Coverage = {
  group: string;
  source: string;
  units: number;
  fmCuts: string;
  command: string;
  proof: string;
};

const stats = [
  ['코드베이스', 'ethereum/go-ethereum'],
  ['기준 시각', '2026-05-22 UTC'],
  ['테스트 파일', '432'],
  ['테스트 함수', '2148'],
  ['퍼즈 대상', '43'],
  ['벤치마크', '381'],
  ['코드 해설', '기능 단위별 직접 연결'],
];

function getGuideForUnit(id: string, area: string, evidence: string) {
  const text = `${id} ${area} ${evidence}`;
  let slug = 'geth-fm-021-encoding-common';
  let label = '공통 인코딩 코드 해설';

  if (/35030|core\/types|RLP|rlp/i.test(text)) {
    slug = 'geth-fm-002-header-rlp';
    label = 'Header RLP 코드 해설';
  } else if (/35028|35019|getBlobs|Blobs|blob list|eth\/catalyst/i.test(text)) {
    slug = 'geth-fm-003-getblobs-availability';
    label = 'GetBlobs 코드 해설';
  } else if (/35027|graphql/i.test(text)) {
    slug = 'geth-fm-004-graphql-raw-body';
    label = 'GraphQL Raw 코드 해설';
  } else if (/34997|TransactionArgs|internal\/ethapi|eth_call|estimateGas|simulate|RPC marshal/i.test(text)) {
    slug = 'geth-fm-015-ethapi-rpc-semantics';
    label = 'EthAPI/RPC 코드 해설';
  } else if (/\brpc\b|websocket|node lifecycle/i.test(text)) {
    slug = 'geth-fm-011-rpc-node-cli';
    label = 'RPC/Node 코드 해설';
  } else if (/35009|witness|stateless/i.test(text)) {
    slug = 'geth-fm-006-engine-payload-witness';
    label = 'Payload witness 코드 해설';
  } else if (/34988|p2p|devp2p|downloader|snap|discover|fetcher/i.test(text)) {
    slug = 'geth-fm-010-p2p-sync';
    label = 'P2P/Sync 코드 해설';
  } else if (/34986|signer|SIWE|abi|accounts/i.test(text)) {
    slug = 'geth-fm-012-abi-signer';
    label = 'ABI/Signer 코드 해설';
  } else if (/blockchain|canonical|fork|reorg|EIP|transient|tx\/log/i.test(text)) {
    slug = 'geth-fm-007-chain-reorg';
    label = 'Chain/reorg 코드 해설';
  } else if (/snapshot|rawdb|freezer|recovery|restart|crash/i.test(text)) {
    slug = 'geth-fm-008-state-recovery';
    label = 'State recovery 코드 해설';
  } else if (/tracing|journal|metrics/i.test(text)) {
    slug = 'geth-fm-026-metrics-tracing';
    label = 'Metrics/Tracing 코드 해설';
  } else if (/blobpool|txpool/i.test(text)) {
    slug = 'geth-fm-009-blobpool-limbo';
    label = 'Blobpool 코드 해설';
  } else if (/miner|payload/i.test(text)) {
    slug = 'geth-fm-006-engine-payload-witness';
    label = 'Engine payload 코드 해설';
  } else if (/trie|triedb|pathdb/i.test(text)) {
    slug = 'geth-fm-019-trie-proof-sync';
    label = 'Trie/proof 코드 해설';
  }

  return {
    guideHref: coreItemPath('verification-practice', slug),
    guideLabel: label,
  };
}

const recentPrUnits: Unit[] = [
  {
    id: 'PR-35030-01',
    area: 'core/types',
    unit: 'Legacy/London header RLP decode 결과가 기존 Header와 동일하다.',
    evidence: '#35030 core/types: reduce header RLP decode allocations',
    ...getGuideForUnit('PR-35030-01', 'core/types', '#35030 core/types: reduce header RLP decode allocations'),
    command: "go test ./core/types -run 'Test.*Header.*Decode|Test.*RLP' -count=1",
  },
  {
    id: 'PR-35030-02',
    area: 'eth/protocols/eth',
    unit: 'BlockHeaders response decode 후 각 Header ownership이 공유되지 않는다.',
    evidence: '#35030 handler_test.go 추가',
    ...getGuideForUnit('PR-35030-02', 'eth/protocols/eth', '#35030 handler_test.go 추가'),
    command: "go test ./eth/protocols/eth -run 'Test.*BlockHeaders|Test.*Header' -count=1",
  },
  {
    id: 'PR-35028-01',
    area: 'eth/catalyst',
    unit: 'AvailableBlobs 결과는 slice 길이가 아니라 true 개수만 available로 센다.',
    evidence: '#35028 getBlobs availability count',
    ...getGuideForUnit('PR-35028-01', 'eth/catalyst', '#35028 getBlobs availability count'),
    command: "go test ./eth/catalyst -run 'TestGetBlobs' -count=1",
  },
  {
    id: 'PR-35027-01',
    area: 'graphql',
    unit: 'Raw resolver가 block body 누락을 panic 없이 처리한다.',
    evidence: '#35027 GraphQL missing block body',
    ...getGuideForUnit('PR-35027-01', 'graphql', '#35027 GraphQL missing block body'),
    command: "go test ./graphql -run 'TestGraphQL.*Block|Test.*Raw' -count=1",
  },
  {
    id: 'PR-35019-01',
    area: 'beacon/engine',
    unit: 'nil blob list JSON 의미가 빈 배열로 바뀌지 않는다.',
    evidence: '#35019 preserve nil blob list JSON',
    ...getGuideForUnit('PR-35019-01', 'beacon/engine', '#35019 preserve nil blob list JSON'),
    command: "go test ./beacon/engine ./eth/catalyst -run 'TestBlobs|Test.*Blob.*JSON|Test.*Payload' -count=1",
  },
  {
    id: 'PR-35009-01',
    area: 'core/stateless',
    unit: 'engine_newPayloadWithWitnessV5 witness field ordering이 spec과 일치한다.',
    evidence: '#35009 witness V5',
    ...getGuideForUnit('PR-35009-01', 'core/stateless', '#35009 witness V5'),
    command: "go test ./core/stateless ./eth/catalyst -run 'Test.*Encoding|TestWitnessCreationAndConsumption' -count=1",
  },
  {
    id: 'PR-34997-01',
    area: 'internal/ethapi',
    unit: '명시적 transaction type과 field 조합이 불일치하면 거부된다.',
    evidence: '#34997 TransactionArgs validation',
    ...getGuideForUnit('PR-34997-01', 'internal/ethapi', '#34997 TransactionArgs validation'),
    command: "go test ./internal/ethapi -run 'Test.*TransactionArgs|TestSetFeeDefaults' -count=1",
  },
  {
    id: 'PR-34988-01',
    area: 'cmd/devp2p, p2p/enode',
    unit: 'fallback UDP port가 0..65535 범위 밖이면 거부된다.',
    evidence: '#34988 fallback UDP port range',
    ...getGuideForUnit('PR-34988-01', 'cmd/devp2p, p2p/enode', '#34988 fallback UDP port range'),
    command: "go test ./cmd/devp2p ./p2p/enode -run 'Test.*Fallback|Test.*UDP|Test.*Port' -count=1",
  },
  {
    id: 'PR-34986-01',
    area: 'signer/core',
    unit: 'SIWE positive fixture는 parse되고 negative fixture는 거부된다.',
    evidence: '#34986 EIP-4361 SIWE support',
    ...getGuideForUnit('PR-34986-01', 'signer/core', '#34986 EIP-4361 SIWE support'),
    command: "go test ./signer/core -run 'Test.*SIWE|Test.*SignedData' -count=1",
  },
];

const coreUnits: Unit[] = ([
  ['CORE-001', 'core/blockchain', 'canonical head 조회가 마지막 block과 일치한다.', 'TestLastBlock', "go test ./core -run 'TestLastBlock' -count=1"],
  ['CORE-002', 'core/blockchain', '더 짧은 fork는 canonical chain을 이기지 못한다.', 'TestShorterForkHeaders/Blocks', "go test ./core -run 'TestShorterFork' -count=1"],
  ['CORE-003', 'core/blockchain', '더 긴 fork는 reorg를 유발한다.', 'TestLongerForkHeaders/Blocks', "go test ./core -run 'TestLongerFork' -count=1"],
  ['CORE-004', 'core/blockchain', '깨진 header/block chain은 insert에서 거부된다.', 'TestBrokenHeaderChain/TestBrokenBlockChain', "go test ./core -run 'TestBroken.*Chain' -count=1"],
  ['CORE-005', 'core/blockchain', 'tx/log reorg 이벤트가 removed/rebirth 의미를 보존한다.', 'TestChainTxReorgs/TestLogReorgs', "go test ./core -run 'TestChainTxReorgs|TestLogReorgs|TestLogRebirth' -count=1"],
  ['CORE-006', 'core/blockchain', 'EIP-1559 base fee 전환이 fork block에서 적용된다.', 'TestEIP1559Transition', "go test ./core -run 'TestEIP1559Transition' -count=1"],
  ['CORE-007', 'core/blockchain', 'EIP-7702 delegated account/auth list 처리가 적용된다.', 'TestEIP7702', "go test ./core -run 'TestEIP7702' -count=1"],
  ['CORE-008', 'core/blockchain', 'transient storage는 tx/block 경계에서 reset된다.', 'TestTransientStorageReset', "go test ./core -run 'TestTransientStorageReset' -count=1"],
  ['CORE-009', 'core/blockchain_snapshot', 'snapshot restart/crash/gap/setHead recovery가 state root를 보존한다.', 'Test*NewSnapshot', "go test ./core -run 'Test.*NewSnapshot|TestRecoverSnapshot' -count=1"],
  ['CORE-010', 'core/rawdb', 'freezer append/read/truncate/repair가 atomic하다.', 'core/rawdb/freezer_*_test.go', "go test ./core/rawdb -run 'TestFreezer|TestTruncate|TestSequentialRead' -count=1"],
  ['CORE-011', 'core/tracing', 'journal hook, nested revert, nonce/code change hook 순서가 유지된다.', 'core/tracing/journal_test.go', "go test ./core/tracing -run 'TestJournal|TestAllHooksCalled|TestOn.*V2' -count=1"],
  ['CORE-012', 'core/txpool', 'blobpool limbo blob과 blob transaction 경계가 보존된다.', 'blobpool tests + PR #34993', "go test ./core/txpool/blobpool -run 'Test.*Limbo|Test.*Blob' -count=1"],
] as const).map(([id, area, unit, evidence, command]) => ({ id, area, unit, evidence, ...getGuideForUnit(id, area, evidence), command }));

const protocolUnits: Unit[] = ([
  ['ENG-001', 'eth/catalyst', 'prepare/getPayload/newPayload happy path가 block 상태를 보존한다.', 'TestEth2PrepareAndGetPayload/TestEth2NewBlock', "go test ./eth/catalyst -run 'TestEth2PrepareAndGetPayload|TestEth2NewBlock' -count=1"],
  ['ENG-002', 'eth/catalyst', 'withdrawals/nil withdrawals/blob payload 변환이 fork별로 맞다.', 'TestWithdrawals/TestNilWithdrawals/TestBlockToPayloadWithBlobs', "go test ./eth/catalyst -run 'TestWithdrawals|TestNilWithdrawals|TestBlockToPayloadWithBlobs' -count=1"],
  ['ENG-003', 'miner', 'payload ID와 tx ordering이 deterministic하다.', 'TestPayloadId/TestTransaction*Sort', "go test ./miner -run 'TestPayloadId|TestTransaction.*Sort' -count=1"],
  ['API-001', 'internal/ethapi', 'estimateGas, eth_call, simulateV1이 override와 fork rule을 반영한다.', 'TestEstimateGas/TestCall/TestSimulateV1', "go test ./internal/ethapi -run 'TestEstimateGas|TestCall|TestSimulateV1' -count=1"],
  ['API-002', 'internal/ethapi', 'blob transaction sign/send/fill roundtrip이 sidecar/hash를 보존한다.', 'TestSignBlobTransaction/TestSendBlobTransaction/TestFillBlobTransaction', "go test ./internal/ethapi -run 'Test.*BlobTransaction' -count=1"],
  ['P2P-001', 'p2p', 'server listen/dial/cap/inbound throttle/discovery rollback이 동작한다.', 'p2p/server_test.go', "go test ./p2p -run 'TestServer' -count=1"],
  ['P2P-002', 'p2p/discover', 'UDPv4 ping/findnode timeout, table IP limit, v5 handshake vector가 유지된다.', 'p2p/discover tests', "go test ./p2p/discover ./p2p/discover/v5wire -run 'TestUDPv4|TestTable|TestHandshake' -count=1"],
  ['SYNC-001', 'eth/downloader', 'full/snap canonical sync, cancel, empty short circuit, progress가 분리된다.', 'eth/downloader tests', "go test ./eth/downloader -run 'TestCanonicalSynchronisation|TestCancel|TestEmptyShortCircuit|TestSyncProgress' -count=1"],
  ['SNAP-001', 'eth/protocols/snap', 'snap sync가 capped/corrupt/non-proving/misbehaving peer를 처리한다.', 'eth/protocols/snap/sync_test.go', "go test ./eth/protocols/snap -run 'TestSync|TestMultiSync' -count=1"],
  ['RPC-001', 'rpc', 'HTTP/WebSocket/batch/read-limit/tracing이 JSON-RPC 계약을 유지한다.', 'rpc/*_test.go', "go test ./rpc -run 'TestHTTP|TestWebsocket|TestServer|TestTracing' -count=1"],
  ['TRIE-001', 'trie,triedb', 'trie proof/iterator/sync/stacktrie/pathdb history가 root와 traversal을 보존한다.', 'trie + triedb/pathdb tests', "go test ./trie ./triedb ./triedb/pathdb -run 'Test.*' -count=1"],
  ['ABI-001', 'accounts/abi', 'ABI pack/unpack/topic/event/error/binding generation이 Solidity ABI 계약을 유지한다.', 'accounts/abi tests', "go test ./accounts/abi ./accounts/abi/bind/v2 -run 'Test' -count=1"],
] as const).map(([id, area, unit, evidence, command]) => ({ id, area, unit, evidence, ...getGuideForUnit(id, area, evidence), command }));

const nextCodebases = [
  ['reth', 'transaction pool, block execution, staged sync', 'Rust property tests + execution fixture'],
  ['prysm', 'BLS verification, fork choice, beacon state transition', 'spec tests + fuzz targets'],
  ['helios', 'light-client update, proof verification, RPC fallback', 'fixture replay + failure matrix'],
  ['context-manager', 'agent loop, tool approval, Telegram context handoff', 'eval tests + channel replay'],
];

const fmProcedures = [
  ['001', 'geth-blob-tx-fm', 'geth Blob 트랜잭션을 정적으로 검증하는 부분', 'txpool blob transaction을 상태 DB 없이 허용하거나 거절하는 경계'],
  ['002', 'geth-fm-002-header-rlp', '블록 헤더를 RLP 바이트에서 구조체로 읽는 부분', 'core/types header decode 의미와 allocation 경계'],
  ['003', 'geth-fm-003-getblobs-availability', '엔진 API가 Blob 데이터 보유 여부를 알려주는 부분', 'available count, nil blob list, tracing 경계'],
  ['004', 'geth-fm-004-graphql-raw-body', 'GraphQL이 본문이 없는 블록을 안전하게 보여주는 부분', 'block body 누락을 panic 없이 처리하는 API 경계'],
  ['005', 'geth-fm-005-transaction-args', 'RPC 트랜잭션 입력값이 타입에 맞는지 걸러내는 부분', 'explicit tx type과 필드 조합 검증 경계'],
  ['006', 'geth-fm-006-engine-payload-witness', '엔진 payload와 witness를 만들고 검증하는 부분', 'payload 생성/소비와 witness V5 경계'],
  ['007', 'geth-fm-007-chain-reorg', '체인 import와 재구성이 canonical 상태를 바꾸는 부분', 'canonical import, fork choice, tx/log reorg 경계'],
  ['008', 'geth-fm-008-state-recovery', '스냅샷과 원시 DB가 재시작 뒤 복구되는 부분', 'snapshot crash/restart, freezer, tx index repair 경계'],
  ['009', 'geth-fm-009-blobpool-limbo', 'Blob 트랜잭션 풀이 대기 데이터와 누락 데이터를 다루는 부분', 'legacy limbo blob과 sidecar decode 경계'],
  ['010', 'geth-fm-010-p2p-sync', 'P2P 피어 발견과 동기화가 나쁜 응답을 걸러내는 부분', 'peer, discovery, downloader, snap sync 경계'],
  ['011', 'geth-fm-011-rpc-node-cli', 'RPC 서버와 노드 실행 명령 입력을 안전하게 받는 부분', 'JSON-RPC, WebSocket, node lifecycle, CLI 입력 경계'],
  ['012', 'geth-fm-012-abi-signer', 'ABI 인코딩과 계정 서명이 사용자 입력을 처리하는 부분', 'ABI, keystore, signed data, SIWE parser 경계'],
  ['013', 'geth-fm-013-evm-state-transition', 'EVM 명령 실행과 상태 전이가 fork 규칙을 따르는 부분', 'opcode, intrinsic gas, eth_call, estimateGas, simulate 경계'],
  ['014', 'geth-fm-014-core-sethead-matrix', '체인 head를 되감을 때 상태와 스냅샷을 정리하는 부분', 'setHead, finalized root, snapshot mode matrix 경계'],
  ['015', 'geth-fm-015-ethapi-rpc-semantics', 'Ethereum RPC 메서드가 실행 결과를 일관되게 반환하는 부분', 'eth_call, simulate, receipt/block/tx marshal 경계'],
  ['016', 'geth-fm-016-beacon-light-client', 'Beacon light client가 checkpoint와 head를 따라가는 부분', 'committee, checkpoint, light sync, fork/reorg 경계'],
  ['017', 'geth-fm-017-tx-fetcher-state-machine', '트랜잭션 fetcher가 요청과 시간 초과 상태를 정리하는 부분', 'announce, request, deliver, timeout, rate-limit 경계'],
  ['018', 'geth-fm-018-snap-sync-peer-matrix', 'Snap sync가 손상된 peer 응답을 격리하는 부분', 'capped/corrupt/non-proving peer, request range 경계'],
  ['019', 'geth-fm-019-trie-proof-sync', 'Trie proof와 iterator가 state root를 보존하는 부분', 'trie root, proof, iterator, sync, stacktrie 경계'],
  ['020', 'geth-fm-020-pathdb-history', 'PathDB history와 prune이 읽기 가능한 상태를 지키는 부분', 'pathdb generation, history, index, prune, preimage 경계'],
  ['021', 'geth-fm-021-encoding-common', '공통 인코딩 라이브러리가 입력 모서리 값을 처리하는 부분', 'RLP, hexutil, address/hash, bitutil, LRU, mclock 경계'],
  ['022', 'geth-fm-022-crypto-fuzzers', '암호 primitive와 fuzz seed가 crash 없이 처리되는 부분', 'secp256k1, bn256, bls12-381, keccak fuzz 경계'],
  ['023', 'geth-fm-023-spec-fixture-replay', 'Execution spec fixture를 재생해 consensus 결과를 확인하는 부분', 'block/state/transaction/RLP/difficulty fixture 경계'],
  ['024', 'geth-fm-024-t8n-fixtures', 'EVM t8n fixture 출력이 fork별 JSON 형태를 지키는 부분', 'cmd/evm t8n fixture와 Amsterdam/BAL output 경계'],
  ['025', 'geth-fm-025-abigen-bindings', 'ABI binding 생성기가 Solidity ABI를 Go 코드로 바꾸는 부분', 'ABI parser, abigen, bind v1/v2 generation 경계'],
  ['026', 'geth-fm-026-metrics-tracing', 'Metrics와 tracing이 기존 동작을 바꾸지 않고 관찰값을 남기는 부분', 'metrics registry, tracing span, journal hook 경계'],
];

const essentialCoverage: Coverage[] = [
  {
    group: '최근 PR에서 다시 깨질 수 있는 부분',
    source: 'PR-35030-01..PR-34986-03',
    units: 28,
    fmCuts: '002, 003, 004, 005, 006, 009, 010, 012, 024, 026',
    command: "go test ./core/types ./eth/catalyst ./graphql ./internal/ethapi ./cmd/devp2p ./signer/core -run 'Test.*' -count=1",
    proof: 'header RLP, GetBlobs, GraphQL Raw, witness V5, TransactionArgs, fallback UDP, SIWE 같은 최근 회귀 단위를 개별 절차에 연결한다.',
  },
  {
    group: '체인과 상태 저장 핵심 부분',
    source: 'CORE-001..CORE-055',
    units: 55,
    fmCuts: '007, 008, 014, 019, 020, 026',
    command: "go test ./core ./core/rawdb ./core/tracing -run 'TestLastBlock|TestShorterFork|TestLongerFork|TestSetHead|Test.*NewSnapshot|TestFreezer|TestJournal' -count=1",
    proof: 'canonical import, fork choice, reorg event, setHead matrix, snapshot/rawdb recovery, trie/pathdb, tracing hook을 빠짐없이 나눈다.',
  },
  {
    group: 'EVM 실행과 트랜잭션 타입 처리 부분',
    source: 'EVM-001..EVM-020',
    units: 20,
    fmCuts: '005, 013, 015, 023, 024',
    command: "go test ./core/vm ./core ./internal/ethapi ./tests ./cmd/evm/internal/t8ntool -run 'Test.*Opcode|Test.*Intrinsic|TestEstimateGas|TestCall|TestSimulateV1|TestState|TestTransaction|Test.*T8n' -count=1",
    proof: 'opcode fixture, intrinsic gas, access list, call/estimate/simulate, blob tx signing, RPC marshal, t8n/spec fixture를 분리한다.',
  },
  {
    group: '합의 엔진과 Beacon 연동 부분',
    source: 'ENG-001..ENG-024',
    units: 24,
    fmCuts: '003, 006, 016, 018, 024',
    command: "go test ./eth/catalyst ./miner ./core/stateless ./beacon/light ./beacon/light/sync -run 'TestEth2|TestPayloadId|TestWitness|TestGetBlobs|Test.*Committee|Test.*Sync' -count=1",
    proof: 'payload build/order, Engine API validation, blob RPC, witness, beacon JSON, light client checkpoint/head sync를 담당 절차로 연결한다.',
  },
  {
    group: 'P2P 연결, 노드 발견, 동기화 부분',
    source: 'P2P-001..P2P-024',
    units: 24,
    fmCuts: '010, 017, 018',
    command: "go test ./p2p ./p2p/discover ./p2p/enode ./eth/fetcher ./eth/downloader ./eth/protocols/snap -run 'TestServer|TestUDPv4|TestTable|TestTransactionFetcher|TestCanonicalSynchronisation|TestSync' -count=1",
    proof: 'server/peer/dial/discovery/enode/netutil, tx fetcher 상태기, downloader, snap sync peer matrix를 절차별로 나눈다.',
  },
  {
    group: 'RPC 서버, 노드 생명주기, 실행 명령 부분',
    source: 'RPC-001..RPC-006, NODE-001..NODE-005, CLI-001..CLI-005',
    units: 16,
    fmCuts: '011, 015, 026',
    command: "go test ./rpc ./node ./cmd/geth ./cmd/devp2p ./internal/ethapi -run 'TestServer|TestHTTP|TestWebsocket|TestNode|Test.*Command|TestRPC|Test.*Tracing' -count=1",
    proof: 'JSON-RPC transport shape, node lifecycle, RPC stack auth/CORS/JWT, geth/devp2p CLI, ethapi semantic RPC를 따로 검증한다.',
  },
  {
    group: '계정, ABI, 서명 처리 부분',
    source: 'ACC-001..ACC-003, KEY-001..KEY-005, ABI-001..ABI-006, SIGN-001..SIGN-003',
    units: 17,
    fmCuts: '012, 025',
    command: "go test ./accounts ./accounts/abi ./accounts/abi/bind ./accounts/abi/bind/v2 ./accounts/keystore ./signer/core ./signer/fourbyte -run 'Test.*' -count=1",
    proof: 'text hash, HD path, URL, keystore, ABI parser/pack/unpack/topic/binding, SIWE, fourbyte fallback을 signer와 abigen 절차로 분리한다.',
  },
  {
    group: 'Trie, 상태 DB, 원시 DB 저장 부분',
    source: 'TRIE-001..TRIE-007, TRIEDB-001..TRIEDB-002, PATHDB-001..PATHDB-005, PREIMG-001',
    units: 15,
    fmCuts: '008, 019, 020',
    command: "go test ./trie ./trie/bintrie ./triedb ./triedb/pathdb ./core/rawdb -run 'Test.*Trie|Test.*Proof|Test.*Iterator|Test.*Sync|TestGenerate|Test.*History|Test.*Prune|TestFreezer' -count=1",
    proof: 'trie root/proof/iterator/sync/stacktrie, triedb generation, pathdb history/index/prune, preimage DB, freezer를 절차로 연결한다.',
  },
  {
    group: '암호 함수, 공통 타입, 인코딩 부분',
    source: 'ENC-001..ENC-006, CRYPTO-001..CRYPTO-004, LRU-001..LRU-002, CLOCK-001',
    units: 13,
    fmCuts: '002, 021, 022',
    command: "go test ./rlp ./common ./common/hexutil ./common/bitutil ./common/lru ./common/mclock ./crypto ./tests/fuzzers/secp256k1 ./tests/fuzzers/bn256 ./tests/fuzzers/bls12381 -run 'Test.*' -count=1",
    proof: 'RLP, hexutil, common bytes/address/hash, bitutil compression, LRU, mclock, secp256k1, bn256, BLS, keccak을 공통/crypto 절차로 나눈다.',
  },
  {
    group: '스펙 fixture, 퍼즈 seed, 재생 테스트 부분',
    source: 'SPEC-001..SPEC-005, FIX-001..FIX-003, FUZZ-001..FUZZ-004',
    units: 12,
    fmCuts: '013, 022, 023, 024, 025',
    command: "go test ./tests ./cmd/evm/internal/t8ntool ./internal/ethapi ./core/vm ./accounts/abi ./accounts/keystore ./trie ./common/bitutil -run 'Test.*' -count=1",
    proof: 'execution-spec block/state/tx/RLP/difficulty, t8n/ethapi/VM fixtures, ABI/keystore/stacktrie/bitutil fuzz targets를 replay/fuzz 절차에 연결한다.',
  },
];

const detailedCutAxes = [
  ['체인 head를 되감을 때 확인할 경우의 수', '014', '짧은 되감기와 긴 되감기, 얕은 fork와 깊은 fork, 오래된 fork와 새 fork, snap sync 상태, snapshot 사용 여부'],
  ['트랜잭션 fetcher 상태 전이', '017', '대기, 요청, 누락, 시간 초과, peer drop, 수수료 부족, rate limit'],
  ['Snap sync peer 응답 분리', '018', 'storage 없음/있음, 응답 제한, 손상된 코드와 account, proof 없는 peer, 잘못된 proof 응답, 고르지 않은 storage'],
  ['PathDB history와 prune 동작', '020', 'snapshot 손상, iterator seek/delete/readability, history encode/decode, prune pause-resume'],
  ['ABI와 abigen 세부 처리', '012, 025', 'type, pack, unpack, event, error, topic, v1/v2 binding generation, 악의적 입력'],
  ['EVM 전환 도구 fixture 묶음', '024', 'cmd/evm/testdata 190개 fixture, Amsterdam/BAL, slotNum JSON, deterministic output'],
];

function UnitTable({ units }: { units: Unit[] }) {
  return (
    <div className="not-prose">
      <div className="hidden overflow-hidden rounded-md border xl:block">
      <table className="w-full table-fixed text-sm">
        <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            <th className="w-44 px-4 py-3 font-semibold">코드 위치</th>
            <th className="px-4 py-3 font-semibold">확인할 동작</th>
            <th className="w-52 px-4 py-3 font-semibold">근거</th>
            <th className="w-44 px-4 py-3 font-semibold">코드 해설</th>
            <th className="w-72 px-4 py-3 font-semibold">실행 명령</th>
          </tr>
        </thead>
        <tbody>
          {units.map((item) => (
            <tr key={item.id} className="border-b last:border-0">
              <td className="px-4 py-3 align-top text-xs text-muted-foreground">{item.area}</td>
              <td className="px-4 py-3 align-top text-sm leading-relaxed">{item.unit}</td>
              <td className="px-4 py-3 align-top text-xs leading-relaxed text-muted-foreground">{item.evidence}</td>
              <td className="px-4 py-3 align-top">
                <Link to={item.guideHref} className="text-xs font-medium underline-offset-4 hover:underline">
                  {item.guideLabel}
                </Link>
              </td>
              <td className="px-4 py-3 align-top">
                <code className="break-words rounded bg-muted px-1.5 py-1 text-[11px] leading-relaxed text-muted-foreground">
                  {item.command}
                </code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="divide-y divide-border border-y border-border xl:hidden">
        {units.map((item) => (
          <article key={item.id} className="min-w-0 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold text-muted-foreground">{item.id} · {item.area}</span>
              <Link to={item.guideHref} className="text-xs font-semibold underline decoration-border underline-offset-4">{item.guideLabel}</Link>
            </div>
            <p className="mt-2 text-sm font-medium leading-relaxed">{item.unit}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">근거 · {item.evidence}</p>
            <code className="mt-3 block min-w-0 whitespace-pre-wrap break-all rounded-md bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">{item.command}</code>
          </article>
        ))}
      </div>
    </div>
  );
}

const registryFlow = [
  ['1', '기능군 선택', 'chain·state·EVM·P2P·RPC 중 실패 영역을 고른다.'],
  ['2', '검증 단위 선택', '한 행에서 동작·근거·명령을 함께 확인한다.'],
  ['3', '상세 경계 이동', '코드 위치·전제·불변조건·반례로 내려간다.'],
  ['4', '증거 갱신', '테스트 결과와 version·fork 전제를 기록한다.'],
];

function GethRegistryFlowViz() {
  return (
    <div className="not-prose my-7 border-y border-border py-5" aria-label="go-ethereum 검증 레지스트리 사용 순서">
      <p className="text-[11px] font-bold text-muted-foreground">REGISTRY → EVIDENCE</p>
      <ol className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
        {registryFlow.map(([number, title, detail]) => (
          <li key={number} className="min-w-0 bg-background p-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">{number}</span>
            <strong className="mt-2 block text-sm">{title}</strong>
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function GethTestUnits() {
  const totalUnits = recentPrUnits.length + coreUnits.length + protocolUnits.length;
  const totalProcedures = fmProcedures.length;
  const totalEssentialUnits = essentialCoverage.reduce((sum, item) => sum + item.units, 0);

  return (
    <>
      <section id="overview" className="mb-14 scroll-mt-20">
        <p className="mb-3 text-sm text-muted-foreground">코드베이스별 검증 레지스트리 · go-ethereum</p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">코드베이스별로 검증 단위를 누적한다</h2>
        <QuestionLead
          question="2천 개가 넘는 테스트 중 지금 고장 난 기능을 설명하는 최소 증거는 어떻게 찾을까?"
          answer="이 페이지는 순서대로 읽는 강의가 아니라 탐색 레지스트리다. 먼저 기능군을 고르고, 한 행의 관찰 가능한 동작과 코드 근거·실행 명령을 확인한 뒤, 연결된 상세 문서에서 불변조건과 반례로 내려간다. 표의 행 자체가 최종 설명은 아니다."
        />
        <ConceptPrimer
          title="레지스트리를 읽기 전에 구분할 네 객체"
          items={[
            { term: '기능군', meaning: 'Chain, state, EVM, Engine, P2P, RPC처럼 책임이 모이는 큰 탐색 축이다.', why: '처음부터 테스트 파일 이름을 뒤지지 않고 실패 영역을 좁힌다.' },
            { term: '검증 단위', meaning: '한 동작, 한 근거 위치, 한 실행 명령을 묶은 레지스트리의 한 행이다.', why: '테스트 개수를 기능 보장의 개수로 오해하지 않는다.' },
            { term: '상세 경계', meaning: '입력·출력·전제·불변조건·최소 반례가 설명된 별도 문서다.', why: '행의 요약을 검증 가능한 주장으로 확장한다.' },
            { term: '스냅샷 시각', meaning: 'PR 번호와 파일 수를 집계한 기준 날짜다.', why: '살아 있는 코드베이스의 현재 상태와 과거 inventory를 구분한다.' },
          ]}
        />
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          이 항목은 go-ethereum 테스트 코드와 최근 PR을 보고 만든 첫 코드베이스 레지스트리다.
          각 행은 하나의 관찰 가능한 동작, 근거, 실행 명령을 가진다. 같은 구조로 reth, prysm, helios,
          context-manager도 계속 추가한다.
        </p>
        <GethRegistryFlowViz />
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-lg border p-3">
              <p className="text-lg font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border bg-muted/25 p-4">
          <p className="text-sm font-semibold">현재 대표 단위 {totalUnits}개 · 필수 기능 단위 {totalEssentialUnits}개 · 기능별 검증 주제 {totalProcedures}개</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            전체 원본 메모는 context-manager의 <code>knowledge/topics/ethereum/geth-test-units-2026-05-22.md</code>에 있고,
            이 화면은 원본 메모의 주요 기능군을 코드 위치, 확인할 동작, 실행 명령이 있는 lab/core 운영판으로 정리한 것이다.
          </p>
        </div>
      </section>

      <section id="procedures" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">기능별 검증 주제</h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          이 페이지는 개요다. 실제 작업은 BlobTx 검증 경계 절차를 기준으로, 기능별로 하나의 코드 위치,
          불변조건, 반례 fixture, 코드 소스 설명, 대표 실행 명령을 갖는 상세 페이지로 나눠서 누적한다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {fmProcedures.map(([, slug, title, summary]) => (
            <Link key={slug} to={coreItemPath('verification-practice', slug)} className="rounded-lg border p-4 transition-colors hover:bg-accent">
              <p className="text-xs text-muted-foreground">go-ethereum에서 확인할 코드 부분</p>
              <h3 className="mt-1 text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="coverage" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">필수 기능 커버리지</h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          아래 표는 원본 메모의 모든 필수 단위 범위를 기능별 검증 주제에 연결한 감사표다. 대표 테이블 {totalUnits}개는 빠른 운영판이고,
          이 표의 {totalEssentialUnits}개가 "기능별로 확인했다"고 말할 수 있는 실제 커버리지 범위다.
        </p>
        <div className="hidden overflow-hidden rounded-md border xl:block">
          <table className="w-full table-fixed text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="w-44 px-4 py-3 font-semibold">기능군</th>
                <th className="w-56 px-4 py-3 font-semibold">원본 범위</th>
                <th className="w-20 px-4 py-3 font-semibold">단위</th>
                <th className="w-36 px-4 py-3 font-semibold">관련 검증 주제</th>
                <th className="px-4 py-3 font-semibold">확인 내용</th>
                <th className="w-80 px-4 py-3 font-semibold">대표 실행</th>
              </tr>
            </thead>
            <tbody>
              {essentialCoverage.map((item) => (
                <tr key={item.group} className="border-b last:border-0">
                  <td className="px-4 py-3 align-top font-medium">{item.group}</td>
                  <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">{item.source}</td>
                  <td className="px-4 py-3 align-top font-mono text-xs">{item.units}</td>
                  <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">{item.fmCuts}</td>
                  <td className="px-4 py-3 align-top text-sm leading-relaxed text-muted-foreground">{item.proof}</td>
                  <td className="px-4 py-3 align-top">
                    <code className="break-words rounded bg-muted px-1.5 py-1 text-[11px] leading-relaxed text-muted-foreground">
                      {item.command}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-border border-y border-border xl:hidden">
          {essentialCoverage.map((item) => (
            <article key={item.group} className="min-w-0 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">{item.group}</h3><span className="font-mono text-[11px] text-muted-foreground">{item.units} units</span></div>
              <p className="mt-2 text-xs text-muted-foreground">원본 {item.source} · 관련 검증 묶음 {item.fmCuts}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.proof}</p>
              <code className="mt-3 block min-w-0 whitespace-pre-wrap break-all rounded-md bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">{item.command}</code>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {detailedCutAxes.map(([title, cuts, axes]) => (
            <div key={title} className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">관련 검증 묶음 {cuts}</p>
              <h3 className="mt-1 text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{axes}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="recent-prs" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">최근 PR에서 나온 단위</h2>
        <UnitTable units={recentPrUnits} />
      </section>

      <section id="core-chain" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">Core chain/state 단위</h2>
        <UnitTable units={coreUnits} />
      </section>

      <section id="engine-p2p" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">Engine, API, P2P, Trie 단위</h2>
        <UnitTable units={protocolUnits} />
      </section>

      <section id="ledger" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">다음 코드베이스로 확장</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {nextCodebases.map(([name, scope, verification]) => (
            <div key={name} className="rounded-lg border p-4">
              <p className="font-mono text-xs text-muted-foreground">{name}</p>
              <h3 className="mt-1 text-sm font-semibold">{scope}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{verification}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={coreItemPath('verification-practice', 'fm-boundary-practice')} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            절단 방식 보기
          </Link>
          <Link to={coreItemPath('verification-practice', 'geth-blob-tx-fm')} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            BlobTx 코어 단위
          </Link>
        </div>
        <CapabilityCheck
          title="레지스트리를 사용해 할 수 있어야 하는 일"
          items={[
            '장애 증상에서 관련 기능군과 최소 실행 명령을 찾는다.',
            '테스트 이름과 실제로 보장하는 동작 문장을 구분한다.',
            '요약 행에서 상세 경계로 내려가 전제·불변조건·반례를 확인한다.',
            '기준 날짜 이후 변경은 최신 소스와 테스트 결과로 다시 검증한다.',
          ]}
        />
        <SourceNotes sources={[
          { label: 'go-ethereum repository', href: 'https://github.com/ethereum/go-ethereum', note: '파일 위치, 테스트와 PR 상태를 다시 확인할 원본 코드베이스.' },
          { label: 'Go test command', href: 'https://pkg.go.dev/cmd/go#hdr-Test_packages', note: 'Package와 -run filter로 검증 범위를 좁히는 공식 명령 문서.' },
          { label: 'Go Fuzzing', href: 'https://go.dev/doc/security/fuzz/', note: 'Fixture replay와 함께 입력 공간의 반례를 확장하는 공식 안내.' },
        ]} />
      </section>
    </>
  );
}
