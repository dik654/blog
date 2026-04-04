import type { CodeRef } from '@/components/code/types';

export const abciRefs: Record<string, CodeRef> = {
  'octane-abci': {
    path: 'omni/octane/evmengine/abci.go',
    lang: 'go',
    highlight: [1, 22],
    desc: 'ABCI 콜백을 Engine API 호출로 변환하는 어댑터.',
    code: `// octane/evmengine/abci.go — ABCI → Engine API 어댑터

func (k Keeper) PrepareProposal(ctx sdk.Context, req *abci.RequestPrepareProposal) (*abci.ResponsePrepareProposal, error) {
    // 1. forkchoiceUpdated → geth에 빌드 요청
    fcuResp, err := k.engineCl.ForkchoiceUpdatedV3(ctx, forkchoiceState, &payloadAttributes)
    // 2. getPayload → 빌드된 페이로드 수신
    payload, err := k.engineCl.GetPayloadV3(ctx, fcuResp.PayloadID)
    // 3. 페이로드를 CometBFT TX로 래핑
    return &abci.ResponsePrepareProposal{Txs: wrapPayload(payload)}, nil
}

func (k Keeper) ProcessProposal(ctx sdk.Context, req *abci.RequestProcessProposal) (*abci.ResponseProcessProposal, error) {
    payload := unwrapPayload(req.Txs)
    // 1. newPayload → geth가 실행 & 검증
    status, err := k.engineCl.NewPayloadV3(ctx, payload)
    // 2. forkchoiceUpdated → 새 헤드 확정
    _, err = k.engineCl.ForkchoiceUpdatedV3(ctx, forkchoiceState, nil)
    return &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_ACCEPT}, nil
}`,
    annotations: [
      { lines: [3, 10], color: 'sky', note: 'PrepareProposal → FCU + getPayload' },
      { lines: [12, 19], color: 'emerald', note: 'ProcessProposal → newPayload + FCU' },
    ],
  },

  'octane-enginecl': {
    path: 'omni/octane/evmengine/enginecl.go',
    lang: 'go',
    highlight: [1, 18],
    desc: 'Engine API 클라이언트 — geth/reth와의 JSON-RPC 통신.',
    code: `// octane/evmengine/enginecl.go — Engine API Client

type EngineClient struct {
    ethCl     ethclient.Client   // geth RPC 연결
    jwtSecret []byte             // JWT 인증 시크릿
}

func (c *EngineClient) ForkchoiceUpdatedV3(
    ctx context.Context,
    state engine.ForkchoiceStateV1,
    attrs *engine.PayloadAttributes,
) (*engine.ForkChoiceResponse, error) {
    return c.ethCl.ForkchoiceUpdatedV3(ctx, state, attrs)
}

func (c *EngineClient) NewPayloadV3(ctx context.Context, payload engine.ExecutionPayload) (engine.PayloadStatusV1, error) {
    return c.ethCl.NewPayloadV3(ctx, payload, nil, nil)
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'EngineClient — geth RPC + JWT' },
      { lines: [8, 14], color: 'emerald', note: 'ForkchoiceUpdatedV3' },
      { lines: [16, 18], color: 'amber', note: 'NewPayloadV3' },
    ],
  },
};
