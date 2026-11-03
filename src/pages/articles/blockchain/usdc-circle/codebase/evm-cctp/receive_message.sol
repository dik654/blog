    function receiveMessage(
        bytes calldata message,
        bytes calldata attestation
    ) external override whenNotPaused returns (bool success) {
        // Validate message
        (
            bytes32 _nonce,
            uint32 _sourceDomain,
            bytes32 _sender,
            address _recipient,
            uint32 _finalityThresholdExecuted,
            bytes memory _messageBody
        ) = _validateReceivedMessage(message, attestation);

        // Mark nonce as used
        usedNonces[_nonce] = NONCE_USED;

        // Handle receive message
        if (_finalityThresholdExecuted < FINALITY_THRESHOLD_FINALIZED) {
            require(
                IMessageHandlerV2(_recipient).handleReceiveUnfinalizedMessage(
                    _sourceDomain,
                    _sender,
                    _finalityThresholdExecuted,
                    _messageBody
                ),
                "handleReceiveUnfinalizedMessage() failed"
            );
        } else {
            require(
                IMessageHandlerV2(_recipient).handleReceiveFinalizedMessage(
                    _sourceDomain,
                    _sender,
                    _finalityThresholdExecuted,
                    _messageBody
                ),
                "handleReceiveFinalizedMessage() failed"
            );
        }

        // Emit MessageReceived event
        emit MessageReceived(
            msg.sender,
            _sourceDomain,
            _nonce,
            _sender,
            _finalityThresholdExecuted,
            _messageBody
        );

        return true;
    }
