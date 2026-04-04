import CommitViz from './viz/CommitViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Commitment({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">커밋먼트 스킴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          C = H(value, randomness) — Poseidon 한 줄로 커밋먼트 완성
          <br />
          Hiding: randomness가 균일 랜덤이면 C에서 value 역산 불가 (pre-image resistance)
          <br />
          Binding: 같은 C에 다른 (value, randomness) 쌍을 찾는 것 = collision 찾기
        </p>
        <p className="leading-7">
          Pedersen 커밋먼트(C = v*G + r*H)와 비교 — 동형성(homomorphism) 불필요 시 해시 기반이 유리
          <br />
          Pedersen: 스칼라 곱 2회 → 수천 R1CS 제약 / Poseidon: ~250 제약
          <br />
          Mixer, Semaphore 등 privacy 응용에서는 해시 기반 커밋먼트가 표준
        </p>
      </div>
      <div className="not-prose mb-8">
        <CommitViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          commit과 verify가 각각 1줄 — Poseidon을 재사용하므로 별도 구현 불필요
          <br />
          MerkleProofCircuit에서 leaf = H(key, value)가 사실상 커밋먼트 — 같은 패턴 재활용
          <br />
          회로 내 커밋먼트 검증: Poseidon circuit(~634 제약) + equality(1 제약) = 635개
        </p>
      </div>
    </section>
  );
}
