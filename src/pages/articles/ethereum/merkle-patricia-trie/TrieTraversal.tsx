import TrieTraversalViz from './viz/TrieTraversalViz';

export default function TrieTraversal() {
  return (
    <section id="trie-traversal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 조회 &amp; 트라이 순회</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          루트에서 시작하여 니블을 하나씩 소비하며 트라이를 순회.<br />
          Extension은 shared nibbles만큼, Branch는 1개, Leaf는 나머지 키와 매칭
        </p>
      </div>
      <div className="not-prose"><TrieTraversalViz /></div>
    </section>
  );
}
