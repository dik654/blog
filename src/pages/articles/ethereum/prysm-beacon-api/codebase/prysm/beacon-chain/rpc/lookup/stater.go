// Prysm v7.3.1 commit 96d418cd의 실제 source에서 head 분기만 발췌했습니다.
// genesis·checkpoint·root·slot 분기는 이 글의 요청 경로와 무관해 생략했습니다.
func (p *BeaconDbStater) State(ctx context.Context, stateId []byte) (state.BeaconState, error) {
	var (
		s   state.BeaconState
		err error
	)

	stateIdString := strings.ToLower(string(stateId))
	switch stateIdString {
	case "head":
		// "head"의 BeaconState object는 현재 chain view에서 읽습니다.
		s, err = p.ChainInfoFetcher.HeadState(ctx)
		if err != nil {
			return nil, errors.Wrap(err, "could not get head state")
		}
	// 실제 source에는 genesis·finalized·justified·root·slot 분기가 이어집니다.
	}

	return s, err
}

func (p *BeaconDbStater) StateRoot(ctx context.Context, stateId []byte) (root []byte, err error) {
	stateIdString := strings.ToLower(string(stateId))
	switch stateIdString {
	case "head":
		// 같은 "head"라도 root lookup은 별도 helper로 들어갑니다.
		root, err = p.headStateRoot(ctx)
	// 실제 source에는 genesis·finalized·justified·root·slot 분기가 이어집니다.
	}

	return root, err
}

func (p *BeaconDbStater) headStateRoot(ctx context.Context) ([]byte, error) {
	// Head block이 선언한 post-state root를 읽습니다.
	b, err := p.ChainInfoFetcher.HeadBlock(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "could not get head block")
	}
	if err = blocks.BeaconBlockIsNil(b); err != nil {
		return nil, newStateNotFoundErrorf("head block is unavailable: %s", err.Error())
	}
	stateRoot := b.Block().StateRoot()
	return stateRoot[:], nil
}
