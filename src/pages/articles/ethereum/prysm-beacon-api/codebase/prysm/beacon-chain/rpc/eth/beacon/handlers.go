// beacon-chain/rpc/eth/beacon/handlers.go — GetBlockV2 + GetStateV2 (prysm v5.x)

// GetBlockV2 returns a beacon block by block_id.
// Beacon API spec: GET /eth/v2/beacon/blocks/{block_id}
func (s *Server) GetBlockV2(w http.ResponseWriter, r *http.Request) {
	blockId := mux.Vars(r)["block_id"]
	// block_id: "head", "genesis", "finalized", slot number, or block root
	blk, err := s.Blocker.Block(r.Context(), []byte(blockId))
	if err != nil {
		httputil.HandleError(w, err.Error(), http.StatusNotFound)
		return
	}
	// 포크 버전에 따라 응답 구조 분기 (Phase0/Altair/Bellatrix/Capella/Deneb)
	version, err := blk.Version()
	if err != nil {
		httputil.HandleError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// SSZ 또는 JSON 응답 (Accept 헤더 기반)
	if httputil.RespondSSZ(r) {
		s.respondSSZ(w, blk, version)
	} else {
		s.respondJSON(w, blk, version)
	}
}

// GetStateV2 returns a beacon state by state_id.
// Beacon API spec: GET /eth/v2/debug/beacon/states/{state_id}
func (s *Server) GetStateV2(w http.ResponseWriter, r *http.Request) {
	stateId := mux.Vars(r)["state_id"]
	st, err := s.Stater.State(r.Context(), []byte(stateId))
	if err != nil {
		httputil.HandleError(w, err.Error(), http.StatusNotFound)
		return
	}
	httputil.WriteJson(w, structs.BeaconStateFromConsensus(st))
}
