export const PIPELINE_CODE = `// 1단계: Executor — 실행 추적 생성
// RISC-V ELF를 로드하고 명령어를 시뮬레이션
// 매 사이클마다 레지스터/메모리 상태를 기록
pub struct ExecutionTrace {
    pub pc: Vec<u32>,               // 프로그램 카운터 목록
    pub registers: Vec<[u32; 32]>,  // 각 사이클의 레지스터 상태
    pub memory: Vec<MemoryOp>,      // 메모리 연산 목록
    pub syscalls: Vec<SyscallOp>,   // 시스템 콜 목록
}

// 2단계: Prover — STARK 증명 생성
// 각 세그먼트를 독립적으로 병렬 증명
// → SegmentReceipt (세그먼트별 STARK)
// → CompositeReceipt (세그먼트 연결 증명)
// → SuccinctReceipt (재귀 압축)
// → Groth16Receipt (온체인 검증용 SNARK)`;

export const SEGMENT_CODE = `// 실행이 너무 길면 세그먼트로 분할
// DEFAULT_SEGMENT_LIMIT_PO2 = 20 → 각 세그먼트 최대 2^20 ≈ 1M 사이클
// MAX_CYCLES_PO2 = 24 → 전체 최대 2^24 사이클
// 각 세그먼트는 독립적으로 병렬 증명 가능

pub struct Segment {  // circuit-level
    pub partial_image: MemoryImage,    // 초기 희소 메모리 상태
    pub claim: Rv32imV2Claim,          // 세그먼트 클레임
    pub read_record: Vec<Vec<u8>>,     // 호스트→게스트 I/O 기록
    pub write_record: Vec<u32>,        // 게스트→호스트 I/O 기록
    pub suspend_cycle: u32,            // 중단 사이클
    pub paging_cycles: u32,            // 페이징 사이클
    pub segment_threshold: u32,
    pub po2: u32,                      // STARK 추적 크기 = 2^po2 행
    pub index: u64,                    // 세그먼트 인덱스
    pub povw_nonce: Option<PovwNonce>,
}

// 세그먼트 연결 증명
// 각 세그먼트의 claim이 이전 세그먼트와 일관됨을 재귀적으로 검증`;

export const IO_CODE = `// Host → Guest: stdin 채널
let env = ExecutorEnv::builder()
    .write(&secret_input)?    // 비공개 (Journal에 안 들어감)
    .write_slice(&public_data)? // 비공개
    .build()?;

// Guest → Host: Journal (공개 출력)
env::commit(&result);         // Journal에 기록 (검증자가 볼 수 있음)
env::commit_slice(&bytes);

// Guest → Host: stdout/stderr (디버그용, 증명에 포함 안 됨)
println!("Debug: {}", value); // 개발 중 디버깅용

// 시스템 콜 (ECALL)을 통한 통신
// RISC-V 머신이 특수 레지스터에 값을 쓰면 Host가 처리
// 내장 syscall (문자열 이름으로 등록):
// "sys_read"   → stdin 입력
// "sys_write"  → stdout 출력
// "sys_random" → 랜덤 데이터
// 가속기(SHA2, Poseidon2, bigint)는 사용자 정의 syscall로 등록`;

export const MEMORY_CODE = `// RISC-V 32비트 주소 공간
// 0x0000_0000 ~ 0x0BFF_FFFF: 스택 & 힙 (Guest 사용)
// 0x0C00_0000 ~ 0x0FFF_FFFF: 시스템 영역
// 0x1000_0000 ~             : ELF 코드/데이터 섹션

// 페이지 테이블 (4KB 페이지)
// 각 페이지 접근은 zkVM 회로에서 추적됨
// 페이지 해시를 Merkle 트리로 관리
// → "어떤 메모리를 어떻게 접근했는가"를 증명에 포함

// 최대 메모리: ~512MB (po2=24, 세그먼트 최대 크기 기준)
// 스택 크기: 기본 4MB (RISC-V 관례)`;
