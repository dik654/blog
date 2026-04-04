export const C = { cl: '#6366f1', engine: '#0ea5e9', builder: '#f59e0b', ok: '#10b981' };

export const STEPS = [
  {
    label: 'ForkchoiceUpdated 수신',
    body: 'CL이 head/safe/finalized 해시와\npayload_attributes를 JSON-RPC로 전송\n→ EL의 on_forkchoice_updated() 호출',
  },
  {
    label: 'head 검증 + canonical 갱신',
    body: 'find_canonical_header(head_hash)\n→ head 블록이 유효한지 확인\nupdate_canonical_chain(head)\n→ 포크 선택 결과를 DB에 반영',
  },
  {
    label: 'payload_builder에 작업 전달',
    body: 'payload_attributes가 있으면\nsend_new_payload(head, attributes) 호출\n→ 백그라운드 빌드 태스크 시작\npayload_id를 CL에 반환',
  },
  {
    label: 'GetPayload → 완성 블록 반환',
    body: 'CL이 GetPayload(payload_id) 호출\n→ EL이 지금까지 빌드한 최적 블록 반환\nExecutionPayload + BlobsBundle + block_value',
  },
];
