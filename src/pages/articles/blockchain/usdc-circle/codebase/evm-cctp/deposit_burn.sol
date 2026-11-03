    function _depositForBurn(
        uint256 _amount,
        uint32 _destinationDomain,
        bytes32 _mintRecipient,
        address _burnToken,
        bytes32 _destinationCaller,
        uint256 _maxFee,
        uint32 _minFinalityThreshold,
        bytes calldata _hookData
    ) internal {
        require(_amount > 0, "Amount must be nonzero");
        require(_mintRecipient != bytes32(0), "Mint recipient must be nonzero");
        require(_maxFee < _amount, "Max fee must be less than amount");

        // Verify minimum fee
        if (minFee > 0) {
            // Implicitly constrains `_amount` to be greater than 1
            // 0 < minFeeAmount <= maxFee < amount
            require(
                _maxFee >= _calcMinFeeAmount(_amount),
                "Insufficient max fee"
            );
        }

        bytes32 _destinationTokenMessenger = _getRemoteTokenMessenger(
            _destinationDomain
        );

        // Deposit and burn tokens
        _depositAndBurn(_burnToken, msg.sender, _amount);

        // Format message body
        bytes memory _burnMessage = BurnMessageV2._formatMessageForRelay(
            messageBodyVersion,
            _burnToken.toBytes32(),
            _mintRecipient,
            _amount,
            msg.sender.toBytes32(),
            _maxFee,
            _hookData
        );

        // Send message
        IRelayerV2(localMessageTransmitter).sendMessage(
            _destinationDomain,
            _destinationTokenMessenger,
            _destinationCaller,
            _minFinalityThreshold,
            _burnMessage
        );

        emit DepositForBurn(
            _burnToken,
            _amount,
            msg.sender,
            _mintRecipient,
            _destinationDomain,
            _destinationTokenMessenger,
            _destinationCaller,
            _maxFee,
            _minFinalityThreshold,
            _hookData
        );
    }
