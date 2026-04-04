export const windowAccessCode = `// air/src/air.rs — 핵심 트레이트

/// 현재 행(current)과 다음 행(next)에 접근하는 창(window)
pub trait WindowAccess<T> {
    fn current_slice(&self) -> &[T];
    fn next_slice(&self) -> &[T];

    fn current(&self, i: usize) -> Option<T> where T: Clone {
        self.current_slice().get(i).cloned()
    }
    fn next(&self, i: usize) -> Option<T> where T: Clone {
        self.next_slice().get(i).cloned()
    }
}

/// RowWindow: 두 행 슬라이스를 가리키는 경량 구조체
pub struct RowWindow<'a, T> {
    current: &'a [T],  // 현재 행
    next: &'a [T],     // 다음 행
}

impl<'a, T> RowWindow<'a, T> {
    /// RowMajorMatrixView (정확히 2행)에서 생성
    pub fn from_view(view: &RowMajorMatrixView<'a, T>) -> Self {
        let (current, next) = view.values.split_at(view.width);
        Self { current, next }
    }
}

/// Air 트레이트: 제약 정의의 진입점
pub trait Air<AB: AirBuilder>: BaseAir<AB::F> {
    fn eval(&self, builder: &mut AB);
    // 전처리 트레이스 (상수 컬럼, 예: 셀렉터)
    fn preprocessed_trace(&self) -> Option<RowMajorMatrix<AB::F>> { None }
    fn num_public_values(&self) -> usize { 0 }
    fn num_constraints(&self) -> Option<usize> { None }
}`;

export const keccakAirCode = `// keccak-air/src/air.rs — Keccak-256 AIR 구현 (실제 코드)

pub struct KeccakAir {}

impl<F> BaseAir<F> for KeccakAir {
    fn width(&self) -> usize { NUM_KECCAK_COLS }  // 열 개수
}

impl<AB: AirBuilder> Air<AB> for KeccakAir {
    fn eval(&self, builder: &mut AB) {
        eval_round_flags(builder);  // 라운드 단계 플래그 제약

        let main = builder.main();
        let local: &KeccakCols<AB::Var> = main.current_slice().borrow();
        let next:  &KeccakCols<AB::Var> = main.next_slice().borrow();

        let first_step = local.step_flags[0];
        let final_step = local.step_flags[NUM_ROUNDS_MIN_1];

        // 첫 행: 입력 A가 preimage와 일치해야 함
        for y in 0..5 { for x in 0..5 {
            builder.when(first_step)
                .assert_zeros::<U64_LIMBS, _>(array::from_fn(|limb| {
                    local.preimage[y][x][limb] - local.a[y][x][limb]
                }));
        }}

        // 전이 행: preimage가 다음 행과 일치해야 함
        for y in 0..5 { for x in 0..5 {
            builder.when(AB::Expr::ONE - final_step.clone())
                .when_transition()
                .assert_zeros::<U64_LIMBS, _>(array::from_fn(|limb| {
                    local.preimage[y][x][limb] - next.preimage[y][x][limb]
                }));
        }}
    }
}`;
