    function _handleReceiveMessage(
        bytes29 _msg,
        uint32 _remoteDomain
    ) internal returns (bool) {
        // Validate message and unpack fields
        (
            address _mintRecipient,
            bytes32 _burnToken,
            uint256 _amount,
            uint256 _fee
        ) = _validatedReceivedMessage(_msg);

        // Mint tokens
        _mintAndWithdraw(
            _remoteDomain,
            _burnToken,
            _mintRecipient,
            _amount - _fee,
            _fee
        );

        return true;
    }

    /**
     * @notice Validates a BurnMessage and unpacks relevant fields.
     * @dev Reverts if the BurnMessage is malformed
     * @dev Reverts if the BurnMessage version isn't supported
     * @dev Reverts if the BurnMessage has expired
     * @dev Reverts if the fee equals or exceeds the amount
     * @dev Reverts if the fee exceeds the max fee specified on the source chain
     * @param _msg Finalized message
     * @return _mintRecipient The recipient of the mint, as bytes32
     * @return _burnToken The address of the token burned on the source chain
     * @return _amount The amount of burnToken burned
     * @return _fee The fee executed
     */
    function _validatedReceivedMessage(
        bytes29 _msg
    )
        internal
        view
        returns (
            address _mintRecipient,
            bytes32 _burnToken,
            uint256 _amount,
            uint256 _fee
        )
    {
        _msg._validateBurnMessageFormat();
        require(
            _msg._getVersion() == messageBodyVersion,
            "Invalid message body version"
        );

        // Enforce message expiration
        uint256 _expirationBlock = _msg._getExpirationBlock();
        require(
            _expirationBlock == 0 || _expirationBlock > block.number,
            "Message expired and must be re-signed"
        );

        // Validate fee
        _amount = _msg._getAmount();
        _fee = _msg._getFeeExecuted();
        require(_fee == 0 || _fee < _amount, "Fee equals or exceeds amount");
        require(_fee <= _msg._getMaxFee(), "Fee exceeds max fee");

        _mintRecipient = _msg._getMintRecipient().toAddress();
        _burnToken = _msg._getBurnToken();
    }
}
