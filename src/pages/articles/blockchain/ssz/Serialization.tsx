import { CitationBlock } from '../../../../components/ui/citation';

export default function Serialization() {
  return (
    <section id="serialization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">직렬화 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">기본 타입 (Basic Types)</h3>
        <p>
          SSZ의 기본 타입은 모두 <strong>고정 크기</strong>이며, <strong>little-endian</strong> 바이트 순서로
          인코딩됩니다. RLP가 big-endian을 사용하는 것과 대조적입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`기본 타입 (Basic Types)
─────────────────────────────────────────
타입          크기(bytes)    설명
─────────────────────────────────────────
uint8         1             0~255
uint16        2             little-endian
uint32        4             little-endian
uint64        8             little-endian
uint128       16            little-endian
uint256       32            little-endian
boolean       1             0x00 (false) / 0x01 (true)
─────────────────────────────────────────

예시: uint64(258) → 0x0201000000000000
  (little-endian: 최하위 바이트 먼저)

RLP:  uint64(258) → 0x820102
  (big-endian + 가변 길이 접두사)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">복합 타입 (Composite Types)</h3>
        <p>
          복합 타입은 기본 타입이나 다른 복합 타입을 포함하는 구조체입니다.
          크게 <strong>Fixed-size</strong>와 <strong>Variable-size</strong>로 구분되며,
          이 구분이 SSZ의 효율적 접근을 가능하게 합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`복합 타입 (Composite Types)
──────────────────────────────────────────────────
타입          크기 분류      설명
──────────────────────────────────────────────────
Container     Fixed/Var     이름 있는 필드들의 구조체
Vector[T, N]  Fixed         T 타입 N개의 고정 길이 배열
List[T, N]    Variable      T 타입 최대 N개의 가변 길이 배열
Bitvector[N]  Fixed         N비트 고정 길이 비트열
Bitlist[N]    Variable      최대 N비트 가변 길이 비트열
Union         Variable      태그 기반 합집합 타입
──────────────────────────────────────────────────`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fixed-size vs Variable-size</h3>
        <p>
          SSZ의 핵심 설계 원칙은 <strong>Fixed-size 타입과 Variable-size 타입의 명확한 구분</strong>입니다.
          Fixed-size 필드는 고정 오프셋으로 직접 접근이 가능하고,
          Variable-size 필드는 오프셋 테이블을 통해 접근합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Fixed-size Container 직렬화:
┌──────────┬──────────┬──────────┐
│ field_a  │ field_b  │ field_c  │
│ (uint64) │ (uint32) │ (bool)   │
│ 8 bytes  │ 4 bytes  │ 1 byte   │
└──────────┴──────────┴──────────┘
→ 총 13 bytes, 각 필드에 고정 오프셋으로 O(1) 접근

Variable-size Container 직렬화:
┌──────────┬──────────┬──────────┬──────────────┬──────────────┐
│ field_a  │ offset_b │ offset_c │ field_b data │ field_c data │
│ (uint64) │ (4 bytes)│ (4 bytes)│ (var bytes)  │ (var bytes)  │
│ 8 bytes  │ → pos_b  │ → pos_c  │              │              │
└──────────┴──────────┴──────────┴──────────────┴──────────────┘
  fixed part (16 bytes)            variable part
→ 오프셋 테이블로 variable 필드 위치를 역참조`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">예시: BeaconBlock Container 직렬화</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`# BeaconBlock의 SSZ 스키마 (consensus-specs)
class BeaconBlock(Container):
    slot: Slot                  # uint64  → Fixed (8B)
    proposer_index: ValidatorIndex  # uint64  → Fixed (8B)
    parent_root: Root           # Bytes32 → Fixed (32B)
    state_root: Root            # Bytes32 → Fixed (32B)
    body: BeaconBlockBody       # Container → Variable

직렬화 레이아웃:
┌────────┬────────────────┬─────────────┬─────────────┬──────────┬────────────┐
│ slot   │ proposer_index │ parent_root │ state_root  │ offset   │ body data  │
│ 8B     │ 8B             │ 32B         │ 32B         │ 4B       │ var bytes  │
└────────┴────────────────┴─────────────┴─────────────┴──────────┴────────────┘
 fixed part (84 bytes)                                  variable part

→ slot, proposer_index, parent_root, state_root는
  디코딩 없이 고정 오프셋으로 직접 읽기 가능`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">RLP과의 핵심 차이</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`비교 항목          RLP                    SSZ
──────────────────────────────────────────────────────
해시 함수          Keccak-256             SHA-256
스키마            불필요 (schema-less)     필수 (schema-aware)
바이트 순서        Big-endian             Little-endian
부분 접근          전체 디코딩 필요        고정 오프셋 직접 접근
Merkleization     별도 구현 (MPT)         내장 지원
타입 안전성        런타임 추론             컴파일 타임 보장
사용 레이어        Execution Layer        Consensus Layer
증명 크기          MPT proof (~4KB)       Merkle proof (~480B)`}</code>
        </pre>

        <CitationBlock source="ethereum.org — SSZ specification" citeKey={1} type="paper" href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/ssz/">
          <p className="italic text-foreground/80">"Simple serialize (SSZ) is the serialization method used on the Beacon Chain. It replaces the RLP serialization used on the execution layer everywhere across the consensus layer except the peer discovery protocol."</p>
          <p className="mt-2 text-xs">SSZ는 Beacon Chain에서 사용되는 직렬화 방법으로, 피어 발견 프로토콜을 제외한 합의 레이어 전반에서 EL의 RLP 직렬화를 대체합니다.</p>
        </CitationBlock>

        <CitationBlock source="SSZ specification — ethereum/consensus-specs" citeKey={2} type="code" href="https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md">
          <p className="italic text-foreground/80">"SSZ provides two things: a way to serialize/deserialize data structures, and a way to compute Merkle roots of those data structures (called hash_tree_root)."</p>
          <p className="mt-2 text-xs">SSZ는 데이터 구조의 직렬화/역직렬화 방법과 해당 구조의 머클 루트(hash_tree_root) 계산 방법을 함께 제공합니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
