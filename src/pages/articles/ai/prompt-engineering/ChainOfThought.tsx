import CoTViz from './viz/CoTViz';

export default function ChainOfThought() {
  return (
    <section id="chain-of-thought" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Chain-of-Thought & 추론 유도</h2>
      <div className="not-prose mb-8"><CoTViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Chain-of-Thought(CoT)</strong> — LLM이 최종 답 전에 중간 추론 과정을 생성하도록 유도하는 기법<br />
          산술·논리·상식 추론 등 복잡한 문제에서 정확도를 크게 향상
        </p>
        <p>
          Zero-shot CoT — "Let's think step by step" 한 줄 추가만으로 추론 유도 (Kojima et al., 2022)<br />
          Few-shot CoT — 풀이 과정이 포함된 예시 제공으로 더 안정적인 추론<br />
          Self-Consistency — 동일 질문을 여러 번 실행, 다수결로 최종 답 선택
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CoT 종류별 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CoT 변형들 (2022~2024)
//
// 1. Standard Prompting (baseline):
//    Q: Tom has 3 apples. He buys 2 more. How many?
//    A: 5 apples.
//
// 2. Zero-shot CoT (Kojima 2022):
//    Q: Tom has 3 apples. He buys 2 more. How many?
//    A: Let's think step by step.
//       Tom starts with 3 apples. He buys 2 more.
//       So 3 + 2 = 5 apples.
//       The answer is 5.
//
// 3. Few-shot CoT (Wei 2022):
//    Q: Alice has 5 pens. She gives 2 to Bob. How many left?
//    A: Alice starts with 5. She gives 2 away.
//       5 - 2 = 3. So Alice has 3 pens.
//
//    Q: Tom has 3 apples. He buys 2 more. How many?
//    A: Tom starts with 3 apples. He buys 2 more.
//       3 + 2 = 5. So Tom has 5 apples.
//
// 4. Self-Consistency (Wang 2022):
//    - 같은 prompt로 N번 샘플링 (temp=0.7)
//    - 각 reasoning path의 최종 답 추출
//    - 다수결로 최종 답 결정
//    - 10% 이상 정확도 향상 (수학 문제)
//
// 5. Tree of Thoughts (Yao 2023):
//    - 여러 reasoning path를 트리로 탐색
//    - 중간에 평가·가지치기
//    - BFS/DFS로 최적 경로 찾기
//
// 6. ReAct (Yao 2022):
//    - Reasoning + Acting 인터리브
//    - Thought → Action → Observation → ...
//    - 도구 사용과 결합

// 성능 비교 (GSM8K 수학 문제):
//   Standard:         17.9%
//   Few-shot CoT:     56.9%  (+39 points!)
//   Self-Consistency: 74.4%
//   ToT:              76%+
//
// 모델 크기별 효과:
//   < 60B: CoT 효과 미미
//   ≥ 60B: CoT로 크게 향상
//   "emergent ability"`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">CoT 효과의 이론적 설명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CoT가 왜 효과적인가?
//
// 1. Compute Allocation
//    - 복잡한 문제 = 많은 "생각" 필요
//    - CoT가 intermediate token 생성
//    - 각 token = model forward pass
//    - "더 생각할 시간" 제공
//
// 2. Decomposition
//    - 큰 문제 → 작은 단계
//    - 각 단계는 모델이 잘 아는 패턴
//    - 조합적 문제 해결
//
// 3. Attention Focus
//    - 중간 답안이 다음 attention에 기여
//    - Working memory 역할
//    - 에러 전파 줄임
//
// 4. Training Data Alignment
//    - 인간 reasoning 텍스트에서 학습
//    - CoT가 분포 내(in-distribution)
//    - natural language reasoning과 유사
//
// 5. Emergent behavior
//    - 큰 모델에서만 나타남
//    - 작은 모델: 오히려 성능 저하
//    - 임계점 존재

// 한계:
//   - 잘못된 reasoning도 가능 (confident errors)
//   - 계산 오류 여전
//   - 외부 지식 부족 시 hallucination
//   - 토큰 비용 증가 (10배+)
//
// 보완 기법:
//   - CoT + Calculator/Code interpreter
//   - Self-Verify (최종 검증 단계)
//   - Retrieval-Augmented Generation (RAG)
//   - Program-Aided Language Models (PAL)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>"Let's think step by step"</strong> 마법의 문구 — GSM8K 3배 성능.<br />
          요약 2: <strong>Self-Consistency</strong>는 다중 샘플링 다수결 — 추가 10%+.<br />
          요약 3: CoT는 <strong>큰 모델에서만 효과</strong> — 60B+ 임계점.
        </p>
      </div>
    </section>
  );
}
