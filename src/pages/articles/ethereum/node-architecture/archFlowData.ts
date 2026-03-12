import type { FlowNode } from './FlowDiagram';

export const flowData: Record<string, FlowNode[]> = {

  /* ── validator-0: poll_beacon_proposers ───────────────────────── */
  'validator-0': [
    {
      id: 'v0-1', fn: 'poll_beacon_proposers()', desc: '매 epoch 시작 시 타이머로 호출 — 현재 슬롯과 epoch 계산',
      color: 'sky', codeRefKey: 'validator-0',
      detail: '슬롯 클락이 epoch 경계를 감지하면 호출됩니다. 현재 epoch를 계산하고 타이밍을 기록합니다.',
      children: [
        {
          id: 'v0-1-1', fn: 'first_success(beacon_nodes)', desc: '비콘 노드 폴백 조회 — 첫 번째 성공 응답 사용',
          color: 'emerald', codeRefKey: 'validator-0',
          detail: '복수의 비콘 노드(Beacon Node)를 순회하며 첫 번째 성공 응답을 반환합니다. 주 노드 장애 시 자동으로 폴백합니다.',
          children: [
            {
              id: 'v0-1-1-1', fn: 'GET /eth/v1/validator/duties/proposer/{epoch}',
              desc: '비콘 노드 REST API — epoch 전체의 제안자 목록을 한 번에 수신',
              color: 'sky',
              detail: '응답에는 { validator_index, pubkey, slot } 객체 목록이 담깁니다. epoch당 최대 32 슬롯이므로 최대 32개 항목입니다.',
            },
          ],
        },
        {
          id: 'v0-1-2', fn: 'filter(|d| local_pubkeys.contains(d.pubkey))',
          desc: '내가 관리하는 pubkey만 필터링 — 타 검증자 정보 제거',
          color: 'amber', codeRefKey: 'validator-0',
          detail: '수백 명의 검증자를 운영하는 풀(pool)에서는 응답 전체를 처리하지 않고, 내 pubkey 집합과 교집합만 남깁니다.',
          children: [
            {
              id: 'v0-1-2-1', fn: 'proposers.insert(slot, pubkey)',
              desc: '슬롯 → pubkey 맵에 캐싱 — 해당 슬롯이 오면 즉시 참조',
              color: 'amber', codeRefKey: 'validator-0',
            },
            {
              id: 'v0-1-2-2', fn: 'beacon_proposer_notifier.send(slot)',
              desc: 'BlockService에 알림 전송 — 슬롯 준비 완료',
              color: 'violet', codeRefKey: 'validator-0',
              detail: 'tokio mpsc 채널로 BlockService에 슬롯 번호를 전달합니다. BlockService는 알림을 받으면 블록 생성 타이머를 설정합니다.',
            },
          ],
        },
      ],
    },
  ],

  /* ── validator-3: sign_block ──────────────────────────────────── */
  'validator-3': [
    {
      id: 'v3-1', fn: 'ValidatorStore::sign_block(slot, block)', desc: '슬래싱 보호를 포함한 블록 서명 트레이트 진입점',
      color: 'sky', codeRefKey: 'validator-3',
      detail: 'BlockService가 블록을 조립하면 이 메서드를 호출합니다. 서명 전에 반드시 슬래싱 보호 DB를 거쳐야 합니다.',
      children: [
        {
          id: 'v3-1-1', fn: 'slashing_protection.check_and_insert_block()',
          desc: '슬래싱 보호 DB 조회 — 동일 슬롯 이전 서명 이력 확인',
          color: 'rose', codeRefKey: 'validator-3',
          detail: '로컬 SQLite DB에서 이 검증자가 이 슬롯에 이미 서명했는지 확인합니다. 충돌이 없으면 이번 서명 이력을 삽입합니다. 원자적(atomic) 연산입니다.',
          children: [
            {
              id: 'v3-1-1-1', fn: 'doppelganger_check(pubkey)',
              desc: '이중 실행 탐지 — 동일 키가 다른 노드에서 실행 중인지 확인',
              color: 'amber', codeRefKey: 'validator-3',
              detail: '다른 노드에서 같은 키가 실행 중이면 어테스테이션 주변 슬롯에서 이상 패턴이 감지됩니다. Lighthouse는 시작 후 몇 epoch 동안 서명을 보류하고 이를 확인합니다.',
            },
          ],
        },
        {
          id: 'v3-1-2', fn: 'keystore.sign(signing_root)',
          desc: 'BLS12-381 서명 실행 — 블록 루트에 대한 개인키 서명',
          color: 'violet', codeRefKey: 'validator-3',
          detail: 'signing_root은 블록 내용의 해시입니다. BLS12-381 곡선 위에서 개인키로 서명하면 48바이트 서명이 생성됩니다. 이 서명은 어떤 공개키로도 검증 가능합니다.',
          children: [
            {
              id: 'v3-1-2-1', fn: 'SecretKey::sign(signing_root)',
              desc: '실제 BLS 서명 계산 — 48바이트 Signature 반환',
              color: 'emerald', codeRefKey: 'validator-3',
              detail: 'BLS12-381의 핵심 특성: 여러 서명자의 서명을 Signature.aggregate()로 하나로 합칠 수 있습니다. 비콘 체인이 수천 개의 어테스테이션을 1개의 집계 서명으로 처리하는 원리입니다.',
            },
          ],
        },
      ],
    },
  ],

  /* ── beacon-0: process_gossip_block ──────────────────────────── */
  'beacon-0': [
    {
      id: 'b0-1', fn: 'process_gossip_block(peer_id, block)', desc: 'gossip으로 수신한 블록 처리 진입점 — 빠른 필터 적용',
      color: 'sky', codeRefKey: 'beacon-0',
      detail: 'libp2p gossipsub에서 beacon_block 토픽 메시지를 수신하면 호출됩니다.',
      children: [
        {
          id: 'b0-1-1', fn: 'block.slot <= finalized_slot → 무시',
          desc: 'finalized 이하 슬롯 — 이미 확정된 블록이므로 즉시 드롭',
          color: 'slate',
          detail: 'finalized 체크포인트 아래는 더 이상 재처리가 불가능합니다. 이 블록들을 처리하면 CPU 낭비이고 fork choice에 영향도 없습니다.',
        },
        {
          id: 'b0-1-2', fn: 'duplicate_cache.check(block_root)',
          desc: '중복 블록 캐시 확인 — 이미 처리 중이거나 완료된 블록 제거',
          color: 'amber',
          detail: 'gossip 네트워크에서 같은 블록이 여러 피어에게서 동시에 올 수 있습니다. 중복 캐시는 동일 블록 루트를 두 번 처리하지 않도록 막습니다.',
        },
        {
          id: 'b0-1-3', fn: 'process_gossip_unverified_block(block)',
          desc: '두 필터를 통과한 블록만 전체 검증 진행',
          color: 'emerald', codeRefKey: 'beacon-1',
          detail: '이 단계부터는 CPU 집약적인 BLS 검증·상태 전이가 시작됩니다.',
          children: [
            {
              id: 'b0-1-3-1', fn: 'GossipVerifiedBlock::new(block)',
              desc: '1차 gossip 검증 — 제안자 서명·슬롯 범위·포크 버전 확인',
              color: 'sky', codeRefKey: 'beacon-0',
              detail: 'gossip 레이어 규칙(EIP-2124 libp2p 스펙): 올바른 fork_digest, 슬롯이 현재 ±2 슬롯 이내, 제안자 서명 유효성을 빠르게 확인합니다.',
            },
            {
              id: 'b0-1-3-2', fn: 'beacon_chain.process_block(verified_block)',
              desc: '전체 블록 처리 — BLS 배치 검증 + 상태 전이 + EL 실행',
              color: 'violet',
              codeRefKey: 'beacon-1',
              detail: '↗ 소스 클릭: BLS 배치 검증 → EL engine_newPayloadV3 → HotColdDB 저장 → fork choice 갱신 전체 흐름을 코드로 확인할 수 있습니다.',
            },
          ],
        },
      ],
    },
  ],

  /* ── beacon-1: process_block ──────────────────────────────────── */
  'beacon-1': [
    {
      id: 'b1-1', fn: 'process_block(block, seen_timestamp)', desc: '검증된 블록의 전체 처리 파이프라인',
      color: 'sky', codeRefKey: 'beacon-1',
      detail: '이 함수는 gossip 블록과 RPC(sync) 블록 모두 처리합니다. 타이밍 측정부터 fork choice 갱신까지 전 과정을 조율합니다.',
      children: [
        {
          id: 'b1-1-1', fn: 'BLS 배치 검증 (BatchVerifier)',
          desc: '블록 내 모든 어테스테이션 + 제안자 서명을 하나의 배치로 검증',
          color: 'emerald', codeRefKey: 'beacon-1',
          detail: '개별 BLS 검증은 O(n)이지만 배치 검증은 pairing 연산을 공유해 훨씬 빠릅니다. 수백 개의 어테스테이션이 있어도 약 3~5ms 내에 완료됩니다.',
        },
        {
          id: 'b1-1-2', fn: 'into_execution_pending_block()',
          desc: '상태 전이 준비 — randao, 예치금, 슬래싱, 어테스테이션 처리',
          color: 'amber', codeRefKey: 'beacon-1',
          children: [
            {
              id: 'b1-1-2-1', fn: 'per_block_processing(state, block)',
              desc: 'beacon state 전이 — RANDAO mix, 예치금, 슬래싱, exit 처리',
              color: 'amber', codeRefKey: 'beacon-1',
              detail: '이더리움 컨센서스 스펙의 process_block() 함수를 Rust로 구현한 것입니다. EIP별 포크 로직도 여기서 처리됩니다.',
            },
            {
              id: 'b1-1-2-2', fn: 'publish_fn(block)',
              desc: 'gossip 재전파 — 유효한 블록을 네트워크에 배포',
              color: 'slate', codeRefKey: 'beacon-1',
              detail: '완전한 검증 전에 조기 재전파(early re-broadcast)를 할 수도 있습니다. 재전파 시점은 구현 전략에 따라 다릅니다.',
            },
          ],
        },
        {
          id: 'b1-1-3', fn: 'into_executed_block()',
          desc: 'EL에 EVM 실행 위임 — engine_newPayloadV3 호출',
          color: 'violet', codeRefKey: 'engine-0',
          children: [
            {
              id: 'b1-1-3-1', fn: 'engine_newPayloadV3(payload, versioned_hashes)',
              desc: 'Reth에 실행 페이로드 전달 — EVM 실행 + stateRoot 검증',
              color: 'rose',
              codeRefKey: 'engine-tree-0',
              detail: '↗ 소스 클릭: Reth의 on_new_payload 구현을 확인할 수 있습니다. EVM 실행 → SparseStateTrie 해싱 → PersistenceService 비동기 저장 흐름이 있습니다.',
            },
          ],
        },
        {
          id: 'b1-1-4', fn: 'HotColdDB.put_block(block, state)',
          desc: '검증 완료 블록을 Hot DB에 저장',
          color: 'sky', codeRefKey: 'hotcold-0',
          detail: '새 블록은 항상 Hot DB(최근 64 epoch)에 저장됩니다. finalize 이후 split을 넘으면 migrate_to_cold()가 Cold DB로 이동합니다.',
        },
        {
          id: 'b1-1-5', fn: 'fork_choice.on_block(block_root, state)',
          desc: 'LMD-GHOST fork choice 트리에 블록 추가 — 가중치 갱신',
          color: 'emerald', codeRefKey: 'beacon-1',
          detail: 'LMD-GHOST(Latest Message Driven Greedy Heaviest Observed SubTree): 각 검증자의 최신 어테스테이션 메시지를 기반으로 가장 무거운 체인을 선택합니다.',
        },
      ],
    },
  ],

  /* ── engine-0: JWT HTTP auth ──────────────────────────────────── */
  'engine-0': [
    {
      id: 'e0-1', fn: 'http_post(method, params)', desc: 'CL → EL Engine API JSON-RPC 요청 전송',
      color: 'sky', codeRefKey: 'engine-0',
      detail: 'Lighthouse의 Engine API 클라이언트가 모든 engine_* 메서드에 이 함수를 사용합니다.',
      children: [
        {
          id: 'e0-1-1', fn: 'build_request(url, body)',
          desc: 'HTTP POST 요청 빌더 — URL, timeout, Content-Type: application/json',
          color: 'slate', codeRefKey: 'engine-0',
          detail: '기본 timeout은 8초입니다. engine_newPayload 같은 느린 요청은 별도 timeout이 설정될 수 있습니다.',
        },
        {
          id: 'e0-1-2', fn: 'auth.generate_token()',
          desc: 'JWT HS256 토큰 생성 — 공유 비밀키로 서명, iat 클레임 포함',
          color: 'violet', codeRefKey: 'engine-0',
          detail: 'iat(issued at) 클레임에 현재 Unix 타임스탬프를 설정합니다. EL은 ±60초 이내인 토큰만 수락합니다. 매 요청마다 새 토큰을 생성합니다.',
          children: [
            {
              id: 'e0-1-2-1', fn: 'JwtSecret::generate_token(claims)',
              desc: '32바이트 공유 비밀키 + HMAC-SHA256으로 JWT 서명',
              color: 'violet', codeRefKey: 'engine-0',
              detail: 'jwt-secret.hex 파일에서 읽은 32바이트 키를 사용합니다. CL과 EL이 동일한 파일을 공유합니다.',
            },
          ],
        },
        {
          id: 'e0-1-3', fn: 'request.bearer_auth(token)',
          desc: 'Authorization: Bearer <jwt> 헤더 첨부',
          color: 'amber', codeRefKey: 'engine-0',
        },
        {
          id: 'e0-1-4', fn: 'client.execute(request)',
          desc: '요청 전송 → HTTP 상태 확인 → JSON-RPC 응답 파싱',
          color: 'emerald', codeRefKey: 'engine-0',
          detail: 'HTTP 200이 아니면 즉시 오류 반환. JSON-RPC error 필드가 있으면 EngineError로 변환합니다.',
        },
      ],
    },
  ],

  /* ── engine-tree-0: on_new_payload ────────────────────────────── */
  'engine-tree-0': [
    {
      id: 'et0-1', fn: 'on_new_payload(payload, sidecar)', desc: 'CL로부터 실행 페이로드 수신 — EVM 실행 파이프라인 시작',
      color: 'sky', codeRefKey: 'engine-tree-0',
      detail: 'Engine API engine_newPayloadV3 핸들러입니다. CL이 새 블록을 gossip으로 받으면 바로 이 메서드를 호출합니다.',
      children: [
        {
          id: 'et0-1-1', fn: 'validate_payload_layout(payload)',
          desc: '구조 검증 — 가스 한도, 버전드 해시, extraData 길이 등',
          color: 'slate', codeRefKey: 'engine-tree-0',
          detail: 'EVM 실행 전에 빠르게 걸러낼 수 있는 형식 오류를 먼저 처리합니다. EIP-4844 blob versioned hashes 수도 여기서 확인합니다.',
        },
        {
          id: 'et0-1-2', fn: 'check_invalid_ancestors(block_hash)',
          desc: '잘못된 조상 블록 캐시 조회 — INVALID 전파',
          color: 'rose', codeRefKey: 'engine-tree-0',
          detail: '부모 블록이 INVALID였다면 자식도 INVALID입니다. 캐시에서 빠르게 확인하고 INVALID를 즉시 반환합니다.',
        },
        {
          id: 'et0-1-3', fn: 'insert_block(block) 또는 buffer_block(block)',
          desc: 'backfill 상태에 따라 즉시 삽입 또는 버퍼링',
          color: 'emerald', codeRefKey: 'storage-0',
          detail: '동기화 중(backfill)이면 블록을 버퍼에 쌓습니다. 헤드 추적 중이면 즉시 처리합니다.',
          children: [
            {
              id: 'et0-1-3-1', fn: 'EVM::transact(block)',
              desc: '트랜잭션 순서대로 EVM 실행 — 상태 변화 추적',
              color: 'amber', codeRefKey: 'rpc-2',
              detail: 'revm 크레이트를 사용합니다. 각 트랜잭션의 SSTORE, SLOAD, CREATE, CALL을 실행하며 상태 변화를 수집합니다. eth_call도 동일한 EVM::transact를 사용합니다.',
            },
            {
              id: 'et0-1-3-2', fn: 'SparseStateTrie::hash(state_changes)',
              desc: '변경된 노드만 선택적 해싱 — stateRoot 계산',
              color: 'violet', codeRefKey: 'engine-tree-0',
              detail: '전체 상태 트리(수GB)를 재해싱하지 않고 변경된 계정·스토리지 노드만 해싱합니다. 블록당 수백 ms → 수십 ms로 단축됩니다.',
            },
            {
              id: 'et0-1-3-3', fn: 'PersistenceService.save_async(block)',
              desc: 'MDBX 디스크 저장을 비동기 태스크로 위임 — 응답 블로킹 없음',
              color: 'slate', codeRefKey: 'storage-0',
              detail: '인메모리 트리에 블록을 추가하고 즉시 VALID를 반환합니다. 실제 MDBX 기록은 백그라운드 스레드에서 처리됩니다.',
            },
          ],
        },
        {
          id: 'et0-1-4', fn: 'register_canonical(block_hash)',
          desc: '헤드 싱크 타깃이면 canonical 체인에 등록',
          color: 'amber', codeRefKey: 'engine-tree-0',
        },
      ],
    },
  ],

  /* ── devp2p-0: EthMessage dispatch ───────────────────────────── */
  'devp2p-0': [
    {
      id: 'd0-1', fn: 'handle_incoming_message(peer_id, msg)', desc: 'DevP2P 세션에서 수신한 EthMessage 라우팅',
      color: 'sky', codeRefKey: 'devp2p-0',
      detail: 'TCP 스트림에서 RLP 디코드된 메시지가 들어옵니다. match 문으로 메시지 타입을 분기합니다.',
      children: [
        {
          id: 'd0-1-1', fn: 'EthMessage::Status(_) → BadMessage',
          desc: '핸드셰이크 완료 후 Status 재수신 — 프로토콜 위반으로 즉시 거부',
          color: 'rose', codeRefKey: 'devp2p-0',
          detail: 'Status 메시지는 연결 직후 1번만 교환합니다. ActiveSession에서 다시 오면 상대방이 프로토콜을 잘못 구현한 것이므로 EthHandshakeError::StatusNotInHandshake를 반환합니다.',
        },
        {
          id: 'd0-1-2', fn: 'NewBlockHashes / NewBlock → handle_block_broadcast()',
          desc: '블록 브로드캐스트 — 피어가 새 블록 공지 또는 전송',
          color: 'sky', codeRefKey: 'engine-tree-0',
          detail: 'NewBlockHashes: 블록 해시만 먼저 공지 (경량). NewBlock: 전체 블록 포함 (무거움). eth/68 이후로는 주로 해시만 공지하고 요청 시 블록을 전송합니다.',
          children: [
            {
              id: 'd0-1-2-1', fn: 'peer_manager.handle_new_block(peer, block)',
              desc: '블록 유효성 예비 확인 + fork choice 후보에 추가',
              color: 'emerald', codeRefKey: 'engine-tree-0',
            },
          ],
        },
        {
          id: 'd0-1-3', fn: 'NewPooledTransactionHashes → on_new_pooled_tx_hashes()',
          desc: 'tx 해시만 수신 — 없는 tx만 GetPooledTransactions로 요청',
          color: 'amber',
          codeRefKey: 'txpool-0',
          detail: '↗ 소스 클릭: on_new_pooled_transaction_hashes 구현을 확인할 수 있습니다. 동기화 상태 확인 → 중복 필터 → 피어 평판 감점 흐름이 있습니다.',
        },
        {
          id: 'd0-1-4', fn: 'GetBlockHeaders → BlockHeaders',
          desc: '요청/응답 쌍 — 헤더 범위 조회 (동기화에 사용)',
          color: 'violet', codeRefKey: 'storage-0',
          children: [
            {
              id: 'd0-1-4-1', fn: 'database.get_headers(start, limit)',
              desc: 'MDBX에서 블록 헤더 범위 조회',
              color: 'slate', codeRefKey: 'storage-0',
            },
          ],
        },
        {
          id: 'd0-1-5', fn: 'GetBlockBodies → BlockBodies',
          desc: '요청/응답 쌍 — 트랜잭션 바디 조회',
          color: 'emerald', codeRefKey: 'storage-0',
        },
      ],
    },
  ],

  /* ── txpool-0: on_new_pooled_transaction_hashes ───────────────── */
  'txpool-0': [
    {
      id: 'tp0-1', fn: 'on_new_pooled_transaction_hashes(peer, hashes)',
      desc: '피어로부터 tx 해시 목록 수신 — 중복 필터 후 실제 tx 요청',
      color: 'sky', codeRefKey: 'txpool-0',
      detail: 'eth/68 프로토콜의 핵심 최적화: 전체 tx 대신 해시(32바이트)만 먼저 받습니다.',
      children: [
        {
          id: 'tp0-1-1', fn: 'is_initially_syncing() → return',
          desc: '초기 동기화 중이거나 tx gossip 비활성화면 즉시 반환',
          color: 'slate', codeRefKey: 'txpool-0',
          detail: '초기 동기화 중에는 tx를 처리할 여유가 없습니다. tx gossip 비활성화 옵션(--txpool.no-gossip)도 여기서 처리됩니다.',
        },
        {
          id: 'tp0-1-2', fn: 'peer_session.get(peer_id)',
          desc: '피어 세션 조회 — 없으면 무시 (이미 연결 끊김)',
          color: 'emerald', codeRefKey: 'txpool-0',
        },
        {
          id: 'tp0-1-3', fn: 'seen_transactions.check_and_update(hashes)',
          desc: '이미 받은 해시 필터링 — 새 해시만 남김',
          color: 'amber', codeRefKey: 'txpool-0',
          detail: '각 피어마다 seen_transactions 집합을 유지합니다. 이미 처리한 tx 해시를 다시 요청하지 않습니다.',
          children: [
            {
              id: 'tp0-1-3-1', fn: 'report_already_seen(peer_id, count)',
              desc: '이미 아는 해시를 보낸 피어 — 평판(reputation) 감점',
              color: 'rose', codeRefKey: 'txpool-0',
              detail: '피어가 불필요한 해시를 반복적으로 보내면 peer_manager가 해당 피어의 평판 점수를 낮춥니다. 낮은 점수의 피어는 연결이 끊깁니다.',
            },
          ],
        },
        {
          id: 'tp0-1-4', fn: 'GetPooledTransactions(new_hashes)',
          desc: '풀에 없는 tx만 피어에게 전체 데이터 요청',
          color: 'violet', codeRefKey: 'txpool-1',
          detail: 'pool.contains(hash)로 txpool에 이미 있는 tx를 제외하고, 없는 것만 GetPooledTransactions 메시지로 요청합니다.',
        },
      ],
    },
  ],

  /* ── txpool-1: send_raw_transaction ──────────────────────────── */
  'txpool-1': [
    {
      id: 'tp1-1', fn: 'eth_sendRawTransaction(rlp_bytes)',
      desc: 'JSON-RPC 진입점 — RLP 인코딩된 서명 트랜잭션 수신',
      color: 'sky', codeRefKey: 'txpool-1',
      children: [
        {
          id: 'tp1-1-1', fn: 'WithEncoded::<Recovered<PoolPooledTx>>::decode(rlp)',
          desc: 'RLP 디코드 + ecrecover — 발신자 주소 복구',
          color: 'emerald', codeRefKey: 'txpool-1',
          detail: '서명(v, r, s)에서 secp256k1 공개키를 역산해 발신자 주소를 도출합니다(ecrecover). 잘못된 서명이면 이 단계에서 실패합니다.',
        },
        {
          id: 'tp1-1-2', fn: 'Pool::Transaction::from_pooled(recovered)',
          desc: 'txpool 형식으로 변환 — nonce·잔액·maxFee 사전 검사',
          color: 'amber', codeRefKey: 'txpool-1',
          detail: 'nonce가 현재 온체인 nonce보다 낮으면 즉시 거부. maxFeePerGas가 현재 baseFee보다 낮아도 거부합니다.',
        },
        {
          id: 'tp1-1-3', fn: 'pool.add_transaction(tx)',
          desc: '트랜잭션 풀에 제출 — 서브풀 분류',
          color: 'violet', codeRefKey: 'txpool-0',
          children: [
            {
              id: 'tp1-1-3-1', fn: '→ Pending 서브풀',
              desc: 'nonce 연속 — 다음 블록에 포함 가능한 tx',
              color: 'emerald', codeRefKey: 'txpool-1',
              detail: '발신자의 현재 온체인 nonce와 연속되는 tx입니다. 블록 빌더가 이 서브풀에서 tx를 선택합니다.',
            },
            {
              id: 'tp1-1-3-2', fn: '→ Queued 서브풀',
              desc: 'nonce 갭 있음 — 앞 nonce tx 도착 대기 중',
              color: 'amber', codeRefKey: 'txpool-1',
              detail: '예: 현재 nonce=5인데 nonce=7 tx가 먼저 도착한 경우. nonce=6 tx가 도착하면 두 tx 모두 Pending으로 이동합니다.',
            },
          ],
        },
      ],
    },
  ],

  /* ── libp2p-0: gossipsub subscribe ───────────────────────────── */
  'libp2p-0': [
    {
      id: 'lp0-1', fn: 'handle(NetworkMessage::SubscribeCoreTopics)',
      desc: '초기화 또는 포크 전환 시 core 토픽 구독 요청 처리',
      color: 'sky', codeRefKey: 'libp2p-0',
      detail: 'NetworkService의 메시지 루프에서 SubscribeCoreTopics 이벤트를 받으면 이 분기가 실행됩니다.',
      children: [
        {
          id: 'lp0-1-1', fn: 'already_subscribed() → return',
          desc: '이미 모든 토픽을 구독 중이면 즉시 반환',
          color: 'slate', codeRefKey: 'libp2p-0',
        },
        {
          id: 'lp0-1-2', fn: 'core_topics_to_subscribe(fork)',
          desc: '현재 포크(Capella/Deneb 등)에 맞는 토픽 목록 계산',
          color: 'emerald', codeRefKey: 'libp2p-0',
          detail: '포크마다 지원하는 토픽이 다릅니다. Deneb에서는 blob_sidecar_{0..5} 토픽이 추가됩니다.',
        },
        {
          id: 'lp0-1-3', fn: 'required_gossip_fork_digests()',
          desc: 'fork digest 목록 조회 — 과거/현재/미래 포크 포함 가능',
          color: 'amber', codeRefKey: 'libp2p-0',
          detail: 'fork digest = SHA256(genesis_validators_root, fork_version)[:4]. 동일 토픽이라도 포크마다 다른 digest를 가져 다른 포크 노드 메시지가 섞이지 않습니다.',
        },
        {
          id: 'lp0-1-4', fn: 'gossipsub.subscribe("/eth2/{digest}/{topic}/ssz_snappy")',
          desc: '최종 토픽 문자열 생성 + libp2p gossipsub 구독 등록',
          color: 'violet', codeRefKey: 'beacon-0',
          detail: '토픽 예시: /eth2/b5303f2a/beacon_block/ssz_snappy. ssz_snappy: SimpleSerialize + Snappy 압축 인코딩입니다. 구독 후 beacon_block 토픽 메시지는 process_gossip_block()으로 전달됩니다.',
        },
        {
          id: 'lp0-1-5', fn: 'subscribe_all_attestation_subnets() [옵션]',
          desc: '전체 어테스테이션 서브넷 구독 — 연구/테스트 목적',
          color: 'rose', codeRefKey: 'libp2p-0',
          detail: '일반 노드는 일부 서브넷만 구독합니다. subscribe_all_subnets 플래그가 켜진 경우 모든 64개 서브넷을 구독합니다.',
        },
      ],
    },
  ],

  /* ── hotcold-0: HotColdDB ────────────────────────────────────── */
  'hotcold-0': [
    {
      id: 'hc0-1', fn: 'HotColdDB (저장소 구조)', desc: '두 계층으로 나뉜 비콘 체인 저장소 개요',
      color: 'sky', codeRefKey: 'hotcold-0',
      detail: 'split 슬롯을 기준으로 Hot(최근)/Cold(확정) DB를 분리해 읽기 속도와 저장 효율을 동시에 최적화합니다.',
      children: [
        {
          id: 'hc0-1-1', fn: 'hot_db.put_block(block, state)',
          desc: 'Hot DB(LevelDB 계열) — 최근 64 epoch 블록·상태 저장',
          color: 'emerald', codeRefKey: 'hotcold-0',
          detail: '잦은 랜덤 읽기·쓰기에 최적화된 LevelDB 계열 B-Tree입니다. gossip 블록이 도착하면 즉시 여기에 저장됩니다.',
          children: [
            {
              id: 'hc0-1-1-1', fn: 'block_cache.put_block(block_root, block)',
              desc: 'LRU 인메모리 캐시 갱신 — 디스크보다 빠른 최근 블록 조회',
              color: 'amber', codeRefKey: 'hotcold-0',
              detail: '최근 N개 블록을 메모리에 캐싱합니다. fork choice 계산 시 수십 번 블록을 조회하는데, 캐시 히트율이 매우 높습니다.',
            },
          ],
        },
        {
          id: 'hc0-1-2', fn: 'cold_db.put_block(block)',
          desc: 'Cold DB(Freezer) — finalized 블록·상태를 순차 압축 파일로 저장',
          color: 'violet', codeRefKey: 'hotcold-0',
          detail: '불변(append-only) 파일로 저장합니다. zstd 압축을 적용해 디스크 사용량을 줄입니다. 읽기 전용이므로 잠금이 필요 없습니다.',
        },
        {
          id: 'hc0-1-3', fn: 'migrate_to_cold()',
          desc: 'split 슬롯 넘은 블록을 Hot → Cold로 이동',
          color: 'slate', codeRefKey: 'hotcold-0',
          detail: '백그라운드 태스크가 주기적으로 실행합니다. Hot DB 공간이 부족해지지 않도록 오래된 데이터를 Cold로 옮깁니다.',
        },
        {
          id: 'hc0-1-4', fn: 'blobs_db.put_blob_sidecar(blob)',
          desc: 'EIP-4844 blob 사이드카 전용 저장소 (Deneb 이후)',
          color: 'rose', codeRefKey: 'hotcold-0',
          detail: 'blob은 약 4096 field elements(~128KB)로 구성됩니다. 비콘 노드는 최소 4096 epoch(약 18일)간 보관하고 이후 삭제할 수 있습니다(data availability sampling 이후).',
        },
      ],
    },
  ],

  /* ── sync-0: update_sync_state ────────────────────────────────── */
  'sync-0': [
    {
      id: 's0-1', fn: 'update_sync_state()', desc: '동기화 상태 자동 결정 — 주기적으로 호출',
      color: 'sky', codeRefKey: 'sync-0',
      detail: '피어 연결 변화, 블록 수신, RangeSync 상태 변화 시마다 호출됩니다. 가장 적합한 동기화 전략을 선택합니다.',
      children: [
        {
          id: 's0-1-1', fn: 'range_sync.state()',
          desc: 'RangeSync 상태 조회 — 대량 배치 다운로드 진행 여부 확인',
          color: 'emerald', codeRefKey: 'sync-0',
          detail: 'RangeSync가 활성화되어 있으면 수십~수천 개 블록을 배치로 요청합니다. 피어들에게 GetBlocksByRange로 분산 요청합니다.',
        },
        {
          id: 's0-1-2', fn: '→ SyncingFinalized 또는 SyncingHead',
          desc: 'RangeSync 진행 중 — 대량 배치로 빠른 따라잡기',
          color: 'amber', codeRefKey: 'sync-0',
          detail: 'SyncingFinalized: finalized 체크포인트까지 따라잡는 중. SyncingHead: finalized 이후 헤드까지 따라잡는 중.',
        },
        {
          id: 's0-1-3', fn: '→ SyncTransition',
          desc: 'RangeSync 없음 + 앞선 피어 있음 — 개별 누락 블록 lookup',
          color: 'violet', codeRefKey: 'sync-0',
          detail: '소수의 누락 블록을 개별적으로 요청합니다. 거의 동기화 완료 상태입니다.',
        },
        {
          id: 's0-1-4', fn: '→ Synced + backfill 확인',
          desc: '헤드 동기화 완료 — gossip 실시간 수신 전환',
          color: 'sky', codeRefKey: 'sync-0',
          children: [
            {
              id: 's0-1-4-1', fn: 'backfill_sync.needs_backfill()',
              desc: '과거 히스토리 부족 여부 확인',
              color: 'slate', codeRefKey: 'sync-0',
            },
            {
              id: 's0-1-4-2', fn: 'backfill_sync.start()',
              desc: '역방향 다운로드 시작 — 체크포인트 동기화 이전 히스토리',
              color: 'rose', codeRefKey: 'sync-0',
              detail: '체크포인트 동기화(--checkpoint-sync-url)로 빠르게 시작한 노드는 과거 히스토리가 없습니다. Backfill은 역방향으로 오래된 블록을 채웁니다.',
            },
          ],
        },
        {
          id: 's0-1-5', fn: '→ Stalled',
          desc: '피어 없음 — 연결을 기다리는 대기 상태',
          color: 'slate', codeRefKey: 'sync-0',
          detail: '피어 발견 시 PeerDiscovery가 새 연결을 시도합니다.',
        },
      ],
    },
  ],

  /* ── storage-0: insert_block ──────────────────────────────────── */
  'storage-0': [
    {
      id: 'st0-1', fn: 'DatabaseProvider::insert_block(block)',
      desc: '블록을 MDBX에 저장하는 진입점',
      color: 'sky', codeRefKey: 'storage-0',
      detail: '동기화 도중 대량으로 호출됩니다. BlocksOnly 모드는 EVM 실행 결과(영수증·상태)를 건너뜁니다.',
      children: [
        {
          id: 'st0-1-1', fn: 'block.number()',
          desc: '블록 번호 추출 — body indices 조회에 사용',
          color: 'slate', codeRefKey: 'storage-0',
        },
        {
          id: 'st0-1-2', fn: 'ExecutedBlock::new(block, receipts=[], state=[])',
          desc: 'save_blocks가 요구하는 형식으로 래핑 (영수증·상태 비어있음)',
          color: 'emerald', codeRefKey: 'storage-0',
        },
        {
          id: 'st0-1-3', fn: 'save_blocks(BlocksOnly)',
          desc: '헤더·바디만 MDBX에 기록 — EVM 계산 건너뜀',
          color: 'amber', codeRefKey: 'storage-0',
          children: [
            {
              id: 'st0-1-3-1', fn: 'write_headers(tx, header)',
              desc: 'Headers 테이블에 블록 헤더 삽입',
              color: 'emerald', codeRefKey: 'storage-0',
              detail: 'MDBX 테이블: Headers(block_number → header), CanonicalHeaders(block_number → hash), HeaderNumbers(hash → number)',
            },
            {
              id: 'st0-1-3-2', fn: 'write_transactions(tx, body)',
              desc: 'StaticFiles에 tx 데이터 기록 + BlockBodyIndices 갱신',
              color: 'amber', codeRefKey: 'storage-0',
              detail: 'tx 실제 데이터는 MDBX 외부의 StaticFiles(순차 파일)에 저장됩니다. BlockBodyIndices(block_number → tx_range)로 조회합니다.',
            },
          ],
        },
        {
          id: 'st0-1-4', fn: 'block_body_indices(block_number)',
          desc: '저장된 tx 범위 인덱스 조회 — 성공 확인 및 반환',
          color: 'violet', codeRefKey: 'storage-0',
          detail: 'BlockBodyIndices가 없으면 BlockBodyIndicesNotFound 오류를 반환합니다.',
        },
      ],
    },
  ],

  /* ── rpc-0: RpcModuleBuilder ──────────────────────────────────── */
  'rpc-0': [
    {
      id: 'r0-1', fn: 'RpcModuleBuilder::new()', desc: 'RPC 서버 조립 빌더 패턴 시작',
      color: 'sky', codeRefKey: 'rpc-0',
      detail: 'Reth 노드 시작 시 한 번 실행됩니다. 모든 의존성을 주입하고 jsonrpsee 서버를 구성합니다.',
      children: [
        {
          id: 'r0-1-1', fn: '.with_provider(provider)',
          desc: 'DatabaseProvider 주입 — 블록·상태 조회 의존성',
          color: 'emerald', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-2', fn: '.with_pool(pool)',
          desc: 'TransactionPool 주입 — txpool 조회/제출 의존성',
          color: 'amber', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-3', fn: '.with_network(network)',
          desc: 'NetworkHandle 주입 — 피어 정보·p2p 연결 의존성',
          color: 'violet', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-4', fn: '.with_evm_config(evm_config)',
          desc: 'EvmConfig 주입 — eth_call·estimateGas EVM 설정',
          color: 'sky', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-5', fn: '.build()',
          desc: '네임스페이스별 RPC 모듈 조립 및 jsonrpsee 등록',
          color: 'rose', codeRefKey: 'rpc-2',
          children: [
            {
              id: 'r0-1-5-1', fn: 'EthApiServer::into_rpc()',
              desc: 'eth_ 네임스페이스 — getBalance, sendRawTransaction 등',
              color: 'emerald', codeRefKey: 'rpc-2',
            },
            {
              id: 'r0-1-5-2', fn: 'DebugApiServer::into_rpc()',
              desc: 'debug_ 네임스페이스 — traceTransaction, getRawBlock 등',
              color: 'amber', codeRefKey: 'rpc-0',
            },
            {
              id: 'r0-1-5-3', fn: 'module.merge(eth_module)',
              desc: '모든 네임스페이스 모듈을 하나의 RpcModule로 합산',
              color: 'slate', codeRefKey: 'rpc-0',
            },
          ],
        },
        {
          id: 'r0-1-6', fn: 'RpcServerConfig.start(module)',
          desc: 'HTTP(:8545), WebSocket(:8546), IPC 동시 서빙 시작',
          color: 'slate', codeRefKey: 'rpc-0',
          detail: 'jsonrpsee의 ServerBuilder를 사용합니다. HTTP와 WebSocket을 동일 포트에서 서빙하거나 분리할 수 있습니다.',
        },
      ],
    },
  ],

  /* ── rpc-2: EthCall / Call / EstimateCall ─────────────────────── */
  'rpc-2': [
    {
      id: 'r2-1', fn: 'eth_call(request, block_id)', desc: '상태 변경 없이 EVM 실행 결과만 반환하는 RPC',
      color: 'sky', codeRefKey: 'rpc-2',
      children: [
        {
          id: 'r2-1-1', fn: 'EthCall::call() [트레이트 기본 구현 위임]',
          desc: 'reth_rpc_eth_api의 기본 구현 사용 — 이 파일은 파라미터 바인딩만',
          color: 'emerald', codeRefKey: 'rpc-2',
          children: [
            {
              id: 'r2-1-1-1', fn: 'Call::call_with(request, block_state)',
              desc: '실제 EVM 실행 로직 — 격리된 상태에서 실행',
              color: 'amber', codeRefKey: 'rpc-2',
              children: [
                {
                  id: 'r2-1-1-1-1', fn: 'CacheDB::new(block_state)',
                  desc: '읽기: 스냅샷, 쓰기: 메모리에만 — 상태 격리',
                  color: 'violet', codeRefKey: 'rpc-2',
                  detail: 'CacheDB는 읽기는 실제 DB에서, 쓰기는 내부 HashMap에만 합니다. 함수 종료 시 HashMap이 버려져 상태 변경이 사라집니다.',
                },
                {
                  id: 'r2-1-1-1-2', fn: 'EVM::transact(tx)',
                  desc: 'EVM 실행 — 반환값·가스 사용량·로그 수집',
                  color: 'sky', codeRefKey: 'engine-tree-0',
                },
                {
                  id: 'r2-1-1-1-3', fn: '상태 변경 드롭 (CacheDB 버림)',
                  desc: '실행 결과만 반환 — 온체인 상태는 변경되지 않음',
                  color: 'slate', codeRefKey: 'rpc-2',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'r2-2', fn: 'eth_estimateGas(request, block_id)', desc: '트랜잭션 실행에 필요한 최소 가스량 이진 탐색',
      color: 'sky', codeRefKey: 'rpc-2',
      children: [
        {
          id: 'r2-2-1', fn: 'EstimateCall::estimate_gas() [트레이트 기본 구현 위임]',
          desc: '이진 탐색으로 최소 gasLimit 계산',
          color: 'emerald', codeRefKey: 'rpc-2',
          children: [
            {
              id: 'r2-2-1-1', fn: '이진 탐색 (lo=21000, hi=block_gas_limit)',
              desc: '각 mid 값으로 Call::call_with() 실행 — 성공 여부로 범위 좁힘',
              color: 'amber', codeRefKey: 'rpc-2',
              detail: '보통 15~20회 이진 탐색으로 수렴합니다. 각 단계마다 EVM을 실행하므로 복잡한 컨트랙트는 비쌀 수 있습니다.',
            },
          ],
        },
      ],
    },
  ],

};
