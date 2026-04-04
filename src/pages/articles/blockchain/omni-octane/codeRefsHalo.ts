import type { CodeRef } from '@/components/code/types';

export const haloRefs: Record<string, CodeRef> = {
  'octane-xmsg': {
    path: 'omni/halo/attest/keeper.go',
    lang: 'go',
    highlight: [1, 20],
    desc: 'XMsg 크로스체인 어테스테이션 — 검증자가 롤업 이벤트를 관찰하고 합의.',
    code: `// halo/attest/keeper.go — 크로스체인 어테스테이션

type Keeper struct {
    voter   Voter              // 어테스테이션 투표 수집
    portal  PortalRegistry     // 연결된 롤업 Portal 주소
    namer   ChainNamer         // 체인 ID → 이름 매핑
}

// Add — 검증자의 어테스테이션을 합의 블록에 추가
func (k Keeper) Add(ctx context.Context, msg *MsgAddVotes) error {
    for _, vote := range msg.Votes {
        // 1. 포털에서 XBlock 해시 검증
        // 2. 어테스테이션 저장
        // 3. 2/3+ 투표 도달 시 확정
        k.voter.Add(ctx, vote)
    }
    return nil
}

// XMsg: srcChainId → destChainId → data`,
    annotations: [
      { lines: [3, 7], color: 'sky', note: 'Keeper — voter + portal + namer' },
      { lines: [10, 17], color: 'emerald', note: 'Add — 어테스테이션 수집 + 2/3 투표' },
    ],
  },

  'octane-dual-staking': {
    path: 'omni/halo/valsync/keeper.go',
    lang: 'go',
    highlight: [1, 16],
    desc: '이중 스테이킹 — OMNI + EigenLayer restaked ETH.',
    code: `// halo/valsync/keeper.go — 이중 스테이킹 동기화

type Keeper struct {
    staking  stakingKeeper     // OMNI 토큰 스테이킹
    avs      avsKeeper         // EigenLayer AVS 연동
}

// SyncValidatorSet — 두 소스의 검증자 파워 합산
func (k Keeper) SyncValidatorSet(ctx context.Context) error {
    omniPower := k.staking.GetAllValidators(ctx)
    eigenPower := k.avs.GetOperatorPowers(ctx)
    merged := mergeValidatorPowers(omniPower, eigenPower)
    return k.broadcastUpdate(ctx, merged)
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'OMNI + EigenLayer AVS 키퍼' },
      { lines: [9, 13], color: 'emerald', note: '투표 파워 합산 + Portal 동기화' },
    ],
  },
};
