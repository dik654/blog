// Prysm v7.3.1 commit 96d418cd의 구조를 보존한 학습용 핵심 발췌입니다.
func (s *Server) GetStateRoot(w http.ResponseWriter, r *http.Request) {
	ctx, span := trace.StartSpan(r.Context(), "beacon.GetStateRoot")
	defer span.End()

	// URL path에서 symbolic 또는 explicit state identifier를 꺼냅니다.
	stateId := r.PathValue("state_id")
	if stateId == "" {
		httputil.HandleError(w, "state_id is required in URL params", http.StatusBadRequest)
		return
	}

	// 응답의 data.root를 만들 state root를 먼저 조회합니다.
	stateRoot, err := s.Stater.StateRoot(ctx, []byte(stateId))
	if !shared.WriteStateRootFetchError(w, err) {
		return
	}

	// Finality용 block root를 계산하려고 BeaconState를 별도로 조회합니다.
	st, err := s.Stater.State(ctx, []byte(stateId))
	if err != nil {
		shared.WriteStateFetchError(w, err)
		return
	}

	// 같은 state ID에 대한 optimistic execution 여부를 다시 확인합니다.
	isOptimistic, err := helpers.IsOptimistic(
		ctx, []byte(stateId), s.OptimisticModeFetcher,
		s.Stater, s.ChainInfoFetcher, s.BeaconDB,
	)
	if err != nil {
		helpers.HandleIsOptimisticError(w, err)
		return
	}

	// State의 latest block header로 block root를 만든 뒤 finality를 판정합니다.
	blockRoot, err := helpers.BlockRootFromState(ctx, st)
	if err != nil {
		httputil.HandleError(w, "Could not calculate block root: "+err.Error(), http.StatusInternalServerError)
		return
	}
	isFinalized := s.FinalizationFetcher.IsFinalized(ctx, blockRoot)

	// 서로 다른 의미의 세 결과를 하나의 JSON response에 담습니다.
	resp := &structs.GetStateRootResponse{
		Data:                &structs.StateRoot{Root: hexutil.Encode(stateRoot)},
		ExecutionOptimistic: isOptimistic,
		Finalized:           isFinalized,
	}
	httputil.WriteJson(w, resp)
}
