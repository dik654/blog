    /**
     * @notice Allows a minter to burn some of its own tokens.
     * @dev The caller must be a minter, must not be blacklisted, and the amount to burn
     * should be less than or equal to the account's balance.
     * @param _amount the amount of tokens to be burned.
     */
    function burn(uint256 _amount)
        external
        virtual
        whenNotPaused
        onlyMinters
        notBlacklisted(msg.sender)
    {
        uint256 balance = _balanceOf(msg.sender);
        require(_amount > 0, "FiatToken: burn amount not greater than 0");
        require(balance >= _amount, "FiatToken: burn amount exceeds balance");

        totalSupply_ = totalSupply_.sub(_amount);
        _setBalance(msg.sender, balance.sub(_amount));
        emit Burn(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
    }
