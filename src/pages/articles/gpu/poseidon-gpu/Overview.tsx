import PoseidonStructureViz from './viz/PoseidonStructureViz';
import FilecoinSealingViz from './viz/FilecoinSealingViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poseidon과 GPU 가속</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Poseidon</strong>은 ZK 증명 시스템에 최적화된 해시 함수다.<br />
          SHA-256과 달리 유한체(Fp) 연산만 사용하므로 R1CS 제약 수가 수백 배 적다.<br />
          HADES 전략을 따라 Full round와 Partial round를 교차 배치하여
          보안성과 연산 효율의 균형을 잡는다.
        </p>
        <PoseidonStructureViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU 가속이 필요한 이유</h3>
        <p>
          Filecoin 실링에서 32GiB 섹터 하나를 봉인하려면 약 8.5억 회의 Poseidon 해시를 수행한다.<br />
          이 단계가 전체 실링 시간의 약 80%를 차지한다.<br />
          각 해시 인스턴스는 서로 독립적이므로 GPU의 대규모 병렬성과 정확히 부합한다.
        </p>
        <FilecoinSealingViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Arity와 상태 너비</h3>
        <p>
          Arity는 해시 입력 수를 의미한다. 상태 너비 t = arity + 1이다.
          arity가 높을수록 MDS 행렬이 커져 라운드당 연산이 증가하지만,
          Merkle 트리에서 한 번에 더 많은 자식을 묶을 수 있어 트리 깊이가 줄어든다.<br />
          Filecoin은 arity 2, 4, 8, 11을 용도별로 구분하여 사용한다.
        </p>
      </div>
    </section>
  );
}
