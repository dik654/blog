import PatternsViz from './viz/PatternsViz';

export default function Patterns() {
  return (
    <section id="patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전 패턴</h2>
      <div className="not-prose mb-8"><PatternsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Harness Patterns</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 실전 Harness 패턴:

// 1. RAG (Retrieval-Augmented Generation):
// - user query
// - retrieve relevant docs (vector DB)
// - inject into context
// - LLM answers with context
//
// Components:
// - embedding model
// - vector database
// - retriever
// - prompt template
//
// Example:
// def rag_query(question):
//     docs = vector_db.search(question, k=5)
//     context = format_docs(docs)
//     prompt = f"Context: {context}\\nQ: {question}\\nA:"
//     return llm.complete(prompt)

// 2. Agent Loop (ReAct):
// - goal-oriented
// - thought + action + observation
// - iterative execution
// - tool-using
//
// Pattern:
// while not done:
//     thought = llm.think(task)
//     action = llm.decide_action(thought)
//     observation = execute(action)
//     task_done = check_completion(observation)
//
// return result

// 3. Guarded Chain:
// - sequential LLM calls
// - validation between steps
// - rollback on failure
//
// user → LLM1 → validate → LLM2 → validate → output
//
// Fails fast, prevents error propagation

// 4. Multi-Shot Consensus:
// - call LLM N times
// - gather responses
// - majority vote or synthesis
//
// responses = [llm.complete(prompt) for _ in range(5)]
// final = majority_vote(responses)
//
// Reduces hallucinations

// 5. Critic Loop:
// - generate response
// - self-critique
// - revise
// - repeat until good
//
// output = llm.generate(task)
// for _ in range(3):
//     critique = llm.critique(output)
//     if is_good(critique):
//         break
//     output = llm.revise(output, critique)

// 6. Few-Shot Learning:
// - include examples in prompt
// - LLM learns pattern
// - uses on new input
//
// Prompt:
// Example 1: [input] → [output]
// Example 2: [input] → [output]
// Example 3: [input] → [output]
// New: [user input] → ?

// 7. Structured Output:
// - force JSON/XML response
// - schema validation
// - type safety
//
// Using Pydantic (instructor library):
// class Answer(BaseModel):
//     answer: str
//     confidence: float
//     sources: list[str]
//
// response = llm.complete(
//     prompt,
//     response_model=Answer
// )

// 8. Streaming + Interrupt:
// - LLM streams tokens
// - check intermediate output
// - interrupt if bad path
// - save tokens
//
// for token in llm.stream(prompt):
//     partial += token
//     if is_going_wrong(partial):
//         break

// 9. Tool-Augmented:
// - LLM calls tools as needed
// - tool results feed back
// - iterative refinement
//
// response = agent.run(
//     task=task,
//     tools=[search, calculator, code_exec]
// )

// 10. Human-in-the-Loop:
// - LLM proposes
// - human approves/rejects
// - feedback improves future
//
// proposal = llm.generate(task)
// user_decision = get_user_input(proposal)
// if user_decision == "approve":
//     execute(proposal)
// else:
//     llm.learn(user_decision)

// Pattern selection:
// - RAG: knowledge-grounded
// - Agent: complex tasks
// - Critic: quality
// - Consensus: reliability
// - Few-shot: pattern matching
// - Structured: data extraction`}
        </pre>
        <p className="leading-7">
          10 patterns: <strong>RAG, Agent, Guarded Chain, Consensus, Critic, Few-shot, Structured, Streaming, Tool-use, HITL</strong>.<br />
          pattern selection depends on task characteristics.<br />
          RAG + Agent + Structured 결합 (production grade).
        </p>
      </div>
    </section>
  );
}
