import { CitationBlock } from '../../../../components/ui/citation';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle vs Verkle 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">증명 크기 비교 (256-ary 기준)</h3>
        <p>
          트리의 분기 수(branching factor)가 클수록 Verkle 트리의 장점이 극대화됩니다.
          다음은 256-ary 트리에서의 비교입니다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">항목</th>
                <th className="text-left py-2 pr-4">Merkle Tree</th>
                <th className="text-left py-2 pr-4">Verkle Tree (IPA)</th>
                <th className="text-left py-2">Verkle Tree (KZG)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">레벨당 증명</td>
                <td className="py-2 pr-4 font-mono text-sm">255 x 32B = 8,160B</td>
                <td className="py-2 pr-4 font-mono text-sm">~256B (log₂256 원소)</td>
                <td className="py-2 font-mono text-sm">48B (1 G₁ 원소)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">depth=2 증명</td>
                <td className="py-2 pr-4 font-mono text-sm">~16 KB</td>
                <td className="py-2 pr-4 font-mono text-sm">~512B</td>
                <td className="py-2 font-mono text-sm">~96B</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">depth=3 증명</td>
                <td className="py-2 pr-4 font-mono text-sm">~24 KB</td>
                <td className="py-2 pr-4 font-mono text-sm">~768B</td>
                <td className="py-2 font-mono text-sm">~144B</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">복잡도</td>
                <td className="py-2 pr-4 font-mono text-sm">O(k * log_k n)</td>
                <td className="py-2 pr-4 font-mono text-sm">O(log k * log_k n)</td>
                <td className="py-2 font-mono text-sm">O(log_k n)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">계산 비용 비교</h3>
        <p>
          증명 크기의 개선은 계산 비용의 트레이드오프를 수반합니다. 해시 기반의 Merkle 트리는
          단순한 해시 연산만 필요하지만, Verkle 트리는 타원곡선 연산이 요구됩니다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">연산</th>
                <th className="text-left py-2 pr-4">Merkle Tree</th>
                <th className="text-left py-2 pr-4">Verkle (IPA)</th>
                <th className="text-left py-2">Verkle (KZG)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">커밋 생성</td>
                <td className="py-2 pr-4 text-muted-foreground">O(k) 해시</td>
                <td className="py-2 pr-4 text-muted-foreground">O(k) EC 스칼라곱</td>
                <td className="py-2 text-muted-foreground">O(k) EC 스칼라곱</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">증명 생성</td>
                <td className="py-2 pr-4 text-muted-foreground">O(k) 해시 수집</td>
                <td className="py-2 pr-4 text-muted-foreground">O(k) EC 연산</td>
                <td className="py-2 text-muted-foreground">O(k) EC 연산</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium">증명 검증</td>
                <td className="py-2 pr-4 text-muted-foreground">O(k) 해시</td>
                <td className="py-2 pr-4 text-muted-foreground">O(k) EC 연산</td>
                <td className="py-2 text-muted-foreground">O(1) 페어링 (2회)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">업데이트</td>
                <td className="py-2 pr-4 text-muted-foreground">O(k) 해시 재계산</td>
                <td className="py-2 pr-4 text-muted-foreground">O(1) EC 연산</td>
                <td className="py-2 text-muted-foreground">O(1) EC 연산</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          주목할 점은 Verkle 트리의 업데이트 비용입니다. Merkle 트리에서 하나의 리프가 변경되면
          경로 위의 모든 해시를 재계산해야 하지만, 벡터 커밋먼트는 동형성(homomorphic property)
          덕분에 변경된 부분만 반영할 수 있어 O(1) 업데이트가 가능합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">보안 가정 차이</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`보안 가정 비교:

Merkle Tree:
  ├─ 해시 함수의 충돌 저항성 (collision resistance)
  ├─ SHA-256, Keccak-256, Poseidon 등
  └─ 가정이 단순하고 잘 검증됨

Verkle Tree (IPA):
  ├─ 이산 로그 문제 (Discrete Log Problem, DLP)
  ├─ 타원곡선 위에서 g^x = h → x를 찾기 어려움
  ├─ trusted setup 불필요 (transparent)
  └─ Bandersnatch / Jubjub curve 사용

Verkle Tree (KZG):
  ├─ 이산 로그 + 페어링 기반 가정
  ├─ q-SDH (Strong Diffie-Hellman) 가정
  ├─ trusted setup 필요 (Powers of Tau ceremony)
  └─ BLS12-381 curve 사용`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Post-Quantum 고려사항</h3>
        <p>
          Merkle 트리는 해시 함수만을 기반으로 하므로 양자 컴퓨터에 대해 상대적으로 안전합니다.
          Grover 알고리즘에 의해 해시 함수의 보안 수준이 절반으로 줄어들지만, 해시 출력 크기를
          늘리면 대응 가능합니다.
        </p>
        <p>
          반면 Verkle 트리는 이산 로그 문제에 기반하므로, Shor 알고리즘으로 다항 시간 내에
          깨질 수 있습니다. 이는 Verkle 트리의 가장 큰 장기적 위험 요소입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Post-Quantum 비교:

┌──────────────┬────────────────┬──────────────────────────┐
│              │ Merkle Tree    │ Verkle Tree              │
├──────────────┼────────────────┼──────────────────────────┤
│ 기반 문제     │ 해시 충돌 저항성 │ 이산 로그 문제 (DLP)     │
│ Grover 공격  │ 보안 절반 감소  │ 해당 없음                 │
│ Shor 공격    │ 영향 없음       │ 완전히 깨짐               │
│ PQ 안전성    │ ✓ (해시 크기↑)  │ ✗ (근본적 교체 필요)      │
│ 대응 방향    │ 해시 출력 확장   │ lattice 기반 VC로 전환    │
└──────────────┴────────────────┴──────────────────────────┘

향후 방향:
- Lattice 기반 벡터 커밋먼트 연구 진행 중
- Ethereum은 PQ 전환 계획을 별도 로드맵에 포함
- 현 시점에서 Verkle 트리의 실용적 이점이 PQ 위험보다 큼`}</code></pre>

        <CitationBlock source="Ethereum Verkle Tree EIP (EIP-6800)" citeKey={3} type="paper"
          href="https://eips.ethereum.org/EIPS/eip-6800">
          <p className="italic text-foreground/80">
            "This EIP introduces Verkle trees as a replacement for the current hexary Patricia tree
            used for storing Ethereum's state... enabling stateless clients through smaller proofs."
          </p>
          <p className="mt-2 text-xs">
            EIP-6800은 Ethereum의 상태 트리를 Verkle 트리로 전환하는 제안입니다.
            Pedersen 커밋먼트 기반 IPA를 사용하며, Bandersnatch 커브 위에서 구현됩니다.
            이를 통해 stateless client를 실현하고, 증명 크기를 수십 KB에서 수백 바이트로
            줄이는 것이 목표입니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
