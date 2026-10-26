import ExplainedFormula from "@/components/ui/explained-formula";
import LangGraphViz from "./viz/LangGraphViz";

export default function LangGraph() {
  return <section id="langgraph" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">LangGraph의 병렬 상태 합치기</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            현재 Graph API는 상태(state)·노드(node)·간선(edge)으로 실행 흐름을 구성합니다. 노드는 바뀐 값만 반환합니다. 상태 항목마다
            지정한 리듀서(reducer)가 기존 값과 새 값을 합칩니다.
          </p><p>
            덮어쓰기, 목록 추가, 집합 합치기, 단일 작성자는 결과가 서로 다릅니다. 여러 분기가 같은 상태 항목에 쓰기 전에 어떤 방식을
            사용할지 정해야 합니다.
          </p><p>
            분기를 실행할 때는 작업 ID마다 <code>pending·success·timeout·failed</code> 상태와 결과 식별값을 저장합니다. 작업 ID를 키로
            쓰는 집합 리듀서는 재시도로 같은 결과가 다시 와도 한 번만 반영합니다. 같은 결과 ID에 서로 다른 식별값이 오면 충돌로 처리합니다.
          </p><p>
            시간 초과와 재시도 횟수를 모두 사용한 뒤에는 필수 결과가 전부 왔는지 확인합니다. 이어서 전체 검증기를 통과한 경우에만 결과를
            합치고, 각 상태 변화를 추적 기록에 남깁니다.
          </p></div><ExplainedFormula question="병렬 branch의 실행 순서가 달라도 같은 join 결과를 얻으려면 reducer에 어떤 성질이 필요할까요?" idea={<>재시도와 도착 순서 변화에 강한 set-like merge라면 결합법칙·교환법칙·멱등성을 확인합니다. 모든 state에 무조건 필요한 법칙은 아니지만 unordered parallel join의 좋은 안전 조건입니다.</>} formula={String.raw`\begin{aligned}
\rho(\rho(x,a),b)&=\rho(x,\rho(a,b))\\
\rho(x,a)&=\rho(a,x)\\
\rho(\rho(x,a),a)&=\rho(x,a)
\end{aligned}`}
  annotatedFormula={String.raw`\begin{aligned}
\underbrace{\rho(\rho(x,a),b)}_{\text{a 먼저 합친 뒤 b}}&=\underbrace{\rho(x,\rho(a,b))}_{\text{a·b 묶어 한 번에}}\\
\underbrace{\rho(x,a)}_{\text{x에 a 도착}}&=\underbrace{\rho(a,x)}_{\text{순서 뒤바뀜}}\\
\underbrace{\rho(\rho(x,a),a)}_{\text{같은 a가 retry로 재도착}}&=\rho(x,a)
\end{aligned}`}
  operations={[
    { expression: String.raw`\rho(x,\rho(a,b))`, annotation: ["결합법칙: branch 결과를 어떻게", "묶어 합쳐도 join state가 같습니다"] },
    { expression: String.raw`\rho(a,x)`, annotation: ["교환법칙: worker 도착 순서가", "바뀌어도 결과가 같습니다"] },
    { expression: String.raw`\rho(\rho(x,a),a)`, annotation: ["멱등성: 같은 receipt가 두 번 와도", "set union은 한 번만 반영", "list append라면 중복이 생깁니다"] },
  ]} terms={[{symbol:"rho",name:"reducer",description:"현재 channel 값과 branch update를 새 state로 합치는 함수입니다."},{symbol:"x",name:"accumulated state",description:"Join 전까지 저장된 기존 channel 값입니다."},{symbol:"a,b",name:"parallel updates",description:"같은 super-step 또는 retry에서 들어온 worker 결과입니다."}]} assumptions={["순서가 의미 있는 log는 commutative set이 아니라 stable event ID와 ordered reducer를 사용합니다.","같은 artifact ID의 내용 충돌은 조용히 dedup하지 않고 conflict로 올립니다.","Reducer property를 unit/property test하고 framework default overwrite를 그대로 가정하지 않습니다."]} interpretation="Set union은 같은 receipt가 retry로 두 번 와도 결과가 같지만 list append는 중복됩니다. Ordered history가 필요하면 event ID·sequence와 dedup 규칙을 따로 둡니다."/><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Checkpointer는 정해진 경계의 상태를 저장합니다. 노드를 실행하는 도중의 값까지 저장하지는 않습니다. 따라서 중단 뒤 다시 시작하면
            해당 노드가 처음부터 실행될 수 있습니다.
          </p><p>
            데이터베이스 행과 outbox 이벤트에는 같은 작업 키를 둡니다. 두 값을 한 트랜잭션에 쓰고 작업 키에 고유 제약을 걸면 같은 실행이
            두 번 반영되는 일을 막을 수 있습니다. 외부 전송을 마친 뒤에는 제공자가 돌려준 처리 결과도 저장합니다.
          </p><p>
            커밋과 메시지 발송의 앞뒤에서 일부러 프로세스를 중단한 뒤 두 번 재개합니다. 그래도 데이터베이스 행과 외부 동작이 한 번만
            남는지 확인해야 합니다. 외부 동작을 되돌릴 수 없고 제공자가 중복 방지를 지원하지 않는다면 사람 승인이나 보상 절차로 넘깁니다.
          </p></div><div className="not-prose my-8"><LangGraphViz /></div><div id="standard-langgraph" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">공식 문서 · LangGraph 1.2.17 기준</p><p className="mt-2 text-sm leading-6 text-muted-foreground">2026년 10월 26일 공식 Graph API와 릴리스를 확인했습니다. 문서는 state·node·edge, key별 reducer, 병렬 super-step, node 재실행과 idempotency를 설명합니다. 이 글의 join 수식은 구현 원칙을 명시한 계약이며 LangGraph 자체의 수학 정리가 아닙니다.</p><div className="mt-3 flex flex-wrap gap-4 text-sm font-medium"><a className="text-primary hover:underline" href="https://docs.langchain.com/oss/python/langgraph/graph-api" target="_blank" rel="noreferrer">Graph API 문서</a><a className="text-primary hover:underline" href="https://github.com/langchain-ai/langgraph/releases/tag/1.2.17" target="_blank" rel="noreferrer">1.2.17 릴리스</a></div></div></section>;
}
