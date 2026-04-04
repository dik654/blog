export const USAGE_CODE = `// Guest 코드 (RISC-V에서 실행)
// program/src/main.rs
#![no_main]
sp1_zkvm::entrypoint!(main);

fn main() {
    let n: u32 = sp1_zkvm::io::read();
    let result = fibonacci(n);
    sp1_zkvm::io::commit(&result);
}

// Host 코드
use sp1_sdk::{ProverClient, SP1Stdin};

fn main() {
    let client = ProverClient::from_env();
    let mut stdin = SP1Stdin::new();
    stdin.write(&42u32);

    // 실행만 (증명 없이 빠르게)
    let (output, report) = client.execute(ELF, &stdin).run().unwrap();
    println!("Cycles: {}", report.total_instruction_count());

    // 증명 생성
    let (pk, vk) = client.setup(ELF);
    let proof = client.prove(&pk, &stdin).run().unwrap();

    // 검증
    client.verify(&proof, &vk).unwrap();
}`;

export const usageAnnotations = [
  { lines: [1, 10] as [number, number], color: 'sky' as const, note: 'Guest — zkVM 내부 실행 코드' },
  { lines: [12, 18] as [number, number], color: 'emerald' as const, note: 'Host — SDK 초기화 + 입력' },
  { lines: [20, 22] as [number, number], color: 'amber' as const, note: '실행 모드 — 증명 없이 테스트' },
  { lines: [24, 29] as [number, number], color: 'violet' as const, note: '증명 생성 + 검증' },
];
