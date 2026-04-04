export const USAGE_CODE = `// Guest 코드 (zkVM 내부에서 실행)
// methods/guest/src/main.rs
use risc0_zkvm::guest::env;

fn main() {
    // Host로부터 입력 읽기 (검증자에게는 비공개)
    let input: u32 = env::read();

    // 계산 수행
    let result = fibonacci(input);

    // 결과를 Journal에 기록 (공개 출력)
    env::commit(&result);
}

// Host 코드 (일반 Rust)
// src/main.rs
use risc0_zkvm::{default_prover, ExecutorEnv};

fn main() {
    // 실행 환경 구성
    let env = ExecutorEnv::builder()
        .write(&42u32)  // Guest에게 입력 전달
        .unwrap()
        .build().unwrap();

    // 증명 생성 (시간이 걸림)
    let prover = default_prover();
    let receipt = prover.prove(env, FIBONACCI_ELF).unwrap();

    // 결과 확인 (Journal에서 읽기)
    let result: u64 = receipt.journal.decode().unwrap();
    println!("fibonacci(42) = {result}");

    // 검증 (빠름)
    receipt.verify(FIBONACCI_ID).unwrap();
    println!("Proof verified!");
}`;

export const usageAnnotations = [
  { lines: [1, 14] as [number, number], color: 'sky' as const, note: 'Guest — zkVM 내부 실행 코드' },
  { lines: [16, 26] as [number, number], color: 'emerald' as const, note: 'Host — 환경 구성 + 입력 전달' },
  { lines: [28, 30] as [number, number], color: 'amber' as const, note: '증명 생성 — prover.prove()' },
  { lines: [32, 37] as [number, number], color: 'violet' as const, note: '결과 확인 + 검증' },
];
