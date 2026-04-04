import type { CodeRef } from '@/components/code/types';
import blockRaw from './codebase/prysm/beacon-chain/blockchain/process_block.go?raw';

export const blockCodeRefs: Record<string, CodeRef> = {
  'notify-new-payload': {
    path: 'blockchain/process_block.go — notifyNewPayload()',
    lang: 'go',
    code: blockRaw,
    highlight: [3, 33],
    desc: 'notifyNewPayload — 블록 처리 중 실행 페이로드를 EL에 전달',
    annotations: [
      { lines: [9, 9], color: 'sky', note: '비콘 블록에서 실행 페이로드 추출' },
      { lines: [14, 14], color: 'emerald', note: 'Deneb: blob KZG 커밋먼트 → versioned hashes' },
      { lines: [19, 22], color: 'amber', note: 'Engine API NewPayload 호출' },
      { lines: [25, 28], color: 'rose', note: 'INVALID → 포크 선택에서 해당 체인 제거' },
    ],
  },
  'engine-get-payload': {
    path: 'execution/engine_client.go — GetPayload()',
    lang: 'go',
    code: `// GetPayload retrieves a built execution payload from the EL.
// 블록 제안 시 EL이 빌드한 페이로드를 가져온다.
func (s *Service) GetPayload(
    ctx context.Context, payloadId [8]byte, slot primitives.Slot,
) (*pb.ExecutionPayloadEnvelope, error) {
    result := &pb.ExecutionPayloadEnvelope{}
    err := s.rpcClient.CallContext(ctx, result,
        GetPayloadMethodV3, payloadId,
    )
    if err != nil {
        return nil, handleRPCError(err)
    }
    // MEV-Boost 비드와 비교하여 더 높은 가치의 페이로드 선택
    return result, nil
}`,
    highlight: [1, 14],
    desc: 'GetPayload — EL이 빌드한 실행 페이로드를 가져와 블록에 포함',
    annotations: [
      { lines: [4, 4], color: 'sky', note: 'payloadId: ForkchoiceUpdated에서 받은 ID' },
      { lines: [7, 8], color: 'emerald', note: 'engine_getPayloadV3 JSON-RPC 호출' },
      { lines: [13, 13], color: 'amber', note: 'MEV-Boost 비드와 가치 비교' },
    ],
  },
};
