export const FLEX_GATE_CODE = `// halo2-base/src/gates/flex_gate/mod.rs
pub struct BasicGateConfig<F: ScalarField> {
    pub q_enable: Selector,     // 게이트 활성화 셀렉터
    pub value: Column<Advice>,  // 게이트 값 저장
}

// Vertical Gate Strategy: 단일 제약식으로 다양한 연산 표현
// q * (a + b * c - d) = 0
//   덧셈: a + b = d  (c = 1)
//   곱셈: b * c = d  (a = 0)
//   곱셈-덧셈: a + b * c = d

fn create_gate(&self, meta: &mut ConstraintSystem<F>) {
    meta.create_gate("1 column a + b * c = out", |meta| {
        let q = meta.query_selector(self.q_enable);
        let a = meta.query_advice(self.value, Rotation::cur());
        let b = meta.query_advice(self.value, Rotation::next());
        let c = meta.query_advice(self.value, Rotation(2));
        let out = meta.query_advice(self.value, Rotation(3));
        vec![q * (a + b * c - out)]  // 제약 조건
    })
}`;

export const RANGE_GATE_CODE = `// halo2-base/src/gates/range/mod.rs
pub struct RangeConfig<F: ScalarField> {
    pub gate: FlexGateConfig<F>,      // 기본 게이트
    pub lookup_advice: Vec<Vec<Column<Advice>>>,
    pub q_lookup: Vec<Option<Selector>>,
    pub lookup: TableColumn,          // lookup 테이블
    lookup_bits: usize,               // [0, 2^lookup_bits)
}

// 범위 검사: 값을 limb로 분해 → 각 limb를 lookup
fn _range_check(&self, ctx: &mut Context<F>,
    a: AssignedValue<F>, range_bits: usize)
{
    let num_limbs = (range_bits + self.lookup_bits - 1) / self.lookup_bits;
    // 여러 limb: 값을 분해하여 각 limb를 lookup
    let limbs = decompose_fe_to_u64_limbs(a.value(), num_limbs, self.lookup_bits);
    // 내적으로 limb들을 재조합 → 원래 값과 같은지 확인
    let acc = self.gate.inner_product(ctx, limbs, self.limb_bases[..num_limbs]);
    ctx.constrain_equal(&a, &acc);
}`;
