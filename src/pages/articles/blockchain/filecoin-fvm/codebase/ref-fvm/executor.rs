// ref-fvm fvm@v4.8.4 · fvm/src/executor/default.rs
// 실제 source에서 message-level 경계를 보여 주는 부분만 순서대로 발췌했습니다.

fn execute_message(
    &mut self,
    msg: Message,
    apply_kind: ApplyKind,
    raw_length: usize,
) -> anyhow::Result<ApplyRet> {
    // Actor code를 실행하기 전에 message를 검사하고 gas를 확보합니다.
    let (sender_id, gas_cost, inclusion_cost) =
        match self.preflight_message(&msg, apply_kind, raw_length)? {
            Ok(res) => res,
            Err(apply_ret) => return Ok(apply_ret),
        };

    // ... receiver lookup, engine acquire, CallManager 생성과 inclusion gas charge ...

    let result = cm.with_transaction(|cm| {
        cm.call_actor::<K>(
            sender_id,
            msg.to,
            Entrypoint::Invoke(msg.method_num),
            params,
            &msg.value,
            None,
            false,
        )
    });

    // ... CallManager finish와 execution error mapping ...

    let receipt = Receipt {
        exit_code,
        return_data,
        gas_used,
        events_root,
    };

    match apply_kind {
        ApplyKind::Explicit => self.finish_message(
            sender_id,
            msg,
            receipt,
            failure_info,
            gas_cost,
            exec_trace,
            events,
            return_codec,
        ),
        ApplyKind::Implicit => Ok(ApplyRet {
            msg_receipt: receipt,
            penalty: TokenAmount::zero(),
            miner_tip: TokenAmount::zero(),
            base_fee_burn: TokenAmount::zero(),
            over_estimation_burn: TokenAmount::zero(),
            refund: TokenAmount::zero(),
            gas_refund: 0,
            gas_burned: 0,
            failure_info,
            exec_trace,
            events,
            return_codec,
        }),
    }
}

fn preflight_message(
    &mut self,
    msg: &Message,
    apply_kind: ApplyKind,
    raw_length: usize,
) -> Result<StdResult<(ActorID, TokenAmount, GasCharge), ApplyRet>> {
    // ... sender type, sequence와 balance 검사 ...
    sender_state.sequence += 1;

    let gas_cost = &msg.gas_fee_cap * msg.gas_limit;
    sender_state.deduct_funds(&gas_cost)?;
    self.state_tree_mut().set_actor(sender_id, sender_state);

    Ok(Ok((sender_id, gas_cost, inclusion_cost)))
}

fn finish_message(/* ... */) -> anyhow::Result<ApplyRet> {
    // ... receipt.gas_used에서 burn·penalty·tip·refund 계산 ...
    transfer_to_actor(BURNT_FUNDS_ACTOR_ID, &base_fee_burn)?;
    transfer_to_actor(REWARD_ACTOR_ID, &miner_tip)?;
    transfer_to_actor(BURNT_FUNDS_ACTOR_ID, &over_estimation_burn)?;
    transfer_to_actor(sender_id, &refund)?;

    Ok(ApplyRet {
        msg_receipt: receipt,
        penalty: miner_penalty,
        miner_tip,
        base_fee_burn,
        over_estimation_burn,
        refund,
        gas_refund,
        gas_burned,
        failure_info,
        exec_trace,
        events,
        return_codec,
    })
}
