const (
	// lookaheadSteps is a limit on how many forward steps are loaded into queue.
	// Each step is managed by assigned finite state machine. Must be >= 2.
	lookaheadSteps = 4
	// startBackSlots defines number of slots before the current head, which defines a start position
	// of the initial machine. This allows more robustness in case of normal sync sets head to some
	// orphaned block: in that case starting earlier and re-fetching blocks allows to reorganize chain.
	startBackSlots = 32
)

const (
	stateNew stateID = iota
	stateScheduled
	stateDataParsed
	stateSkipped
	stateSent
)

func (q *blocksQueue) onDataReceivedEvent(ctx context.Context) eventHandlerFn {
	return func(m *stateMachine, in any) (stateID, error) {
		if ctx.Err() != nil {
			return m.state, ctx.Err()
		}
		if m.state != stateScheduled {
			return m.state, errInvalidInitialState
		}
		response, ok := in.(*fetchRequestResponse)
		if !ok {
			return m.state, errInputNotFetchRequestParams
		}
		if response.err != nil {
			if errors.Is(response.err, beaconsync.ErrInvalidFetchedData) {
				q.downscorePeer(response.blocksFrom, "invalidBlocks")
			}
			return m.state, response.err
		}
		m.fetched = *response
		return stateDataParsed, nil
	}
}

func (q *blocksQueue) onReadyToSendEvent(ctx context.Context) eventHandlerFn {
	return func(m *stateMachine, in any) (stateID, error) {
		if ctx.Err() != nil {
			return m.state, ctx.Err()
		}
		if m.state != stateDataParsed {
			return m.state, errInvalidInitialState
		}

		if m.numFetched() == 0 {
			return stateSkipped, nil
		}

		send := func() (stateID, error) {
			select {
			case <-ctx.Done():
				return m.state, ctx.Err()
			case q.fetchedData <- m.fetched.blocksQueueFetchedData():
			}
			return stateSent, nil
		}

		if m.isFirst() {
			return send()
		}

		for _, fsm := range q.smm.machines {
			if fsm.start < m.start {
				switch fsm.state {
				case stateNew, stateScheduled, stateDataParsed:
					return m.state, nil
				}
			}
		}

		return send()
	}
}
