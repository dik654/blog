export const CLI_CODE = `# SP1 CLI (cargo-prove)
# 설치
curl -L https://sp1up.succinct.xyz | bash
sp1up  # 최신 도구체인 설치

# 프로젝트 생성
cargo prove new my-project
# → program/  (Guest 코드, RISC-V 타겟)
# → script/   (Host 코드, 로컬 실행)

# 빌드 (Guest → RISC-V ELF)
cd program && cargo prove build

# 실행 (증명 없이 테스트)
cd script && cargo run --release

# 증명 생성 (CPU)
SP1_PROVER=cpu cargo run --release

# 증명 생성 (CUDA)
SP1_PROVER=cuda cargo run --release`;

export const WORKFLOW_STEPS = [
  { step: '1. 프로젝트 생성', cmd: 'cargo prove new', desc: 'program + script 템플릿 생성' },
  { step: '2. Guest 코드 작성', cmd: 'program/src/main.rs', desc: 'sp1_zkvm::entrypoint!(main)' },
  { step: '3. ELF 빌드', cmd: 'cargo prove build', desc: 'riscv32im 크로스 컴파일' },
  { step: '4. 실행 테스트', cmd: 'client.execute()', desc: '증명 없이 빠른 결과 확인' },
  { step: '5. 증명 생성', cmd: 'client.prove()', desc: 'Core/Compressed/Groth16 선택' },
  { step: '6. 검증', cmd: 'client.verify()', desc: '로컬 또는 온체인 검증' },
];

export const PROJECT_STRUCT_CODE = `# 프로젝트 구조
my-project/
├── program/           # Guest (zkVM 내부 실행)
│   ├── Cargo.toml     # sp1-zkvm 의존성
│   └── src/
│       └── main.rs    # #![no_main], entrypoint!(main)
├── script/            # Host (로컬 실행)
│   ├── Cargo.toml     # sp1-sdk 의존성
│   └── src/
│       └── main.rs    # ProverClient, prove/verify
└── elf/               # 빌드된 RISC-V ELF 바이너리`;

export const cliAnnotations = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '도구체인 설치' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: '프로젝트 생성' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: 'Guest 빌드' },
  { lines: [14, 15] as [number, number], color: 'violet' as const, note: '실행 테스트' },
  { lines: [17, 21] as [number, number], color: 'rose' as const, note: '증명 생성 (CPU/CUDA)' },
];

export const projectAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'Guest — zkVM 내부 실행 코드' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'Host — SDK + 증명 관리' },
  { lines: [11, 11] as [number, number], color: 'amber' as const, note: '빌드 산출물 (ELF)' },
];
