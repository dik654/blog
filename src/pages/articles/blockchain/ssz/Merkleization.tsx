import { CitationBlock } from '../../../../components/ui/citation';

export default function Merkleization() {
  return (
    <section id="merkleization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkleization과 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">32-byte 청크 분할</h3>
        <p>
          Merkleization의 첫 단계는 직렬화된 데이터를 <strong>32-byte 청크</strong>로 분할하는 것입니다.
          데이터가 32바이트보다 작으면 0으로 패딩하고, 크면 여러 청크로 나눕니다.
          이 청크들이 바이너리 머클 트리의 <strong>리프 노드</strong>가 됩니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`청크 분할 규칙:
──────────────────────────────────────────────
1. 기본 타입: 직렬화된 값을 32B로 zero-pad
   uint64(42) → 0x2a00000000000000 + 24 zero bytes

2. Fixed-size 리스트: 원소를 연결 후 32B 단위 분할
   Vector[uint64, 4] → 32B (8B × 4 = 32B, 딱 1청크)

3. Variable-size 리스트: 원소별 hash_tree_root를 리프로
   List[Container, N] → 각 Container의 root가 리프

4. Container: 각 필드의 hash_tree_root를 리프로
   BeaconBlock → [slot_root, proposer_root, parent_root,
                  state_root, body_root]`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">바이너리 머클 트리 구성 (SHA-256)</h3>
        <p>
          청크들을 리프로 하여 <strong>SHA-256 기반 바이너리 머클 트리</strong>를 구성합니다.
          리프 수가 2의 거듭제곱이 아니면 제로 해시(zero hash)로 패딩합니다.
          트리의 루트가 곧 해당 SSZ 객체의 <code>hash_tree_root</code>입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`hash_tree_root 계산 과정:

BeaconBlock 필드 5개 → 8개로 패딩 (2³)

              hash_tree_root
              /             \\
           H(0-3)          H(4-7)
           /    \\          /    \\
       H(0,1) H(2,3)  H(4,5) H(6,7)
       / \\    / \\      / \\    / \\
      L0  L1 L2  L3   L4  Z   Z   Z

L0 = hash_tree_root(slot)
L1 = hash_tree_root(proposer_index)
L2 = hash_tree_root(parent_root)
L3 = hash_tree_root(state_root)
L4 = hash_tree_root(body)
Z  = zero_hash (0x00...00 32bytes)

H(a,b) = SHA-256(a ∥ b)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Generalized Index</h3>
        <p>
          Generalized Index는 머클 트리 내 특정 노드의 위치를 <strong>단일 정수</strong>로 표현하는 방식입니다.
          루트의 인덱스는 1이고, 노드 <code>i</code>의 왼쪽 자식은 <code>2i</code>,
          오른쪽 자식은 <code>2i + 1</code>입니다.
          이를 통해 트리 내 임의의 필드에 대한 증명 경로를 정수 연산만으로 계산할 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Generalized Index 트리 구조:

                   1 (root)
                /         \\
              2             3
            /   \\         /   \\
          4      5      6      7
         / \\   / \\    / \\   / \\
        8   9 10  11 12  13 14  15  ← 리프 (depth=3)

예시: BeaconBlock.state_root의 generalized index
  BeaconBlock은 depth=3 (8리프)
  state_root는 필드 인덱스 3 (0-based)
  → generalized index = 2³ + 3 = 11

증명 경로: 노드 11의 sibling path
  11 → sibling(10) → parent(5), sibling(4) → parent(2), sibling(3)
  → proof = [node_10, node_4, node_3]`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-proof</h3>
        <p>
          Multi-proof는 <strong>여러 리프에 대한 증명을 하나로 결합</strong>한 것입니다.
          개별 증명에서 중복되는 내부 노드를 제거하여 증명 크기를 절약합니다.
          예를 들어 slot과 state_root를 동시에 증명할 때,
          공유하는 상위 노드를 한 번만 포함하면 됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">hash_tree_root 구현</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`# hash_tree_root 의사 코드

def hash_tree_root(value):
    if is_basic_type(value):
        # 기본 타입: 직렬화 후 32B 패딩
        return merkleize(pack(serialize(value)))

    if is_container(value):
        # Container: 각 필드의 hash_tree_root를 리프로
        leaves = [hash_tree_root(field) for field in value.fields]
        return merkleize(leaves)

    if is_list(value):
        # List: hash_tree_root들의 머클 루트 + mix_in_length
        leaves = [hash_tree_root(elem) for elem in value]
        root = merkleize(leaves, limit=value.max_length)
        return mix_in_length(root, len(value))

    if is_vector(value):
        # Vector: hash_tree_root들의 머클 루트 (길이 혼합 없음)
        leaves = [hash_tree_root(elem) for elem in value]
        return merkleize(leaves)

def merkleize(chunks, limit=None):
    # 청크 수를 2의 거듭제곱으로 패딩
    count = next_power_of_two(limit or len(chunks))
    padded = chunks + [ZERO_HASH] * (count - len(chunks))
    # 바이너리 트리 구성
    while len(padded) > 1:
        padded = [SHA256(a + b) for a, b in pairs(padded)]
    return padded[0]

def mix_in_length(root, length):
    # List 타입: 루트에 길이 정보를 혼합
    return SHA256(root + length.to_bytes(32, 'little'))`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Light Client 지원</h3>
        <p>
          SSZ Merkleization의 가장 중요한 응용은 <strong>Light client</strong> 지원입니다.
          Light client는 전체 BeaconState(수 GB)를 저장하지 않고도,
          상태의 특정 부분에 대한 <strong>머클 증명</strong>을 검증할 수 있습니다.
          예를 들어, 특정 검증자의 잔액을 증명하려면 BeaconState의 balances 필드까지의
          머클 경로만 있으면 됩니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Light Client 증명 예시:

"검증자 #1234의 잔액이 32 ETH인가?"

Full Node가 제공:
  1. balances[1234] = 32000000000 (Gwei)
  2. Merkle proof: balances[1234] → BeaconState root
     - sibling nodes along the path
     - generalized index로 경로 계산

Light Client가 검증:
  1. 알려진 BeaconState root (블록 헤더에서 획득)
  2. proof의 sibling들과 값을 SHA-256으로 재계산
  3. 계산된 root == 알려진 root → 증명 유효

증명 크기: ~480 bytes (log₂(트리 깊이) × 32B)
vs 전체 BeaconState: ~수 GB`}</code>
        </pre>

        <CitationBlock source="Ethereum consensus specs — Merkleization" citeKey={3} type="paper" href="https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md#merkleization">
          <p className="italic text-foreground/80">"We first define helper functions: hash(x): SHA256(x), merkleize(chunks, limit): Given ordered chunks of bytelist leaf data, merkleize the chunks."</p>
          <p className="mt-2 text-xs">SHA-256을 해시 함수로 사용하며, 정렬된 바이트 청크 리프 데이터를 받아 머클라이즈합니다. limit 매개변수는 List 타입의 최대 길이를 반영합니다.</p>
        </CitationBlock>

        <CitationBlock source="EIP-6404 — SSZ Transactions" citeKey={4} type="paper" href="https://eips.ethereum.org/EIPS/eip-6404">
          <p className="italic text-foreground/80">"This EIP defines a migration process for Ethereum transactions from their existing RLP encoding to SSZ, enabling forward compatibility with future transaction types."</p>
          <p className="mt-2 text-xs">이 EIP는 이더리움 트랜잭션의 기존 RLP 인코딩에서 SSZ로의 마이그레이션 프로세스를 정의하여, 향후 트랜잭션 타입과의 호환성을 확보합니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
