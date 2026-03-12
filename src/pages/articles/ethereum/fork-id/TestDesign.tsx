export default function TestDesign() {
  return (
    <section id="test-design" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">테스트 케이스 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-4 mb-3">테스트넷 설계 철학</h3>
        <p>
          테스트넷(Sepolia 등)은 메인넷과 동일한 로직을 검증하되, 포크 순서와 타이밍이
          다릅니다. Sepolia는 제네시스부터 PoS로 시작하여 블록 번호 기반 포크 없이
          타임스탬프 기반 포크만 존재합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">0으로 설정된 블록의 처리</h3>
        <p>
          포크 블록이 0으로 설정되면 해당 포크가 제네시스부터 활성화되었음을 의미합니다.
          CRC32 계산 시 0인 포크는 제네시스 해시에 이미 포함된 것으로 간주하여
          별도로 XOR하지 않습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`테스트 케이스 검증 시나리오:
1. 동일 체인, 동일 포크 → 연결 허용
2. 동일 체인, 미래 포크 인지 → 연결 허용 (업그레이드 대기)
3. 다른 체인 (genesis 불일치) → 연결 거부
4. 같은 genesis, 다른 포크 경로 → 연결 거부
5. fork_next 불일치 → 조건부 거부`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Mainnet 테스트 작성</h3>
        <p>
          Mainnet 테스트는 실제 포크 역사(Homestead, Byzantium, Constantinople 등)를
          순서대로 반영하며, 각 포크 시점에서의 Fork ID 값을 검증합니다.
          PoS 전환 이후에는 타임스탬프 기반 포크(Shanghai, Cancun 등)도 포함됩니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`// Mainnet Fork ID 검증 예시
assert_eq!(
  fork_id(genesis_hash, homestead_block),
  ForkId { hash: 0xfc64ec04, next: 2463000 }
);
assert_eq!(
  fork_id(genesis_hash, shanghai_timestamp),
  ForkId { hash: 0xdce96c2d, next: 1710338135 }
);`}</code>
        </pre>
      </div>
    </section>
  );
}
