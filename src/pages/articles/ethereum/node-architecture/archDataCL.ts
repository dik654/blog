import type { Module } from './archData';

export const clModules: Record<string, Module> = {
  validator: {
    label: 'Validator Client', layer: 'cl',
    role: '슬래싱 방지 BLS 서명 전담',
    fns: [
      { sig: 'sign_block()', desc: '슬래싱 방지 DB 확인 후 BLS 서명' },
      { sig: 'sign_attestation()', desc: '할당된 슬롯에서 어테스테이션 서명' },
      { sig: 'subscribe_to_subnet()', desc: '어테스테이션 집계용 서브넷 구독' },
    ],
    links: [
      { target: 'beacon', via: 'Beacon API (HTTP)', dir: '→',
        msgs: ['GET /validator/duties/proposer → ProposerDuties[]', 'GET /validator/attestation_data → AttestationData', 'POST /beacon/blocks ← SignedBeaconBlock'] },
    ],
  },
  beacon: {
    label: 'BeaconChain', layer: 'cl',
    role: 'LMD-GHOST fork choice + 상태 전환',
    fns: [
      { sig: 'process_block()', desc: '블록 서명·슬롯·상태 전환 검증' },
      { sig: 'fork_choice()', desc: 'LMD-GHOST + FFG로 canonical head 결정' },
      { sig: 'process_attestation()', desc: 'OperationPool에 어테스테이션 추가·집계' },
    ],
    links: [
      { target: 'validator', via: 'ValidatorAPI', dir: '←' },
      { target: 'hotcold', via: '직접 호출', dir: '↔',
        msgs: ['put_block(SignedBeaconBlock) →', 'get_state(slot) → BeaconState', 'freeze_to_cold(finalized_blocks) →'] },
      { target: 'sync', via: 'tokio channel', dir: '↔',
        msgs: ['SyncMessage::AddPeer(peer_id, sync_info)', 'SyncMessage::BlocksProcessed([blocks])', 'ProcessBlock(signed_block) →'] },
      { target: 'engine', via: 'Engine API', dir: '→' },
    ],
  },
  hotcold: {
    label: 'HotColdDB', layer: 'cl',
    role: '최근(Hot) / 확정(Cold) 비콘 상태 저장',
    fns: [
      { sig: 'put_block()', desc: '최근 블록을 Hot DB(LevelDB)에 저장' },
      { sig: 'get_state()', desc: '슬롯 번호로 비콘 상태 조회' },
      { sig: 'freeze_to_cold()', desc: '확정 블록을 Cold Freezer로 이동' },
    ],
    links: [
      { target: 'beacon', via: '직접 호출', dir: '↔' },
    ],
  },
  sync: {
    label: 'SyncManager', layer: 'cl',
    role: 'Range · Backfill · Lookup 동기화',
    fns: [
      { sig: 'add_peer()', desc: '새 피어 sync 상태 등록 및 range 계획 수립' },
      { sig: 'process_sync_message()', desc: 'Range/Backfill/Lookup 동기화 상태 전환' },
      { sig: 'range_sync_block()', desc: '피어에서 배치 블록 요청 후 BeaconChain 제출' },
    ],
    links: [
      { target: 'libp2p', via: 'tokio channel', dir: '↔',
        msgs: ['BlocksByRangeReq { start_slot, count } →', 'BlocksByRangeResp([SignedBeaconBlock]) ←', 'BlobsByRangeReq / BlobsByRangeResp'] },
      { target: 'beacon', via: 'block 제출', dir: '→' },
    ],
  },
  libp2p: {
    label: 'libp2p', layer: 'cl',
    role: 'Gossipsub 전파 + Discv5 피어 탐색',
    fns: [
      { sig: 'publish(topic, msg)', desc: 'Gossipsub 토픽으로 블록·어테스테이션 전파' },
      { sig: 'send_request(peer)', desc: 'Req/Resp 프로토콜로 블록 개별 요청' },
      { sig: 'discover_peers()', desc: 'Discv5 ENR 탐색으로 새 피어 발견' },
    ],
    links: [
      { target: 'sync', via: 'tokio channel', dir: '↔' },
    ],
  },
  engine: {
    label: 'Engine API (JWT)', layer: 'api',
    role: 'CL ↔ EL 실행 페이로드 교환 채널',
    fns: [
      { sig: 'engine_newPayloadV3(payload)', desc: 'CL→EL: 실행 페이로드 전달·검증·EVM 실행 요청' },
      { sig: 'engine_forkchoiceUpdatedV3(fcu, attrs?)', desc: 'CL→EL: canonical head 갱신, attrs 있으면 payload 빌드 시작' },
      { sig: 'engine_getPayloadV4(payload_id)', desc: 'CL←EL: 빌드 완료된 페이로드 + EIP-4844 블롭 수신' },
    ],
    links: [
      { target: 'beacon', via: 'HTTP POST', dir: '←' },
      { target: 'engine-tree', via: 'HTTP POST', dir: '→' },
    ],
    notes: [
      '양쪽 노드가 동일한 --jwt-secret 파일을 공유',
      'CL이 매 요청마다 HS256 JWT 생성 → Authorization: Bearer <token>',
      'EL은 exp 클레임 기준 ±5초 이내 토큰만 수락',
      '기본 엔드포인트: http://127.0.0.1:8551 (로컬 전용)',
    ],
  },
};
