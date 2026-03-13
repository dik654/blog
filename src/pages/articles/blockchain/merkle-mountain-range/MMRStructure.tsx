import { CitationBlock } from '../../../../components/ui/citation';

export default function MMRStructure() {
  return (
    <section id="mmr-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MMR 구조와 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Append (추가)</h3>
        <p>
          새로운 리프를 MMR에 추가하는 연산은 다음과 같이 동작합니다. 새 리프를 오른쪽 끝에 배치한 후,
          동일 높이의 인접 피크가 존재하면 두 노드의 해시를 합쳐 상위 노드를 생성합니다. 이 병합 과정은
          더 이상 동일 높이의 인접 피크가 없을 때까지 재귀적으로 반복됩니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`fn mmr_append(mmr: &mut MMR, leaf: Hash) -> usize {
    let mut pos = mmr.size;
    let mut height = 0;
    let mut current = leaf;

    // 현재 높이에서 왼쪽 형제가 존재하면 병합
    while has_left_sibling_at_height(mmr, pos, height) {
        let left_sibling = mmr.get_node(pos - sibling_offset(height));
        current = hash(left_sibling, current);
        height += 1;
        pos += 1;
    }

    mmr.push(current);
    mmr.size = pos + 1;
    pos
}

// 시간 복잡도: O(log n) — 최대 log₂(n) 높이만큼 병합`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Peak Bagging (피크 결합)</h3>
        <p>
          MMR의 루트 해시는 모든 피크(peak)의 해시를 하나로 결합하여 생성합니다. 피크란 더 이상
          병합되지 않은 각 서브트리의 최상위 노드를 의미합니다. n개의 원소가 있는 MMR의 피크 개수는
          n의 이진 표현에서 1인 비트의 개수와 같습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`fn mmr_root(mmr: &MMR) -> Hash {
    let peaks = mmr.get_peaks();  // 오른쪽에서 왼쪽으로 수집

    // 모든 피크를 오른쪽부터 접어서(fold) 하나의 루트로
    peaks.iter().rev().fold(Hash::default(), |acc, peak| {
        if acc == Hash::default() {
            *peak
        } else {
            hash(*peak, acc)
        }
    })
}

// 피크 개수: popcount(n) — n의 이진 표현에서 1의 개수
// 예: n=11 (1011₂) → 피크 3개 (높이 3, 1, 0)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Membership Proof (포함 증명)</h3>
        <p>
          특정 리프가 MMR에 포함되어 있음을 증명하기 위해서는 두 가지 요소가 필요합니다:
          (1) 해당 리프에서 피크까지의 경로에 있는 형제 노드 해시들, 그리고
          (2) 나머지 피크들의 해시입니다. 검증자는 이를 통해 루트를 재구성할 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`struct MMRProof {
    leaf_index: usize,
    siblings: Vec<Hash>,   // 리프 → 피크 경로의 형제 노드들
    peaks: Vec<Hash>,      // 증명 대상이 아닌 나머지 피크들
}

fn verify_mmr_proof(
    root: Hash,
    leaf: Hash,
    proof: &MMRProof
) -> bool {
    // 1단계: 형제 노드를 따라 피크까지 올라감
    let mut current = leaf;
    for sibling in &proof.siblings {
        current = if is_left_child(proof.leaf_index) {
            hash(current, *sibling)
        } else {
            hash(*sibling, current)
        };
    }

    // 2단계: 피크 bagging으로 루트 재구성
    let computed_root = bag_peaks(current, &proof.peaks);
    computed_root == root
}

// 증명 크기: O(log n) 해시 — 경로 형제 + 피크들`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">복잡도 요약</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">연산</th>
                <th className="text-left py-2 pr-4">시간 복잡도</th>
                <th className="text-left py-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">Append</td>
                <td className="py-2 pr-4 font-mono text-sm">O(log n)</td>
                <td className="py-2 text-muted-foreground">최대 log₂(n) 높이만큼 병합</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">Root</td>
                <td className="py-2 pr-4 font-mono text-sm">O(log n)</td>
                <td className="py-2 text-muted-foreground">피크 개수 = popcount(n)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">Proof 생성</td>
                <td className="py-2 pr-4 font-mono text-sm">O(log n)</td>
                <td className="py-2 text-muted-foreground">경로 형제 + 피크 해시</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Proof 검증</td>
                <td className="py-2 pr-4 font-mono text-sm">O(log n)</td>
                <td className="py-2 text-muted-foreground">리프 → 피크 → 루트 재구성</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CitationBlock source="Peter Todd — Merkle Mountain Range 제안" citeKey={1} type="paper"
          href="https://github.com/opentimestamps/opentimestamps-server/blob/master/doc/merkle-mountain-range.md">
          <p className="italic text-foreground/80">
            "A Merkle Mountain Range (MMR) is a structure for efficiently committing to a list of elements,
            allowing new elements to be appended, and proofs of inclusion to be created."
          </p>
          <p className="mt-2 text-xs">
            Peter Todd는 OpenTimestamps 프로젝트에서 MMR을 제안하며, append-only 데이터 구조에
            최적화된 머클 트리 변형의 필요성을 설명했습니다.
          </p>
        </CitationBlock>

        <CitationBlock source="Grin/Mimblewimble — MMR 기반 UTXO 관리" citeKey={2} type="code"
          href="https://github.com/mimblewimble/grin/blob/master/doc/mmr.md">
          <p className="italic text-foreground/80">
            "Grin uses MMRs extensively to store and manage UTXOs, range proofs, and kernels.
            The append-only nature of MMR aligns perfectly with the blockchain's growth model."
          </p>
          <p className="mt-2 text-xs">
            Grin은 MMR을 UTXO, 범위 증명, 커널 등의 핵심 데이터 관리에 활용합니다.
            MMR의 추가 전용 특성은 블록체인의 성장 모델과 완벽하게 부합합니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
