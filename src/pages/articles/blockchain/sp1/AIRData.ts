export const CHIPS = [
  { name: 'CpuChip', desc: 'RISC-V CPU 중앙 조정자. 클럭·PC 관리, 명령어 디스패치, 다른 칩 연동.' },
  { name: 'MemoryInstructionsChip', desc: '메모리 읽기/쓰기 명령어 추적. LB/LH/LW/SB/SH/SW 처리.' },
  { name: 'AddSubChip', desc: '덧셈/뺄셈 (ADD, SUB). carry 비트 처리. 32비트 오버플로우.' },
  { name: 'BitwiseChip', desc: 'XOR, OR, AND, SRL, SRA, SLL 비트 연산. 별도 AIR 칩.' },
  { name: 'MulChip', desc: '곱셈 (MUL, MULH, MULHU, MULHSU). 64비트 결과 처리.' },
  { name: 'DivRemChip', desc: '나눗셈/나머지 (DIV, DIVU, REM, REMU). 0 나누기 처리 포함.' },
  { name: 'ShaExtendChip', desc: 'SHA256 메시지 스케줄 확장 프리컴파일 (ECALL 0x00_00_30_26).' },
  { name: 'Keccak256Chip', desc: 'Keccak-f 순열 프리컴파일 (ECALL 0x00_01_01_09). 이더리움 호환.' },
];

export const ADD_CODE = `// AddSubCols 구조체 (실제 필드)
pub struct AddSubCols<T> {
    pub pc: T,              // 프로그램 카운터
    pub add_operation: AddOperation<T>, // 덧셈 결과 + carry
    pub operand_1: T,       // 첫 번째 피연산자
    pub operand_2: T,       // 두 번째 피연산자
    pub op_a_not_0: T,      // op_a ≠ 0 여부
    pub is_add: T,          // 덧셈이면 1
    pub is_sub: T,          // 뺄셈이면 1
}

// Plonky3 Air 트레이트 구현
impl<AB: SP1AirBuilder> Air<AB> for AddSubChip {
    fn eval(&self, builder: &mut AB) {
        let main = builder.main();
        let local: &AddSubCols<AB::Var> = main.row_slice(0).borrow();

        // operand_1 op operand_2 = add_operation.value
        AddOperation::<AB::F>::eval(
            builder,
            local.operand_1,
            local.operand_2,
            local.is_add,
            &local.add_operation,
        );

        // is_add + is_sub = 1 (반드시 둘 중 하나)
        builder.assert_eq(local.is_add + local.is_sub, AB::F::one());
    }
}`;

export const STARK_CODE = `// 1. Execution Trace 생성 (ExecutorMode::Trace)
//    각 사이클의 레지스터/메모리 상태를 행렬로 구성

// 2. Commit: 각 칩의 추적 행렬을 다항식으로 인코딩
//    Reed-Solomon 인코딩 → Merkle 트리 커밋 (FRI)

// 3. Prove: FRI(Fast Reed-Solomon IOP) 증명
//    랜덤 포인트에서 다항식 평가 요청
//    → AIR 제약 조건이 이 평가에서 만족됨을 증명

// 4. 세그먼트 분할 & 병렬 증명
//    실행 추적이 너무 길면 여러 세그먼트로 분할
//    각 세그먼트를 독립적으로 병렬 증명
//    → 재귀적으로 합쳐 전체 증명 생성`;

export const PLONKY3_CODE = `// Plonky3 핵심 추상화
trait Air<AB: AirBuilder> {
    fn eval(&self, builder: &mut AB);
    // builder에 제약 조건 추가
}

// SP1이 사용하는 필드: BabyBear (2^31 - 2^27 + 1)
// → FFT에 최적화된 소수체, GPU에서 매우 빠름
// FRI 설정: rate=1/8, num_queries=100, log_blowup=3`;
