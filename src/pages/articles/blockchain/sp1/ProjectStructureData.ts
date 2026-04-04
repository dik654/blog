export const CRATES = [
  { name: 'sp1-sdk', color: '#6366f1', desc: '고수준 API. ProverClient, SP1Stdin, prove()/verify() 진입점.' },
  { name: 'sp1-core-executor', color: '#10b981', desc: 'RISC-V ELF 로더, Executor, ExecutionState, 메모리 관리.' },
  { name: 'sp1-core-machine', color: '#f59e0b', desc: 'AIR 칩 정의, RiscvAir enum, MachineAir trait 구현.' },
  { name: 'sp1-prover', color: '#8b5cf6', desc: 'prove_core, compress, shrink, wrap 증명 파이프라인.' },
  { name: 'sp1-recursion-core', color: '#ec4899', desc: '재귀 회로 정의, RecursionProgram, BabyBear→BN254 변환.' },
  { name: 'sp1-recursion-compiler', color: '#ef4444', desc: '재귀 프로그램 컴파일러, Plonky3 Air 코드 생성.' },
  { name: 'sp1-primitives', color: '#0ea5e9', desc: '공유 타입, BabyBearPoseidon2, 해시 함수, IO 프리미티브.' },
  { name: 'sp1-cuda', color: '#84cc16', desc: 'CUDA 가속 백엔드. GPU 병렬 NTT/MSM/FRI 증명.' },
];

export const BUILD_CODE = `# SP1 빌드 파이프라인
# 1. Guest 코드 컴파일 (RISC-V 타겟)
cargo prove build --elf-name my-program

# 내부적으로:
# rustc --target riscv32im-succinct-zkvm-elf
#   → .text, .rodata 섹션 → ELF 바이너리

# 2. Host 코드에서 ELF 로드
include_bytes!("../../elf/my-program")

# 3. ProverClient 초기화
#   SP1_PROVER=cpu|cuda|network
#   → 환경에 따라 CpuProver/CudaProver/NetworkProver 선택`;

export const buildAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '1단계: RISC-V 크로스 컴파일' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: '내부: rustc → riscv32im ELF' },
  { lines: [9, 10] as [number, number], color: 'amber' as const, note: '2단계: 바이너리 임베딩' },
  { lines: [12, 14] as [number, number], color: 'violet' as const, note: '3단계: 프로버 백엔드 선택' },
];
