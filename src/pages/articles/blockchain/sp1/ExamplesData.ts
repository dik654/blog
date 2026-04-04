export const FIB_GUEST_CODE = `// Fibonacci Guest (program/src/main.rs)
#![no_main]
sp1_zkvm::entrypoint!(main);

fn main() {
    let n: u32 = sp1_zkvm::io::read();

    // 일반 Rust 코드 — 그대로 실행
    let mut a: u32 = 0;
    let mut b: u32 = 1;
    for _ in 0..n {
        let tmp = b;
        b = a.wrapping_add(b);
        a = tmp;
    }

    // 결과를 공개 출력으로 커밋
    sp1_zkvm::io::commit(&n);
    sp1_zkvm::io::commit(&a);
}`;

export const FIB_HOST_CODE = `// Fibonacci Host (script/src/main.rs)
use sp1_sdk::{ProverClient, SP1Stdin};

const ELF: &[u8] = include_bytes!("../../elf/fibonacci-program");

fn main() {
    let client = ProverClient::from_env();
    let mut stdin = SP1Stdin::new();
    stdin.write(&20u32);  // fib(20) 계산

    // 1. 실행만 (빠른 테스트)
    let (output, report) = client.execute(ELF, &stdin).run().unwrap();
    println!("사이클: {}", report.total_instruction_count());

    // 2. Groth16 증명 생성 (온체인 검증용)
    let (pk, vk) = client.setup(ELF);
    let proof = client.prove(&pk, &stdin).groth16().run().unwrap();

    // 3. 검증
    client.verify(&proof, &vk).unwrap();
    let (n, result): (u32, u32) = proof.public_values.read();
    println!("fib({n}) = {result}, 증명 완료!");
}`;

export const CASES = [
  { name: 'Fibonacci', desc: '기본 산술 연산. ~200 사이클. 입문용.',
    perf: 'Core: ~0.5s, Groth16: ~30s', color: '#10b981' },
  { name: 'JSON 파싱', desc: 'serde_json으로 JSON 파싱 + 검증. 표준 라이브러리 활용.',
    perf: 'Core: ~2s, Groth16: ~45s', color: '#6366f1' },
  { name: 'SHA256 해시', desc: '프리컴파일 가속. 일반 실행 대비 100배+ 빠름.',
    perf: 'Core: ~1s (프리컴파일), Groth16: ~35s', color: '#f59e0b' },
  { name: 'ECDSA 서명 검증', desc: 'secp256k1 서명 검증. 타원곡선 프리컴파일 활용.',
    perf: 'Core: ~3s, Groth16: ~50s', color: '#8b5cf6' },
  { name: 'Tendermint LC', desc: '라이트 클라이언트 검증. 블록 헤더 + 서명 검증.',
    perf: 'Core: ~10s, Groth16: ~120s', color: '#ec4899' },
];

export const BEST_PRACTICES = [
  '프리컴파일 활용: sha2, keccak, secp256k1은 반드시 SP1 패치 크레이트 사용',
  '메모리 최적화: 대용량 데이터는 sp1_zkvm::io::hint()로 비검증 입력 제공',
  '사이클 프로파일링: client.execute()로 사이클 수 확인 후 최적화',
  '증명 모드 선택: 개발 시 Core, 배포 시 Groth16/PLONK',
  'GPU 활용: 프로덕션에서는 SP1_PROVER=cuda 또는 network 사용',
];

export const fibGuestAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'zkVM 진입점 매크로' },
  { lines: [6, 6] as [number, number], color: 'emerald' as const, note: '입력 읽기 (Host에서 제공)' },
  { lines: [8, 14] as [number, number], color: 'amber' as const, note: '순수 Rust — 일반 피보나치' },
  { lines: [16, 18] as [number, number], color: 'violet' as const, note: '공개 출력 커밋' },
];

export const fibHostAnnotations = [
  { lines: [4, 4] as [number, number], color: 'sky' as const, note: 'ELF 바이너리 임베딩' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: '실행 전용 모드 (디버그)' },
  { lines: [14, 16] as [number, number], color: 'amber' as const, note: 'Groth16 증명 생성' },
  { lines: [18, 21] as [number, number], color: 'violet' as const, note: '검증 + 결과 추출' },
];
