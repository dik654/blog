// Source: revm-handler 43.0.3
// src/precompile_provider.rs (focused excerpts)

impl EthPrecompiles {
    /// Create a new precompile provider with the given spec.
    pub fn new(spec: SpecId) -> Self {
        Self {
            precompiles: Precompiles::new(PrecompileSpecId::from_spec_id(spec)),
            spec,
        }
    }
}

pub fn precompile_output_to_interpreter_result(
    output: PrecompileOutput,
    gas_limit: u64,
) -> InterpreterResult {
    let result = if output.gas_used > gas_limit {
        InstructionResult::PrecompileOOG
    } else {
        match &output.status {
            PrecompileStatus::Success => InstructionResult::Return,
            PrecompileStatus::Revert => InstructionResult::Revert,
            PrecompileStatus::Halt(reason) if reason.is_oog() => InstructionResult::PrecompileOOG,
            PrecompileStatus::Halt(_) => InstructionResult::PrecompileError,
        }
    };

    let mut gas = Gas::new(gas_limit);
    *gas.tracker_mut() = output.to_gas_tracker(gas_limit);

    if result.is_halt() {
        gas.spend_all();
        return InterpreterResult::new(result, Bytes::new(), gas);
    }

    InterpreterResult::new(result, output.bytes, gas)
}

fn run(
    &mut self,
    context: &mut CTX,
    inputs: &CallInputs,
) -> Result<Option<InterpreterResult>, String> {
    let Some(precompile) = self.precompiles.get(&inputs.bytecode_address) else {
        return Ok(None);
    };

    let output = precompile
        .execute(
            &inputs.input.as_bytes(context),
            inputs.gas_limit,
            inputs.reservoir,
        )
        .map_err(|e| e.to_string())?;

    let result = precompile_output_to_interpreter_result(output, inputs.gas_limit);
    Ok(Some(result))
}
