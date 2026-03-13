import { CitationBlock } from '../../../../components/ui/citation';

export default function TrieStructure() {
  return (
    <section id="trie-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Patricia Trie 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-lg font-semibold mt-6 mb-3">4가지 노드 타입</h3>
        <p>
          Modified Merkle Patricia Trie는 4가지 노드 타입으로 구성되며,
          각 노드는 RLP로 인코딩되어 LevelDB/PebbleDB에 저장됩니다.
        </p>

        <div className="not-prose space-y-3 mb-6">
          <div className="rounded-lg border-l-4 border-blue-500/50 bg-blue-500/5 p-4">
            <p className="font-semibold text-sm text-blue-400">Blank Node</p>
            <p className="text-xs text-muted-foreground mt-1">
              빈 문자열 <code className="text-xs">&quot;&quot;</code>로 표현됩니다. 트리가 비어있거나, Branch 노드에서 사용되지 않는 슬롯을 나타냅니다.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-green-500/50 bg-green-500/5 p-4">
            <p className="font-semibold text-sm text-green-400">Leaf Node</p>
            <p className="text-xs text-muted-foreground mt-1">
              <code className="text-xs">[encodedPath, value]</code> — 키의 나머지 경로(suffix)와 최종 값을 저장합니다.
              HP 인코딩된 경로의 첫 nibble 플래그가 <code className="text-xs">2</code> 또는 <code className="text-xs">3</code>입니다.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-purple-500/50 bg-purple-500/5 p-4">
            <p className="font-semibold text-sm text-purple-400">Extension Node</p>
            <p className="text-xs text-muted-foreground mt-1">
              <code className="text-xs">[encodedPath, key]</code> — 공유 접두사와 다음 자식 노드에 대한 포인터를 저장합니다.
              HP 인코딩된 경로의 첫 nibble 플래그가 <code className="text-xs">0</code> 또는 <code className="text-xs">1</code>입니다.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-orange-500/50 bg-orange-500/5 p-4">
            <p className="font-semibold text-sm text-orange-400">Branch Node</p>
            <p className="text-xs text-muted-foreground mt-1">
              <code className="text-xs">[v0, v1, ..., v15, value]</code> — 17개 엘리먼트 배열. 인덱스 0-15는 각 hex nibble(0-f)에 대한 자식 포인터,
              마지막 엘리먼트는 이 지점에서 종료되는 키의 값(선택적)입니다.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Hex-Prefix (HP) 인코딩</h3>
        <p>
          키 경로는 nibble(4-bit) 단위로 처리되지만, 저장 시에는 byte 단위로 변환해야 합니다.
          HP 인코딩은 nibble 시퀀스를 byte 배열로 변환하면서 노드 타입 정보를 함께 인코딩합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`HP 인코딩 규칙:
┌──────────┬────────────┬──────────────────────────┐
│ 노드 타입 │ 경로 길이   │ 첫 nibble 접두사           │
├──────────┼────────────┼──────────────────────────┤
│ Extension│ 짝수       │ 0000 (0x0)               │
│ Extension│ 홀수       │ 0001 (0x1)               │
│ Leaf     │ 짝수       │ 0010 (0x2)               │
│ Leaf     │ 홀수       │ 0011 (0x3)               │
└──────────┴────────────┴──────────────────────────┘

예시: Leaf 노드, 경로 [1, 2, 3, 4, 5]
→ 홀수 길이 + Leaf = 접두사 0x3
→ HP 인코딩: [0x31, 0x23, 0x45]
   (0x3 접두사 + 첫 nibble 1, 나머지 nibble 쌍)`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">경로 압축</h3>
        <p>
          Patricia Trie의 핵심은 공유 접두사를 Extension 노드로 압축하는 것입니다.
          예를 들어, 모든 키가 <code>0xa7</code>로 시작한다면 이 접두사를 하나의 Extension 노드로 표현하여
          트리 깊이를 줄입니다. 이를 통해 희소한 키 공간에서도 효율적인 탐색이 가능합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`경로 압축 예시:

키: a711355 → 45 ETH
키: a77d337 → 1.0 ETH
키: a77d397 → 0.12 ETH

압축 전 (Radix Trie):
  root → a → 7 → 1 → 1 → 3 → 5 → 5 → [45 ETH]
                → 7 → d → 3 → 3 → 7 → [1.0 ETH]
                              → 9 → 7 → [0.12 ETH]

압축 후 (Patricia Trie):
  root → Ext("a7") → Branch
    [1] → Leaf("1355") → 45 ETH
    [7] → Ext("d3") → Branch
      [3] → Leaf("7") → 1.0 ETH
      [9] → Leaf("7") → 0.12 ETH`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">Modified Merkle Patricia Trie</h3>
        <p>
          Ethereum이 사용하는 &quot;Modified&quot; Merkle Patricia Trie는 일반 Patricia Trie에
          Merkle 해싱을 추가한 것입니다. 각 노드의 RLP 인코딩에 keccak256 해시를 적용하고,
          이 해시를 부모 노드에 저장합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`노드 저장 규칙:
- RLP 인코딩된 노드 크기 < 32 bytes → 노드를 직접 인라인
- RLP 인코딩된 노드 크기 >= 32 bytes → keccak256(RLP(node))를 저장

DB 저장:
  key   = keccak256(RLP(node))
  value = RLP(node)

루트 해시 계산:
  rootHash = keccak256(RLP(rootNode))
  → 이 32-byte 해시가 블록 헤더에 포함`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">geth 구현</h3>
        <p>
          Go-Ethereum (geth)의 <code>trie/</code> 패키지가 MPT의 핵심 구현을 담당합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// trie/node.go — 노드 타입 정의
type (
    fullNode struct {       // Branch Node: 17개 자식
        Children [17]node
        flags    nodeFlag
    }
    shortNode struct {      // Extension 또는 Leaf Node
        Key   []byte        // HP 인코딩된 경로
        Val   node          // Leaf: valueNode, Extension: 자식 노드
        flags nodeFlag
    }
    hashNode  []byte        // 아직 로드되지 않은 노드의 해시
    valueNode []byte        // Leaf의 실제 값 (RLP 인코딩된 데이터)
)

// trie/trie.go — 핵심 연산
func (t *Trie) Get(key []byte) ([]byte, error)
func (t *Trie) Update(key, value []byte) error
func (t *Trie) Delete(key []byte) error
func (t *Trie) Hash() common.Hash  // 루트 해시 계산
func (t *Trie) Commit() (common.Hash, error)  // DB에 커밋`}</code></pre>

        <CitationBlock source="Ethereum Yellow Paper, Appendix D — Modified Merkle Patricia Tree" citeKey={1} type="paper" href="https://ethereum.github.io/yellowpaper/paper.pdf">
          <p className="italic text-foreground/80">
            &quot;The modified Merkle Patricia tree (trie) provides a persistent data structure to map between
            arbitrary-length binary data (byte arrays). It is defined in terms of a mutable data structure
            to map between 256-bit binary fragments and arbitrary-length binary data.&quot;
          </p>
          <p className="mt-2 text-xs">
            Yellow Paper의 Appendix D는 MPT의 수학적 정의를 제공합니다. TRIE 함수의 재귀적 정의와
            HP 인코딩, 노드 캡(node cap) 규칙 등이 형식적으로 기술되어 있습니다.
          </p>
        </CitationBlock>

        <CitationBlock source="geth trie implementation (trie/node.go)" citeKey={2} type="code" href="https://github.com/ethereum/go-ethereum/blob/master/trie/node.go">
          <p className="italic text-foreground/80">
            &quot;fullNode represents a 17-element node in the trie. shortNode represents a node with a
            variable-length key. hashNode is a compact representation of a trie node that only contains
            the hash of the node.&quot;
          </p>
          <p className="mt-2 text-xs">
            geth의 trie/node.go는 fullNode(Branch), shortNode(Extension/Leaf), hashNode, valueNode의
            4가지 Go 타입으로 MPT 노드를 구현합니다. nodeFlag는 해시 캐싱과 dirty 상태 추적에 사용됩니다.
          </p>
        </CitationBlock>

      </div>
    </section>
  );
}
