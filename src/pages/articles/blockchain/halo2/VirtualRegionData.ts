export const MANAGER_CODE = `// halo2-base/src/gates/flex_gate/threads/single_phase.rs
pub struct SinglePhaseCoreManager<F: ScalarField> {
    pub threads: Vec<Context<F>>,        // 가상 컬럼들
    pub copy_manager: SharedCopyConstraintManager<F>,
    witness_gen_only: bool,
    use_unknown: bool,
    phase: usize,
    pub break_points: RefCell<Option<ThreadBreakPoints>>,
}

// Chunking 과정:
// 1. 모든 Context의 advice 벡터를 순차적으로 연결
// 2. usable_rows를 고려하여 break point(분할 지점) 결정
// 3. 각 chunk를 별도의 물리적 컬럼에 할당

// Break point 발생 조건:
// - Selector가 활성화되고(q == true)
// - 현재 행에서 게이트를 실행하면 max_rows를 초과하는 경우
// - 또는 현재 행이 max_rows - 1에 도달한 경우`;

export const COPY_MANAGER_CODE = `// halo2-base/src/virtual_region/copy_constraints.rs
pub struct CopyConstraintManager<F: Field + Ord> {
    // Advice 셀 간 등가 제약
    pub advice_equalities: Vec<(ContextCell, ContextCell)>,
    // 상수-Advice 셀 간 등가 제약
    pub constant_equalities: Vec<(F, ContextCell)>,
    // 가상 → 물리 셀 매핑
    pub assigned_advices: HashMap<ContextCell, Cell>,
    pub assigned_constants: BTreeMap<F, Cell>,
}

// assign_raw() 에서 모든 equality constraint를 물리 셀에 부과:
// 1. Constant 할당 → fixed 컬럼에 값 기록
// 2. Advice equality → 두 물리 셀 간 raw_constrain_equal
// 3. Constant equality → 상수 셀과 advice 셀 연결`;
