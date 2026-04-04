import MerkleViz from './viz/MerkleViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Merkle({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="merkle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle 트리 & 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Sparse Merkle Tree — 2^depth개 리프 중 대부분 비어 있음
          <br />
          빈 서브트리: default_hashes로 대체 — 실제 삽입된 노드만 HashMap에 저장
          <br />
          노드 해시: parent = H(left_child, right_child) — Poseidon 2-to-1 해시
        </p>
        <p className="leading-7">
          insert: 리프 해시 H(key, value) 계산 후 루트까지 depth회 재해시
          <br />
          prove: 경로상 형제 노드를 수집 → siblings 배열 반환
          <br />
          verify: siblings + key + value만으로 루트 재구성 → 트리 없이 독립 검증
        </p>
      </div>
      <div className="not-prose mb-8">
        <MerkleViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          leaf = H(key, value)에서 key를 포함하는 이유 — second preimage 공격 방지
          <br />
          key의 비트가 경로를 결정 — get_bit, shr_bits, flip_bit0 세 함수로 인덱스 계산
          <br />
          Sparse 트리의 장점: depth=256이어도 실제 삽입된 n개 키에 대해 O(n * depth) 저장
        </p>
      </div>
    </section>
  );
}
