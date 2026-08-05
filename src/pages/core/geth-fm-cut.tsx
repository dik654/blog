import { Link, useParams } from 'react-router-dom';
import { CodeSidebar, useCodeSidebar, type CodeRef, type FileNode } from '@/components/code';
import { getGethSourceSnippet } from './geth-source-snippets';
import { coreItemPath } from '@/lib/paths';

type Cut = {
  slug: string;
  number: string;
  title: string;
  source: string;
  boundary: string;
  excludes: string;
  command: string;
  invariants: string[][];
  tests: string[][];
  next: string[];
};

type CodeSource = {
  path: string;
  role: string;
  notes: string[];
  code: string;
  sourcePath: string;
  lineStart: number;
};

function describeSource(path: string, cut: Cut): CodeSource {
  const trimmed = path.trim();
  const custom: Record<string, Omit<CodeSource, 'code' | 'sourcePath' | 'lineStart'>> = {
    p2p: {
      path: trimmed,
      role: 'peer 서버가 연결 수, inbound 제한, dial 흐름을 관리하는 패키지',
      notes: [
        '새 peer가 들어왔을 때 바로 신뢰하지 않고 cap과 throttle을 먼저 적용하는지 확인한다.',
        '서버 시작, listen, dial, close 반복이 resource leak이나 panic 없이 끝나는지 본다.',
        '테스트에서는 정상 연결과 초과 연결을 분리해서 기대 결과를 적어야 한다.',
      ],
    },
    'p2p/discover': {
      path: trimmed,
      role: '노드 발견 요청과 응답 시간 초과를 다루는 discovery 패키지',
      notes: [
        'ping, findnode, handshake가 timeout이나 잘못된 응답에서 무한 대기하지 않는지 확인한다.',
        '잘못된 vector와 rekey 입력은 정상 peer 진행 상태와 섞이면 안 된다.',
        '실패한 discovery 요청은 bounded failure로 끝나고 다음 요청을 막지 않아야 한다.',
      ],
    },
    'p2p/enode': {
      path: trimmed,
      role: '노드 주소, 포트, 식별자를 파싱하고 검증하는 패키지',
      notes: [
        'UDP 포트처럼 숫자 범위가 정해진 입력은 네트워크 연결 전에 먼저 거부되어야 한다.',
        '잘못된 주소 문자열이 내부 peer 상태로 들어오지 못하게 막는지 확인한다.',
      ],
    },
    'eth/downloader': {
      path: trimmed,
      role: '체인 동기화 진행률, 취소, 빈 응답을 정리하는 downloader 패키지',
      notes: [
        '동기화 중 취소가 발생해도 progress 상태가 다음 실행에 오염되지 않는지 본다.',
        '빈 응답이나 느린 peer를 정상 peer의 진행 상태와 분리해야 한다.',
      ],
    },
    'eth/protocols/snap': {
      path: trimmed,
      role: 'snap sync에서 account, storage, proof 응답을 검증하는 패키지',
      notes: [
        '손상된 account/storage 응답은 peer penalty 또는 reject로 끝나야 한다.',
        'corrupt peer 하나가 정상 peer의 range progress를 망가뜨리지 않아야 한다.',
      ],
    },
  };

  const source = custom[trimmed] ?? {
    path: trimmed,
    role: `${cut.title}에서 실제 입력, 상태 변경, 오류 반환이 일어나는 코드 위치`,
    notes: [
      `${cut.boundary}`,
      `가장 먼저 확인할 불변조건: ${cut.invariants[0]?.[1] ?? '입력과 출력 의미가 기존 동작을 유지해야 한다.'}`,
      `대표 반례는 "${cut.tests[0]?.[1] ?? '잘못된 fixture'}"처럼 한 조건만 깨도록 작성한다.`,
    ],
  };

  const snippet = getGethSourceSnippet(source.path);

  return {
    ...source,
    code: snippet?.code ?? '// 실제 go-ethereum 소스 스니펫을 아직 연결하지 못한 항목입니다.',
    sourcePath: snippet?.sourcePath ?? source.path,
    lineStart: snippet?.lineStart ?? 1,
  };
}

function codeKeyForSource(cut: Cut, index: number) {
  return `${cut.slug}-source-${index}`;
}

function sourceToCodeRef(source: CodeSource): CodeRef {
  const lineCount = source.code.split('\n').length;
  return {
    path: `go-ethereum/${source.sourcePath}`,
    code: source.code,
    lang: 'go',
    highlight: [1, lineCount],
    lineStart: source.lineStart,
    desc: source.role,
    annotations: source.notes.map((note, index) => ({
      lines: [Math.min(index + 2, lineCount), Math.min(index + 2, lineCount)] as [number, number],
      color: (['sky', 'emerald', 'amber'] as const)[index % 3],
      note,
    })),
  };
}

function sourcesToFileTree(cut: Cut, sources: CodeSource[]): FileNode {
  return {
    name: 'go-ethereum',
    type: 'dir',
    children: sources.map((source, index) => ({
      name: source.path,
      type: 'file',
      path: source.path,
      codeKey: codeKeyForSource(cut, index),
    })),
  };
}

const cuts: Cut[] = [
  {
    slug: 'geth-fm-002-header-rlp',
    number: '002',
    title: '블록 헤더를 RLP 바이트에서 구조체로 읽는 부분',
    source: 'core/types/header.go, core/types/gen_header_rlp.go, eth/protocols/eth/handler_test.go',
    boundary: 'Header RLP decode 입력 bytes를 Header 값으로 바꾸는 경계. 최적화가 의미, error, ownership을 바꾸면 안 된다.',
    excludes: 'RLP 포맷 자체의 수학적 정의와 네트워크 전송 정책은 제외한다.',
    command: "go test ./core/types ./eth/protocols/eth -run 'Test.*Header.*Decode|Test.*RLP|Test.*BlockHeaders' -count=1",
    invariants: [
      ['semantic equivalence', 'legacy/London header decode 결과는 기존 Header 필드와 동일해야 한다.'],
      ['no stale optional fields', 'reuse buffer에 더 짧은 header를 decode해도 이전 optional field 값이 남지 않아야 한다.'],
      ['trailing input rejection', 'trailing RLP input은 최적화 전과 동일하게 거부되어야 한다.'],
      ['ownership isolation', 'BlockHeaders response decode 후 header 객체가 공유 mutation을 만들지 않아야 한다.'],
    ],
    tests: [
      ['T0 legacy header', 'legacy fixture를 decode한다.', '필드가 expected Header와 일치한다.'],
      ['T1 London header', 'baseFee가 있는 header를 decode한다.', 'London field가 보존된다.'],
      ['T2 reuse buffer', '긴 header 뒤 짧은 header를 같은 대상에 decode한다.', 'stale 값이 남지 않는다.'],
      ['T3 trailing bytes', '정상 header 뒤에 garbage bytes를 붙인다.', 'decode error가 유지된다.'],
      ['T4 benchmark guard', 'header decode benchmark를 돌린다.', 'allocation budget 회귀를 검토한다.'],
    ],
    next: ['core/types transaction RLP decode', 'receipt/log RLP decode ownership'],
  },
  {
    slug: 'geth-fm-003-getblobs-availability',
    number: '003',
    title: '엔진 API가 Blob 데이터 보유 여부를 알려주는 부분',
    source: 'eth/catalyst/api.go, eth/catalyst/api_test.go, beacon/engine/types.go',
    boundary: 'Engine API의 GetBlobs 계열 호출이 blob presence, availability metric, JSON shape를 보존하는 경계.',
    excludes: 'blobpool 내부 저장 정책과 KZG proof 검증은 별도 절단으로 둔다.',
    command: "go test ./eth/catalyst ./beacon/engine -run 'TestGetBlobs|Test.*Blob.*JSON|Test.*Payload' -count=1",
    invariants: [
      ['true count only', 'AvailableBlobs 길이가 아니라 true 개수만 available metric에 반영한다.'],
      ['partial availability', '일부 blob만 available이어도 v2/v3 응답 조건이 무너지지 않는다.'],
      ['nil preservation', 'nil blob list는 빈 배열 의미로 바뀌지 않고 JSON roundtrip 된다.'],
      ['trace transparency', 'tracing 추가는 응답 shape나 error 의미를 바꾸지 않는다.'],
    ],
    tests: [
      ['T0 all available', '모든 requested blob을 available로 둔다.', 'count == requested length'],
      ['T1 partial', '중간 항목만 unavailable로 둔다.', 'count == true 개수'],
      ['T2 none', '모든 availability를 false로 둔다.', 'zero count와 정상 error 의미 분리'],
      ['T3 nil list', 'payload blob list를 nil로 marshal/unmarshal한다.', 'nil 의미 보존'],
      ['T4 tracing', 'tracing enabled 상태로 GetBlobs를 호출한다.', '응답 계약 유지'],
    ],
    next: ['blobpool GetBlobs 저장 경계', 'Engine API blob sidecar version 경계'],
  },
  {
    slug: 'geth-fm-004-graphql-raw-body',
    number: '004',
    title: 'GraphQL이 본문이 없는 블록을 안전하게 보여주는 부분',
    source: 'graphql/graphql.go, graphql/graphql_test.go',
    boundary: 'GraphQL Raw resolver가 header는 있지만 body가 없는 block을 panic 없이 표현하는 API 경계.',
    excludes: 'DB corruption 복구 정책과 GraphQL 스키마 전체 설계는 제외한다.',
    command: "go test ./graphql -run 'TestGraphQL.*Block|Test.*Raw' -count=1",
    invariants: [
      ['no panic', 'body 누락은 panic이나 process crash로 이어지면 안 된다.'],
      ['stable response', 'GraphQL 응답은 null/error 중 정해진 shape로 유지되어야 한다.'],
      ['header distinction', 'block 자체가 없는 경우와 body만 없는 경우를 구분할 수 있어야 한다.'],
    ],
    tests: [
      ['T0 full block', 'header와 body가 모두 있는 block을 조회한다.', 'raw field 반환'],
      ['T1 missing body', 'header만 남기고 body lookup을 실패시킨다.', 'panic 없이 관찰 가능한 응답'],
      ['T2 missing block', 'block 전체가 없는 hash를 조회한다.', 'missing block 응답'],
    ],
    next: ['RPC getBlock body/receipt 누락 경계', 'canonical receipt lookup 누락 경계'],
  },
  {
    slug: 'geth-fm-005-transaction-args',
    number: '005',
    title: 'RPC 트랜잭션 입력값이 타입에 맞는지 걸러내는 부분',
    source: 'internal/ethapi/transaction_args.go, internal/ethapi/transaction_args_test.go',
    boundary: 'RPC TransactionArgs가 explicit tx type과 필드 조합을 실제 transaction으로 정규화하는 경계.',
    excludes: '서명자 key 관리, mempool admission, EVM 실행 결과는 제외한다.',
    command: "go test ./internal/ethapi -run 'Test.*TransactionArgs|TestSetFeeDefaults|Test.*BlobTransaction' -count=1",
    invariants: [
      ['type-field compatibility', '명시 tx type과 허용 필드 집합이 불일치하면 거부한다.'],
      ['blob field gating', 'blob 전용 필드는 legacy/dynamic fee tx에 섞이면 안 된다.'],
      ['fee defaulting', 'fee cap, tip, gas price defaulting은 tx type별 규칙을 따른다.'],
      ['sidecar preservation', 'blob tx fill/send/sign roundtrip은 sidecar/hash를 잃지 않는다.'],
    ],
    tests: [
      ['T0 legacy', 'legacy type + gasPrice만 입력한다.', 'legacy tx 생성'],
      ['T1 dynamic fee', '1559 type + feeCap/tip을 입력한다.', 'dynamic fee tx 생성'],
      ['T2 mixed blob field', 'legacy type에 blobHashes를 넣는다.', 'validation error'],
      ['T3 blob tx', 'blob type + sidecar/hash를 입력한다.', 'blob tx roundtrip'],
      ['T4 defaulting', '일부 fee field를 비워 둔다.', 'type별 default 적용'],
    ],
    next: ['txpool admission validation', 'eth_sendRawTransaction sync timeout 경계'],
  },
  {
    slug: 'geth-fm-006-engine-payload-witness',
    number: '006',
    title: '엔진 payload와 witness를 만들고 검증하는 부분',
    source: 'eth/catalyst, miner, core/stateless, cmd/evm/internal/t8ntool',
    boundary: 'payload 생성/조회/소비와 witness V5 encoding이 Engine API의 상태 전이를 보존하는 경계.',
    excludes: 'consensus client 구현과 witness 내부 압축 알고리즘은 제외한다.',
    command: "go test ./eth/catalyst ./miner ./core/stateless -run 'TestEth2PrepareAndGetPayload|TestEth2NewBlock|TestWitnessCreationAndConsumption|TestPayloadId' -count=1",
    invariants: [
      ['payload id determinism', '동일 입력 payload attributes는 안정적인 payload ID를 만든다.'],
      ['state preservation', 'prepare/getPayload/newPayload 경로는 같은 block 상태를 관찰한다.'],
      ['witness ordering', 'engine_newPayloadWithWitnessV5 field ordering은 spec fixture와 일치한다.'],
      ['fork request validation', 'Amsterdam/Prague 요청 필드는 fork rule에 맞게 검증된다.'],
    ],
    tests: [
      ['T0 prepare-get', 'payload를 prepare하고 getPayload로 읽는다.', 'block 상태 일치'],
      ['T1 newPayload', 'payload를 newPayload로 넣는다.', 'valid status'],
      ['T2 witness V5', 'witness payload를 생성/소비한다.', 'field ordering과 state 일치'],
      ['T3 invalid timestamp', 'parent보다 이른 timestamp를 넣는다.', 'invalid payload'],
      ['T4 t8n shape', 'Amsterdam t8n JSON을 생성한다.', '새 필드 shape 일치'],
    ],
    next: ['fork별 requests validation', 'stateless witness proof 소비 경계'],
  },
  {
    slug: 'geth-fm-007-chain-reorg',
    number: '007',
    title: '체인 import와 재구성이 canonical 상태를 바꾸는 부분',
    source: 'core/blockchain.go, core/blockchain_test.go',
    boundary: 'block/header import가 canonical head, fork choice, tx/log 이벤트를 갱신하는 경계.',
    excludes: '네트워크 sync peer 선택과 EVM opcode 세부 실행은 제외한다.',
    command: "go test ./core -run 'TestLastBlock|TestShorterFork|TestLongerFork|TestChainTxReorgs|TestLogReorgs|TestEIP1559Transition|TestEIP7702' -count=1",
    invariants: [
      ['canonical stability', '짧은 fork는 canonical chain을 이기지 못한다.'],
      ['long fork reorg', '더 긴 유효 fork는 canonical mapping과 head를 갱신한다.'],
      ['event semantics', 'tx/log reorg 이벤트는 removed/rebirth 의미를 보존한다.'],
      ['fork transitions', 'EIP-1559, 7702 등 fork rule은 지정 block부터 적용된다.'],
    ],
    tests: [
      ['T0 extend canonical', '현재 head 뒤에 block을 붙인다.', 'head 갱신'],
      ['T1 shorter fork', '짧은 side chain을 넣는다.', 'canonical 유지'],
      ['T2 longer fork', '더 긴 side chain을 넣는다.', 'reorg 발생'],
      ['T3 log rebirth', 'log가 removed 후 새 canonical에서 다시 나온다.', 'rebirth 이벤트'],
      ['T4 fork transition', 'fork block 전후 tx를 실행한다.', 'rule 차이 관찰'],
    ],
    next: ['state processor error boundary', 'snap sync reorg boundary'],
  },
  {
    slug: 'geth-fm-008-state-recovery',
    number: '008',
    title: '스냅샷과 원시 DB가 재시작 뒤 복구되는 부분',
    source: 'core/blockchain_snapshot_test.go, core/rawdb, core/txindexer',
    boundary: 'crash/restart/setHead/truncate 이후 state root와 raw database index가 복구되는 경계.',
    excludes: '운영체제 fsync 보장과 실제 디스크 장애 모델은 제외한다.',
    command: "go test ./core ./core/rawdb -run 'Test.*NewSnapshot|TestRecoverSnapshot|TestFreezer|TestTxIndexer|Test.*Repair' -count=1",
    invariants: [
      ['root preservation', 'snapshot restart 후 state root가 기대값과 일치한다.'],
      ['crash recovery', 'commit 전/후 crash 경계에서 snapshot이 복구된다.'],
      ['freezer atomicity', 'append/read/truncate/repair가 partial visible state를 만들지 않는다.'],
      ['index repair', 'tx indexer repair는 누락 range를 채우고 기존 range를 깨지 않는다.'],
    ],
    tests: [
      ['T0 restart', 'snapshot 생성 후 node를 재시작한다.', 'root 보존'],
      ['T1 no commit crash', 'commit 전 crash를 모사한다.', '복구 성공'],
      ['T2 setHead', 'setHead 후 snapshot을 읽는다.', 'root 일치'],
      ['T3 freezer truncate', 'freezer를 append 후 truncate한다.', '범위 일관성'],
      ['T4 index repair', 'tx index 구간을 비운다.', 'repair 후 조회 성공'],
    ],
    next: ['pathdb history boundary', 'trie proof/sync boundary'],
  },
  {
    slug: 'geth-fm-009-blobpool-limbo',
    number: '009',
    title: 'Blob 트랜잭션 풀이 대기 데이터와 누락 데이터를 다루는 부분',
    source: 'core/txpool/blobpool, core/types/tx_blob.go',
    boundary: 'blobpool이 pending/limbo blob과 sidecar decode를 유지하며 blob transaction을 수용/거절하는 경계.',
    excludes: 'KZG 내부 수학과 Engine GetBlobs API는 다른 절단으로 둔다.',
    command: "go test ./core/txpool/blobpool ./core/types -run 'Test.*Limbo|Test.*Blob|Test.*Sidecar|Test.*Marshal' -count=1",
    invariants: [
      ['legacy limbo recovery', 'legacy limbo blob은 재시작/조회 후에도 복구 가능해야 한다.'],
      ['version preservation', 'sidecar decode는 versioned hash version을 잃지 않는다.'],
      ['sidecar consistency', 'blob/hash/commitment/proof 배열은 같은 blob 집합을 설명한다.'],
      ['rejection stability', 'pool rejection reason은 fixture별로 안정적이어야 한다.'],
    ],
    tests: [
      ['T0 pending blob', '정상 blob tx를 pool에 넣는다.', 'accepted'],
      ['T1 limbo recovery', 'legacy limbo blob을 저장 후 조회한다.', 'recovered'],
      ['T2 sidecar version', 'versioned sidecar를 marshal/decode한다.', 'version 보존'],
      ['T3 hash mismatch', 'sidecar commitment를 바꾼다.', 'rejected'],
      ['T4 missing blob', 'hash는 있고 blob이 없다.', 'limbo 또는 reject 경계 유지'],
    ],
    next: ['BlobTx 001 proof boundary 확장', 'Engine GetBlobs 저장소 연결'],
  },
  {
    slug: 'geth-fm-010-p2p-sync',
    number: '010',
    title: 'P2P 피어 발견과 동기화가 나쁜 응답을 걸러내는 부분',
    source: 'p2p, p2p/discover, p2p/enode, eth/downloader, eth/protocols/snap',
    boundary: 'peer 연결, discovery, downloader, snap sync가 나쁜 peer와 입력을 제한하면서 progress를 보존하는 경계.',
    excludes: '실제 인터넷 latency 분포와 full devp2p protocol proof는 제외한다.',
    command: "go test ./p2p ./p2p/discover ./p2p/enode ./eth/downloader ./eth/protocols/snap -run 'TestServer|TestUDPv4|TestTable|TestCanonicalSynchronisation|TestSync' -count=1",
    invariants: [
      ['input range', 'fallback UDP port는 0..65535 범위를 벗어나면 거부된다.'],
      ['resource guard', 'peer cap, inbound throttle, bandwidth limit가 초과 peer를 제한한다.'],
      ['handshake safety', 'discv4/v5 timeout, bad vector, rekey case가 분리된다.'],
      ['sync progress', 'cancel/empty/corrupt peer 경계에서도 progress state가 일관된다.'],
    ],
    tests: [
      ['T0 server dial', '서버 listen/dial을 수행한다.', 'peer 연결'],
      ['T1 bad UDP port', '범위 밖 UDP port를 입력한다.', 'validation error'],
      ['T2 discovery timeout', 'ping/findnode timeout을 모사한다.', 'bounded failure'],
      ['T3 downloader cancel', 'sync 중 cancel한다.', 'progress cleanup'],
      ['T4 corrupt snap peer', 'corrupt account/storage response를 준다.', 'peer penalty/reject'],
    ],
    next: ['eth fetcher transaction state machine', 'snap request sorting/range boundary'],
  },
  {
    slug: 'geth-fm-011-rpc-node-cli',
    number: '011',
    title: 'RPC 서버와 노드 실행 명령 입력을 안전하게 받는 부분',
    source: 'rpc, node, cmd/geth, cmd/devp2p',
    boundary: '외부 사용자가 만지는 JSON-RPC, WebSocket/HTTP, node lifecycle, CLI 입력 검증 표면.',
    excludes: '각 RPC method 내부의 chain semantics는 기능별 절단으로 분리한다.',
    command: "go test ./rpc ./node ./cmd/geth ./cmd/devp2p -run 'TestServer|TestHTTP|TestWebsocket|TestNode|Test.*Command|Test.*Fallback' -count=1",
    invariants: [
      ['json-rpc shape', 'method/content-type/read-limit 오류도 JSON-RPC 응답 shape를 유지한다.'],
      ['batch bounds', 'batch request/response size limit가 success/error 모두에 적용된다.'],
      ['lifecycle idempotency', 'node start/close 반복은 resource leak이나 panic을 만들지 않는다.'],
      ['cli validation', 'CLI flag/input validation은 실행 전에 잘못된 값을 거부한다.'],
    ],
    tests: [
      ['T0 rpc call', '정상 JSON-RPC call을 보낸다.', 'success response'],
      ['T1 batch over limit', '큰 batch response를 만든다.', 'bounded error response'],
      ['T2 websocket origin', '허용되지 않은 origin으로 연결한다.', 'reject'],
      ['T3 node close twice', 'node close를 두 번 호출한다.', 'safe no-op'],
      ['T4 CLI invalid port', 'devp2p fallback UDP port를 잘못 넣는다.', 'usage/validation error'],
    ],
    next: ['ethapi method별 semantic cut', 'admin/debug namespace safety cut'],
  },
  {
    slug: 'geth-fm-012-abi-signer',
    number: '012',
    title: 'ABI 인코딩과 계정 서명이 사용자 입력을 처리하는 부분',
    source: 'accounts, accounts/abi, accounts/keystore, signer/core',
    boundary: 'ABI encode/decode, keystore signing, signed data display, SIWE parser가 사용자-facing crypto 계약을 지키는 경계.',
    excludes: 'ECDSA/KDF 암호학 구현 자체의 수학적 proof는 제외하고 API 관찰값만 고정한다.',
    command: "go test ./accounts ./accounts/abi ./accounts/keystore ./signer/core -run 'Test.*' -count=1",
    invariants: [
      ['abi roundtrip', 'pack/unpack/topic/event/error signature가 Solidity ABI 계약과 일치한다.'],
      ['malicious input bound', '악의적 ABI 입력이 OOM이나 unbounded allocation을 만들지 않는다.'],
      ['keystore boundary', 'encrypt/decrypt/sign/unlock은 passphrase와 timeout 경계를 지킨다.'],
      ['siwe fixture split', 'SIWE positive fixture는 parse되고 negative fixture는 거부된다.'],
    ],
    tests: [
      ['T0 ABI pack', 'method input을 pack한다.', 'expected bytes'],
      ['T1 ABI unpack', 'tuple/array/string을 unpack한다.', 'expected Go values'],
      ['T2 malicious ABI', '큰/악성 ABI input을 준다.', 'bounded error'],
      ['T3 keystore sign', 'passphrase로 unlock/sign한다.', 'signature 생성'],
      ['T4 SIWE negative', 'invalid SIWE fixture를 parse한다.', 'reject'],
    ],
    next: ['abigen binding generation cut', 'signed typed data EIP-712 display cut'],
  },
  {
    slug: 'geth-fm-013-evm-state-transition',
    number: '013',
    title: 'EVM 명령 실행과 상태 전이가 fork 규칙을 따르는 부분',
    source: 'core/vm, core/state_transition_test.go, internal/ethapi/api_test.go, tests/state_test.go',
    boundary: 'EVM opcode 실행, intrinsic gas, access list, eth_call/estimate/simulate가 fork rule과 state override를 보존하는 실행 경계.',
    excludes: 'execution-spec 전체 fixture replay와 t8n CLI 출력은 별도 절단으로 둔다.',
    command: "go test ./core/vm ./core ./internal/ethapi -run 'Test.*Opcode|Test.*Intrinsic|TestEstimateGas|TestCall|TestSimulateV1|TestCreateAccessList' -count=1",
    invariants: [
      ['opcode determinism', '동일 opcode fixture는 같은 stack, memory, storage, gas 결과를 만든다.'],
      ['gas rule split', 'intrinsic gas와 access list cost는 tx type과 fork rule별로 달라진다.'],
      ['override isolation', 'state/block override는 해당 call이나 simulate 범위 밖으로 새지 않는다.'],
      ['error distinction', 'revert, invalid input, out-of-gas, timeout은 서로 다른 관찰 가능한 결과로 남는다.'],
    ],
    tests: [
      ['T0 opcode fixture', 'VM fixture를 실행한다.', 'expected stack/state/gas'],
      ['T1 intrinsic gas', 'tx type별 intrinsic gas 입력을 준다.', 'fork별 gas 일치'],
      ['T2 estimate revert', 'revert하는 call을 estimateGas에 넣는다.', 'revert/error 경계 유지'],
      ['T3 state override', 'precompile/account override를 넣고 eth_call한다.', 'override 범위 내 결과'],
      ['T4 simulate chain', '여러 block simulate를 수행한다.', 'parent/head linkage 보존'],
    ],
    next: ['execution-spec state fixture replay', 'precompile별 gas/spec boundary'],
  },
  {
    slug: 'geth-fm-014-core-sethead-matrix',
    number: '014',
    title: '체인 head를 되감을 때 상태와 스냅샷을 정리하는 부분',
    source: 'core/blockchain_sethead_test.go, core/blockchain_snapshot_test.go',
    boundary: 'setHead가 canonical markers, finalized root, snapshots, snap synced 상태를 축별로 안전하게 되감는 경계.',
    excludes: '일반 fork-choice import와 raw freezer repair는 007/008 절단으로 둔다.',
    command: "go test ./core -run 'TestSetHead|Test.*Head|Test.*Finalized|Test.*Snapshot' -count=1",
    invariants: [
      ['head monotonic reset', 'setHead 후 canonical head/header/fast head 관계가 요청 높이와 일치한다.'],
      ['finalized guard', 'finalized root 이후로 잘못 되감는 회귀를 허용하지 않는다.'],
      ['snapshot mode split', 'snap synced/syncing, snapshot on/off 조합마다 state lookup 결과가 안정적이다.'],
      ['receipt/body tolerance', 'body나 receipt가 일부 빠져도 canonical lookup이 정의된 방식으로 실패한다.'],
    ],
    tests: [
      ['T0 shallow rewind', '가까운 head로 setHead한다.', 'head와 canonical marker 갱신'],
      ['T1 deep rewind', '오래된 head로 setHead한다.', 'state/snapshot cleanup'],
      ['T2 finalized root', 'finalized 이후 경계를 되감는다.', 'guarded behavior'],
      ['T3 snap syncing', 'snap sync 중 setHead를 호출한다.', 'sync state 보존'],
      ['T4 missing receipt', 'canonical receipt/body 누락 fixture를 만든다.', 'bounded lookup failure'],
    ],
    next: ['setHead 축별 40+ 세부 케이스', 'snap sync reorg와 setHead 결합'],
  },
  {
    slug: 'geth-fm-015-ethapi-rpc-semantics',
    number: '015',
    title: 'Ethereum RPC 메서드가 실행 결과를 일관되게 반환하는 부분',
    source: 'internal/ethapi, internal/ethapi/testdata, rpc marshal tests',
    boundary: 'eth_call, estimateGas, simulateV1, receipt/block/tx RPC marshal이 사용자-facing Ethereum API 의미를 유지하는 경계.',
    excludes: 'RPC transport limit, WebSocket origin, node lifecycle은 011 절단으로 둔다.',
    command: "go test ./internal/ethapi -run 'TestEstimateGas|TestCall|TestSimulateV1|TestRPCMarshalBlock|TestRPCGet.*Receipt|TestGetStorageValues|TestSendRawTransactionSync' -count=1",
    invariants: [
      ['call fidelity', 'eth_call은 state override, block override, fork rule을 반영한다.'],
      ['simulation ordering', 'simulateV1은 block order, parent linkage, sender defaulting을 sanitize한다.'],
      ['rpc shape stability', 'block/header/tx/receipt JSON field는 fork별로 안정적이다.'],
      ['sync send split', 'SendRawTransactionSync 성공과 timeout은 같은 error로 뭉개지지 않는다.'],
    ],
    tests: [
      ['T0 estimate', '성공/revert tx를 estimateGas에 넣는다.', 'gas 또는 typed error'],
      ['T1 call override', 'state override와 block override를 넣는다.', 'expected return'],
      ['T2 simulate order', '잘못 정렬된 simulate block을 준다.', 'sanitized order'],
      ['T3 receipt fork field', 'fork별 receipt를 marshal한다.', 'field shape 일치'],
      ['T4 sync timeout', 'raw tx sync send timeout을 모사한다.', 'timeout error 분리'],
    ],
    next: ['debug_traceCall semantic boundary', 'ethapi fixture golden output cut'],
  },
  {
    slug: 'geth-fm-016-beacon-light-client',
    number: '016',
    title: 'Beacon light client가 checkpoint와 head를 따라가는 부분',
    source: 'beacon/light, beacon/light/sync, eth/catalyst engine tests',
    boundary: 'committee root, checkpoint, head sync, fork/reorg 처리가 light client 관찰 상태를 보존하는 경계.',
    excludes: 'consensus client 전체 fork choice와 beacon networking은 제외한다.',
    command: "go test ./beacon/light ./beacon/light/sync -run 'Test.*Committee|Test.*Checkpoint|Test.*Head|Test.*Sync|Test.*Reorg|Test.*Fork' -count=1",
    invariants: [
      ['committee root', 'committee proof/root는 checkpoint 기준과 일치해야 한다.'],
      ['checkpoint progress', 'checkpoint sync는 다른 head나 parallel fetch 상황에서도 head를 오염시키지 않는다.'],
      ['fork awareness', 'fork별 light client update shape가 기대 필드를 유지한다.'],
      ['reorg tolerance', 'light client reorg는 accepted head와 checkpoint 관계를 깨지 않는다.'],
    ],
    tests: [
      ['T0 committee chain', 'committee chain fixture를 검증한다.', 'root/proof 일치'],
      ['T1 checkpoint sync', 'checkpoint에서 sync를 시작한다.', 'head progress'],
      ['T2 parallel heads', '서로 다른 head update를 병렬 처리한다.', 'consistent winner'],
      ['T3 fork update', 'fork 경계 update를 넣는다.', 'shape/fork rule 일치'],
      ['T4 reorg', 'light client reorg fixture를 넣는다.', 'checkpoint relation 보존'],
    ],
    next: ['portal/light-client bridge cut', 'weak subjectivity checkpoint policy'],
  },
  {
    slug: 'geth-fm-017-tx-fetcher-state-machine',
    number: '017',
    title: '트랜잭션 fetcher가 요청과 시간 초과 상태를 정리하는 부분',
    source: 'eth/fetcher/tx_fetcher_test.go',
    boundary: 'transaction fetcher가 announce, wait, request, deliver, missing, timeout, drop, rate-limit 상태를 전이하는 네트워크 상태기 경계.',
    excludes: 'p2p handshake/discovery와 txpool admission 세부 검증은 다른 절단으로 둔다.',
    command: "go test ./eth/fetcher -run 'TestTransactionFetcher' -count=1",
    invariants: [
      ['single ownership', '한 tx hash는 waiting/requesting/delivered 상태 중 하나로만 관찰되어야 한다.'],
      ['reschedule safety', 'failed/missing/timeout 후 reschedule은 duplicate request storm을 만들지 않는다.'],
      ['rate bound', 'rate/bandwidth/DoS 제한은 악성 announce를 bounded work로 줄인다.'],
      ['drop cleanup', 'peer drop이나 underpriced tx는 상태기 cleanup을 남긴다.'],
    ],
    tests: [
      ['T0 announce', '새 tx announce를 받는다.', 'waiting 등록'],
      ['T1 request-deliver', 'request 후 tx를 deliver한다.', 'delivered cleanup'],
      ['T2 missing', 'missing response를 준다.', 'reschedule 또는 drop'],
      ['T3 timeout', 'request timeout을 발생시킨다.', 'bounded retry'],
      ['T4 rate limit', '대량 announce를 보낸다.', 'limit 적용'],
    ],
    next: ['txpool admission reason matrix', 'peer reputation feedback loop'],
  },
  {
    slug: 'geth-fm-018-snap-sync-peer-matrix',
    number: '018',
    title: 'Snap sync가 손상된 peer 응답을 격리하는 부분',
    source: 'eth/protocols/snap/sync_test.go, eth/protocols/snap/*_test.go',
    boundary: 'snap sync가 storage 없음/있음, capped/corrupt/non-proving/misbehaving peer, range sorting을 처리하는 sync 경계.',
    excludes: 'general downloader full sync와 trie proof generator 내부는 분리한다.',
    command: "go test ./eth/protocols/snap -run 'TestSync|TestMultiSync|TestRequestSorting|TestHashRanges|TestSyncProgressCompatibility' -count=1",
    invariants: [
      ['peer isolation', 'corrupt/misbehaving peer 응답은 정상 peer progress를 오염시키지 않는다.'],
      ['range determinism', 'request sorting과 hash range 계산은 같은 trie root에서 결정적이다.'],
      ['proof requirement', 'non-proving peer는 proof가 필요한 경계에서 거부된다.'],
      ['progress compatibility', 'sync progress reporting은 기존 client 관찰 shape를 유지한다.'],
    ],
    tests: [
      ['T0 account sync', 'account range를 sync한다.', 'root 일치'],
      ['T1 storage sync', 'storage가 있는 account를 sync한다.', 'storage proof 일치'],
      ['T2 capped peer', 'capped response peer를 둔다.', 'bounded progress'],
      ['T3 corrupt peer', 'corrupt code/account를 보낸다.', 'peer reject'],
      ['T4 range sorting', 'unsorted request를 만든다.', 'canonical ordering'],
    ],
    next: ['trie proof/sync cut', 'pathdb generation corruption cut'],
  },
  {
    slug: 'geth-fm-019-trie-proof-sync',
    number: '019',
    title: 'Trie proof와 iterator가 state root를 보존하는 부분',
    source: 'trie, trie/bintrie, trie/sync_test.go, trie/proof_test.go',
    boundary: 'trie insert/hash, proof, iterator, sync, stacktrie, binary trie가 root와 traversal 계약을 유지하는 자료구조 경계.',
    excludes: 'pathdb history/index/prune와 raw database freezer는 별도 절단이다.',
    command: "go test ./trie ./trie/bintrie -run 'Test.*Trie|Test.*Proof|Test.*Iterator|Test.*Sync|Test.*StackTrie' -count=1",
    invariants: [
      ['root determinism', '같은 key/value 집합은 같은 trie root를 만든다.'],
      ['proof soundness', 'account/storage proof는 root와 value를 함께 검증한다.'],
      ['iterator completeness', 'empty/single/many/deep iterator는 순회 누락이나 중복을 만들지 않는다.'],
      ['sync safety', 'duplicate/incomplete/moving target/pivot/abort는 bounded failure로 끝난다.'],
    ],
    tests: [
      ['T0 insert hash', '여러 key/value를 insert한다.', 'expected root'],
      ['T1 proof', 'account/storage proof를 생성/검증한다.', 'proof valid'],
      ['T2 iterator', 'deep trie를 순회한다.', 'ordered complete traversal'],
      ['T3 sync duplicate', 'duplicate node response를 준다.', 'idempotent handling'],
      ['T4 stacktrie fuzz case', '과거 crash fixture를 넣는다.', 'no panic'],
    ],
    next: ['pathdb history/index/prune', 'preimage DB persistence'],
  },
  {
    slug: 'geth-fm-020-pathdb-history',
    number: '020',
    title: 'PathDB history와 prune이 읽기 가능한 상태를 지키는 부분',
    source: 'triedb, triedb/pathdb, triedb/preimages_test.go',
    boundary: 'pathdb generation, iterator, history encode/decode, history index, prune, preimage 저장이 state root와 readability를 보존하는 DB 경계.',
    excludes: 'trie proof 알고리즘 자체와 freezer append/truncate는 다른 절단으로 둔다.',
    command: "go test ./triedb ./triedb/pathdb -run 'TestGenerate|Test.*Iterator|Test.*History|Test.*Prune|Test.*Preimage' -count=1",
    invariants: [
      ['generation root', 'empty/accounts/storage trie generation은 expected root를 만든다.'],
      ['corruption detection', 'root mismatch나 snapshot/state mismatch는 감지되어야 한다.'],
      ['history readability', 'history encode/decode, writer/reader, delete/corruption 처리가 일관된다.'],
      ['prune safety', 'basic/complete/noop/pause-resume prune 후 필요한 state가 읽힌다.'],
    ],
    tests: [
      ['T0 generate', 'accounts/storage trie를 generate한다.', 'root 일치'],
      ['T1 root mismatch', '잘못된 root를 기대값으로 둔다.', 'mismatch detected'],
      ['T2 iterator stale', '삭제 후 stale iterator를 사용한다.', 'defined failure'],
      ['T3 history corruption', 'history payload를 손상한다.', 'corruption detected'],
      ['T4 prune resume', 'prune을 pause/resume한다.', 'readability preserved'],
    ],
    next: ['pathdb 40+ 세부 축 분해', 'preimage retention policy'],
  },
  {
    slug: 'geth-fm-021-encoding-common',
    number: '021',
    title: '공통 인코딩 라이브러리가 입력 모서리 값을 처리하는 부분',
    source: 'rlp, common, common/hexutil, common/bitutil, common/lru, common/mclock',
    boundary: 'RLP, hexutil, address/hash formatting, bit compression, LRU, mclock이 공통 라이브러리 계약을 유지하는 경계.',
    excludes: 'header RLP allocation 최적화와 crypto primitive 수학은 별도 절단이다.',
    command: "go test ./rlp ./common ./common/hexutil ./common/bitutil ./common/lru ./common/mclock -run 'Test.*' -count=1",
    invariants: [
      ['encoding roundtrip', 'RLP, hexutil, address/hash JSON/SQL encoding은 roundtrip 의미를 보존한다.'],
      ['edge formatting', 'padding/fromHex/trim/checksum edge case가 spec shape를 따른다.'],
      ['bit compression', 'sparse/dense compression decode는 원본 bitset을 복원한다.'],
      ['utility bounds', 'LRU capacity와 mclock timer reset/stop은 resource leak 없이 동작한다.'],
    ],
    tests: [
      ['T0 RLP tail', 'tail/raw/iterator RLP case를 decode한다.', 'expected value/error'],
      ['T1 hexutil edge', 'bytes/big/uint edge JSON을 marshal한다.', 'shape 일치'],
      ['T2 checksum address', 'EIP-55 address를 parse한다.', 'checksum behavior'],
      ['T3 bit compress', 'sparse/dense bitset을 compress/decode한다.', 'roundtrip'],
      ['T4 LRU/mclock', 'cache overflow와 timer stop/reset을 실행한다.', 'bounded behavior'],
    ],
    next: ['common fuzz target coverage', 'rlp generator aliasing cut'],
  },
  {
    slug: 'geth-fm-022-crypto-fuzzers',
    number: '022',
    title: '암호 primitive와 fuzz seed가 crash 없이 처리되는 부분',
    source: 'crypto, crypto/keccak, tests/fuzzers/secp256k1, tests/fuzzers/bn256, tests/fuzzers/bls12381',
    boundary: 'secp256k1, bn256, bls12-381, keccak fixture/fuzzer가 primitive API의 crash-free와 test vector 계약을 유지하는 경계.',
    excludes: '암호학적 안전성 증명과 외부 audit은 이 절단의 범위 밖이다.',
    command: "go test ./crypto ./tests/fuzzers/secp256k1 ./tests/fuzzers/bn256 ./tests/fuzzers/bls12381 -run 'Test.*' -count=1",
    invariants: [
      ['signature edge cases', 'sign/recover/verify는 invalid key/signature edge를 구분한다.'],
      ['curve operation bounds', 'bn256/bls add/mul/pair/map/subgroup 입력은 panic 대신 bounded result를 낸다.'],
      ['keccak vectors', 'keccak output은 testdata와 일치한다.'],
      ['fuzz crash-free', 'fuzz seed corpus는 crash, OOM, unbounded loop 없이 처리된다.'],
    ],
    tests: [
      ['T0 signature', 'valid/invalid secp256k1 signature를 검증한다.', 'recover/verify 결과 분리'],
      ['T1 bn256 fuzz seed', 'bn256 add/mul/pair seed를 실행한다.', 'no crash'],
      ['T2 bls subgroup', 'BLS subgroup/map seed를 실행한다.', 'bounded result'],
      ['T3 keccak vector', 'keccak testdata를 hash한다.', 'expected digest'],
      ['T4 malformed input', '짧거나 oversized input을 넣는다.', 'bounded error'],
    ],
    next: ['long-running fuzz budget profile', 'KZG proof oracle boundary와 연결'],
  },
  {
    slug: 'geth-fm-023-spec-fixture-replay',
    number: '023',
    title: 'Execution spec fixture를 재생해 consensus 결과를 확인하는 부분',
    source: 'tests, tests/block_test.go, tests/state_test.go, tests/transaction_test.go, tests/rlp_test.go',
    boundary: 'Ethereum execution-spec block/state/transaction/RLP/difficulty fixtures가 geth wrapper를 통해 같은 consensus 결과를 내는 경계.',
    excludes: '개별 opcode 원인 분석과 t8n CLI JSON 출력은 다른 절단으로 둔다.',
    command: "go test ./tests -run 'TestExecutionSpec|TestState|TestTransaction|TestRLP|TestDifficulty' -count=1",
    invariants: [
      ['fixture fidelity', 'upstream fixture 입력은 geth wrapper에서 같은 pass/fail 결과를 만든다.'],
      ['fork split', 'fork별 expected state root, receipts, logs bloom이 섞이지 않는다.'],
      ['transaction validity', 'transaction fixture는 signature/type/fork rule failure를 구분한다.'],
      ['rlp compatibility', 'RLP fixtures는 library 단위 테스트와 같은 error semantics를 갖는다.'],
    ],
    tests: [
      ['T0 blocktests', 'execution-spec block fixture를 실행한다.', 'expected chain result'],
      ['T1 statetests', 'state fixture를 실행한다.', 'post-state root 일치'],
      ['T2 transaction', 'tx fixture를 decode/validate한다.', 'expected valid/invalid'],
      ['T3 difficulty', 'difficulty fixture와 fuzzer seed를 실행한다.', 'expected difficulty'],
      ['T4 RLP fixture', 'RLP fixture를 replay한다.', 'expected value/error'],
    ],
    next: ['fixture corpus shard strategy', 'fork별 failed fixture triage ledger'],
  },
  {
    slug: 'geth-fm-024-t8n-fixtures',
    number: '024',
    title: 'EVM t8n fixture 출력이 fork별 JSON 형태를 지키는 부분',
    source: 'cmd/evm/internal/t8ntool, cmd/evm/testdata',
    boundary: 't8n CLI가 cmd/evm/testdata fixture와 Amsterdam/BAL 같은 fork 출력 필드 shape를 보존하는 전환 도구 경계.',
    excludes: 'EVM opcode 의미 자체는 013, execution-spec corpus는 023 절단으로 둔다.',
    command: "go test ./cmd/evm/internal/t8ntool -run 'Test.*T8n|Test.*Execution|Test.*JSON' -count=1",
    invariants: [
      ['golden output', 'cmd/evm/testdata fixture output은 expected JSON과 일치한다.'],
      ['fork fields', 'Amsterdam/BAL/slotNum 같은 새 필드는 fork별 expected shape로 출력된다.'],
      ['error shape', '잘못된 input fixture는 CLI error와 JSON output 경계를 유지한다.'],
      ['deterministic files', '같은 input fixture는 같은 files/stdout/stderr 결과를 만든다.'],
    ],
    tests: [
      ['T0 fixture replay', '대표 t8n fixture를 실행한다.', 'golden output 일치'],
      ['T1 Amsterdam field', 'Amsterdam/BAL fixture를 실행한다.', 'new field 포함'],
      ['T2 slotNum JSON', 'slotNum 출력 fixture를 실행한다.', 'EELS shape 일치'],
      ['T3 invalid input', '잘못된 alloc/env/txs input을 준다.', 'bounded CLI error'],
      ['T4 deterministic rerun', '같은 fixture를 두 번 실행한다.', 'output identical'],
    ],
    next: ['190개 t8n fixture shard 승격', 'EELS compatibility diff report'],
  },
  {
    slug: 'geth-fm-025-abigen-bindings',
    number: '025',
    title: 'ABI binding 생성기가 Solidity ABI를 Go 코드로 바꾸는 부분',
    source: 'accounts/abi/bind, accounts/abi/bind/v2, cmd/abigen',
    boundary: 'ABI parser와 abigen binding generator가 Solidity ABI method/event/error/topic을 Go binding API로 안정적으로 변환하는 경계.',
    excludes: 'keystore signing, SIWE parser, runtime RPC client semantics는 다른 절단으로 둔다.',
    command: "go test ./accounts/abi ./accounts/abi/bind ./accounts/abi/bind/v2 ./cmd/abigen -run 'Test.*' -count=1",
    invariants: [
      ['signature stability', 'method/event/error signature와 selector/topic 계산이 Solidity ABI와 일치한다.'],
      ['type mapping', 'tuple/array/string/deep nested 타입은 Go binding 타입으로 안정적으로 매핑된다.'],
      ['generation repeatability', '같은 ABI 입력은 같은 binding output 구조를 만든다.'],
      ['malicious ABI bound', '악의적 ABI 입력은 OOM 없이 bounded error로 끝난다.'],
    ],
    tests: [
      ['T0 method signature', 'method ABI를 parse한다.', 'selector 일치'],
      ['T1 event topic', 'event/error ABI를 parse한다.', 'topic/signature 일치'],
      ['T2 nested tuple', 'deep nested tuple binding을 생성한다.', 'Go type 일치'],
      ['T3 converted tests', 'v1/v2 converted binding tests를 실행한다.', 'compile/test pass'],
      ['T4 malicious input', 'OOM 회귀 ABI를 넣는다.', 'bounded error'],
    ],
    next: ['Solidity ABI spec 조항별 링크', 'generated binding golden diff'],
  },
  {
    slug: 'geth-fm-026-metrics-tracing',
    number: '026',
    title: 'Metrics와 tracing이 기존 동작을 바꾸지 않고 관찰값을 남기는 부분',
    source: 'metrics, rpc/tracing_test.go, core/tracing, eth/catalyst tracing paths',
    boundary: 'metrics registry, tracing span/error, journal hook이 관찰 가능성을 추가하면서 기존 API와 state semantics를 바꾸지 않는 경계.',
    excludes: '각 기능의 핵심 consensus 의미는 해당 기능 절단에서 검증한다.',
    command: "go test ./metrics ./rpc ./core/tracing ./eth/catalyst -run 'Test.*Metric|Test.*Tracing|TestJournal|TestGetBlobs' -count=1",
    invariants: [
      ['observability transparency', 'metric/span 추가는 API response, error, state transition 결과를 바꾸지 않는다.'],
      ['hook ordering', 'journal hook과 nested revert hook 순서는 state 변경 순서와 일치한다.'],
      ['error attribution', 'RPC/batch/subscription tracing은 success/error를 같은 span shape로 기록한다.'],
      ['registry bounds', 'metrics registry는 duplicate/register/update edge를 bounded behavior로 처리한다.'],
    ],
    tests: [
      ['T0 journal hook', 'state 변경과 revert를 실행한다.', 'hook order 일치'],
      ['T1 RPC tracing', 'HTTP/batch/subscription RPC를 호출한다.', 'span/error 기록'],
      ['T2 GetBlobs tracing', 'GetBlobs tracing 경로를 호출한다.', 'API shape 유지'],
      ['T3 metric register', 'metric register/update를 수행한다.', 'registry state 일치'],
      ['T4 duplicate metric', '중복 등록을 시도한다.', 'defined error/no-op'],
    ],
    next: ['per-package metric inventory', 'OpenTelemetry export boundary'],
  },
];

const cutBySlug = new Map(cuts.map((cut) => [cut.slug, cut]));

const stages = [
  ['0. 대상 절단', '한 기능 경계의 입력, 출력, 외부 의존성을 먼저 고정한다.'],
  ['1. 관찰 경계', '테스트가 볼 수 있는 값과 error, event, JSON shape, metric을 정한다.'],
  ['2. 추상 모델', '코드의 구조체와 상태를 최소 field 집합으로 줄인다.'],
  ['3. 전제 조건', '상위 caller나 fixture가 이미 보장하는 조건을 분리한다.'],
  ['4. 불변조건', 'accepted 또는 rejected 결과가 유지해야 하는 성질을 독립 문장으로 쓴다.'],
  ['5. 반례 생성', '한 fixture는 한 조건만 깨도록 만든다.'],
  ['6. 회귀 고정', '대표 go test 명령과 PR 근거, 코드 위치를 함께 남긴다.'],
];

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join(':')} className="border-b last:border-0">
              {row.map((cell, index) => (
                <td key={`${row[0]}:${cell}`} className={`px-4 py-3 align-top ${index === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GethFmCut() {
  const { item } = useParams();
  const sidebar = useCodeSidebar();
  const cut = cutBySlug.get(item ?? '') ?? cuts[0]!;
  const currentIndex = cuts.findIndex((entry) => entry.slug === cut.slug);
  const previous = currentIndex > 0 ? cuts[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < cuts.length - 1 ? cuts[currentIndex + 1] : null;
  const codeSources = cut.source.split(',').map((source) => describeSource(source, cut));
  const codeRefs = Object.fromEntries(
    codeSources.map((source, index) => [codeKeyForSource(cut, index), sourceToCodeRef(source)]),
  );
  const fileTree = sourcesToFileTree(cut, codeSources);

  return (
    <>
      <section id="overview" className="mb-14 scroll-mt-20">
        <p className="mb-3 text-sm text-muted-foreground">go-ethereum 코드베이스에서 확인할 기능 경계</p>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{cut.title}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{cut.boundary}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-semibold text-muted-foreground">관련 코드 위치</p>
            <p className="mt-2 text-sm leading-relaxed">{cut.source}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs font-semibold text-muted-foreground">이번 화면에서 다루지 않는 것</p>
            <p className="mt-2 text-sm leading-relaxed">{cut.excludes}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border bg-muted/25 p-4">
          <p className="text-xs font-semibold text-muted-foreground">대표 실행 명령</p>
          <code className="mt-2 block break-words rounded bg-background px-3 py-2 text-xs text-muted-foreground">
            {cut.command}
          </code>
        </div>
      </section>

      <section id="sources" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">코드 소스 보기와 한글 주석</h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          아래 항목은 실제 코드에서 어느 패키지와 파일을 열어야 하는지, 그리고 그 코드에서 무엇을 확인해야 하는지를 한글 주석처럼 풀어쓴 설명입니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {codeSources.map((source) => (
            <article key={source.path} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="break-words font-mono text-xs text-muted-foreground">{source.path}</p>
                  <h3 className="mt-2 text-sm font-semibold">{source.role}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const index = codeSources.findIndex((entry) => entry.path === source.path);
                    const key = codeKeyForSource(cut, index);
                    sidebar.open(key, codeRefs[key]);
                  }}
                  className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent"
                >
                  소스 보기
                </button>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {source.notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="procedure" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">검증 절차</h2>
        <Table headers={['단계', '판단 기준']} rows={stages} />
      </section>

      <section id="invariants" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">불변조건</h2>
        <Table headers={['속성', '정식 문장']} rows={cut.invariants} />
      </section>

      <section id="tests" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">테스트 매트릭스</h2>
        <Table headers={['케이스', 'fixture 조작', '기대 결과']} rows={cut.tests} />
      </section>

      <section id="next" className="mb-14 scroll-mt-20">
        <h2 className="mb-4 text-xl font-semibold">다음 절단 후보</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {cut.next.map((entry) => (
            <div key={entry} className="rounded-lg border p-4 text-sm leading-relaxed text-muted-foreground">
              {entry}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={coreItemPath('verification-practice', 'geth-test-units')} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            개요로 돌아가기
          </Link>
          {previous && (
            <Link to={coreItemPath('verification-practice', previous.slug)} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
              이전 절차
            </Link>
          )}
          {next && (
            <Link to={coreItemPath('verification-practice', next.slug)} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
              다음 절차
            </Link>
          )}
        </div>
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'go-ethereum': fileTree }}
        projectMetas={{
          'go-ethereum': { id: 'go-ethereum', label: 'go-ethereum · Go', badgeClass: 'bg-sky-50 border-sky-400 text-sky-800' },
        }}
      />
    </>
  );
}
