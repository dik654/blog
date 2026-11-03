    function _validateReceivedMessage(
        bytes calldata _message,
        bytes calldata _attestation
    )
        internal
        view
        returns (
            bytes32 _nonce,
            uint32 _sourceDomain,
            bytes32 _sender,
            address _recipient,
            uint32 _finalityThresholdExecuted,
            bytes memory _messageBody
        )
    {
        // Validate each signature in the attestation
        _verifyAttestationSignatures(_message, _attestation);

        bytes29 _msg = _message.ref(0);

        // Validate message format
        _msg._validateMessageFormat();

        // Validate domain
        require(
            _msg._getDestinationDomain() == localDomain,
            "Invalid destination domain"
        );

        // Validate destination caller
        if (_msg._getDestinationCaller() != bytes32(0)) {
            require(
                _msg._getDestinationCaller() == msg.sender.toBytes32(),
                "Invalid caller for message"
            );
        }

        // Validate version
        require(_msg._getVersion() == version, "Invalid message version");

        // Validate nonce is available
        _nonce = _msg._getNonce();
        require(usedNonces[_nonce] == 0, "Nonce already used");

        // Unpack remaining values
        _sourceDomain = _msg._getSourceDomain();
        _sender = _msg._getSender();
        _recipient = _msg._getRecipient().toAddress();
        _finalityThresholdExecuted = _msg._getFinalityThresholdExecuted();
        _messageBody = _msg._getMessageBody().clone();
    }
