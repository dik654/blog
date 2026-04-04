import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const sequentialCode = `// R1CS: (A * w) ⊙ (B * w) = (C * w)
// A, B, C는 희소 행렬, w는 witness 벡터, ⊙은 원소별 곱
//
// 순차 solver: 제약을 위상 정렬 순서로 하나씩 풀기
fn solve_witness_sequential(constraints: &[R1CSConstraint], public: &[Fr]) -> Vec<Fr> {
    let mut w = vec![Fr::zero(); num_wires];
    w[0] = Fr::one();                    // 상수 와이어
    w[1..=public.len()].copy_from(public); // public input 복사

    for constraint in topological_order(constraints) {
        // 각 제약: a·w * b·w = c·w
        // 미지수가 하나인 경우: 역원 계산으로 풀기
        let (known_product, unknown_idx) = analyze(constraint, &w);
        w[unknown_idx] = known_product.inverse();
    }
    w
}
// 문제: 제약 i가 제약 j의 출력에 의존하면, j를 먼저 풀어야 한다.
// → 순차 실행이 강제되는 "의존성 체인"이 존재한다.`;

const depCode = `// 의존성 그래프 예시 (산술 회로: x^3 + x + 5)
//
// Level 0:  w1 = x (public input, 의존성 없음)
// Level 1:  w2 = w1 * w1        → w1에 의존
// Level 2:  w3 = w2 * w1        → w2, w1에 의존
// Level 3:  w4 = w3 + w1 + 5    → w3, w1에 의존
//
// Critical path = Level 0 → 1 → 2 → 3 (4단계)
// 이 회로는 완전 순차적이다.
//
// 반면, 독립적인 서브회로가 많으면:
// Level 0: w1=x1, w2=x2, w3=x3  (3개 동시 가능)
// Level 1: w4=w1*w1, w5=w2*w2, w6=w3*w3  (3개 동시 가능)
// → 병렬화 여지가 생긴다.`;

export default function R1csSolve() {
  return (
    <section id="r1cs-solve" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS 제약 풀기: 순차 vs 병렬</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          R1CS는 <code>(A * w) . (B * w) = (C * w)</code> 형태의 제약 시스템이다.<br />
          A, B, C는 희소 행렬이고, w는 모든 와이어 값을 담은 벡터다.
          witness 생성은 public input이 주어졌을 때 나머지 w를 채우는 과정이다.
        </p>

        <CitationBlock source="circom -- R1CS Witness Calculator" citeKey={2} type="code"
          href="https://github.com/iden3/circom">
          <p className="text-xs">
            circom의 witnesscalc는 제약을 위상 정렬 순서로 하나씩 풀어나간다.<br />
            각 제약에서 미지수가 정확히 하나가 되도록 순서를 보장해야 한다.
          </p>
        </CitationBlock>

        <CodePanel title="순차 Witness Solver (Rust 의사코드)" code={sequentialCode}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'R1CS 정의: 행렬-벡터 곱의 원소별 곱' },
            { lines: [5, 7], color: 'emerald', note: 'public input으로 초기화' },
            { lines: [9, 13], color: 'amber', note: '위상 순서대로 미지수 풀기' },
            { lines: [16, 17], color: 'violet', note: '의존성 체인 = 순차 강제' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">의존성 그래프와 Critical Path</h3>
        <p>
          모든 제약 간의 의존성을 DAG(유향 비순환 그래프)로 표현할 수 있다.<br />
          이 DAG의 <strong>최장 경로(critical path)</strong>가 병렬화의 이론적 한계를 결정한다.<br />
          경로가 짧을수록 동시에 풀 수 있는 제약이 많아진다.
        </p>

        <CodePanel title="의존성 그래프와 레벨 구조" code={depCode}
          annotations={[
            { lines: [3, 6], color: 'sky', note: '선형 의존 = 완전 순차' },
            { lines: [8, 9], color: 'amber', note: 'Critical path = 레벨 수' },
            { lines: [11, 13], color: 'emerald', note: '독립 서브회로 = 레벨 내 병렬' },
          ]} />
      </div>
    </section>
  );
}
