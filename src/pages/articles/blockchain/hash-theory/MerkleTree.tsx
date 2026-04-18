import M from '@/components/ui/math';
import MerkleTreeViz from './viz/MerkleTreeViz';
import SMTViz from './viz/SMTViz';

export default function MerkleTree() {
  return (
    <section id="merkle-tree" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle Tree & 희소 트리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          루트 해시 하나로 전체 데이터 무결성 증명. 증명 크기 O(log n).
        </p>
      </div>
      <div className="not-prose mb-8"><MerkleTreeViz /></div>

      <h3 className="text-xl font-semibold mb-3">희소 머클 트리 (SMT)</h3>
      <div className="not-prose"><SMTViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Tree 기본 구조</h3>

        {/* 생성 규칙 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-3">생성 규칙</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Leaf: <M>{'\\text{leaf}_i = H(\\text{data}_i)'}</M></li>
            <li>Node: <M>{'\\text{node} = H(\\text{left} \\| \\text{right})'}</M></li>
            <li>Root: 최상위 node</li>
          </ul>
        </div>

        {/* Merkle Proof */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Merkle Proof 검증 (D1 포함 증명)</div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>제공: <code>[H2, H34]</code></p>
            <p>검증: <M>{'h_1 = H(D_1)'}</M> &rarr; <M>{'h_{12} = H(h_1 \\| H_2)'}</M> &rarr; <M>{'\\text{root}\' = H(h_{12} \\| H_{34})'}</M></p>
            <p><M>{'\\text{root}\' = \\text{root}'}</M> 확인</p>
          </div>
        </div>

        {/* 증명 크기 */}
        <div className="not-prose grid grid-cols-3 gap-3 text-center text-sm text-muted-foreground mb-6">
          <div className="rounded-lg border bg-card p-3">
            <div className="font-semibold text-foreground">증명 크기</div>
            <p><M>{'O(\\log n)'}</M> 해시</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="font-semibold text-foreground">1,024 leaves</div>
            <p>10 hashes</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="font-semibold text-foreground">1M leaves</div>
            <p>20 hashes</p>
          </div>
        </div>

        {/* 사용 사례 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">사용 사례</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Bitcoin SPV</div>
            <p className="text-sm text-muted-foreground">경량 클라이언트, 블록 헤더만 저장, 거래 포함 증명 <M>{'O(\\log n)'}</M></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Git</div>
            <p className="text-sm text-muted-foreground">각 파일/디렉토리가 해시, 변경 감지</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Certificate Transparency</div>
            <p className="text-sm text-muted-foreground">인증서 로그, 감사 가능</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Rollups (L2)</div>
            <p className="text-sm text-muted-foreground">거래 배치 커밋, Fraud/Validity proofs</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">IPFS / Filecoin</div>
            <p className="text-sm text-muted-foreground">Content addressing, CID = root hash</p>
          </div>
        </div>

        {/* Merkle Tree 변형 */}
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Binary Merkle</div>
            <p className="text-xs text-muted-foreground">표준</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Merkle-Patricia</div>
            <p className="text-xs text-muted-foreground">Ethereum 상태</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Verkle Tree</div>
            <p className="text-xs text-muted-foreground">Vector commitments</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Sparse Merkle</div>
            <p className="text-xs text-muted-foreground">SMT</p>
          </div>
        </div>

        {/* Ethereum State Trie */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">Ethereum State Trie</div>
          <p className="text-sm text-muted-foreground mb-1">Modified Merkle-Patricia &mdash; 각 블록 헤더에 root 포함</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">Account trie</div>
            <div className="rounded bg-muted/50 p-2">Storage trie</div>
            <div className="rounded bg-muted/50 p-2">Transaction trie</div>
            <div className="rounded bg-muted/50 p-2">Receipt trie</div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sparse Merkle Tree</h3>

        {/* SMT vs 일반 비교 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">일반 Merkle Tree</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Ordered leaves</li>
              <li><M>{'O(\\log n)'}</M> depth (<M>n</M> = leaves)</li>
              <li>추가 시 트리 재구성</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Sparse Merkle Tree</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>모든 가능한 key의 트리</li>
              <li>Fixed depth (예: 256 levels)</li>
              <li>대부분 leaves가 empty</li>
              <li>Key &rarr; position 직접 매핑</li>
            </ul>
          </div>
        </div>

        {/* SMT 구조 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">구조</div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Address space: <M>{'2^{256}'}</M> (SHA-256 key 기준) / Depth: 256 / Leaves: <M>{'2^{256}'}</M> (대부분 비어있음)</p>
            <p><code>key=0x01...</code> &rarr; path: <code>[0,0,0,0,0,0,0,1, ...]</code> (비트별로 left/right 결정)</p>
          </div>
        </div>

        {/* 효율성 + Non-inclusion */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">효율성</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Empty subtree 모두 같은 해시 (pre-computed)</li>
              <li>실제 저장 = 비어있지 않은 노드만</li>
              <li>Inclusion + non-inclusion proof</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Non-inclusion Proof</div>
            <p className="text-sm text-muted-foreground">
              "key X는 트리에 없다" &mdash; Merkle path까지 empty hash로 정확한 증명 가능. 일반 Merkle Tree에서는 불가.
            </p>
          </div>
        </div>

        {/* 장단점 + Verkle */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">장점</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>결정론적 구조</li>
              <li>Parallel construction</li>
              <li>Incremental updates</li>
              <li>Non-membership proofs</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">단점</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Merkle proof 크기 큼 (256 depths)</li>
              <li>Verkle Tree로 대체 중</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Verkle Tree (차세대)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Vector commitments (KZG)</li>
              <li>Branching factor 높음 (256-wide)</li>
              <li>Proof 훨씬 작음</li>
              <li>Ethereum Pectra 업그레이드 예정</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
