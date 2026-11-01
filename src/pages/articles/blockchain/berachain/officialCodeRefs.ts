import type { CodeRef } from "@/components/code/types";

export const officialBerachainCodeRefs: Record<string, CodeRef> = {
  "beaconkit-payload": {
    path: "beacon-kit/beacon/validator/block_builder.go",
    lang: "go",
    highlight: [1, 28],
    desc: "BuildBlockAndSidecars — CometBFT가 고른 제안자가 Engine API payload와 예상 withdrawal을 받아 BeaconKit block을 조립합니다.",
    code: `// Get the payload for the block.
envelope, err := s.retrieveExecutionPayload(ctx, st, parentBlockRoot, slotData)
if err != nil {
    return nil, nil, fmt.Errorf("failed retrieving execution payload: %w", err)
}

// Expected payloadWithdrawals to include in this payload.
payloadWithdrawals, _, err := st.ExpectedWithdrawals(nextPayloadTimestamp)
if err != nil {
    return nil, err
}

r := &builder.RequestPayloadData{
    Slot:               slot,
    Timestamp:          nextPayloadTimestamp,
    PayloadWithdrawals: payloadWithdrawals,
    PrevRandao:         prevRandao,
    ParentBlockRoot:    parentBlockRoot,
    FCState: engineprimitives.ForkchoiceStateV1{
        HeadBlockHash:      lph.GetBlockHash(),
        SafeBlockHash:      lph.GetParentHash(),
        FinalizedBlockHash: lph.GetParentHash(),
    },
}`,
    annotations: [
      { lines: [1, 5], color: "sky", note: "BeaconKit이 Bera-Reth에서 execution payload를 가져옵니다." },
      { lines: [8, 12], color: "amber", note: "Payload에 들어갈 withdrawal 목록은 consensus state에서 계산합니다." },
      { lines: [14, 24], color: "emerald", note: "Timestamp·withdrawals·forkchoice state를 묶어 Engine API payload 요청을 만듭니다." },
    ],
  },
  "beaconkit-inflation": {
    path: "beacon-kit/state-transition/core/state/statedb.go",
    lang: "go",
    highlight: [1, 23],
    desc: "ExpectedWithdrawals와 EVMInflationWithdrawal — 매 block 첫 withdrawal을 EVM inflation으로 고정합니다.",
    code: `func (s *StateDB) ExpectedWithdrawals(
    timestamp math.U64,
) (engineprimitives.Withdrawals, uint64, error) {
    maxWithdrawals := s.cs.MaxWithdrawalsPerPayload()
    withdrawals := make([]*engineprimitives.Withdrawal, 0, maxWithdrawals)

    // The first withdrawal is fixed to be the EVM inflation withdrawal.
    withdrawals = append(withdrawals, s.EVMInflationWithdrawal(timestamp))
    // ... validator withdrawals follow.
    return withdrawals, processedPartialWithdrawals, nil
}

func (s *StateDB) EVMInflationWithdrawal(
    timestamp math.U64,
) *engineprimitives.Withdrawal {
    return engineprimitives.NewWithdrawal(
        EVMInflationWithdrawalIndex,
        EVMInflationWithdrawalValidatorIndex,
        s.cs.EVMInflationAddress(timestamp),
        s.cs.EVMInflationPerBlock(timestamp),
    )
}`,
    annotations: [
      { lines: [4, 8], color: "amber", note: "첫 withdrawal은 사용자 출금이 아니라 프로토콜이 정한 EVM inflation입니다." },
      { lines: [13, 22], color: "emerald", note: "주소와 양은 timestamp에 맞는 chain spec에서 가져옵니다." },
    ],
  },
  "reth-pol-transaction": {
    path: "bera-reth/src/transaction/pol.rs",
    lang: "rust",
    highlight: [1, 36],
    desc: "create_pol_transaction — 현재 block의 첫 transaction에서 이전 block 제안자 pubkey를 Distributor.distributeFor에 넣습니다.",
    code: `pub fn create_pol_transaction(
    chain_spec: Arc<BerachainChainSpec>,
    prev_proposer_pubkey: BlsPublicKey,
    block_number: U256,
    base_fee: u64,
) -> Result<BerachainTxEnvelope, BlockExecutionError> {
    sol! {
        interface PoLDistributor {
            function distributeFor(bytes calldata pubkey) external;
        }
    }
    let distribute_call = PoLDistributor::distributeForCall {
        pubkey: Bytes::from(prev_proposer_pubkey),
    };
    let calldata = distribute_call.abi_encode();

    let nonce_u256 = block_number - U256::from(1);
    let nonce = nonce_u256.try_into().map_err(|_| {
        BlockExecutionError::Internal(InternalBlockExecutionError::Other(
            format!("block number overflow: {block_number}").into(),
        ))
    })?;

    let pol_tx = PoLTx {
        chain_id: chain_spec.chain_id(),
        from: SYSTEM_ADDRESS,
        to: chain_spec.pol_contract(),
        input: Bytes::from(calldata),
        nonce,
        gas_limit: POL_TX_GAS_LIMIT,
        gas_price: base_fee.into(),
    };

    Ok(BerachainTxEnvelope::Berachain(Sealed::new(pol_tx)))
}`,
    annotations: [
      { lines: [1, 15], color: "sky", note: "인자는 현재 제안자가 아니라 이전 block 제안자의 BLS pubkey입니다." },
      { lines: [17, 22], color: "amber", note: "Nonce는 current block number - 1로 결정됩니다." },
      { lines: [24, 34], color: "emerald", note: "SYSTEM_ADDRESS에서 PoL Distributor로 향하는 protocol transaction을 만듭니다." },
    ],
  },
  "reth-pol-first": {
    path: "bera-reth/src/node/evm/executor.rs",
    lang: "rust",
    highlight: [1, 39],
    desc: "execute_pol_transaction_with_receipt — PoL system call을 사용자 transaction보다 먼저 실행하고 receipt와 state를 index 0에 기록합니다.",
    code: `let pol_envelope = create_pol_transaction(
    self.spec.clone(),
    prev_proposer_pubkey,
    self.evm.block().number(),
    base_fee,
)?;

let (caller_address, calldata, pol_distributor_address) =
    if let BerachainTxEnvelope::Berachain(pol_tx) = &pol_envelope {
        (pol_tx.from, pol_tx.input.clone(), pol_tx.to)
    } else {
        return Err(BerachainExecutionError::InvalidPolTransactionType.into());
    };

match self.evm.transact_system_call(
    caller_address,
    pol_distributor_address,
    calldata.clone(),
) {
    Ok(result_and_state) => {
        let receipt = self.receipt_builder.build_receipt(ReceiptBuilderCtx {
            tx_type: BerachainTxType::Berachain,
            evm: &self.evm,
            result: result_and_state.result,
            state: &result_and_state.state,
            cumulative_gas_used: self.gas_used,
        });
        self.receipts.push(receipt);

        self.system_caller.on_state(
            StateChangeSource::Transaction(0),
            &result_and_state.state,
        );
        self.evm.db_mut().commit(result_and_state.state);
        Ok(())
    }
    Err(e) => Err(BlockExecutionError::other(e)),
}`,
    annotations: [
      { lines: [1, 12], color: "sky", note: "이전 제안자 pubkey로 protocol transaction을 결정적으로 재구성합니다." },
      { lines: [14, 18], color: "amber", note: "일반 서명 transaction이 아니라 system call로 실행합니다." },
      { lines: [20, 27], color: "emerald", note: "성공·실패 결과를 별도 PoL receipt로 만듭니다." },
      { lines: [29, 35], color: "violet", note: "PoL state는 transaction index 0의 변화로 commit됩니다." },
    ],
  },
  "distributor-route": {
    path: "contracts/src/pol/rewards/Distributor.sol",
    lang: "solidity",
    highlight: [1, 37],
    desc: "Distributor._distributeFor — block reward를 계산하고 DES와 BeraChef allocation 순서로 Reward Vault에 전달합니다.",
    code: `function distributeFor(bytes calldata pubkey) external onlySystemCall {
    _distributeFor(pubkey, uint64(block.timestamp));
}

function _distributeFor(bytes calldata pubkey, uint64 nextTimestamp) internal {
    uint256 rewardRate = blockRewardController.processRewards(
        pubkey, nextTimestamp, beraChef.isReady()
    );

    if (rewardRate != 0) {
        if (address(dedicatedEmissionStreamManager) != address(0)) {
            uint256 emissionPerc = dedicatedEmissionStreamManager.emissionPerc();
            IRewardAllocation.Weight[] memory rewardAllocation =
                dedicatedEmissionStreamManager.getRewardAllocation();

            if (emissionPerc > 0 && rewardAllocation.length > 0) {
                uint256 graAmount = FixedPointMathLib.fullMulDiv(
                    rewardRate, emissionPerc, ONE_HUNDRED_PERCENT
                );
                uint256 excessEmission = _distributeRewards(
                    graAmount, rewardAllocation, pubkey, nextTimestamp, true
                );
                rewardRate -= graAmount - excessEmission;
            }
        }

        beraChef.activateReadyQueuedRewardAllocation(pubkey);
        IRewardAllocation.RewardAllocation memory ra =
            beraChef.getActiveRewardAllocation(pubkey);
        _distributeRewards(rewardRate, ra.weights, pubkey, nextTimestamp, false);
    }

    blockRewardController.burnExceedingBalance();
}`,
    annotations: [
      { lines: [1, 3], color: "rose", note: "onlySystemCall이 외부 사용자의 임의 배분 호출을 막습니다." },
      { lines: [5, 8], color: "sky", note: "BeraChef가 준비되지 않았으면 vault rewardRate는 0이 될 수 있습니다." },
      { lines: [10, 24], color: "violet", note: "선택적 DES 몫을 먼저 떼고 초과분은 다시 일반 allocation으로 돌립니다." },
      { lines: [26, 30], color: "emerald", note: "준비된 allocation을 활성화한 뒤 현재 weight로 vault에 배분합니다." },
    ],
  },
  "reward-controller": {
    path: "contracts/src/pol/rewards/BlockRewardController.sol",
    lang: "solidity",
    highlight: [1, 29],
    desc: "BlockRewardController.processRewards — validator operator의 base reward와 Reward Vault 경로의 reward rate를 분리해 WBERA로 전달합니다.",
    code: `uint256 internal constant _BASE_RATE = 0.4e18;
uint256 internal constant _REWARD_RATE = 1.305e18;

function processRewards(
    bytes calldata pubkey, uint64 nextTimestamp, bool isReady
) external onlyDistributor returns (uint256) {
    uint256 reward = isReady ? _REWARD_RATE : 0;
    emit BlockRewardProcessed(pubkey, nextTimestamp, _BASE_RATE, reward);

    address operator = beaconDepositContract.getOperator(pubkey);
    if (_BASE_RATE != 0) _handleMinting(operator, _BASE_RATE);
    if (reward != 0) _handleMinting(distributor, reward);

    return reward;
}

function _handleMinting(address receiver, uint256 amount) internal {
    if (address(this).balance < amount) {
        bgt.mint(address(this), amount);
        bgt.redeem(address(this), amount);
    }
    wbera.deposit{ value: amount }();
    wbera.transfer(receiver, amount);
}`,
    annotations: [
      { lines: [1, 2], color: "amber", note: "이 source snapshot의 고정 상수는 base 0.4, vault path 1.305 WBERA입니다." },
      { lines: [7, 13], color: "emerald", note: "Operator base와 vault allocation 몫은 받는 주소와 조건이 다릅니다." },
      { lines: [17, 24], color: "violet", note: "Consensus inflation 잔액이 부족한 과도기에는 BGT mint·redeem fallback 뒤 WBERA로 감쌉니다." },
    ],
  },
  "berachef-allocation": {
    path: "contracts/src/pol/rewards/BeraChef.sol",
    lang: "solidity",
    highlight: [1, 31],
    desc: "BeraChef allocation — 지연을 통과한 validator별 weight를 활성화하고 유효하지 않으면 baseline 또는 default allocation으로 되돌립니다.",
    code: `function activateReadyQueuedRewardAllocation(
    bytes calldata valPubkey
) external onlyDistributor {
    if (!isQueuedRewardAllocationReady(valPubkey, block.number)) return;
    RewardAllocation storage qra = queuedRewardAllocations[valPubkey];
    uint64 startBlock = uint64(block.number);
    qra.startBlock = startBlock;
    activeRewardAllocations[valPubkey] = qra;
    emit ActivateRewardAllocation(valPubkey, startBlock, qra.weights);
    delete queuedRewardAllocations[valPubkey];
}

function getActiveRewardAllocation(
    bytes calldata valPubkey
) external view returns (RewardAllocation memory) {
    RewardAllocation memory ara = activeRewardAllocations[valPubkey];

    if (ara.startBlock == 0 || _checkInactivity(valPubkey, ara.startBlock)) {
        ara = rewardAllocatorFactory.getBaselineAllocation();
    }

    if (ara.startBlock > 0 && _checkIfStillValid(ara.weights)) {
        return ara;
    }

    return defaultRewardAllocation;
}`,
    annotations: [
      { lines: [1, 11], color: "sky", note: "Queued allocation은 delay 조건을 만족한 block에서 Distributor가 활성화합니다." },
      { lines: [13, 20], color: "amber", note: "설정이 없거나 validator가 inactive면 baseline allocation을 읽습니다." },
      { lines: [22, 27], color: "emerald", note: "현재 whitelist와 weight 검증을 통과해야 validator별 allocation을 사용합니다." },
      { lines: [29, 29], color: "rose", note: "검증에 실패하면 default allocation이 최종 fallback입니다." },
    ],
  },
  "vault-accounting": {
    path: "contracts/src/base/StakingRewards.sol",
    lang: "solidity",
    highlight: [1, 40],
    desc: "Reward Vault accounting — notify된 WBERA를 즉시 사용자 잔액에 더하지 않고 rewardRate·rewardPerToken으로 시간에 따라 적립합니다.",
    code: `function _notifyRewardAmount(uint256 reward)
    internal virtual updateReward(address(0)) {
    reward = reward * PRECISION;

    if (totalSupply != 0 && block.timestamp < periodFinish) {
        reward += _computeLeftOverReward();
    }

    undistributedRewards += reward;
    _checkRewardSolvency();

    if (totalSupply != 0) {
        _setRewardRate();
    }
}

function rewardPerToken() public view virtual returns (uint256) {
    uint256 _totalSupply = totalSupply;
    if (_totalSupply == 0) return rewardPerTokenStored;
    uint256 timeDelta = lastTimeRewardApplicable() - lastUpdateTime;
    uint256 _newRewardPerToken = FixedPointMathLib.fullMulDiv(
        rewardRate, timeDelta, _totalSupply
    );
    return rewardPerTokenStored + _newRewardPerToken;
}

function earned(address account) public view virtual returns (uint256) {
    Info storage info = _accountInfo[account];
    uint256 rewardPerTokenDelta = rewardPerToken() - info.rewardsPerTokenPaid;
    return info.unclaimedReward + FixedPointMathLib.fullMulDiv(
        info.balance, rewardPerTokenDelta, PRECISION
    );
}`,
    annotations: [
      { lines: [1, 14], color: "sky", note: "새 reward와 남은 reward를 합쳐 지급 속도를 다시 정합니다." },
      { lines: [16, 25], color: "amber", note: "경과 시간과 전체 stake로 rewardPerToken 증가분을 계산합니다." },
      { lines: [27, 33], color: "emerald", note: "사용자 balance는 아직 반영하지 않은 rewardPerToken 차이만큼 적립됩니다." },
    ],
  },
  "vault-migration": {
    path: "contracts/src/pol/rewards/RewardVault.sol",
    lang: "solidity",
    highlight: [1, 31],
    desc: "RewardVault reward-token migration — 기존 BGT allowance를 BERA로 redeem한 뒤 WBERA로 감싸 현재 보상 토큰과 합칩니다.",
    code: `function _migrateRewardToken() internal {
    if (address(bgt) == address(0) && address(_rewardToken) != WBERA_ADDRESS) {
        bgt = _rewardToken;
        _rewardToken = IERC20(WBERA_ADDRESS);
        emit RewardTokenMigrated(address(bgt), WBERA_ADDRESS);
    }
}

function _safeTransferRewardToken(address to, uint256 amount) internal override {
    uint256 bgtAllowance = _getBgtToken().allowance(distributor, address(this));
    if (bgtAllowance >= amount) {
        _redeemBGTAndTransferWBERA(to, amount);
    } else if (bgtAllowance > 0) {
        uint256 wberaAmount = amount - bgtAllowance;
        _redeemBGTAndTransferWBERA(to, bgtAllowance);
        _rewardToken.safeTransferFrom(distributor, to, wberaAmount);
    } else {
        _rewardToken.safeTransferFrom(distributor, to, amount);
    }
}

function _redeemBGTAndTransferWBERA(address to, uint256 amount) internal {
    IERC20 bgt_ = _getBgtToken();
    bgt_.safeTransferFrom(distributor, address(this), amount);
    IBGT(address(bgt_)).redeem(address(this), amount);
    IWBERA(payable(address(_rewardToken))).deposit{ value: amount }();
    _rewardToken.safeTransfer(to, amount);
}`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "Vault의 현재 reward token 표면을 WBERA로 전환합니다." },
      { lines: [9, 19], color: "amber", note: "잔여 BGT allowance와 새 WBERA allowance를 한 claim에서 함께 처리할 수 있습니다." },
      { lines: [21, 28], color: "emerald", note: "잔여 BGT는 BERA로 redeem한 뒤 WBERA로 감싸 사용자에게 보냅니다." },
    ],
  },
};
