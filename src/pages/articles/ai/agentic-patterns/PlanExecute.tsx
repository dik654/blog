import PlanExecuteViz from './viz/PlanExecuteViz';

export default function PlanExecute() {
  return (
    <section id="plan-execute" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Plan-and-Execute &amp; Reflection</h2>
      <div className="not-prose mb-8"><PlanExecuteViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Plan-and-Execute — <strong>planning + execution 분리</strong>.<br />
          Reflection — 실행 결과 자가 비평 + 수정.<br />
          ReAct의 verbose 문제 해결 + 복잡한 작업 처리.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Plan-and-Execute 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Plan-and-Execute Pattern:

// Architecture:
// 1. Planner LLM: creates step-by-step plan
// 2. Executor: runs each step
// 3. Optional replan on failure

// Flow:
// Step 1: Plan
// planner.generate(task) → [step1, step2, step3, ...]
//
// Step 2: Execute sequentially
// for step in plan:
//     result = executor.run(step)
//     if failed:
//         plan = replan(task, history)
//
// Step 3: Return final answer

// Example:
// Task: "Build a REST API for todo list"
//
// Plan:
// 1. Create project structure
// 2. Define data model (Todo)
// 3. Implement CRUD endpoints
// 4. Add validation
// 5. Write tests
// 6. Document API
//
// Execute:
// → step 1: mkdir + init files
// → step 2: write Todo class
// → step 3: implement endpoints
// → step 4: add pydantic validation
// → step 5: pytest cases
// → step 6: OpenAPI spec

// vs ReAct:
// ReAct: thought-action each turn
// Plan-Execute: plan once, execute many

// Benefits:
// - less LLM calls (planning once)
// - clear progress tracking
// - better for complex tasks
// - parallelizable execution

// Limitations:
// - rigid initial plan
// - doesn't adapt mid-execution
// - needs replan mechanism

// Reflection Pattern:
//
// Architecture:
// 1. Actor: produces initial output
// 2. Critic: evaluates output
// 3. Refiner: improves based on critique
//
// Flow:
// output = actor(task)
// for _ in range(max_iterations):
//     critique = critic.evaluate(output)
//     if critique == "good enough":
//         break
//     output = refiner.improve(output, critique)
//
// return output

// Reflection benefits:
// - self-correction
// - better quality outputs
// - catches errors
// - iterative refinement

// Examples:
// - code review (critique buggy code)
// - essay editing
// - answer refinement
// - planning improvement

// Combined patterns:
// - Plan-Execute + Reflection
// - plan → execute → reflect → replan
// - powerful but expensive

// Production examples:
// - LangGraph StateGraph
// - CrewAI (multi-agent + reflection)
// - AutoGen (reflection + feedback)
// - Claude Code extended thinking`}
        </pre>
        <p className="leading-7">
          Plan-Execute: <strong>plan once, execute many</strong> — less LLM calls.<br />
          Reflection: actor → critic → refiner loop.<br />
          combined: plan + execute + reflect → highest quality.
        </p>
      </div>
    </section>
  );
}
