import EvaluationViz from './viz/EvaluationViz';

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">평가 &amp; 테스트</h2>
      <div className="not-prose mb-8"><EvaluationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">LLM Harness 평가 방법</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LLM Evaluation Strategies:

// 1. Reference-based Metrics:
// - compare to ground truth
// - BLEU, ROUGE, METEOR
// - exact match
// - semantic similarity
//
// Example (accuracy):
// correct = 0
// for test_case in test_set:
//     response = harness.run(test_case.input)
//     if response == test_case.expected:
//         correct += 1
// accuracy = correct / len(test_set)

// 2. Reference-free Metrics:
// - no ground truth needed
// - perplexity
// - relevance scores
// - coherence measures
//
// Example:
// - fluency (readability)
// - relevance (to query)
// - groundedness (cites sources)

// 3. LLM-as-Judge:
// - use another LLM to evaluate
// - rubric-based scoring
// - scalable
// - Anthropic, OpenAI popular approach
//
// Example:
// judge_prompt = f'''
// Score this response 1-5:
// Query: {query}
// Response: {response}
// Criteria: helpfulness, accuracy, safety
// '''
// score = judge_llm.complete(judge_prompt)

// 4. Unit Tests:
// - specific input/output pairs
// - regression tests
// - deterministic tests
//
// def test_greeting():
//     response = harness.run("Hi")
//     assert "hello" in response.lower()
//
// def test_refusal():
//     response = harness.run("dangerous request")
//     assert "cannot" in response.lower()

// 5. Eval Frameworks:
//
// OpenAI Evals:
// - public benchmarks
// - custom test cases
// - standardized reports
//
// Anthropic Claude Evals:
// - internal evaluation
// - safety metrics
// - helpfulness scores
//
// DeepEval:
// - open-source
// - Pytest integration
// - LLM-based metrics
//
// Ragas:
// - RAG-specific eval
// - context relevance
// - faithfulness
// - answer relevance

// 6. A/B Testing:
// - compare two harnesses
// - real user traffic
// - statistical significance
// - iterate based on results
//
// def ab_test(user_input):
//     if random() < 0.5:
//         variant = "A"
//         response = harness_a.run(user_input)
//     else:
//         variant = "B"
//         response = harness_b.run(user_input)
//     log(variant, response, user_feedback)

// 7. Red Teaming:
// - adversarial testing
// - jailbreak attempts
// - edge cases
// - security vulnerabilities

// 8. Production Metrics:
// - latency (p50, p99)
// - cost per request
// - error rate
// - user satisfaction
// - retention

// Evaluation pipeline:

// 1. Offline:
//    - unit tests
//    - benchmark suite
//    - regression tests
//
// 2. Pre-production:
//    - red team testing
//    - load testing
//    - LLM-as-judge
//
// 3. Production:
//    - A/B testing
//    - user metrics
//    - monitoring
//    - incident response

// Metrics to track:
// - accuracy (task-specific)
// - latency (response time)
// - cost ($/request)
// - safety (harmful content rate)
// - fairness (bias scores)
// - robustness (adversarial success rate)`}
        </pre>
        <p className="leading-7">
          Evaluation: <strong>metrics + LLM-as-judge + unit tests + A/B</strong>.<br />
          frameworks: OpenAI Evals, DeepEval, Ragas (RAG).<br />
          production metrics: latency + cost + safety + retention.
        </p>
      </div>
    </section>
  );
}
