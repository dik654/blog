// revm — Precompile 레지스트리 & 디스패치

/// 프리컴파일 함수 시그니처
pub type StandardPrecompileFn = fn(input: &Bytes, gas_limit: u64)
    -> PrecompileResult;

/// 프리컴파일 종류 (가스 계산 방식 차이)
pub enum Precompile {
    Standard(StandardPrecompileFn),
    Env(EnvPrecompileFn),
}

/// 주소와 프리컴파일 매핑
pub struct PrecompileWithAddress(pub Address, pub Precompile);

/// 하드포크별 프리컴파일 목록 — Cancun 기준
pub fn cancun() -> &'static Precompiles {
    static INSTANCE: OnceLock<Precompiles> = OnceLock::new();
    INSTANCE.get_or_init(|| {
        let mut precompiles = shanghai().clone();
        // EIP-4844: KZG Point Evaluation (0x0a)
        precompiles.extend([
            PrecompileWithAddress(
                u64_to_address(0x0a),
                Precompile::Standard(kzg_point_evaluation::run),
            ),
        ]);
        precompiles
    })
}

/// 주소별 프리컴파일 디스패치
pub fn call(&self, address: &Address, input: &Bytes, gas: u64)
    -> Option<PrecompileResult> {
    self.inner.get(address).map(|p| match p {
        Precompile::Standard(f) => f(input, gas),
        Precompile::Env(f) => f(input, gas, &self.env),
    })
}
