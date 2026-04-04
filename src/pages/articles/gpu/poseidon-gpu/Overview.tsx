import CodePanel from '@/components/ui/code-panel';

const structureCode = `// Poseidon 해시 구조 (HADES 전략)
//
// 상태 벡터: [s0, s1, ..., s_{t-1}]  (t = arity + 1)
//
// Full rounds (R_F/2):   S-box를 모든 원소에 적용 → MDS 곱셈
// Partial rounds (R_P):  S-box를 첫 번째 원소만 적용 → MDS 곱셈
// Full rounds (R_F/2):   S-box를 모든 원소에 적용 → MDS 곱셈
//
// 예시: arity=2 (t=3), BN254
//   R_F = 8 (앞 4 + 뒤 4), R_P = 57
//   총 라운드 = 65, S-box 호출 = 4*3 + 57*1 + 4*3 = 81회
//
// 예시: arity=11 (t=12), BN254
//   R_F = 8, R_P = 57
//   총 라운드 = 65, S-box 호출 = 4*12 + 57*1 + 4*12 = 153회
//   MDS 행렬 = 12x12 → GPU에서 144회 Fp 곱셈/라운드`;

const gpuMotivation = `// Filecoin 실링에서 Poseidon GPU 필요성
//
// 32GiB 섹터 실링 과정:
//   1) Column hashing: 11-ary Poseidon x ~8.5억 회
//   2) Tree-R 생성:    8-ary Poseidon Merkle 해시
//   3) Tree-C 생성:    8-ary Poseidon Merkle 해시
//
// CPU (32코어): Column hashing ~4시간
// GPU (RTX 3090): Column hashing ~25분  (약 10배 가속)
//
// 병렬성: 각 해시 인스턴스가 완전 독립
// → GPU의 수만 스레드에 1:1 매핑 가능`;

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
        <CodePanel title="Poseidon 구조: Full/Partial 라운드" code={structureCode} annotations={[
          { lines: [4, 7], color: 'sky', note: 'HADES 라운드 구조' },
          { lines: [9, 11], color: 'emerald', note: 'arity=2: 가벼운 설정' },
          { lines: [13, 16], color: 'amber', note: 'arity=11: 넓은 MDS 행렬' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU 가속이 필요한 이유</h3>
        <p>
          Filecoin 실링에서 32GiB 섹터 하나를 봉인하려면 약 8.5억 회의 Poseidon 해시를 수행한다.<br />
          이 단계가 전체 실링 시간의 약 80%를 차지한다.<br />
          각 해시 인스턴스는 서로 독립적이므로 GPU의 대규모 병렬성과 정확히 부합한다.
        </p>
        <CodePanel title="Filecoin 실링과 Poseidon 병렬성" code={gpuMotivation} annotations={[
          { lines: [4, 6], color: 'sky', note: '실링 3단계 해싱' },
          { lines: [8, 9], color: 'emerald', note: 'CPU vs GPU 속도 비교' },
          { lines: [11, 12], color: 'amber', note: '독립 해시 → 완벽 병렬화' },
        ]} />

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
