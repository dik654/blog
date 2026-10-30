// Prysm v7.3.1 commit 96d418cd의 실제 state ID error mapping 발췌입니다.
func writeStateIdError(w http.ResponseWriter, err error, fallbackMsg string) bool {
	if err == nil {
		return false
	}

	// State root를 찾지 못하면 404를 반환합니다.
	var stateRootNotFoundErr *lookup.StateRootNotFoundError
	if errors.As(err, &stateRootNotFoundErr) {
		httputil.HandleError(w, "State root not found: "+stateRootNotFoundErr.Error(), http.StatusNotFound)
		return true
	}

	// BeaconState object를 찾지 못해도 404를 반환합니다.
	var stateNotFoundError *lookup.StateNotFoundError
	if errors.As(err, &stateNotFoundError) {
		httputil.HandleError(w, "State not found: "+stateNotFoundError.Error(), http.StatusNotFound)
		return true
	}

	// Slot coverage가 없을 때도 같은 not-found 계약을 사용합니다.
	if errors.Is(err, stategen.ErrNoDataForSlot) {
		httputil.HandleError(w, "State not found: "+err.Error(), http.StatusNotFound)
		return true
	}

	// State ID 형식을 해석할 수 없으면 400을 반환합니다.
	var parseErr *lookup.StateIdParseError
	if errors.As(err, &parseErr) {
		httputil.HandleError(w, "Invalid state ID: "+parseErr.Error(), http.StatusBadRequest)
		return true
	}

	// 나머지 내부 오류는 호출자가 준 문구와 함께 500으로 반환합니다.
	httputil.HandleError(w, fallbackMsg+": "+err.Error(), http.StatusInternalServerError)
	return true
}
