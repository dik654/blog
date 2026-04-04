import type { FlowNode } from './FlowDiagram';

/* ── engine-0: JWT HTTP auth ──────────────────────────────────── */
/* ── engine-tree-0: on_new_payload ────────────────────────────── */
export const engineFlowData: Record<string, FlowNode[]> = {
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
};
