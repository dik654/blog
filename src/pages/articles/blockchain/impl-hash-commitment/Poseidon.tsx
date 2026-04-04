import PoseidonViz from './viz/PoseidonViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Poseidon({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="poseidon" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poseidon 해시 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          상태 벡터: [Fr; 3] — capacity 1개 + rate 2개
          <br />
          입력은 rate 슬롯에 배치, capacity는 도메인 분리용(항상 0)
          <br />
          Permutation 65라운드 후 state[1]을 해시 출력으로 반환
        </p>
        <p className="leading-7">
          각 라운드: ARK(라운드 상수 덧셈) → S-box(x→x⁵) → MDS(행렬 곱)
          <br />
          ARK: 대칭성 파괴 — 상수 없이는 0 입력에 대해 항상 0 출력
          <br />
          S-box: 유일한 비선형 연산 — x⁵는 Fr 위에서 역함수가 존재하는 순열
          <br />
          MDS: 최대 확산 — 한 원소의 변화가 모든 원소로 전파
        </p>
      </div>
      <div className="not-prose mb-8">
        <PoseidonViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          S-box에서 x⁵ = x.square().square() * x — square 2회 + mul 1회 = 3회로 최소화
          <br />
          MDS 행렬을 [[2,1,1],[1,2,1],[1,1,2]]로 고정 — Cauchy matrix 대신 단순한 형태
          <br />
          PoseidonParams를 캐싱하면 195개 라운드 상수 재생성 방지 — poseidon_hash_with_params 패턴
        </p>
      </div>
    </section>
  );
}
