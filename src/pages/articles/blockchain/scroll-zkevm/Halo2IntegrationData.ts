export const CIRCUIT_TRAIT_CODE = `// Halo2 Circuit 트레이트 — 모든 회로가 구현
pub trait Circuit<F: Field> {
    type Config;          // 회로 설정 (테이블, 컬럼 등)
    type FloorPlanner;    // 레이아웃 전략
    type Params;

    fn without_witnesses(&self) -> Self;     // 더미 회로 (keygen용)
    fn configure(meta: &mut ConstraintSystem<F>) -> Self::Config;
    fn synthesize(                           // Witness 할당
        &self, config: Self::Config,
        mut layouter: impl Layouter<F>,
    ) -> Result<(), Error>;
}

// SuperCircuit의 Config = (SuperCircuitConfig<Fr>, Challenges)
// SuperCircuit의 FloorPlanner = SimpleFloorPlanner`;

export const circuitTraitAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'Config/FloorPlanner/Params 타입' },
  { lines: [7, 7] as [number, number], color: 'emerald' as const, note: 'without_witnesses — 키 생성용' },
  { lines: [8, 12] as [number, number], color: 'amber' as const, note: 'configure → synthesize 생명주기' },
];

export const SUBCIRCUIT_TRAIT_CODE = `// SubCircuit 트레이트 — 서브회로 표준 인터페이스
pub trait SubCircuit<F: Field> {
    type Config: SubCircuitConfig<F>;
    fn unusable_rows() -> usize { 256 }  // 블라인딩 행
    fn new_from_block(block: &witness::Block) -> Self;
    fn instance(&self) -> Vec<Vec<F>> { vec![] }

    fn synthesize_sub(                   // Witness 할당
        &self, config: &Self::Config,
        challenges: &Challenges<Value<F>>,
        layouter: &mut impl Layouter<F>,
    ) -> Result<(), Error>;

    fn min_num_rows_block(block: &Block) -> (usize, usize);
}

// SubCircuitConfig 트레이트
pub trait SubCircuitConfig<F: Field> {
    type ConfigArgs;
    fn new(meta: &mut ConstraintSystem<F>, args: Self::ConfigArgs) -> Self;
}`;

export const subCircuitAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'Config + 팩토리 메서드' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: 'synthesize_sub — Witness 할당' },
  { lines: [14, 14] as [number, number], color: 'amber' as const, note: 'min_num_rows — 동적 크기' },
  { lines: [17, 20] as [number, number], color: 'violet' as const, note: 'SubCircuitConfig — 설정 트레이트' },
];

export const CELLMANAGER_CODE = `// CellManager — 셀 할당 최적화
// EVM Circuit: 수평 정렬(horizontal-first) 전략
pub(crate) struct CellManager<F> {
    width: usize,                 // 컬럼의 개수
    height: usize,                // 최대 높이
    cells: Vec<Cell<F>>,          // 미리 쿼리된 모든 셀
    columns: Vec<CellColumn<F>>,  // 컬럼 메타데이터
}

// 셀 할당: 가장 높이가 낮은 컬럼을 선택
pub(crate) fn query_cell(&mut self, cell_type: CellType) -> Cell<F> {
    self.query_cells(cell_type, 1)[0].clone()
}

// 컬럼 타입 분류 (6종):
//   StoragePhase1       — Phase 1 일반 저장소
//   StoragePermutation  — Phase 1 복사 제약용
//   StoragePhase2       — Phase 2 일반 저장소
//   StoragePermutationPhase2 — Phase 2 복사 제약용
//   Lookup(table)       — 특정 테이블 룩업 전용
//   LookupByte          — 바이트 룩업 전용`;

export const cellManagerAnnotations = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: 'CellManager 구조체 — 셀 + 컬럼' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: '할당 — 최소 높이 컬럼 선택' },
  { lines: [14, 20] as [number, number], color: 'amber' as const, note: '6종 컬럼 타입 — 용도별 분류' },
];
